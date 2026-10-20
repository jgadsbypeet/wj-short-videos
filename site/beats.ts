import type { Beat } from "../src/lib/types";
import { layout } from "../src/theme/brand";

export function beatTitle(beat: Beat): string {
  if (beat.type === "quote") return beat.quote;
  if (beat.type === "data") return `${beat.value} ${beat.label}`;
  return beat.heading;
}

export function clock(frames: number): string {
  const total = Math.max(0, Math.round(frames / layout.fps));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
