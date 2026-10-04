// diagrams.js — every diagram is built from native, editable PowerPoint shapes.
// No images: each node/arrow/label stays selectable and editable in PowerPoint.

const PptxGenJS = require("pptxgenjs");
const { M, CW, BODY_Y } = require("./kit");

const BOT = 6.72; // bottom of the diagram band (above the footer)

// ------------------------------------------------------------------ notation
const extBox = (d, s, o) => {
  d.solid(s, o.x, o.y, o.w, o.h, T2(d).actor, T2(d).hair);
  d.text(s, o.t, {
    x: o.x + 0.08, y: o.y, w: o.w - 0.16, h: o.h,
    fontFace: d.T.fontHead, fontSize: o.fs || 11, bold: true,
    color: T2(d).actorText, align: "center", valign: "middle", lsm: 1.02,
  });
};

const T2 = (d) => ({ ...d.T.sem, hair: d.T.hair });

const procBox = (d, s, o) => {
  d.solid(s, o.x, o.y, o.w, o.h, T2(d).process, T2(d).hair);
  // labelX/labelW let callers reserve a gutter on the left for the step number
  const lx = o.labelX != null ? o.labelX : o.x + 0.08;
  const lw = o.labelW != null ? o.labelW : o.w - 0.16;
  d.text(s, o.t, {
    x: lx, y: o.y, w: lw, h: o.h,
    fontFace: d.T.fontHead, fontSize: o.fs || 11, bold: true,
    color: T2(d).processText, align: "center", valign: "middle", lsm: 1.02,
  });
};

const storeBox = (d, s, o) => {
  // cylinder = classic DFD data store
  s.addShape(d.ST.can, {
    x: o.x, y: o.y, w: o.w, h: o.h,
    fill: { color: T2(d).data },
    line: { color: T2(d).hair, width: 0.75 },
  });
  d.text(s, o.t, {
    x: o.x + 0.1, y: o.y, w: o.w - 0.2, h: o.h,
    fontFace: d.T.fontHead, fontSize: o.fs || 10.5, bold: true,
    color: T2(d).dataText, align: "center", valign: "middle", lsm: 1.02,
  });
};

// dashed connector carrying a small caption
const flow = (d, s, x1, y1, x2, y2, caption, side) => {
  d.line(s, x1, y1, x2, y2, { color: d.T.sem.line, width: 1.4, arrow: true });
  if (!caption) return;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const w = 0.28 + caption.length * 0.058;
  const ox = side === "up" ? -w / 2 : side === "down" ? -w / 2 : 0.08;
  const oy = side === "up" ? -0.26 : side === "down" ? 0.03 : -0.13;
  d.solid(s, mx + ox, my + oy, w, 0.23, d.T.bg, null);
  d.text(s, caption, {
    x: mx + ox, y: my + oy, w, h: 0.23,
    fontSize: 8.5, align: "center", valign: "middle", color: d.T.muted, italic: true,
  });
};

const legend = (d, s, items, y) => {
  let x = M;
  items.forEach((it) => {
    if (it.shape === "can") {
      s.addShape(d.ST.can, {
        x, y: y + 0.02, w: 0.26, h: 0.2,
        fill: { color: it.fill }, line: { color: d.T.hair, width: 0.75 },
      });
    } else {
      d.solid(s, x, y + 0.03, 0.26, 0.18, it.fill, d.T.hair);
    }
    const tw = Math.max(it.t.length * 0.062 + 0.08, 0.5);
    d.text(s, it.t, {
      x: x + 0.33, y, w: tw, h: 0.26,
      fontSize: 9, color: d.T.muted, valign: "middle",
    });
    x += 0.33 + tw + 0.34;
  });
};

const DFD_LEGEND = [
  { shape: "rect", fill: null, t: "External entity" },
  { shape: "rect", fill: null, t: "Process" },
  { shape: "can", fill: null, t: "Data store" },
  { shape: "rect", fill: null, t: "Data flow" },
];

