import { createAutoScrollState } from "./lib/autoscroll-state.js";

// Bấm vào các phần tử này không tính là "bấm vùng trống" (không đổi trạng thái tự cuộn).
const INTERACTIVE = "a,button,input,textarea,select,label,summary,dialog,iframe,[data-no-toggle],.menu,.menu-toggle,.lightbox,.gallery,.slider,.gift-modal,.rsvp,.gb-form,.venue__map,.gb-list";

export function initAutoScroll(C) {
  const state = createAutoScrollState();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const indicator = document.createElement("div");
  indicator.className = "as-indicator"; indicator.setAttribute("aria-hidden", "true"); document.body.append(indicator);

  let raf = 0, last = 0, pos = 0, lastSet = 0, started = false, flash;
  const maxY = () => document.documentElement.scrollHeight - innerHeight;
  const SPEED = 60; // px/giây, cố định: tính theo thời gian thực nên đều trên mọi màn hình (60/90/120Hz)
  let t0 = 0, base = 0, atBottom = false;

  const frame = (t) => {
    raf = 0;
    if (!state.isRunning()) { last = 0; return; }
    if (!last) { last = t; t0 = t; base = Math.round(scrollY); pos = base; lastSet = pos; }
    last = t;
    if (Math.abs(scrollY - lastSet) > 2) { base = Math.round(scrollY); t0 = t; pos = base; lastSet = pos; } // người dùng vừa cuộn tay: bám theo vị trí mới
    const target = Math.min(maxY(), base + Math.round((SPEED * (t - t0)) / 1000));
    if (target !== pos) { pos = target; lastSet = pos; scrollTo(0, pos); }
    if (pos >= maxY() - 1) { atBottom = true; return; } // tới cuối trang: chỉ ngừng vòng lặp (không tắt hẳn), cuộn lên thì tự chạy lại — xem listener "scroll"
    raf = requestAnimationFrame(frame);
  };
  // Đang ở cuối trang mà người dùng cuộn lên (xa cuối trang hơn 40px) thì tự cuộn chạy lại từ vị trí mới (trừ khi họ đã chủ động dừng).
  addEventListener("scroll", () => { if (atBottom && started && maxY() - scrollY > 40) { atBottom = false; kick(); } }, { passive: true });
  const kick = () => { if (!raf && state.isRunning()) { last = 0; raf = requestAnimationFrame(frame); } };
  const show = (txt) => { indicator.textContent = txt; indicator.classList.add("is-on"); clearTimeout(flash); flash = setTimeout(() => indicator.classList.remove("is-on"), 1100); };

  // Bấm bất cứ đâu đều làm tự cuộn dừng:
  //  - bấm nút/ảnh/form/link...: chỉ DỪNG (đang dừng rồi thì giữ nguyên), để người dùng xem thoải mái
  //  - bấm vùng trống: dừng, bấm lần nữa thì chạy tiếp
  document.addEventListener("click", (e) => {
    if (!started) return;
    if (e.target.closest(".music")) return; // bật/tắt nhạc không liên quan tới việc đọc: không làm tự cuộn dừng
    if (e.target.closest(INTERACTIVE)) {
      if (!state.userPaused()) { state.pauseUser(); show("⏸"); }
      return;
    }
    if (window.getSelection()?.toString()) return;
    if (atBottom) return; // đang ở cuối trang: không có gì để dừng/chạy
    state.toggleUser(); show(state.userPaused() ? "⏸" : "▶"); kick();
  });
  // Khung cuộn riêng (danh sách lời chúc): cuộn chuột/chạm trong khung thì dừng tự cuộn trang để không trôi mất khung đang đọc
  const pauseOnScrollArea = (e) => { if (started && e.target.closest?.(".gb-list") && !state.userPaused()) { state.pauseUser(); show("⏸"); } };
  document.addEventListener("wheel", pauseOnScrollArea, { passive: true });
  document.addEventListener("touchstart", pauseOnScrollArea, { passive: true });
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
