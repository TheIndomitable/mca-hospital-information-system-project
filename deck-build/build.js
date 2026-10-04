// build.js — assembles both decks from content.js + theme + kit + diagrams.
// Usage: node build.js            (both themes)
//        node build.js legacy     (one theme)

const path = require("path");
const { makeDeck, GEO } = require("./kit");
const { SLIDES, TOTAL } = require("./content");
const D = require("./diagrams");

const { M, CW } = GEO;
const TOP = 1.95;      // first content row
const BOT = 6.62;      // last usable row before the footer

const TEAM = [
  ["Ashutosh Sharma", "25204031148"],
  ["Bhavishya Sisodiya", "25204031140"],
  ["Nitish Kumar", "25204031115"],
];
const MENTORS = ["Dr Jay Kumar Jain", "Dr Kuldeep Singh Yadav"];
const DEPT = "Department of Mathematics, Bioinformatics and Computer Application";

// grid helper
const grid = (n, cols, top, bot, gapY = 0.26) => {
  const rows = Math.ceil(n / cols);
  const h = (bot - top - (rows - 1) * gapY) / rows;
  const gapX = 0.26;
  const w = (CW - (cols - 1) * gapX) / cols;
  return { rows, h, w, gapX, gapY, at: (i) => ({
    x: M + (i % cols) * (w + gapX),
    y: top + Math.floor(i / cols) * (h + gapY),
    w, h,
  }) };
};

