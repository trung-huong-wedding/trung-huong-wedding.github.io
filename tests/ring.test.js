import test from "node:test";
import assert from "node:assert/strict";
import { signedDistance, ringStyle } from "../js/lib/ring.js";

test("signedDistance: khoảng cách vòng có dấu (phải dương, trái âm)", () => {
  assert.equal(signedDistance(0, 0, 7), 0);
  assert.equal(signedDistance(1, 0, 7), 1);
  assert.equal(signedDistance(6, 0, 7), -1);
  assert.equal(signedDistance(3, 0, 7), 3);
  assert.equal(signedDistance(4, 0, 7), -3);
  assert.equal(signedDistance(0, 6, 7), 1); // quay vòng: sau ảnh cuối là ảnh đầu
});
test("signedDistance với số ảnh chẵn: ảnh đối diện nằm bên phải", () => {
  assert.equal(signedDistance(4, 0, 8), 4);
  assert.equal(signedDistance(5, 0, 8), -3);
});
test("ringStyle: ảnh chính ở giữa, không nghiêng, rõ nhất", () => {
  const s = ringStyle(0, 0, 7);
  assert.equal(s.transform, "translateX(0px) translateZ(0px) rotateY(0deg) scale(1)");
  assert.equal(s.opacity, 1); assert.equal(s.zIndex, 100); assert.equal(s.visible, true);
});
test("ringStyle: ảnh kế bên phải/trái nghiêng đối xứng", () => {
  assert.equal(ringStyle(1, 0, 7).transform, "translateX(calc(var(--cw, 320px) * 0.6)) translateZ(-150px) rotateY(45deg) scale(0.85)");
  assert.equal(ringStyle(6, 0, 7).transform, "translateX(calc(var(--cw, 320px) * -0.6)) translateZ(-150px) rotateY(-45deg) scale(0.85)");
  assert.equal(ringStyle(2, 0, 7).transform, "translateX(calc(var(--cw, 320px) * 1.2)) translateZ(-300px) rotateY(90deg) scale(0.7)");
  assert.equal(ringStyle(4, 0, 7).transform, "translateX(calc(var(--cw, 320px) * -1.8)) translateZ(-450px) rotateY(-135deg) scale(0.7)");
});
test("ringStyle: càng xa càng mờ và nằm sau", () => {
  const o = [0, 1, 2, 3].map((i) => ringStyle(i, 0, 7).opacity);
  assert.deepEqual(o, [1, 0.75, 0.5, 0.3]);
  const z = [0, 1, 2, 3].map((i) => ringStyle(i, 0, 7).zIndex);
  assert.deepEqual(z, [100, 99, 98, 97]);
});
test("ringStyle: ảnh xa hơn 3 bước bị ẩn (khi có hơn 7 ảnh)", () => {
  const s = ringStyle(4, 0, 9); // khoảng cách 4
  assert.equal(s.visible, false); assert.equal(s.opacity, 0);
});
test("ringStyle: chỉ 1 ảnh thì chỉ có ảnh chính", () => {
  assert.equal(ringStyle(0, 0, 1).visible, true);
  assert.equal(ringStyle(0, 0, 1).transform, "translateX(0px) translateZ(0px) rotateY(0deg) scale(1)");
});

test("ringStyle: độ dịch ngang tính theo bề rộng ảnh chính (--cw) nên ảnh khác tỉ lệ vẫn xếp đúng vòng", () => {
  for (let i = 1; i < 7; i++) assert.match(ringStyle(i, 0, 7).transform, /translateX\(calc\(var\(--cw, 320px\) \* -?\d/);
  assert.doesNotMatch(ringStyle(1, 0, 7).transform, /translateX\([-\d.]+%\)/);
});
