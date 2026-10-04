"""Scan the original project PDF and locate every DFD / ERD / use-case diagram page."""
import re
import pymupdf

PDF = r"E:\minor project HMS\Hospital Information system old.pdf"

KEYS = re.compile(
    r"(data\s*flow\s*diagram|\bDFD\b|entity[\s\-]*relationship|\bERD\b|"
    r"context\s*diagram|level\s*[-]?\s*[0123]|use\s*case\s*diagram|"
    r"ER\s*diagram|data\s*flow)",
    re.I,
)

doc = pymupdf.open(PDF)
print(f"pages: {doc.page_count}")

hits = []
for i, page in enumerate(doc):
    txt = page.get_text().strip()
    head = " / ".join(t.strip() for t in txt.splitlines()[:6] if t.strip())
    found = sorted({m.group(0).strip() for m in KEYS.finditer(txt)})
    imgs = page.get_images(full=True)
    drawings = page.get_drawings()
    if found or imgs or len(drawings) > 40:
        hits.append((i + 1, len(imgs), len(drawings), found, head[:110]))

for n, ni, nd, found, head in hits:
    tag = ", ".join(found) if found else "-"
    print(f"p{n:>3}  imgs={ni:<3} draws={nd:<5} [{tag}]  {head}")
