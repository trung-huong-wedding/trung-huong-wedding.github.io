import { createAutoScrollState } from "./lib/autoscroll-state.js";
import { pickStep, medianFrameMs } from "./lib/scrollstep.js";

// Bấm vào các phần tử này không tính là "bấm vùng trống" (không đổi trạng thái tự cuộn).
const INTERACTIVE = "a,button,input,textarea,select,label,summary,dialog,iframe,[data-no-toggle],.menu,.menu-toggle,.lightbox,.gallery,.slider,.gift-modal,.rsvp,.gb-form,.venue__map,.gb-list";

export function initAutoScroll(C) {
  const state = createAutoScrollState();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const indicator = document.createElement("div");
  indicator.className = "as-indicator"; indicator.setAttribute("aria-hidden", "true"); document.body.append(indicator);

  let raf = 0, last = 0, pos = 0, lastSet = 0, started = false, flash;
  let step = pickStep(C.autoScroll.pxPerSecond, 60), frameMs = 1000 / 60, owed = 0;
  const maxY = () => document.documentElement.scrollHeight - innerHeight;

  // Đo tốc độ làm tươi màn hình (60/90/120Hz) một lần rồi chọn bước cuộn đều (xem lib/scrollstep.js) — hết nhích 1px/2px xen kẽ gây giật.
  const calibrate = () => new Promise((res) => {
    const dts = []; let prev = 0;
    const f = (t) => { if (prev) dts.push(t - prev); prev = t; if (dts.length < 24) requestAnimationFrame(f); else res(medianFrameMs(dts.slice(4))); };
    requestAnimationFrame(f);
  });

  const frame = (t) => {
    raf = 0;
    if (!state.isRunning()) { last = 0; return; }
    if (!last) { last = t; pos = Math.round(scrollY); lastSet = pos; owed = 0; }
    const frames = Math.max(1, Math.min(6, Math.round((t - last) / frameMs))); last = t; // khung bị rớt: bù đúng số khung đã trôi qua
    if (Math.abs(scrollY - lastSet) > 2) { pos = Math.round(scrollY); owed = 0; } // người dùng vừa cuộn tay: bám theo vị trí mới
    owed += frames;
    let moved = 0; while (owed >= step.every) { owed -= step.every; moved += step.px; }
    if (moved) { pos = Math.min(maxY(), pos + moved); lastSet = pos; scrollTo(0, pos); }
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
    if (e.target.closest(".music")) return; // bật/tắt nhạc không liên quan tới việc đọc: không làm tự cuộn dừng
    if (e.target.closest(INTERACTIVE)) {
      if (!state.userPaused()) { state.pauseUser(); show("⏸"); }
      return;
    }
    if (window.getSelection()?.toString()) return;
    if (!state.isRunning() && !state.userPaused() && state.holds().length === 0) return; // đã tới cuối trang
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
    async start() {
      if (reduce) return; started = true;
      frameMs = await calibrate(); step = pickStep(C.autoScroll.pxPerSecond, 1000 / frameMs);
      state.setEnabled(true); kick();
    },
    hold: (r) => state.hold(r), release: (r) => { state.release(r); kick(); },
  };
}
