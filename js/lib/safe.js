// Chạy lần lượt các bước; một bước lỗi không làm hỏng các bước còn lại. Trả về số bước lỗi.
export function runSafely(steps, onError) {
  let failed = 0;
  steps.forEach((fn, i) => {
    try { fn(); } catch (e) { failed++; try { onError?.(e, i); } catch { /* bỏ qua lỗi của trình báo lỗi */ } }
  });
  return failed;
}
