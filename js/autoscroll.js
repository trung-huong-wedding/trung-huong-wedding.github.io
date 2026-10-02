import { createAutoScrollState } from "./lib/autoscroll-state.js";

// Bấm vào các phần tử này không tính là "bấm vùng trống" (không đổi trạng thái tự cuộn).
const INTERACTIVE = "a,button,input,textarea,select,label,summary,dialog,iframe,[data-no-toggle],.menu,.menu-toggle,.lightbox,.gallery,.slider,.gift-modal,.rsvp,.gb-form,.venue__map";

export function initAutoScroll(C) {
  const state = createAutoScrollState();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const indicator = document.createElement("div");
  indicator.className = "as-indicator"; indicator.setAttribute("aria-hidden", "true"); document.body.append(indicator);

  let raf = 0, last = 0, pos = 0, lastSet = 0, started = false, flash;
  const speed = () => C.autoScroll.pxPerSecond;
  const maxY = () => document.documentElement.scrollHeight - innerHeight;

  const frame = (t) => {
    raf = 0;
    if (!state.isRunning()) { last = 0; return; }
    if (!last) { last = t; pos = scrollY; lastSet = pos; }
    const dt = Math.min(0.1, (t - last) / 1000); last = t;
    if (Math.abs(scrollY - lastSet) > 2) pos = scrollY; // người dùng vừa cuộn tay: bám theo vị trí mới
    pos = Math.min(maxY(), pos + speed() * dt);
    lastSet = pos; scrollTo(0, pos);
    if (pos >= maxY() - 1) { state.setEnabled(false); return; } // tới cuối trang thì dừng hẳn
    raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf && state.isRunning()) { last = 0; raf = requestAnimationFrame(frame); } };
  const show = (txt) => { indicator.textContent = txt; indicator.classList.add("is-on"); clearTimeout(flash); flash = setTimeout(() => indicator.classList.remove("is-on"), 1100); };

  // Bấm bất cứ đâu đều làm tự cuộn dừng:
  //  - bấm nút/ảnh/form/link...: chỉ DỪNG (đang dừng rồi thì giữ nguyên), để người dùng xem thoải mái
  //  - bấm vùng trống: dừng, bấm lần nữa thì chạy tiếp
  document.addEventListener("click", (e) => {
    if (!started) return;
    if (e.target.closest(INTERACTIVE)) {
      if (!state.userPaused()) { state.pauseUser(); show("⏸"); }
      return;
    }
    if (window.getSelection()?.toString()) return;
    if (!state.isRunning() && !state.userPaused() && state.holds().length === 0) return; // đã tới cuối trang
    state.toggleUser(); show(state.userPaused() ? "⏸" : "▶"); kick();
  });
  document.addEventListener("focusin", (e) => { if (e.target.matches("input,textarea")) state.hold("typing"); });
  document.addEventListener("focusout", (e) => { if (e.target.matches("input,textarea")) { state.release("typing"); kick(); } });
  document.addEventListener("visibilitychange", () => { document.hidden ? state.hold("hidden") : (state.release("hidden"), kick()); });
  document.addEventListener("modal:open", () => state.hold("modal"));
  document.addEventListener("modal:close", () => { state.release("modal"); kick(); });
  document.addEventListener("nav:start", () => state.hold("nav"));
  document.addEventListener("nav:end", () => { state.release("nav"); kick(); });

  return {
    start() { if (reduce) return; started = true; state.setEnabled(true); kick(); },
    hold: (r) => state.hold(r), release: (r) => { state.release(r); kick(); },
  };
}
