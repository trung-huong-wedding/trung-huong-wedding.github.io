import test from "node:test";
import assert from "node:assert/strict";
import { withTimeout, TimeoutError } from "../js/lib/async.js";

test("withTimeout trả giá trị khi promise xong kịp", async () => {
  assert.equal(await withTimeout(Promise.resolve(42), 50), 42);
});
test("withTimeout báo TimeoutError khi quá hạn", async () => {
  await assert.rejects(withTimeout(new Promise(() => {}), 20), (e) => e instanceof TimeoutError);
});
test("withTimeout giữ nguyên lỗi gốc nếu promise tự reject trước hạn", async () => {
  await assert.rejects(withTimeout(Promise.reject(new Error("boom")), 50), /boom/);
});
test("withTimeout không để timer treo sau khi xong", async () => {
  const t0 = Date.now();
  await withTimeout(Promise.resolve(1), 5000);
  assert.ok(Date.now() - t0 < 200);
});
