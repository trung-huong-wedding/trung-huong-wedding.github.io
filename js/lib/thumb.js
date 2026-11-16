// Ảnh nhẹ (thumbnail) cho trang: ảnh gốc assets/images/x.jpg → bản nhẹ assets/thumbs/x.jpg (tạo bằng scripts/make_thumbs.py).
// Ảnh gốc chỉ được tải khi người dùng phóng to (lightbox). Chỉ áp dụng cho jpg/jpeg trong assets/images; còn lại giữ nguyên.
export function thumbSrc(src) {
  const s = String(src ?? "");
  return /(^|\/)assets\/images\/[^/]+\.jpe?g$/i.test(s) && !/^[a-z]+:/i.test(s) ? s.replace(/assets\/images\//, "assets/thumbs/") : s;
}
export function photoThumb(p) {
  if (p?.thumb === false) return p.src;
  return p?.thumb || thumbSrc(p?.src);
}

// Bản xem lớn (lightbox): assets/images/x.jpg → assets/full/x.jpg (Full HD, tạo bằng scripts/make_thumbs.py). Không áp dụng được thì giữ nguyên đường dẫn gốc.
export function fullSrc(src) {
  const s = String(src ?? "");
  return /(^|\/)assets\/images\/[^/]+\.jpe?g$/i.test(s) && !/^[a-z]+:/i.test(s) ? s.replace(/assets\/images\//, "assets/full/") : s;
}
export function photoFull(p) {
  if (p?.thumb === false) return p.src;
  return fullSrc(p?.src);
}
