import { themeToCssVars } from "./lib/theme.js";

// Áp bảng màu từ CONFIG.theme lên :root (tokens.css chỉ giữ giá trị dự phòng).
export function applyTheme(theme) {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(themeToCssVars(theme))) root.style.setProperty(k, v);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && theme?.bg) meta.setAttribute("content", theme.bg);
}
