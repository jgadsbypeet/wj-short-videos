import { layout } from "../theme/brand";

/** Reading speed required for on-screen statements. */
export const WORDS_PER_MINUTE = 150;

/** Every key statement stays fully readable for at least this long. */
export const MIN_STATEMENT_SECONDS = 3;

/**
 * Entrance animation length. Reading time starts after the type has settled,
 * so a fade does not eat into the 150 words-per-minute hold.
 */
export const ENTRANCE_FRAMES = 12;

export const MIN_VIDEO_SECONDS = 30;
export const MAX_VIDEO_SECONDS = 60;

export function wordCount(text: string): number {
  const words = text.trim().match(/[A-Za-z0-9][A-Za-z0-9'’%+×-]*/g);
  return words?.length ?? 0;
}

/**
 * Frames a block of simultaneous text must remain on screen.
 * On-screen lines are read in sequence, so their word counts add up.
 * Captions repeat that message for silent viewing, so only extra caption
 * words (words beyond the on-screen count) extend the hold.
 */
export function readingFrames(
  onScreenParts: string[],
  caption: string,
  minSeconds = MIN_STATEMENT_SECONDS,
): number {
  const onScreen = wordCount(onScreenParts.filter(Boolean).join(" "));
  const captionWords = wordCount(caption);
  const words = onScreen + Math.max(0, captionWords - onScreen);
  const seconds = Math.max(minSeconds, (words / WORDS_PER_MINUTE) * 60);
  return Math.ceil(seconds * layout.fps);
}

export function framesToSeconds(frames: number): number {
  return frames / layout.fps;
}
