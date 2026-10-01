import { CONFIG } from "./config.js";
import { applyTheme } from "./theme.js";
import { renderAll } from "./render.js";
import { initHero } from "./hero.js";
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

// 1. Màu + nội dung từ config
applyTheme(CONFIG.theme);
document.title = CONFIG.title;
renderAll(CONFIG);

// 2. Các tính năng (phải chạy sau renderAll vì cần DOM đã dựng)
initCountdown(CONFIG.weddingDate);
initCalendar(CONFIG);
const lightbox = createLightbox({ onOpen: () => emit("modal:open"), onClose: () => emit("modal:close") });
initSlider({ lightbox, config: CONFIG });
initGallery({ lightbox, config: CONFIG });
initTimeline();
initRsvp();
initGift();
initGuestbook(CONFIG);
initReveal();

const menu = initMenu(CONFIG, { onNavStart: () => emit("nav:start"), onNavEnd: () => emit("nav:end") });
const music = initMusic(CONFIG);
const auto = initAutoScroll(CONFIG);

// 3. Mở thiệp: hiện menu, bật nhạc, rồi tự cuộn sau khi hero "thở" xong
initHero({ onOpen: () => emit("invitation:open") });
document.addEventListener("invitation:open", () => {
  menu.show(); music.show?.(); music.play();
  setTimeout(() => auto.start(), 1200);
});
