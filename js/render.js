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
      h("div", { class: "slider reveal", id: "slider", "aria-roledescription": "carousel", "aria-label": A.heading },
        h("div", { class: "slider__stage" },
          h("div", { class: "slider__track", id: "sliderTrack" }, slides.map((p, i) =>
            h("button", { class: "slide", type: "button", dataset: { index: i, src: p.src }, "aria-label": `Phóng to ảnh ${i + 1}: ${p.alt || ""}` },
              h("img", { alt: p.alt || "", decoding: "async", ...(i === 0 ? { src: p.src } : {}) })))),
          slides.length > 1 ? [h("button", { class: "slider__nav slider__nav--prev", type: "button", "aria-label": "Ảnh trước" }, "‹"), h("button", { class: "slider__nav slider__nav--next", type: "button", "aria-label": "Ảnh sau" }, "›")] : null),
        slides.length > 1 ? h("div", { class: "slider__dots", id: "sliderDots" }, slides.map((_, i) => h("button", { type: "button", "aria-label": `Tới ảnh ${i + 1}`, dataset: { to: i } }))) : null),
      h("button", { class: "btn-soft reveal", id: "viewAll", type: "button", style: "--d:.2s" }, A.viewAllLabel ?? "Xem tất cả"),
      h("div", { class: "gallery", id: "gallery", role: "dialog", "aria-modal": "true", "aria-label": A.heading },
        h("button", { class: "gallery__x", type: "button", "aria-label": "Đóng" }, "✕"),
        h("div", { class: "gallery__grid" }, photos.map((p, i) =>
          h("button", { class: "gallery__item", type: "button", dataset: { index: i }, "aria-label": `Xem ảnh ${i + 1}` }, h("img", { src: p.src, alt: p.alt || "", loading: "lazy", decoding: "async" }))))),
    );
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
      h("h3", { class: "script" }, b.rsvp.heading),
      field("Họ và tên", h("input", { name: "name", type: "text", maxlength: "60", autocomplete: "name", required: true })),
      field("Số người đi cùng", h("input", { name: "count", type: "number", min: "1", max: "10", value: "1" })),
      h("div", { class: "rsvp__choice", role: "radiogroup", "aria-label": "Tham dự" },
        h("label", {}, h("input", { type: "radio", name: "att", value: "yes", checked: true }), h("span", {}, "Sẽ tham dự")),
        h("label", {}, h("input", { type: "radio", name: "att", value: "no" }), h("span", {}, "Rất tiếc không đến được"))),
      field("Lời nhắn", h("textarea", { name: "note", rows: "3", maxlength: "200" })),
      h("button", { class: "btn-soft", type: "submit" }, "Gửi xác nhận"),
      h("p", { class: "rsvp__thanks", id: "rsvpThanks", hidden: true, role: "status" }, b.rsvp.thanks),
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
