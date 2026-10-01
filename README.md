# Thiệp cưới online

Web thiệp cưới tĩnh (HTML/CSS/JS thuần, không cần build). Toàn bộ nội dung nằm trong **`js/config.js`**.

## Chạy thử trên máy

```bash
python3 -m http.server 8000     # hoặc: npm start
```

Mở http://localhost:8000 (không mở bằng `file://` vì dùng ES modules).
Link cá nhân hoá cho từng khách: `http://localhost:8000/?to=Anh%20Nam` → màn bìa hiện "Thân mời **Anh Nam**".
Chạy test logic: `npm test` (cần Node 20+).

## Đổi nội dung (chỉ sửa `js/config.js`)

| Muốn đổi | Sửa ở |
|---|---|
| **Tone màu chủ đạo** | `theme` (8 màu) — đổi ở đây là cả trang đổi theo, không cần sửa CSS |
| Tên, ngày cưới, đếm ngược | `couple`, `dateLabel`, `weddingDate` |
| Lời mời | `invitation` |
| Giờ lễ, lịch, file thêm-vào-lịch | `ceremony` |
| **Câu chuyện tình yêu** | `story.chapters` — mỗi mốc `{ date, title, text, photo, photoAlt }` |
| **Album ảnh** | `album.photos` (vòng ảnh 3D chạy `album.sliderCount` ảnh đầu, nút "Xem tất cả" hiện hết; `album.intervalMs` là thời gian tự quay) |
| Tiệc cưới, Zalo, dress code | `banquet` |
| **2 địa chỉ + bản đồ** | `venues.items` |
| Hộp quà, STK, QR | `gift.people` + ảnh QR trong `assets/qr/` |
| Menu | `menu` |
| Nhạc nền | bỏ file vào `assets/audio/` rồi điền `music.src` (để trống thì ẩn nút nhạc) |
| Tốc độ tự cuộn | `autoScroll.pxPerSecond` |

**Thêm/bớt khối:** mỗi danh sách là một mảng — thêm một `{ ... }` là thêm một mốc/ảnh/địa điểm, trang tự dài ra và đẩy các khối bên dưới xuống. Mảng rỗng `[]` thì section và mục menu của nó tự ẩn. Văn bản là chữ thường (không HTML), xuống dòng bằng `\n`.

**Ảnh:** đặt ảnh gốc vào `assets/images/` và ghi đường dẫn trong config. Web **không resize/nén/cắt** ảnh, hiển thị đúng tỉ lệ gốc (riêng ảnh nền màn bìa phủ kín màn hình). Ảnh gốc nặng sẽ làm trang tải chậm hơn trên 4G — nếu cần, tự nén ảnh trước khi bỏ vào repo. Các ảnh có sẵn hiện giờ chỉ là ảnh giữ chỗ.

## Sổ lưu bút (Firebase Firestore)

Chưa cấu hình thì sổ lưu bút hiện lời chúc mẫu (`guestbook.samples`) và không gửi được. Để bật:

1. Vào https://console.firebase.google.com → **Add project**.
2. **Build → Firestore Database → Create database** (production mode, chọn vùng gần Việt Nam, vd `asia-southeast1`).
3. Tab **Rules**: dán toàn bộ nội dung file [`firestore.rules`](firestore.rules) → **Publish**.
4. **Project settings → Your apps → Web (`</>`)** → đăng ký app → copy `firebaseConfig`.
5. Dán `apiKey`, `authDomain`, `projectId`, `appId` vào `firebase` trong `js/config.js`.

Khoá cấu hình Firebase là thông tin công khai; việc bảo vệ nằm ở `firestore.rules` (chỉ cho đọc và thêm lời chúc đúng định dạng: tên ≤ 50, lời chúc ≤ 300 ký tự; cấm sửa/xoá). Muốn xoá lời chúc không phù hợp: vào Firebase Console → Firestore → collection `guestbook`. Mỗi trình duyệt chỉ được gửi 1 lời chúc/30 giây (`guestbook.cooldownSec`).

## Đưa lên mạng

- **GitHub Pages:** push repo → Settings → Pages → Deploy from branch `main` / root.
- **Netlify / Cloudflare Pages:** kéo thả thư mục dự án (không cần lệnh build).

## Cấu trúc

```
index.html            khung trang
css/                  tokens (biến), hero, sections, timeline, album, menu, gift
js/config.js          TOÀN BỘ nội dung + màu + Firebase
js/render.js          đổ config vào DOM
js/*.js               mỗi tính năng một file (hero, slider, gallery, timeline, menu, autoscroll, gift, guestbook...)
js/lib/               hàm thuần có test (tests/)
firestore.rules       luật bảo mật Firestore
assets/               images, qr, audio
```
