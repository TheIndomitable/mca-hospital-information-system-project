"""Contact sheet of the 10 slides that now carry the original hand-drawn
diagrams, so the whole set can be checked in one glance."""
import os
from PIL import Image, ImageDraw

QA = r"E:\minor project HMS\qa"
SLIDES = [12, 13, 14, 15, 16, 17, 18, 19, 21, 22]
LABELS = {
    12: "DFD L0  (pdf p5)",  13: "DFD L1  (p6)", 14: "DFD L2  (p7)",
    15: "DFD L2  (p8)",  16: "DFD L2  (p9)", 17: "DFD L2  (p10)",
    18: "DFD L2  (p11)", 19: "DFD L2  (p12)", 21: "ERD 1  (p13)",
    22: "ERD 2  (p14)",
}

COLS, TW = 2, 900
PAD, CAP = 18, 30

for theme in ("legacy", "modern"):
    thumbs = []
    for s in SLIDES:
        p = os.path.join(QA, theme, f"Slide{s}.PNG")
        if not os.path.exists(p):
            p = os.path.join(QA, theme, f"Slide{s}.png")
        im = Image.open(p).convert("RGB")
        th = round(im.height * TW / im.width)
        thumbs.append((s, im.resize((TW, th), Image.LANCZOS)))

    rows = (len(thumbs) + COLS - 1) // COLS
    rh = max(t[1].height for t in thumbs) + CAP
    W = COLS * TW + (COLS + 1) * PAD
    H = rows * rh + (rows + 1) * PAD
    sheet = Image.new("RGB", (W, H), (28, 30, 34))
    d = ImageDraw.Draw(sheet)

    for i, (s, im) in enumerate(thumbs):
        r, c = divmod(i, COLS)
        x = PAD + c * (TW + PAD)
        y = PAD + r * (rh + PAD)
        sheet.paste(im, (x, y + CAP))
        d.rectangle([x, y + CAP, x + TW - 1, y + CAP + im.height - 1],
                    outline=(90, 95, 105), width=1)
        d.text((x + 4, y + 8), f"slide {s}   {LABELS[s]}", fill=(235, 235, 235))

    out = os.path.join(QA, f"source-diagrams-{theme}.png")
    sheet.save(out, optimize=True)
    print(f"{out}  {sheet.width}x{sheet.height}  {os.path.getsize(out)/1024:.0f} KB")
