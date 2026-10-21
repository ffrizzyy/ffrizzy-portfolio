"""Generate the site's non-photographic artwork.

Everything here is drawn, not photographed: the paper texture, one cover per
project, the portrait placeholder card, and the Instagram post cards. They are
typographic and geometric, in the paper-zine language of the design system, and
they deliberately do not imitate a screenshot.

They exist so no slot in the interface is an empty grey box. A real screenshot
dropped over any of these paths simply replaces it.

Run: python scripts/make-artwork.py
     python scripts/make-artwork.py prepo joevix   # only these covers
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT_CACHE = Path(__file__).resolve().parent / ".fonts"
FONT_URL = (
    "https://raw.githubusercontent.com/google/fonts/main/ofl/"
    "bricolagegrotesque/BricolageGrotesque%5Bopsz%2Cwdth%2Cwght%5D.ttf"
)

PAPER = (236, 237, 237)
PAPER_RAISED = (245, 246, 246)
PAPER_SUNKEN = (223, 224, 225)
INK = (17, 18, 20)
INK_MUTED = (74, 77, 82)
LINE = (196, 199, 202)
SIGNAL = (226, 104, 58)

TYPE_LABEL = {
    "build": "Build",
    "data": "Data",
    "research": "Research",
    "design": "Design",
    "content": "Content",
}


def ensure_font() -> Path:
    FONT_CACHE.mkdir(parents=True, exist_ok=True)
    target = FONT_CACHE / "BricolageGrotesque.ttf"
    if target.exists() and target.stat().st_size > 100_000:
        return target
    import urllib.request

    print(f"downloading Bricolage Grotesque -> {target}")
    request = urllib.request.Request(FONT_URL, headers={"User-Agent": "make-artwork"})
    with urllib.request.urlopen(request, timeout=120) as response:
        target.write_bytes(response.read())
    return target


_font_path: Path | None = None


def display(size: int, weight: int = 800) -> ImageFont.FreeTypeFont:
    global _font_path
    if _font_path is None:
        _font_path = ensure_font()
    font = ImageFont.truetype(str(_font_path), size)
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
    except Exception:
        pass
    return font


def mono(size: int) -> ImageFont.FreeTypeFont:
    for candidate in ("consola.ttf", "CascadiaMono.ttf", "arial.ttf"):
        path = Path("C:/Windows/Fonts") / candidate
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return display(size, weight=500)


def tracked(draw, xy, text, font, fill, tracking=0):
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=font, fill=fill)
        x += draw.textlength(char, font=font) + tracking
    return x - xy[0]


def wrap(draw, text, font, max_width):
    words, lines, current = text.split(), [], ""
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


# --------------------------------------------------------------------------- #
# Paper texture
# --------------------------------------------------------------------------- #

def make_paper() -> None:
    """A subtle fibre texture. Faint on purpose: at --texture-opacity it should
    read as paper stock, not as a pattern."""
    w, h = 1600, 1000
    rng = np.random.default_rng(20261009)

    base = np.zeros((h, w, 3), dtype=np.float32)
    base[:, :] = PAPER

    # Fine grain, then a soft blur so it reads as fibre rather than static.
    grain = rng.normal(0.0, 6.0, (h, w, 1))
    base += grain

    # Low-frequency cloudiness, as if the sheet is unevenly lit.
    small = rng.normal(0.0, 9.0, (h // 16, w // 16, 1))
    cloud = np.array(
        Image.fromarray(np.clip(small[:, :, 0] + 128, 0, 255).astype(np.uint8)).resize(
            (w, h), Image.BICUBIC
        ),
        dtype=np.float32,
    ) - 128.0
    base += cloud[:, :, None]

    image = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB")

    # Creases: a few long, slightly darker lines, as if folded.
    draw = ImageDraw.Draw(image, "RGBA")
    for _ in range(14):
        x0, y0 = rng.integers(0, w), rng.integers(0, h)
        x1 = int(x0 + rng.normal(0, 520))
        y1 = int(y0 + rng.normal(0, 320))
        draw.line((x0, y0, x1, y1), fill=(90, 92, 96, 16), width=int(rng.integers(1, 3)))
    image = image.filter(ImageFilter.GaussianBlur(0.4))

    out = ROOT / "public" / "textures" / "paper.webp"
    out.parent.mkdir(parents=True, exist_ok=True)
    image.save(out, "WEBP", quality=82, method=6)
    print(f"  {out.relative_to(ROOT)}  {w}x{h}  {out.stat().st_size:,} bytes")


# --------------------------------------------------------------------------- #
# Type motifs: one geometric mark per project type
# --------------------------------------------------------------------------- #

def motif(draw, box, kind: str) -> None:
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0

    if kind == "build":
        # Angle brackets.
        for direction, cx in ((1, x0 + w * 0.28), (-1, x0 + w * 0.72)):
            draw.line(
                (cx + direction * w * 0.10, y0 + h * 0.18, cx - direction * w * 0.06, y0 + h * 0.5),
                fill=INK, width=6,
            )
            draw.line(
                (cx - direction * w * 0.06, y0 + h * 0.5, cx + direction * w * 0.10, y0 + h * 0.82),
                fill=INK, width=6,
            )
        draw.line((x0 + w * 0.46, y0 + h * 0.72, x0 + w * 0.56, y0 + h * 0.28), fill=SIGNAL, width=6)

    elif kind == "data":
        heights = (0.34, 0.62, 0.46, 0.8)
        bar = w * 0.13
        gap = w * 0.09
        for index, ratio in enumerate(heights):
            x = x0 + index * (bar + gap)
            top = y1 - h * ratio
            draw.rectangle((x, top, x + bar, y1), fill=SIGNAL if index == 3 else INK)

    elif kind == "research":
        r = min(w, h) * 0.34
        cx, cy = x0 + w * 0.42, y0 + h * 0.5
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=INK, width=6)
        draw.line((cx + r, cy, x1, cy), fill=INK, width=6)
        draw.line((cx, cy + r, cx, y1), fill=INK, width=6)
        draw.ellipse((cx - 7, cy - 7, cx + 7, cy + 7), fill=SIGNAL)

    elif kind == "design":
        s = min(w, h) * 0.58
        draw.rectangle((x0, y0 + h * 0.16, x0 + s, y0 + h * 0.16 + s), outline=INK, width=6)
        draw.rectangle(
            (x0 + w * 0.24, y1 - h * 0.16 - s, x0 + w * 0.24 + s, y1 - h * 0.16),
            outline=SIGNAL, width=6,
        )

    else:  # content
        for index, ratio in enumerate((1.0, 0.86, 0.62)):
            y = y0 + h * (0.26 + index * 0.24)
            draw.rectangle((x0, y, x0 + w * ratio, y + 7), fill=SIGNAL if index == 0 else INK)


# --------------------------------------------------------------------------- #
# Project cover
# --------------------------------------------------------------------------- #

def make_cover(slug: str, title: str, kind: str, index: int) -> None:
    w, h = 1600, 1000
    image = Image.new("RGB", (w, h), PAPER)
    draw = ImageDraw.Draw(image)

    margin = 40
    draw.rectangle((margin, margin, w - margin - 1, h - margin - 1), outline=INK, width=3)

    inner = margin + 52
    top = inner

    # Index and type, mono, as a card header.
    head = mono(26)
    tracked(draw, (inner, top), f"{index:02d}", head, INK, 2)
    label = TYPE_LABEL.get(kind, kind).upper()
    width_label = draw.textlength(label, font=head) + len(label) * 3
    tracked(draw, (w - inner - width_label, top + 2), label, head, INK_MUTED, 3)

    # Motif on the right.
    motif(draw, (w * 0.60, h * 0.30, w - inner, h * 0.72), kind)

    # Title, wrapped into the left column.
    size = 96
    font = display(size)
    lines = wrap(draw, title, font, int(w * 0.50))
    while len(lines) > 3 and size > 54:
        size -= 6
        font = display(size)
        lines = wrap(draw, title, font, int(w * 0.50))

    line_height = int(size * 1.05)
    block = line_height * len(lines)
    y = h * 0.52 - block / 2
    for line in lines:
        draw.text((inner, y), line, font=font, fill=INK)
        y += line_height

    draw.rectangle((inner, y + 18, inner + 150, y + 28), fill=SIGNAL)

    foot = mono(24)
    tracked(draw, (inner, h - margin - 78), "FFRIZZY", foot, INK_MUTED, 3)

    out = ROOT / "public" / "images" / f"{slug}.webp"
    out.parent.mkdir(parents=True, exist_ok=True)
    image.save(out, "WEBP", quality=88, method=6)
    print(f"  {out.relative_to(ROOT)}  {out.stat().st_size:,} bytes")


# --------------------------------------------------------------------------- #
# Portrait placeholder card
# --------------------------------------------------------------------------- #

def make_portrait() -> None:
    w, h = 800, 1000
    image = Image.new("RGB", (w, h), PAPER_RAISED)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, w - 1, h - 1), outline=INK, width=4)

    font = display(300)
    text = "ffr"
    total = sum(draw.textlength(c, font=font) for c in text) + 2 * 6
    bbox = draw.textbbox((0, 0), text, font=font)
    x = (w - total) / 2
    y = (h - (bbox[3] - bbox[1])) / 2 - bbox[1] - 40
    tracked(draw, (int(x), int(y)), text, font, INK, 6)

    draw.rectangle((w - 120, h - 120, w - 76, h - 76), fill=SIGNAL)

    note = mono(20)
    tracked(draw, (48, h - 72), "PORTRAIT PENDING", note, INK_MUTED, 3)

    out = ROOT / "public" / "images" / "portrait.webp"
    image.save(out, "WEBP", quality=90, method=6)
    print(f"  {out.relative_to(ROOT)}  {out.stat().st_size:,} bytes")


# --------------------------------------------------------------------------- #
# Instagram post card
# --------------------------------------------------------------------------- #

def make_ig(slug: str, title: str, series: str) -> None:
    w, h = 1080, 1350
    image = Image.new("RGB", (w, h), PAPER)
    draw = ImageDraw.Draw(image)
    margin = 40
    draw.rectangle((margin, margin, w - margin - 1, h - margin - 1), outline=INK, width=3)

    inner = margin + 48
    head = mono(24)
    tracked(draw, (inner, inner), "INSTAGRAM", head, INK_MUTED, 3)

    font = display(112)
    lines = wrap(draw, title, font, w - inner * 2 - 60)
    y = h * 0.46 - (len(lines) * 118) / 2
    for line in lines:
        draw.text((inner, y), line, font=font, fill=INK)
        y += 118

    draw.rectangle((inner, y + 26, inner + 170, y + 38), fill=SIGNAL)

    body = mono(22)
    for index, line in enumerate(wrap(draw, series, body, w - inner * 2 - 40)):
        draw.text((inner, h * 0.72 + index * 34), line, font=body, fill=INK_MUTED)

    foot = mono(24)
    tracked(draw, (inner, h - margin - 76), "FFRIZZY", foot, INK_MUTED, 3)

    out = ROOT / "public" / "images" / f"ig-{slug}.webp"
    image.save(out, "WEBP", quality=88, method=6)
    print(f"  {out.relative_to(ROOT)}  {out.stat().st_size:,} bytes")


def read_projects() -> list[dict[str, str]]:
    source = (ROOT / "src" / "content" / "projects.ts").read_text(encoding="utf-8")
    found = []
    for block in source.split("slug:"):
        slug = re.match(r'\s*"([a-z0-9-]+)"', block)
        title = re.search(r'\n\s*title:\s*"([^"]+)"', block)
        kind = re.search(r'\n\s*type:\s*"([a-z]+)"', block)
        if slug and title and kind:
            found.append({"slug": slug.group(1), "title": title.group(1), "type": kind.group(1)})
    return found


def main() -> int:
    # A list of slugs regenerates only those covers. Without it the script
    # rebuilds every drawn asset, which would overwrite a real photo or capture
    # that had been dropped over the placeholder.
    only = set(sys.argv[1:])

    if not only:
        print("paper texture:")
        make_paper()

    print("project covers:")
    for index, project in enumerate(read_projects(), start=1):
        if only and project["slug"] not in only:
            continue
        make_cover(project["slug"], project["title"], project["type"], index)

    if only:
        return 0

    print("portrait card:")
    make_portrait()

    print("instagram cards:")
    for slug, title, series in (
        ("maps", "Google Maps", "Practical features most people skip"),
        ("dorking", "Google Dorking", "Advanced search operators, with examples"),
        ("lens", "Google Lens", "Searching with a camera instead of words"),
        ("translate", "Google Translate", "Getting more out of Google Translate"),
    ):
        make_ig(slug, title, series)

    return 0


if __name__ == "__main__":
    sys.exit(main())
