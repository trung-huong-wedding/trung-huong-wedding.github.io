import { CONFIG } from "./config.js";
import { applyTheme } from "./theme.js";
import { renderAll } from "./render.js";

applyTheme(CONFIG.theme);
document.title = CONFIG.title;
renderAll(CONFIG);
