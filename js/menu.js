// Menu: sidebar cố định bên trái ở desktop (>=1024px), nút mở lớp phủ toàn màn hình ở mobile.
// Mục menu của section bị ẩn (mảng rỗng) tự bị bỏ qua.
export function initMenu(C, { onNavStart, onNavEnd } = {}) {
  const nav = document.getElementById("menu"), toggle = document.getElementById("menuToggle");
  const entries = C.menu.filter((m) => { const el = document.getElementById(m.id); return el && !el.hidden; });
  const list = document.createElement("ul");
  entries.forEach((m, i) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${m.id}`; a.dataset.target = m.id; a.textContent = m.label; a.style.setProperty("--i", i);
    li.append(a); list.append(li);
  });
  const mono = document.createElement("div"); mono.className = "menu__mono script"; mono.textContent = "❦";
  nav.replaceChildren(mono, list);

  const isDesktop = () => matchMedia("(min-width: 1024px)").matches;
  let held = false; // overlay mobile đang giữ tự cuộn (modal:open/close cân bằng)
  const emit = (name) => document.dispatchEvent(new CustomEvent(name));
  const setOpen = (v) => {
    if (v && !held && !isDesktop()) { held = true; emit("modal:open"); }
    if (!v && held) { held = false; emit("modal:close"); }
    nav.classList.toggle("is-open", v); toggle.setAttribute("aria-expanded", String(v)); toggle.classList.toggle("is-x", v);
    document.body.classList.toggle("menu-open", v && !isDesktop());
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => { if (e.target === nav && !isDesktop()) setOpen(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });

  list.addEventListener("click", (e) => {
    const a = e.target.closest("a"); if (!a) return;
    e.preventDefault();
    const target = document.getElementById(a.dataset.target); if (!target) return;
    setOpen(false);
    onNavStart?.();
    const y = target.getBoundingClientRect().top + scrollY;
    // Cuộn xong = trang ngừng cuộn một lúc (không dùng "scrollend": các lần cuộn nhỏ của tự cuộn cũng phát sự kiện đó nên báo xong quá sớm)
    let done = false, quiet = 0, cap = 0;
    const finish = () => { if (done) return; done = true; clearTimeout(quiet); clearTimeout(cap); removeEventListener("scroll", onScroll); onNavEnd?.(); };
    const settle = (wait = 180) => { clearTimeout(quiet); quiet = setTimeout(finish, wait); };
    const onScroll = () => settle(); // không truyền thẳng settle: tham số đầu của listener là Event
    addEventListener("scroll", onScroll, { passive: true });
    settle(500); cap = setTimeout(finish, 6000); // lần đầu chờ lâu hơn: cú cuộn mượt có thể bắt đầu hơi trễ
    scrollTo({ top: Math.max(0, y), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });

  // scrollspy: mục đang xem = section gần giữa màn hình nhất; "Thiệp cưới" giữ nguyên cho tới khi section kế tiếp vào vùng giữa
  const links = [...list.querySelectorAll("a")];
  const setActive = (id) => links.forEach((l) => l.classList.toggle("is-active", l.dataset.target === id));
  if (entries[0]) setActive(entries[0].id);
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: "-45% 0px -50% 0px" });
  entries.forEach((m) => io.observe(document.getElementById(m.id)));

  return {
    show() { nav.hidden = false; toggle.hidden = false; requestAnimationFrame(() => document.body.classList.add("menu-on")); },
  };
}
