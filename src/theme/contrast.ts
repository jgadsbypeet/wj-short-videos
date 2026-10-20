/**
 * WCAG 2.2 relative luminance and contrast ratio.
 * https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
 */

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalised = hex.trim().replace("#", "");
  const full =
    normalised.length === 3
      ? normalised
          .split("")
          .map((channel) => channel + channel)
          .join("")
      : normalised;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Invalid colour: ${hex}`);
  }
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function channelLuminance(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

/** Contrast ratio between two colours. Order does not matter. */
export function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  const darker = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  return (lighter + 0.05) / (darker + 0.05);
}

/** WCAG 2.2 AA normal text, including text smaller than 24px and non-bold text. */
export const AA_NORMAL_TEXT = 4.5;
