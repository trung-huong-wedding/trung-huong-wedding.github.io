export function countdownParts(targetIso, now = new Date()) {
  const t = new Date(targetIso).getTime();
  if (Number.isNaN(t)) return { valid: false, done: false, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const diff = t - now.getTime();
  if (diff <= 0) return { valid: true, done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const s = Math.floor(diff / 1000);
  return { valid: true, done: false, days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

export function monthGrid(year, month) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const lead = (first.getUTCDay() + 6) % 7; // Thứ Hai = 0
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const pad = (n) => String(n).padStart(2, "0");
const utcStamp = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
const esc = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

export function buildIcs({ title, startIso, durationMin, location, description }) {
  const start = new Date(startIso);
  const end = new Date(start.getTime() + durationMin * 60000);
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Thiep cuoi//VI", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:${start.getTime()}@thiep-cuoi`, `DTSTAMP:${utcStamp(start)}`,
    `DTSTART:${utcStamp(start)}`, `DTEND:${utcStamp(end)}`,
    `SUMMARY:${esc(title)}`, `LOCATION:${esc(location)}`, `DESCRIPTION:${esc(description)}`,
    "END:VEVENT", "END:VCALENDAR", "",
  ].join("\r\n");
}
