import { nextIndex } from "./lib/slider.js";
import { createHolds } from "./lib/holds.js";

// Slide tự trượt: tạm dừng khi rê/chạm/tab ẩn/cửa sổ xem ảnh mở/slide ra khỏi màn hình; chỉ nạp ảnh gần vị trí hiện tại.
export function initSlider({ lightbox, config }) {
  const root = document.getElementById("slider"); if (!root) return;
  const track = document.getElementById("sliderTrack"), dots = [...root.querySelectorAll(".slider__dots button")];
  const slides = [...track.children], n = slides.length;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0, timer = 0, startX = 0; const holds = createHolds();
  const load = (k) => { const s = slides[nextIndex(0, n, k)], im = s.querySelector("img"); if (!im.getAttribute("src")) im.src = s.dataset.src; };
  const go = (k) => { i = nextIndex(0, n, k); track.style.transform = `translateX(${-i * 100}%)`; dots.forEach((d, j) => d.classList.toggle("is-on", j === i)); slides.forEach((s, j) => s.classList.toggle("is-current", j === i)); [i - 1, i, i + 1].forEach(load); };
  const stop = () => { clearInterval(timer); timer = 0; };
  const play = () => { if (reduce || n < 2 || holds.active() || timer) return; timer = setInterval(() => go(i + 1), config.album.intervalMs ?? 4500); };
  const hold = (r) => { holds.hold(r); stop(); }, release = (r) => { holds.release(r); play(); };
  go(0);
  root.querySelector(".slider__nav--prev")?.addEventListener("click", () => { go(i - 1); stop(); play(); });
  root.querySelector(".slider__nav--next")?.addEventListener("click", () => { go(i + 1); stop(); play(); });
  dots.forEach((d) => d.addEventListener("click", () => { go(Number(d.dataset.to)); stop(); play(); }));
  slides.forEach((s) => s.addEventListener("click", () => lightbox.open(config.album.photos, Number(s.dataset.index))));
  root.addEventListener("mouseenter", () => hold("hover")); root.addEventListener("mouseleave", () => release("hover"));
  root.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; hold("touch"); }, { passive: true });
  root.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); release("touch"); }, { passive: true });
  document.addEventListener("visibilitychange", () => (document.hidden ? hold("hidden") : release("hidden")));
  document.addEventListener("modal:open", () => hold("modal")); document.addEventListener("modal:close", () => release("modal"));
  holds.hold("offscreen");
  new IntersectionObserver(([e]) => (e.isIntersecting ? release("offscreen") : hold("offscreen")), { threshold: 0.2 }).observe(root);
}
