// Hoa trang trí ở đầu trang nội dung trôi nhẹ theo cuộn (parallax rất nhẹ). Tắt khi giảm chuyển động.
export function initCouple() {
  const head = document.getElementById("thiep-cuoi");
  if (!head || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let ticking = false;
  const update = () => { ticking = false; const y = Math.min(scrollY, 1400); head.style.setProperty("--py", y.toFixed(1)); };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
}
