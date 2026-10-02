import { sanitizeGuestName } from "./lib/text.js";
import { runSafely } from "./lib/safe.js";

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

// Popup/overlay phải nằm trực tiếp trong <body>, nếu không sẽ bị kẹt dưới các section phía sau (stacking context).
export function mountOverlay(el) { document.getElementById(el.id)?.remove(); document.body.append(el); return el; }

export const renderers = []; // mỗi tính năng đăng ký: renderers.push((CONFIG) => {...})
// Mỗi khối render độc lập: config sai ở một khối chỉ làm khối đó trống, không làm hỏng cả trang (kể cả nút "Mở thiệp").
export function renderAll(CONFIG) {
  runSafely(renderers.map((fn) => () => fn(CONFIG)), (e, i) => console.error(`[render] khối #${i} lỗi — kiểm tra js/config.js:`, e));
}

// ---- Hero ----
renderers.push((C) => {
  const photo = `url("${C.hero.photo}")`;
  document.getElementById("heroBg").style.backgroundImage = photo;
  const pb = document.getElementById("pageBgImg"); if (pb) pb.style.backgroundImage = photo;
  setText(document.getElementById("heroLead"), C.hero.lead);
  setText(document.getElementById("heroGroom"), C.couple.groom.name);
  setText(document.getElementById("heroBride"), C.couple.bride.name);
  const d = C.dateLabel;
  setText(document.getElementById("heroDate"), `${d.weekday}, ${d.day} tháng ${d.month}, ${d.year}`);
  const guest = sanitizeGuestName(new URLSearchParams(location.search).get(C.guestParam));
  const g = document.getElementById("heroGuest");
  if (guest) { g.hidden = false; g.replaceChildren(document.createTextNode("Thân mời "), h("strong", {}, guest)); }
});

// ---- Lời mời, cô dâu chú rể, đếm ngược, thông tin lễ cưới ----
renderers.push((C) => {
  document.getElementById("invitation").replaceChildren(
    h("p", { class: "orn reveal" }, "❦"),
    h("h2", { class: "sec__title script reveal", style: "--d:.15s" }, C.invitation.heading),
    h("p", { class: "quote reveal", style: "--d:.3s" }, (C.invitation.lines ?? []).map((l, i) => [i ? h("br") : null, l])),
    h("p", { class: "lead reveal", style: "--d:.45s" }, C.invitation.body),
  );

  // Thông tin chi tiết (bố mẹ, giới thiệu) — chỉ chữ; ảnh nằm ở khối đầu trang
  const person = (p, d) => h("article", { class: "person reveal", style: `--d:${d}s` },
    h("p", { class: "eyebrow" }, p.role),
    h("h3", { class: "script person__name" }, p.fullName),
    h("p", { class: "person__parents" }, (p.parents ?? []).map((x, i) => [i ? h("br") : null, x])),
    h("p", { class: "person__bio" }, p.bio),
  );
  document.getElementById("couple").replaceChildren(
    h("div", { class: "couple-grid" }, person(C.couple.groom, 0), h("span", { class: "couple-heart reveal", "aria-hidden": "true" }, "♥"), person(C.couple.bride, .25)),
  );

  // Khối đầu trang nội dung: hai ảnh nghiêng + tên (không lặp lại thẻ thiệp ở màn mở đầu)
  const cp = (p, cls) => h("div", { class: `cp ${cls}` },
    h("div", { class: "cp__photo" }, h("div", { class: "cp__frame" }, h("img", { src: p.photo, alt: p.fullName, decoding: "async" }))),
    h("div", { class: "cp__text" }, h("div", { class: "cp__role" }, p.role), h("div", { class: "cp__name script" }, p.name)));
  const flower = (cls) => { const d = h("div", { class: `cpl__flower ${cls}`, "aria-hidden": "true" }); d.innerHTML = '<svg viewBox="0 0 600 600"><use href="#spray"/></svg>'; return d; };
  const bar = h("div", { class: "cpl__bar", "aria-hidden": "true" }); bar.innerHTML = '<svg viewBox="0 0 1000 150" preserveAspectRatio="xMidYMid slice"><use href="#bar"/></svg>';
  document.getElementById("thiep-cuoi").replaceChildren(
    flower("cpl__flower--a"), flower("cpl__flower--b"),
    h("div", { class: "cpl__stage" }, bar, cp(C.couple.groom, "cp--groom"), cp(C.couple.bride, "cp--bride")),
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
    h("ol", { class: "timeline reveal", style: "--d:.3s" }, (cer.timeline ?? []).map((t) => h("li", {}, h("b", {}, t.time), h("span", {}, t.title)))),
    h("button", { class: "btn-soft reveal", id: "icsBtn", type: "button", style: "--d:.4s" }, "Thêm vào lịch"),
  );
});

