// Hiện dần các phần tử .reveal khi cuộn tới (gọi lại được cho nội dung thêm động).
export function initReveal(root = document) {
  const items = root.querySelectorAll(".reveal:not(.is-in)");
  if (!("IntersectionObserver" in window)) { items.forEach((e) => e.classList.add("is-in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  items.forEach((e) => io.observe(e));
}