function build(themeName, outFile) {
  const d = makeDeck(themeName, { total: TOTAL });
  const T = d.T;

  SLIDES.forEach((sl, idx) => {
    d.setPage(idx + 1);
    const k = sl.kind;

    // ------------------------------------------------------------- title
    if (k === "title") {
      const s = d.newSlide({ bg: T.dark, notes: "Minor project presentation for the Hospital Management System." });
      // motif: soft rounded squares bleeding off the right edge
      [[10.4, 1.05, 2.1], [11.75, 2.5, 1.5], [10.9, 4.15, 1.2], [12.0, 5.3, 0.85]].forEach(([x, y, sz], i) => {
        d.solid(s, x, y, sz, sz, i % 2 ? T.dark2 : T.primary, null);
        d.circle(s, x + sz / 2, y + sz / 2, sz * 0.22, T.aqua);
      });

      d.solid(s, M, 0.9, 0.18, 0.18, T.aqua, null);
      d.text(s, "MINOR PROJECT PRESENTATION", {
        x: M + 0.34, y: 0.83, w: 7, h: 0.3,
        fontFace: T.fontHead, fontSize: 12, bold: true, charSpacing: 2.6, color: T.aqua,
      });
      d.text(s, "Hospital Management System", {
        x: M, y: 1.2, w: 11.5, h: 0.82,
        fontFace: T.fontHead, fontSize: 42, bold: true, color: T.onDark, lsm: 1.0,
      });
      d.text(s, "A role-aware web application for the complete hospital cycle — registration, appointments, clinical records, pharmacy, laboratory and settlement.", {
        x: M, y: 2.42, w: 8.4, h: 0.78,
        fontSize: 14, color: T.onDarkMuted, lsm: 1.24,
      });

      d.text(s, "PROJECT GUIDES", {
        x: M, y: 3.52, w: 4, h: 0.26,
        fontFace: T.fontHead, fontSize: 9.5, bold: true, charSpacing: 1.8, color: T.aqua,
      });
      MENTORS.forEach((m, i) => {
        d.circle(s, M + 0.16, 4.02 + i * 0.42, 0.18, T.primary);
        d.text(s, m, {
          x: M + 0.42, y: 3.86 + i * 0.42, w: 4.2, h: 0.32,
          fontSize: 12.5, color: T.onDark, valign: "middle",
        });
      });

      d.text(s, "TEAM", {
        x: M, y: 4.92, w: 4, h: 0.26,
        fontFace: T.fontHead, fontSize: 9.5, bold: true, charSpacing: 1.8, color: T.aqua,
      });
      const cols = TEAM.length <= 3 ? TEAM.length : 3;
      const tg = 0.2;
      const tw = (CW - (cols - 1) * tg) / cols;
      TEAM.forEach(([n, r], i) => {
        const x = M + (i % cols) * (tw + tg);
        const y = 5.28 + Math.floor(i / cols) * 0.78;
        d.solid(s, x, y, tw, 0.64, T.dark2, null);
        d.solid(s, x, y + 0.12, 0.09, 0.4, T.aqua, null);
        d.text(s, n, {
          x: x + 0.26, y: y + 0.08, w: tw - 0.4, h: 0.26,
          fontFace: T.fontHead, fontSize: 11, bold: true, color: T.onDark,
        });
        d.text(s, r, {
          x: x + 0.26, y: y + 0.33, w: tw - 0.4, h: 0.24,
          fontSize: 9.5, color: T.onDarkMuted,
        });
      });

      d.text(s, `MANIT BHOPAL  ·  ${DEPT}`, {
        x: M, y: FOOT_TEXT(), w: 9, h: 0.3,
        fontFace: T.fontHead, fontSize: 10.5, bold: true, charSpacing: 1.1, color: T.onDarkMuted,
      });
      return;
    }

    // ------------------------------------------------------------- thanks
    if (k === "thanks") {
      const s = d.newSlide({ bg: T.dark, notes: "Close the presentation and invite questions." });
      [[0.9, 5.4, 1.5], [2.6, 6.1, 0.9], [10.6, 1.2, 1.6], [12.0, 2.6, 1.0]].forEach(([x, y, sz], i) => {
        d.solid(s, x, y, sz, sz, i % 2 ? T.dark2 : T.primary, null);
        d.circle(s, x + sz / 2, y + sz / 2, sz * 0.2, T.aqua);
      });
      d.solid(s, M, 2.32, 0.18, 0.18, T.aqua, null);
      d.text(s, "PROJECT PRESENTATION", {
        x: M + 0.34, y: 2.25, w: 7, h: 0.3,
        fontFace: T.fontHead, fontSize: 11.5, bold: true, charSpacing: 2.4, color: T.aqua,
      });
      d.text(s, "Thank You", {
        x: M, y: 2.7, w: 9, h: 1.0,
        fontFace: T.fontHead, fontSize: 46, bold: true, color: T.onDark,
      });
      d.text(s, "Questions and suggestions are welcome.", {
        x: M, y: 3.78, w: 7, h: 0.36, fontSize: 14, color: T.onDarkMuted,
      });
      const tw = 2.72, tg = 0.2;
      TEAM.forEach(([n, r], i) => {
        const x = M + (i % 3) * (tw + tg);
        const y = 4.44 + Math.floor(i / 3) * 0.76;
        d.solid(s, x, y, tw, 0.62, T.dark2, null);
        d.solid(s, x, y + 0.12, 0.09, 0.38, T.aqua, null);
        d.text(s, n, { x: x + 0.26, y: y + 0.08, w: tw - 0.4, h: 0.26, fontFace: T.fontHead, fontSize: 11, bold: true, color: T.onDark });
        d.text(s, r, { x: x + 0.26, y: y + 0.32, w: tw - 0.4, h: 0.24, fontSize: 9.5, color: T.onDarkMuted });
      });
      d.text(s, MENTORS.join("  ·  "), {
        x: M, y: 6.02, w: 9, h: 0.3, fontSize: 11, color: T.onDarkMuted,
      });
      d.text(s, `MANIT BHOPAL  ·  ${DEPT}`, {
        x: M, y: FOOT_TEXT(), w: 10, h: 0.3,
        fontFace: T.fontHead, fontSize: 10, bold: true, charSpacing: 1, color: T.onDarkMuted,
      });
      return;
    }

    // ------------------------------------------------------------- conclusion
    if (k === "conclusion") {
      const s = d.content(sl, { dark: true });
      d.text(s, sl.lead, {
        x: M, y: 1.85, w: 7.5, h: 1.0, fontSize: 13.5, color: T.onDark, lsm: 1.26,
      });
      sl.points.forEach((p, i) => {
        const y = 3.0 + i * 0.66;
        d.circle(s, M + 0.14, y + 0.16, 0.16, T.aqua);
        d.text(s, p, { x: M + 0.42, y, w: 7.1, h: 0.6, fontSize: 11.5, color: T.onDarkMuted, lsm: 1.14 });
      });
      const sw = 1.93, sg = 0.2;
      sl.stats.forEach(([v, l], i) => {
        const x = M + 8.0 + (i % 2) * (sw + sg);
        const y = 1.95 + Math.floor(i / 2) * 1.62;
        d.solid(s, x, y, sw, 1.42, T.dark2, null);
        d.text(s, v, { x: x + 0.12, y: y + 0.24, w: sw - 0.24, h: 0.72, fontFace: T.fontHead, fontSize: 34, bold: true, color: T.aqua, align: "center" });
        d.text(s, l, { x: x + 0.12, y: y + 1.0, w: sw - 0.24, h: 0.28, fontSize: 10, align: "center", color: T.onDarkMuted });
      });
      return;
    }

    // ------------------------------------------------------------- toc
    if (k === "toc") {
      const s = d.content(sl);
      const g = grid(sl.groups.length, 2, 1.95, BOT, 0.3);
      sl.groups.forEach((it, i) => {
        const p = g.at(i);
        d.solid(s, p.x, p.y, p.w, p.h, T.bgAlt, T.hair);
        d.token(s, p.x + 0.56, p.y + 0.52, 0.5, it.n, T.primary, "FFFFFF");
        d.text(s, it.t, {
          x: p.x + 0.98, y: p.y + 0.18, w: p.w - 1.2, h: 0.34,
          fontFace: T.fontHead, fontSize: 15, bold: true, color: T.ink,
        });
        d.text(s, it.items, {
          x: p.x + 0.98, y: p.y + 0.52, w: p.w - 1.2, h: 0.34,
          fontSize: 10.5, color: T.muted,
        });
      });
      return;
    }

    // ------------------------------------------------------------- split (intro)
    if (k === "split") {
      const s = d.content(sl);
      d.text(s, sl.lead, { x: M, y: 1.9, w: 7.5, h: 1.5, fontSize: 13, color: T.body, lsm: 1.3 });
      // left column is a fixed 7.5in block laid out 2x2, so it can never
      // reach into the stat column and each card has room for two lines
      const lcW = 7.5;
      const cg = 0.2;
      const cw = (lcW - cg) / 2;
      const ch = (BOT - 3.42 - cg) / 2;
      sl.points.forEach((p, i) => {
        const q = {
          x: M + (i % 2) * (cw + cg),
          y: 3.42 + Math.floor(i / 2) * (ch + cg),
          w: cw, h: ch,
        };
        d.solid(s, q.x, q.y, q.w, q.h, T.bgAlt, T.hair);
        d.solid(s, q.x, q.y + 0.12, 0.1, q.h - 0.24, T.primarySoft, null);
        d.text(s, p.t, { x: q.x + 0.3, y: q.y + 0.12, w: q.w - 0.5, h: 0.3, fontFace: T.fontHead, fontSize: 13, bold: true, color: T.ink });
        d.text(s, p.d, { x: q.x + 0.3, y: q.y + 0.46, w: q.w - 0.5, h: q.h - 0.58, fontSize: 10.5, color: T.body, lsm: 1.14 });
      });
      const aw = 4.0, ah = 0.92;
      d.text(s, sl.aside.t, { x: M + 7.95, y: 1.9, w: 4.1, h: 0.3, fontFace: T.fontHead, fontSize: 12, bold: true, color: T.primary, charSpacing: 1.2 });
      sl.aside.stats.forEach(([v, l], i) => {
        d.stat(s, { x: M + 7.95, y: 2.32 + i * (ah + 0.16), w: aw, h: ah, value: v, label: l, vsize: 26, fill: T.bgAlt });
      });
      return;
    }

    // ------------------------------------------------------------- cards
    if (k === "cards") {
      const s = d.content(sl);
      const g = grid(sl.cards.length, sl.cols, TOP, BOT, 0.26);
      sl.cards.forEach((c, i) => {
        const p = g.at(i);
        d.card(s, {
          ...p, ...c,
          compact: sl.dense,
          titleSize: sl.dense ? 11.5 : 14,
          bodySize: sl.dense ? 8.5 : 11,
          tagFill: T.sand, tagFg: T.ink,
        });
      });
      return;
    }

    // ------------------------------------------------------------- scope
    if (k === "chips2") {
      const s = d.content(sl);
      d.text(s, sl.intro, { x: M, y: 1.9, w: CW, h: 0.5, fontSize: 12.5, color: T.body, lsm: 1.2 });
      const g = grid(sl.domains.length, 4, 2.5, 4.35, 0.16);
      sl.domains.forEach((t, i) => {
        const p = g.at(i);
        d.solid(s, p.x, p.y, p.w, p.h, T.bgAlt, T.hair);
        d.solid(s, p.x, p.y + 0.1, 0.09, p.h - 0.2, T.primarySoft, null);
        d.text(s, t, { x: p.x + 0.24, y: p.y, w: p.w - 0.36, h: p.h, fontSize: 10.5, color: T.body, valign: "middle" });
      });
      const mg = grid(sl.model.length, 3, 4.6, BOT, 0.26);
      sl.model.forEach((m, i) => {
        const p = mg.at(i);
        d.card(s, { ...p, title: m.t, sub: m.d, titleSize: 13, bodySize: 10.5, fill: T.bgAlt });
      });
      return;
    }

    // ------------------------------------------------------------- objectives
    if (k === "numbered") {
      const s = d.content(sl);
      const half = Math.ceil(sl.items.length / 2);
      const colW = (CW - 0.4) / 2;
      [sl.items.slice(0, half), sl.items.slice(half)].forEach((col, c) => {
        d.listRows(s, {
          x: M + c * (colW + 0.4), y: 1.95, w: colW, rowH: 0.86, d: 0.42, fs: 13, gap: 0.14,
          rows: col.map((it, i) => ({ n: i + 1 + c * half, title: it.t, sub: it.d })),
        });
      });
      return;
    }

    // ------------------------------------------------------------- stack
    if (k === "stack") {
      const s = d.content(sl);
      const colW = (CW - 0.5) / 2;
      [["left", M], ["right", M + colW + 0.5]].forEach(([side, x]) => {
        const b = sl[side];
        d.text(s, b.t, { x, y: 1.9, w: colW, h: 0.3, fontFace: T.fontHead, fontSize: 12.5, bold: true, color: T.primary });
        d.table(s, {
          x, y: 2.28, w: colW, colW: [colW * 0.38, colW * 0.26, colW * 0.36],
          head: ["Technology", "Version", "Purpose"], rows: b.rows, fs: 9.5, rh: 0.33,
        });
      });
      return;
    }

    // ------------------------------------------------------------- roles
    if (k === "roles") {
      const s = d.content(sl);
      d.text(s, sl.intro, { x: M, y: 1.86, w: CW, h: 0.56, fontSize: 12, color: T.body, lsm: 1.18 });
      const tg = grid(sl.types.length, 2, 2.36, 3.18, 0.26);
      sl.types.forEach((t, i) => {
        const p = tg.at(i);
        d.solid(s, p.x, p.y, p.w, p.h, T.bgAlt, T.hair);
        d.solid(s, p.x, p.y + 0.12, 0.1, p.h - 0.24, T.sem.lineExternal, null);
        d.text(s, t.t, { x: p.x + 0.3, y: p.y + 0.08, w: p.w - 0.5, h: 0.28, fontFace: T.fontHead, fontSize: 11.5, bold: true, color: T.ink });
        d.text(s, t.d, { x: p.x + 0.3, y: p.y + 0.34, w: p.w - 0.5, h: p.h - 0.42, fontSize: 9.5, color: T.body, lsm: 1.1 });
      });
      const g = grid(sl.roles.length, 4, 3.4, BOT, 0.22);
      sl.roles.forEach((r, i) => {
        const p = g.at(i);
        d.solid(s, p.x, p.y, p.w, p.h, T.bgAlt, T.hair);
        d.token(s, p.x + 0.46, p.y + 0.44, 0.42, i + 1, T.primary, "FFFFFF");
        d.text(s, r.t, { x: p.x + 0.78, y: p.y + 0.16, w: p.w - 0.98, h: 0.3, fontFace: T.fontHead, fontSize: 12.5, bold: true, color: T.ink });
        d.text(s, r.r, { x: p.x + 0.78, y: p.y + 0.44, w: p.w - 0.98, h: 0.24, fontSize: 9, color: T.primary, italic: true });
        d.text(s, r.d, { x: p.x + 0.2, y: p.y + 0.76, w: p.w - 0.4, h: p.h - 0.9, fontSize: 9.5, color: T.body, lsm: 1.1 });
      });
      return;
    }

    // ------------------------------------------------------------- schema table
    if (k === "schematable") {
      const s = d.content(sl);
      const g = grid(sl.groups.length, 4, 1.95, BOT, 0.22);
      sl.groups.forEach(([name, tables], i) => {
        const p = g.at(i);
        d.solid(s, p.x, p.y, p.w, p.h, T.bgAlt, T.hair);
        d.solid(s, p.x, p.y, p.w, 0.38, T.primary, null);
        d.text(s, name, {
          x: p.x + 0.14, y: p.y, w: p.w - 0.28, h: 0.38,
          fontFace: T.fontHead, fontSize: 11.5, bold: true, color: "FFFFFF", valign: "middle",
        });
        tables.split(", ").forEach((tb, j) => {
          const bw = p.w - 0.4;
          const by = p.y + 0.5 + j * 0.34;
          d.solid(s, p.x + 0.2, by, bw, 0.28, "FFFFFF", T.hair);
          d.text(s, tb, {
            x: p.x + 0.3, y: by, w: bw - 0.2, h: 0.28,
            fontSize: 9.5, color: T.body, valign: "middle",
          });
        });
      });
      return;
    }

    // ------------------------------------------------------------- api table
    if (k === "apitable") {
      const s = d.content(sl);
      d.table(s, {
        x: M, y: 2.04, w: CW,
        colW: [CW * 0.2, CW * 0.29, CW * 0.07, CW * 0.44],
        head: ["Router", "Verbs", "Ops", "Responsibility"], rows: sl.rows, fs: 9.5, rh: 0.3,
      });
      d.text(s, sl.foot, {
        x: M, y: 6.16, w: CW, h: 0.44, fontSize: 10, color: T.muted, italic: true, lsm: 1.14,
      });
      return;
    }

    // ------------------------------------------------------------- ai table
    if (k === "aitable") {
      const s = d.content(sl);
      d.text(s, sl.intro, { x: M, y: 1.86, w: CW, h: 0.56, fontSize: 11.5, color: T.body, lsm: 1.16 });
      const colW = (CW - 0.5) / 2;
      d.text(s, "PATIENT TOOLS  ·  5", { x: M, y: 2.4, w: colW, h: 0.28, fontFace: T.fontHead, fontSize: 10, bold: true, charSpacing: 1.3, color: T.primary });
      sl.patient.forEach(([t, dd], i) => {
        const y = 2.76 + i * 0.72;
        d.solid(s, M, y, colW, 0.64, T.bgAlt, T.hair);
        d.text(s, t, { x: M + 0.18, y: y + 0.06, w: colW - 0.36, h: 0.24, fontFace: T.fontHead, fontSize: 10, bold: true, color: T.ink });
        d.text(s, dd, { x: M + 0.18, y: y + 0.3, w: colW - 0.36, h: 0.3, fontSize: 9, color: T.muted, lsm: 1.06 });
      });
      const x2 = M + colW + 0.5;
      d.text(s, "STAFF TOOLS  ·  9", { x: x2, y: 2.4, w: colW, h: 0.28, fontFace: T.fontHead, fontSize: 10, bold: true, charSpacing: 1.3, color: T.primary });
      sl.staff.forEach(([t, roles], i) => {
        const y = 2.76 + i * 0.4;
        d.solid(s, x2, y, colW, 0.34, i % 2 ? T.bg : T.bgAlt, T.hair);
        d.text(s, t, { x: x2 + 0.14, y, w: colW * 0.5 - 0.28, h: 0.34, fontSize: 9.5, bold: true, color: T.ink, valign: "middle" });
        d.text(s, roles, { x: x2 + colW * 0.5, y, w: colW * 0.5 - 0.14, h: 0.34, fontSize: 8.5, color: T.muted, valign: "middle" });
      });
      return;
    }

    // ------------------------------------------------------------- business rules
    if (k === "rules") {
      const s = d.content(sl);
      const half = Math.ceil(sl.rules.length / 2);
      [sl.rules.slice(0, half), sl.rules.slice(half)].forEach((col, c) => {
        const x = M + c * ((CW - 0.4) / 2 + 0.4);
        const w = (CW - 0.4) / 2;
        col.forEach((r, i) => {
          const y = 1.95 + i * 1.18;
          d.solid(s, x, y, w, 1.04, T.bgAlt, T.hair);
          d.token(s, x + 0.44, y + 0.32, 0.4, i + 1 + c * half, T.primary, "FFFFFF");
          d.text(s, r.t, { x: x + 0.76, y: y + 0.1, w: w - 0.96, h: 0.28, fontFace: T.fontHead, fontSize: 12, bold: true, color: T.ink });
          d.text(s, r.d, { x: x + 0.2, y: y + 0.54, w: w - 0.4, h: 0.42, fontSize: 9.5, color: T.body, lsm: 1.1 });
        });
      });
      return;
    }

    // ------------------------------------------------------------- two panels
    if (k === "columns") {
      const s = d.content(sl);
      [["left", M], ["right", M + (CW - 0.4) / 2 + 0.4]].forEach(([side, x]) => {
        const b = sl[side];
        const w = (CW - 0.4) / 2;
        d.solid(s, x, 1.92, w, BOT - 1.92, T.bgAlt, T.hair);
        d.solid(s, x, 1.92, w, 0.44, T.primary, null);
        d.text(s, b.t, { x: x + 0.2, y: 1.92, w: w - 0.4, h: 0.44, fontFace: T.fontHead, fontSize: 12.5, bold: true, color: "FFFFFF", valign: "middle" });
        d.text(s, b.items.map((t, i) => ({ text: t, options: { bullet: { code: "2022" }, breakLine: i < b.items.length - 1 } })), {
          x: x + 0.22, y: 2.52, w: w - 0.44, h: BOT - 2.68, fontSize: 10.5, color: T.body, paraSpaceAfter: 7, lsm: 1.12,
        });
      });
      return;
    }

    // ------------------------------------------------------------- QA
    if (k === "qa") {
      const s = d.content(sl);
      const g = grid(sl.groups.length, 2, 1.95, BOT, 0.4);
      sl.groups.forEach((grp, i) => {
        const p = g.at(i);
        d.solid(s, p.x, p.y, p.w, p.h, T.bgAlt, T.hair);
        d.text(s, grp.t, { x: p.x + 0.24, y: p.y + 0.16, w: p.w - 0.48, h: 0.32, fontFace: T.fontHead, fontSize: 14, bold: true, color: T.ink });
        grp.items.forEach((it, j) => {
          const y = p.y + 0.62 + j * 0.44;
          d.solid(s, p.x + 0.24, y + 0.1, 0.1, 0.1, T.primarySoft, null);
          d.text(s, it, { x: p.x + 0.5, y, w: p.w - 0.76, h: 0.34, fontSize: 10, color: T.body, valign: "middle" });
        });
      });
      return;
    }

    // ------------------------------------------------------------- diagram
    if (k === "diagram") {
      const s = d.content(sl);
      // Slides carrying an original hand-drawn diagram use the PDF asset
      // instead of a regenerated one.
      if (sl.source) {
        const box = d.sourceImage(s, sl.source);
        if (process.env.HMS_TRACE) {
          console.log(`  slide ${idx + 1}: ${sl.source} ${box.px}px -> ${box.w.toFixed(2)}x${box.h.toFixed(2)}in`);
        }
        return;
      }
      const fn = D[sl.draw];
      if (!fn) throw new Error(`Unknown diagram "${sl.draw}" on slide ${idx + 1}`);
      fn(d, s, sl.data);
      return;
    }

    throw new Error(`Unknown slide kind "${k}" on slide ${idx + 1}`);
  });

  return d.pres.writeFile({ fileName: outFile });
}

const FOOT_TEXT = () => 6.98;

const OUT = "E:\\minor project HMS";
const targets = process.argv[2]
  ? [[process.argv[2], `${OUT}\\Hospital Information System — v2 (${process.argv[2] === "legacy" ? "Legacy" : "Modern"}).pptx`]]
  : [["legacy", `${OUT}\\Hospital Information System — v2 (Legacy).pptx`],
     ["modern", `${OUT}\\Hospital Information System — v2 (Modern).pptx`]];

(async () => {
  for (const [theme, file] of targets) {
    await build(theme, file);
    console.log(`built  ${theme.padEnd(7)} -> ${file}`);
  }
  console.log(`slides: ${TOTAL}`);
})();