// ---- Câu chuyện tình yêu (cây thời gian) + Album (slide + xem tất cả) ----
renderers.push((C) => {
  const storyEl = document.getElementById("tinh-yeu"), chapters = C.story.chapters ?? [];
  storyEl.hidden = chapters.length === 0;
  if (chapters.length) storyEl.replaceChildren(
    ...sectionHead(C.story.heading),
    h("ol", { class: "tl", id: "tl" },
      h("span", { class: "tl__line", "aria-hidden": "true" }, h("span", { class: "tl__fill" })),
      ...chapters.map((c, i) => h("li", { class: `tl__item reveal${i % 2 ? " tl__item--alt" : ""}` },
        h("span", { class: "tl__dot", "aria-hidden": "true" }, "♥"),
        h("div", { class: "tl__card" },
          c.date ? h("p", { class: "script tl__date" }, c.date) : null,
          c.photo ? h("figure", { class: "tl__photo" }, h("img", { src: c.photo, alt: c.photoAlt || c.title || "", loading: "lazy", decoding: "async" })) : null,
          c.title ? h("h3", { class: "tl__title" }, c.title) : null,
          c.text ? h("p", { class: "tl__text" }, c.text) : null)))),
  );

  const A = C.album, photos = A.photos ?? [], albumEl = document.getElementById("album");
  albumEl.hidden = photos.length === 0;
  if (photos.length) {
    const slides = photos.slice(0, A.sliderCount ?? 10);
    albumEl.replaceChildren(
      ...sectionHead(A.heading),
      h("div", { class: "ring reveal", id: "slider", "aria-roledescription": "carousel", "aria-label": A.heading },
        h("div", { class: "ring__stage" },
          slides.length > 1 ? [h("button", { class: "ring__nav ring__nav--prev", type: "button", "aria-label": "Ảnh trước" }, "‹"), h("button", { class: "ring__nav ring__nav--next", type: "button", "aria-label": "Ảnh sau" }, "›")] : null,
          h("div", { class: "ring__scene", id: "ringScene" }, slides.map((p, i) =>
            h("button", { class: "ring__item", type: "button", dataset: { index: i, src: p.src }, "aria-label": `Ảnh ${i + 1}: ${p.alt || ""}` },
              h("img", { alt: p.alt || "", decoding: "async", draggable: "false" }))))),
        slides.length > 1 ? h("div", { class: "ring__dots", id: "sliderDots" }, slides.map((_, i) => h("button", { type: "button", "aria-label": `Tới ảnh ${i + 1}`, dataset: { to: i } }))) : null),
      h("button", { class: "btn-soft reveal", id: "viewAll", type: "button", style: "--d:.2s" }, A.viewAllLabel ?? "Xem tất cả"),
    );
    mountOverlay(h("div", { class: "gallery", id: "gallery", role: "dialog", "aria-modal": "true", "aria-label": A.heading },
        h("button", { class: "gallery__x", type: "button", "aria-label": "Đóng" }, "✕"),
        h("div", { class: "gallery__grid" }, photos.map((p, i) =>
          h("button", { class: "gallery__item", type: "button", dataset: { index: i }, "aria-label": `Xem ảnh ${i + 1}` }, h("img", { src: p.src, alt: p.alt || "", loading: "lazy", decoding: "async" }))))));
  }
});

