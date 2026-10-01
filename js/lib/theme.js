const MAP = { bg: "--bg", pinkSoft: "--pink-soft", pink: "--pink", red: "--red", wine: "--wine", gold: "--gold", ink: "--ink", inkSoft: "--ink-soft" };

// Chuyển CONFIG.theme thành { "--biến-css": "giá trị" }, bỏ khoá lạ và giá trị có thể phá CSS.
export function themeToCssVars(theme) {
  const out = {};
  for (const [k, v] of Object.entries(theme ?? {})) {
    if (MAP[k] && typeof v === "string" && v.trim() && !/[;{}]/.test(v)) out[MAP[k]] = v.trim();
  }
  return out;
}