// ------------------------------------------------------------------ 3-tier architecture
function architecture(d, s, o) {
  const T = d.T, sem = T.sem;
  const bands = [
    { y: 1.95, h: 1.35, name: "PRESENTATION LAYER", tint: T.bgAlt, items: o.front },
    { y: 3.44, h: 1.42, name: "APPLICATION LAYER", tint: T.dark, dark: true, items: o.back },
    { y: 5.00, h: 1.35, name: "DATA LAYER", tint: T.bgAlt, items: o.data },
  ];
  bands.forEach((b) => {
    d.solid(s, M, b.y, CW, b.h, b.tint, b.dark ? null : T.hair);
    d.solid(s, M, b.y + 0.2, 0.11, b.h - 0.4, b.dark ? T.aqua : T.primary, null);
    d.text(s, b.name, {
      x: M + 0.3, y: b.y + 0.16, w: 2.5, h: 0.3,
      fontFace: T.fontHead, fontSize: 10.5, bold: true, charSpacing: 1.6,
      color: b.dark ? T.aqua : T.primary,
    });
    const n = b.items.length;
    const availW = CW - 3.35;
    const gap = 0.16;
    const iw = (availW - (n - 1) * gap) / n;
    b.items.forEach((it, i) => {
      const x = M + 2.95 + i * (iw + gap);
      const y = b.y + 0.3;
      const ih = b.h - 0.6;
      d.solid(s, x, y, iw, ih, b.dark ? T.dark2 : "FFFFFF", b.dark ? sem.line : T.hair);
      d.text(s, it.n, {
        x: x + 0.1, y: y + 0.06, w: iw - 0.2, h: 0.2,
        fontFace: T.fontHead, fontSize: 8.5, bold: true,
        color: b.dark ? T.aqua : T.primarySoft,
      });
      d.text(s, it.t, {
        x: x + 0.1, y: y + 0.26, w: iw - 0.2, h: ih - 0.32,
        fontFace: T.fontHead, fontSize: 10, bold: true,
        color: b.dark ? T.onDark : T.ink, lsm: 1.04,
      });
    });
  });
  // vertical request/response arrows between bands
  [[3.30, 3.44], [4.86, 5.00]].forEach(([y1, y2]) => {
    d.line(s, SW_MID, y1, SW_MID, y2, { color: T.primarySoft, width: 1.6, arrow: true });
    d.line(s, SW_MID + 0.22, y2, SW_MID + 0.22, y1, { color: T.muted, width: 1.2, arrow: true, dash: "dash" });
  });
  d.text(s, "HTTPS / JSON  request  +  response", {
    x: M, y: 6.48, w: CW, h: 0.26,
    fontSize: 9.5, align: "center", color: T.muted, italic: true,
  });
}
const SW_MID = M + CW / 2;

// ------------------------------------------------------------------ DFD level 0 (context)
function dfd0(d, s, o) {
  const T = d.T;
  const cx = M + CW / 2;
  const py = 3.55;
  const pw = 4.3, ph = 1.5;
  // central process
  s.addShape(d.ST.ellipse, {
    x: cx - pw / 2, y: py, w: pw, h: ph,
    fill: { color: T.sem.process }, line: { color: T.hair, width: 1 },
  });
  d.text(s, "0", {
    x: cx - pw / 2, y: py + 0.22, w: pw, h: 0.4,
    fontFace: T.fontHead, fontSize: 22, bold: true, align: "center", color: T.sem.processText,
  });
  d.text(s, o.name, {
    x: cx - pw / 2 + 0.3, y: py + 0.68, w: pw - 0.6, h: 0.6,
    fontFace: T.fontHead, fontSize: 15, bold: true, align: "center",
    color: T.sem.processText, lsm: 1.04,
  });

  // external entities around the ellipse
  const pos = [
    { x: M, y: 2.05 }, { x: M, y: 5.0 },
    { x: M + CW - 2.9, y: 2.05 }, { x: M + CW - 2.9, y: 5.0 },
  ];
  o.ext.forEach((e, i) => {
    const p = pos[i % pos.length];
    d.solid(s, p.x, p.y, 2.9, 0.78, T.sem.actor, T.hair);
    d.text(s, e, {
      x: p.x + 0.12, y: p.y, w: 2.66, h: 0.78,
      fontFace: T.fontHead, fontSize: 11.5, bold: true, align: "center",
      valign: "middle", color: T.sem.actorText, lsm: 1.02,
    });
    const ey = p.y + 0.39;
    const ex = p.x < cx ? p.x + 2.9 : p.x;
    const tx = p.x < cx ? cx - pw / 2 : cx + pw / 2;
    const ty = p.y < py ? py : py + ph;
    d.line(s, ex, ey, tx, ty, { color: T.sem.lineExternal, width: 1.5, arrow: true });
  });
  d.text(s, o.caption, {
    x: M, y: 6.34, w: CW, h: 0.3,
    fontSize: 10, align: "center", color: T.muted, italic: true,
  });
}

