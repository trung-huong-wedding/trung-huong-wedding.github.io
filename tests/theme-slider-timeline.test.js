import test from "node:test";
import assert from "node:assert/strict";
import { themeToCssVars } from "../js/lib/theme.js";
import { nextIndex } from "../js/lib/slider.js";
import { timelineProgress } from "../js/lib/timeline.js";

test("themeToCssVars ánh xạ khoá camelCase sang biến CSS và bỏ giá trị không hợp lệ", () => {
  const v = themeToCssVars({ bg: "#fff", pinkSoft: "#F7C6CE", red: "red; x:{", wine: "", unknown: "#000", gold: 5 });
  assert.deepEqual(v, { "--bg": "#fff", "--pink-soft": "#F7C6CE" });
});
test("themeToCssVars hỗ trợ hai màu của thẻ bìa (heroAccent, heroInk)", () => {
  assert.deepEqual(themeToCssVars({ heroAccent: "#CB5D6C", heroInk: "#933845" }), { "--hero-accent": "#CB5D6C", "--hero-ink": "#933845" });
});
test("themeToCssVars chịu được undefined", () => assert.deepEqual(themeToCssVars(undefined), {}));
test("nextIndex lặp vòng hai chiều", () => {
  assert.equal(nextIndex(0, 5, 1), 1); assert.equal(nextIndex(4, 5, 1), 0);
  assert.equal(nextIndex(0, 5, -1), 4); assert.equal(nextIndex(2, 5, 10), 2);
  assert.equal(nextIndex(3, 0, 1), 0); assert.equal(nextIndex(0, 1, 1), 0);
});
test("timelineProgress từ 0 đến 1, chịu chiều cao 0", () => {
  assert.equal(timelineProgress(1000, 2000, 800), 0);
  assert.equal(timelineProgress(480 - 1000, 1000, 800), 1);
  assert.ok(Math.abs(timelineProgress(480 - 500, 1000, 800) - 0.5) < 1e-9);
  assert.equal(timelineProgress(0, 0, 800), 0);
});
