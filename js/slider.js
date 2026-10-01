import { nextIndex } from "./lib/slider.js";
import { ringStyle } from "./lib/ring.js";
import { createHolds } from "./lib/holds.js";

// Slide dạng vòng 3D: ảnh chính ở giữa, các ảnh khác xếp hai bên như một vòng quay.
// Tự quay; tạm dừng khi rê/chạm/tab ẩn/popup mở/slide ra khỏi màn hình. Ảnh luôn giữ tỉ lệ gốc (không cắt).
export function initSlider({ lightbox, config }) {
  const root = document.getElementById("slider"); if (!root) return;
  const scene = document.getElementById("ringScene"), dots = [...root.querySelectorAll(".ring__dots button")];
  const items = [...scene.children], n = items.length;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0, timer = 0, start = null, onscreen = false; const holds = createHolds();

  const loadImg = (el) => {
    const im = el.querySelector("img");
    if (!im.getAttribute("src")) {
      im.addEventListener("load", () => { if (im.naturalWidth) el.style.aspectRatio = `${im.naturalWidth} / ${im.naturalHeight}`; syncWidth(); }, { once: true });
      im.src = el.dataset.src;
    }
  };
  // --cw = bề rộng ảnh đang ở giữa; các ảnh bên cạnh dịch ra theo đúng bề rộng đó dù khác tỉ lệ
  const syncWidth = () => scene.style.setProperty("--cw", `${items[i].offsetWidth}px`);
  const render = () => {
    items.forEach((el, k) => {
      const s = ringStyle(k, i, n);
      el.style.transform = s.transform; el.style.opacity = s.opacity; el.style.zIndex = s.zIndex;
      el.classList.toggle("is-current", s.d === 0);
      el.style.pointerEvents = s.visible ? "auto" : "none";
      el.tabIndex = s.d === 0 ? 0 : -1;
      el.setAttribute("aria-hidden", String(!s.visible));
      if (Math.abs(s.d) <= 3) loadImg(el);
    });
    dots.forEach((d, j) => d.classList.toggle("is-on", j === i));
    syncWidth();
  };
  const go = (k) => { i = nextIndex(0, n, k); render(); };
  const stop = () => { clearInterval(timer); timer = 0; };
  const play = () => { if (reduce || n < 2 || !onscreen || holds.active() || timer) return; timer = setInterval(() => go(i + 1), config.album.intervalMs ?? 4500); };
  const hold = (r) => { holds.hold(r); stop(); }, release = (r) => { holds.release(r); play(); };
  const manual = (k) => { go(k); stop(); play(); };
  render();
  addEventListener("resize", syncWidth);

  root.querySelector(".ring__nav--prev")?.addEventListener("click", () => manual(i - 1));
  root.querySelector(".ring__nav--next")?.addEventListener("click", () => manual(i + 1));
  dots.forEach((d) => d.addEventListener("click", () => manual(Number(d.dataset.to))));
  items.forEach((el, k) => el.addEventListener("click", () => (k === i ? lightbox.open(config.album.photos, k) : manual(k))));
  // chỉ chuột mới "rê": trên cảm ứng, chạm sinh sự kiện chuột giả không có mouseleave nên sẽ kẹt trạng thái dừng
  root.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hold("hover"); });
  root.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") release("hover"); });
  root.addEventListener("touchstart", (e) => { start = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }; hold("touch"); }, { passive: true });
  root.addEventListener("touchend", (e) => {
    if (start) { const dx = e.changedTouches[0].clientX - start.x, dy = e.changedTouches[0].clientY - start.y; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1)); }
    start = null; release("touch");
  }, { passive: true });
  root.addEventListener("touchcancel", () => { start = null; release("touch"); }, { passive: true });
  document.addEventListener("visibilitychange", () => (document.hidden ? hold("hidden") : release("hidden")));
  document.addEventListener("modal:open", () => hold("modal")); document.addEventListener("modal:close", () => release("modal"));
  new IntersectionObserver(([e]) => { onscreen = e.isIntersecting; if (onscreen) play(); else stop(); }, { threshold: 0.2 }).observe(root);
}
