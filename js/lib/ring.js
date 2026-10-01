// Vòng ảnh 3D: tính vị trí từng ảnh theo khoảng cách (có dấu) tới ảnh đang chọn.
export function signedDistance(i, current, n) {
  let d = (((i - current) % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

// Mỗi bậc khoảng cách: dịch ngang (tỉ lệ so với bề rộng ảnh ĐANG Ở GIỮA, biến CSS --cw), lùi sâu (px), xoay trục Y (độ), co nhỏ, độ mờ, thứ tự lớp.
const STEPS = {
  0: { x: 0, z: 0, r: 0, s: 1, o: 1, zi: 100 },
  1: { x: 60, z: -150, r: 45, s: 0.85, o: 0.75, zi: 99 },
  2: { x: 120, z: -300, r: 90, s: 0.7, o: 0.5, zi: 98 },
  3: { x: 180, z: -450, r: 135, s: 0.7, o: 0.3, zi: 97 },
};

export function ringStyle(i, current, n) {
  const d = signedDistance(i, current, n);
  const a = Math.abs(d), sign = Math.sign(d);
  if (a > 3) return { d, visible: false, transform: `translateX(calc(var(--cw, 320px) * ${sign * 2.4})) translateZ(-600px) rotateY(${sign * 180}deg) scale(0.6)`, opacity: 0, zIndex: 96 };
  const p = STEPS[a];
  return { d, visible: true, transform: `translateX(${a === 0 ? "0px" : `calc(var(--cw, 320px) * ${(sign * p.x) / 100})`}) translateZ(${p.z}px) rotateY(${sign * p.r}deg) scale(${p.s})`, opacity: p.o, zIndex: p.zi };
}
