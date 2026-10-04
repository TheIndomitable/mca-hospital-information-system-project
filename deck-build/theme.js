// theme.js — two visual identities over identical content/structure.
// Legacy  : reproduces the old MANIT deck identity (Poppins + Montserrat, blue).
// Modern  : pine / teal / emerald, dark section slides, tighter grid.

const shadow = (blur = 14, dist = 3, alpha = 0.16) => ({
  type: "outer",
  color: "000000",
  opacity: alpha,
  blur,
  angle: 90,
  distance: dist,
});

const THEMES = {
  legacy: {
    name: "legacy",
    label: "Academic Legacy",
    fontHead: "Montserrat",
    fontBody: "Poppins",

    // Dominant: white canvas, one strong blue carries the whole system.
    bg: "FFFFFF",
    bgAlt: "F4F8FA", // cool near-white panel
    dark: "274C5E", // deep blue for title / section / conclusion
    dark2: "1B3644",

    ink: "1F3A47", // headings
    body: "3E5C69", // body copy
    muted: "6E8794", // captions
    hair: "D3E3EC", // hairline borders (not an accent stripe)

    primary: "457B9D", // legacy #457B9D
    primarySoft: "98BFDA", // #98BFDA
    aqua: "A8DADC", // #A8DADC
    sand: "FAE5C7", // #FAE5C7
    accent: "E07A5F", // sharp accent, used sparingly

    onDark: "FFFFFF",
    onDarkMuted: "BFD9E4",

    radius: 0.1,
    shadow: shadow(12, 2, 0.13),
    shadowSoft: shadow(8, 1, 0.09),
  },

  modern: {
    name: "modern",
    label: "Modern Product",
    fontHead: "Montserrat",
    fontBody: "Poppins",

    bg: "FFFFFF",
    bgAlt: "F2F7F4",
    dark: "092328", // pine, from global.css
    dark2: "06171B",

    ink: "0C2A28",
    body: "2F4A47",
    muted: "6C8683",
    hair: "D6E6DE",

    primary: "12544F", // teal
    primarySoft: "2A835F", // emerald
    aqua: "8BBB92", // sage
    sand: "EAF3EE",
    accent: "C9A227", // single sharp accent

    onDark: "FFFFFF",
    onDarkMuted: "A9CCC0",

    radius: 0.16,
    shadow: shadow(18, 4, 0.13),
    shadowSoft: shadow(10, 2, 0.08),
  },
};

// Semantic colour picks used by diagrams, so both themes stay internally consistent.
const SEMANTIC = {
  legacy: {
    entity: "457B9D",
    entityText: "FFFFFF",
    process: "A8DADC",
    processText: "1F3A47",
    data: "FAE5C7",
    dataText: "274C5E",
    actor: "98BFDA",
    actorText: "1F3A47",
    store: "457B9D",
    line: "457B9D",
    lineExternal: "E07A5F",
  },
  modern: {
    entity: "12544F",
    entityText: "FFFFFF",
    process: "8BBB92",
    processText: "092328",
    data: "EAF3EE",
    dataText: "0C2A28",
    actor: "2A835F",
    actorText: "FFFFFF",
    store: "12544F",
    line: "12544F",
    lineExternal: "C9A227",
  },
};

const getTheme = (name) => {
  if (!THEMES[name]) throw new Error(`Unknown theme "${name}" (legacy|modern)`);
  return { ...THEMES[name], sem: SEMANTIC[name] };
};

module.exports = { THEMES, getTheme };
