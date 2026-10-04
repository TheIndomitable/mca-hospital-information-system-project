"""Extract the DFD and ERD pages from the original project PDF at the highest
fidelity each page allows.

Strategy per page
  * If the diagram is one big embedded raster  -> pull the ORIGINAL pixels out
    with no resampling at all. PowerPoint downscales at display time, which is
    where supersampling looks best, so nothing is lost.
  * If the page is vector (or a Word drawing canvas) -> render with PyMuPDF at
    300 DPI, which is sharp at any zoom.

The top-right logo and the page's own title label are excluded where it is
geometrically safe to do so.
"""
import os
import pymupdf

PDF = r"E:\minor project HMS\Hospital Information system old.pdf"
OUT = r"E:\minor project HMS\deck-build\assets\diagrams"
os.makedirs(OUT, exist_ok=True)

RENDER_DPI = 300
MAX_PX = 5600
PAD = 10          # pt of white margin kept around the diagram

# name, pdf page, deck slide it replaces
PAGES = [
    ("dfd0",      5, 12),
    ("dfd1",      6, 13),
    ("dfd2_a",    7, 14),
    ("dfd2_b",    8, 15),
    ("dfd2_c",    9, 16),
    ("dfd2_d",   10, 17),
    ("dfd2_e",   11, 18),
    ("dfd2_f",   12, 19),
    ("erd1",     13, 21),
    ("erd2",     14, 22),
]

doc = pymupdf.open(PDF)


def is_logo(img, page):
    """The recurring small corner logo: sits in the top-right of every page."""
    r = img["rect"]
    return r.x0 > page.rect.width * 0.90 and r.y1 < page.rect.height * 0.15


def content_bbox(page):
    """Union of real diagram geometry: images (minus logo) and non-background
    vector drawings."""
    x0 = y0 = 1e9
    x1 = y1 = -1e9
    W, H = page.rect.width, page.rect.height

    for img in page.get_images(full=True):
        xref = img[0]
        for r in page.get_image_rects(xref):
            info = {"rect": r}
            if is_logo(info, page):
                continue
            # skip a full-page background raster
            if r.width > W * 0.97 and r.height > H * 0.97:
                continue
            x0, y0 = min(x0, r.x0), min(y0, r.y0)
            x1, y1 = max(x1, r.x1), max(y1, r.y1)

    for d in page.get_drawings():
        r = d["rect"]
        if r.is_empty or r.is_infinite:
            continue
        if r.width > W * 0.97 and r.height > H * 0.97:
            continue          # page background
        if r.width < 1 and r.height < 1:
            continue          # stray dot
        x0, y0 = min(x0, r.x0), min(y0, r.y0)
        x1, y1 = max(x1, r.x1), max(y1, r.y1)

    for b in page.get_text("blocks"):
        if not b[4].strip():
            continue
        r = pymupdf.Rect(b[:4])
        if r.x0 > W * 0.90 and r.y1 < H * 0.15:
            continue          # logo text
        x0, y0 = min(x0, r.x0), min(y0, r.y0)
        x1, y1 = max(x1, r.x1), max(y1, r.y1)

    if x0 > x1:
        return pymupdf.Rect(0, 0, W, H)
    return pymupdf.Rect(x0, y0, x1, y1)


def dominant_raster(page):
    """Largest embedded image, if it effectively IS the whole diagram."""
    W, H = page.rect.width, page.rect.height
    best = None
    for img in page.get_images(full=True):
        xref = img[0]
        if is_logo({"rect": page.get_image_rects(xref)[0]}, page):
            continue
        for r in page.get_image_rects(xref):
            if r.width > W * 0.97 and r.height > H * 0.97:
                continue
            if best is None or r.get_area() > best[1].get_area():
                best = (xref, r)
    if best is None:
        return None
    xref, r = best
    area_frac = r.get_area() / (W * H)
    return (xref, r, area_frac)


def title_bottom(page):
    """Lowest y of the page's own title label, so we can crop it away."""
    W, H = page.rect.width, page.rect.height
    lo = None
    for b in page.get_text("blocks"):
        t = " ".join(b[4].split()).upper()
        if not t or len(t) > 30:
            continue
        if not ("DFD" in t or t == "ERD" or t == "ER D"):
            continue
        if b[1] < H * 0.20:
            lo = b[3] if lo is None else max(lo, b[3])
    return lo


rows = []
for name, pno, slide in PAGES:
    page = doc[pno - 1]
    bbox = content_bbox(page)
    tb = title_bottom(page)
    crop = pymupdf.Rect(bbox.x0 - PAD, bbox.y0 - PAD,
                       bbox.x1 + PAD, bbox.y1 + PAD) & page.rect

    method = "render"
    xref = None
    if tb is not None and crop.y0 <= tb:
        # title overlaps the crop top -> only trim if nothing is above it
        if bbox.y0 > tb + 2:
            crop.y0 = bbox.y0 - PAD
    if crop.y0 > 0 and (tb is not None and crop.y0 <= tb + 2):
        method = "render (title kept)"

    dom = dominant_raster(page)
    if dom and dom[2] > 0.55 and dom[1].get_area() > 0.5 * page.rect.get_area():
        xref = dom[0]

    path = os.path.join(OUT, f"{name}.png")
    if xref is not None:
        # Pull the original bytes and rebuild the true appearance.
        #  - a PNG alpha channel must be composited onto white, not dropped
        #  - a soft-masked image has a BLACK base and the artwork lives in the
        #    SMask, which has to be used as the alpha channel
        import io
        from PIL import Image as PILImage

        info = doc.extract_image(xref)
        im = PILImage.open(io.BytesIO(info["image"]))
        smask = info.get("smask", 0)
        if smask:
            mk = PILImage.open(io.BytesIO(doc.extract_image(smask)["image"]))
            if mk.mode != "L":
                mk = mk.convert("L")
            if mk.size != im.size:
                mk = mk.resize(im.size, PILImage.LANCZOS)
            im = im.convert("RGBA")
            im.putalpha(mk)
        if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
            im = im.convert("RGBA")
            flat = PILImage.new("RGBA", im.size, (255, 255, 255, 255))
            im = PILImage.alpha_composite(flat, im)
        im = im.convert("RGB")
        if im.width > MAX_PX:
            nh = round(im.height * MAX_PX / im.width)
            im = im.resize((MAX_PX, nh), PILImage.LANCZOS)
        im.save(path, optimize=True)
        px = im.size
        method = f"native {im.width}x{im.height}" + (" +smask" if smask else "")
    else:
        px = None

    if px is None:
        zoom = RENDER_DPI / 72.0
        if crop.width * zoom > MAX_PX:
            zoom = MAX_PX / crop.width
        pm = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=crop, alpha=False)
        pm.save(path)
        px = (pm.width, pm.height)
        method = f"render {RENDER_DPI}dpi clip={crop.width:.0f}x{crop.height:.0f}pt"

    kb = os.path.getsize(path) / 1024
    print(f"slide {slide:>2}  {name:<9} pdf p{pno:<3} {px[0]}x{px[1]}px  {kb:7.0f} KB  {method}")

print(f"\nwrote {len(PAGES)} diagrams to {OUT}")
