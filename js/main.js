import { CONFIG } from "./config.js";
import { applyTheme } from "./theme.js";
import { renderAll } from "./render.js";
import { initHero } from "./hero.js";
import { initCouple } from "./couple.js";
import { initReveal } from "./reveal.js";
import { initCountdown } from "./countdown.js";
import { initCalendar } from "./calendar.js";
import { createLightbox } from "./lightbox.js";
import { initSlider } from "./slider.js";
import { initGallery } from "./gallery.js";
import { initTimeline } from "./timeline.js";
import { initRsvp } from "./rsvp.js";
import { initGift } from "./gift.js";
import { initGuestbook } from "./guestbook.js";
import { initMenu } from "./menu.js";
import { initMusic } from "./music.js";
import { initAutoScroll } from "./autoscroll.js";

const emit = (name) => document.dispatchEvent(new CustomEvent(name));
// Mỗi tính năng khởi tạo độc lập: một khối lỗi (ví dụ config sai) không làm hỏng các khối khác, kể cả nút "Mở thiệp".
const guard = (name, fn, fallback) => { try { return fn(); } catch (e) { console.error(`[${name}] lỗi khởi tạo — kiểm tra js/config.js:`, e); return fallback; } };

// 0. Luôn bắt đầu từ màn bìa (tải lại giữa trang không được kẹt ở giữa khi cuộn đang bị khoá)
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
scrollTo(0, 0);

// 1. Màu + nội dung từ config
guard("theme", () => applyTheme(CONFIG.theme));
document.title = CONFIG.title ?? document.title;
renderAll(CONFIG);

// 2. Các tính năng (phải chạy sau renderAll vì cần DOM đã dựng)
const noopLightbox = { open() {}, isOpen: () => false };
guard("countdown", () => initCountdown(CONFIG.weddingDate));
guard("calendar", () => initCalendar(CONFIG));
const lightbox = guard("lightbox", () => createLightbox({ onOpen: () => emit("modal:open"), onClose: () => emit("modal:close") }), noopLightbox);
guard("slider", () => initSlider({ lightbox, config: CONFIG }));
guard("gallery", () => initGallery({ lightbox, config: CONFIG }));
guard("timeline", () => initTimeline());
guard("couple", () => initCouple());
guard("rsvp", () => initRsvp());
guard("gift", () => initGift());
guard("guestbook", () => initGuestbook(CONFIG));
guard("reveal", () => initReveal());

const menu = guard("menu", () => initMenu(CONFIG, { onNavStart: () => emit("nav:start"), onNavEnd: () => emit("nav:end") }), { show() {} });
const music = guard("music", () => initMusic(CONFIG), { play() {}, show() {} });
const auto = guard("autoscroll", () => initAutoScroll(CONFIG), { start() {} });

// 3. Mở thiệp: hiện menu, bật nhạc, rồi tự cuộn sau khi hero "thở" xong
guard("hero", () => initHero({ onOpen: () => emit("invitation:open") }));
document.addEventListener("invitation:open", () => {
  menu.show(); music.show?.(); music.play();
  setTimeout(() => auto.start(), 1200);
});
