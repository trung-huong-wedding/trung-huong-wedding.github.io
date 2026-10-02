// Rải hoa lá xen kẽ hai bên trang nội dung, từ dưới khối đầu trang đến gần cuối trang.
// Vị trí tính theo chiều dài trang thật (nội dung dài/ngắn đều khớp) và tính lại khi trang đổi kích thước.
const PATTERN = [ // theo mẫu: phải-hoa, trái-lá (lật cả hai chiều), phải-lá, trái-hoa (lật dọc), ...
  { key: "flower", side: "right", flipX: false, flipY: false, shift: 0 },
  { key: "leaf", side: "left", flipX: true, flipY: true, shift: 0 },
  { key: "leaf", side: "right", flipX: false, flipY: false, shift: 0 },
  { key: "flower", side: "left", flipX: false, flipY: true, shift: 30 },
  { key: "flower", side: "right", flipX: false, flipY: false, shift: 0 },
  { key: "leaf", side: "left", flipX: true, flipY: true, shift: 0 },
];

export function initDecor(C) {
  const D = C.decor ?? {}, page = document.getElementById("page");
  if (!page || (!D.flower && !D.leaf)) return;
  const layer = document.createElement("div");
  layer.className = "decor"; layer.setAttribute("aria-hidden", "true");
  page.prepend(layer);
  const nodes = [];

  const make = (spec) => {
    const src = D[spec.key]; if (!src) return null;
    const img = document.createElement("img");
    img.alt = ""; img.decoding = "async"; img.loading = "lazy"; img.src = src;
    img.addEventListener("error", () => img.remove());
    layer.append(img); return img;
  };

  const place = () => {
    const head = document.getElementById("thiep-cuoi");
    const md = matchMedia("(min-width: 768px)").matches;
    const start = head ? head.offsetTop + head.offsetHeight - (md ? 160 : 120) : 0;
    const gap = md ? 980 : 760, end = page.scrollHeight - (md ? 760 : 560);
    const count = Math.max(0, Math.floor((end - start) / gap) + 1);
    while (nodes.length > count) nodes.pop()?.remove();
    for (let i = nodes.length; i < count; i++) nodes.push(make(PATTERN[i % PATTERN.length]));
    nodes.forEach((img, i) => {
      if (!img) return;
      const spec = PATTERN[i % PATTERN.length], off = (md ? -190 : -125) - (spec.shift ? (md ? spec.shift * 1.8 : spec.shift) : 0);
      img.style.top = `${Math.round(start + i * gap)}px`;
      img.style.left = spec.side === "left" ? `${off}px` : "auto";
      img.style.right = spec.side === "right" ? `${off}px` : "auto";
      img.style.scale = `${spec.flipX ? -1 : 1} ${spec.flipY ? -1 : 1}`;
    });
  };

  let t = 0;
  const schedule = () => { clearTimeout(t); t = setTimeout(place, 120); };
  place();
  if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(page); else addEventListener("resize", schedule);
}
