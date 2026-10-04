"""audit.py — QA the generated .pptx from its own XML (ground truth, not intent).

Flags, per slide:
  * shapes outside the 13.3 x 7.5 canvas
  * text frames overlapping other text frames
  * text frames whose estimated wrapped height exceeds their box (overflow)
  * content colliding with the footer band
"""
import math
import re
import sys
import zipfile
from xml.etree import ElementTree as ET

A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
EMU = 914400.0
W_IN, H_IN = 13.3, 7.5
FOOT_TOP = 6.94          # footer band starts here
SAFE = 0.06              # allowed bleed


def shape_boxes(slide_xml):
    root = ET.fromstring(slide_xml)
    out = []
    for sp in root.iter(f"{P}sp"):
        xfrm = sp.find(f"./{P}spPr/{A}xfrm")
        if xfrm is None:
            continue
        off, ext = xfrm.find(f"{A}off"), xfrm.find(f"{A}ext")
        if off is None or ext is None:
            continue
        x, y = int(off.get("x")) / EMU, int(off.get("y")) / EMU
        w, h = int(ext.get("cx")) / EMU, int(ext.get("cy")) / EMU
        # join runs inside a paragraph, then paragraphs with a newline, so a
        # bulleted / multi-line box is measured as what it actually renders as
        paras = []
        for para in sp.iter(f"{A}p"):
            runs = "".join(t.text or "" for t in para.iter(f"{A}t"))
            if runs.strip():
                paras.append(runs.strip())
        txt = "\n".join(paras).strip()
        sizes = [int(r.get("sz")) / 100 for r in sp.iter(f"{A}rPr") if r.get("sz")]
        sizes += [int(r.get("sz")) / 100 for r in sp.iter(f"{A}defRPr") if r.get("sz")]
        if not sizes:
            sizes = [18.0]
        out.append({"x": x, "y": y, "w": w, "h": h, "t": txt, "fs": max(sizes)})
    return out


def inter(a, b):
    ox = min(a["x"] + a["w"], b["x"] + b["w"]) - max(a["x"], b["x"])
    oy = min(a["y"] + a["h"], b["y"] + b["h"]) - max(a["y"], b["y"])
    return ox, oy


def audit(path):
    z = zipfile.ZipFile(path)
    names = sorted(
        (n for n in z.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)),
        key=lambda n: int(re.search(r"(\d+)", n.split("/")[-1]).group(1)),
    )
    issues = []
    for i, n in enumerate(names, 1):
        boxes = shape_boxes(z.read(n))
        texts = [b for b in boxes if b["t"]]

        for b in boxes:
            if b["x"] < -SAFE or b["y"] < -SAFE:
                issues.append((i, "OUT-OF-CANVAS(top/left)", b))
            if b["x"] + b["w"] > W_IN + SAFE:
                issues.append((i, "OUT-OF-CANVAS(right)", b))
            if b["y"] + b["h"] > H_IN + SAFE:
                issues.append((i, "OUT-OF-CANVAS(bottom)", b))

        # text vs text overlap
        for a in range(len(texts)):
            for c in range(a + 1, len(texts)):
                ox, oy = inter(texts[a], texts[c])
                if ox > 0.04 and oy > 0.04:
                    area = ox * oy
                    issues.append((i, f"TEXT-OVERLAP {area:.2f}sq", {**texts[a], "t": texts[a]["t"][:34] + " || " + texts[c]["t"][:34]}))

        # text vs shape overlap (text sitting on a filled box is fine; skip)
        # estimated wrapped overflow, per paragraph
        for b in texts:
            if not b["t"] or b["h"] <= 0:
                continue
            cpl = max(int((b["w"] * 72) / (b["fs"] * 0.50)), 1)
            lines = 0
            for para in b["t"].split("\n"):
                lines += max(1, math.ceil(len(para) / cpl))
            need = lines * b["fs"] * 1.30 / 72
            if need > b["h"] + 0.10:
                issues.append((i, f"TEXT-OVERFLOW need {need:.2f}in box {b['h']:.2f}in ({lines} lines @ {b['fs']:.1f}pt)", b))

        # footer collision
        for b in boxes:
            if not b["t"] or len(b["t"]) > 60:
                continue
            if b["y"] < FOOT_TOP and b["y"] + b["h"] > FOOT_TOP + 0.12:
                issues.append((i, "FOOTER-COLLISION", b))

    return len(names), issues


if __name__ == "__main__":
    total_issues = 0
    for path in sys.argv[1:]:
        count, issues = audit(path)
        print(f"\n=== {path.split(chr(92))[-1]}  ({count} slides) ===")
        by_slide = {}
        for slide_no, kind, b in issues:
            by_slide.setdefault(slide_no, []).append((kind, b))
        for slide_no in sorted(by_slide):
            print(f"  slide {slide_no}:")
            for kind, b in by_slide[slide_no][:6]:
                loc = f"@({b['x']:.2f},{b['y']:.2f}) {b['w']:.2f}x{b['h']:.2f}"
                print(f"    {kind:58} {loc}  {b['t'][:52]!r}")
            if len(by_slide[slide_no]) > 6:
                print(f"    ... +{len(by_slide[slide_no]) - 6} more")
        print(f"  TOTAL ISSUES: {len(issues)}")
        total_issues += len(issues)
    print(f"\nALL DECKS: {total_issues} issues")
