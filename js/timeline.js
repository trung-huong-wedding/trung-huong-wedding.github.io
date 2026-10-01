import { timelineProgress } from "./lib/timeline.js";

// Đường cây thời gian tô dần theo vị trí cuộn.
export function initTimeline() {
  const tl = document.getElementById("tl"); if (!tl) return;
  let ticking = false;
  const update = () => { ticking = false; const r = tl.getBoundingClientRect(); tl.style.setProperty("--p", timelineProgress(r.top, r.height, innerHeight).toFixed(4)); };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); update();
}