// ---- Tiệc cưới + RSVP, Địa chỉ (nhiều địa điểm, mỗi nơi một bản đồ), Cảm ơn ----
renderers.push((C) => {
  const b = C.banquet;
  const field = (label, control) => h("label", { class: "field" }, h("span", {}, label), control);
  document.getElementById("tiec-cuoi").replaceChildren(
    ...sectionHead(b.heading),
    h("p", { class: "banquet__venue reveal" }, b.venueName),
    h("p", { class: "eyebrow reveal" }, b.time),
    h("p", { class: "lead reveal" }, b.note),
    b.dressCode ? h("p", { class: "banquet__dress reveal" }, "Trang phục: ", h("b", {}, b.dressCode)) : null,
    h("form", { class: "rsvp reveal", id: "rsvpForm", novalidate: true },
      h("h3", { class: "script" }, b.rsvp?.heading ?? "Xác Nhận Tham Dự"),
      field("Họ và tên", h("input", { name: "name", type: "text", maxlength: "60", autocomplete: "name", required: true })),
      field("Số người đi cùng", h("input", { name: "count", type: "number", min: "1", max: "10", value: "1" })),
      h("div", { class: "rsvp__choice", role: "radiogroup", "aria-label": "Tham dự" },
        h("label", {}, h("input", { type: "radio", name: "att", value: "yes", checked: true }), h("span", {}, "Sẽ tham dự")),
        h("label", {}, h("input", { type: "radio", name: "att", value: "no" }), h("span", {}, "Rất tiếc không đến được"))),
      field("Lời nhắn", h("textarea", { name: "note", rows: "3", maxlength: "200" })),
      h("button", { class: "btn-soft", type: "submit" }, "Gửi xác nhận"),
      h("p", { class: "rsvp__thanks", id: "rsvpThanks", hidden: true, role: "status" }, b.rsvp?.thanks ?? "Cảm ơn bạn!"),
    ),
    b.zalo ? h("a", { class: "btn-soft reveal", href: b.zalo, target: "_blank", rel: "noopener" }, "Nhắn Zalo xác nhận") : null,
  );

  const venues = C.venues.items ?? [], vEl = document.getElementById("dia-chi");
  vEl.hidden = venues.length === 0;
  if (venues.length) vEl.replaceChildren(
    ...sectionHead(C.venues.heading),
    h("div", { class: "venues" }, venues.map((v, i) =>
      h("article", { class: "venue reveal", style: `--d:${i * .2}s` },
        v.side ? h("p", { class: "eyebrow" }, v.side) : null,
        h("h3", { class: "script venue__name" }, v.name),
        h("p", { class: "venue__addr" }, v.address),
        v.time ? h("p", { class: "venue__time" }, v.time) : null,
        v.mapEmbed ? h("div", { class: "venue__map" }, h("iframe", { src: v.mapEmbed, loading: "lazy", referrerpolicy: "no-referrer-when-downgrade", title: `Bản đồ ${v.side || v.name}`, allowfullscreen: true })) : null,
        v.mapLink ? h("a", { class: "btn-soft", href: v.mapLink, target: "_blank", rel: "noopener" }, "Chỉ đường") : null))),
  );

  document.getElementById("thanks").replaceChildren(
    h("p", { class: "orn reveal" }, "❦"),
    h("p", { class: "quote reveal", style: "--d:.2s" }, C.thanks.text),
    h("p", { class: "script thanks__sign reveal", style: "--d:.4s" }, C.thanks.sign),
  );
});

// ---- Quà mừng: hộp quà vẽ bằng SVG (màu lấy từ biến theme) + popup QR ----
const GIFT_SVG = (w) => `<svg viewBox="0 0 120 120" width="${w}" aria-hidden="true">
  <rect x="14" y="52" width="92" height="60" rx="6" style="fill:var(--red)"/><rect x="54" y="52" width="12" height="60" style="fill:var(--gold)"/>
  <rect x="8" y="38" width="104" height="22" rx="6" style="fill:var(--pink)"/><rect x="54" y="38" width="12" height="22" style="fill:var(--gold)"/>
  <path d="M60 38 C 40 10, 14 22, 34 38 Z" style="fill:var(--pink-soft);stroke:var(--gold)" stroke-width="2"/><path d="M60 38 C 80 10, 106 22, 86 38 Z" style="fill:var(--pink-soft);stroke:var(--gold)" stroke-width="2"/>
  <circle cx="60" cy="38" r="6" style="fill:var(--gold)"/></svg>`;

