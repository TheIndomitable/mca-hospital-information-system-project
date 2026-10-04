"""Check whether the black-looking diagram images carry a soft mask (SMask).
If they do, the real artwork is in the mask and the base image is black."""
import pymupdf

PDF = r"E:\minor project HMS\Hospital Information system old.pdf"
doc = pymupdf.open(PDF)

for pno, xref in [(6, 149), (11, 289), (12, 305), (5, 136), (8, 222), (10, 276)]:
    info = doc.extract_image(xref)
    print(f"p{pno} xref={xref}: ext={info['ext']} {info['width']}x{info['height']} "
          f"bpc={info['bpc']} cs={info['colorspace']} smask={info.get('smask')} "
          f"colors={info.get('colors')}  bytes={len(info['image'])}")
