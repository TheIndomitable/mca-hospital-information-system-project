// dump-app.js - read docProps/app.xml straight out of the zip and show any
// non-ASCII bytes, so we can see exactly what trips the validator.
const fs = require("fs");
const zlib = require("zlib");

const pptx = process.argv[2];
const buf = fs.readFileSync(pptx);

// walk the central directory to find app.xml's local header offset
let eocd = -1;
for (let i = buf.length - 22; i >= 0; i--) {
  if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
}
if (eocd < 0) throw new Error("no EOCD");
let cdOff = buf.readUInt32LE(eocd + 16);
const cdCount = buf.readUInt16LE(eocd + 10);

for (let n = 0; n < cdCount; n++) {
  if (buf.readUInt32LE(cdOff) !== 0x02014b50) break;
  const nameLen = buf.readUInt16LE(cdOff + 28);
  const extraLen = buf.readUInt16LE(cdOff + 30);
  const commentLen = buf.readUInt16LE(cdOff + 32);
  const localOff = buf.readUInt32LE(cdOff + 42);
  const name = buf.toString("utf8", cdOff + 46, cdOff + 46 + nameLen);
  if (name === "docProps/app.xml") {
    const lNameLen = buf.readUInt16LE(localOff + 26);
    const lExtraLen = buf.readUInt16LE(localOff + 28);
    const dataStart = localOff + 30 + lNameLen + lExtraLen;
    const method = buf.readUInt16LE(localOff + 8);
    const compSize = buf.readUInt32LE(localOff + 18);
    const raw = buf.subarray(dataStart, dataStart + compSize);
    const xml = (method === 8 ? zlib.inflateRawSync(raw) : raw).toString("utf8");
    const bad = [...xml].map((c, i) => [c, i]).filter(([c]) => c.codePointAt(0) > 126);
    console.log("app.xml decoded as UTF-8, length", xml.length);
    console.log("non-ASCII chars:", bad.length);
    bad.slice(0, 20).forEach(([c, i]) => {
      console.log(`  U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")} ${JSON.stringify(c)} at char ${i}`);
    });
    break;
  }
  cdOff += 46 + nameLen + extraLen + commentLen;
}
