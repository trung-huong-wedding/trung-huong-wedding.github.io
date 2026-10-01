import { countdownParts } from "./lib/date.js";

export function initCountdown(targetIso) {
  const cells = [0, 1, 2, 3].map((i) => document.getElementById(`cd${i}`));
  const box = document.getElementById("cd"), done = document.getElementById("cdDone");
  if (!box) return;
  const pad = (n) => String(n).padStart(2, "0");
  let timer;
  const tick = () => {
    const p = countdownParts(targetIso);
    if (!p.valid || p.done) { box.hidden = true; done.hidden = !p.valid; clearInterval(timer); return; }
    [p.days, p.hours, p.minutes, p.seconds].forEach((v, i) => { cells[i].textContent = i === 0 ? String(v) : pad(v); });
  };
  tick(); timer = setInterval(tick, 1000);
}