renderers.push((C) => {
  const g = C.gift, people = g.people ?? [], el = document.getElementById("qua-mung");
  el.hidden = people.length === 0;
  if (!people.length) return;
  const mini = [{ l: "4%", t: "34%", r: "-22deg", w: 34 }, { l: "78%", t: "26%", r: "20deg", w: 38 }, { l: "8%", t: "62%", r: "-16deg", w: 26 }, { l: "82%", t: "60%", r: "14deg", w: 30 }];
  const confetti = ["--pink", "--gold", "--pink-soft", "--red", "--bg", "--wine"]; // màu theo theme
  const svgSpan = (cls, svg, extra = {}) => { const s = h("span", { class: cls, "aria-hidden": "true", ...extra }); s.innerHTML = svg; return s; };
  const box = h("button", { class: "gift", id: "giftBtn", type: "button", "aria-label": "Mở hộp quà mừng" },
    h("span", { class: "gift__star s1", "aria-hidden": "true" }, "✦"), h("span", { class: "gift__star s2", "aria-hidden": "true" }, "✦"), h("span", { class: "gift__star s3", "aria-hidden": "true" }, "✦"),
    h("span", { class: "gift__confetti", "aria-hidden": "true" }, confetti.map((c, i) => h("i", { style: `--c:var(${c});--a:${i * 60 - 150}deg;--dx:${(i - 2.5) * 26}px;--dl:${i * .05}s` }))),
    h("span", { class: "gift__bob" },
      ...mini.map((m, i) => svgSpan(`gift__mini m${i + 1}`, GIFT_SVG(m.w), { style: `left:${m.l};top:${m.t};--r:${m.r}` })),
      svgSpan("gift__main", GIFT_SVG(170)),
      h("span", { class: "gift__shadow", "aria-hidden": "true" })),
    h("span", { class: "gift__hint" }, g.hint));

  const card = (p) => h("div", { class: "qr" },
    h("h3", { class: "qr__role" }, p.role),
    h("div", { class: "qr__img" }, h("img", { src: p.qr, alt: `QR ${p.role}` })),
    h("p", { class: "qr__bank" }, p.bank), h("p", { class: "qr__acc" }, p.account), h("p", { class: "qr__name" }, p.name),
    h("div", { class: "qr__btns" },
      h("button", { class: "btn-soft", type: "button", dataset: { copy: p.account } }, "Sao chép STK"),
      h("a", { class: "btn-soft", href: p.qr, download: `qr-${p.role.toLowerCase().replace(/\s+/g, "-")}` }, "Lưu QR")));

  el.replaceChildren(
    ...sectionHead(g.heading),
    h("div", { class: "reveal", style: "--d:.2s" }, box),
  );
  mountOverlay(h("div", { class: "gift-modal", id: "giftModal", role: "dialog", "aria-modal": "true", "aria-label": g.heading },
      h("div", { class: "gift-modal__card" },
        h("button", { class: "gift-modal__x", type: "button", "aria-label": "Đóng" }, "✕"),
        h("p", { class: "script gift-modal__title" }, "Hộp quà yêu thương"),
        h("div", { class: "gift-modal__grid" }, people.map(card)))));
});

// ---- Sổ lưu bút ----
renderers.push((C) => {
  const g = C.guestbook;
  document.getElementById("so-luu-but").replaceChildren(
    ...sectionHead(g.heading),
    h("form", { class: "gb-form reveal", id: "gbForm", novalidate: true },
      h("label", { class: "field" }, h("span", {}, "Tên của bạn"), h("input", { name: "name", maxlength: String(g.maxName), autocomplete: "name" })),
      h("label", { class: "field" }, h("span", {}, "Lời chúc"), h("textarea", { name: "message", rows: "4", maxlength: String(g.maxMessage) })),
      h("p", { class: "gb-count", id: "gbCount" }, `0/${g.maxMessage}`),
      h("p", { class: "gb-msg", id: "gbMsg", role: "status" }),
      h("button", { class: "btn-soft", type: "submit", id: "gbSubmit" }, "Gửi lời chúc")),
    h("ul", { class: "gb-list", id: "gbList" }),
    h("button", { class: "btn-soft", type: "button", id: "gbMore", hidden: true }, "Xem thêm"),
  );
});
