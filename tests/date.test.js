import test from "node:test";
import assert from "node:assert/strict";
import { countdownParts, monthGrid, buildIcs } from "../js/lib/date.js";

test("countdownParts tính đúng ngày giờ phút giây", () => {
  const now = new Date("2026-12-18T07:00:00+07:00");
  const p = countdownParts("2026-12-20T10:00:00+07:00", now);
  assert.deepEqual(p, { valid: true, done: false, days: 2, hours: 3, minutes: 0, seconds: 0 });
});
test("countdownParts khi đã qua ngày cưới", () => {
  const p = countdownParts("2026-12-20T10:00:00+07:00", new Date("2027-01-01T00:00:00Z"));
  assert.equal(p.done, true); assert.equal(p.days, 0);
});
test("countdownParts với ngày sai định dạng không trả NaN", () => {
  const p = countdownParts("khong-hop-le", new Date());
  assert.equal(p.valid, false); assert.equal(p.days, 0);
});
test("monthGrid tháng 12/2026 (1/12 là Thứ Ba)", () => {
  const g = monthGrid(2026, 12);
  assert.deepEqual(g[0], [null, 1, 2, 3, 4, 5, 6]);
  assert.ok(g.every((w) => w.length === 7));
  assert.equal(g.flat().filter((d) => d !== null).length, 31);
});
test("buildIcs có các trường bắt buộc và CRLF", () => {
  const ics = buildIcs({ title: "Lễ cưới, A & B", startIso: "2026-12-20T10:00:00+07:00", durationMin: 120, location: "HN; Việt Nam", description: "Dòng 1\nDòng 2" });
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /DTSTART:20261220T030000Z\r\n/);
  assert.match(ics, /DTEND:20261220T050000Z\r\n/);
  assert.match(ics, /SUMMARY:Lễ cưới\\, A & B\r\n/);
  assert.match(ics, /LOCATION:HN\; Việt Nam\r\n/);
  assert.match(ics, /DESCRIPTION:Dòng 1\\nDòng 2\r\n/);
  assert.match(ics, /END:VCALENDAR\r\n$/);
});
