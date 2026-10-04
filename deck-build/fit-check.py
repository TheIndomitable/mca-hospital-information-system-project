"""How large can each diagram get on a 13.3x7.5in slide if we keep the slide
title bar and centre the picture in the remaining area?"""
import os
from PIL import Image

OUT = r"E:\minor project HMS\deck-build\assets\diagrams"

SLIDE_W, SLIDE_H = 13.333, 7.5
TOP, SIDE, BOTTOM = 1.62, 0.45, 0.42     # title band, side margins, footer
AVAIL_W = SLIDE_W - 2 * SIDE
AVAIL_H = SLIDE_H - TOP - BOTTOM

print(f"available area: {AVAIL_W:.2f} x {AVAIL_H:.2f} in  "
      f"({AVAIL_W*AVAIL_H:.1f} sq in)\n")
print(f"{'file':<12}{'px':>12}{'aspect':>9}{'w in':>8}{'h in':>8}{'fill%':>8}  note")

for fn in sorted(os.listdir(OUT)):
    if not fn.lower().endswith(".png"):
        continue
    w, h = Image.open(os.path.join(OUT, fn)).size
    ar = w / h
    dw = min(AVAIL_W, AVAIL_H * ar)
    dh = dw / ar
    fill = (dw * dh) / (AVAIL_W * AVAIL_H) * 100
    note = "full bleed" if fill > 92 else ("small" if fill < 45 else "good")
    if w < 2000:
        note += " / LOW-RES SOURCE"
    print(f"{fn:<12}{w:>6}x{h:<5}{ar:>9.2f}{dw:>8.2f}{dh:>8.2f}{fill:>7.0f}%  {note}")
