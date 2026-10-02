import { createHolds } from "./holds.js";

export function createAutoScrollState() {
  let enabled = false, paused = false;
  const holds = createHolds();
  return {
    setEnabled(v) { enabled = !!v; },
    toggleUser() { paused = !paused; return paused; },
    pauseUser() { paused = true; return paused; }, // dừng (không bật lại nếu đã dừng) — dùng khi bấm vào nút/phần tử tương tác
    userPaused: () => paused,
    hold: (reason) => holds.hold(reason),
    release: (reason) => holds.release(reason),
    holds: () => holds.reasons(),
    isRunning: () => enabled && !paused && !holds.active(),
  };
}