// ------------------------------------------------------------------ DFD level 1
// Top-down: a band of external entities, then a 3 x 2 grid where each process
// card carries the data stores it owns directly beneath it.
function dfd1(d, s, o) {
  const T = d.T;
  const COLS = 3, GAP = 0.3;
  const colW = (CW - (COLS - 1) * GAP) / COLS;
  const colX = (c) => M + c * (colW + GAP);

  // --- external entity band -------------------------------------------
  const n = o.ext.length;
  const ew = (CW - (n - 1) * 0.14) / n;
  const bandY = 2.26, bandH = 0.46;
  o.ext.forEach((e, i) => {
    const x = M + i * (ew + 0.14);
    d.solid(s, x, bandY, ew, bandH, T.sem.actor, T.hair);
    d.text(s, e, {
      x: x + 0.06, y: bandY, w: ew - 0.12, h: bandH,
      fontFace: T.fontHead, fontSize: 9.5, bold: true, align: "center",
      valign: "middle", color: T.sem.actorText, lsm: 1.0,
    });
    d.line(s, x + ew / 2, bandY + bandH, x + ew / 2, bandY + bandH + 0.2, {
      color: T.sem.lineExternal, width: 1.2, arrow: true,
    });
  });
  d.text(s, "EXTERNAL ENTITIES", {
    x: M, y: 1.99, w: CW, h: 0.22,
    fontFace: T.fontHead, fontSize: 8.5, bold: true, charSpacing: 1.4,
    align: "center", color: T.muted,
  });

  // --- process groups --------------------------------------------------
  const rowTop = [2.92, 4.70];
  o.proc.forEach((p, i) => {
    const c = i % COLS, r = Math.floor(i / COLS);
    const x = colX(c);
    const y = rowTop[r];
    procBox(d, s, {
      x, y, w: colW, h: 0.92, t: p.t, fs: 10.5,
      labelX: x + 0.48, labelW: colW - 0.58,
    });
    d.text(s, `${i + 1}.0`, {
      x: x + 0.08, y: y + 0.07, w: 0.4, h: 0.24,
      fontFace: T.fontHead, fontSize: 10, bold: true, color: T.sem.line,
    });

    // one chip per process, all stores joined, so the group never runs long
    const stores = String(p.stores || "").split("·").map((z) => z.trim()).filter(Boolean);
    const sy = y + 1.1;
    d.line(s, x + colW / 2, y + 0.92, x + colW / 2, sy, {
      color: T.sem.line, width: 1.1, arrow: true,
    });
    storeBox(d, s, {
      x: x + 0.24, y: sy, w: colW - 0.48, h: 0.5,
      t: stores.join(" · "), fs: 9,
    });
  });

  d.text(s, o.caption, {
    x: M, y: 6.42, w: CW, h: 0.3,
    fontSize: 10, align: "center", color: T.muted, italic: true,
  });
}

