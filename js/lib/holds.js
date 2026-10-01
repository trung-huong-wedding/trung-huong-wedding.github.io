// Bộ đếm "giữ" có lý do. Cùng một lý do có thể được giữ nhiều lần (popup chồng popup):
// phải nhả đủ số lần mới hết giữ.
export function createHolds() {
  const counts = new Map();
  return {
    hold(reason) { counts.set(reason, (counts.get(reason) ?? 0) + 1); },
    release(reason) { const n = counts.get(reason) ?? 0; if (n <= 1) counts.delete(reason); else counts.set(reason, n - 1); },
    active: () => counts.size > 0,
    reasons: () => [...counts.keys()],
  };
}
