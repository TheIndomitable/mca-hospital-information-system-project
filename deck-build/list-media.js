// list-media.js - list the image parts inside a .pptx with their real pixel
// dimensions, so we can prove the source diagrams were embedded at full size
// and not downsampled.
const fs = require("fs");
const zlib = require("zlib");

const buf = fs.readFileSync(process.argv[2]);

let eocd = -1;
for (let i = buf.length - 22; i >= 0; i--) {
  if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
}
if (eocd < 0) throw new Error("no EOCD - not a zip");

let off = buf.readUInt32LE(eocd + 16);
const n = buf.readUInt16LE(eocd + 10);
const media = [];

for (let k = 0; k < n; k++) {
  if (buf.readUInt32LE(off) !== 0x02014b50) break;
  const nl = buf.readUInt16LE(off + 28);
  const el = buf.readUInt16LE(off + 30);
  const cl = buf.readUInt16LE(off + 32);
  const name = buf.toString("utf8", off + 46, off + 46 + nl);
  const local = buf.readUInt32LE(off + 42);
  const compSize = buf.readUInt32LE(off + 20);
  if (/^ppt\/media\//.test(name)) media.push({ name, compSize, local });
  off += 46 + nl + el + cl;
}

console.log(`media parts: ${media.length}`);
let tot = 0;
for (const m of media) {
  const lnl = buf.readUInt16LE(m.local + 26);
  const lel = buf.readUInt16LE(m.local + 28);
  const ds = m.local + 30 + lnl + lel;
  const method = buf.readUInt16LE(m.local + 8);
  const raw = buf.subarray(ds, ds + m.compSize);
  let dim = "";
  try {
    const b = method === 8 ? zlib.inflateRawSync(raw) : raw;
    if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
      dim = `${b.readUInt32BE(16)}x${b.readUInt32BE(20)}`;
    } else if (b.length > 2 && b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length - 9) {
        if (b[i] !== 0xff) { i++; continue; }
        const mk = b[i + 1];
        const len = b.readUInt16BE(i + 2);
        if (mk >= 0xc0 && mk <= 0xcf && mk !== 0xc4 && mk !== 0xc8 && mk !== 0xcc) {
          dim = `${b.readUInt16BE(i + 7)}x${b.readUInt16BE(i + 5)}`;
          break;
        }
        i += 2 + len;
      }
    }
  } catch (e) { dim = "?"; }
  tot += m.compSize;
  console.log(`  ${m.name.padEnd(28)} ${dim.padEnd(12)} ${(m.compSize / 1024).toFixed(0)} KB`);
}
console.log(`total media: ${(tot / 1024).toFixed(0)} KB`);
