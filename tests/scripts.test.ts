import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { parseArticle } from "../src/lib/parse-article";
import { framesToSeconds, MIN_STATEMENT_SECONDS, readingFrames, ENTRANCE_FRAMES } from "../src/lib/timing";
import { layout } from "../src/theme/brand";

const articlesDir = path.join(process.cwd(), "content/articles");
const files = readdirSync(articlesDir).filter((file) => file.endsWith(".md")).sort();

describe("production scripts", () => {
  it("has one script for each pillar pair", () => {
    assert.equal(files.length, 6);
  });

  for (const file of files) {
    it(`accepts ${file}`, () => {
      const script = parseArticle(readFileSync(path.join(articlesDir, file), "utf8"), file);
      const seconds = framesToSeconds(script.durationInFrames);
      assert.ok(seconds >= 30 && seconds <= 60, `${seconds.toFixed(1)}s`);
      assert.equal(script.beats[0]?.type, "title");
      assert.equal(script.beats.at(-1)?.type, "close");
      assert.equal(script.durationInFrames, script.beats.reduce((sum, beat) => sum + beat.durationInFrames, 0));
      assert.doesNotMatch(JSON.stringify(script), /\bwhilst\b/i);
      assert.doesNotMatch(JSON.stringify(script), /&/);
      assert.doesNotMatch(JSON.stringify(script), /\bWJ\b/);

      for (const beat of script.beats) {
        assert.ok(beat.caption.length > 0);
        assert.ok(beat.caption.length <= 140);
        assert.ok(beat.durationInFrames >= MIN_STATEMENT_SECONDS * layout.fps);
        const visible = visibleWordSource(beat);
        const required = readingFrames(visible, beat.caption) + ENTRANCE_FRAMES;
        assert.ok(beat.durationInFrames >= required);
      }
    });
  }
});

function visibleWordSource(beat: { type: string } & Record<string, unknown>): string[] {
  switch (beat.type) {
    case "title":
      return [String(beat.kicker), String(beat.heading)];
    case "statement":
      return [String(beat.heading), String(beat.body)];
    case "quote":
      return [String(beat.quote), String(beat.attribution)];
    case "data":
      return [String(beat.value), String(beat.label), String(beat.source)];
    case "venn":
      return [String(beat.heading), String(beat.left), String(beat.right), String(beat.bottom), String(beat.centre)];
    case "point":
      return [`${beat.index} of ${beat.total}`, String(beat.heading), String(beat.body)];
    case "device":
    case "list":
      return [String(beat.heading), ...(beat.items as string[])];
    case "close":
      return [String(beat.heading), String(beat.url)];
    default:
      return [];
  }
}
