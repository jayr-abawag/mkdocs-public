# Themes

MkDocs ships with two built-in themes — `mkdocs` and `readthedocs` — and installed third-party themes slot into the same setting. The choice lives in `mkdocs.yml` under the `theme` key, which accepts either a plain string or a set of key/value pairs:

```yaml
theme: readthedocs
```

The mapping form is required to set theme-specific options alongside the name:

```yaml
theme:
  name: readthedocs
  navigation_depth: 4
```

If you omit `theme` entirely, the default is `mkdocs`. The full list of available themes is maintained in the [Choosing Your Theme guide](https://www.mkdocs.org/user-guide/choosing-your-theme/).

## The built-in mkdocs theme

The default theme was built as a custom Bootstrap theme and supports almost every feature of MkDocs. Its theme-specific options include:

- `color_mode` — the default color scheme, one of `light`, `dark` or `auto`; default `light`.
- `user_color_mode_toggle` — show a light/dark toggle in the navigation bar that visitors can persist; default `false`.
- `nav_style` — visual style of the top navigation bar: `primary`, `dark` or `light`; default `primary`.
- `highlightjs`, `hljs_style`, `hljs_style_dark` — code highlighting via highlight.js, with per-mode styles (`github` and `github-dark` by default).
- `hljs_languages` — highlight.js supports 23 common languages out of the box; list additional ones here.
- `navigation_depth` — maximum depth of the sidebar navigation tree; default `2`.
- `shortcuts` — numeric key codes for help, next, previous and search (191, 78, 80, 83).
- `analytics` — Google Analytics v4, enabled by setting `analytics.gtag` to a `G-` tracking ID.
- `locale` — the theme ships translations for 18 locales, from `de` to `zh_TW`.

## The built-in readthedocs theme

A clone of the default theme used by the Read the Docs service, offering the same restricted feature set as its parent — notably, only two levels of navigation are supported. This is what the current `1-mkdocs` configuration uses:

```yaml
theme: readthedocs
```

Its options are `prev_next_buttons_location` (one of `bottom`, `top`, `both` or `none`; default `bottom`), `navigation_depth` (default `4`), `collapse_navigation` (default `true`), `titles_only` (default `false`), `sticky_navigation` (default `true`), `include_homepage_in_sidebar` (default `true`) and `logo`. It also supports the same `highlightjs`, `hljs_languages` and `analytics` options as the mkdocs theme, but nothing for color modes, nav styles or keyboard shortcuts.

## Material for MkDocs

The dominant third-party theme is [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/). It is not installed in this repository, so trying it starts with installing the package — it requires Python 3.11 or newer, and the install pulls in its dependencies automatically (MkDocs, Markdown, Pygments and Python Markdown Extensions):

```sh
pip install mkdocs-material
```

Switch by setting `theme.name` to `material`:

```yaml
theme:
  name: material
```

What that switch unlocks: a palette system for configurable light/dark color schemes and styled admonitions (callouts), along with a much larger customization surface. These are covered in the Styling and Writing Content pages.

## Switching themes: three caveats

**Theme-specific keys do not carry across themes.** Options like `sticky_navigation` or `prev_next_buttons_location` mean nothing to the mkdocs theme, and vice versa. MkDocs (as of 1.6.1) passes unknown theme options to templates as-is and emits no warning, so a stale key fails silently — remove theme-specific options when switching and re-verify the site.

**Third-party themes and plugins are Python packages running unsandboxed code.** The official documentation warns, of themes: "Installing an MkDocs theme means installing a Python package and executing any code that the author has put in there. So, exercise the usual caution; there's no attempt at sandboxing." The same applies to plugins, which are also Python packages imported and executed during the build — treat anything installed for MkDocs, theme or plugin alike, with that caution.

**Check the roadmap before investing.** Material for MkDocs is in maintenance mode: its README states it reaches end of life on May 5, 2027 (critical fixes and security updates until then). The maintained successor is [Zensical](https://zensical.org/) — built by the same team, but not an MkDocs theme: it is a next-generation static site generator announced in November 2025 to move beyond MkDocs' technical limits, with a compatibility layer for existing setups. Weigh that migration path before committing to Material's configuration surface.
