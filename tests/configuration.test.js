import assert from "node:assert/strict";
import { test } from "node:test";
import { createDraft, DEFAULTS, SHAPES } from "../src/js/configuration.js";

test("defaults produce the server's five default parameters", () => {
  const draft = createDraft(DEFAULTS);
  assert.equal(draft.valid, true);
  assert.equal(draft.url, "https://morph.vectorindex.cloud/?n=2000&current=1&delay=8000&loop=true&bg=000000");
  assert.deepEqual(draft.errors, {});
});

test("normalizes form strings and encodes all six parameters", () => {
  const draft = createDraft({ n: " 02000 ", current: "17", delay: "0001", loop: false, bg: " #A0B1C2 ", pixel: "ff2b2b" });
  assert.equal(draft.valid, true);
  assert.equal(draft.url, "https://morph.vectorindex.cloud/?n=2000&current=17&delay=1&loop=false&bg=a0b1c2&pixel=ff2b2b");
});

test("supports exactly the 18 server shape IDs with English labels", () => {
  assert.equal(SHAPES.length, 18);
  assert.equal(SHAPES[0], "Line");
  assert.equal(SHAPES[17], "Wave Curtain");
  for (let current = 0; current < 18; current++) {
    assert.equal(createDraft({ ...DEFAULTS, current }).valid, true);
    assert.match(SHAPES[current], /^[A-Za-z]/);
    assert.doesNotMatch(SHAPES[current], /^Shape \d+$/);
  }
});

test("accepts the numeric limits", () => {
  for (const n of [1, 10000]) {
    for (const delay of [1, 120000]) {
      assert.equal(createDraft({ ...DEFAULTS, n, delay }).valid, true);
    }
  }
});

const invalidValues = {
  n: ["", " ", "0", "-1", "1.5", "1e3", "10001", "Infinity"],
  current: ["", " ", "-1", "18", "1.5", "abc"],
  delay: ["", "0", "-1", "1.5", "120001", "8e3"],
  loop: ["false", 0, undefined],
  bg: ["", "abc", "12345g", "0000000", "#123"],
  pixel: ["red", "FF2B2B", "abcdef", undefined],
};

for (const [field, inputs] of Object.entries(invalidValues)) {
  test(`rejects invalid ${field} values without producing a URL`, () => {
    for (const value of inputs) {
      const draft = createDraft({ ...DEFAULTS, [field]: value });
      assert.equal(draft.valid, false, `${field}=${String(value)}`);
      assert.equal(draft.url, "");
      assert.ok(draft.errors[field]);
    }
  });
}

test("reports multiple field errors and preserves the caller's input", () => {
  const input = Object.freeze({ ...DEFAULTS, n: "0", bg: "oops" });
  const draft = createDraft(input);
  assert.deepEqual(Object.keys(draft.errors), ["n", "bg"]);
  assert.equal(input.bg, "oops");
});
