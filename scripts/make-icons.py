"""Generate the favicon, apple icon, and Open Graph images.

Deterministic and offline once the font is cached: these are real PNGs rendered
with the actual Bricolage Grotesque the site uses, not a system-font
approximation, and nothing is fetched while `next build` runs.

Run: python scripts/make-icons.py
     python scripts/make-icons.py prepo joevix   # only these OG cards
"""

from __future__ import annotations

import re
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT_CACHE = Path(__file__).resolve().parent / ".fonts"
FONT_URL = (
    "https://raw.githubusercontent.com/google/fonts/main/ofl/"
    "bricolagegrotesque/BricolageGrotesque%5Bopsz%2Cwdth%2Cwght%5D.ttf"
)

PAPER = (236, 237, 237)
PAPER_SUNKEN = (223, 224, 225)
INK = (17, 18, 20)
INK_MUTED = (74, 77, 82)
LINE = (196, 199, 202)
SIGNAL = (226, 104, 58)

WORDMARK = "ffr"


def ensure_font() -> Path:
    FONT_CACHE.mkdir(parents=True, exist_ok=True)
    target = FONT_CACHE / "BricolageGrotesque.ttf"
    if target.exists() and target.stat().st_size > 100_000:
        return target

    print(f"downloading Bricolage Grotesque -> {target}")
    request = urllib.request.Request(FONT_URL, headers={"User-Agent": "make-icons"})
    with urllib.request.urlopen(request, timeout=120) as response:
        target.write_bytes(response.read())
    print(f"  {target.stat().st_size:,} bytes")
    return target


def load_display(path: Path, size: int, weight: int = 800) -> ImageFont.FreeTypeFont:
    """Load the variable font pinned to a weight, so the icons match the site."""
    font = ImageFont.truetype(str(path), size)
    try:
        axes = font.get_variation_axes()
        values = []
        for axis in axes:
            tag = axis["name"] if isinstance(axis, dict) else getattr(axis, "name", b"")
            if isinstance(tag, bytes):
                tag = tag.decode("ascii", "ignore")
            if str(tag).lower().startswith("wght") or str(tag) == "Weight":
                values.append(weight)
            else:
                values.append(axis["default"] if isinstance(axis, dict) else axis.default)
        font.set_variation_by_axes(values)
    except Exception as error:  # pragma: no cover - depends on FreeType build
        print(f"  note: could not pin weight ({error}); using the default instance")
    return font


def load_mono(size: int) -> ImageFont.FreeTypeFont:
    for candidate in ("consola.ttf", "CascadiaMono.ttf", "arial.ttf"):
        path = Path("C:/Windows/Fonts") / candidate
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return load_display(ensure_font(), size, weight=500)


def tracked_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    tracking: int = 0,
) -> int:
    """Draw text with letter spacing and return the total width."""
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=font, fill=fill)
        x += draw.textlength(char, font=font) + tracking
    return int(x - xy[0])


def make_wordmark_icon(font_path: Path, size: int, out: Path, border: int) -> None:
    image = Image.new("RGB", (size, size), PAPER)
    draw = ImageDraw.Draw(image)
    draw.rectangle([0, 0, size - 1, size - 1], outline=INK, width=border)

    # Size the wordmark to fill the square with even padding.
    padding = int(size * 0.17)
    target = size - padding * 2
    font_size = int(size * 0.62)
    while font_size > 8:
        font = load_display(font_path, font_size)
        width = sum(draw.textlength(c, font=font) for c in WORDMARK) + int(font_size * 0.02) * 2
        if width <= target:
            break
        font_size -= 2

    font = load_display(font_path, font_size)
    tracking = max(1, int(font_size * 0.01))
    total = sum(draw.textlength(c, font=font) for c in WORDMARK) + tracking * (len(WORDMARK) - 1)

    # Optical centring: nudge down slightly because the glyphs have no descenders.
    bbox = draw.textbbox((0, 0), WORDMARK, font=font)
    text_height = bbox[3] - bbox[1]
    x = (size - total) / 2
    y = (size - text_height) / 2 - bbox[1] - size * 0.02

    tracked_text(draw, (int(x), int(y)), WORDMARK, font, INK, tracking)

    # A single signal notch: the one accent, as the design system requires.
    notch = max(3, int(size * 0.055))
    draw.rectangle(
        [size - padding - notch, size - padding - notch, size - padding, size - padding],
        fill=SIGNAL,
    )

    out.parent.mkdir(parents=True, exist_ok=True)
    image.save(out, "PNG", optimize=True)
    print(f"  {out.relative_to(ROOT)}  {size}x{size}  {out.stat().st_size:,} bytes")


def wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=font) <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def make_og(
    font_path: Path,
    out: Path,
    *,
    headline: str,
    kicker: str,
    meta: str,
    headline_size: int = 78,
) -> None:
    width, height = 1200, 630
    image = Image.new("RGB", (width, height), PAPER)
    draw = ImageDraw.Draw(image)

    margin = 44
    draw.rectangle([margin, margin, width - margin - 1, height - margin - 1], outline=INK, width=3)

    inner = margin + 44
    display = load_display(font_path, 40)
    tracked_text(draw, (inner, inner), WORDMARK, display, INK, 1)

    mono = load_mono(22)
    kicker_width = draw.textlength(kicker.upper(), font=mono)
    draw.text((width - inner - kicker_width, inner + 12), kicker.upper(), font=mono, fill=INK_MUTED)

    headline_font = load_display(font_path, headline_size)
    lines = wrap(draw, headline, headline_font, width - inner * 2)
    line_height = int(headline_size * 1.06)
    block_height = line_height * len(lines)
    y = (height - block_height) // 2 + 10

    for line in lines:
        draw.text((inner, y), line, font=headline_font, fill=INK)
        y += line_height

    # Signal rule under the headline block.
    draw.rectangle([inner, y + 8, inner + 132, y + 16], fill=SIGNAL)

    meta_font = load_mono(24)
    draw.text((inner, height - margin - 62), meta, font=meta_font, fill=INK_MUTED)

    out.parent.mkdir(parents=True, exist_ok=True)
    image.save(out, "PNG", optimize=True)
    print(f"  {out.relative_to(ROOT)}  {width}x{height}  {out.stat().st_size:,} bytes")


def read_projects() -> list[dict[str, str]]:
    """Read slug, title, and type straight out of the content module."""
    source = (ROOT / "src" / "content" / "projects.ts").read_text(encoding="utf-8")
    projects: list[dict[str, str]] = []
    for block in source.split("slug:"):
        slug = re.match(r'\s*"([a-z0-9-]+)"', block)
        title = re.search(r'\n\s*title:\s*"([^"]+)"', block)
        kind = re.search(r'\n\s*type:\s*"([a-z]+)"', block)
        if slug and title and kind:
            projects.append({"slug": slug.group(1), "title": title.group(1), "type": kind.group(1)})
    return projects


def main() -> int:
    font_path = ensure_font()
    only = set(sys.argv[1:])

    if not only:
        print("icons:")

        # Next.js file conventions: app/icon.png is the favicon, apple-icon.png
        # the iOS home screen icon, opengraph-image.png the default share card.
        make_wordmark_icon(font_path, 256, ROOT / "src" / "app" / "icon.png", border=10)
        make_wordmark_icon(font_path, 180, ROOT / "src" / "app" / "apple-icon.png", border=8)

        print("open graph:")
        make_og(
            font_path,
            ROOT / "src" / "app" / "opengraph-image.png",
            headline="I build it, analyze it, and tell the story.",
            kicker="portfolio 2026",
            meta="Muhammad Farrel Al-Wafi Frizzy  /  Information Systems graduate",
        )
    else:
        print("open graph:")

    projects = read_projects()
    if only:
        projects = [project for project in projects if project["slug"] in only]
    print(f"  {len(projects)} project cards")
    for project in projects:
        make_og(
            font_path,
            ROOT / "public" / "og" / f"{project['slug']}.png",
            headline=project["title"],
            kicker=f"case study / {project['type']}",
            meta="Muhammad Farrel Al-Wafi Frizzy  /  ffrizzy",
            headline_size=84,
        )

    return 0


if __name__ == "__main__":
    sys.exit(main())
