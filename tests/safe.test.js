import test from "node:test";
import assert from "node:assert/strict";
import { runSafely } from "../js/lib/safe.js";

test("runSafely chạy hết các bước dù một bước ném lỗi", () => {
  const ran = [];
  const errors = [];
  runSafely([() => ran.push(1), () => { throw new Error("hỏng"); }, () => ran.push(3)], (e, i) => errors.push([i, e.message]));
  assert.deepEqual(ran, [1, 3]);
  assert.deepEqual(errors, [[1, "hỏng"]]);
});
test("runSafely không ném ra ngoài khi không có onError", () => {
  assert.doesNotThrow(() => runSafely([() => { throw new Error("x"); }]));
});
test("runSafely trả về số bước lỗi", () => {
  assert.equal(runSafely([() => {}, () => { throw 1; }, () => { throw 2; }], () => {}), 2);
});
