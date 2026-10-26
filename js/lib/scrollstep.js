// Tự cuộn mượt: trình duyệt chỉ cuộn theo số nguyên px, nên tốc độ lẻ (vd 70px/s = 1,17px/khung) làm trang nhích 1px rồi 2px xen kẽ → giật.
// Giải pháp: nhích một số px NGUYÊN cố định, cách đều nhau theo số khung hình, chọn sao cho gần tốc độ cấu hình nhất.
export function pickStep(speed, fps) {
  const sp = Number.isFinite(speed) && speed > 0 ? speed : 60;
  const hz = Number.isFinite(fps) && fps > 0 ? fps : 60;
  let best = null;
  for (let every = 1; every <= 6; every++) for (let px = 1; px <= 6; px++) {
    if (px > 1 && every > 1) continue; // chỉ nhận "N px mỗi khung" hoặc "1px cách k khung": mọi bước đều nhau, không có kiểu 6px/5 khung (lại xen 1-2px)
    const actual = (px * hz) / every, err = Math.abs(actual - sp);
    // ưu tiên sai số nhỏ; hoà thì ưu tiên bước nhỏ (px nhỏ) và nhịp dày (every nhỏ) cho mượt
    if (!best || err < best.err - 1e-9 || (Math.abs(err - best.err) < 1e-9 && (px < best.px || (px === best.px && every < best.every)))) best = { px, every, actual, err };
  }
  return { px: best.px, every: best.every, actual: best.actual };
}

export function medianFrameMs(samples) {
  const a = samples.filter((x) => Number.isFinite(x) && x > 0).sort((x, y) => x - y);
  return a.length ? a[Math.floor(a.length / 2)] : 1000 / 60;
}
