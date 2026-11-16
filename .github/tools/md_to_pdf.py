#!/usr/bin/env python3
"""Convert one Markdown file to a print-ready PDF.

Called by .github/workflows/export-pdf.yml (manual workflow_dispatch; the
PDF lands as a downloadable run artifact). Two-step pipeline:

1. Python-Markdown renders the Markdown to HTML. This is the same renderer
   library MkDocs builds the site with, using MkDocs's default extensions
   (toc, tables, fenced_code) plus codehilite for Pygments highlighting —
   so the PDF's Markdown semantics match the published site exactly,
   unlike a pandoc-based export.
2. WeasyPrint prints that HTML to PDF with a small print stylesheet:
   A4 pages, a "page / pages" footer, and code blocks that wrap instead of
   running off the page.

Usage:
    python md_to_pdf.py INPUT.md OUTPUT.pdf

Exits non-zero on a missing input file; the workflow checks the path
before calling this, so the checks here are a second line of defense.
"""

import sys
from html import escape
from pathlib import Path

import markdown
from pygments.formatters import HtmlFormatter
from weasyprint import HTML

# MkDocs's default extension set (meta, toc, tables, fenced_code — meta only
# extracts front-matter key/value pairs and adds nothing to the PDF body)
# plus codehilite, which routes fenced code blocks through Pygments.
# guess_lang=False keeps highlighting deterministic instead of guessing the
# language of unlabeled blocks. If the docs ever grow LIVE `!!!` admonition
# blocks (today they exist only inside a fenced example in authoring.md),
# add "admonition" to this list.
EXTENSIONS = ["toc", "tables", "fenced_code", "codehilite"]
EXTENSION_CONFIGS = {"codehilite": {"guess_lang": False}}


def build_css() -> str:
    """Print stylesheet, plus Pygments CSS scoped to the `.codehilite` class
    that the codehilite extension emits."""
    pygments_css = HtmlFormatter(style="default").get_style_defs(".codehilite")
    return f"""\
@page {{
    size: A4;
    margin: 2cm 1.8cm;
    @bottom-center {{ content: counter(page) " / " counter(pages); font-size: 9px; color: #666; }}
}}
body {{
    font-family: "DejaVu Sans", sans-serif;
    font-size: 10.5pt;
    line-height: 1.55;
    color: #1a1a1a;
}}
h1 {{ font-size: 20pt; border-bottom: 2px solid #8b9dc3; padding-bottom: 4px; }}
h2 {{ font-size: 15pt; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin-top: 1.4em; }}
code, pre {{ font-family: "DejaVu Sans Mono", monospace; font-size: 8.5pt; }}
pre {{
    background: #f6f8fa;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    white-space: pre-wrap; /* wrap long lines instead of clipping at the page edge */
    word-wrap: break-word;
}}
code {{ background: #f0f1f3; padding: 1px 4px; border-radius: 3px; }}
pre code {{ background: none; padding: 0; }}
{pygments_css}
"""


def main(argv):
    if len(argv) != 3:
        print(f"usage: {argv[0]} INPUT.md OUTPUT.pdf", file=sys.stderr)
        return 2
    md_path = Path(argv[1])
    pdf_path = Path(argv[2])
    if not md_path.is_file():
        print(f"error: no such file: {md_path}", file=sys.stderr)
        return 1

    text = md_path.read_text(encoding="utf-8")
    body = markdown.markdown(
        text, extensions=EXTENSIONS, extension_configs=EXTENSION_CONFIGS
    )
    html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>{escape(md_path.stem)}</title>
<style>
{build_css()}
</style></head><body>
{body}
</body></html>"""

    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    # base_url points at the source file's directory so any relative image
    # links resolve next to the Markdown, not the current working directory.
    HTML(string=html, base_url=str(md_path.parent)).write_pdf(str(pdf_path))
    print(f"wrote {pdf_path} ({pdf_path.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
