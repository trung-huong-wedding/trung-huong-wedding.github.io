import { monthGrid } from "./lib/date.js";

export function initCalendar(C) {
  const el = document.getElementById("cal"); if (!el) return;
  // Ngày theo múi giờ +07 để hiển thị đúng ở mọi máy
  const vn = new Date(new Date(C.ceremony.startIso).getTime() + 7 * 3600000);
  if (Number.isNaN(vn.getTime())) { el.hidden = true; return; }
  const y = vn.getUTCFullYear(), m = vn.getUTCMonth() + 1, day = vn.getUTCDate();
  const head = document.createElement("div"); head.className = "cal__head"; head.textContent = `Tháng ${m} · ${y}`;
  const grid = document.createElement("div"); grid.className = "cal__grid";
  ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].forEach((w) => { const s = document.createElement("span"); s.className = "cal__w"; s.textContent = w; grid.append(s); });
  monthGrid(y, m).flat().forEach((n) => {
    const s = document.createElement("span"); s.className = "cal__d" + (n === day ? " is-day" : "");
    s.textContent = n ?? ""; grid.append(s);
  });
  el.replaceChildren(head, grid);
}
