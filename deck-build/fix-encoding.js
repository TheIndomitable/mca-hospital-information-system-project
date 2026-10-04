// fix-encoding.js - repair the mojibake em dash introduced by a PowerShell
// Get-Content/Set-Content round-trip, and pin the dash as an escape so it
// can never be corrupted by a shell round-trip again.
const fs = require("fs");
const p = "build.js";
let b = fs.readFileSync(p, "utf8");
const bad = "—";
const n = b.split(bad).length - 1;
b = b.split(bad).join("\u2014");
fs.writeFileSync(p, b, "utf8");
console.log(`repaired ${n} mojibake em dash(es) in ${p}`);
(b.match(/.*Hospital Information System.*/g) || []).forEach((l) => {
  const i = l.indexOf("System");
  console.log(JSON.stringify(l.slice(i, i + 34)));
});
