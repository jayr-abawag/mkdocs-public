# Why MkDocs?

MkDocs is a Python static site generator aimed squarely at project
documentation. You write pages in Markdown, describe the site in a small
`mkdocs.yml`, and build a static HTML site from them. The only prerequisite is
"a recent version of Python" plus pip, and the project homepage leads with
four selling points that hold up in practice.

## Great themes available

MkDocs ships two built-in themes, `mkdocs` and `readthedocs` (this site uses
`readthedocs`), alongside a catalog of third-party themes installable from
PyPI. If neither fits, you can build a custom theme from scratch — the docs
cover the whole path.

## Easy to customize

Everything lives in `mkdocs.yml`: theme options, navigation, Markdown
extensions via `markdown_extensions`, and plugins. Plugins are ordinary pip
packages — install one and list its name under `plugins`, and the
[MkDocs catalog](https://github.com/mkdocs/catalog) is where they are
discovered; [Configuring with mkdocs.yml](configuration.md) shows the
mechanics. The configuration reference documents every option and its
default, so nothing about the build is guesswork.

## Preview your site as you work

`mkdocs serve` runs the built-in development server. It rebuilds the docs on
every save and will "even auto-reload and refresh your browser". A `--watch`
flag extends live reloading to extra paths, such as a custom theme's source.

## Host anywhere

`mkdocs build` writes a completely static site to `site_dir` (default:
`site`) — plain HTML, CSS, and JavaScript with no server runtime to operate.
The homepage's "GitHub Pages, Amazon S3, or any other host" is literal, and
three paths are documented:

- **Read the Docs** supports MkDocs out-of-the-box, rebuilding on every push.
- **GitHub Pages**: `mkdocs gh-deploy` builds the docs, commits them to the
  `gh-pages` branch, and pushes it.
- **Any other host**: copy the contents of `site_dir` to your server.

## Docs as code, with CI discipline

Sources are plain Markdown under version control: they diff cleanly, live
next to the code they describe, and get reviewed in pull requests like any
other change.

CI is where MkDocs quietly earns its keep. `mkdocs build --strict` — or
`strict: true` in `mkdocs.yml` — halts processing when a warning is raised,
and the `validation` settings decide what counts as a warning. The `validation`
option was introduced in MkDocs 1.5; the defaults below are MkDocs 1.6's:

```yaml
validation:
  nav:
    omitted_files: info
    not_found: warn
    absolute_links: info
  links:
    not_found: warn
    anchors: info            # new in MkDocs 1.6
    absolute_links: info
    unrecognized_links: info
```

Any check set to `warn` fails a strict build, so a broken internal link or a
nav entry pointing at a missing file breaks CI instead of shipping silently.

## Search out of the box

The `plugins` setting defaults to `['search']`: the bundled search plugin,
powered by the lunr.js library, builds a client-side index that needs no
search backend. One gotcha: defining `plugins` drops the default, so re-list
`search` when you add anything else:

```yaml
plugins:
  - search                 # re-added explicitly
  # - any third-party plugin goes here
```

## The honest trade-offs

MkDocs is Markdown-first, not a wiki or a CMS: there are no browser-side page
editing, user accounts, or dynamic behavior. And the two built-in themes are
deliberately plain — if you want more polish out of the box, that is exactly
why projects like [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
exist (`pip install mkdocs-material`; not installed in this repository). See
the [Themes](themes.md) page for a comparison of the options.