// ------------------------------------------------------------------ DFD level 2 (parametric)
function dfd2(d, s, o) {
  const T = d.T;
  const EX = M, EW = 2.5;
  const PX = 3.62, PW = 3.5;
  const SX = 7.72, SWD = 2.5;
  const OX = 10.66, OW = 2.02;
  const top = 2.02;
  const boxH = 0.66;

  // header captions
  [["EXTERNAL ENTITIES", EX, EW], ["PROCESSES", PX, PW], ["DATA STORES", SX, SWD], ["OUTPUTS", OX, OW]]
    .forEach(([t, x, w]) => {
      d.text(s, t, {
        x, y: top - 0.3, w, h: 0.24,
        fontFace: T.fontHead, fontSize: 9, bold: true, charSpacing: 1.2,
        align: "center", color: T.muted,
      });
    });

  const rowY = (i, n) => top + 0.12 + i * ((BOT - top - 0.1) / Math.max(n, 1)) + 0.1;

  // external entities
  const extN = o.ext.length;
  o.ext.forEach((e, i) => {
    const y = top + 0.18 + i * ((BOT - top - 0.5) / Math.max(extN, 1));
    extBox(d, s, { x: EX, y, w: EW, h: boxH, t: e, fs: 10.5 });
  });

  // processes (one or two columns of numbered processes)
  const pCols = o.proc.length > 2 ? 2 : 1;
  const colW = pCols === 2 ? (PW - 0.2) / 2 : PW;
  o.proc.forEach((p, i) => {
    const c = i % pCols;
    const r = Math.floor(i / pCols);
    const rows = Math.ceil(o.proc.length / pCols);
    const step = (BOT - top - 0.5) / Math.max(rows, 1);
    const x = PX + c * (colW + 0.2);
    const y = top + 0.18 + r * step + 0.12;
    procBox(d, s, {
      x, y, w: colW, h: boxH + 0.14, t: p.t, fs: 10,
      labelX: x + 0.46, labelW: colW - 0.54,
    });
    d.text(s, p.n, {
      x: x + 0.08, y: y + 0.05, w: 0.34, h: 0.24,
      fontFace: T.fontHead, fontSize: 10, bold: true, color: T.sem.line,
    });
  });

  // data stores
  const sN = o.store.length;
  o.store.forEach((st, i) => {
    const y = top + 0.18 + i * ((BOT - top - 0.5) / Math.max(sN, 1));
    storeBox(d, s, { x: SX, y, w: SWD, h: boxH, t: st.t, fs: 9.5 });
  });

  // outputs
  const oN = o.out ? o.out.length : 0;
  (o.out || []).forEach((ou, i) => {
    const y = top + 0.18 + i * ((BOT - top - 0.5) / Math.max(oN, 1));
    d.solid(s, OX, y, OW, boxH, T.bgAlt, T.hair);
    d.text(s, ou, {
      x: OX + 0.1, y, w: OW - 0.2, h: boxH,
      fontSize: 9.5, align: "center", valign: "middle", color: T.body, lsm: 1.02,
    });
  });

  // flows: ext -> proc -> store -> out
  o.proc.forEach((p, i) => {
    const c = i % pCols;
    const r = Math.floor(i / pCols);
    const rows = Math.ceil(o.proc.length / pCols);
    const step = (BOT - top - 0.5) / Math.max(rows, 1);
    const px = PX + c * (colW + 0.2);
    const py = top + 0.18 + r * step + 0.12 + (boxH + 0.14) / 2;
    const pr = px + colW;
    // to nearest external entity (left) and nearest store (right)
    const ey = top + 0.18 + (i % extN) * ((BOT - top - 0.5) / Math.max(extN, 1)) + boxH / 2;
    d.line(s, EX + EW, ey, px, py, { color: T.sem.lineExternal, width: 1.3, arrow: true });
    const sy = top + 0.18 + (i % sN) * ((BOT - top - 0.5) / Math.max(sN, 1)) + boxH / 2;
    d.line(s, pr, py, SX, sy, { color: T.sem.line, width: 1.3, arrow: true });
    if (o.out && oN) {
      const oy = top + 0.18 + (i % oN) * ((BOT - top - 0.5) / Math.max(oN, 1)) + boxH / 2;
      d.line(s, SX + SWD, sy, OX, oy, { color: T.sem.line, width: 1.2, arrow: true, dash: "dash" });
    }
  });
  legend(d, s, [
    { fill: T.sem.actor, t: "External entity" },
    { fill: T.sem.process, t: "Process" },
    { fill: T.sem.data, t: "Data store" },
    { fill: T.bgAlt, t: "Output / report" },
  ], 6.44);
}

