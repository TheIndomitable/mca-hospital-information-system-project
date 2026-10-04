// repair-mojibake.js
// A PowerShell Get-Content/Set-Content round-trip re-encoded UTF-8 bytes as
// cp1252, turning "—" into the three chars "â€”". This finds and repairs
// every such sequence in the deck sources, and reports anything it cannot fix
// so nothing is silently shipped.
const fs = require("fs");

const FILES = ["content.js", "kit.js", "diagrams.js", "theme.js", "build.js", "fix-encoding.js"];

const FIXES = [
  ["â€”", "—"], // em dash
  ["â€“", "–"], // en dash
  ["â€˜", "‘"],
  ["â€™", "’"],
  ["â€œ", "“"],
  ["â€\u009d", "”"],
  ["â€¦", "…"],
  ["Â ", " "],
  ["Â·", "·"],
  ["Â", ""],
];

// any U+0080-U+009F control char is a broken cp1252 artefact
const CTRL = /[-]/g;

let total = 0;
for (const f of FILES) {
  if (!fs.existsSync(f)) continue;
  const before = fs.readFileSync(f, "utf8");
  let after = before;
  for (const [bad, good] of FIXES) after = after.split(bad).join(good);
  const ctrl = (after.match(CTRL) || []).length;
  after = after.replace(CTRL, "");
  if (after !== before) {
    fs.writeFileSync(f, after, "utf8");
    total++;
    console.log(`fixed ${f}`);
  }
  const left = [...after].filter((c) => {
    const p = c.codePointAt(0);
    return (p >= 0x80 && p <= 0x9f) || p === 0xe2;
  });
  if (left.length) console.log(`  !! ${f} still has ${left.length} suspicious char(s): ${JSON.stringify(left.slice(0, 10))}`);
}
console.log(total ? `${total} file(s) repaired` : "no mojibake found");
