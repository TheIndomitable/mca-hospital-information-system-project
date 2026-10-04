// kit.js — theme-aware slide primitives shared by both decks.
// Identical geometry and content in legacy/modern; only colour + treatment differ.

const PptxGenJS = require("pptxgenjs");
const { getTheme } = require("./theme");
const fs = require("fs");
const path = require("path");

const SW = 13.3; // LAYOUT_WIDE
const SH = 7.5;
const M = 0.62; // page margin
const CW = SW - 2 * M; // 12.06 content width
const HEAD_Y = 0.5;
const BODY_Y = 1.72; // first usable content row
const FOOT_Y = 6.98;

const TOTAL_SLIDES = 45; // overwritten per deck from content.js

function makeDeck(themeName, opts = {}) {
  const T = getTheme(themeName);
  const TOTAL = opts.total || TOTAL_SLIDES;
  const pres = new PptxGenJS();
  const ST = pres.ShapeType;
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Ashutosh Sharma, Bhavishya Sisodiya, Nitish Kumar";
  pres.company = "MANIT Bhopal — Dept. of Mathematics, Bioinformatics and Computer Application";
  pres.title = opts.title || "Hospital Management System";
  pres.subject = "Minor Project Presentation";

  let page = 0;

  // ---------------------------------------------------------------- primitives
  const sh = (s, x, y, w, h, fill, radius = T.radius) =>
    s.addShape(
      fill ? ST.roundRect : ST.roundRect,
      {
        x, y, w, h,
        fill: fill ? { color: fill } : { type: "none" },
        line: { color: T.hair, width: 0.75 },
        rectRadius: radius,
      }
    );

  const solid = (s, x, y, w, h, fill, lineColor) =>
    s.addShape(ST.roundRect, {
      x, y, w, h,
      fill: { color: fill },
      line: lineColor ? { color: lineColor, width: 0.75 } : { type: "none" },
      rectRadius: T.radius,
    });

  const circle = (s, cx, cy, d, fill, lineColor) =>
    s.addShape(ST.ellipse, {
      x: cx - d / 2, y: cy - d / 2, w: d, h: d,
      fill: { color: fill },
      line: lineColor ? { color: lineColor, width: 0.75 } : { type: "none" },
    });

  // Monogram / number token in a filled circle — our repeating visual motif.
  const token = (s, cx, cy, d, label, fill, fg) => {
    circle(s, cx, cy, d, fill);
    s.addText(String(label), {
      x: cx - d / 2, y: cy - d / 2, w: d, h: d,
      align: "center", valign: "middle", margin: 0,
      fontFace: T.fontHead, fontSize: d * 26, bold: true, color: fg,
    });
  };

  const line = (s, x1, y1, x2, y2, opts = {}) => {
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const w = Math.abs(x2 - x1) || 0.001;
    const h = Math.abs(y2 - y1) || 0.001;
    s.addShape(ST.line, {
      x, y, w, h,
      flipV: y2 < y1,
      line: {
        color: opts.color || T.sem.line,
        width: opts.width || 1.25,
        dashType: opts.dash || "solid",
        endArrowType: opts.arrow ? "triangle" : "none",
        beginArrowType: opts.beginArrow ? "triangle" : "none",
      },
    });
  };

  const text = (s, str, o = {}) => {
    const runs = Array.isArray(str) ? str : [{ text: str, options: {} }];
    s.addText(
      runs.map((r) => ({
        text: r.text,
        options: {
          fontFace: r.options.fontFace || o.fontFace || T.fontBody,
          fontSize: r.options.fontSize ?? o.fontSize ?? 15,
          bold: r.options.bold ?? o.bold ?? false,
          color: r.options.color ?? o.color ?? T.body,
          italic: r.options.italic ?? o.italic ?? false,
          charSpacing: r.options.charSpacing ?? o.charSpacing,
          breakLine: r.options.breakLine,
        },
      })),
      {
        x: o.x, y: o.y, w: o.w, h: o.h,
        align: o.align || "left",
        valign: o.valign || "top",
        margin: o.margin ?? 0,
        lineSpacingMultiple: o.lsm ?? 1.12,
        paraSpaceAfter: o.paraSpaceAfter,
        isTextBox: true,
        shrinkText: false,
      }
    );
  };

  // ---------------------------------------------------------------- slide shell
  const newSlide = (o = {}) => {
    const s = pres.addSlide();
    if (o.bg) s.background = { color: o.bg };
    if (o.notes) s.addNotes(o.notes);
    return s;
  };

  // Standard content-slide header: motif dot + kicker, then title. No accent rule.
  const head = (s, d = {}) => {
    if (d.kicker) {
      solid(s, M, HEAD_Y + 0.045, 0.155, 0.155, d.dark ? T.aqua : T.primarySoft, null);
      text(s, d.kicker.toUpperCase(), {
        x: M + 0.3, y: HEAD_Y - 0.03, w: CW - 0.3, h: 0.3,
        fontFace: T.fontHead, fontSize: 11.5, bold: true,
        charSpacing: 2.1, color: d.dark ? T.aqua : T.primary,
      });
    }
    const size = d.size || 34;
    text(s, d.title, {
      x: M, y: HEAD_Y + 0.34, w: d.tw || CW, h: d.th || 0.72,
      fontFace: T.fontHead, fontSize: size, bold: true,
      color: d.dark ? T.onDark : T.ink,
      lsm: 1.02,
    });
    if (d.sub) {
      text(s, d.sub, {
        x: M, y: HEAD_Y + 0.34 + (d.th || 0.72) + 0.02, w: d.sw || CW, h: 0.4,
        fontFace: T.fontBody, fontSize: 13.5, color: d.dark ? T.onDarkMuted : T.muted,
      });
    }
  };

  const foot = (s, { dark = false, label = "Hospital Management System" } = {}) => {
    text(s, label, {
      x: M, y: FOOT_Y, w: CW * 0.7, h: 0.28,
      fontSize: 9.5, color: dark ? T.onDarkMuted : T.muted,
    });
    text(s, `${page} / ${TOTAL}`, {
      x: M + CW * 0.7, y: FOOT_Y, w: CW * 0.3, h: 0.28,
      fontSize: 9.5, align: "right", color: dark ? T.onDarkMuted : T.muted,
    });
  };

  // Standard content slide: header + footer, returns slide for body drawing.
  const content = (d = {}, opts = {}) => {
    const dark = !!opts.dark;
    const s = newSlide({ bg: opts.bg || (dark ? T.dark : T.bg), notes: d.notes });
    head(s, { ...d, dark });
    if (opts.foot !== false) foot(s, { dark });
    return s;
  };

  // ---------------------------------------------------------------- components
  // Card with a leading token, a heading and body lines.
  const card = (s, o) => {
    const { x, y, w, h, label, title, lines = [], sub, fill = T.bgAlt, tag } = o;
    solid(s, x, y, w, h, fill, T.hair);
    if (label) {
      const dd = 0.42;
      token(s, x + 0.42, y + 0.46, dd, label, o.tokenFill || T.primary, o.tokenFg || "FFFFFF");
    }
    const labelD = label ? 0.78 : 0.28;
    const tx = x + labelD;
    const tw = w - labelD - 0.28;
    // compact cards squeeze the header and foot so the body still gets 3 lines
    const cp = o.compact;
    const titleH = cp ? 0.4 : 0.46;
    const titleTop = cp ? 0.14 : 0.2;
    const tagH = tag ? (cp ? 0.28 : 0.34) : 0;
    const footH = tag ? (cp ? 0.28 : 0.34) : 0;
    const bodyTop = titleTop + titleH + 0.02;
    const bodyH = h - bodyTop - footH - 0.02;

    text(s, title, {
      x: tx, y: y + titleTop, w: tw, h: titleH,
      fontFace: T.fontHead, fontSize: o.titleSize || 14.5, bold: true, color: T.ink,
      valign: "middle", lsm: 1.02,
    });
    if (sub) {
      text(s, sub, {
        x: tx, y: y + bodyTop, w: tw, h: Math.max(bodyH, 0.2),
        fontSize: o.bodySize || 11.5, color: T.body, lsm: 1.1,
      });
    } else if (lines.length) {
      text(
        s,
        lines.map((t, i) => ({
          text: t,
          options: { bullet: { code: "2022" }, breakLine: i < lines.length - 1, color: T.body },
        })),
        {
          x: tx, y: y + bodyTop, w: tw, h: Math.max(bodyH, 0.2),
          fontSize: o.bodySize || 11.5, color: T.body, paraSpaceAfter: cp ? 1 : 4,
        }
      );
    }
    // tag pill sits at the card foot so it can never collide with the title
    if (tag) {
      const ty = y + h - footH - 0.02;
      solid(s, x + 0.28, ty, 1.14, 0.24, o.tagFill || T.sand, null);
      text(s, tag, {
        x: x + 0.28, y: ty, w: 1.14, h: 0.24,
        fontFace: T.fontHead, fontSize: 8.5, bold: true, align: "center", valign: "middle",
        color: o.tagFg || T.ink,
      });
    }
  };

  // Big-number callout.
  const stat = (s, o) => {
    const { x, y, w, h, value, label, sub, fill = T.bgAlt } = o;
    solid(s, x, y, w, h, fill, T.hair);
    // vertical layout scales with the tile height so value/label can never collide
    const vTop = y + h * 0.09;
    const vH = h * 0.5;
    const lTop = vTop + vH + h * 0.04;
    const lH = h - (lTop - y) - h * 0.07;
    const vsize = Math.min(o.vsize || 44, Math.max(20, h * 34));
    const lfs = Math.min(12.5, Math.max(9.5, h * 13));
    text(s, value, {
      x: x + 0.16, y: vTop, w: w - 0.32, h: vH,
      fontFace: T.fontHead, fontSize: vsize, bold: true,
      color: o.vcolor || T.primary, align: "center", valign: "middle", lsm: 0.95,
    });
    text(s, label, {
      x: x + 0.16, y: lTop, w: w - 0.32, h: Math.max(lH, 0.16),
      fontFace: T.fontHead, fontSize: lfs, bold: true, align: "center",
      color: T.ink, valign: "middle",
    });
    if (sub) {
      text(s, sub, {
        x: x + 0.16, y: lTop + Math.max(lH, 0.16), w: w - 0.32,
        h: Math.max(y + h - lTop - Math.max(lH, 0.16) - 0.08, 0.16),
        fontSize: 10.5, align: "center", color: T.muted, lsm: 1.08,
      });
    }
  };

  // Two-column bullet list with a heading per column.
  const listRows = (s, o) => {
    const { x, y, w, rows, rowH = 0.82, d = 0.3, fs = 12, gap = 0.06 } = o;
    const tw = w - d - 0.18;
    const titleH = 0.3;
    const subH = rowH - titleH;
    rows.forEach((r, i) => {
      const ry = y + i * (rowH + gap);
      token(s, x + d / 2, ry + titleH / 2, d, r.n ?? i + 1, r.fill || T.aqua, r.fg || T.ink);
      text(s, r.title, {
        x: x + d + 0.18, y: ry, w: tw, h: titleH,
        fontFace: T.fontHead, fontSize: fs, bold: true, color: T.ink, valign: "middle",
      });
      if (r.sub) {
        text(s, r.sub, {
          x: x + d + 0.18, y: ry + titleH, w: tw, h: subH,
          fontSize: fs - 2.5, color: T.muted, valign: "top", lsm: 1.06,
        });
      }
    });
    return y + rows.length * (rowH + gap);
  };

  // Grid of chips — used for per-role menu inventories.
  const chipGrid = (s, o) => {
    const { x, y, w, items, cols = 3, chipH = 0.42, gap = 0.14, fs = 11 } = o;
    const cw = (w - (cols - 1) * gap) / cols;
    items.forEach((it, i) => {
      const r = Math.floor(i / cols);
      const c = i % cols;
      const cx = x + c * (cw + gap);
      const cy = y + r * (chipH + gap);
      solid(s, cx, cy, cw, chipH, it.fill || T.bgAlt, T.hair);
      solid(s, cx, cy + 0.11, 0.09, chipH - 0.22, it.mark || T.primarySoft, null);
      text(s, it.t, {
        x: cx + 0.24, y: cy, w: cw - 0.36, h: chipH,
        fontSize: fs, color: T.body, valign: "middle",
      });
    });
    return y + Math.ceil(items.length / cols) * (chipH + gap);
  };

  // Numbered process pipeline with chevrons.
  const pipeline = (s, o) => {
    const { x, y, w, steps, h = 0.9, gap = 0.14 } = o;
    const n = steps.length;
    const sw = (w - (n - 1) * gap) / n;
    steps.forEach((st, i) => {
      const sx = x + i * (sw + gap);
      solid(s, sx, y, sw, h, st.fill || T.bgAlt, T.hair);
      text(s, st.n ?? i + 1, {
        x: sx + 0.12, y: y + 0.09, w: 0.4, h: 0.3,
        fontFace: T.fontHead, fontSize: 11, bold: true, color: st.mark || T.primary,
      });
      text(s, st.t, {
        x: sx + 0.12, y: y + 0.32, w: sw - 0.24, h: h - 0.42,
        fontFace: T.fontHead, fontSize: 11.5, bold: true, color: T.ink, lsm: 1.05,
      });
      if (i < n - 1) {
        line(s, sx + sw + 0.02, y + h / 2, sx + sw + gap - 0.02, y + h / 2, {
          color: T.primarySoft, width: 1.5, arrow: true,
        });
      }
    });
    return y + h;
  };

  // Simple data table.
  const table = (s, o) => {
    const { x, y, w, head: hd, rows, colW, fs = 11, rh = 0.36 } = o;
    const widths = colW || Array(hd.length).fill(w / hd.length);
    // header
    let cx = x;
    hd.forEach((c, i) => {
      solid(s, cx, y, widths[i], rh, T.primary, null);
      text(s, c, {
        x: cx + 0.1, y, w: widths[i] - 0.2, h: rh,
        fontFace: T.fontHead, fontSize: fs, bold: true, color: "FFFFFF", valign: "middle",
      });
      cx += widths[i];
    });
    rows.forEach((r, ri) => {
      const ry = y + rh + ri * rh;
      let rx = x;
      r.forEach((c, i) => {
        solid(s, rx, ry, widths[i], rh, ri % 2 ? T.bg : T.bgAlt, T.hair);
        text(s, String(c), {
          x: rx + 0.1, y: ry, w: widths[i] - 0.2, h: rh,
          fontSize: fs, color: i === 0 ? T.ink : T.body,
          bold: i === 0, valign: "middle",
        });
        rx += widths[i];
      });
    });
    return y + rh * (rows.length + 1);
  };

  // ------------------------------------------------------- original diagram
  // PNG pixel size straight from the IHDR chunk, so the image is placed at its
  // true aspect ratio without relying on any library-side guesswork.
  const pngSize = (p) => {
    const fd = fs.openSync(p, "r");
    try {
      const b = Buffer.alloc(24);
      fs.readSync(fd, b, 0, 24, 0);
      return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    } finally {
      fs.closeSync(fd);
    }
  };

  // A diagram the team drew by hand, lifted from the project PDF at full source
  // resolution. Scaled to the largest box its aspect ratio allows and centred,
  // on a white plate so a white-background diagram reads cleanly against the
  // themed slide. Never resampled: the pixels on disk are the pixels placed.
  const sourceImage = (s, name) => {
    const file = path.join(__dirname, "assets", "diagrams", `${name}.png`);
    if (!fs.existsSync(file)) throw new Error(`missing source diagram: ${name}.png`);
    const { w: pw, h: ph } = pngSize(file);
    const top = 2.04;                 // just under the header sub-line
    const bot = 6.86;                 // just above the footer
    const pad = 0.1;                  // white plate margin
    const availW = CW - pad * 2;
    const availH = bot - top - pad * 2;
    const ar = pw / ph;
    let iw = availW;
    let ih = iw / ar;
    if (ih > availH) {
      ih = availH;
      iw = ih * ar;
    }
    const x = M + (CW - iw) / 2;
    const y = top + (bot - top - ih) / 2;
    solid(s, x - pad, y - pad, iw + pad * 2, ih + pad * 2, "FFFFFF", T.hair);
    s.addImage({ path: file, x, y, w: iw, h: ih });
    return { x, y, w: iw, h: ih, px: pw };
  };

  return {
    pres, T, ST, page: () => page, setPage: (n) => { page = n; },
    newSlide, content, head, foot,
    sh, solid, circle, token, line, text, card, stat, listRows, chipGrid, pipeline, table,
    sourceImage,
  };
}

const GEO = { SW, SH, M, CW, HEAD_Y, BODY_Y, FOOT_Y, TOTAL_SLIDES };
module.exports = { makeDeck, GEO, SW, SH, M, CW, BODY_Y };
