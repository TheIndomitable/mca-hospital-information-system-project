"""Sample the border/background colour of each extracted diagram so we know which
ones carry their own slide background and which sit on white."""
import os
from PIL import Image

OUT = r"E:\minor project HMS\deck-build\assets\diagrams"

for fn in sorted(os.listdir(OUT)):
    if not fn.lower().endswith(".png"):
        continue
    im = Image.open(os.path.join(OUT, fn)).convert("RGB")
    w, h = im.size
    pts = {
        "TL": (4, 4), "TR": (w - 5, 4), "BL": (4, h - 5), "BR": (w - 5, h - 5),
        "C": (w // 2, h // 2),
    }
    cols = {k: im.getpixel(v) for k, v in pts.items()}
    uniq = {c for c in cols.values() if not (c[0] > 238 and c[1] > 238 and c[2] > 238)}
    kind = "white bg" if not uniq else "COLOURED bg"
    desc = "  ".join(f"{k}={c}" for k, c in cols.items())
    print(f"{fn:<14} {w:>5}x{h:<5} {kind:<13} {desc}")
