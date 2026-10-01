import { CONFIG } from "./config.js";
import { applyTheme } from "./theme.js";
import { renderAll } from "./render.js";

applyTheme(CONFIG.theme);
document.title = CONFIG.title;
renderAll(CONFIG);

import { initHero } from "./hero.js";
initHero({ onOpen: () => document.dispatchEvent(new CustomEvent("invitation:open")) });
