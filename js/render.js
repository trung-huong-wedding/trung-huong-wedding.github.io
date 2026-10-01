import { sanitizeGuestName } from "./lib/text.js";

export function setText(el, text) { if (el) el.textContent = text ?? ""; }

// Tạo phần tử DOM an toàn: chuỗi luôn đi qua text node (không bao giờ là HTML).
export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "dataset") Object.assign(el.dataset, v);
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
}

export function sectionHead(heading) {
  return [
    h("p", { class: "orn reveal" }, "❦"),
    h("h2", { class: "sec__title script reveal", style: "--d:.15s" }, heading),
    h("span", { class: "rule reveal", style: "--d:.3s" }),
  ];
}

export const renderers = []; // mỗi tính năng đăng ký: renderers.push((CONFIG) => {...})
export function renderAll(CONFIG) { renderers.forEach((fn) => fn(CONFIG)); }

// ---- Hero ----
renderers.push((C) => {
  document.getElementById("heroBg").style.backgroundImage = `url("${C.hero.photo}")`;
  setText(document.getElementById("heroLead"), C.hero.lead);
  setText(document.getElementById("heroGroom"), C.couple.groom.name);
  setText(document.getElementById("heroBride"), C.couple.bride.name);
  const d = C.dateLabel;
  document.getElementById("heroDate").replaceChildren(
    h("span", { class: "eyebrow" }, d.weekday),
    h("span", { class: "hero__num" }, d.day, h("i", {}, "·"), d.month, h("i", {}, "·"), d.year),
  );
  const guest = sanitizeGuestName(new URLSearchParams(location.search).get(C.guestParam));
  const g = document.getElementById("heroGuest");
  if (guest) { g.hidden = false; g.replaceChildren(document.createTextNode("Thân mời "), h("strong", {}, guest)); }
});
