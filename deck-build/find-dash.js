// find-dash.js - report where em dashes / mojibake dashes live in the sources
// and in the built app.xml slide titles.
const fs = require("fs");

const EM = "\u2014";
const MOJI = "\u00e2\u20ac\u201d";

for (const f of ["content.js", "kit.js", "diagrams.js", "theme.js", "build.js"]) {
  const b = fs.readFileSync(f, "utf8");
  const em = (b.match(new RegExp(EM, "g")) || []).length;
  const mo = (b.match(new RegExp(MOJI, "g")) || []).length;
  console.log(`${f.padEnd(14)} em-dash=${em}  mojibake-dash=${mo}`);
}

console.log("\n--- titles containing a dash ---");
const c = fs.readFileSync("content.js", "utf8");
const re = /title:\s*"([^"]*)"/g;
let m;
while ((m = re.exec(c))) {
  if (m[1].includes(EM) || m[1].includes(MOJI)) console.log("  " + JSON.stringify(m[1]));
}
