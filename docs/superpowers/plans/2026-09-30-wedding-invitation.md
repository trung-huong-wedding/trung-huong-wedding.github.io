# Thiệp cưới online – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dựng web thiệp cưới tĩnh (HTML/CSS/JS thuần) tông đỏ hồng, mobile-first, có hero mở thiệp, tự cuộn, menu điều hướng, hộp quà QR, sổ lưu bút lưu bằng Firebase Firestore.

**Architecture:** Một trang `index.html` dùng ES modules, không build step. Toàn bộ nội dung cá nhân nằm trong `js/config.js`; `js/render.js` đổ nội dung vào khung HTML. Logic thuần (đếm ngược, lịch, .ics, kiểm tra lời chúc, máy trạng thái tự cuộn) nằm trong `js/lib/` và có test bằng `node --test`; phần DOM/hiệu ứng mỗi tính năng một module riêng.

**Tech Stack:** HTML5, CSS (biến CSS, không framework), JavaScript ES modules, Firebase Firestore v10 modular SDK qua CDN gstatic, `node --test` (Node 20), Python 3 + Pillow (tối ưu ảnh), `python3 -m http.server` để chạy thử.

**Spec:** `docs/superpowers/specs/2026-09-30-wedding-invitation-design.md`

## Global Constraints

