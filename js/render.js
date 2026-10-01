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

// ---- Lời mời, cô dâu chú rể, đếm ngược, thông tin lễ cưới ----
renderers.push((C) => {
  document.getElementById("invitation").replaceChildren(
    h("p", { class: "orn reveal" }, "❦"),
    h("h2", { class: "sec__title script reveal", style: "--d:.15s" }, C.invitation.heading),
    h("p", { class: "quote reveal", style: "--d:.3s" }, C.invitation.lines.map((l, i) => [i ? h("br") : null, l])),
    h("p", { class: "lead reveal", style: "--d:.45s" }, C.invitation.body),
  );

  const person = (p, d) => h("article", { class: "person reveal", style: `--d:${d}s` },
    h("div", { class: "arch" }, h("img", { src: p.photo, alt: p.fullName, loading: "lazy", decoding: "async" })),
    h("p", { class: "eyebrow" }, p.role),
    h("h3", { class: "script person__name" }, p.fullName),
    h("p", { class: "person__parents" }, p.parents.map((x, i) => [i ? h("br") : null, x])),
    h("p", { class: "person__bio" }, p.bio),
  );
  document.getElementById("couple").replaceChildren(
    h("div", { class: "couple-grid" }, person(C.couple.groom, 0), h("span", { class: "couple-heart reveal", "aria-hidden": "true" }, "♥"), person(C.couple.bride, .25)),
  );

  document.getElementById("countdown").replaceChildren(
    h("p", { class: "eyebrow reveal" }, "Đếm ngược đến ngày cưới"),
    h("div", { class: "cd reveal", id: "cd", style: "--d:.2s" },
      ...["Ngày", "Giờ", "Phút", "Giây"].map((l, i) => h("div", { class: "cd__cell" }, h("b", { id: `cd${i}` }, "--"), h("span", {}, l)))),
    h("p", { class: "cd__done", id: "cdDone", hidden: true }, "Hôm nay là ngày vui của chúng mình ♥"),
  );

  const cer = C.ceremony;
  document.getElementById("le-cuoi").replaceChildren(
    ...sectionHead(cer.heading),
    h("p", { class: "eyebrow reveal" }, cer.title),
    h("div", { class: "cal reveal", id: "cal", style: "--d:.2s" }),
    h("ol", { class: "timeline reveal", style: "--d:.3s" }, cer.timeline.map((t) => h("li", {}, h("b", {}, t.time), h("span", {}, t.title)))),
    h("button", { class: "btn-soft reveal", id: "icsBtn", type: "button", style: "--d:.4s" }, "Thêm vào lịch"),
  );
});