// ------------------------------------------------------------------ ERD
// Positioned by an automatic column/row grid so boxes can never leave the canvas.
function erd(d, s, o) {
  const T = d.T;
  const cols = o.cols || 3;
  const gapX = o.gapX != null ? o.gapX : 0.5;
  const gapY = o.gapY != null ? o.gapY : 0.32;
  const top = o.top || 2.02;
  const bottom = o.bottom || 6.66;
  const boxW = (CW - (cols - 1) * gapX) / cols;
  const boxH = (e) => 0.3 + e.keys.length * 0.235 + 0.14;

  // --- lay out on the grid ---------------------------------------------
  const rows = [];
  for (let i = 0; i < o.entities.length; i += cols) rows.push(o.entities.slice(i, i + cols));

  // equalise row heights, then distribute any slack evenly between rows
  const natural = rows.map((r) => Math.max(...r.map(boxH)));
  const slack = (bottom - top - natural.reduce((a, b) => a + b, 0) - gapY * (rows.length - 1));
  const extra = rows.length > 1 ? Math.max(slack, 0) / rows.length : 0;

  const pos = {};
  let y = top;
  rows.forEach((r) => {
    const bandH = natural[rows.indexOf(r)] + extra;
    r.forEach((e, ci) => {
      pos[e.id] = { x: M + ci * (boxW + gapX), y, w: boxW, h: boxH(e) };
    });
    y += bandH + gapY;
  });

  // --- draw entities ----------------------------------------------------
  o.entities.forEach((e) => {
    const g = pos[e.id];
    d.solid(s, g.x, g.y, g.w, g.h, "FFFFFF", T.hair);
    // title band — this is the entity name, not a decorative stripe
    s.addShape(d.ST.rect, {
      x: g.x, y: g.y, w: g.w, h: 0.3,
      fill: { color: T.sem.entity }, line: { type: "none" },
    });
    d.text(s, e.id, {
      x: g.x + 0.06, y: g.y, w: g.w - 0.12, h: 0.3,
      fontFace: T.fontHead, fontSize: 9, bold: true, color: T.sem.entityText,
      align: "center", valign: "middle",
    });
    e.keys.forEach((k, i) => {
      d.text(s, k, {
        x: g.x + 0.1, y: g.y + 0.32 + i * 0.235, w: g.w - 0.34, h: 0.22,
        fontSize: 8.5, color: k.endsWith("FK") || k.startsWith("*") ? T.primary : T.body,
        valign: "middle",
      });
    });
  });

  // --- relationships with cardinality -----------------------------------
  // Routed orthogonally: same-row pairs run straight across the column gap,
  // everything else exits vertically into the row gap. No line cuts a box.
  // Two relationships can route through the same gap; stack their pills
  // instead of letting them sit exactly on top of each other.
  const usedPills = [];
  const put = (px, py, label) => {
    const w = 0.26;
    let bx = px, by = py;
    for (let guard = 0; guard < 12; guard++) {
      const clash = usedPills.some(
        (p) => Math.abs(p.x - bx) < w + 0.02 && Math.abs(p.y - by) < 0.2
      );
      if (!clash) break;
      const step = guard % 2 ? -1 : 1;
      by = py + step * 0.24 * (Math.floor(guard / 2) + 1);
    }
    usedPills.push({ x: bx, y: by });
    d.solid(s, bx - w / 2, by - 0.11, w, 0.22, T.bg, T.hair);
    d.text(s, label, {
      x: bx - w / 2, y: by - 0.11, w, h: 0.22,
      fontSize: 7.5, bold: true, align: "center", valign: "middle", color: T.sem.line,
    });
  };

  o.rels.forEach((r) => {
    const a = pos[r.from], b = pos[r.to];
    if (!a || !b) return;
    const ac = { x: a.x + a.w / 2, y: a.y + a.h / 2 };
    const bc = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
    const sameRow = Math.abs(ac.y - bc.y) < 0.02;
    const sameCol = Math.abs(ac.x - bc.x) < 0.02;
    const IN = 0.16; // pill inset from the box edge it belongs to

    if (sameRow) {
      // straight across the gap between two boxes in the same band
      const fromLeft = ac.x < bc.x;
      const left = fromLeft ? a : b;
      const right = fromLeft ? b : a;
      const x1 = left.x + left.w, x2 = right.x, y = ac.y;
      d.line(s, x1, y, x2, y, { color: T.sem.line, width: 1.2 });
      put(x1 + IN, y, fromLeft ? r.fromCard || "1" : r.toCard || "N");
    } else if (sameCol) {
      const fromTop = ac.y < bc.y;
      const top = fromTop ? a : b;
      const bot = fromTop ? b : a;
      const x = ac.x, y1 = top.y + top.h, y2 = bot.y;
      d.line(s, x, y1, x, y2, { color: T.sem.line, width: 1.2 });
      put(x, y1 + IN, fromTop ? r.fromCard || "1" : r.toCard || "N");
    } else {
      // elbow: exit the source's side edge into the column gap, run along the
      // gap, then enter the target's near edge. The vertical leg always sits
      // in a gap, so no pill can land on a cell.
      const goRight = bc.x > ac.x;
      const sx = goRight ? a.x + a.w : a.x;
      const tx = goRight ? b.x : b.x + b.w;
      const midX = goRight ? sx + IN + 0.06 : sx - IN - 0.06;
      d.line(s, sx, ac.y, midX, ac.y, { color: T.sem.line, width: 1.2 });
      d.line(s, midX, ac.y, midX, bc.y, { color: T.sem.line, width: 1.2 });
      d.line(s, midX, bc.y, tx, bc.y, { color: T.sem.line, width: 1.2 });
      put(midX, ac.y, r.fromCard || "1");
      put(midX, bc.y, r.toCard || "N");
    }
  });
}

