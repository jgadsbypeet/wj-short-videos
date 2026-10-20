import { existsSync } from "node:fs";
import path from "node:path";

/** Used by ingest and the tests. The browser preview does not import this file. */
export function assertPublicImage(image: string, context: string): void {
  const imagePath = path.join(process.cwd(), "public", image);
  if (!existsSync(imagePath)) {
    throw new Error(`${context}: no file at public/${image}.`);
  }
}
