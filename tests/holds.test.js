import test from "node:test";
import assert from "node:assert/strict";
import { createHolds } from "../js/lib/holds.js";

test("một lý do giữ hai lần, nhả một lần thì vẫn còn giữ", () => {
  const h = createHolds();
  h.hold("modal"); h.hold("modal"); h.release("modal");
  assert.equal(h.active(), true);
  h.release("modal");
  assert.equal(h.active(), false);
});
test("nhả thừa không làm số đếm âm: lần giữ kế tiếp vẫn có hiệu lực", () => {
  const h = createHolds();
  h.release("x"); h.release("x");
  h.hold("x");
  assert.equal(h.active(), true);
  h.release("x");
  assert.equal(h.active(), false);
});
test("nhiều lý do độc lập", () => {
  const h = createHolds();
  h.hold("a"); h.hold("b"); h.release("a");
  assert.equal(h.active(), true); assert.deepEqual(h.reasons(), ["b"]);
  h.release("b"); assert.equal(h.active(), false); assert.deepEqual(h.reasons(), []);
});
