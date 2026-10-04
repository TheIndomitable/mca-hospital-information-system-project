"""Verify each extracted diagram actually contains ink, then trim uniform white
borders so the diagram fills as much of the slide as possible."""
import os
from PIL import Image, ImageChops

OUT = r"E:\minor project HMS\deck-build\assets\diagrams"
TRIM = (248, 248, 248)      # near-white threshold
MARGIN = 12                 # px of white kept around the trimmed content

for fn in sorted(os.listdir(OUT)):
    if not fn.lower().endswith(".png"):
        continue
    p = os.path.join(OUT, fn)
    im = Image.open(p).convert("RGB")
    w, h = im.size

    bg = Image.new("RGB", im.size, TRIM)
    diff = ImageChops.difference(im, bg).convert("L")
    # anything clearly darker than the white background counts as content
    mask = diff.point(lambda v: 255 if v > 18 else 0)
    bbox = mask.getbbox()

    if bbox is None:
        print(f"{fn:<14} {w}x{h}  !! EMPTY - no ink found")
        continue

    ink = sum(mask.histogram()[255:]) / (w * h)
    bx0, by0, bx1, by1 = bbox
    touches = sum([bx0 <= 1, by0 <= 1, bx1 >= w - 2, by1 >= h - 2])

    new = (max(0, bx0 - MARGIN), max(0, by0 - MARGIN),
           min(w, bx1 + MARGIN), min(h, by1 + MARGIN))
    im.crop(new).save(p, optimize=True)
    nw, nh = new[2] - new[0], new[3] - new[1]

    flag = "tight" if touches >= 3 else ("ok" if touches else "loose")
    print(f"{fn:<14} {w}x{h} -> {nw}x{nh}  ink={ink*100:5.1f}%  "
          f"edges={touches} {flag}  {os.path.getsize(p)/1024:.0f}KB")
