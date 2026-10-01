// Hộp quà: rê chuột/chạm để các hộp nhỏ bay lên; bấm để mở popup QR (sao chép STK, lưu QR).
export function initGift() {
  const btn = document.getElementById("giftBtn"), modal = document.getElementById("giftModal");
  if (!btn || !modal) return;
  const open = () => { modal.classList.add("is-open"); document.dispatchEvent(new CustomEvent("modal:open")); modal.querySelector(".gift-modal__x").focus(); };
  const close = () => { if (!modal.classList.contains("is-open")) return; modal.classList.remove("is-open"); document.dispatchEvent(new CustomEvent("modal:close")); btn.focus(); };
  btn.addEventListener("click", open);
  btn.addEventListener("touchstart", () => { btn.classList.add("is-hot"); setTimeout(() => btn.classList.remove("is-hot"), 2800); }, { passive: true });
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest(".gift-modal__x")) close(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  modal.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    const txt = b.dataset.copy, old = b.textContent;
    try { await navigator.clipboard.writeText(txt); b.textContent = "Đã sao chép ✓"; }
    catch {
      const t = document.createElement("textarea"); t.value = txt; document.body.append(t); t.select();
      try { document.execCommand("copy"); b.textContent = "Đã sao chép ✓"; } catch { b.textContent = txt; }
      t.remove();
    }
    setTimeout(() => { b.textContent = old; }, 1800);
  });
}
