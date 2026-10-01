// Xem ảnh lớn. Nhận danh sách ảnh từ config (không đọc DOM) nên dùng chung cho slide và "Xem tất cả".
export function createLightbox({ onOpen, onClose } = {}) {
  const box = document.createElement("div");
  box.className = "lightbox"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Xem ảnh");
  box.innerHTML = '<button class="lb-close" type="button" aria-label="Đóng">✕</button><button class="lb-prev" type="button" aria-label="Ảnh trước">‹</button><img alt=""><button class="lb-next" type="button" aria-label="Ảnh sau">›</button>';
  document.body.append(box);
  const img = box.querySelector("img");
  let list = [], i = 0, startX = 0;
  const show = (n) => { if (!list.length) return; i = (n + list.length) % list.length; img.src = list[i].src; img.alt = list[i].alt || ""; };
  const isOpen = () => box.classList.contains("is-open");
  const close = () => { if (!isOpen()) return; box.classList.remove("is-open"); onClose?.(); };
  box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("lb-close")) close(); });
  box.querySelector(".lb-prev").addEventListener("click", () => show(i - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(i + 1));
  addEventListener("keydown", (e) => { if (!isOpen()) return; if (e.key === "Escape") { e.stopPropagation(); close(); } if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); }, true);
  box.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); }, { passive: true });
  return { open(photos, index = 0) { list = photos; show(index); box.classList.add("is-open"); onOpen?.(); }, isOpen };
}
