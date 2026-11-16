# Use Cases

MkDocs is "geared towards building project documentation": pages are
written in Markdown and the whole site is configured with a single YAML
configuration file. That combination — plain Markdown, one config, static
HTML output — covers a wider range of uses than the tagline suggests.

## Project and user documentation

This is the generator's stated purpose. A project keeps Markdown pages
under `docs/`, previews them with `mkdocs serve`, and publishes with
`mkdocs build`. MkDocs includes two built-in themes, `mkdocs` and
`readthedocs`; choosing one is a single `theme:` line — this very site
sets `theme: readthedocs` in its `mkdocs.yml`.

## Team knowledge bases and runbooks

The same shape works for internal knowledge: runbooks, on-call notes,
decision records. Everything is reviewable Markdown in git, so doc
changes go through the same pull-request flow as code. This site
is the working example — it documents MkDocs itself and builds strictly
(`python -m mkdocs build --strict`).

## Organization-wide docs portals

For a themed, searchable site shared across many repositories, each repo
can carry a small `mkdocs.yml` that inherits shared settings from a
common parent file via `INHERIT`. Inheritance deep-merges the parent
config, but list values are always replaced — you cannot append to
`nav`. Options you want merged, such as `markdown_extensions` and
`plugins`, must therefore use the mapping syntax:

```yaml
INHERIT: ../base.yml
site_name: Foo Project
markdown_extensions:
  toc:
    permalink: true
```

Search costs nothing here: the `search` plugin ships with MkDocs by
default.

## Hosting as the use-case selector

Where the static output goes decides the rest:

- **GitHub Pages** — `mkdocs gh-deploy` builds the docs and uses the
  `ghp-import` tool to commit them to the `gh-pages` branch; you should
  never edit that pages repository by hand. User and organization pages
  commit to the `master` branch instead, so pass both options explicitly:

  ```bash
  mkdocs gh-deploy --config-file ../my-project/mkdocs.yml --remote-branch master
  ```

  Mind the branch name, though: the `master` example mirrors the current
  www.mkdocs.org page, but repositories created today default to `main`
  (the MkDocs catalog itself defaults to `main`). A Pages site publishes
  only the branch configured under its repository settings, so pass the
  branch your site actually serves — typically `main` for newer
  repositories: `--remote-branch main`.

- **Read the Docs** — free hosting that supports MkDocs out-of-the-box;
  documentation updates each time you push to the public repository.

- **Any static host** — run `mkdocs build`, then copy the `site_dir`
  contents (defaults to `site`):

  ```bash
  scp -r ./site user@host:/path/to/server/root
  ```

  The build emits a `404.html` for servers that use it.

Want more than stock styling? Material for MkDocs is a third-party theme
built on MkDocs — not installed in this repository — added with
`pip install mkdocs-material`.

## When not to use MkDocs

- Content that is not Markdown-shaped: spreadsheets, media libraries,
  dashboards rendered from a live database.
- Anything needing server-side logic or per-user authentication; the
  output is static files served as-is.
- Non-documentation site types: landing pages, web applications. Plugins
  can bend this — blogging is a plugin-defined edge case — but bending is
  not the design center.

## Where the edges live

What MkDocs cannot do out of the box is deliberately left to the
ecosystem. The community wiki collects third-party themes, plugins,
deployments, and recipes; the MkDocs catalog ranks 300-plus projects in
17 categories, including a dedicated blogging category (for example,
`mkdocs-blogging-plugin`). If a use case sits outside this page, check
both before abandoning MkDocs.