// ------------------------------------------------------------------ Use case
function usecase(d, s, o) {
  const T = d.T;
  const ax = M + 0.05, aw = 1.72;
  // system boundary
  d.solid(s, M + 2.42, 1.9, CW - 2.42, 4.9, T.bgAlt, T.hair);
  d.text(s, "HOSPITAL MANAGEMENT SYSTEM", {
    x: M + 2.42, y: 1.98, w: CW - 2.42, h: 0.3,
    fontFace: T.fontHead, fontSize: 10, bold: true, charSpacing: 1.8,
    align: "center", color: T.primary,
  });

  // ovals
  const uc = o.uc;
  const cols = o.cols || (uc.length > 6 ? 2 : 1);
  const ucH = 0.6;
  const gapX = 0.32;
  const gapY = 0.2;
  const bx = M + 2.42, bw = CW - 2.42;
  const ucW = (avail, c) => (avail - (c - 1) * gapX) / c;
  const cw = ucW(bw, cols);
  const totalW = cols * cw + (cols - 1) * gapX;
  const x0 = bx + (bw - totalW) / 2;
  const rows = Math.ceil(uc.length / cols);
  const y0 = 2.45;
  const bot = 6.62;
  const step = (bot - y0) / rows;
  const oh = Math.min(ucH, step - gapY);
  const spots = uc.map((u, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    return { x: x0 + c * (cw + gapX), y: y0 + r * step, w: cw, h: oh };
  });

  spots.forEach((sp, i) => {
    s.addShape(d.ST.ellipse, {
      x: sp.x, y: sp.y, w: sp.w, h: sp.h,
      fill: { color: "FFFFFF" }, line: { color: T.sem.entity, width: 1.1 },
    });
    d.text(s, uc[i], {
      x: sp.x + 0.14, y: sp.y, w: sp.w - 0.28, h: sp.h,
      fontSize: o.fs || 9.5, align: "center", valign: "middle", color: T.ink, lsm: 1.0,
    });
  });

  // actors
  const actors = o.actors;
  const aStep = (4.9 - 1.0) / Math.max(actors.length - 1, 1);
  actors.forEach((a, i) => {
    const ay = 2.4 + i * aStep;
    d.solid(s, ax, ay - 0.26, aw, 0.52, T.sem.actor, T.hair);
    d.text(s, a, {
      x: ax + 0.1, y: ay - 0.26, w: aw - 0.2, h: 0.52,
      fontFace: T.fontHead, fontSize: 10, bold: true, align: "center",
      valign: "middle", color: T.sem.actorText, lsm: 1.0,
    });
    // association line to the use cases this actor owns
    const idx = o.map && o.map[a] ? o.map[a] : [i];
    idx.forEach((k) => {
      const sp = spots[k];
      if (!sp) return;
      d.line(s, ax + aw, ay, sp.x, sp.y + sp.h / 2, {
        color: T.muted, width: 1, dash: "dash",
      });
    });
  });
}

