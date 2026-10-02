import test from "node:test";
import assert from "node:assert/strict";
import { resolveMap } from "../js/lib/maps.js";

const SHORT = "https://maps.app.goo.gl/vVKXpAgpEDVQo4YW7";
const EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9!2d105.78!3d20.77";
const ADDR = "số 20, ngõ 15, xã Ứng Hòa, Hà Nội";
const enc = encodeURIComponent;

test("link rút gọn đặt nhầm vào mapEmbed: dùng làm nút Chỉ đường, bản đồ nhúng dựng từ địa chỉ", () => {
  const r = resolveMap({ address: ADDR, mapEmbed: SHORT });
  assert.equal(r.link, SHORT);
  assert.equal(r.embed, `https://www.google.com/maps?q=${enc(ADDR)}&output=embed`);
});
test("link nhúng chuẩn của Google được giữ nguyên; nút Chỉ đường dựng từ địa chỉ", () => {
  const r = resolveMap({ address: ADDR, mapEmbed: EMBED });
  assert.equal(r.embed, EMBED);
  assert.equal(r.link, `https://www.google.com/maps/search/?api=1&query=${enc(ADDR)}`);
});
test("có cả mapEmbed chuẩn và mapLink: dùng đúng từng cái", () => {
  const r = resolveMap({ address: ADDR, mapEmbed: EMBED, mapLink: SHORT });
  assert.equal(r.embed, EMBED); assert.equal(r.link, SHORT);
});
test("chỉ có mapLink rút gọn: bản đồ nhúng dựng từ địa chỉ", () => {
  const r = resolveMap({ address: ADDR, mapLink: SHORT });
  assert.equal(r.link, SHORT); assert.match(r.embed, /output=embed$/);
});
test("mapQuery (vd toạ độ) được ưu tiên hơn địa chỉ", () => {
  const r = resolveMap({ address: ADDR, mapQuery: "20.7712,105.7801", mapEmbed: SHORT });
  assert.equal(r.embed, `https://www.google.com/maps?q=${enc("20.7712,105.7801")}&output=embed`);
});
test("link dạng ?output=embed cũng được coi là link nhúng", () => {
  const u = "https://www.google.com/maps?q=Ha+Noi&output=embed";
  assert.equal(resolveMap({ address: ADDR, mapEmbed: u }).embed, u);
});
test("không có gì để dựng thì trả về rỗng", () => {
  assert.deepEqual(resolveMap({}), { embed: "", link: "" });
  assert.deepEqual(resolveMap({ address: "   " }), { embed: "", link: "" });
});
test("từ chối đường dẫn không phải https (javascript:, data:, http:)", () => {
  const r = resolveMap({ address: ADDR, mapEmbed: "javascript:alert(1)", mapLink: "data:text/html,x" });
  assert.equal(r.link, `https://www.google.com/maps/search/?api=1&query=${enc(ADDR)}`);
  assert.equal(r.embed, `https://www.google.com/maps?q=${enc(ADDR)}&output=embed`);
  assert.equal(resolveMap({ address: ADDR, mapLink: "http://maps.example.com/x" }).link, `https://www.google.com/maps/search/?api=1&query=${enc(ADDR)}`);
});
