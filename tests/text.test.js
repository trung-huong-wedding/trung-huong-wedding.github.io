import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeGuestName, validateEntry, cooldownRemaining, isFirebaseConfigured } from "../js/lib/text.js";

test("sanitizeGuestName giữ chữ thường, cắt độ dài, bỏ ký tự điều khiển", () => {
  assert.equal(sanitizeGuestName("  Anh Nam  "), "Anh Nam");
  assert.equal(sanitizeGuestName(null), "");
  assert.equal(sanitizeGuestName("a\u0000b\u0007c"), "abc");
  assert.equal(sanitizeGuestName("x".repeat(100)).length, 60);
});
test("sanitizeGuestName không loại bỏ thẻ HTML (phải dùng textContent khi render)", () => {
  assert.equal(sanitizeGuestName("<img onerror=x>"), "<img onerror=x>");
});
const L = { maxName: 50, maxMessage: 300 };
test("validateEntry hợp lệ", () => {
  const r = validateEntry({ name: "  An ", message: " Chúc mừng!  " }, L);
  assert.equal(r.ok, true); assert.deepEqual(r.value, { name: "An", message: "Chúc mừng!" });
});
test("validateEntry từ chối rỗng và toàn khoảng trắng", () => {
  const r = validateEntry({ name: "   ", message: "\n\t " }, L);
  assert.equal(r.ok, false); assert.ok(r.errors.name); assert.ok(r.errors.message);
});
test("validateEntry từ chối quá dài", () => {
  const r = validateEntry({ name: "a".repeat(51), message: "b".repeat(301) }, L);
  assert.equal(r.ok, false); assert.ok(r.errors.name); assert.ok(r.errors.message);
});
test("validateEntry chấp nhận đúng biên", () => {
  assert.equal(validateEntry({ name: "a".repeat(50), message: "b".repeat(300) }, L).ok, true);
});
test("cooldownRemaining", () => {
  assert.equal(cooldownRemaining(0, 10_000, 30), 20);
  assert.equal(cooldownRemaining(0, 40_000, 30), 0);
  assert.equal(cooldownRemaining(NaN, 1, 30), 0);
});
test("isFirebaseConfigured cần apiKey và projectId", () => {
  assert.equal(isFirebaseConfigured({ apiKey: "", projectId: "p" }), false);
  assert.equal(isFirebaseConfigured({ apiKey: "k", projectId: "" }), false);
  assert.equal(isFirebaseConfigured({ apiKey: "k", projectId: "p" }), true);
  assert.equal(isFirebaseConfigured(undefined), false);
});
