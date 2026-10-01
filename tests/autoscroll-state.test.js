import test from "node:test";
import assert from "node:assert/strict";
import { createAutoScrollState } from "../js/lib/autoscroll-state.js";

test("mặc định tắt cho tới khi setEnabled(true)", () => {
  const s = createAutoScrollState();
  assert.equal(s.isRunning(), false);
  s.setEnabled(true);
  assert.equal(s.isRunning(), true);
});
test("toggleUser dừng và chạy lại", () => {
  const s = createAutoScrollState(); s.setEnabled(true);
  s.toggleUser(); assert.equal(s.isRunning(), false); assert.equal(s.userPaused(), true);
  s.toggleUser(); assert.equal(s.isRunning(), true);
});
test("hold tạm dừng và release chạy lại nếu người dùng không tự dừng", () => {
  const s = createAutoScrollState(); s.setEnabled(true);
  s.hold("modal"); assert.equal(s.isRunning(), false);
  s.release("modal"); assert.equal(s.isRunning(), true);
});
test("release không bật lại khi người dùng đã tự dừng", () => {
  const s = createAutoScrollState(); s.setEnabled(true);
  s.toggleUser(); s.hold("typing"); s.release("typing");
  assert.equal(s.isRunning(), false);
});
test("nhiều hold độc lập", () => {
  const s = createAutoScrollState(); s.setEnabled(true);
  s.hold("a"); s.hold("b"); s.release("a");
  assert.equal(s.isRunning(), false);
  s.release("b"); assert.equal(s.isRunning(), true);
  s.release("khong-ton-tai"); assert.equal(s.isRunning(), true);
});

test("hai popup chồng nhau cùng lý do 'modal': đóng popup trên cùng vẫn giữ tự cuộn dừng", () => {
  const s = createAutoScrollState(); s.setEnabled(true);
  s.hold("modal"); s.hold("modal"); // thư viện ảnh rồi lightbox
  s.release("modal");               // đóng lightbox
  assert.equal(s.isRunning(), false);
  s.release("modal");               // đóng thư viện ảnh
  assert.equal(s.isRunning(), true);
});
