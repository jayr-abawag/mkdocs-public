# `1-mkdocs/` — the MkDocs Site

This directory is the documentation site itself. It is deliberately
minimal right now: the site's purpose is to exercise the docs stack, so
its structure is the reference for how a MkDocs project is laid out.

## Layout

```text
1-mkdocs/
  mkdocs.yml      # site configuration: site name, theme (readthedocs), nav
  docs/
    index.md            # the site's landing page
    what-is-mkdocs.md   # guide pages, in nav order:
    benefits.md         #   what-is-mkdocs → benefits → use-cases →
    use-cases.md        #   configuration → themes → styling → authoring
    configuration.md
    themes.md
    styling.md
    authoring.md
```

When a page is added under `docs/`, add it to the `nav` section of
`mkdocs.yml` so it appears in site navigation. The build toolchain is
pinned once, in the repository-root `requirements.txt` (`mkdocs==1.6.1`);
CI installs from that file for the GHCR image and the PDF export. `site/` is generated output — Git-ignored, never committed.

The serve/build commands, the strict-build discipline, and the
documentation workflow are all described once, in the repository
[README](../README.md) — this file intentionally does not repeat them.
