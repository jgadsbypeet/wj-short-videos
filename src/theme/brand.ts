import { AA_NORMAL_TEXT, contrastRatio } from "./contrast";

/**
 * Design tokens extracted from the live site on 20 October 2026.
 * Source stylesheet: https://williamjoseph.co.uk/dist/styles/main-f5e876e7c7.css
 *
 * Ink #1e1e1e, charcoal #464646 and mid #646464 are the text colours.
 * Cream #f9f4eb is the home hero. Cream deep #fcf7ee is the about and testimonial band.
 * Mist #f0f0f2 is the work, blog and project band.
 * Yellow #ffdd00 is the site focus colour (`#fd0`).
 * Aqua #67e5e1 is the newsletter, filter and link accent.
 * Teal #005c66 is the page header, testimonial and "how we work" band.
 * Pink, purple, blue, cyan, magenta and orange appear in the site gradient and UI.
 *
 * Type:
 * - Figtree for headings and the home hero
 * - IBM Plex Sans for navigation, buttons and UI
 * - PT Serif for long-form body (kept as a token; motion type uses Figtree and Plex)
 *
 * Buttons on the site are square. Video UI follows that radius.
 */
export const palette = {
  ink: "#1e1e1e",
  charcoal: "#464646",
  mid: "#646464",
  white: "#ffffff",
  cream: "#f9f4eb",
  creamDeep: "#fcf7ee",
  mist: "#f0f0f2",
  yellow: "#ffdd00",
  aqua: "#67e5e1",
  teal: "#005c66",
  pink: "#ffa3ba",
  purple: "#4b287a",
  blue: "#384aac",
  cyan: "#00b1bb",
  magenta: "#f11782",
  orange: "#f39200",
} as const;

export type PaletteName = keyof typeof palette;

export const fonts = {
  display: '"Figtree", Arial, sans-serif',
  ui: '"IBM Plex Sans", Arial, sans-serif',
  body: '"PT Serif", Georgia, serif',
} as const;

export const layout = {
  fps: 30,
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  safeX: 80,
  safeTop: 108,
  captionHeight: 176,
  contentMax: 880,
  /** Site buttons use border-radius: 0. */
  radius: 0,
} as const;

export type LockedPair = {
  name: string;
  fg: string;
  bg: string;
  ratio: number;
};

const pairCandidates = [
  { name: "inkOnWhite", fg: palette.ink, bg: palette.white },
  { name: "inkOnCream", fg: palette.ink, bg: palette.cream },
  { name: "inkOnCreamDeep", fg: palette.ink, bg: palette.creamDeep },
  { name: "inkOnMist", fg: palette.ink, bg: palette.mist },
  { name: "inkOnYellow", fg: palette.ink, bg: palette.yellow },
  { name: "inkOnAqua", fg: palette.ink, bg: palette.aqua },
  { name: "inkOnPink", fg: palette.ink, bg: palette.pink },
  { name: "charcoalOnWhite", fg: palette.charcoal, bg: palette.white },
  { name: "charcoalOnCream", fg: palette.charcoal, bg: palette.cream },
  { name: "charcoalOnYellow", fg: palette.charcoal, bg: palette.yellow },
  { name: "charcoalOnAqua", fg: palette.charcoal, bg: palette.aqua },
  { name: "whiteOnInk", fg: palette.white, bg: palette.ink },
  { name: "whiteOnCharcoal", fg: palette.white, bg: palette.charcoal },
  { name: "whiteOnTeal", fg: palette.white, bg: palette.teal },
  { name: "whiteOnPurple", fg: palette.white, bg: palette.purple },
  { name: "whiteOnBlue", fg: palette.white, bg: palette.blue },
  { name: "creamOnTeal", fg: palette.cream, bg: palette.teal },
  { name: "creamOnPurple", fg: palette.cream, bg: palette.purple },
  { name: "creamOnInk", fg: palette.cream, bg: palette.ink },
  { name: "yellowOnTeal", fg: palette.yellow, bg: palette.teal },
  { name: "yellowOnInk", fg: palette.yellow, bg: palette.ink },
  { name: "yellowOnPurple", fg: palette.yellow, bg: palette.purple },
  { name: "aquaOnInk", fg: palette.aqua, bg: palette.ink },
  { name: "aquaOnTeal", fg: palette.aqua, bg: palette.teal },
  { name: "tealOnCream", fg: palette.teal, bg: palette.cream },
  { name: "tealOnWhite", fg: palette.teal, bg: palette.white },
  { name: "tealOnYellow", fg: palette.teal, bg: palette.yellow },
  { name: "tealOnMist", fg: palette.teal, bg: palette.mist },
  { name: "tealOnAqua", fg: palette.teal, bg: palette.aqua },
] as const;

function lockPairs(
  entries: readonly { name: string; fg: string; bg: string }[],
): Record<string, LockedPair> {
  const locked: Record<string, LockedPair> = {};
  for (const entry of entries) {
    const ratio = contrastRatio(entry.fg, entry.bg);
    if (ratio < AA_NORMAL_TEXT) {
      throw new Error(
        `${entry.name} (${entry.fg} on ${entry.bg}) is ${ratio.toFixed(2)}:1, below WCAG 2.2 AA ${AA_NORMAL_TEXT}:1`,
      );
    }
    locked[entry.name] = {
      name: entry.name,
      fg: entry.fg,
      bg: entry.bg,
      ratio: Math.round(ratio * 100) / 100,
    };
  }
  return locked;
}

/** Text and background combinations that pass WCAG 2.2 AA. Components must use these. */
export const pairs = lockPairs(pairCandidates);

export type PairName = keyof typeof pairs;

export function getPair(name: string): LockedPair {
  const pair = pairs[name];
  if (!pair) {
    throw new Error(
      `Unknown colour pair "${name}". Use one of: ${Object.keys(pairs).join(", ")}`,
    );
  }
  return pair;
}

/** A locked text colour for a button that sits on the decorative accent. */
export function buttonOn(background: string): LockedPair {
  const accent = decorativeAccent(background).toLowerCase();
  const preferred = Object.values(pairs).find(
    (pair) =>
      pair.bg.toLowerCase() === accent &&
      (pair.fg.toLowerCase() === palette.ink || pair.fg.toLowerCase() === palette.white),
  );
  if (!preferred) {
    throw new Error(`No WCAG locked text colour for accent ${accent}.`);
  }
  return preferred;
}

/**
 * Decorative second colour for a band or shape. Never apply this to text.
 * Chosen from the site palette so each canvas still reads as a duotone.
 */
export function decorativeAccent(background: string): string {
  const accents: Record<string, string> = {
    [palette.cream]: palette.teal,
    [palette.creamDeep]: palette.teal,
    [palette.mist]: palette.teal,
    [palette.white]: palette.teal,
    [palette.yellow]: palette.teal,
    [palette.aqua]: palette.teal,
    [palette.pink]: palette.teal,
    [palette.teal]: palette.yellow,
    [palette.ink]: palette.yellow,
    [palette.charcoal]: palette.aqua,
    [palette.purple]: palette.yellow,
    [palette.blue]: palette.yellow,
  };
  return accents[background.toLowerCase()] ?? palette.yellow;
}
