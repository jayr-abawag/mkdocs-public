# Styling: CSS and Palette

MkDocs gives you an escalation path for styling: configuration options that
require no CSS at all, then `extra_css` overrides, then a full palette system
(if you switch themes), and finally template overrides through `custom_dir`.

## Zero-CSS levers in the built-in `mkdocs` theme

The built-in `mkdocs` theme ships several styling switches that need no
stylesheet. All defaults below are from the [theme catalog](https://www.mkdocs.org/user-guide/choosing-your-theme/):

```yaml
theme:
  name: mkdocs
  color_mode: light              # light | dark | auto (default: light)
  user_color_mode_toggle: false  # let visitors pick and persist (default: false)
  nav_style: primary             # primary | dark | light (default: primary)
  hljs_style: github             # light-mode highlight.js style (default: github)
  hljs_style_dark: github-dark   # dark-mode highlight.js style (default: github-dark)
```

`auto` follows the visitor's system preference, and `nav_style` is documented
as *independent* of `color_mode` and must be defined separately. Note that this
site runs `theme: readthedocs`, whose documented option list includes none of
the above — switching `name:` to `mkdocs` is a one-line change if you want them.

## Overriding styles with `extra_css` and `extra_javascript`

For tweaks, place a stylesheet inside `docs_dir` — conventionally
`css/extra.css` — and list it under `extra_css` (default `[]`, paths relative
to `docs_dir`). The canonical example changes heading colors:

```css
h1 {
  color: red;
}
```

```yaml
extra_css:
  - css/extra.css
```

This works because per the [docs](https://www.mkdocs.org/user-guide/customizing-your-theme/):
*"Any extra CSS or JavaScript files will be added to the generated HTML
document after the page content."* Your rules therefore load after the theme's
own CSS and win the cascade without `!important`.

`extra_javascript` (also default `[]`) takes plain strings, or — since
MkDocs 1.5 — a mapping with a required `path` plus optional `type`, `async`,
and `defer` keys. A plain string ending in `.mjs` automatically gets
`type="module"`:

```yaml
extra_javascript:
  - some_plain_javascript.js
  - path: scripts/async_module.mjs
    type: module
    async: true
```

## The Material for MkDocs palette system

[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) — not
installed here; add it with `pip install mkdocs-material` — replaces fixed
CSS with named schemes and colors. One caveat before investing in this
configuration surface: Material is in maintenance mode and reaches end of
life on May 5, 2027 (see the [Themes](themes.md) page for the Zensical
migration path):

```yaml
theme:
  name: material
  palette:
    scheme: default   # "default" is light; "slate" is dark
```

Primary and accent accept named colors: red, pink, purple, deep purple, indigo,
blue, light blue, cyan, teal, green, light green, lime, yellow, amber, orange,
deep orange, brown, grey, blue grey, black, white. Accent supports all of
those *except* brown, grey, blue grey, black, and white.

Make light/dark user-switchable by defining `palette` as a list with media
queries and toggle icons:

```yaml
theme:
  palette:
    - media: "(prefers-color-scheme: light)"
      scheme: default
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      toggle:
        icon: material/brightness-4
        name: Switch to light mode
```

For a brand color, set `primary: custom` and define the variables in an extra
stylesheet (Material documents these under `:root > *`):

```css
:root > * {
  --md-primary-fg-color: #EE0F0F;
  --md-primary-fg-color--light: #ECB7B7;
  --md-primary-fg-color--dark: #90030C;
}
```

You can also create fully custom named schemes with an attribute selector —
define `[data-md-color-scheme="youtube"] { ... }` and reference it with
`scheme: youtube` — and tune the dark scheme's hue with
`[data-md-color-scheme="slate"] { --md-hue: 210; }` (range 0–360).

## Beyond CSS: `custom_dir` and template blocks

When CSS stops being enough, point `custom_dir` at a directory: any file there
with the same name as a parent-theme file replaces it, new files are added,
and the structure should mirror the parent theme's. `theme.name` must be a
known installed theme; if it is unset, `custom_dir` must be a complete
standalone theme.

The most surgical override is a template block. Create `main.html` in
`custom_dir` that extends `base.html`. Both built-in themes define these
blocks directly in `base.html`: `site_meta`, `htmltitle`, `styles`, `libs`,
`scripts`, `analytics`, `extrahead`, `site_name`, `site_nav`,
`search_button`, `content`, and `footer`. The default `mkdocs` theme also
defines `next_prev` and `repo` there; the `readthedocs` theme instead adds
`mobile_nav` to `base.html` and keeps `next_prev` and `repo` in included
partials (`footer.html` and `breadcrumbs.html` in MkDocs 1.6.1). That
placement matters: an override only applies when the parent template itself
contains the block, so overriding `next_prev` or `repo` from a readthedocs
`main.html` silently does nothing — the default prev/next links and repo
link still render, with no warning. A bare block replaces its parent, so
call `super()` to keep the original content:

```jinja
{% extends "base.html" %}
{% block libs %}
  {{ super() }}
  <script src="{{ base_url }}/js/somelib.js"></script>
{% endblock %}
```
