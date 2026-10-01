// Tiến độ tô màu của đường timeline (0..1): đường tô tới khoảng 60% chiều cao khung nhìn.
export function timelineProgress(top, height, viewportH) {
  if (!(height > 0)) return 0;
  return Math.min(1, Math.max(0, (viewportH * 0.6 - top) / height));
}
