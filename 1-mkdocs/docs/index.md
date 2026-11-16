# MkDocs Guide

This site is a single practical guide to [MkDocs](https://www.mkdocs.org/).
It starts at zero — what the generator is, and how plain Markdown plus one
YAML file become a static site — and ends at the full customization surface:
configuration, themes, styling, and content authoring. Wherever a page names
an option, that name is verified against the official documentation at
[www.mkdocs.org](https://www.mkdocs.org/) and
[squidfunk.github.io/mkdocs-material](https://squidfunk.github.io/mkdocs-material/).

## The running example: this site itself

This site is the worked example running through every page. It began as the
smallest legal configuration — `site_name: My Project Docs` plus
`theme: readthedocs`, two lines in `mkdocs.yml` — and became **MkDocs Guide**
with an explicit `nav`, so each customization page can point at the exact
change it made here.

## Start here: what MkDocs is and where it fits

- **[What is MkDocs?](what-is-mkdocs.md)** — the generator itself: a
  project's three parts and the workflow that turns them into a site.
- **[Why MkDocs?](benefits.md)** — the case for choosing it, including the
  honest trade-offs.
- **[Use Cases](use-cases.md)** — project docs, knowledge bases, and portals
  — and when not to use MkDocs at all.

## Then customize: the working surface

- **[Configuring with mkdocs.yml](configuration.md)** — the one YAML file
  everything else hangs off: metadata, `nav`, and strictness.
- **[Themes](themes.md)** — the two built-ins plus Material for MkDocs:
  install it, switch to it.
- **[Styling: CSS and Palette](styling.md)** — `extra_css` overrides, the
  built-in theme's zero-CSS switches, and the Material palette.
- **[Writing Content](authoring.md)** — the Markdown you get by default,
  front-matter, and admonitions (and where theme support differs).

## The two commands this project lives by

```text
python -m mkdocs serve           # live preview at http://127.0.0.1:8000/
python -m mkdocs build --strict  # build; warnings fail the build
```

Read the pages in the order above — the site you are looking at is the
finished example.
