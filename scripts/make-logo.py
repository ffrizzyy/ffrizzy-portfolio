"""Export the ffr mark as a usable asset pack.

The site only ever needed a favicon, so the mark exists at 256px and 180px. This
exports the same design at the sizes people actually ask for, plus two variants
that the favicon cannot provide: a transparent version for placing the mark on a
photograph or a dark background, and an inverse version in paper colour for dark
surfaces.

The geometry is the same as scripts/make-icons.py, so the pack and the favicon
cannot drift apart: same wordmark, same optical centring, same single signal
notch.

Run: python scripts/make-logo.py
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = Path(__file__).resolve().parent / ".fonts" / "BricolageGrotesque.ttf"
OUT = ROOT / "brand"

WORDMARK = "ffr"
PAPER = (236, 237, 237)
INK = (17, 18, 20)
SIGNAL = (226, 104, 58)


def display(size: int, weight: int = 800) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(FONT), size)
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


def draw_mark(size: int, ink, background, border: int, notch_on: bool) -> Image.Image:
    mode = "RGBA"
    image = Image.new(mode, (size, size), background)
    draw = ImageDraw.Draw(image)

    if border:
        draw.rectangle([0, 0, size - 1, size - 1], outline=ink, width=border)

    padding = int(size * 0.17)
    target = size - padding * 2
    font_size = int(size * 0.62)
    while font_size > 8:
        font = display(font_size)
        width = sum(draw.textlength(c, font=font) for c in WORDMARK) + int(font_size * 0.02) * 2
        if width <= target:
            break
        font_size -= 2

    font = display(font_size)
    tracking = max(1, int(font_size * 0.01))
    total = sum(draw.textlength(c, font=font) for c in WORDMARK) + tracking * (len(WORDMARK) - 1)

    bbox = draw.textbbox((0, 0), WORDMARK, font=font)
    text_height = bbox[3] - bbox[1]
    x = (size - total) / 2
    y = (size - text_height) / 2 - bbox[1] - size * 0.02

    cursor = int(x)
    for char in WORDMARK:
        draw.text((cursor, int(y)), char, font=font, fill=ink)
        cursor += int(draw.textlength(char, font=font)) + tracking

    if notch_on:
        notch = max(3, int(size * 0.055))
        draw.rectangle(
            [size - padding - notch, size - padding - notch, size - padding, size - padding],
            fill=SIGNAL,
        )
    return image


def save(image: Image.Image, name: str) -> None:
    path = OUT / name
    image.save(path, "PNG", optimize=True)
    print(f"  {path.relative_to(ROOT)!s:38} {image.size[0]:>5}px  {path.stat().st_size:>7,} bytes")


def main() -> int:
    if not FONT.exists():
        print(f"font missing: {FONT}")
        return 1
    OUT.mkdir(parents=True, exist_ok=True)

    # Diagnose the favicon first: the code draws a four sided border, so if the
    # shipped file shows only two edges then it was not produced by this code.
    favicon = ROOT / "src" / "app" / "icon.png"
    if favicon.exists():
        icon = Image.open(favicon).convert("RGB")
        w, h = icon.size
        mid = w // 2
        print("shipped favicon border sample (is the frame complete?):")
        for label, xy in (
            ("top edge", (mid, 1)),
            ("bottom edge", (mid, h - 2)),
            ("left edge", (1, mid)),
            ("right edge", (w - 2, mid)),
        ):
            r, g, b = icon.getpixel(xy)
            dark = r < 90 and g < 90 and b < 90
            print(f"  {label:12} rgb({r:3},{g:3},{b:3})  {'dark' if dark else 'paper'}")
        print()

    print("logo pack:")
    for size in (1024, 512, 256, 128, 64):
        save(draw_mark(size, INK, PAPER, border=max(2, size // 32), notch_on=True),
             f"ffr-logo-{size}.png")

    print("\ntransparent mark, for photographs and dark surfaces:")
    for size in (512, 256):
        save(draw_mark(size, INK, (0, 0, 0, 0), border=0, notch_on=True),
             f"ffr-mark-dark-{size}.png")
        save(draw_mark(size, PAPER, (0, 0, 0, 0), border=0, notch_on=True),
             f"ffr-mark-light-{size}.png")

    return 0


if __name__ == "__main__":
    sys.exit(main())
