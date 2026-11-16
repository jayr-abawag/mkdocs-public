# What is MkDocs?

MkDocs describes itself as a *fast*, *simple* and *downright gorgeous* static
site generator that's geared towards building project documentation. The pitch
on [www.mkdocs.org](https://www.mkdocs.org/) is worth reading literally:
documentation source files are written in Markdown, configured with a single
YAML configuration file, and compiled into a completely static HTML site you
can host on GitHub Pages, Amazon S3, or anywhere else that serves files.

That is the whole model — Markdown in, static HTML out. No database, no
server-side runtime, no JavaScript framework to keep current.

## The three parts of a project

Every MkDocs project has the same shape: one config file, one source
directory, one build output.

- **`mkdocs.yml`** — the project settings, in YAML. The
  [Configuration guide](https://www.mkdocs.org/user-guide/configuration/) is
  explicit: *"At a minimum, this configuration file must contain the
  `site_name`. All other settings are optional."*
- **`docs/`** — the Markdown source files (the `docs_dir` setting, default
  `'docs'`). By convention the homepage is `docs/index.md`.
- **`site/`** — the generated output (the `site_dir` setting, default
  `'site'`). It is build output, so gitignore it rather than commit it.

This site is the live worked example. It started
minimal — its first `mkdocs.yml` was two settings:

```yaml
site_name: My Project Docs

theme: readthedocs
```

`site_name` satisfies the only required option, and `theme: readthedocs`
selects the built-in ReadTheDocs theme instead of the default `'mkdocs'`
theme. That, plus one `docs/index.md`, is a complete, working MkDocs site.
This guide then renamed the site to **MkDocs Guide** and
added an explicit `nav`; the current, finished `mkdocs.yml` is shown in full
on the [Configuring with mkdocs.yml](configuration.md) page.

## The core workflow

Four commands cover the daily loop, straight from the official
[Getting Started tutorial](https://www.mkdocs.org/getting-started/):

```bash
pip install mkdocs       # install MkDocs (it is a Python package)
mkdocs new my-project    # scaffold mkdocs.yml + docs/index.md
mkdocs serve             # live preview at http://127.0.0.1:8000/
mkdocs build             # generate the static site into site/
```

`mkdocs serve` is why writing in MkDocs feels fast: the built-in dev-server
rebuilds your documentation whenever anything in the configuration file,
documentation directory, or theme directory changes, and auto-reloads the
browser. `mkdocs build` produces the deployable artifact — plain HTML pages
plus a `sitemap.xml` and a search index.

## What runs underneath

MkDocs is a Python program, and it renders Markdown with the
[Python-Markdown](https://python-markdown.github.io/) library. Two rules
follow, and both matter once you start adding assets:

- Any file in the docs directory that is **not** Markdown — images, PDFs, a
  `CNAME` — is copied by MkDocs to the built site unaltered.
- Files and directories whose names begin with a dot (for example `.foo.md`
  or `.bar/`) are ignored by MkDocs; the `exclude_docs` setting can override
  this.

When the built-in themes are not enough, third-party themes slot into the
same `theme:` setting. The most widely used is
[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) — not
installed in this repository — which you would add with
`pip install mkdocs-material`.

## Where this guide goes next

The rest of the guide makes the evaluation case in detail: the benefits of the
Markdown-in/static-out approach, the use cases it fits, and four customization
pages that walk from this minimal `mkdocs.yml` to a site shaped the way you
want it.
