"""Inspect each diagram page: page size, embedded image resolution, and the
content bounding box, so we can crop tight and pick a safe render DPI."""
import pymupdf

PDF = r"E:\minor project HMS\Hospital Information system old.pdf"
PAGES = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

doc = pymupdf.open(PDF)

for pno in PAGES:
    page = doc[pno - 1]
    pr = page.rect
    print(f"\n=== page {pno}  page={pr.width:.0f}x{pr.height:.0f}pt "
          f"({pr.width/72:.2f}x{pr.height/72:.2f}in) rot={page.rotation}")

    for img in page.get_images(full=True):
        xref = img[0]
        info = doc.extract_image(xref)
        rects = page.get_image_rects(xref)
        for r in rects:
            wpt = r.width / 72
            hpt = r.height / 72
            eff = info["width"] / wpt if wpt else 0
            print(f"   img xref={xref:<5} {info['width']}x{info['height']}px "
                  f"{info['ext']:<4} placed {wpt:.1f}x{hpt:.1f}in "
                  f"-> {eff:.0f} DPI  rect=({r.x0:.0f},{r.y0:.0f},{r.x1:.0f},{r.y1:.0f})")

    d = page.get_drawings()
    if d:
        xs0 = min(x["rect"].x0 for x in d)
        ys0 = min(x["rect"].y0 for x in d)
        xs1 = max(x["rect"].x1 for x in d)
        ys1 = max(x["rect"].y1 for x in d)
        print(f"   drawings bbox=({xs0:.0f},{ys0:.0f},{xs1:.0f},{ys1:.0f}) n={len(d)}")

    blocks = page.get_text("blocks")
    for b in sorted(blocks, key=lambda b: b[1])[:4]:
        t = " ".join(b[4].split())[:60]
        print(f"   text ({b[0]:.0f},{b[1]:.0f},{b[2]:.0f},{b[3]:.0f}) {t!r}")
