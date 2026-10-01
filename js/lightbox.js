// Xem ảnh lớn có số thứ tự và dải ảnh thu nhỏ. Nhận danh sách ảnh từ config (không đọc DOM)
// nên dùng chung cho slide và "Xem tất cả".
export function createLightbox({ onOpen, onClose } = {}) {
  const box = document.createElement("div");
  box.className = "lightbox"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Xem ảnh");
  box.innerHTML = '<button class="lb-close" type="button" aria-label="Đóng">✕</button><div class="lb-count"></div><div class="lb-stage"><button class="lb-prev" type="button" aria-label="Ảnh trước">‹</button><img class="lb-main" alt="" draggable="false"><button class="lb-next" type="button" aria-label="Ảnh sau">›</button></div><div class="lb-thumbs"></div>';
  document.body.append(box);
  const img = box.querySelector(".lb-main"), count = box.querySelector(".lb-count"), thumbs = box.querySelector(".lb-thumbs");
  let list = [], i = 0, startX = 0;
  const show = (n) => {
    if (!list.length) return;
    i = (n + list.length) % list.length;
    img.src = list[i].src; img.alt = list[i].alt || "";
    count.textContent = `${i + 1} / ${list.length}`;
    [...thumbs.children].forEach((t, k) => { t.classList.toggle("is-on", k === i); if (k === i) t.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); });
  };
  const buildThumbs = () => {
    thumbs.replaceChildren(...list.map((p, k) => {
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", `Xem ảnh ${k + 1}`);
      const t = document.createElement("img"); t.src = p.src; t.alt = ""; t.loading = "lazy"; t.decoding = "async"; t.draggable = false;
      b.append(t); b.addEventListener("click", () => show(k)); return b;
    }));
    thumbs.hidden = list.length < 2;
  };
  const isOpen = () => box.classList.contains("is-open");
  const close = () => { if (!isOpen()) return; box.classList.remove("is-open"); onClose?.(); };
  box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("lb-close") || e.target.classList.contains("lb-stage")) close(); });
  box.querySelector(".lb-prev").addEventListener("click", () => show(i - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(i + 1));
  addEventListener("keydown", (e) => { if (!isOpen()) return; if (e.key === "Escape") { e.stopPropagation(); close(); } if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); }, true);
  box.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); }, { passive: true });
  return { open(photos, index = 0) { list = photos; buildThumbs(); show(index); box.classList.add("is-open"); onOpen?.(); }, isOpen };
}
