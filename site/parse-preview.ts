import { parseArticle } from "../src/lib/parse-article";
import type { VideoScript } from "../src/lib/types";

/** Picture files shipped in public/case-studies. Add a path here when a film gains a still. */
const publishedImages = new Set([
  "case-studies/booktrust-homepage.jpg",
  "case-studies/phf-fund-finder.jpg",
]);

export function parsePreview(markdown: string, filename: string): VideoScript {
  return parseArticle(markdown, filename, {
    assertImage(image, context) {
      if (!publishedImages.has(image)) {
        throw new Error(`${context}: no file at public/${image}.`);
      }
    },
  });
}
