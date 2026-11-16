# Configuring with mkdocs.yml

MkDocs is configured by a single YAML file, `mkdocs.yml`, in the project directory (override the name with `mkdocs -f`). This project's file began as the smallest legal configuration — two lines, and already a complete, working configuration:

```yaml
site_name: My Project Docs

theme: readthedocs
```

As the official documentation puts it: "At a minimum, this configuration file must contain the site_name. All other settings are optional." This guide then renamed the site and added an explicit `nav`; the entire configuration file for this site is now the finished `mkdocs.yml` below, which every customization page in this guide points back at:

```yaml
site_name: MkDocs Guide

theme: readthedocs

nav:
  - "Home": index.md
  - "What is MkDocs?": what-is-mkdocs.md
  - "Why MkDocs?": benefits.md
  - "Use Cases": use-cases.md
  - "Configuring with mkdocs.yml": configuration.md
  - "Themes": themes.md
  - "Styling: CSS and Palette": styling.md
  - "Writing Content": authoring.md
```

## Project information

A fuller configuration adds metadata:

```yaml
site_description: Documentation for an example product.
site_author: Docs Team
copyright: Copyright 2026, Example, Inc
site_url: https://example.com/docs/
repo_url: https://github.com/example/example
```

Setting `repo_url` derives the rest automatically: `repo_name` becomes "GitHub", "Bitbucket" or "GitLab" when the URL matches one of those domains (otherwise the hostname), and `edit_uri` is auto-set to `edit/master/docs/` for GitHub and GitLab hosts, `src/default/docs/` for Bitbucket — producing the "Edit on GitHub" link in the theme header. Set `edit_uri` to an empty string to disable the link, or override it if your default branch is not `master`.

## Navigation: `nav`

The `nav` this site ships with is deliberately flat and real-world. Nav paths are relative to `docs_dir` (default `docs/`):

```yaml
nav:
  - "Home": index.md
  - "What is MkDocs?": what-is-mkdocs.md
  - "Why MkDocs?": benefits.md
  - "Use Cases": use-cases.md
  - "Configuring with mkdocs.yml": configuration.md
  - "Themes": themes.md
  - "Styling: CSS and Palette": styling.md
  - "Writing Content": authoring.md
```

- The optional `"Title":` prefix supplies the link text, and a title defined in the nav "will be used throughout the site", overriding any title defined within the page itself. Titles are optional for internal pages but required for external links.
- Entries can also be sections — containers only: "a section cannot have a page assigned to it". They may nest as deeply as you like and need not mirror your directory structure, and entries may point at external URLs:

```yaml
nav:
  - Home: index.md
  - User guide:
      - Writing your docs: user/writing.md
  - MkDocs.org: https://www.mkdocs.org/
```
- Pages omitted from `nav` are still rendered into the built site, but are not linked from the global navigation and are not included in previous/next links.
- If `nav` is omitted entirely, MkDocs generates it automatically, sorted alphanumerically by file name, with index files always listed first within each sub-section.
- The legacy `pages` key was deprecated in MkDocs 1.0 and raises an error since 1.3.0; use `nav`.

## Layout, output and strictness

- `docs_dir` — Markdown sources; default `'docs'`, resolved relative to `mkdocs.yml`.
- `site_dir` — build output; default `'site'`. Keep it out of source control.
- `use_directory_urls` — default `true`; produces clean URLs instead of `.html` files.
- `strict` — default `false`; `true` halts the build when a warning is raised (also available as the `--strict` flag).
- `theme` — default `'mkdocs'`. MkDocs includes two built-in themes (`mkdocs` and `readthedocs` — this site uses the latter). Third-party themes install separately; Material for MkDocs is not installed in this repository, and would need:

```bash
pip install mkdocs-material
```

plus `theme: name: material` in `mkdocs.yml`.

## Formatting defaults

`markdown_extensions` enables extensions beyond the ones MkDocs uses by default (`meta`, `toc`, `tables`, and `fenced_code`). `plugins` defaults to `['search']`; once you define the key the default is dropped, so re-list `search` explicitly (`plugins: []` disables all plugins). The search plugin accepts `separator` (`'[\s\-]+'`), `min_search_length` (`3`), `lang` (the theme locale, otherwise `[en]`), `prebuild_index` (requires Node.js) and `indexing` (`full` by default, or `sections`/`titles` to slim the index):

```yaml
plugins:
  - search:
      lang: en
      indexing: titles
```

Third-party plugins are ordinary Python packages: install one with pip — for example `pip install mkdocs-blogging-plugin` — and enable it by listing the package name under `plugins`. The [MkDocs catalog](https://github.com/mkdocs/catalog) ranks available plugins in dedicated categories (search, blogging, social cards and more), and the community wiki collects further options. A plugin, like a theme, is Python code imported and executed as part of your build — the same caution on the [Themes](themes.md) page applies.

## Advanced: environments, inheritance, validation

`!ENV` reads any value from an environment variable, with fallbacks — the last item in the list is a literal default:

```yaml
site_name: !ENV [SITE_NAME, OTHER_NAME, 'My default site name']
```

`INHERIT` deep-merges a parent configuration file — the standard pattern for multi-site setups sharing a base:

```yaml
INHERIT: ../base.yml
```

Any key may be merged or replaced, but lists cannot be appended to: `nav`, `markdown_extensions` and `plugins` must be redefined in full, and path-based options should live only in the primary file.

Finally, the `validation` tree controls how broken links and nav problems are reported — `warn`, `info` or `ignore`. The defaults (MkDocs 1.6) are shown below; set entries to `warn` and pair with `strict` for a fail-on-warning build:

```yaml
validation:
  nav:
    omitted_files: info
    not_found: warn
    absolute_links: info
  links:
    not_found: warn
    anchors: info
    absolute_links: info
    unrecognized_links: info
```
