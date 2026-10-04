import re, pathlib, json

root = pathlib.Path(r"E:\minor project HMS\hms\backend")
out = {"tables": [], "routes": []}

for f in sorted((root / "models").glob("*.py")):
    if f.name == "__init__.py":
        continue
    t = f.read_text(encoding="utf-8", errors="replace")
    m = re.search(r'__tablename__\s*=\s*"([^"]+)"', t)
    if not m:
        continue
    tbl = m.group(1)
    fks = []
    for fm in re.finditer(r'ForeignKey\(\s*"([^"]+)"', t):
        ref = fm.group(1).split(".")[0]
        if ref not in fks:
            fks.append(ref)
    out["tables"].append({"table": tbl, "fks": fks})

total = 0
for f in sorted((root / "routers").glob("*.py")):
    t = f.read_text(encoding="utf-8", errors="replace")
    pm = re.search(r'APIRouter\((.*?)\)\s*\n', t, re.S)
    prefix = ""
    if pm:
        pr = re.search(r'prefix\s*=\s*"([^"]+)"', pm.group(1))
        if pr:
            prefix = pr.group(1)
    paths = []
    for rm in re.finditer(r'@router\.(get|post|put|patch|delete)\(\s*(?:"([^"]*)"|\'([^\']*)\')', t):
        paths.append((rm.group(1).upper(), rm.group(2) if rm.group(2) is not None else rm.group(3)))
    total += len(paths)
    out["routes"].append({"file": f.stem, "prefix": prefix, "count": len(paths), "paths": paths})

print("TABLES:", len(out["tables"]), " ENDPOINTS:", total)
print("\n== TABLES -> FKs ==")
for t in out["tables"]:
    print(f'{t["table"]:24} <- {", ".join(t["fks"])}')
print("\n== ROUTERS ==")
for r in out["routes"]:
    print(f'{r["prefix"] or "/"+(r["file"]):26} {r["count"]:>3}  ' + " ".join(f"{m} {p}" for m, p in r["paths"][:40]))
pathlib.Path("facts.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