- Web tĩnh, không backend riêng, không CMS, không bundler/npm dependency; ảnh lưu trong repo (`assets/`).
- Chỉ sổ lưu bút ghi dữ liệu (Firestore collection `guestbook`: `name` ≤50, `message` ≤300, `createdAt` server timestamp); RSVP chỉ là form UI, không lưu, không gửi đi đâu.
- Khung nội dung tối đa `900px`, căn giữa; hero và nền phủ full-width.
- Menu: desktop ≥ `1024px` là sidebar dọc cố định bên trái, luôn hiện; dưới 1024px là nút mở menu lớp phủ toàn màn hình; menu chỉ hiện sau khi bấm "Mở thiệp".
- Mục menu đúng thứ tự: Thiệp cưới, Thông tin lễ cưới, Câu chuyện tình yêu, Album ảnh, Thông tin tiệc cưới, Địa chỉ, Sổ lưu bút, Quà mừng.
- **Màu nằm trong `CONFIG.theme`** (nền `#FFF6F5`, hồng phấn `#F7C6CE`, hồng đậm `#E0607E`, đỏ hồng `#C8304F`, đỏ rượu `#8E1F3A`, vàng `#C9A25B`, chữ `#4a2a31`, chữ phụ `#7a5a61`); `js/theme.js` đặt chúng thành biến CSS trên `:root` lúc khởi động. **Không hard-code màu** trong CSS/JS/SVG: mọi màu dẫn xuất dùng `color-mix(in srgb, var(--x) N%, transparent)`, SVG dùng `style="fill:var(--x)"`, trái tim/confetti đọc màu từ biến CSS. Mọi đoạn code mẫu bên dưới có màu cố định (rgba/hex) phải được chuyển thành biến theo quy tắc này khi viết.
- **Ảnh giữ nguyên bản gốc**: không resize/nén/cắt/đổi định dạng file; hiển thị theo tỉ lệ thật (không crop), riêng nền hero dùng `cover`.
- **Nội dung theo khối**: mọi danh sách là mảng trong `config.js`; mảng rỗng thì ẩn section và mục menu; layout co giãn, không chiều cao cố định cho khối nội dung.
- Font: Cormorant Garamond (tiêu đề/serif), Great Vibes (chữ viết tay), Be Vietnam Pro (thân bài), tải từ Google Fonts.
- Animation chậm, nhẹ: vào cảnh fade + trượt 16–24px, 1.2–1.8s, easing ease-out; không bounce/xoay mạnh; mỗi màn tối đa một chuyển động nổi bật.
- Tự cuộn ~35px/giây (`CONFIG.autoScroll.pxPerSecond`); bấm vùng trống để dừng/chạy; bấm phần tử tương tác không ảnh hưởng; tắt mặc định khi `prefers-reduced-motion`.
- Tổ chức 2 địa điểm (nhà trai, nhà gái), mỗi nơi một bản đồ Google Maps nhúng riêng.
- Tiếng Việt cho toàn bộ chữ hiển thị.
- Không đưa ảnh/QR/thông tin nhạy cảm thật vào repo: dùng ảnh hoàng hôn đã copy trong `assets/images/` và QR/STK giữ chỗ.
- Commit message kết thúc bằng dòng `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- Mở trang bằng `?to=` chứa HTML/ký tự lạ (`<img onerror>`, `%`, rất dài): phải hiển thị như chữ thường, không chạy script, không vỡ bố cục (dùng `textContent`, cắt 60 ký tự).
- Firebase chưa cấu hình/mất mạng/ chặn: sổ lưu bút vẫn hiện lời chúc mẫu, form báo lỗi nhẹ, trang không treo.
- Lời chúc toàn khoảng trắng, quá 300 ký tự, chứa `<script>`: bị từ chối hoặc hiển thị nguyên văn an toàn.
- Gửi lời chúc liên tiếp (bấm đúp/ spam): chỉ 1 bản ghi, bị chặn cooldown 30s.
- Người dùng cuộn tay, bấm menu, mở popup QR/lightbox, gõ form trong lúc tự cuộn: tự cuộn không giật ngược, không cuộn khi popup mở hoặc đang gõ, và chạy tiếp đúng trạng thái trước đó.
- Ngày cưới đã qua hoặc `weddingDate` sai định dạng: đếm ngược hiện "Hôm nay/Đã kết thúc", không hiện `NaN`.
- Màn hình rất hẹp (320px), rất rộng (2560px), màn dọc có thanh địa chỉ trình duyệt co giãn (`svh`), xoay ngang điện thoại: không tràn ngang, hero không cắt mất tên.
- `prefers-reduced-motion`: không trái tim rơi liên tục, không parallax, không tự cuộn, nội dung vẫn hiện (không kẹt ở opacity 0).

---

## File Structure

```
index.html
css/tokens.css      # biến màu/font/khoảng cách, reset, grain, khung 900px
css/hero.css        # hero, trái tim rơi, nút mở thiệp, veil
css/sections.css    # các section nội dung, story, album, lightbox, tiệc, địa chỉ, sổ lưu bút, form
css/menu.css        # sidebar desktop + overlay mobile + nút nhạc
css/gift.css        # hộp quà, hộp nhỏ, confetti, modal QR
js/config.js        # TOÀN BỘ nội dung + cấu hình Firebase
js/lib/date.js      # countdownParts, monthGrid, buildIcs
js/lib/text.js      # sanitizeGuestName, validateEntry, cooldownRemaining
js/lib/autoscroll-state.js  # máy trạng thái thuần
js/render.js        # đổ CONFIG vào DOM
js/hero.js          # trái tim rơi, parallax, mở thiệp
js/reveal.js        # hiện dần khi cuộn
js/countdown.js     # đồng hồ đếm ngược (DOM)
js/calendar.js      # vẽ lịch + nút .ics
js/lightbox.js
js/menu.js          # sidebar/overlay + scrollspy
js/music.js
js/autoscroll.js    # rAF + lắng nghe click/hold
js/gift.js          # hiệu ứng + modal QR + copy/lưu
js/guestbook.js     # Firestore + fallback
js/rsvp.js
js/main.js          # nối mọi thứ
firestore.rules
tests/*.test.js
README.md
.gitignore
assets/images/ (đã có hero.jpg, couple-1..4.jpg), assets/qr/, assets/audio/
```

Chạy thử: `python3 -m http.server 8000` rồi mở `http://localhost:8000` (ES modules không chạy qua `file://`).
Chạy test: `node --test tests/`.

---

### Task 1: Khung dự án, cấu hình và design tokens

**Files:**
- Create: `.gitignore`, `index.html`, `css/tokens.css`, `js/config.js`, `js/render.js`, `js/main.js`, `assets/qr/groom.svg`, `assets/qr/bride.svg`
- Modify: (none)

**Interfaces:**
- Produces: `CONFIG` (xem dưới), `render(CONFIG)` trong `js/render.js` (export `renderAll`), `qs(sel, root?)`/`qsa` helper export từ `js/render.js` không cần; các module khác dùng `document.querySelector` trực tiếp.

- [ ] **Step 1: `.gitignore`**

```
.DS_Store
node_modules/
*.log
```

- [ ] **Step 2: `js/config.js`** (dữ liệu giữ chỗ, bạn thay sau)

```js
// Toàn bộ nội dung thiệp. Sửa ở đây, không cần động vào HTML.
export const CONFIG = {
  title: "Thiệp cưới Quang Minh & Thu Hà",

  // Bảng màu: đổi tone chủ đạo ở đây, toàn trang đổi theo (không hard-code ở CSS/JS).
  theme: { bg: "#FFF6F5", pinkSoft: "#F7C6CE", pink: "#E0607E", red: "#C8304F", wine: "#8E1F3A", gold: "#C9A25B", ink: "#4a2a31", inkSoft: "#7a5a61" },

  weddingDate: "2026-12-20T10:00:00+07:00",
  dateLabel: { weekday: "Chủ nhật", day: "20", month: "12", year: "2026", lunar: "(Nhằm ngày 11 tháng 11 năm Bính Ngọ)" },
  guestParam: "to",

  couple: {
    groom: { name: "Quang Minh", fullName: "Nguyễn Quang Minh", role: "Chú rể", parents: ["Ông Nguyễn Văn A", "Bà Trần Thị B"], address: "Hà Nội", photo: "assets/images/couple-1.jpg", bio: "Chàng trai hiền lành, thích đi biển và nấu ăn." },
    bride: { name: "Thu Hà", fullName: "Phạm Thu Hà", role: "Cô dâu", parents: ["Ông Phạm Văn C", "Bà Lê Thị D"], address: "Hà Nội", photo: "assets/images/couple-2.jpg", bio: "Cô gái dịu dàng, yêu hoa và những buổi chiều hoàng hôn." },
  },

  hero: { photo: "assets/images/hero.jpg", lead: "Trân trọng kính mời" },

  invitation: {
    heading: "Thiệp Mời",
    lines: [
      "Tình yêu không phải là nhìn nhau,",
      "mà là cùng nhau nhìn về một hướng.",
    ],
    body: "Chúng mình hân hoan báo tin vui và trân trọng kính mời bạn đến chung vui trong ngày trọng đại của chúng mình.",
  },

  ceremony: {
    heading: "Thông Tin Lễ Cưới",
    title: "Lễ Thành Hôn",
    startIso: "2026-12-20T10:00:00+07:00",
    durationMin: 120,
    timeline: [
      { time: "08:30", title: "Đón khách" },
      { time: "10:00", title: "Lễ thành hôn" },
      { time: "11:30", title: "Chụp ảnh lưu niệm" },
    ],
    locationForCalendar: "Nhà hàng Hoa Hồng, Hà Nội",
  },

  story: {
    heading: "Câu Chuyện Tình Yêu",
    chapters: [
      { date: "Tháng 6, 2021", title: "Lần đầu gặp gỡ", photoAlt: "Nắm tay bên biển", text: "Một buổi chiều bình thường, chúng mình gặp nhau và câu chuyện bắt đầu từ một cái nhìn rất khẽ.", photo: "assets/images/couple-1.jpg" },
      { date: "Tháng 12, 2021", title: "Những ngày đầu hẹn hò", text: "Những chuyến đi dài, những cuộc trò chuyện không đoạn kết và nụ cười ngày một gần hơn.", photo: "assets/images/couple-2.jpg" },
      { date: "Năm 2023", title: "Cùng nhau đi qua thử thách", text: "Có những ngày khó khăn, nhưng bàn tay vẫn nắm chặt và chúng mình hiểu nhau hơn.", photo: "assets/images/couple-3.jpg" },
      { date: "Năm 2026", title: "Lời cầu hôn", text: "Bên bờ biển lúc hoàng hôn, một lời hỏi nhỏ và một câu trả lời 'Đồng ý' ngập tràn hạnh phúc.", photo: "assets/images/couple-4.jpg" },
    ],
  },

  album: {
    heading: "Album Ảnh Cưới",
    sliderCount: 10,   // số ảnh đầu tiên chạy trong slide
    intervalMs: 4500,  // thời gian giữa hai lần tự trượt
    viewAllLabel: "Xem tất cả", // nút mở toàn bộ ảnh
    photos: [
      { src: "assets/images/hero.jpg", alt: "Khoảnh khắc hoàng hôn" },
      { src: "assets/images/couple-1.jpg", alt: "Nắm tay bên biển" },
      { src: "assets/images/couple-2.jpg", alt: "Vũ điệu hoàng hôn" },
      { src: "assets/images/couple-3.jpg", alt: "Nụ hôn" },
      { src: "assets/images/couple-4.jpg", alt: "Ôm nhau" },
    ],
  },

  banquet: {
    heading: "Thông Tin Tiệc Cưới",
    time: "11:30, Chủ nhật 20/12/2026",
    venueName: "Nhà hàng Hoa Hồng",
    note: "Sự hiện diện của bạn là niềm vui lớn của gia đình chúng mình.",
    dressCode: "Gam màu hồng, đỏ, kem",
    zalo: "https://zalo.me/0900000000",
    rsvp: { heading: "Xác Nhận Tham Dự", thanks: "Cảm ơn bạn! Chúng mình rất mong được gặp bạn." },
  },

  venues: {
    heading: "Địa Chỉ",
    items: [
      { side: "Nhà Trai", name: "Nhà hàng Hoa Hồng", address: "12 Phố Huế, Hai Bà Trưng, Hà Nội", time: "Tiệc thân mật: 11:30, 20/12/2026", mapEmbed: "https://www.google.com/maps?q=12+Ph%E1%BB%91+Hu%E1%BA%BF,+H%C3%A0+N%E1%BB%99i&output=embed", mapLink: "https://www.google.com/maps/search/?api=1&query=12+Ph%E1%BB%91+Hu%E1%BA%BF+H%C3%A0+N%E1%BB%99i" },
      { side: "Nhà Gái", name: "Trung tâm tiệc cưới Hoa Sen", address: "45 Láng Hạ, Đống Đa, Hà Nội", time: "Tiệc thân mật: 18:00, 19/12/2026", mapEmbed: "https://www.google.com/maps?q=45+L%C3%A1ng+H%E1%BA%A1,+H%C3%A0+N%E1%BB%99i&output=embed", mapLink: "https://www.google.com/maps/search/?api=1&query=45+L%C3%A1ng+H%E1%BA%A1+H%C3%A0+N%E1%BB%99i" },
    ],
  },

  guestbook: {
    heading: "Sổ Lưu Bút",
    maxName: 50,
    maxMessage: 300,
    cooldownSec: 30,
    pageSize: 10,
    samples: [
      { name: "Bạn thân", message: "Chúc hai bạn trăm năm hạnh phúc!", createdAtMs: 0 },
      { name: "Đồng nghiệp", message: "Chúc mừng hạnh phúc! Mãi bên nhau nhé.", createdAtMs: 0 },
    ],
  },

  gift: {
    heading: "Hộp Quà Mừng",
    hint: "Nhấn để mở",
    people: [
      { role: "Chú Rể", name: "NGUYEN QUANG MINH", bank: "Vietcombank", account: "0000000000", qr: "assets/qr/groom.svg" },
      { role: "Cô Dâu", name: "PHAM THU HA", bank: "BIDV", account: "1111111111", qr: "assets/qr/bride.svg" },
    ],
  },

  thanks: { text: "Cảm ơn bạn đã dành tình cảm cho chúng mình", sign: "Quang Minh & Thu Hà" },

  menu: [
    { id: "thiep-cuoi", label: "Thiệp cưới" },
    { id: "le-cuoi", label: "Thông tin lễ cưới" },
    { id: "tinh-yeu", label: "Câu chuyện tình yêu" },
    { id: "album", label: "Album ảnh" },
    { id: "tiec-cuoi", label: "Thông tin tiệc cưới" },
    { id: "dia-chi", label: "Địa chỉ" },
    { id: "so-luu-but", label: "Sổ lưu bút" },
    { id: "qua-mung", label: "Quà mừng" },
  ],

  music: { src: "" }, // ví dụ "assets/audio/music.mp3"; để trống thì ẩn nút nhạc
  autoScroll: { pxPerSecond: 35 },

  // Dán cấu hình web app từ Firebase Console. Để apiKey trống thì dùng lời chúc mẫu.
  firebase: { apiKey: "", authDomain: "", projectId: "", appId: "" },
};
```

- [ ] **Step 3: QR giữ chỗ** `assets/qr/groom.svg` và `assets/qr/bride.svg` (hình vuông có chữ, để thay bằng QR thật)

```bash
for n in groom bride; do
cat > assets/qr/$n.svg <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#fff"/><g fill="#8E1F3A"><rect x="20" y="20" width="50" height="50"/><rect x="130" y="20" width="50" height="50"/><rect x="20" y="130" width="50" height="50"/><rect x="85" y="85" width="30" height="30"/></g><text x="100" y="192" font-size="11" text-anchor="middle" fill="#8E1F3A" font-family="sans-serif">QR giu cho - $n</text></svg>
EOF
done
```

- [ ] **Step 4: `css/tokens.css`**

```css
:root {
  --bg: #FFF6F5; --pink-soft: #F7C6CE; --pink: #E0607E; --red: #C8304F; --wine: #8E1F3A; --gold: #C9A25B;
  --ink: #4a2a31; --ink-soft: #7a5a61;
  --font-serif: "Cormorant Garamond", "Playfair Display", Georgia, serif;
  --font-script: "Great Vibes", "Pinyon Script", cursive;
  --font-body: "Be Vietnam Pro", system-ui, sans-serif;
  --ease: cubic-bezier(.22,.61,.36,1);
  --col: 900px;
  --gutter: clamp(20px, 6vw, 48px);
}
*,*::before,*::after { box-sizing: border-box; }
html { scroll-behavior: auto; -webkit-text-size-adjust: 100%; }
body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--font-body); font-weight: 300; line-height: 1.75; overflow-x: hidden; }
body.is-locked { overflow: hidden; }
img { max-width: 100%; display: block; }
button { font: inherit; color: inherit; cursor: pointer; }
h1,h2,h3,p { margin: 0; }
.col { width: min(100%, var(--col)); margin-inline: auto; padding-inline: var(--gutter); }
.page { position: relative; }
.page::before { content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: .05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
.script { font-family: var(--font-script); color: var(--wine); font-weight: 400; }
.eyebrow { font-family: var(--font-serif); text-transform: uppercase; letter-spacing: .3em; font-size: .8rem; color: var(--ink-soft); }
.orn { color: var(--gold); text-align: center; font-size: 1.2rem; letter-spacing: .6em; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.reveal { opacity: 0; transform: translateY(20px); transition: opacity 1.4s var(--ease), transform 1.4s var(--ease); transition-delay: var(--d, 0s); }
.reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
  *,*::before,*::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; }
}
```

- [ ] **Step 5: `index.html`** (khung; nội dung do `render.js` điền)

```html
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Thiệp cưới</title>
  <meta name="theme-color" content="#FFF6F5">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Great+Vibes&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/hero.css">
  <link rel="stylesheet" href="css/sections.css">
  <link rel="stylesheet" href="css/menu.css">
  <link rel="stylesheet" href="css/gift.css">
</head>
<body class="is-locked">
  <div class="page" id="page">
    <header class="hero" id="thiep-cuoi" data-section>
      <div class="hero__bg" id="heroBg"></div>
      <div class="hero__shade"></div>
      <div class="hero__hearts" id="hearts" aria-hidden="true"></div>
      <svg class="hero__orn hero__orn--l" viewBox="0 0 120 400" aria-hidden="true"><use href="#branch"/></svg>
      <svg class="hero__orn hero__orn--r" viewBox="0 0 120 400" aria-hidden="true"><use href="#branch"/></svg>
      <div class="hero__content" id="heroContent">
        <p class="hero__lead eyebrow" id="heroLead"></p>
        <h1 class="hero__names"><span class="script" id="heroGroom"></span><span class="hero__amp">&amp;</span><span class="script" id="heroBride"></span></h1>
        <div class="hero__date" id="heroDate"></div>
        <p class="hero__guest" id="heroGuest" hidden></p>
        <button class="hero__open" id="openBtn" type="button">Mở thiệp</button>
      </div>
      <div class="hero__veil" id="veil" aria-hidden="true"></div>
    </header>

    <main id="main">
      <section class="sec sec--invite col" id="invitation"></section>
      <section class="sec sec--couple col" id="couple"></section>
      <section class="sec sec--count col" id="countdown"></section>
      <section class="sec col" id="le-cuoi" data-section></section>
      <section class="sec col" id="tinh-yeu" data-section></section>
      <section class="sec col" id="album" data-section></section>
      <section class="sec col" id="tiec-cuoi" data-section></section>
      <section class="sec col" id="dia-chi" data-section></section>
      <section class="sec col" id="so-luu-but" data-section></section>
      <section class="sec sec--gift col" id="qua-mung" data-section></section>
      <footer class="sec sec--thanks col" id="thanks"></footer>
    </main>
  </div>

  <nav class="menu" id="menu" aria-label="Điều hướng" hidden></nav>
  <button class="menu-toggle" id="menuToggle" type="button" aria-label="Mở menu" aria-expanded="false" hidden><span></span><span></span></button>
  <button class="music" id="musicBtn" type="button" aria-label="Bật/tắt nhạc" hidden>♪</button>

  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
      <symbol id="branch" viewBox="0 0 120 400">
        <g fill="none" stroke="#C9A25B" stroke-width="1.2" stroke-linecap="round" opacity=".9">
          <path d="M60 0 C 50 90, 75 160, 58 260 S 62 360, 60 400"/>
          <path d="M58 70 C 30 60, 18 80, 24 100 C 44 98, 54 86, 58 70 Z"/>
          <path d="M62 140 C 90 128, 104 148, 96 168 C 76 166, 64 156, 62 140 Z"/>
          <path d="M58 220 C 30 212, 16 232, 24 250 C 44 248, 56 238, 58 220 Z"/>
          <path d="M62 300 C 90 290, 102 308, 96 326 C 76 324, 66 316, 62 300 Z"/>
        </g>
      </symbol>
    </defs>
  </svg>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 5b: `js/theme.js`** — áp bảng màu từ config lên `:root` (CSS trong `tokens.css` chỉ giữ giá trị mặc định dự phòng)

```js
import { themeToCssVars } from "./lib/theme.js";
export function applyTheme(theme) {
  const root = document.documentElement;
  for (const [k, v] of Object.entries(themeToCssVars(theme))) root.style.setProperty(k, v);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && theme?.bg) meta.setAttribute("content", theme.bg);
}
```

Trong `js/main.js` gọi `applyTheme(CONFIG.theme)` trước `renderAll`. (`themeToCssVars` được tạo ở Task 2; nếu làm Task 1 trước thì tạo `js/lib/theme.js` ngay ở đây theo code Task 2 Step 11 và để test ở Task 2.)

- [ ] **Step 6: `js/render.js` (khung, điền dần ở các task sau) và `js/main.js`**

```js
// js/render.js
export function setText(el, text) { if (el) el.textContent = text ?? ""; }

export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "dataset") Object.assign(el.dataset, v);
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return el;
}

export function sectionHead(heading) {
  return [
    h("p", { class: "orn reveal" }, "❦"),
    h("h2", { class: "sec__title script reveal", style: "--d:.15s" }, heading),
    h("span", { class: "rule reveal", style: "--d:.3s" }),
  ];
}

export const renderers = []; // mỗi task đăng ký: renderers.push((CONFIG) => {...})
export function renderAll(CONFIG) { renderers.forEach((fn) => fn(CONFIG)); }
```

```js
// js/main.js
import { CONFIG } from "./config.js";
import { renderAll } from "./render.js";

document.title = CONFIG.title;
renderAll(CONFIG);
```

- [ ] **Step 7: Kiểm tra trang dựng được**

Run: `cd /home/trungnt/Desktop/wedding && python3 -m http.server 8000` (chạy nền), rồi `curl -s -o /dev/null -w "%{http_code}\n" localhost:8000/index.html localhost:8000/js/config.js localhost:8000/css/tokens.css`
Expected: `200` cho cả ba (css/hero.css… chưa có sẽ 404, sẽ tạo ở task sau; tạm tạo file rỗng `touch css/hero.css css/sections.css css/menu.css css/gift.css`).

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "chore: scaffold wedding invitation (config, tokens, skeleton)"
```

---

### Task 2: Thư viện logic thuần + test

**Files:**
- Create: `js/lib/date.js`, `js/lib/text.js`, `js/lib/autoscroll-state.js`, `tests/date.test.js`, `tests/text.test.js`, `tests/autoscroll-state.test.js`

**Interfaces:**
- Produces:
  - `countdownParts(targetIso: string, now?: Date) -> { valid: boolean, done: boolean, days: number, hours: number, minutes: number, seconds: number }`
  - `monthGrid(year: number, month1to12: number) -> Array<Array<number|null>>` (tuần bắt đầu Thứ Hai, mỗi tuần 7 phần tử)
  - `buildIcs({ title, startIso, durationMin, location, description }) -> string` (CRLF, UTC)
  - `sanitizeGuestName(raw: string|null, max?: number) -> string` (trim, bỏ ký tự điều khiển, cắt `max` mặc định 60)
  - `validateEntry({ name, message }, { maxName, maxMessage }) -> { ok: boolean, errors: { name?: string, message?: string }, value: { name: string, message: string } }`
  - `cooldownRemaining(lastMs: number, nowMs: number, cooldownSec: number) -> number` (giây còn lại, ≥0)
  - `createAutoScrollState() -> { isRunning(), userPaused(), toggleUser(), hold(reason), release(reason), holds(), setEnabled(bool) }`

- [ ] **Step 1: Test `tests/date.test.js`**

```js
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
  assert.match(ics, /LOCATION:HN\\; Việt Nam\r\n/);
  assert.match(ics, /DESCRIPTION:Dòng 1\\nDòng 2\r\n/);
  assert.match(ics, /END:VCALENDAR\r\n$/);
});
```


- [ ] **Step 2: Chạy test, xác nhận fail**

Run: `node --test tests/date.test.js`
Expected: FAIL (`Cannot find module ../js/lib/date.js`).

- [ ] **Step 3: `js/lib/date.js`**

```js
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
const esc = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

export function buildIcs({ title, startIso, durationMin, location, description }) {
  const start = new Date(startIso);
  const end = new Date(start.getTime() + durationMin * 60000);
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Thiep cuoi//VI", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    `UID:${start.getTime()}@thiep-cuoi`, `DTSTAMP:${utcStamp(new Date(0))}`,
    `DTSTART:${utcStamp(start)}`, `DTEND:${utcStamp(end)}`,
    `SUMMARY:${esc(title)}`, `LOCATION:${esc(location)}`, `DESCRIPTION:${esc(description)}`,
    "END:VEVENT", "END:VCALENDAR", "",
  ].join("\r\n");
}
```

- [ ] **Step 4: Chạy test date**

Run: `node --test tests/date.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Test `tests/text.test.js`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeGuestName, validateEntry, cooldownRemaining } from "../js/lib/text.js";

test("sanitizeGuestName giữ chữ thường, cắt độ dài, bỏ ký tự điều khiển", () => {
  assert.equal(sanitizeGuestName("  Anh Nam  "), "Anh Nam");
  assert.equal(sanitizeGuestName(null), "");
  assert.equal(sanitizeGuestName("a\u0000b\u0007c"), "abc");
  assert.equal(sanitizeGuestName("x".repeat(100)).length, 60);
});
test("sanitizeGuestName không loại bỏ thẻ HTML (phải dùng textContent khi render)", () => {
  assert.equal(sanitizeGuestName("<img onerror=x>"), "<img onerror=x>");
});
const L = { maxName: 50, maxMessage: 300 };
test("validateEntry hợp lệ", () => {
  const r = validateEntry({ name: "  An ", message: " Chúc mừng!  " }, L);
  assert.equal(r.ok, true); assert.deepEqual(r.value, { name: "An", message: "Chúc mừng!" });
});
test("validateEntry từ chối rỗng và toàn khoảng trắng", () => {
  const r = validateEntry({ name: "   ", message: "\n\t " }, L);
  assert.equal(r.ok, false); assert.ok(r.errors.name); assert.ok(r.errors.message);
});
test("validateEntry từ chối quá dài", () => {
  const r = validateEntry({ name: "a".repeat(51), message: "b".repeat(301) }, L);
  assert.equal(r.ok, false); assert.ok(r.errors.name); assert.ok(r.errors.message);
});
test("validateEntry chấp nhận đúng biên", () => {
  assert.equal(validateEntry({ name: "a".repeat(50), message: "b".repeat(300) }, L).ok, true);
});
test("cooldownRemaining", () => {
  assert.equal(cooldownRemaining(0, 10_000, 30), 20);
  assert.equal(cooldownRemaining(0, 40_000, 30), 0);
  assert.equal(cooldownRemaining(NaN, 1, 30), 0);
});
```

- [ ] **Step 6: Chạy test, xác nhận fail**

Run: `node --test tests/text.test.js`
Expected: FAIL (module chưa có).

- [ ] **Step 7: `js/lib/text.js`**

```js
const CTRL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizeGuestName(raw, max = 60) {
  if (raw == null) return "";
  return String(raw).replace(CTRL, "").trim().slice(0, max);
}

export function validateEntry({ name, message }, { maxName, maxMessage }) {
  const n = String(name ?? "").replace(CTRL, "").trim();
  const m = String(message ?? "").replace(CTRL, "").trim();
  const errors = {};
  if (!n) errors.name = "Bạn vui lòng nhập tên.";
  else if (n.length > maxName) errors.name = `Tên tối đa ${maxName} ký tự.`;
  if (!m) errors.message = "Bạn vui lòng nhập lời chúc.";
  else if (m.length > maxMessage) errors.message = `Lời chúc tối đa ${maxMessage} ký tự.`;
  return { ok: Object.keys(errors).length === 0, errors, value: { name: n, message: m } };
}

export function cooldownRemaining(lastMs, nowMs, cooldownSec) {
  if (!Number.isFinite(lastMs)) return 0;
  return Math.max(0, Math.ceil(cooldownSec - (nowMs - lastMs) / 1000));
}
```

- [ ] **Step 8: Test `tests/autoscroll-state.test.js`**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createAutoScrollState } from "../js/lib/autoscroll-state.js";

test("mặc định tắt cho tới khi setEnabled(true)", () => {
  const s = createAutoScrollState();
  assert.equal(s.isRunning(), false);
  s.setEnabled(true);
  assert.equal(s.isRunning(), true);
});
test("toggleUser dừng và chạy lại", () => {
  const s = createAutoScrollState(); s.setEnabled(true);
  s.toggleUser(); assert.equal(s.isRunning(), false); assert.equal(s.userPaused(), true);
  s.toggleUser(); assert.equal(s.isRunning(), true);
});
test("hold tạm dừng và release chạy lại nếu người dùng không tự dừng", () => {
  const s = createAutoScrollState(); s.setEnabled(true);
  s.hold("modal"); assert.equal(s.isRunning(), false);
  s.release("modal"); assert.equal(s.isRunning(), true);
});
test("release không bật lại khi người dùng đã tự dừng", () => {
  const s = createAutoScrollState(); s.setEnabled(true);
  s.toggleUser(); s.hold("typing"); s.release("typing");
  assert.equal(s.isRunning(), false);
});
test("nhiều hold độc lập", () => {
  const s = createAutoScrollState(); s.setEnabled(true);
  s.hold("a"); s.hold("b"); s.release("a");
  assert.equal(s.isRunning(), false);
  s.release("b"); assert.equal(s.isRunning(), true);
  s.release("khong-ton-tai"); assert.equal(s.isRunning(), true);
});
```

- [ ] **Step 9: Chạy test, xác nhận fail; viết `js/lib/autoscroll-state.js`**

Run: `node --test tests/autoscroll-state.test.js` → FAIL.

```js
export function createAutoScrollState() {
  let enabled = false, paused = false;
  const holds = new Set();
  return {
    setEnabled(v) { enabled = !!v; },
    toggleUser() { paused = !paused; return paused; },
    userPaused: () => paused,
    hold(reason) { holds.add(reason); },
    release(reason) { holds.delete(reason); },
    holds: () => [...holds],
    isRunning: () => enabled && !paused && holds.size === 0,
  };
}
```

- [ ] **Step 11: Thư viện bổ sung (màu theo config, slide, cây thời gian) — test trước**

`tests/theme-slider-timeline.test.js`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { themeToCssVars } from "../js/lib/theme.js";
import { nextIndex } from "../js/lib/slider.js";
import { timelineProgress } from "../js/lib/timeline.js";

test("themeToCssVars ánh xạ khoá camelCase sang biến CSS và bỏ giá trị không hợp lệ", () => {
  const v = themeToCssVars({ bg: "#fff", pinkSoft: "#F7C6CE", red: "red; x:{", wine: "", unknown: "#000", gold: 5 });
  assert.deepEqual(v, { "--bg": "#fff", "--pink-soft": "#F7C6CE" });
});
test("themeToCssVars chịu được undefined", () => assert.deepEqual(themeToCssVars(undefined), {}));
test("nextIndex lặp vòng hai chiều", () => {
  assert.equal(nextIndex(0, 5, 1), 1); assert.equal(nextIndex(4, 5, 1), 0);
  assert.equal(nextIndex(0, 5, -1), 4); assert.equal(nextIndex(2, 5, 10), 2);
  assert.equal(nextIndex(3, 0, 1), 0); assert.equal(nextIndex(0, 1, 1), 0);
});
test("timelineProgress từ 0 đến 1, chịu chiều cao 0", () => {
  assert.equal(timelineProgress(1000, 2000, 800), 0);          // chưa tới
  assert.equal(timelineProgress(480 - 1000, 1000, 800), 1);    // đã qua hết
  assert.ok(Math.abs(timelineProgress(480 - 500, 1000, 800) - 0.5) < 1e-9);
  assert.equal(timelineProgress(0, 0, 800), 0);
});
```

Run: `node --test tests/theme-slider-timeline.test.js` → FAIL (module chưa có). Rồi tạo:

```js
// js/lib/theme.js
const MAP = { bg: "--bg", pinkSoft: "--pink-soft", pink: "--pink", red: "--red", wine: "--wine", gold: "--gold", ink: "--ink", inkSoft: "--ink-soft" };
export function themeToCssVars(theme) {
  const out = {};
  for (const [k, v] of Object.entries(theme ?? {})) {
    if (MAP[k] && typeof v === "string" && v.trim() && !/[;{}]/.test(v)) out[MAP[k]] = v.trim();
  }
  return out;
}
// js/lib/slider.js
export function nextIndex(i, n, delta) { return n > 0 ? (((i + delta) % n) + n) % n : 0; }
// js/lib/timeline.js
export function timelineProgress(top, height, viewportH) {
  if (!(height > 0)) return 0;
  return Math.min(1, Math.max(0, (viewportH * 0.6 - top) / height));
}
```

Run lại → PASS. Commit gộp ở bước 12.

- [ ] **Step 10: Chạy toàn bộ test**

Run: `node --test tests/`
Expected: PASS toàn bộ.

- [ ] **Step 12: Commit**

```bash
git add -A && git commit -m "feat: pure logic libs (countdown, calendar, ics, validation, autoscroll state) with tests"
```

---

### Task 3: Hero, trái tim rơi, parallax, mở thiệp

**Files:**
- Create: `css/hero.css`, `js/hero.js`
- Modify: `js/render.js` (đăng ký renderer hero), `js/main.js`

**Interfaces:**
- Consumes: `CONFIG.hero`, `CONFIG.couple`, `CONFIG.dateLabel`, `CONFIG.guestParam`, `sanitizeGuestName` (Task 2).
- Produces: `initHero({ onOpen })` trong `js/hero.js`: gọi `onOpen()` đúng một lần sau khi người dùng bấm "Mở thiệp" và `body.is-locked` đã gỡ; thêm class `is-open` vào `document.body`.

- [ ] **Step 1: Renderer hero** — thêm vào cuối `js/render.js`:

```js
import { sanitizeGuestName } from "./lib/text.js";

renderers.push((C) => {
  document.getElementById("heroBg").style.backgroundImage = `url("${C.hero.photo}")`;
  setText(document.getElementById("heroLead"), C.hero.lead);
  setText(document.getElementById("heroGroom"), C.couple.groom.name);
  setText(document.getElementById("heroBride"), C.couple.bride.name);
  const d = C.dateLabel;
  const date = document.getElementById("heroDate");
  date.replaceChildren(
    h("span", { class: "eyebrow" }, d.weekday),
    h("span", { class: "hero__num" }, `${d.day}`, h("i", {}, "·"), `${d.month}`, h("i", {}, "·"), `${d.year}`),
  );
  const guest = sanitizeGuestName(new URLSearchParams(location.search).get(C.guestParam));
  const g = document.getElementById("heroGuest");
  if (guest) { g.hidden = false; g.replaceChildren(document.createTextNode("Thân mời "), h("strong", {}, guest)); }
});
```

(`import` đặt lên đầu file khi chỉnh.)

- [ ] **Step 2: `css/hero.css`**

```css
.hero { position: relative; min-height: 100vh; min-height: 100svh; display: grid; place-items: center; overflow: hidden; isolation: isolate; text-align: center; color: #fff; }
.hero__bg { position: absolute; inset: -6% 0; background-size: cover; background-position: center 35%; transform: translate3d(0, var(--bgy, 0px), 0); will-change: transform; z-index: -3; }
.hero__shade { position: absolute; inset: 0; z-index: -2;
  background: linear-gradient(180deg, rgba(142,31,58,.55) 0%, rgba(142,31,58,.10) 30%, rgba(142,31,58,.15) 55%, rgba(110,18,40,.78) 100%); }
.hero__hearts { position: absolute; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; }
.heart { position: absolute; top: -8%; left: var(--x); width: var(--s); height: var(--s); opacity: 0; color: var(--c);
  animation: fall var(--t) linear var(--dl) infinite; }
.heart svg { width: 100%; height: 100%; display: block; fill: currentColor; animation: sway calc(var(--t) / 2) ease-in-out var(--dl) infinite alternate; }
@keyframes fall { 0% { transform: translate3d(0,-10vh,0); opacity: 0; } 8% { opacity: var(--o); } 92% { opacity: var(--o); } 100% { transform: translate3d(0,112vh,0); opacity: 0; } }
@keyframes sway { from { transform: translateX(-14px) rotate(-14deg); } to { transform: translateX(14px) rotate(14deg); } }

.hero__orn { position: absolute; top: 14%; height: 62%; width: auto; aspect-ratio: 120/400; opacity: .55; pointer-events: none; z-index: 0; }
.hero__orn--l { left: clamp(0px, 2vw, 40px); } .hero__orn--r { right: clamp(0px, 2vw, 40px); transform: scaleX(-1); }

.hero__content { position: relative; z-index: 1; width: min(100%, 760px); padding: 12vh var(--gutter) 10vh; display: flex; flex-direction: column; align-items: center; gap: clamp(14px, 3vh, 28px);
  transform: translate3d(0, var(--cy, 0px), 0); }
.hero__lead { color: rgba(255,255,255,.85); letter-spacing: .4em; }
.hero__names { display: flex; flex-direction: column; align-items: center; line-height: 1; font-weight: 400; text-shadow: 0 2px 30px rgba(80,0,20,.45); }
.hero__names .script { color: #fff; font-size: clamp(3.6rem, 17vw, 7.5rem); }
.hero__amp { font-family: var(--font-serif); font-style: italic; color: var(--gold); font-size: clamp(1.4rem, 6vw, 2.4rem); margin: .1em 0; }
.hero__date { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.hero__date .eyebrow { color: rgba(255,255,255,.85); }
.hero__num { font-family: var(--font-serif); font-size: clamp(2rem, 9vw, 3.4rem); letter-spacing: .12em; }
.hero__num i { font-style: normal; color: var(--gold); margin-inline: .25em; }
.hero__guest { font-family: var(--font-serif); font-size: 1.2rem; color: #fff; }
.hero__guest strong { font-weight: 600; }

.hero__open { margin-top: clamp(8px, 3vh, 24px); padding: .9em 2.4em; border-radius: 999px; background: rgba(255,255,255,.08); backdrop-filter: blur(4px);
  border: 1px solid var(--gold); color: #fff; font-family: var(--font-serif); text-transform: uppercase; letter-spacing: .3em; font-size: .85rem;
  animation: breathe 4.5s ease-in-out infinite; transition: background .8s var(--ease), opacity 1s var(--ease), transform 1s var(--ease), max-height 1s var(--ease), margin .1s; max-height: 80px; }
.hero__open:hover, .hero__open:focus-visible { background: rgba(201,162,91,.25); outline: none; }
@keyframes breathe { 0%,100% { box-shadow: 0 0 0 0 rgba(201,162,91,.0); } 50% { box-shadow: 0 0 0 10px rgba(201,162,91,.16); } }

.hero__veil { position: absolute; inset: 0; z-index: 3; pointer-events: none; opacity: 0; clip-path: inset(0 50% 0 50%);
  background: radial-gradient(circle at 50% 50%, #ffe3e7, #f7c6ce 70%, #e0607e 140%); }
body.is-opening .hero__veil { animation: veil 2.4s var(--ease) forwards; }
@keyframes veil { 0% { opacity: 1; clip-path: inset(0 50% 0 50%); } 40% { opacity: 1; clip-path: inset(0 0 0 0); } 100% { opacity: 0; clip-path: inset(0 0 0 0); } }
body.is-open .hero__open { opacity: 0; transform: translateY(8px); max-height: 0; padding-block: 0; margin: 0; border-width: 0; pointer-events: none; animation: none; }
body.is-open .hero__lead { opacity: .0; transition: opacity 1.2s var(--ease); }

.hero__content > * { opacity: 0; transform: translateY(18px); animation: rise 1.6s var(--ease) forwards; }
.hero__content > :nth-child(1) { animation-delay: .3s; } .hero__content > :nth-child(2) { animation-delay: .7s; }
.hero__content > :nth-child(3) { animation-delay: 1.3s; } .hero__content > :nth-child(4) { animation-delay: 1.6s; } .hero__content > :nth-child(5) { animation-delay: 1.9s; }
@keyframes rise { to { opacity: 1; transform: none; } }
body.is-open .hero__lead { animation: none; opacity: 0; }
@media (max-width: 480px) { .hero__orn { opacity: .35; height: 50%; top: 10%; } }
@media (prefers-reduced-motion: reduce) { .hero__content > * { opacity: 1; transform: none; animation: none; } .hero__hearts { display: none; } .hero__open { animation: none; } }
```

- [ ] **Step 3: `js/hero.js`**

```js
const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.4 2.7 5 6 5c2 0 3.4 1.1 4 2.3h4C14.6 6.1 16 5 18 5c3.3 0 5.2 3.4 3.6 6.8C19.5 16.4 12 21 12 21z"/></svg>';
const COLORS = ["#F7C6CE", "#E0607E", "#F4A3B3", "#FFFFFF", "#C8304F"];
const rand = (a, b) => a + Math.random() * (b - a);

function spawnHearts(root, count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "heart";
    el.style.cssText = `--x:${rand(2, 96).toFixed(1)}%;--s:${rand(10, 22).toFixed(0)}px;--t:${rand(11, 19).toFixed(1)}s;--dl:${(-rand(0, 18)).toFixed(1)}s;--o:${rand(.35, .8).toFixed(2)};--c:${COLORS[i % COLORS.length]}`;
    el.innerHTML = HEART;
    root.append(el);
  }
}

function initParallax() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  const hero = document.getElementById("thiep-cuoi");
  const bg = document.getElementById("heroBg");
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY, h = hero.offsetHeight;
    if (y > h) return;
    bg.style.setProperty("--bgy", `${Math.min(40, y * 0.2).toFixed(1)}px`);
    document.getElementById("heroContent").style.setProperty("--cy", `${(-y * 0.08).toFixed(1)}px`);
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
}

export function initHero({ onOpen }) {
  const small = matchMedia("(max-width: 640px)").matches;
  spawnHearts(document.getElementById("hearts"), small ? 14 : 20);
  initParallax();
  const btn = document.getElementById("openBtn");
  let opened = false;
  btn.addEventListener("click", () => {
    if (opened) return; opened = true;
    const b = document.body;
    b.classList.add("is-opening");
    setTimeout(() => { b.classList.remove("is-locked"); b.classList.add("is-open"); onOpen?.(); }, 900); // veil phủ kín ở ~40% của 2.4s
    setTimeout(() => b.classList.remove("is-opening"), 2500);
  });
}
```


- [ ] **Step 4: `js/main.js`** — thêm:

```js
import { initHero } from "./hero.js";
initHero({ onOpen: () => document.dispatchEvent(new CustomEvent("invitation:open")) });
```

- [ ] **Step 5: Kiểm tra bằng mắt**

Run: server đang chạy; mở `http://localhost:8000/?to=Anh%20Nam`.
Expected: ảnh hoàng hôn full màn hình, tên lớn viết tay màu trắng, dấu & vàng, ngày số serif, "Thân mời **Anh Nam**", ~14–20 trái tim nhỏ rơi chậm, nút "Mở thiệp" viền vàng nhấp nhô; cuộn bị khoá. Bấm nút: màn hồng quét ra rồi tan trong ~2.4s, nút biến mất, cuộn mở khoá. Thử `?to=<img src=x onerror=alert(1)>`: hiện như chữ, không có alert. Nếu có chromium: `chromium --headless --screenshot=/tmp/h.png --window-size=390,844 http://localhost:8000` để chụp.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: hero cover with falling hearts, parallax and open animation"
```

---

### Task 4: Thiệp cưới (lời mời, cô dâu chú rể, đếm ngược) + Thông tin lễ cưới + hiện dần

**Files:**
- Create: `css/sections.css`, `js/reveal.js`, `js/countdown.js`, `js/calendar.js`
- Modify: `js/render.js`, `js/main.js`

**Interfaces:**
- Consumes: `countdownParts`, `monthGrid`, `buildIcs` (Task 2); `h`, `sectionHead`, `setText`, `renderers` (Task 1).
- Produces: `initReveal()`, `initCountdown(targetIso)`, `initCalendar(CONFIG)`.

- [ ] **Step 1: `js/reveal.js`**

```js
export function initReveal(root = document) {
  const items = root.querySelectorAll(".reveal:not(.is-in)");
  if (!("IntersectionObserver" in window)) { items.forEach((e) => e.classList.add("is-in")); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  items.forEach((e) => io.observe(e));
}
```

- [ ] **Step 2: Renderers** — thêm vào `js/render.js`:

```js
renderers.push((C) => {
  const inv = document.getElementById("invitation");
  inv.replaceChildren(
    h("p", { class: "orn reveal" }, "❦"),
    h("h2", { class: "sec__title script reveal", style: "--d:.15s" }, C.invitation.heading),
    h("p", { class: "quote reveal", style: "--d:.3s" }, C.invitation.lines.map((l, i) => [i ? h("br") : null, l])),
    h("p", { class: "lead reveal", style: "--d:.45s" }, C.invitation.body),
  );

  const person = (p, d) => h("article", { class: "person reveal", style: `--d:${d}s` },
    h("div", { class: "arch" }, h("img", { src: p.photo, alt: p.fullName, loading: "lazy", decoding: "async" })),
    h("p", { class: "eyebrow" }, p.role),
    h("h3", { class: "script person__name" }, p.fullName),
    h("p", { class: "person__parents" }, p.parents.map((x, i) => [i ? h("br") : null, x])),
    h("p", { class: "person__bio" }, p.bio),
  );
  document.getElementById("couple").replaceChildren(
    h("div", { class: "couple-grid" }, person(C.couple.groom, 0), h("span", { class: "couple-heart reveal", "aria-hidden": "true" }, "♥"), person(C.couple.bride, .25)),
  );

  document.getElementById("countdown").replaceChildren(
    h("p", { class: "eyebrow reveal" }, "Đếm ngược đến ngày cưới"),
    h("div", { class: "cd reveal", id: "cd", style: "--d:.2s", "aria-live": "off" },
      ...["Ngày", "Giờ", "Phút", "Giây"].map((l, i) => h("div", { class: "cd__cell" }, h("b", { id: `cd${i}` }, "--"), h("span", {}, l)))),
    h("p", { class: "cd__done", id: "cdDone", hidden: true }, "Hôm nay là ngày vui của chúng mình ♥"),
  );

  const cer = C.ceremony;
  const d = new Date(cer.startIso);
  document.getElementById("le-cuoi").replaceChildren(
    ...sectionHead(cer.heading),
    h("p", { class: "eyebrow reveal" }, cer.title),
    h("div", { class: "cal reveal", id: "cal", style: "--d:.2s" }),
    h("ol", { class: "timeline reveal", style: "--d:.3s" }, cer.timeline.map((t) => h("li", {}, h("b", {}, t.time), h("span", {}, t.title)))),
    h("button", { class: "btn-soft reveal", id: "icsBtn", type: "button", style: "--d:.4s" }, "Thêm vào lịch"),
  );
});
```

- [ ] **Step 3: `js/countdown.js` và `js/calendar.js`**

```js
// js/countdown.js
import { countdownParts } from "./lib/date.js";
export function initCountdown(targetIso) {
  const cells = [0, 1, 2, 3].map((i) => document.getElementById(`cd${i}`));
  const box = document.getElementById("cd"), done = document.getElementById("cdDone");
  const pad = (n) => String(n).padStart(2, "0");
  let timer;
  const tick = () => {
    const p = countdownParts(targetIso);
    if (!p.valid || p.done) { box.hidden = true; done.hidden = false; if (!p.valid) done.hidden = true; clearInterval(timer); return; }
    [p.days, p.hours, p.minutes, p.seconds].forEach((v, i) => { cells[i].textContent = i === 0 ? String(v) : pad(v); });
  };
  tick(); timer = setInterval(tick, 1000);
}
```

```js
// js/calendar.js
import { monthGrid, buildIcs } from "./lib/date.js";
export function initCalendar(C) {
  const d = new Date(C.ceremony.startIso);
  // Lấy ngày theo múi giờ +07 để hiển thị đúng ở mọi máy
  const vn = new Date(d.getTime() + 7 * 3600000);
  const y = vn.getUTCFullYear(), m = vn.getUTCMonth() + 1, day = vn.getUTCDate();
  const el = document.getElementById("cal");
  const head = document.createElement("div"); head.className = "cal__head"; head.textContent = `Tháng ${m} · ${y}`;
  const grid = document.createElement("div"); grid.className = "cal__grid";
  ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].forEach((w) => { const s = document.createElement("span"); s.className = "cal__w"; s.textContent = w; grid.append(s); });
  monthGrid(y, m).flat().forEach((n) => {
    const s = document.createElement("span"); s.className = "cal__d" + (n === day ? " is-day" : "");
    s.textContent = n ?? ""; grid.append(s);
  });
  el.replaceChildren(head, grid);
  document.getElementById("icsBtn").addEventListener("click", () => {
    const ics = buildIcs({ title: C.title, startIso: C.ceremony.startIso, durationMin: C.ceremony.durationMin, location: C.ceremony.locationForCalendar, description: C.ceremony.title });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" })), download: "thiep-cuoi.ics" });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
}
```

- [ ] **Step 4: CSS nền cho các section** — bắt đầu `css/sections.css`:

```css
.sec { position: relative; z-index: 1; padding-block: clamp(72px, 14vh, 140px); text-align: center; min-height: 70svh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; }
.sec__title { font-size: clamp(2.4rem, 9vw, 3.8rem); line-height: 1.1; }
.rule { display: block; width: 90px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
.quote { font-family: var(--font-serif); font-style: italic; font-size: clamp(1.25rem, 4.6vw, 1.7rem); color: var(--wine); line-height: 1.6; }
.lead { max-width: 34em; color: var(--ink-soft); }
.btn-soft { padding: .8em 2em; border-radius: 999px; background: transparent; border: 1px solid var(--pink); color: var(--wine); font-family: var(--font-serif); text-transform: uppercase; letter-spacing: .22em; font-size: .8rem; transition: background .8s var(--ease), color .8s var(--ease); }
.btn-soft:hover, .btn-soft:focus-visible { background: var(--pink); color: #fff; outline: none; }
.sec::before { content: ""; position: absolute; inset: 0 -100vw; z-index: -1; background: var(--_bg, transparent); }
#le-cuoi, #album, #dia-chi, #qua-mung { --_bg: linear-gradient(180deg, transparent, rgba(247,198,206,.35) 18%, rgba(247,198,206,.35) 82%, transparent); }

/* cô dâu chú rể */
.couple-grid { display: grid; grid-template-columns: 1fr; gap: 28px; align-items: start; width: 100%; }
.couple-heart { display: none; }
.person { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.arch { width: min(70%, 260px); aspect-ratio: 3/4; border-radius: 999px 999px 18px 18px; overflow: hidden; box-shadow: 0 18px 50px -18px rgba(142,31,58,.45); margin-bottom: 14px; }
.arch img { width: 100%; height: 100%; object-fit: cover; }
.person__name { font-size: 2.3rem; line-height: 1.1; } .person__parents { font-size: .9rem; color: var(--ink-soft); } .person__bio { font-size: .92rem; font-style: italic; max-width: 22em; color: var(--ink-soft); }
@media (min-width: 720px) { .couple-grid { grid-template-columns: 1fr auto 1fr; } .couple-heart { display: block; align-self: center; color: var(--red); font-size: 1.6rem; } }

/* đếm ngược */
.cd { display: flex; gap: clamp(10px, 3vw, 26px); justify-content: center; }
.cd__cell { display: flex; flex-direction: column; align-items: center; min-width: 64px; padding: 14px 6px; border-radius: 40px 40px 14px 14px; background: rgba(255,255,255,.7); border: 1px solid rgba(201,162,91,.5); }
.cd__cell b { font-family: var(--font-serif); font-size: clamp(1.8rem, 8vw, 2.8rem); font-weight: 500; color: var(--red); line-height: 1.1; }
.cd__cell span { font-size: .7rem; text-transform: uppercase; letter-spacing: .2em; color: var(--ink-soft); }
.cd__done { font-family: var(--font-serif); font-size: 1.5rem; color: var(--wine); }

/* lịch + timeline */
.cal { width: min(100%, 340px); }
.cal__head { font-family: var(--font-serif); font-size: 1.3rem; letter-spacing: .2em; text-transform: uppercase; color: var(--wine); margin-bottom: 10px; }
.cal__grid { display: grid; grid-template-columns: repeat(7, 1fr); row-gap: 6px; }
.cal__w { font-size: .7rem; color: var(--ink-soft); letter-spacing: .1em; } .cal__d { position: relative; height: 38px; display: grid; place-items: center; font-family: var(--font-serif); font-size: 1.05rem; }
.cal__d.is-day { color: #fff; z-index: 0; font-weight: 600; }
.cal__d.is-day::before { content: "♥"; position: absolute; inset: 0; z-index: -1; display: grid; place-items: center; font-size: 2.6rem; color: var(--red); animation: pulse 3.6s ease-in-out infinite; }
@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
.timeline { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.timeline li { display: flex; gap: 18px; justify-content: center; align-items: baseline; font-family: var(--font-serif); font-size: 1.15rem; }
.timeline b { color: var(--red); font-weight: 600; letter-spacing: .08em; min-width: 3.4em; text-align: right; }
.timeline span { min-width: 9em; text-align: left; }
```

- [ ] **Step 5: `js/main.js`** — thêm sau `renderAll`:

```js
import { initReveal } from "./reveal.js";
import { initCountdown } from "./countdown.js";
import { initCalendar } from "./calendar.js";
initCountdown(CONFIG.weddingDate);
initCalendar(CONFIG);
initReveal();
```

(Các `import` đặt đầu file; `initReveal` chạy sau mọi renderer; các task sau gọi lại `initReveal()` cho nội dung thêm động.)

- [ ] **Step 6: Kiểm tra**

Reload, bấm "Mở thiệp", cuộn. Expected: lời mời (❦, "Thiệp Mời" viết tay, câu trích nghiêng), hai khung ảnh vòm chú rể/cô dâu, đếm ngược 4 ô, lịch tháng 12/2026 với ngày 20 khoanh trái tim đập nhẹ, timeline 3 mốc, bấm "Thêm vào lịch" tải `thiep-cuoi.ics`. Nội dung hiện dần chậm khi cuộn tới. Đổi `weddingDate` thành quá khứ: hiện dòng "Hôm nay là ngày vui…", đổi thành `"abc"`: khối đếm ngược ẩn, không có NaN. Hoàn tác thay đổi thử.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: invitation, couple, countdown, ceremony info with calendar and ics"
```

---

### Task 5: Câu chuyện tình yêu (cây thời gian) + Album (slide tự động + Xem tất cả) + Lightbox

**Files:**
- Create: `css/timeline.css`, `css/album.css`, `js/timeline.js`, `js/slider.js`, `js/lightbox.js`, `js/gallery.js`
- Modify: `js/render.js`, `index.html` (thêm 2 link CSS), `js/main.js`

**Interfaces:**
- Consumes: `CONFIG.story.chapters[]` (`date`, `title`, `text`, `photo`, `photoAlt`; mọi trường tuỳ chọn), `CONFIG.album` (`sliderCount`, `intervalMs`, `viewAllLabel`, `photos[]`), `timelineProgress`, `nextIndex`, `clampPhotos` (Task 2), `renderers`, `h`, `sectionHead` (Task 1), `initReveal` (Task 4).
- Produces: `createLightbox({ onOpen, onClose }) -> { open(photos, index) }`; `initTimeline()`; `initSlider({ lightbox, config })`; `initGallery({ lightbox, config })`; sự kiện `modal:open` / `modal:close` trên `document` khi lightbox hoặc gallery mở/đóng; section rỗng được gắn thuộc tính `hidden`.

- [ ] **Step 1: Renderer** (thêm vào `js/render.js`; mảng rỗng thì ẩn section)

```js
renderers.push((C) => {
  const storyEl = document.getElementById("tinh-yeu"), chapters = C.story.chapters ?? [];
  storyEl.hidden = chapters.length === 0;
  if (chapters.length) storyEl.replaceChildren(
    ...sectionHead(C.story.heading),
    h("ol", { class: "tl", id: "tl" },
      h("span", { class: "tl__line", "aria-hidden": "true" }, h("span", { class: "tl__fill" })),
      ...chapters.map((c, i) => h("li", { class: `tl__item reveal${i % 2 ? " tl__item--alt" : ""}` },
        h("span", { class: "tl__dot", "aria-hidden": "true" }, "♥"),
        h("div", { class: "tl__card" },
          c.date ? h("p", { class: "script tl__date" }, c.date) : null,
          c.photo ? h("figure", { class: "tl__photo" }, h("img", { src: c.photo, alt: c.photoAlt || c.title || "", loading: "lazy", decoding: "async" })) : null,
          c.title ? h("h3", { class: "tl__title" }, c.title) : null,
          c.text ? h("p", { class: "tl__text" }, c.text) : null)))),
  );

  const A = C.album, photos = A.photos ?? [], albumEl = document.getElementById("album");
  albumEl.hidden = photos.length === 0;
  if (photos.length) {
    const slides = photos.slice(0, A.sliderCount ?? 10);
    albumEl.replaceChildren(
      ...sectionHead(A.heading),
      h("div", { class: "slider reveal", id: "slider", "aria-roledescription": "carousel", "aria-label": A.heading },
        h("div", { class: "slider__stage" },
          h("div", { class: "slider__track", id: "sliderTrack" }, slides.map((p, i) =>
            h("button", { class: "slide", type: "button", dataset: { index: i, src: p.src }, "aria-label": `Phóng to ảnh ${i + 1}: ${p.alt || ""}` },
              h("img", { alt: p.alt || "", decoding: "async", ...(i === 0 ? { src: p.src } : {}) })))),
          slides.length > 1 ? [h("button", { class: "slider__nav slider__nav--prev", type: "button", "aria-label": "Ảnh trước" }, "‹"), h("button", { class: "slider__nav slider__nav--next", type: "button", "aria-label": "Ảnh sau" }, "›")] : null),
        slides.length > 1 ? h("div", { class: "slider__dots", id: "sliderDots" }, slides.map((_, i) => h("button", { type: "button", "aria-label": `Tới ảnh ${i + 1}`, dataset: { to: i } }))) : null),
      h("button", { class: "btn-soft reveal", id: "viewAll", type: "button", style: "--d:.2s" }, A.viewAllLabel ?? "Xem tất cả"),
      h("div", { class: "gallery", id: "gallery", role: "dialog", "aria-modal": "true", "aria-label": A.heading },
        h("button", { class: "gallery__x", type: "button", "aria-label": "Đóng" }, "✕"),
        h("div", { class: "gallery__grid" }, photos.map((p, i) =>
          h("button", { class: "gallery__item", type: "button", dataset: { index: i }, "aria-label": `Xem ảnh ${i + 1}` }, h("img", { src: p.src, alt: p.alt || "", loading: "lazy", decoding: "async" }))))),
    );
  }
});
```

- [ ] **Step 2: `js/lightbox.js`** (nhận danh sách ảnh từ config, không đọc DOM)

```js
export function createLightbox({ onOpen, onClose } = {}) {
  const box = document.createElement("div");
  box.className = "lightbox"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Xem ảnh");
  box.innerHTML = '<button class="lb-close" type="button" aria-label="Đóng">✕</button><button class="lb-prev" type="button" aria-label="Ảnh trước">‹</button><img alt=""><button class="lb-next" type="button" aria-label="Ảnh sau">›</button>';
  document.body.append(box);
  const img = box.querySelector("img");
  let list = [], i = 0, startX = 0;
  const show = (n) => { if (!list.length) return; i = (n + list.length) % list.length; img.src = list[i].src; img.alt = list[i].alt || ""; };
  const isOpen = () => box.classList.contains("is-open");
  const close = () => { if (!isOpen()) return; box.classList.remove("is-open"); onClose?.(); };
  box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("lb-close")) close(); });
  box.querySelector(".lb-prev").addEventListener("click", () => show(i - 1));
  box.querySelector(".lb-next").addEventListener("click", () => show(i + 1));
  addEventListener("keydown", (e) => { if (!isOpen()) return; if (e.key === "Escape") { e.stopPropagation(); close(); } if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); }, true);
  box.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); }, { passive: true });
  return { open(photos, index = 0) { list = photos; show(index); box.classList.add("is-open"); onOpen?.(); }, isOpen };
}
```

- [ ] **Step 3: `js/slider.js`** (tự trượt, tạm dừng khi rê/chạm/tab ẩn/modal mở, chỉ nạp ảnh gần vị trí hiện tại)

```js
import { nextIndex } from "./lib/slider.js";

export function initSlider({ lightbox, config }) {
  const root = document.getElementById("slider"); if (!root) return;
  const track = document.getElementById("sliderTrack"), dots = [...root.querySelectorAll(".slider__dots button")];
  const slides = [...track.children], n = slides.length;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0, timer = 0, startX = 0; const holds = new Set();
  const load = (k) => { const s = slides[(k + n) % n], im = s.querySelector("img"); if (!im.getAttribute("src")) im.src = s.dataset.src; };
  const go = (k) => { i = nextIndex(i, n, k - i); track.style.transform = `translateX(${-i * 100}%)`; dots.forEach((d, j) => d.classList.toggle("is-on", j === i)); [i - 1, i, i + 1].forEach(load); };
  const stop = () => { clearInterval(timer); timer = 0; };
  const play = () => { if (reduce || n < 2 || holds.size || timer) return; timer = setInterval(() => go(i + 1), config.album.intervalMs ?? 4500); };
  const hold = (r) => { holds.add(r); stop(); }, release = (r) => { holds.delete(r); play(); };
  go(0);
  root.querySelector(".slider__nav--prev")?.addEventListener("click", () => { go(i - 1); stop(); play(); });
  root.querySelector(".slider__nav--next")?.addEventListener("click", () => { go(i + 1); stop(); play(); });
  dots.forEach((d) => d.addEventListener("click", () => { go(Number(d.dataset.to)); stop(); play(); }));
  slides.forEach((s) => s.addEventListener("click", () => lightbox.open(config.album.photos, Number(s.dataset.index))));
  root.addEventListener("mouseenter", () => hold("hover")); root.addEventListener("mouseleave", () => release("hover"));
  root.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; hold("touch"); }, { passive: true });
  root.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); release("touch"); }, { passive: true });
  document.addEventListener("visibilitychange", () => (document.hidden ? hold("hidden") : release("hidden")));
  document.addEventListener("modal:open", () => hold("modal")); document.addEventListener("modal:close", () => release("modal"));
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? release("offscreen") : hold("offscreen")), { threshold: 0.2 });
  holds.add("offscreen"); io.observe(root);
}
```

- [ ] **Step 4: `js/gallery.js`** và `js/timeline.js`

```js
// js/gallery.js
export function initGallery({ lightbox, config }) {
  const g = document.getElementById("gallery"), btn = document.getElementById("viewAll"); if (!g || !btn) return;
  const open = () => { g.classList.add("is-open"); document.body.classList.add("gallery-open"); document.dispatchEvent(new CustomEvent("modal:open")); g.querySelector(".gallery__x").focus(); };
  const close = () => { if (!g.classList.contains("is-open")) return; g.classList.remove("is-open"); document.body.classList.remove("gallery-open"); document.dispatchEvent(new CustomEvent("modal:close")); btn.focus(); };
  btn.addEventListener("click", open);
  g.addEventListener("click", (e) => {
    if (e.target.closest(".gallery__x")) return close();
    const it = e.target.closest(".gallery__item"); if (it) lightbox.open(config.album.photos, Number(it.dataset.index));
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.isOpen()) close(); });
}
```

```js
// js/timeline.js
import { timelineProgress } from "./lib/timeline.js";
export function initTimeline() {
  const tl = document.getElementById("tl"); if (!tl) return;
  let ticking = false;
  const update = () => { ticking = false; const r = tl.getBoundingClientRect(); tl.style.setProperty("--p", timelineProgress(r.top, r.height, innerHeight).toFixed(4)); };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); update();
}
```

- [ ] **Step 5: CSS** `css/timeline.css`

```css
.tl { position: relative; list-style: none; margin: 8px 0 0; padding: 0; width: 100%; --p: 0; display: flex; flex-direction: column; gap: clamp(40px, 8vh, 80px); text-align: left; }
.tl__line { position: absolute; left: 17px; top: 8px; bottom: 8px; width: 2px; background: color-mix(in srgb, var(--gold) 40%, transparent); border-radius: 2px; }
.tl__fill { position: absolute; inset: 0 0 auto 0; height: calc(var(--p) * 100%); background: linear-gradient(180deg, var(--pink), var(--red)); border-radius: 2px; }
.tl__item { position: relative; padding-left: 52px; }
.tl__dot { position: absolute; left: 0; top: 2px; width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: var(--bg); border: 1px solid var(--gold); color: var(--red); font-size: .9rem; box-shadow: 0 0 0 5px var(--bg); }
.tl__card { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.tl__date { font-size: 2rem; line-height: 1.1; }
.tl__photo { margin: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 24px 50px -26px color-mix(in srgb, var(--wine) 60%, transparent); align-self: flex-start; max-width: 100%; }
.tl__photo img { display: block; max-width: 100%; height: auto; }
.tl__title { font-family: var(--font-serif); font-size: 1.4rem; font-weight: 500; color: var(--wine); }
.tl__text { color: var(--ink-soft); white-space: pre-line; overflow-wrap: anywhere; }
@media (min-width: 760px) {
  .tl__line { left: 50%; margin-left: -1px; }
  .tl__item { padding: 0; width: 50%; padding-right: 54px; text-align: right; }
  .tl__item .tl__card { align-items: flex-end; } .tl__item .tl__photo { align-self: flex-end; }
  .tl__dot { left: auto; right: -18px; }
  .tl__item--alt { margin-left: 50%; padding-right: 0; padding-left: 54px; text-align: left; }
  .tl__item--alt .tl__card { align-items: flex-start; } .tl__item--alt .tl__photo { align-self: flex-start; }
  .tl__item--alt .tl__dot { right: auto; left: -18px; }
}
```

`css/album.css`

```css
.slider { width: 100%; }
.slider__stage { position: relative; overflow: hidden; border-radius: 18px; background: color-mix(in srgb, var(--pink-soft) 35%, var(--bg)); box-shadow: 0 30px 60px -36px color-mix(in srgb, var(--wine) 60%, transparent); }
.slider__track { display: flex; transition: transform 1.2s var(--ease); will-change: transform; }
.slide { flex: 0 0 100%; display: grid; place-items: center; height: min(70svh, 640px); padding: 0; border: 0; background: none; cursor: zoom-in; }
.slide img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; }
.slider__nav { position: absolute; top: 50%; translate: 0 -50%; z-index: 2; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--gold); background: color-mix(in srgb, var(--bg) 80%, transparent); color: var(--wine); font-size: 1.6rem; line-height: 1; padding: 0 0 4px; }
.slider__nav--prev { left: 10px; } .slider__nav--next { right: 10px; }
.slider__dots { display: flex; gap: 8px; justify-content: center; margin-top: 14px; flex-wrap: wrap; }
.slider__dots button { width: 8px; height: 8px; padding: 0; border-radius: 50%; border: 1px solid var(--pink); background: transparent; transition: background .8s var(--ease), transform .8s var(--ease); }
.slider__dots button.is-on { background: var(--red); border-color: var(--red); transform: scale(1.35); }

.gallery { position: fixed; inset: 0; z-index: 105; overflow-y: auto; background: var(--bg); padding: 64px clamp(12px, 3vw, 32px) 40px; opacity: 0; visibility: hidden; transition: opacity .8s var(--ease), visibility .8s; }
.gallery.is-open { opacity: 1; visibility: visible; } body.gallery-open { overflow: hidden; }
.gallery__x { position: fixed; top: 10px; right: 12px; z-index: 2; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--gold); background: var(--bg); color: var(--wine); font-size: 1.2rem; }
.gallery__grid { columns: 2; column-gap: 12px; max-width: 1100px; margin: 0 auto; }
.gallery__item { display: block; width: 100%; margin: 0 0 12px; padding: 0; border: 0; background: none; border-radius: 12px; overflow: hidden; break-inside: avoid; }
.gallery__item img { display: block; width: 100%; height: auto; }
@media (min-width: 720px) { .gallery__grid { columns: 3; column-gap: 16px; } .gallery__item { margin-bottom: 16px; } }
@media (min-width: 1100px) { .gallery__grid { columns: 4; } }
.lightbox { position: fixed; inset: 0; z-index: 120; display: grid; place-items: center; background: color-mix(in srgb, var(--wine) 92%, #000); opacity: 0; pointer-events: none; transition: opacity .8s var(--ease); }
.lightbox.is-open { opacity: 1; pointer-events: auto; }
.lightbox img { max-width: 92vw; max-height: 86vh; border-radius: 10px; object-fit: contain; }
.lightbox button { position: absolute; background: none; border: 0; color: #fff; font-size: 2rem; padding: 12px 18px; opacity: .8; }
.lightbox .lb-close { top: 8px; right: 8px; } .lightbox .lb-prev { left: 4px; top: 50%; } .lightbox .lb-next { right: 4px; top: 50%; }
```

- [ ] **Step 6: `js/main.js`** nối

```js
import { createLightbox } from "./lightbox.js";
import { initSlider } from "./slider.js";
import { initGallery } from "./gallery.js";
import { initTimeline } from "./timeline.js";
const lightbox = createLightbox({
  onOpen: () => document.dispatchEvent(new CustomEvent("modal:open")),
  onClose: () => document.dispatchEvent(new CustomEvent("modal:close")),
});
initSlider({ lightbox, config: CONFIG }); initGallery({ lightbox, config: CONFIG }); initTimeline();
```

- [ ] **Step 7: Kiểm tra**

Cây thời gian: desktop đường ở giữa, mốc xen kẽ; mobile đường sát trái; thêm một object vào `story.chapters` thì cây dài ra và các khối dưới bị đẩy xuống; mốc không ảnh/không chữ vẫn đẹp; đường tô đỏ hồng theo cuộn. Slide: tự trượt ~4.5s, rê chuột dừng, mũi tên/chấm/vuốt hoạt động, ảnh dọc và ngang đều hiện trọn không bị cắt; bấm ảnh mở lightbox; "Xem tất cả" mở lưới toàn bộ ảnh, bấm ảnh mở lightbox ở đúng ảnh, Esc đóng lightbox rồi đóng lưới. `album.photos = []` ẩn section. Ảnh trên trang không bị cắt: so `img.naturalWidth/naturalHeight` với kích thước hiển thị cùng tỉ lệ.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: love-story timeline, auto slider album with view-all gallery and lightbox"
```

### Task 6: Tiệc cưới + RSVP + Địa chỉ (2 bản đồ) + Cảm ơn

**Files:**
- Create: `js/rsvp.js`
- Modify: `js/render.js`, `css/sections.css`, `js/main.js`

**Interfaces:**
- Consumes: `CONFIG.banquet`, `CONFIG.venues.items[]`, `CONFIG.thanks`.
- Produces: `initRsvp(CONFIG)` — submit chỉ hiện lời cảm ơn, không gửi mạng, không lưu; dispatch `document` không cần.

- [ ] **Step 1: Renderer**

```js
renderers.push((C) => {
  const b = C.banquet;
  const field = (label, control) => h("label", { class: "field" }, h("span", {}, label), control);
  document.getElementById("tiec-cuoi").replaceChildren(
    ...sectionHead(b.heading),
    h("p", { class: "banquet__venue reveal" }, b.venueName),
    h("p", { class: "eyebrow reveal" }, b.time),
    h("p", { class: "lead reveal" }, b.note),
    b.dressCode ? h("p", { class: "banquet__dress reveal" }, "Trang phục: ", h("b", {}, b.dressCode)) : null,
    h("form", { class: "rsvp reveal", id: "rsvpForm", novalidate: true },
      h("h3", { class: "script" }, b.rsvp.heading),
      field("Họ và tên", h("input", { name: "name", type: "text", maxlength: "60", autocomplete: "name", required: true })),
      field("Số người đi cùng", h("input", { name: "count", type: "number", min: "1", max: "10", value: "1" })),
      h("div", { class: "rsvp__choice", role: "radiogroup", "aria-label": "Tham dự" },
        h("label", {}, h("input", { type: "radio", name: "att", value: "yes", checked: true }), h("span", {}, "Sẽ tham dự")),
        h("label", {}, h("input", { type: "radio", name: "att", value: "no" }), h("span", {}, "Rất tiếc không đến được"))),
      field("Lời nhắn", h("textarea", { name: "note", rows: "3", maxlength: "200" })),
      h("button", { class: "btn-soft", type: "submit" }, "Gửi xác nhận"),
      h("p", { class: "rsvp__thanks", id: "rsvpThanks", hidden: true, role: "status" }, b.rsvp.thanks),
    ),
    b.zalo ? h("a", { class: "btn-soft reveal", href: b.zalo, target: "_blank", rel: "noopener" }, "Nhắn Zalo xác nhận") : null,
  );

  document.getElementById("dia-chi").replaceChildren(
    ...sectionHead(C.venues.heading),
    h("div", { class: "venues" }, C.venues.items.map((v, i) =>
      h("article", { class: "venue reveal", style: `--d:${i * .2}s` },
        h("p", { class: "eyebrow" }, v.side),
        h("h3", { class: "script venue__name" }, v.name),
        h("p", { class: "venue__addr" }, v.address),
        h("p", { class: "venue__time" }, v.time),
        h("div", { class: "venue__map" }, h("iframe", { src: v.mapEmbed, loading: "lazy", referrerpolicy: "no-referrer-when-downgrade", title: `Bản đồ ${v.side}`, allowfullscreen: true })),
        h("a", { class: "btn-soft", href: v.mapLink, target: "_blank", rel: "noopener" }, "Chỉ đường")))),
  );

  document.getElementById("thanks").replaceChildren(
    h("p", { class: "orn reveal" }, "❦"),
    h("p", { class: "quote reveal", style: "--d:.2s" }, C.thanks.text),
    h("p", { class: "script thanks__sign reveal", style: "--d:.4s" }, C.thanks.sign),
  );
});
```

- [ ] **Step 2: `js/rsvp.js`**

```js
export function initRsvp() {
  const form = document.getElementById("rsvpForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    if (!name) { form.elements.name.focus(); form.elements.name.setAttribute("aria-invalid", "true"); return; }
    form.elements.name.removeAttribute("aria-invalid");
    form.querySelectorAll("input,textarea,button").forEach((el) => { el.disabled = true; });
    document.getElementById("rsvpThanks").hidden = false; // chỉ hiện lời cảm ơn, không lưu/gửi đi đâu
  });
}
```

- [ ] **Step 3: CSS** (thêm vào `css/sections.css`)

```css
.banquet__venue { font-family: var(--font-serif); font-size: clamp(1.6rem, 6vw, 2.2rem); color: var(--wine); font-weight: 500; }
.banquet__dress { color: var(--ink-soft); } .banquet__dress b { color: var(--red); font-weight: 500; }
.rsvp { width: min(100%, 440px); display: flex; flex-direction: column; gap: 14px; text-align: left; padding: 28px 24px; border-radius: 24px; background: rgba(255,255,255,.65); border: 1px solid rgba(201,162,91,.45); box-shadow: 0 30px 60px -40px rgba(142,31,58,.5); }
.rsvp h3 { text-align: center; font-size: 2.2rem; line-height: 1.1; }
.field { display: flex; flex-direction: column; gap: 4px; font-size: .8rem; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); }
.field input, .field textarea { font: inherit; font-size: 1rem; letter-spacing: 0; text-transform: none; color: var(--ink); padding: .7em .9em; border-radius: 12px; border: 1px solid rgba(224,96,126,.4); background: #fffdfc; }
.field input:focus, .field textarea:focus { outline: 2px solid var(--pink); outline-offset: 1px; }
.field input[aria-invalid="true"] { border-color: var(--red); }
.rsvp__choice { display: flex; flex-direction: column; gap: 6px; font-size: .95rem; } .rsvp__choice label { display: flex; gap: 10px; align-items: center; } .rsvp__choice input { accent-color: var(--red); }
.rsvp .btn-soft { align-self: center; } .rsvp .btn-soft:disabled { opacity: .5; }
.rsvp__thanks { text-align: center; color: var(--red); font-family: var(--font-serif); font-size: 1.2rem; }

.venues { display: grid; grid-template-columns: 1fr; gap: 40px; width: 100%; }
.venue { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.venue__name { font-size: 2.2rem; line-height: 1.1; } .venue__addr { max-width: 20em; } .venue__time { color: var(--ink-soft); font-size: .9rem; margin-bottom: 6px; }
.venue__map { width: 100%; aspect-ratio: 4/3; border-radius: 18px; overflow: hidden; border: 1px solid rgba(201,162,91,.5); box-shadow: 0 24px 50px -30px rgba(142,31,58,.5); margin-bottom: 10px; }
.venue__map iframe { width: 100%; height: 100%; border: 0; filter: saturate(.85) hue-rotate(-8deg); }
@media (min-width: 720px) { .venues { grid-template-columns: 1fr 1fr; gap: 28px; } }
.sec--thanks { min-height: 60svh; padding-bottom: 120px; } .thanks__sign { font-size: clamp(2.6rem, 10vw, 4rem); }
```

- [ ] **Step 4: `js/main.js`** — thêm `import { initRsvp } from "./rsvp.js"; initRsvp();` (trước `initReveal()`).

- [ ] **Step 5: Kiểm tra**

Expected: phần tiệc có tên nhà hàng, giờ, dress code, form RSVP: bỏ trống tên thì focus vào ô tên; điền tên rồi gửi thì form khoá và hiện lời cảm ơn; DevTools Network không có request nào khi gửi. Nút Zalo mở tab mới. Phần Địa chỉ có 2 thẻ Nhà Trai/Nhà Gái, mỗi thẻ một bản đồ nhúng và nút "Chỉ đường" (2 cột ≥720px, 1 cột mobile). Cuối trang là lời cảm ơn + chữ ký viết tay.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: banquet info with RSVP form, two venues with maps, thank-you footer"
```

---

### Task 7: Menu điều hướng + nút nhạc

**Files:**
- Create: `css/menu.css`, `js/menu.js`, `js/music.js`
- Modify: `js/main.js`

**Interfaces:**
- Consumes: `CONFIG.menu[]`, `CONFIG.music.src`, sự kiện `invitation:open` (Task 3).
- Produces: `initMenu(CONFIG, { onNavStart, onNavEnd })` — bấm mục thì cuộn mượt tới `#id`, gọi `onNavStart()` rồi `onNavEnd()` khi cuộn xong (scrollend hoặc timeout 1500ms); `initMusic(CONFIG) -> { play() }`.

- [ ] **Step 1: `js/menu.js`**

```js
export function initMenu(C, { onNavStart, onNavEnd } = {}) {
  const nav = document.getElementById("menu"), toggle = document.getElementById("menuToggle");
  const list = document.createElement("ul");
  C.menu.forEach((m, i) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${m.id}`; a.dataset.target = m.id; a.textContent = m.label; a.style.setProperty("--i", i);
    li.append(a); list.append(li);
  });
  const mono = document.createElement("div"); mono.className = "menu__mono script"; mono.textContent = "❦";
  nav.replaceChildren(mono, list);

  const isDesktop = () => matchMedia("(min-width: 1024px)").matches;
  const setOpen = (v) => { nav.classList.toggle("is-open", v); toggle.setAttribute("aria-expanded", String(v)); toggle.classList.toggle("is-x", v); document.body.classList.toggle("menu-open", v && !isDesktop()); };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => { if (e.target === nav && !isDesktop()) setOpen(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });

  list.addEventListener("click", (e) => {
    const a = e.target.closest("a"); if (!a) return;
    e.preventDefault();
    const target = document.getElementById(a.dataset.target); if (!target) return;
    setOpen(false);
    onNavStart?.();
    const y = target.getBoundingClientRect().top + scrollY - (a.dataset.target === "thiep-cuoi" ? 0 : 0);
    let done = false;
    const finish = () => { if (done) return; done = true; removeEventListener("scrollend", finish); onNavEnd?.(); };
    addEventListener("scrollend", finish, { once: true });
    setTimeout(finish, 1600);
    scrollTo({ top: Math.max(0, y), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });

  // scrollspy
  const links = [...list.querySelectorAll("a")];
  const secs = C.menu.map((m) => document.getElementById(m.id)).filter(Boolean);
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((l) => l.classList.toggle("is-active", l.dataset.target === e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach((s) => io.observe(s));

  return {
    show() { nav.hidden = false; toggle.hidden = false; requestAnimationFrame(() => document.body.classList.add("menu-on")); },
  };
}
```

Lưu ý: `#le-cuoi`… đã có `data-section` và `id`; `#thiep-cuoi` là hero. Mục "Thiệp cưới" quan sát hero (chiếm đầu trang); invitation/couple/countdown cũng nằm trong mục này nên scrollspy giữ mục cuối cùng được active cho tới khi section kế tiếp vào vùng giữa (đúng hành vi mong muốn).

- [ ] **Step 2: `js/music.js`**

```js
export function initMusic(C) {
  const btn = document.getElementById("musicBtn");
  if (!C.music?.src) return { play() {}, show() {} };
  const audio = new Audio(C.music.src); audio.loop = true; audio.preload = "none";
  const sync = () => btn.classList.toggle("is-on", !audio.paused);
  btn.addEventListener("click", () => { audio.paused ? audio.play().catch(() => {}) : audio.pause(); });
  audio.addEventListener("play", sync); audio.addEventListener("pause", sync);
  return { play() { audio.play().catch(() => {}); }, show() { btn.hidden = false; } };
}
```

- [ ] **Step 3: `css/menu.css`**

```css
.menu, .menu-toggle, .music { opacity: 0; transition: opacity 1.4s var(--ease), transform 1.4s var(--ease); }
body.menu-on .menu, body.menu-on .menu-toggle, body.menu-on .music { opacity: 1; }
.menu ul { list-style: none; margin: 0; padding: 0; }
.menu a { display: block; text-decoration: none; color: var(--ink-soft); font-family: var(--font-serif); text-transform: uppercase; letter-spacing: .22em; font-size: .78rem; transition: color .8s var(--ease), opacity .8s var(--ease); }
.menu a.is-active { color: var(--red); }

/* mobile: overlay */
.menu { position: fixed; inset: 0; z-index: 60; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; background: rgba(255,246,245,.94); backdrop-filter: blur(8px);
  pointer-events: none; visibility: hidden; transition: opacity 1s var(--ease), visibility 1s; }
.menu.is-open { opacity: 1 !important; visibility: visible; pointer-events: auto; }
.menu__mono { font-size: 3rem; color: var(--gold); }
.menu ul { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.menu a { padding: .55em 1em; font-size: 1.05rem; opacity: 0; transform: translateY(10px); }
.menu.is-open a { opacity: 1; transform: none; transition: opacity 1s var(--ease) calc(var(--i) * .08s + .2s), transform 1s var(--ease) calc(var(--i) * .08s + .2s), color .8s; }
.menu-toggle { position: fixed; top: max(14px, env(safe-area-inset-top)); left: 14px; z-index: 70; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(201,162,91,.7); background: rgba(255,246,245,.75); backdrop-filter: blur(6px); display: grid; place-content: center; gap: 6px; padding: 0; }
.menu-toggle span { display: block; width: 18px; height: 1px; background: var(--wine); transition: transform .8s var(--ease); }
.menu-toggle.is-x span:first-child { transform: translateY(3.5px) rotate(45deg); } .menu-toggle.is-x span:last-child { transform: translateY(-3.5px) rotate(-45deg); }
.music { position: fixed; top: max(14px, env(safe-area-inset-top)); right: 14px; z-index: 70; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(201,162,91,.7); background: rgba(255,246,245,.75); backdrop-filter: blur(6px); color: var(--wine); font-size: 1.1rem; padding: 0; }
.music.is-on { animation: spin 9s linear infinite; background: var(--pink-soft); } @keyframes spin { to { transform: rotate(360deg); } }
body.menu-open { overflow: hidden; }

/* desktop: sidebar dọc cố định bên trái, luôn hiện */
@media (min-width: 1024px) {
  .menu-toggle { display: none; }
  .menu { position: fixed; inset: 0 auto 0 0; width: 230px; z-index: 50; align-items: flex-start; justify-content: center; gap: 18px; padding: 0 0 0 clamp(24px, 3vw, 48px);
    background: linear-gradient(90deg, rgba(255,246,245,.85), rgba(255,246,245,0)); backdrop-filter: none; visibility: visible; pointer-events: auto; opacity: 0; }
  body.menu-on .menu { opacity: 1; }
  .menu ul { align-items: flex-start; gap: 4px; }
  .menu a { position: relative; padding: .6em 0 .6em 26px; font-size: .74rem; opacity: .75; transform: none; }
  .menu a::before { content: ""; position: absolute; left: 0; top: 50%; width: 7px; height: 7px; margin-top: -3.5px; border-radius: 50%; border: 1px solid var(--gold); transition: background .8s var(--ease), transform .8s var(--ease); }
  .menu a::after { content: ""; position: absolute; left: 9px; top: 50%; width: 0; height: 1px; background: var(--gold); transition: width .9s var(--ease); }
  .menu a:hover { opacity: 1; } .menu a.is-active { opacity: 1; padding-left: 40px; } .menu a.is-active::before { background: var(--red); border-color: var(--red); transform: scale(1.3); } .menu a.is-active::after { width: 22px; left: 12px; }
  .menu__mono { font-size: 2.2rem; }
}
```

- [ ] **Step 4: `js/main.js`** — nối menu, nhạc, sự kiện:

```js
import { initMenu } from "./menu.js";
import { initMusic } from "./music.js";
const menu = initMenu(CONFIG, {
  onNavStart: () => document.dispatchEvent(new CustomEvent("nav:start")),
  onNavEnd: () => document.dispatchEvent(new CustomEvent("nav:end")),
});
const music = initMusic(CONFIG);
document.addEventListener("invitation:open", () => { menu.show(); music.show?.(); music.play(); });
```

- [ ] **Step 5: Kiểm tra**

Expected: trước khi mở thiệp không thấy menu/nút. Sau khi mở: ≥1024px sidebar dọc trái luôn hiện (kể cả ở cuối trang), mục đang xem đổi màu đỏ kèm đường vàng; nội dung 900px vẫn ở giữa không bị che (đo ở 1280px: cột 900px căn giữa, sidebar 230px không chồng vào). Dưới 1024px: chỉ có nút tròn ở góc trái, bấm mở lớp phủ kem hồng, các mục hiện dần, bấm mục thì đóng và cuộn mượt; Esc đóng. Nút nhạc ẩn khi `music.src` rỗng.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: sidebar menu on desktop, overlay menu on mobile, scrollspy, music button"
```

---

### Task 8: Tự cuộn trang

**Files:**
- Create: `js/autoscroll.js`
- Modify: `js/main.js`, `css/menu.css` (chỉ báo ⏸/▶)

**Interfaces:**
- Consumes: `createAutoScrollState` (Task 2); `CONFIG.autoScroll.pxPerSecond`; sự kiện `invitation:open`, `modal:open/close` (Task 5, 9), `nav:start/end` (Task 7).
- Produces: `initAutoScroll(CONFIG) -> { start(), hold(reason), release(reason) }`.

- [ ] **Step 1: `js/autoscroll.js`**

```js
import { createAutoScrollState } from "./lib/autoscroll-state.js";

const INTERACTIVE = "a,button,input,textarea,select,label,summary,dialog,iframe,[data-no-toggle],.menu,.menu-toggle,.lightbox,.gift-modal,.rsvp,.venue__map";

export function initAutoScroll(C) {
  const state = createAutoScrollState();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const indicator = document.createElement("div");
  indicator.className = "as-indicator"; indicator.setAttribute("aria-hidden", "true"); document.body.append(indicator);

  let raf = 0, last = 0, pos = 0, lastSet = 0, started = false, flash;
  const speed = () => C.autoScroll.pxPerSecond;
  const maxY = () => document.documentElement.scrollHeight - innerHeight;

  const frame = (t) => {
    raf = 0;
    if (!state.isRunning()) { last = 0; return; }
    if (!last) { last = t; pos = scrollY; lastSet = pos; }
    const dt = Math.min(0.1, (t - last) / 1000); last = t;
    if (Math.abs(scrollY - lastSet) > 2) pos = scrollY; // người dùng vừa cuộn tay: bám theo vị trí mới
    pos = Math.min(maxY(), pos + speed() * dt);
    lastSet = pos; scrollTo(0, pos);
    if (pos >= maxY() - 1) { state.setEnabled(false); return; } // tới cuối trang thì dừng hẳn
    raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf && state.isRunning()) { last = 0; raf = requestAnimationFrame(frame); } };

  const show = (txt) => { indicator.textContent = txt; indicator.classList.add("is-on"); clearTimeout(flash); flash = setTimeout(() => indicator.classList.remove("is-on"), 1100); };

  document.addEventListener("click", (e) => {
    if (!started || e.target.closest(INTERACTIVE)) return;
    if (window.getSelection()?.toString()) return;
    state.toggleUser(); show(state.userPaused() ? "⏸" : "▶"); kick();
  });
  document.addEventListener("focusin", (e) => { if (e.target.matches("input,textarea")) state.hold("typing"); });
  document.addEventListener("focusout", (e) => { if (e.target.matches("input,textarea")) { state.release("typing"); kick(); } });
  document.addEventListener("visibilitychange", () => { document.hidden ? state.hold("hidden") : (state.release("hidden"), kick()); });
  document.addEventListener("modal:open", () => state.hold("modal"));
  document.addEventListener("modal:close", () => { state.release("modal"); kick(); });
  document.addEventListener("nav:start", () => state.hold("nav"));
  document.addEventListener("nav:end", () => { state.release("nav"); kick(); });

  return {
    start() { if (reduce) return; started = true; state.setEnabled(true); kick(); },
    hold: (r) => state.hold(r), release: (r) => { state.release(r); kick(); },
  };
}
```

- [ ] **Step 2: CSS chỉ báo** (thêm vào `css/menu.css`)

```css
.as-indicator { position: fixed; left: 50%; top: 50%; z-index: 80; width: 72px; height: 72px; margin: -36px 0 0 -36px; display: grid; place-items: center; border-radius: 50%; background: rgba(142,31,58,.55); color: #fff; font-size: 1.6rem; opacity: 0; transform: scale(.85); pointer-events: none; transition: opacity .8s var(--ease), transform .8s var(--ease); }
.as-indicator.is-on { opacity: 1; transform: none; }
```

- [ ] **Step 3: `js/main.js`** — nối:

```js
import { initAutoScroll } from "./autoscroll.js";
const auto = initAutoScroll(CONFIG);
document.addEventListener("invitation:open", () => setTimeout(() => auto.start(), 1200)); // chờ hero "thở" xong rồi mới cuộn
```

- [ ] **Step 4: Kiểm tra**

Expected: sau khi mở thiệp ~1.2s trang tự cuộn chậm (~35px/s). Bấm vùng trống: hiện ⏸ rồi tắt, cuộn dừng; bấm lại ▶ chạy tiếp. Cuộn chuột/vuốt tay: trang đi theo tay, thả ra tiếp tục cuộn từ vị trí mới, không giật ngược. Bấm menu: cuộn mượt tới mục rồi tự cuộn tiếp. Mở lightbox: dừng, đóng: chạy tiếp (nếu trước đó đang chạy); nếu đã bấm dừng thì vẫn dừng. Click vào ô input: dừng; blur: chạy tiếp. Tới cuối trang: dừng. Đo: `window.scrollY` tăng ~35 sau 1 giây.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: slow auto-scroll with tap to pause/resume and interaction holds"
```

---

### Task 9: Hộp quà mừng + popup QR

**Files:**
- Create: `css/gift.css`, `js/gift.js`
- Modify: `js/render.js`, `js/main.js`

**Interfaces:**
- Consumes: `CONFIG.gift`, sự kiện `modal:open/close`.
- Produces: `initGift(CONFIG)` — hộp quà (`.gift`) bấm mở `.gift-modal`; Esc/✕/nền đóng; nút "Sao chép STK", "Lưu QR".

- [ ] **Step 1: Renderer** — thêm vào `js/render.js`. Hộp quà vẽ bằng SVG (thân, nắp, nơ) và 4 hộp nhỏ:

```js
const GIFT_SVG = (w) => `<svg viewBox="0 0 120 120" width="${w}" aria-hidden="true">
  <rect x="14" y="52" width="92" height="60" rx="6" fill="#C8304F"/><rect x="54" y="52" width="12" height="60" fill="#C9A25B"/>
  <rect x="8" y="38" width="104" height="22" rx="6" fill="#E0607E"/><rect x="54" y="38" width="12" height="22" fill="#C9A25B"/>
  <path d="M60 38 C 40 10, 14 22, 34 38 Z" fill="#F7C6CE" stroke="#C9A25B" stroke-width="2"/><path d="M60 38 C 80 10, 106 22, 86 38 Z" fill="#F7C6CE" stroke="#C9A25B" stroke-width="2"/>
  <circle cx="60" cy="38" r="6" fill="#C9A25B"/></svg>`;

renderers.push((C) => {
  const g = C.gift;
  const mini = [ { l: "4%", t: "34%", r: "-22deg", w: 34 }, { l: "78%", t: "26%", r: "20deg", w: 38 }, { l: "8%", t: "62%", r: "-16deg", w: 26 }, { l: "82%", t: "60%", r: "14deg", w: 30 } ];
  const confetti = ["#E0607E", "#C9A25B", "#F7C6CE", "#C8304F", "#fff", "#8E1F3A"];
  const box = h("button", { class: "gift", id: "giftBtn", type: "button", "aria-label": "Mở hộp quà mừng" },
    h("span", { class: "gift__star s1", "aria-hidden": "true" }, "✦"), h("span", { class: "gift__star s2", "aria-hidden": "true" }, "✦"), h("span", { class: "gift__star s3", "aria-hidden": "true" }, "✦"),
    h("span", { class: "gift__confetti", "aria-hidden": "true" }, confetti.map((c, i) => h("i", { style: `--c:${c};--a:${i * 60 - 150}deg;--dx:${(i - 2.5) * 26}px;--dl:${i * .05}s` }))),
    h("span", { class: "gift__bob" },
      ...mini.map((m, i) => { const s = h("span", { class: `gift__mini m${i + 1}`, "aria-hidden": "true", style: `left:${m.l};top:${m.t};--r:${m.r}` }); s.innerHTML = GIFT_SVG(m.w); return s; }),
      (() => { const s = h("span", { class: "gift__main", "aria-hidden": "true" }); s.innerHTML = GIFT_SVG(170); return s; })(),
      h("span", { class: "gift__shadow", "aria-hidden": "true" })),
    h("span", { class: "gift__hint" }, g.hint));

  const card = (p) => h("div", { class: "qr" },
    h("h3", { class: "qr__role" }, p.role),
    h("div", { class: "qr__img" }, h("img", { src: p.qr, alt: `QR ${p.role}` })),
    h("p", { class: "qr__bank" }, p.bank), h("p", { class: "qr__acc" }, p.account), h("p", { class: "qr__name" }, p.name),
    h("div", { class: "qr__btns" },
      h("button", { class: "btn-soft", type: "button", dataset: { copy: p.account } }, "Sao chép STK"),
      h("a", { class: "btn-soft", href: p.qr, download: `qr-${p.role.toLowerCase().replace(/\s+/g, "-")}` }, "Lưu QR")));

  document.getElementById("qua-mung").replaceChildren(
    ...sectionHead(g.heading),
    h("div", { class: "reveal", style: "--d:.2s" }, box),
    h("div", { class: "gift-modal", id: "giftModal", role: "dialog", "aria-modal": "true", "aria-label": g.heading },
      h("div", { class: "gift-modal__card" },
        h("button", { class: "gift-modal__x", type: "button", "aria-label": "Đóng" }, "✕"),
        h("p", { class: "script gift-modal__title" }, "Hộp quà yêu thương"),
        h("div", { class: "gift-modal__grid" }, g.people.map(card)))),
  );
});
```

- [ ] **Step 2: `css/gift.css`**

```css
.gift { position: relative; width: 260px; height: 290px; padding: 0; border: 0; background: none; outline: none; }
.gift__bob { position: absolute; left: 50%; bottom: 34px; width: 200px; height: 200px; margin-left: -100px; animation: bob 3.6s ease-in-out infinite; }
.gift__main { position: absolute; left: 50%; bottom: 0; margin-left: -85px; filter: drop-shadow(0 10px 16px rgba(142,31,58,.3)); z-index: 2; }
.gift__shadow { position: absolute; left: 50%; bottom: -16px; width: 130px; height: 12px; margin-left: -65px; border-radius: 50%; background: rgba(142,31,58,.35); filter: blur(5px); animation: shadow 3.6s ease-in-out infinite; }
@keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes shadow { 0%,100% { transform: scale(1); opacity: .6; } 50% { transform: scale(.82); opacity: .35; } }
.gift__mini { position: absolute; z-index: 1; opacity: 0; transform: translateY(40px) rotate(var(--r)) scale(.6); transition: opacity 1.2s var(--ease), transform 1.6s var(--ease); pointer-events: none; }
.gift:hover .gift__mini, .gift:focus-visible .gift__mini, .gift.is-hot .gift__mini { opacity: 1; transform: translateY(-26px) rotate(var(--r)) scale(1); }
.gift:hover .gift__mini.m2, .gift.is-hot .gift__mini.m2 { transition-delay: .15s; } .gift:hover .gift__mini.m3, .gift.is-hot .gift__mini.m3 { transition-delay: .3s; } .gift:hover .gift__mini.m4, .gift.is-hot .gift__mini.m4 { transition-delay: .45s; }
.gift__star { position: absolute; color: var(--gold); z-index: 3; animation: twinkle 3.2s ease-in-out infinite; } .s1 { top: 8%; left: 14%; font-size: 22px; } .s2 { top: 18%; right: 10%; font-size: 16px; animation-delay: 1s; } .s3 { top: 34%; left: 5%; font-size: 14px; animation-delay: 2s; }
@keyframes twinkle { 0%,100% { opacity: .3; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.15); } }
.gift__hint { position: absolute; left: 0; right: 0; bottom: 0; font-size: .75rem; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-soft); }
.gift__confetti { position: absolute; left: 50%; top: 40%; z-index: 4; pointer-events: none; }
.gift__confetti i { position: absolute; width: 7px; height: 11px; background: var(--c); border-radius: 2px; opacity: 0; }
.gift:hover .gift__confetti i, .gift.is-hot .gift__confetti i { animation: burst 2.6s var(--ease) var(--dl) 1; }
@keyframes burst { 0% { opacity: 0; transform: translate(0,0) rotate(0); } 15% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx), -90px) rotate(var(--a)); } }

.gift-modal { position: fixed; inset: 0; z-index: 110; display: grid; place-items: end center; background: rgba(60,8,22,.6); opacity: 0; visibility: hidden; transition: opacity .8s var(--ease), visibility .8s; }
.gift-modal.is-open { opacity: 1; visibility: visible; }
.gift-modal__card { position: relative; width: min(100%, 560px); max-height: 92svh; overflow-y: auto; padding: 34px 20px 28px; background: var(--bg); border-radius: 28px 28px 0 0; border-top: 3px solid var(--gold); transform: translateY(30px); transition: transform 1s var(--ease); }
.gift-modal.is-open .gift-modal__card { transform: none; }
.gift-modal__x { position: absolute; top: 10px; right: 12px; border: 0; background: none; font-size: 1.3rem; color: var(--wine); padding: 8px; }
.gift-modal__title { text-align: center; font-size: 2.3rem; line-height: 1.1; margin-bottom: 18px; }
.gift-modal__grid { display: grid; grid-template-columns: 1fr; gap: 26px; }
.qr { display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
.qr__role { font-family: var(--font-serif); text-transform: uppercase; letter-spacing: .25em; font-size: .85rem; color: var(--red); font-weight: 600; margin-bottom: 6px; }
.qr__img { width: 168px; height: 168px; padding: 8px; background: #fff; border-radius: 16px; border: 2px solid rgba(201,162,91,.6); box-shadow: 0 14px 34px -18px rgba(142,31,58,.5); }
.qr__img img { width: 100%; height: 100%; object-fit: contain; } .qr__bank { font-size: .85rem; color: var(--ink-soft); margin-top: 8px; } .qr__acc { font-family: var(--font-serif); font-size: 1.3rem; letter-spacing: .1em; } .qr__name { font-size: .8rem; font-weight: 500; }
.qr__btns { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 8px; } .qr__btns .btn-soft { padding: .55em 1.1em; font-size: .7rem; text-decoration: none; }
@media (min-width: 720px) { .gift-modal { place-items: center; } .gift-modal__card { border-radius: 28px; } .gift-modal__grid { grid-template-columns: 1fr 1fr; } }
@media (prefers-reduced-motion: reduce) { .gift__bob, .gift__shadow, .gift__star { animation: none; } }
```

- [ ] **Step 3: `js/gift.js`**

```js
export function initGift() {
  const btn = document.getElementById("giftBtn"), modal = document.getElementById("giftModal");
  if (!btn || !modal) return;
  const open = () => { modal.classList.add("is-open"); document.dispatchEvent(new CustomEvent("modal:open")); modal.querySelector(".gift-modal__x").focus(); };
  const close = () => { if (!modal.classList.contains("is-open")) return; modal.classList.remove("is-open"); document.dispatchEvent(new CustomEvent("modal:close")); btn.focus(); };
  btn.addEventListener("click", open);
  btn.addEventListener("touchstart", () => { btn.classList.add("is-hot"); setTimeout(() => btn.classList.remove("is-hot"), 2800); }, { passive: true });
  modal.addEventListener("click", (e) => { if (e.target === modal || e.target.closest(".gift-modal__x")) close(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  modal.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    const txt = b.dataset.copy, old = b.textContent;
    try { await navigator.clipboard.writeText(txt); b.textContent = "Đã sao chép ✓"; }
    catch { const t = document.createElement("textarea"); t.value = txt; document.body.append(t); t.select(); try { document.execCommand("copy"); b.textContent = "Đã sao chép ✓"; } catch { b.textContent = txt; } t.remove(); }
    setTimeout(() => { b.textContent = old; }, 1800);
  });
}
```

- [ ] **Step 4: `js/main.js`** — `import { initGift } from "./gift.js"; initGift();`

- [ ] **Step 5: Kiểm tra**

Expected: hộp quà đỏ hồng nhún nhẹ, bóng co giãn, 3 ngôi sao vàng nhấp nháy. Rê chuột: 4 hộp nhỏ bay lên lần lượt và confetti bắn nhẹ; chạm trên mobile cũng bật. Bấm hộp: popup (bottom-sheet ở mobile, giữa màn hình ở ≥720px) có QR chú rể + cô dâu, "Sao chép STK" đổi chữ thành "Đã sao chép ✓", "Lưu QR" tải file; đóng bằng ✕/nền/Esc. Khi popup mở, tự cuộn dừng; đóng thì chạy tiếp.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: gift box with floating mini gifts and QR modal"
```

---

### Task 10: Sổ lưu bút với Firebase Firestore

**Files:**
- Create: `js/guestbook.js`, `firestore.rules`
- Modify: `js/render.js`, `css/sections.css`, `js/main.js`

**Interfaces:**
- Consumes: `CONFIG.guestbook`, `CONFIG.firebase`, `validateEntry`, `cooldownRemaining` (Task 2).
- Produces: `initGuestbook(CONFIG)`; `isFirebaseConfigured(cfg) -> boolean` export để test; Firestore doc `{ name, message, createdAt }` trong collection `guestbook`.

- [ ] **Step 1: `firestore.rules`**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /guestbook/{id} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasOnly(['name', 'message', 'createdAt'])
        && request.resource.data.name is string
        && request.resource.data.name.size() > 0 && request.resource.data.name.size() <= 50
        && request.resource.data.message is string
        && request.resource.data.message.size() > 0 && request.resource.data.message.size() <= 300
        && request.resource.data.createdAt == request.time;
      allow update, delete: if false;
    }
    match /{document=**} { allow read, write: if false; }
  }
}
```

- [ ] **Step 2: Test nhỏ cho `isFirebaseConfigured`** `tests/guestbook-config.test.js`

```js
import test from "node:test";
import assert from "node:assert/strict";
import { isFirebaseConfigured } from "../js/lib/text.js";

test("isFirebaseConfigured cần apiKey và projectId", () => {
  assert.equal(isFirebaseConfigured({ apiKey: "", projectId: "p" }), false);
  assert.equal(isFirebaseConfigured({ apiKey: "k", projectId: "" }), false);
  assert.equal(isFirebaseConfigured({ apiKey: "k", projectId: "p" }), true);
  assert.equal(isFirebaseConfigured(undefined), false);
});
```

Run: `node --test tests/guestbook-config.test.js` → FAIL. Thêm vào `js/lib/text.js`:

```js
export function isFirebaseConfigured(cfg) { return !!(cfg && cfg.apiKey && cfg.projectId); }
```

Run lại → PASS.

- [ ] **Step 3: Renderer** (thêm vào `js/render.js`)

```js
renderers.push((C) => {
  const g = C.guestbook;
  document.getElementById("so-luu-but").replaceChildren(
    ...sectionHead(g.heading),
    h("form", { class: "gb-form reveal", id: "gbForm", novalidate: true },
      h("label", { class: "field" }, h("span", {}, "Tên của bạn"), h("input", { name: "name", maxlength: String(g.maxName), autocomplete: "name" })),
      h("label", { class: "field" }, h("span", {}, "Lời chúc"), h("textarea", { name: "message", rows: "4", maxlength: String(g.maxMessage) })),
      h("p", { class: "gb-count", id: "gbCount" }, `0/${g.maxMessage}`),
      h("p", { class: "gb-msg", id: "gbMsg", role: "status" }),
      h("button", { class: "btn-soft", type: "submit", id: "gbSubmit" }, "Gửi lời chúc")),
    h("ul", { class: "gb-list", id: "gbList" }),
    h("button", { class: "btn-soft", type: "button", id: "gbMore", hidden: true }, "Xem thêm"),
  );
});
```

- [ ] **Step 4: `js/guestbook.js`**

```js
import { validateEntry, cooldownRemaining, isFirebaseConfigured } from "./lib/text.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
const LS_KEY = "gb:lastPost";

export async function initGuestbook(C) {
  const g = C.guestbook;
  const list = document.getElementById("gbList"), form = document.getElementById("gbForm"), msg = document.getElementById("gbMsg");
  const more = document.getElementById("gbMore"), count = document.getElementById("gbCount"), submit = document.getElementById("gbSubmit");
  if (!list || !form) return;

  const fmt = (ms) => ms ? new Date(ms).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "";
  const draw = (items) => {
    list.replaceChildren(...items.map((it) => {
      const li = document.createElement("li"); li.className = "gb-item";
      const n = document.createElement("b"); n.textContent = it.name;
      const d = document.createElement("time"); d.textContent = fmt(it.createdAtMs);
      const p = document.createElement("p"); p.textContent = it.message; // textContent: an toàn trước XSS
      li.append(n, d, p); return li;
    }));
  };
  const say = (t, bad = false) => { msg.textContent = t; msg.classList.toggle("is-bad", bad); };

  form.elements.message.addEventListener("input", () => { count.textContent = `${form.elements.message.value.length}/${g.maxMessage}`; });

  let online = isFirebaseConfigured(C.firebase), api = null, db = null, limitN = g.pageSize, unsub = null;
  if (online) {
    try {
      const [{ initializeApp }, fs] = await Promise.all([import(`${SDK}/firebase-app.js`), import(`${SDK}/firebase-firestore.js`)]);
      db = fs.getFirestore(initializeApp(C.firebase)); api = fs;
    } catch { online = false; }
  }

  const subscribe = () => {
    if (!online) { draw(g.samples); more.hidden = true; return; }
    unsub?.();
    const q = api.query(api.collection(db, "guestbook"), api.orderBy("createdAt", "desc"), api.limit(limitN + 1));
    unsub = api.onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => { const v = d.data(); return { name: String(v.name ?? ""), message: String(v.message ?? ""), createdAtMs: v.createdAt?.toMillis?.() ?? Date.now() }; });
      more.hidden = docs.length <= limitN;
      draw(docs.length ? docs.slice(0, limitN) : g.samples);
    }, () => { online = false; draw(g.samples); more.hidden = true; say("Chưa kết nối được sổ lưu bút, bạn thử lại sau nhé.", true); });
  };
  more.addEventListener("click", () => { limitN += g.pageSize; subscribe(); });
  subscribe();

  let sending = false;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (sending) return;
    let last = NaN; try { last = Number(localStorage.getItem(LS_KEY)); } catch {} // có thể throw ở chế độ riêng tư
    const wait = cooldownRemaining(last, Date.now(), g.cooldownSec);
    if (wait > 0) return say(`Bạn vừa gửi xong, vui lòng chờ ${wait} giây nữa nhé.`, true);
    const v = validateEntry({ name: form.elements.name.value, message: form.elements.message.value }, { maxName: g.maxName, maxMessage: g.maxMessage });
    if (!v.ok) return say(v.errors.name || v.errors.message, true);
    if (!online) return say("Sổ lưu bút chưa sẵn sàng, bạn thử lại sau nhé.", true);
    sending = true; submit.disabled = true; say("Đang gửi…");
    try {
      await api.addDoc(api.collection(db, "guestbook"), { name: v.value.name, message: v.value.message, createdAt: api.serverTimestamp() });
      try { localStorage.setItem(LS_KEY, String(Date.now())); } catch {}
      form.reset(); count.textContent = `0/${g.maxMessage}`; say("Cảm ơn lời chúc của bạn ♥");
    } catch { say("Gửi chưa được, bạn thử lại sau nhé.", true); }
    finally { sending = false; submit.disabled = false; }
  });
}
```


- [ ] **Step 5: CSS** (thêm vào `css/sections.css`)

```css
.gb-form { width: min(100%, 520px); display: flex; flex-direction: column; gap: 12px; text-align: left; }
.gb-form .btn-soft { align-self: center; } .gb-count { text-align: right; font-size: .75rem; color: var(--ink-soft); margin-top: -6px; }
.gb-msg { min-height: 1.4em; text-align: center; color: var(--red); font-size: .9rem; } .gb-msg.is-bad { color: var(--wine); }
.gb-list { list-style: none; margin: 10px 0 0; padding: 0; width: min(100%, 560px); display: flex; flex-direction: column; gap: 14px; text-align: left; max-height: 70svh; overflow-y: auto; scrollbar-width: thin; }
.gb-item { padding: 16px 18px; border-radius: 18px; background: rgba(255,255,255,.7); border: 1px solid rgba(247,198,206,.9); box-shadow: 0 14px 30px -24px rgba(142,31,58,.55); animation: rise .9s var(--ease) both; }
.gb-item b { font-family: var(--font-serif); font-size: 1.15rem; font-weight: 600; color: var(--wine); margin-right: 10px; } .gb-item time { font-size: .72rem; color: var(--ink-soft); } .gb-item p { margin-top: 4px; white-space: pre-wrap; overflow-wrap: anywhere; }
```

- [ ] **Step 6: `js/main.js`** — `import { initGuestbook } from "./guestbook.js"; initGuestbook(CONFIG);`

- [ ] **Step 7: Kiểm tra không Firebase (mặc định)**

Expected: danh sách hiện 2 lời chúc mẫu; gửi form hợp lệ hiện "Sổ lưu bút chưa sẵn sàng…" mà không lỗi console; để trống hoặc >300 ký tự bị báo lỗi; gõ `<script>alert(1)</script>` không chạy (không gửi được, nhưng khi có Firebase sẽ hiện nguyên văn).

- [ ] **Step 8: Kiểm tra với Firebase thật (làm cùng người dùng)**

Hướng dẫn trong README (Task 11): tạo project Firebase, bật Firestore (production mode), dán `firestore.rules`, đăng ký web app, dán config vào `CONFIG.firebase`. Expected: gửi lời chúc thì hiện ngay đầu danh sách (realtime, mở 2 tab thấy cập nhật); gửi lần hai trong 30s bị chặn; bấm đúp "Gửi" chỉ tạo 1 bản ghi; trong Firebase Console có doc với `name`, `message`, `createdAt`; thử sửa/xoá qua client bị rules từ chối. Nếu chưa có project Firebase, ghi rõ trong báo cáo là chưa kiểm thử được bước này.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: guestbook backed by Firebase Firestore with offline fallback and rules"
```

---

### Task 11: Hoàn thiện, tối ưu ảnh, README, kiểm thử tổng

**Files:**
- Create: `README.md`
- Modify: `js/config.js` (đổi đường dẫn ảnh sang `.webp`), `js/render.js`/`css/hero.css` nếu cần `image-set`, các CSS theo lỗi tìm thấy

**Interfaces:**
- Consumes: toàn bộ task trước.

- [ ] **Step 1: Ảnh giữ nguyên bản gốc** — không có bước xử lý ảnh (không WebP, không resize, không cắt). Chỉ rà soát: mọi `<img>` có `loading="lazy"` + `decoding="async"` (trừ ảnh đầu slide và hero), không có `object-fit: cover` ở ảnh nội dung (chỉ nền hero), và không còn script tối ưu ảnh trong repo.

- [ ] **Step 2: `README.md`** — bằng tiếng Việt, gồm: cách chạy thử (`python3 -m http.server 8000`), cách đổi nội dung (chỉ sửa `js/config.js`, thay ảnh trong `assets/images/`, QR trong `assets/qr/`, nhạc trong `assets/audio/` rồi điền `CONFIG.music.src`), cách tạo Firebase từng bước (tạo project → Firestore → dán `firestore.rules` → đăng ký Web app → dán config vào `CONFIG.firebase`), lưu ý khoá Firebase là công khai và bảo vệ bằng rules, cách xem/xoá lời chúc không phù hợp trong Firebase Console, cách deploy GitHub Pages (Settings → Pages → Deploy from branch `main` / root) hoặc Netlify (kéo thả thư mục), cách gửi link cá nhân hoá `?to=Anh%20Nam`, cách chạy test `node --test tests/`.

- [ ] **Step 3: Chạy toàn bộ test**

Run: `node --test tests/`
Expected: PASS toàn bộ.

- [ ] **Step 4: Kiểm thử trực quan (mobile + desktop)**

Nếu có trình duyệt headless (`command -v chromium chromium-browser google-chrome`): chụp `http://localhost:8000` ở 390×844, 768×1024, 1440×900, cả trước và sau khi mở thiệp (dùng `--virtual-time-budget`; nếu cần tương tác thì dùng script Playwright tạm trong scratchpad). Nếu không có, yêu cầu người dùng duyệt tay theo danh sách:
  - 320px: không cuộn ngang, hero không cắt tên, các nút bấm được.
  - 390×844 dọc: hero full `svh`, menu là nút góc, mỗi section nối tiếp tự nhiên.
  - 1440×900: sidebar trái cố định, cột 900px giữa màn hình, hero full-width.
  - Bật "reduce motion" trong DevTools: không tự cuộn, không trái tim rơi, nội dung vẫn hiện.
  - `?to=` độc hại và rất dài (200 ký tự): hiển thị an toàn, cắt 60 ký tự.
  - Console không có lỗi đỏ; Network không có request nào gửi RSVP.

- [ ] **Step 5: Soát lại theo Review Focus và sửa lỗi phát hiện**, mỗi lỗi một commit nhỏ kèm kiểm tra lại.

- [ ] **Step 6: Commit cuối**

```bash
git add -A && git commit -m "chore: optimize images, add README, final polish"
```

---

## Self-Review (đã chạy)

- **Spec coverage:** Hero ảnh full + chữ lớn + parallax + trái tim + nút mở (T3); lời mời, `?to=`, cô dâu chú rể, đếm ngược (T4); thông tin lễ cưới + lịch + .ics (T4); câu chuyện tình yêu (T5); album + lightbox (T5); tiệc cưới + RSVP không lưu + Zalo (T6); 2 địa chỉ + 2 bản đồ (T6); cảm ơn (T6); menu desktop sidebar/mobile overlay + scrollspy + nhạc (T7); tự cuộn + pause/resume + hold (T8); hộp quà + QR modal (T9); sổ lưu bút Firebase + rules + fallback + cooldown (T10); WebP/README/kiểm thử tổng/reduced motion (T11 + `prefers-reduced-motion` trong T1/T3/T8/T9).
- **Placeholder scan:** không còn TBD hay ghi chú dở dang.
- **Type consistency:** `createAutoScrollState` API khớp giữa T2 và T8; `validateEntry`/`cooldownRemaining`/`isFirebaseConfigured` khớp giữa T2, T10; sự kiện `invitation:open`, `modal:open/close`, `nav:start/end` khớp giữa T3/T5/T7/T8/T9; id section khớp `CONFIG.menu[].id` và `index.html`.
- **Review Focus:** các mục đều có bước kiểm tra tương ứng (T3 bước 5 cho `?to=`; T2/T10 cho lời chúc rỗng/dài/cooldown; T4 bước 6 cho ngày sai; T8 bước 4 cho tự cuộn; T11 bước 4 cho responsive/reduced-motion).
