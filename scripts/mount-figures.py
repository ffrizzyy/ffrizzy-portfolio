"""Mount real figures as designed plates, and prepare the UI captures.

Why mounting is needed: a figure lifted from a paper or a notebook arrives as a
bare matplotlib or diagram export on a white field. Dropped straight into the
bento it looks like a screenshot of someone else's document, and it clashes with
every other cover. Mounting it on the design system's paper, inside a rule, with
its title and a caption, makes it a plate in the same language as the rest.

Nothing here invents a figure. Every mounted image is a figure the author
produced, extracted from their own notebook, paper, or live application.

The sources live outside the repository, so this script is kept as the record of
how the assets were made rather than as something to re-run blind. Each output
lands in public/images/ under the slug the site already expects.

Run: python scripts/mount-figures.py
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
CAPTURES = Path(r"D:\SYSTEM\Documents\deepseek-harness\default-workspace\.captures")
IMAGES = ROOT / "public" / "images"

PAPER = (236, 237, 237)
INK = (17, 18, 20)
INK_MUTED = (74, 77, 82)
SIGNAL = (226, 104, 58)

W, H = 1600, 1000
MARGIN = 40
INNER = MARGIN + 52

_font_path: Path | None = None


def font_file() -> Path:
    global _font_path
    if _font_path is None:
        _font_path = Path(__file__).resolve().parent / ".fonts" / "BricolageGrotesque.ttf"
    return _font_path


def display(size: int, weight: int = 800) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(font_file()), size)
    try:
        axes = font.get_variation_axes()
        values = []
        for axis in axes:
            tag = axis["name"] if isinstance(axis, dict) else getattr(axis, "name", b"")
            if isinstance(tag, bytes):
                tag = tag.decode("ascii", "ignore")
            values.append(weight if str(tag).lower().startswith("wght") else axis["default"])
        font.set_variation_by_axes(values)
    except Exception:  # noqa: BLE001
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


def mount(figure: Path, slug: str, title: str, kicker: str, caption: str) -> None:
    """Figure on the right inside a rule, title and caption on the left."""
    canvas = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((MARGIN, MARGIN, W - MARGIN - 1, H - MARGIN - 1), outline=INK, width=3)

    # The figure sits in a fixed box so plates line up whatever the source shape.
    box = (860, 190, W - INNER, H - 190)
    box_w, box_h = box[2] - box[0], box[3] - box[1]

    source = Image.open(figure).convert("RGB")
    scale = min(box_w / source.width, box_h / source.height)
    size = (max(1, int(source.width * scale)), max(1, int(source.height * scale)))
    resized = source.resize(size, Image.LANCZOS)

    fx = box[0] + (box_w - size[0]) // 2
    fy = box[1] + (box_h - size[1]) // 2
    canvas.paste(resized, (fx, fy))
    draw.rectangle((fx - 1, fy - 1, fx + size[0], fy + size[1]), outline=INK, width=2)

    head = mono(24)
    tracked(draw, (INNER, MARGIN + 52), kicker.upper(), head, INK_MUTED, 3)

    font = display(76)
    lines = wrap(draw, title, font, 640)
    while len(lines) > 3 and font.size > 46:
        font = display(font.size - 6)
        lines = wrap(draw, title, font, 640)
    y = 330
    for line in lines:
        draw.text((INNER, y), line, font=font, fill=INK)
        y += int(font.size * 1.06)
    draw.rectangle((INNER, y + 16, INNER + 130, y + 26), fill=SIGNAL)

    body = mono(21)
    for index, line in enumerate(wrap(draw, caption, body, 620)):
        draw.text((INNER, y + 58 + index * 32), line, font=body, fill=INK_MUTED)

    out = IMAGES / f"{slug}.webp"
    canvas.save(out, "WEBP", quality=88, method=6)
    print(f"  {out.name:32} {out.stat().st_size:>8,} bytes   from {figure.name}")


def content_box(image: Image.Image, threshold: int = 28):
    """Bounding box of everything that is not near-black.

    Figma letterboxes exported frames on black, so the real prototype is the
    bright region. Cropping to it removes the bars without hand-guessing pixels.
    """
    array = np.asarray(image.convert("L"))
    mask = array > threshold
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    if rows.size == 0 or cols.size == 0:
        return (0, 0, image.width, image.height)
    return (int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1)


def to_cover(source: Path, slug: str, crop_box=None, offset_y: float = 0.0) -> None:
    """Fit a UI capture to 16:10, cropping the overflow."""
    image = Image.open(source).convert("RGB")
    if crop_box is None:
        crop_box = content_box(image)
    image = image.crop(crop_box)
    print(f"    {source.name}: cropped to {image.width}x{image.height}")

    target_ratio = W / H
    ratio = image.width / image.height
    if ratio > target_ratio:
        new_w = int(image.height * target_ratio)
        left = (image.width - new_w) // 2
        image = image.crop((left, 0, left + new_w, image.height))
    else:
        new_h = int(image.width / target_ratio)
        top = int((image.height - new_h) * offset_y)
        image = image.crop((0, top, image.width, top + new_h))

    image = image.resize((W, H), Image.LANCZOS)
    out = IMAGES / f"{slug}.webp"
    image.save(out, "WEBP", quality=87, method=6)
    print(f"  {out.name:32} {out.stat().st_size:>8,} bytes   from {source.name}")


def main() -> int:
    if not font_file().exists():
        print(f"missing font: {font_file()}")
        return 1

    print("mounted figures:")
    mount(
        CAPTURES / "nb-03.png",
        "imdb-sentiment-bilstm",
        "IMDB Sentiment Capstone",
        "Model evaluation",
        "Training against validation accuracy across 20 epochs. Validation settles near 0.877 while "
        "training climbs past 0.94, and the held-out test set scores 0.8800 on 2,491 reviews.",
    )
    mount(
        CAPTURES / "docx-rice-image6.png",
        "rice-clustering",
        "Rice Production Clustering",
        "Cluster selection",
        "Average distance to the nearest centroid against k. The bend at three is what chose the "
        "number of productivity clusters.",
    )
    mount(
        CAPTURES / "topsis-05.png",
        "topsis-smart",
        "TOPSIS vs SMART",
        "Method",
        "The two decision paths compared in the paper: TOPSIS on the left, SMART on the right, "
        "converging on one ranking.",
    )
    mount(
        CAPTURES / "cobit-03.png",
        "cobit-audit",
        "COBIT 2019 Hospital Audit",
        "Method",
        "Scoping the COBIT process objectives, gathering evidence by observation, interview and "
        "questionnaire, then the as-is against to-be capability gap analysis.",
    )

    print("\nUI captures:")
    to_cover(CAPTURES / "aid-dashboard-embed.png", "aid-dashboard")
    # Figma letterboxes the frame on black and runs a cookie bar across the whole
    # bottom edge. That bar is bright, so detecting the content box reports the
    # full width and the crop then slides sideways, clipping the nav. The
    # prototype rectangle is given explicitly instead.
    to_cover(
        CAPTURES / "sat-set.png",
        "sat-set",
        crop_box=(230, 58, 1370, 872),
        offset_y=0.0,
    )

    return 0


if __name__ == "__main__":
    sys.exit(main())
