const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.4 2.7 5 6 5c2 0 3.4 1.1 4 2.3h4C14.6 6.1 16 5 18 5c3.3 0 5.2 3.4 3.6 6.8C19.5 16.4 12 21 12 21z"/></svg>';
const COLOR_VARS = ["--pink-soft", "--pink", "--bg", "--red", "--pink-soft"]; // lấy từ CONFIG.theme qua biến CSS
const rand = (a, b) => a + Math.random() * (b - a);

function spawnHearts(root, count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "heart";
    el.style.cssText = `--x:${rand(2, 96).toFixed(1)}%;--s:${rand(10, 22).toFixed(0)}px;--t:${rand(11, 19).toFixed(1)}s;--dl:${(-rand(0, 18)).toFixed(1)}s;--o:${rand(.35, .8).toFixed(2)};--c:var(${COLOR_VARS[i % COLOR_VARS.length]})`;
    el.innerHTML = HEART;
    root.append(el);
  }
}

function initParallax() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const hero = document.getElementById("thiep-cuoi"), content = document.getElementById("heroContent");
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    if (y > hero.offsetHeight) return;
    content.style.setProperty("--cy", `${(-y * 0.08).toFixed(1)}px`);
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
}

export function initHero({ onOpen }) {
  const small = matchMedia("(max-width: 640px)").matches;
  spawnHearts(document.getElementById("hearts"), small ? 14 : 20);
  initParallax();
  const btn = document.getElementById("openBtn");
  let opened = false;
  // Lưới an toàn: nếu nội dung bìa vẫn cao hơn màn hình (màn rất thấp) thì không khoá cuộn, để khách luôn chạm được nút.
  const content = document.getElementById("heroContent");
  const fit = () => { if (!opened) document.body.classList.toggle("is-locked", content.getBoundingClientRect().height <= innerHeight + 2); };
  fit(); addEventListener("resize", fit); addEventListener("orientationchange", fit);
  btn.addEventListener("click", () => {
    if (opened) return; opened = true;
    const b = document.body;
    b.classList.add("is-opening");
    setTimeout(() => { b.classList.remove("is-locked"); b.classList.add("is-open"); onOpen?.(); }, 900); // veil phủ kín ở ~40% của 2.4s
    setTimeout(() => b.classList.remove("is-opening"), 2500);
  });
}
