import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { editorialIssues } from "../src/lib/editorial";

describe("editorial rules", () => {
  it("refuses whilst, ampersands and the abbreviation WJ", () => {
    assert.match(editorialIssues("Do this whilst you wait", "body").join(" "), /while/);
    assert.match(editorialIssues("Research & insight", "body").join(" "), /ampersand/);
    assert.match(editorialIssues("The WJ team", "body").join(" "), /William Joseph/);
  });

  it("requires sentence case on headings", () => {
    assert.deepEqual(editorialIssues("Why charity rebrands are different", "heading"), []);
    assert.deepEqual(editorialIssues("What the public actually thinks about AI", "heading"), []);
    assert.deepEqual(editorialIssues("Paul Hamlyn Foundation", "kicker"), []);
    const titled = editorialIssues("Why Charity Rebrands Are Different", "heading");
    assert.ok(titled.some((issue) => issue.includes("sentence case")));
  });

  it("allows a capital after a full stop", () => {
    assert.deepEqual(
      editorialIssues("Bold and colourful. Highly accessible.", "heading"),
      [],
    );
  });
});