// ------------------------------------------------------------------ auth flow
function authFlow(d, s, o) {
  const T = d.T;
  const steps = o.steps;
  const gap = 0.24;
  const w = (CW - 3 * gap) / 4;
  const rowY = [2.05, 3.09];
  const h = 0.92;
  steps.forEach((st, i) => {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const inRow = row === 0 ? Math.min(steps.length, 4) : steps.length - 4;
    const rowW = inRow * w + (inRow - 1) * gap;
    const x = M + (CW - rowW) / 2 + col * (w + gap);
    const y = rowY[row];
    d.solid(s, x, y, w, h, T.bgAlt, T.hair);
    d.text(s, st.n, {
      x: x + 0.12, y: y + 0.07, w: w - 0.24, h: 0.22,
      fontFace: T.fontHead, fontSize: 8.5, bold: true, color: T.primary,
    });
    d.text(s, st.t, {
      x: x + 0.12, y: y + 0.28, w: w - 0.24, h: h - 0.36,
      fontFace: T.fontHead, fontSize: 10, bold: true, color: T.ink, lsm: 1.06,
    });
    if (col < inRow - 1) {
      d.line(s, x + w, y + h / 2, x + w + gap, y + h / 2, {
        color: T.primarySoft, width: 1.6, arrow: true,
      });
    }
  });
  // wrap connector from the end of row 1 back to the start of row 2
  const firstX = M + (CW - ((steps.length - 4) * w + (steps.length - 4 - 1) * gap)) / 2;
  d.line(s, M + CW - w / 2 - ((4 * w + 3 * gap - CW) / 2), rowY[0] + h, M + CW - w / 2 - ((4 * w + 3 * gap - CW) / 2), rowY[1] - gap / 2, { color: T.primarySoft, width: 1.6 });
  d.line(s, M + CW - w / 2 - ((4 * w + 3 * gap - CW) / 2), rowY[1] - gap / 2, firstX + w / 2, rowY[1] - gap / 2, { color: T.primarySoft, width: 1.6, arrow: true });

  // guards
  o.guards.forEach((gg, i) => {
    const y = 4.2 + i * 0.8;
    d.solid(s, M + 0.4, y, CW - 0.8, 0.68, "FFFFFF", T.hair);
    d.solid(s, M + 0.4, y + 0.12, 0.1, 0.44, T.sem.lineExternal, null);
    d.text(s, gg.t, {
      x: M + 0.66, y: y + 0.06, w: 3.3, h: 0.56,
      fontFace: T.fontHead, fontSize: 11, bold: true, color: T.ink, valign: "middle",
    });
    d.text(s, gg.d, {
      x: M + 4.1, y: y + 0.06, w: CW - 4.6, h: 0.56,
      fontSize: 10, color: T.body, valign: "middle", lsm: 1.05,
    });
  });
}

