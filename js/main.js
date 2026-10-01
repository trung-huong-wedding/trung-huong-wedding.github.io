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
