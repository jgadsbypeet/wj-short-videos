import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AA_NORMAL_TEXT, contrastRatio } from "../src/theme/contrast";
import { buttonOn, decorativeAccent, pairs, palette } from "../src/theme/brand";

describe("brand contrast", () => {
  it("locks every text pair to WCAG 2.2 AA", () => {
    for (const pair of Object.values(pairs)) {
      const ratio = contrastRatio(pair.fg, pair.bg);
      assert.ok(
        ratio >= AA_NORMAL_TEXT,
        `${pair.name} measured ${ratio.toFixed(2)}`,
      );
      assert.equal(pair.ratio, Math.round(ratio * 100) / 100);
    }
  });

  it("uses the live site palette", () => {
    assert.equal(palette.ink, "#1e1e1e");
    assert.equal(palette.charcoal, "#464646");
    assert.equal(palette.cream, "#f9f4eb");
    assert.equal(palette.mist, "#f0f0f2");
    assert.equal(palette.yellow, "#ffdd00");
    assert.equal(palette.aqua, "#67e5e1");
    assert.equal(palette.teal, "#005c66");
  });

  it("gives every canvas a button colour that still passes", () => {
    const backgrounds = new Set(Object.values(pairs).map((pair) => pair.bg));
    for (const background of backgrounds) {
      const button = buttonOn(background);
      assert.equal(button.bg.toLowerCase(), decorativeAccent(background).toLowerCase());
      assert.ok(contrastRatio(button.fg, button.bg) >= AA_NORMAL_TEXT);
    }
  });
});
