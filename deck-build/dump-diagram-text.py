"""Dump all text from the diagram pages so we can map each source diagram to the
correct deck slide (and confirm how many DFD/ERD slides need a source)."""
import pymupdf

PDF = r"E:\minor project HMS\Hospital Information system old.pdf"

doc = pymupdf.open(PDF)
for pno in range(5, 15):
    page = doc[pno - 1]
    print(f"\n########## page {pno}")
    words = page.get_text("words")
    # group into visual rows so the structure is readable
    rows = {}
    for w in words:
        key = round(w[1] / 12)
        rows.setdefault(key, []).append(w)
    for key in sorted(rows):
        ws = sorted(rows[key], key=lambda w: w[0])
        line = "  ".join(w[4] for w in ws)
        if line.strip():
            print(f"  y={ws[0][1]:6.0f}  {line[:150]}")
