import { CONFIG } from "./config.js";
import { renderAll } from "./render.js";

document.title = CONFIG.title;
renderAll(CONFIG);
