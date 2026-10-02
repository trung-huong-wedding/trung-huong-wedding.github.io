// Nhạc nền: nút chỉ hiện khi CONFIG.music.src có giá trị.
// Nhạc phát ngay khi người dùng bấm "Mở thiệp" (trình duyệt chỉ cho phát tiếng khi có thao tác của người dùng — bấm nút là thao tác đó),
// nên khi trang nội dung mở ra thì nhạc đã chạy. Bấm nút nhạc để tắt, bấm lần nữa để phát tiếp.
export function initMusic(C) {
  const btn = document.getElementById("musicBtn");
  if (!btn || !C.music?.src) return { play() {}, show() {} };
  const audio = document.createElement("audio");
  audio.src = C.music.src; audio.loop = true; audio.preload = "none"; audio.hidden = true;
  document.body.append(audio);

  const sync = () => {
    const on = !audio.paused;
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", on ? "Tắt nhạc" : "Phát nhạc");
  };
  audio.addEventListener("play", sync); audio.addEventListener("pause", sync);

  let fade = 0;
  const fadeIn = (ms = 2000) => {
    clearInterval(fade); const t0 = performance.now(); audio.volume = 0;
    fade = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / ms); audio.volume = k; if (k >= 1) clearInterval(fade); }, 50);
  };
  const start = () => { audio.volume = 0; return audio.play().then(() => fadeIn(), () => { audio.volume = 1; sync(); }); }; // bị chặn tự phát thì nút ở trạng thái "tắt", bấm để phát

  btn.addEventListener("click", () => { if (audio.paused) { audio.volume = 1; audio.play().catch(() => {}); } else { clearInterval(fade); audio.pause(); } });
  return { play() { if (audio.paused) start(); }, show() { btn.hidden = false; } };
}
