// Cửa sổ "Xem tất cả": toàn bộ ảnh trong config.album.photos, giữ tỉ lệ gốc.
export function initGallery({ lightbox, config }) {
  const g = document.getElementById("gallery"), btn = document.getElementById("viewAll"); if (!g || !btn) return;
  const open = () => { g.classList.add("is-open"); document.body.classList.add("gallery-open"); document.dispatchEvent(new CustomEvent("modal:open")); g.querySelector(".gallery__x").focus(); };
  const close = () => { if (!g.classList.contains("is-open")) return; g.classList.remove("is-open"); document.body.classList.remove("gallery-open"); document.dispatchEvent(new CustomEvent("modal:close")); btn.focus(); };
  btn.addEventListener("click", open);
  g.addEventListener("click", (e) => {
    if (e.target.closest(".gallery__x")) return close();
    const it = e.target.closest(".gallery__item"); if (it) lightbox.open(config.album.photos, Number(it.dataset.index));
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.isOpen()) close(); });
}
