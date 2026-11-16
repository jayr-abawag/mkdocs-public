# mkdocs-public

The public home of the **MkDocs Guide** — a single practical guide to
[MkDocs](https://www.mkdocs.org/), from "what is a static site generator" to
the full customization surface (configuration, themes, styling, authoring).

**Read it live: <https://jayr-abawag.github.io/mkdocs-public/>**

This repository carries the site source and the CI that builds, publishes,
and ships it.

## What's here

| Path | Purpose |
|---|---|
| [`1-mkdocs/`](1-mkdocs/) | The MkDocs site source (`mkdocs.yml`, `docs/`) |
| `Dockerfile` | Multi-stage build: strict MkDocs build served by nginx (unprivileged, port 8080) |
| `requirements.txt` | Pinned toolchain: `mkdocs==1.6.1` |
| [`.github/workflows/`](.github/workflows/) | CI: Pages deployment, GHCR image, PDF export |

## CI Workflows

`.github/workflows/` holds five workflow files covering the repository's
three CI outputs: the deployed site, the container image, and PDF export.
The image pipeline is one reusable workflow (`docker-build-push.yml`)
consumed by two callers with different use cases.

**Deploy MkDocs site to Pages** (`.github/workflows/deploy-pages.yml`)
builds the site with `--strict` and publishes it to GitHub Pages through the
official artifact-based pipeline (`configure-pages@v6`,
`upload-pages-artifact@v5`, `deploy-pages@v5`) under a `github-pages`
environment, with OIDC authentication and a non-cancelling `pages`
concurrency group. It runs on pushes to `main` that touch the site source,
`requirements.txt`, or the workflow itself, and on manual
`workflow_dispatch`. One-time setup — Pages source "GitHub Actions" — was
done via the REST API.

**Image pipeline — one reusable workflow, two use cases.**
`.github/workflows/docker-build-push.yml` is the single definition of the
image build: checkout, Buildx, GHCR login, metadata, and
`docker/build-push-action` over the multi-stage `Dockerfile`, with GHA layer
cache and SHA-pinned actions. It is a `workflow_call` template with one
switch, `push`, and is never triggered directly.

- **`publish-ghcr.yml`** (the publish use case) calls it with `push: true`
  on path-filtered pushes to `main` and on manual `workflow_dispatch`,
  publishing `ghcr.io/jayr-abawag/mkdocs-public` with `latest` on the
  default branch plus branch and `sha-` tags and provenance attestations.
- **`build-image.yml`** (the verify use case) calls it with `push: false`
  on `pull_request` and pushes to non-main branches — the same build, run
  before merge so a broken `Dockerfile` or docs source fails on the PR
  instead of on `main`.

**Markdown to PDF** (`.github/workflows/export-pdf.yml`) is a manual
`workflow_dispatch` workflow (string input `markdown_path`, default
`1-mkdocs/docs/what-is-mkdocs.md`) that renders one repository Markdown
file with Python-Markdown and WeasyPrint 70.0 via
`.github/tools/md_to_pdf.py`, and uploads the A4 PDF of the page as a run
artifact retained for 30 days.

## Read the docs

```bash
# Published site
#   https://jayr-abawag.github.io/mkdocs-public/

# Locally, with live reload
python -m pip install -r requirements.txt
python -m mkdocs serve -f 1-mkdocs/mkdocs.yml      # http://localhost:8000

# Locally, as the CI ships it (strict build in nginx, port 8080)
docker build -t mkdocs-public:local .
docker run --rm -p 8080:8080 mkdocs-public:local
```
