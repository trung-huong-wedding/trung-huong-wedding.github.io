// Nhạc nền: chỉ hiện nút khi CONFIG.music.src có giá trị. Nhạc bắt đầu sau khi bấm "Mở thiệp" (trình duyệt yêu cầu thao tác người dùng).
export function initMusic(C) {
  const btn = document.getElementById("musicBtn");
  if (!C.music?.src) return { play() {}, show() {} };
  const audio = new Audio(C.music.src); audio.loop = true; audio.preload = "none";
  const sync = () => btn.classList.toggle("is-on", !audio.paused);
  btn.addEventListener("click", () => { audio.paused ? audio.play().catch(() => {}) : audio.pause(); });
  audio.addEventListener("play", sync); audio.addEventListener("pause", sync);
  return { play() { audio.play().catch(() => {}); }, show() { btn.hidden = false; } };
}
