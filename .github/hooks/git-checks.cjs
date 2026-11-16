'use strict';

const { spawnSync } = require('node:child_process');
const guard = require('../tools/devops-guard.cjs');

const SUBJECT = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]+\))?!?: \S.*/;
const EXEMPT = /^(Merge |Revert |fixup!|squash!)/;
// Only literal arguments shared by PowerShell and POSIX shells are validated.
const MESSAGE = /(?:-m|--message) (?:"([^"$`\\\r\n]*)"|'([^'\r\n]*)')/g;
const PUSH = /^git push ([A-Za-z0-9_][A-Za-z0-9_.-]*) ([A-Za-z0-9_][A-Za-z0-9_./#-]*)$/;

function git(cwd, args, expectedStatuses = [0]) {
  const result = spawnSync('git', ['--no-pager', ...args], {
    cwd, encoding: 'utf8', timeout: 2000, maxBuffer: 1024 * 1024,
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  });
  if (result.error || !expectedStatuses.includes(result.status)) {
    throw new Error(`Git check failed (${args[0]}): ${result.error?.message
      ?? (result.stderr.trim() || `exit ${result.status}`)}`);
  }
  return { status: result.status, text: result.stdout.trim() };
}

function commitSubject(command) {
  if (!command.startsWith('git commit ') || /[\r\n\0]/.test(command)) return undefined;
  const argumentsText = command.slice('git commit '.length);
  MESSAGE.lastIndex = 0;
  const messages = [...argumentsText.matchAll(MESSAGE)];
  if (!messages.length) return undefined;
  if (messages.map((message) => message[0]).join(' ') !== argumentsText) return undefined;
  return messages[0][1] ?? messages[0][2];
}

function traceability(cwd, remote, branch) {
  const mode = git(cwd, ['config', '--get', 'devworkspacekit.traceability'], [0, 1]).text;
  if (['off', 'false', '0'].includes(mode)) return '';
  const remotes = git(cwd, ['remote']).text.split('\n').filter(Boolean);
  const urls = remotes.flatMap((name) => [
    git(cwd, ['remote', 'get-url', '--all', name]).text,
    git(cwd, ['remote', 'get-url', '--push', name]).text,
  ]);
  if (!['on', 'true', 'force', '1'].includes(mode)
      && !urls.some((url) => /dev\.azure\.com|visualstudio\.com/.test(url))) return '';
  const tracking = `refs/remotes/${remote}/${branch}`;
  const exists = git(cwd, ['show-ref', '--verify', '--quiet', tracking], [0, 1]).status === 0;
  const subjects = git(cwd, exists
    ? ['log', '--format=%s', '--max-count=100', `${tracking}..HEAD`]
    : ['log', '--format=%s', '--max-count=100', 'HEAD', '--not', `--remotes=${remote}`]).text;
  if (/AB#[0-9]+/.test(`${branch}\n${subjects}`)) return '';
  return 'Traceability advisory (warn-only): no AB#<work item id> in the current branch or up to 100 candidate commit subjects. Add a verified AB#<id>, or set devworkspacekit.traceability off to silence this advisory. Remote-tracking refs may be stale; no fetch was performed.';
}

function evaluate(event) {
  const normalized = guard.normalize(event);
  if (normalized.error) throw new Error(normalized.error);
  const baseline = guard.classify(normalized.operation);
  if (normalized.operation.kind !== 'shell' || baseline.decision === 'deny') return baseline;
  const command = normalized.operation.command.trim();
  const subject = commitSubject(command);
  const push = /[\r\n\0]/.test(command) ? null : command.match(PUSH);
  if (subject === undefined && !push) return baseline;
  const args = event.toolArgs ?? event.tool_input ?? event.tool_args;
  if (args && (args.cwd || args.directory || args.shellId)) {
    return { decision: 'ask', reason: 'Tool-specific working directory or reused shell: approve the repository and exact Git command; checks cannot validate its execution context.' };
  }
  if (typeof event.cwd !== 'string' || !event.cwd.trim()) {
    throw new Error('Missing event working directory for Git checks.');
  }
  if (subject !== undefined) {
    try {
      const check = git(event.cwd, ['diff', '--cached', '--check'], [0, 1, 2]);
      if (check.status !== 0) {
        return { decision: 'ask', reason: `Approval requested: staged whitespace errors or conflict markers were found.\n${check.text}` };
      }
      if (!SUBJECT.test(subject) && !EXEMPT.test(subject)) {
        return { decision: 'ask', reason: 'Approval requested: commit subject does not follow Conventional Commits: <type>(<optional scope>)<!>: <description>. Types: feat fix docs style refactor perf test build ci chore revert.' };
      }
      return { decision: 'ask', reason: 'Staged whitespace and Conventional Commit checks passed. Approve the exact commit; the hook does not change files or authorize the mutation automatically.' };
    } catch (error) {
      return { decision: 'ask', reason: `Commit validation could not be completed; review the repository and exact command before approving. ${error.message}` };
    }
  }
  try {
    const [, remote, requestedBranch] = push;
    const branch = git(event.cwd, ['symbolic-ref', '--quiet', '--short', 'HEAD'], [0, 1]).text;
    const remotes = git(event.cwd, ['remote']).text.split('\n').filter(Boolean);
    if (!branch || (requestedBranch !== branch && requestedBranch !== 'HEAD') || !remotes.includes(remote)) {
      return { decision: 'ask', reason: 'Push target cannot be validated: approve the exact repository, remote and ref updates.' };
    }
    const advisory = traceability(event.cwd, remote, branch);
    return { decision: 'ask', reason: ['Push target checks passed. Approve the exact push; no push or fetch was performed.', advisory].filter(Boolean).join('\n') };
  } catch (error) {
    return { decision: 'ask', reason: `Push validation could not be completed; review the repository, remote and ref updates before approving. ${error.message}` };
  }
}

function main() {
  try {
    if (process.argv[2] === 'session-start') {
      process.stdout.write(JSON.stringify({
        additionalContext: 'Agent-only Git checks: use literal Conventional Commits subjects and check staged whitespace before committing. For documentation changes, run python -m mkdocs build --strict from 1-mkdocs before committing; this hook does not run the build. Request approval for commits, pushes and ambiguous commands. AB# traceability is warn-only. Manual terminal commands and external clients are not intercepted. Run project checks explicitly before pushing and keep required gates in CI.',
      }));
      return;
    }
    if (process.argv[2] !== 'pre-tool-use') throw new Error('Unsupported hook mode.');
    const result = evaluate(JSON.parse(guard.readStdin()));
    if (result.decision === 'deny' || result.reason.includes('Traceability advisory')) {
      process.stderr.write(`${result.reason}\n`);
    }
    process.stdout.write(JSON.stringify(guard.buildResponse(result)));
  } catch (error) {
    const reason = `Agent hook failed: ${error.message}`;
    process.stderr.write(`${reason}\n`);
    process.stdout.write(JSON.stringify(guard.buildResponse({ decision: 'deny', reason })));
  }
}

if (require.main === module) main();

module.exports = { commitSubject, evaluate };
