const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.4 2.7 5 6 5c2 0 3.4 1.1 4 2.3h4C14.6 6.1 16 5 18 5c3.3 0 5.2 3.4 3.6 6.8C19.5 16.4 12 21 12 21z"/></svg>';
const COLOR_VARS = ["--pink-soft", "--pink", "--bg", "--red", "--pink-soft"]; // lấy từ CONFIG.theme qua biến CSS
const BURST_COLOR_VARS = ["--hero-accent", "--pink", "--red", "--gold", "--pink"]; // trái tim bung ra dùng màu đậm để nổi trên mọi nền
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

// Trái tim nhỏ bung ra từ dấu niêm khi mở thiệp
function burstHearts(root, n) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2), d = rand(110, 280), el = document.createElement("span");
    el.className = "burst";
    el.style.cssText = `--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d).toFixed(0)}px;--r:${rand(-60, 60).toFixed(0)}deg;--s:${rand(14, 28).toFixed(0)}px;--dl:${rand(0, .15).toFixed(2)}s;--c:var(${BURST_COLOR_VARS[i % BURST_COLOR_VARS.length]})`;
    el.innerHTML = HEART;
    root.append(el);
  }
}

// Mốc thời gian chuỗi mở thiệp (ms): thiệp bắt đầu trượt lên; màn mở đầu mờ đi để lộ trang nội dung
export const OPEN_TIMELINE = { leave: 700, open: 2100, done: 3900 };

// Màn mở đầu là một trang riêng (phủ kín màn hình).
// Bấm "Mở thiệp": trái tim + hoa phóng to rồi mờ, trái tim nhỏ bung ra → thiệp trượt lên và biến mất → hiện trang nội dung.
export function initHero({ onOpen, onStart }) {
  const small = matchMedia("(max-width: 640px)").matches;
  spawnHearts(document.getElementById("hearts"), small ? 14 : 20);
  const btn = document.getElementById("openBtn");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let opened = false;
  btn.addEventListener("click", () => {
    if (opened) return; opened = true;
    onStart?.(); // ngay lúc bấm (còn trong thao tác của người dùng): bắt đầu phát nhạc
    const b = document.body;
    const finish = () => { b.classList.remove("is-locked"); b.classList.add("is-open"); onOpen?.(); };
    if (reduce) { finish(); return; } // giảm chuyển động: mở ngay, không hiệu ứng
    b.classList.add("is-opening");
    burstHearts(document.getElementById("heroBurst"), small ? 14 : 18);
    setTimeout(() => b.classList.add("is-leaving"), OPEN_TIMELINE.leave);
    setTimeout(finish, OPEN_TIMELINE.open);
    setTimeout(() => b.classList.remove("is-opening", "is-leaving"), OPEN_TIMELINE.done);
  });
}
