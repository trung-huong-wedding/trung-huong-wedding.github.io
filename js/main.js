import { CONFIG } from "./config.js";
import { applyTheme } from "./theme.js";
import { renderAll } from "./render.js";

applyTheme(CONFIG.theme);
document.title = CONFIG.title;
renderAll(CONFIG);

import { initHero } from "./hero.js";
initHero({ onOpen: () => document.dispatchEvent(new CustomEvent("invitation:open")) });

import { initReveal } from "./reveal.js";
import { initCountdown } from "./countdown.js";
import { initCalendar } from "./calendar.js";
initCountdown(CONFIG.weddingDate);
initCalendar(CONFIG);
initReveal();

import { createLightbox } from "./lightbox.js";
import { initSlider } from "./slider.js";
import { initGallery } from "./gallery.js";
import { initTimeline } from "./timeline.js";
const lightbox = createLightbox({
  onOpen: () => document.dispatchEvent(new CustomEvent("modal:open")),
  onClose: () => document.dispatchEvent(new CustomEvent("modal:close")),
});
initSlider({ lightbox, config: CONFIG });
initGallery({ lightbox, config: CONFIG });
initTimeline();

import { initRsvp } from "./rsvp.js";
initRsvp();

import { initMenu } from "./menu.js";
import { initMusic } from "./music.js";
const menu = initMenu(CONFIG, {
  onNavStart: () => document.dispatchEvent(new CustomEvent("nav:start")),
  onNavEnd: () => document.dispatchEvent(new CustomEvent("nav:end")),
});
const music = initMusic(CONFIG);
document.addEventListener("invitation:open", () => { menu.show(); music.show?.(); music.play(); });

import { initAutoScroll } from "./autoscroll.js";
const auto = initAutoScroll(CONFIG);
document.addEventListener("invitation:open", () => setTimeout(() => auto.start(), 1200)); // chờ hero "thở" xong rồi mới cuộn
