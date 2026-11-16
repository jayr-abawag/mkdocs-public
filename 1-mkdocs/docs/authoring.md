# Writing Content

MkDocs renders every page with [Python-Markdown](https://python-markdown.github.io/), enabling four extensions by default: `meta` (front-matter), `toc` (heading IDs), `tables`, and `fenced_code`. Anything else is enabled under `markdown_extensions` in `mkdocs.yml`.

## Tables and code fences

The `tables` extension adds pipe tables; a table must be surrounded by blank lines, and colons in the separator row set per-column alignment:

```markdown
First Header | Second Header | Third Header
:----------- |:-------------:| -----------:
Left         | Center        | Right
```

Cells accept inline Markdown only — no block-level elements, no multi-line text.

The `fenced_code` extension delimits code with three or more backticks (closing count must match), with an optional language tag for the syntax highlighter. In the built-in themes, highlight.js does the highlighting. Fenced blocks cannot be indented, so they cannot be nested in lists or blockquotes.

## Internal links and anchors

Link between pages with a *relative* path to the target `.md` file; MkDocs rewrites these to HTML links at build time:

```markdown
Please see the [project license](license.md) for further details.
```

Absolute paths are not officially supported — they are left unmodified and may break when deployed.

The `toc` extension generates an ID for every heading (text lowercased, disallowed characters become dashes), targeted as `about.md#license`. Its options live in `mkdocs.yml`: `permalink` (default `False`) appends a permanent link to each heading, `baselevel` (default `1`) shifts heading levels up, and `separator` (default `-`) replaces whitespace in IDs.

Non-Markdown files in `docs_dir` are copied to the site unaltered; embed images with regular Markdown: `![Screenshot](img/screenshot.png)`.

## Front-matter and page titles

The `meta` extension supports YAML-style front-matter (first line `---`, ends at the next `---` or `...`) and MultiMarkdown-style, bare `Key: value` lines ended by the first blank line.

Two keys are predefined: `template` selects the page template; `title` sets the document title. The precedence chain (first match wins):

1. A title defined for the page in `nav`
2. The `title` meta-data key
3. A level-1 header on the first line of the body (setext-style counts only since MkDocs 1.5)
4. The filename

## Admonitions

The `admonition` extension adds rST-style callouts: a block starts with `!!!` plus a single-word type, content indented four spaces.

```markdown
!!! note
    The title is auto-capitalized.

!!! warning "Custom title"
    A quoted string overrides it; an empty `""` removes the title.
```

The type becomes both the CSS class (`<div class="admonition note">`) and the default title. Python-Markdown suggests the rST types — `attention`, `caution`, `danger`, `error`, `hint`, `important`, `note`, `tip`, `warning` — but any word is accepted, and extra classes may follow. The extension ships no CSS — rendering depends on the theme.

Both built-in themes style admonitions (verified in the mkdocs 1.6.1 CSS): this site's `readthedocs` theme gives `.rst-content .admonition` a colored title bar with palettes for the suggested types — blue notes, teal hints/tips, orange warnings, red danger/error — while unknown types fall back to the generic blue box. The `mkdocs` theme styles generic boxes plus `note`, `info`, `warning`, `danger`.

[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/reference/admonitions/) adds collapsible blocks, nesting, inline variants, and per-type icons — but is not installed in this repository (`pip install mkdocs-material`). It needs `admonition` plus `pymdownx.details` (collapsible `???` / `???+`) and `pymdownx.superfences` (nesting); its types are `note` (the fallback), `abstract`, `info`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`. One roadmap note before standardizing on these: Material is in maintenance mode and reaches end of life on May 5, 2027, with Zensical as the successor — see the [Themes](themes.md) page.

## Enabling more extensions

Each extension is a list item; options are nested key/value mappings:

```yaml
markdown_extensions:
  - admonition
  - toc:
      permalink: "#"
      separator: "_"
```

Extensions named `pymdownx.*` come from the separate `pymdown-extensions` package — not installed by stock MkDocs (`pip install pymdown-extensions`), but pulled in automatically when `mkdocs-material` is installed.
