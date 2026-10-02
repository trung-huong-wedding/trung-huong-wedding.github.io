// Dựng link bản đồ nhúng + link "Chỉ đường" cho một địa điểm.
// Google KHÔNG cho nhúng link chia sẻ (maps.app.goo.gl, google.com/maps/place/...) vào iframe — chỉ nhúng được link dạng
// ".../maps/embed?pb=..." (Chia sẻ → Nhúng bản đồ) hoặc "...maps?q=...&output=embed". Vì vậy:
//  - link nhúng chuẩn được giữ nguyên;
//  - link khác (vd link rút gọn dán nhầm vào mapEmbed) dùng cho nút "Chỉ đường";
//  - thiếu thì dựng từ mapQuery (vd "20.77,105.78") hoặc địa chỉ.
const https = (u) => {
  try { const x = new URL(String(u ?? "").trim()); return x.protocol === "https:" ? x : null; } catch { return null; }
};
const isEmbed = (u) => { const x = https(u); return !!x && /(^|\.)google\.[a-z.]+$/.test(x.hostname) && (x.pathname.startsWith("/maps/embed") || x.searchParams.get("output") === "embed"); };

export function resolveMap({ address, mapQuery, mapEmbed, mapLink } = {}) {
  const query = String(mapQuery ?? "").trim() || String(address ?? "").trim();
  const q = encodeURIComponent(query);
  const embed = isEmbed(mapEmbed) ? https(mapEmbed).href : isEmbed(mapLink) ? https(mapLink).href : query ? `https://www.google.com/maps?q=${q}&output=embed` : "";
  const plain = [mapLink, mapEmbed].find((u) => https(u) && !isEmbed(u));
  const link = plain ? https(plain).href : query ? `https://www.google.com/maps/search/?api=1&query=${q}` : "";
  return { embed, link };
}