// ------------------------------------------------------------------ AI assistant pipeline
function aiArch(d, s, o) {
  const T = d.T;
  const lanes = o.lanes;
  const gap = 0.24;
  const laneW = (CW - (lanes.length - 1) * gap) / lanes.length;
  const x0 = M;
  lanes.forEach((ln, i) => {
    const x = x0 + i * (laneW + gap);
    d.solid(s, x, 2.28, laneW, 2.55, ln.fill || T.bgAlt, T.hair);
    d.solid(s, x, 2.28, laneW, 0.42, T.sem.entity, null);
    d.text(s, ln.t, {
      x: x + 0.1, y: 2.28, w: laneW - 0.2, h: 0.42,
      fontFace: T.fontHead, fontSize: 10, bold: true, align: "center",
      valign: "middle", color: T.sem.entityText, lsm: 1.0,
    });
    ln.items.forEach((it, k) => {
      d.solid(s, x + 0.16, 2.85 + k * 0.46, laneW - 0.32, 0.38, "FFFFFF", T.hair);
      d.text(s, it, {
        x: x + 0.26, y: 2.85 + k * 0.46, w: laneW - 0.52, h: 0.38,
        fontSize: 9, color: T.body, valign: "middle", lsm: 1.0,
      });
    });
    if (i < lanes.length - 1) {
      d.line(s, x + laneW, 3.55, x + laneW + gap, 3.55, {
        color: T.sem.lineExternal, width: 1.8, arrow: true,
      });
    }
  });
  d.solid(s, M, 5.12, CW, 1.2, T.dark, null);
  d.text(s, o.footTitle, {
    x: M + 0.28, y: 5.2, w: 3.4, h: 0.3,
    fontFace: T.fontHead, fontSize: 10, bold: true, charSpacing: 1.4, color: T.aqua,
  });
  o.foot.forEach((f, i) => {
    const x = M + 0.28 + i * ((CW - 0.56) / o.foot.length);
    d.text(s, f, {
      x, y: 5.52, w: (CW - 0.56) / o.foot.length - 0.2, h: 0.7,
      fontSize: 9.5, color: T.onDarkMuted, lsm: 1.1,
    });
  });
}

// ------------------------------------------------------------------ deployment
function deploy(d, s, o) {
  const T = d.T;
  const colW = (CW - 0.3) / 2;
  const cols = [[], []];
  o.zones.forEach((z, i) => cols[i % 2].push(z));
  cols.forEach((zlist, ci) => {
    const x = M + ci * (colW + 0.3);
    let y = 2.0;
    zlist.forEach((z) => {
      const h = 0.5 + z.items.length * 0.6;
      d.solid(s, x, y, colW, h, T.bgAlt, T.hair);
      d.solid(s, x, y, colW, 0.06, T.primary, null);
      d.text(s, z.t, {
        x: x + 0.24, y: y + 0.12, w: colW - 0.48, h: 0.3,
        fontFace: T.fontHead, fontSize: 11, bold: true, color: T.primary,
      });
      z.items.forEach((it, i) => {
        const n = z.items.length;
        const iw = (colW - 0.5 - (n - 1) * 0.18) / n;
        const ix = x + 0.25 + i * (iw + 0.18);
        const iy = y + 0.5;
        d.solid(s, ix, iy, iw, 0.5, it.fill || "FFFFFF", T.hair);
        d.text(s, it.t, {
          x: ix + 0.09, y: iy, w: iw - 0.18, h: 0.5,
          fontFace: T.fontHead, fontSize: 9.5, bold: true, align: "center",
          valign: "middle", color: T.ink, lsm: 1.0,
        });
      });
      y += h + 0.2;
    });
  });
}

module.exports = {
  architecture, dfd0, dfd1, dfd2, erd, usecase, authFlow, aiArch, deploy,
};
