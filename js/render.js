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
