// ============================================================================
//  TOÀN BỘ NỘI DUNG THIỆP NẰM Ở ĐÂY. Chỉ cần sửa file này (và thay ảnh trong assets/).
//  - Danh sách (mốc tình yêu, ảnh album, địa điểm...) là MẢNG: thêm một { ... } là thêm một khối.
//  - Mảng rỗng [] thì section tương ứng (và mục menu) tự ẩn.
//  - Văn bản là chữ thường (không HTML). Xuống dòng bằng \n.
// ============================================================================
export const CONFIG = {
  title: "Thiệp cưới Thành Trung & Thu Hương",

  // ---- BẢNG MÀU: đổi tone chủ đạo ở đây, toàn trang đổi theo (không hard-code ở CSS/JS) ----
  theme: {
    bg: "#FFF6F5",       // nền giấy thiệp
    pinkSoft: "#F7C6CE", // hồng phấn (nền nhấn, trái tim nhạt)
    pink: "#E0607E",     // hồng đậm
    red: "#C8304F",      // đỏ hồng chủ đạo (số, nút nhấn, đường timeline)
    wine: "#8E1F3A",     // đỏ rượu (tiêu đề, chữ viết tay)
    gold: "#C9A25B",     // vàng ánh kim (viền, họa tiết)
    ink: "#4a2a31",      // chữ thân bài
    inkSoft: "#7a5a61",  // chữ phụ
    heroAccent: "#CB5D6C", // màn bìa: tên, đường kẻ, nút "Mở thiệp"
    heroInk: "#933845",    // màn bìa: ngày tháng và câu mời
  },

  // ---- Ngày cưới (dùng cho đếm ngược) ----
  weddingDate: "2026-12-20T10:00:00+07:00",
  dateLabel: { weekday: "Chủ nhật", day: "20", month: "12", year: "2026", lunar: "(Nhằm ngày 11 tháng 11 năm Bính Ngọ)" },
  guestParam: "to", // link cá nhân hoá: ?to=Anh%20Nam

  // ---- Cô dâu & chú rể ----
  couple: {
    groom: { name: "Thành Trung", fullName: "Nguyễn Thành Trung", role: "Chú rể", parents: ["Ông Nguyễn Văn A", "Bà Trần Thị B"], address: "Hà Nội", photo: "assets/images/couple-1.jpg", bio: "Chàng trai hiền lành, thích đi biển và nấu ăn." },
    bride: { name: "Thu Hương", fullName: "Nguyễn Thu Hương", role: "Cô dâu", parents: ["Ông Phạm Văn C", "Bà Lê Thị D"], address: "Hà Nội", photo: "assets/images/couple-2.jpg", bio: "Cô gái dịu dàng, yêu hoa và những buổi chiều hoàng hôn." },
  },

  // ---- Màn bìa ----
  hero: {
    photo: "assets/images/floral-background.webp", // ảnh cưới: làm nền mờ ở màn mở đầu
    lead: "Thân Mời",
    flower: "assets/images/flower-decoration.webp",                      // ảnh hoa trang trí hai góc thẻ, ví dụ "assets/images/flower-decoration.webp"; để trống = dùng hoa vẽ sẵn
  },

  // ---- Hoa lá trang trí và nền trang nội dung (ảnh đặt trong assets/images/). Để trống một mục thì bỏ phần đó. ----
  decor: {
    background: "assets/images/floral-background.webp", // nền chung của trang nội dung (lặp lại, phủ trắng 60%)
    flower: "assets/images/flower2-decoration.webp",    // cành lá, rải xen kẽ hai bên khi cuộn
    leaf: "assets/images/leaf1-bloom.webp",             // cụm lá hoa, rải xen kẽ hai bên + trang trí khối cô dâu chú rể
    corner: "assets/images/flower-decoration.webp",     // hoa ở góc khối cô dâu chú rể và góc thẻ xác nhận tham dự
    bottom: "assets/images/flower5-bottom.webp",        // dải hoa lá ở cuối trang
  },

  // ---- Lời mời ----
  invitation: {
    heading: "Thiệp Mời",
    lines: ["Tình yêu không phải là nhìn nhau,", "mà là cùng nhau nhìn về một hướng."],
    body: "Chúng mình hân hoan báo tin vui và trân trọng kính mời bạn đến chung vui trong ngày trọng đại của chúng mình.",
  },

  // ---- Thông tin lễ cưới ----
  ceremony: {
    heading: "Thông Tin Lễ Cưới",
    title: "Lễ Thành Hôn",
    parentsLabel: "Ông Bà",                                   // nhãn trên tên bố mẹ hai bên (tên lấy từ couple.*.parents, tự bỏ "Ông"/"Bà" ở đầu)
    announce: "TRÂN TRỌNG BÁO TIN\nLỄ THÀNH HÔN CỦA CON CHÚNG TÔI", // lời báo tin (xuống dòng bằng \n)
    venue: "Nhà hàng Hoa Hồng\nHà Nội",                       // địa điểm làm lễ, hiện dưới "LỄ THÀNH HÔN TẠI" (xuống dòng bằng \n)
    startIso: "2026-12-20T10:00:00+07:00",
    durationMin: 120,
    timeline: [
      { time: "08:30", title: "Đón khách" },
      { time: "10:00", title: "Lễ thành hôn" },
      { time: "11:30", title: "Chụp ảnh lưu niệm" },
    ],
    locationForCalendar: "Nhà hàng Hoa Hồng, Hà Nội",
  },

  // ---- Câu chuyện tình yêu (cây thời gian). Mỗi mốc là một khối; mọi trường đều tuỳ chọn. ----
  story: {
    heading: "Câu Chuyện Tình Yêu",
    chapters: [
      { date: "Tháng 6, 2021", title: "Lần đầu gặp gỡ", photo: "assets/images/couple-1.jpg", photoAlt: "Nắm tay bên biển", text: "Một buổi chiều bình thường, chúng mình gặp nhau và câu chuyện bắt đầu từ một cái nhìn rất khẽ." },
      { date: "Tháng 12, 2021", title: "Những ngày đầu hẹn hò", photo: "assets/images/couple-2.jpg", photoAlt: "Vũ điệu hoàng hôn", text: "Những chuyến đi dài, những cuộc trò chuyện không đoạn kết và nụ cười ngày một gần hơn." },
      { date: "Năm 2023", title: "Cùng nhau đi qua thử thách", photo: "assets/images/couple-3.jpg", photoAlt: "Nụ hôn bên biển", text: "Có những ngày khó khăn, nhưng bàn tay vẫn nắm chặt và chúng mình hiểu nhau hơn." },
      { date: "Năm 2026", title: "Lời cầu hôn", photo: "assets/images/couple-4.jpg", photoAlt: "Ôm nhau lúc hoàng hôn", text: "Bên bờ biển lúc hoàng hôn, một lời hỏi nhỏ và một câu trả lời 'Đồng ý' ngập tràn hạnh phúc." },
    ],
  },

  // ---- Album ảnh: slide tự trượt + nút "Xem tất cả". Ảnh giữ nguyên bản gốc, không cắt/resize. ----
  album: {
    heading: "Album Ảnh Cưới",
    sliderCount: 11,            // số ảnh đầu tiên chạy trong slide
    intervalMs: 4500,           // thời gian giữa hai lần tự trượt
    viewAllLabel: "Xem tất cả", // nút mở toàn bộ ảnh
    photos: [
      { src: "assets/images/hero.jpg", alt: "Khoảnh khắc hoàng hôn" },
      { src: "assets/images/couple-1.jpg", alt: "Nắm tay bên biển" },
      { src: "assets/images/couple-2.jpg", alt: "Vũ điệu hoàng hôn" },
      { src: "assets/images/couple-3.jpg", alt: "Nụ hôn bên biển" },
      { src: "assets/images/couple-4.jpg", alt: "Ôm nhau lúc hoàng hôn" },
      { src: "assets/images/couple-5.jpg", alt: "Ôm nhau lúc hoàng hôn" },
      { src: "assets/images/couple-6.jpg", alt: "Ôm nhau lúc hoàng hôn" },
      { src: "assets/images/couple-7.jpg", alt: "Ôm nhau lúc hoàng hôn" },
      { src: "assets/images/couple-8.jpg", alt: "Ôm nhau lúc hoàng hôn" },
      { src: "assets/images/couple-9.jpg", alt: "Ôm nhau lúc hoàng hôn" },
      { src: "assets/images/couple-10.jpg", alt: "Ôm nhau lúc hoàng hôn" },
      { src: "assets/images/couple-11.jpg", alt: "Ôm nhau lúc hoàng hôn" },
    ],
  },

  // ---- Thông tin tiệc cưới + xác nhận tham dự (form chỉ để điền, không lưu) ----
  banquet: {
    heading: "Thông Tin Tiệc Cưới",
    time: "11:30, Chủ nhật 20/12/2026",
    venueName: "Nhà hàng Hoa Hồng",
    note: "Sự hiện diện của bạn là niềm vui lớn của gia đình chúng mình.",
    dressCode: "Gam màu hồng, đỏ, kem",
    zalo: "https://zalo.me/0900000000",
    rsvp: { heading: "Xác Nhận Tham Dự", thanks: "Cảm ơn bạn! Chúng mình rất mong được gặp bạn." },
  },

  // ---- Địa chỉ: tổ chức 2 nơi, mỗi nơi một bản đồ. Thêm/bớt địa điểm bằng cách thêm/bớt object. ----
  // Bản đồ: Google KHÔNG cho nhúng link chia sẻ (maps.app.goo.gl...). Cách điền (chọn một):
  //   - mapLink:  link chia sẻ/rút gọn của Google Maps → dùng cho nút "Chỉ đường".
  //   - mapEmbed: link NHÚNG: Google Maps → Chia sẻ → tab "Nhúng bản đồ" → copy phần src="https://www.google.com/maps/embed?pb=..." → dán vào đây (ghim đúng vị trí nhất).
  //   - mapQuery: (tuỳ chọn) toạ độ "20.7712,105.7801" hoặc tên địa điểm, dùng dựng bản đồ khi chưa có mapEmbed. Không điền thì dùng `address`.
  // Dán nhầm link chia sẻ vào mapEmbed cũng không sao: web tự dùng nó cho nút "Chỉ đường" và dựng bản đồ từ mapQuery/address.
  venues: {
    heading: "Địa Chỉ",
    items: [
      { side: "Nhà Trai", name: "Trung's House", address: "số 20, ngõ 15 cụm Quảng Tái, thôn Đạo Tú, xã Ứng Hòa, Hà Nội", time: "Tiệc thân mật: 17:30, 19/12/2026", mapQuery: "20.724174,105.8318", mapLink: "https://maps.app.goo.gl/vVKXpAgpEDVQo4YW7" },
      { side: "Nhà Gái", name: "Huong's House", address: "Đường số 4, ngõ 278, nhà số 2, thôn Sáp Mai, xã Thiên Lộc, Hà Nội", time: "Tiệc thân mật: 17:30, 19/12/2026", mapQuery: "21.109136,105.762992", mapLink: "https://maps.app.goo.gl/Q2nBunnRhD4rgqyD6" },
    ],
  },

  // ---- Sổ lưu bút ----
  guestbook: {
    heading: "Sổ Lưu Bút",
    maxName: 50,
    maxMessage: 300,
    cooldownSec: 30,
    pageSize: 10,
    listHeight: 500, // chiều cao khung danh sách lời chúc (px); nhiều lời chúc hơn thì cuộn trong khung
    samples: [ // hiện khi chưa cấu hình Firebase hoặc chưa có lời chúc nào
      { name: "Bạn thân", message: "Chúc hai bạn trăm năm hạnh phúc!", createdAtMs: 0 },
      { name: "Đồng nghiệp", message: "Chúc mừng hạnh phúc! Mãi bên nhau nhé.", createdAtMs: 0 },
    ],
  },

  // ---- Quà mừng (QR ngân hàng đặt trong assets/qr/) ----
  gift: {
    heading: "Hộp Quà Mừng",
    hint: "Nhấn để mở",
    people: [
      { role: "Chú Rể", name: "NGUYEN THANH TRUNG", bank: "Vietcombank", account: "0000000000", qr: "assets/qr/groom.svg" },
      { role: "Cô Dâu", name: "NGUYEN THU HUONG", bank: "BIDV", account: "1111111111", qr: "assets/qr/bride.svg" },
    ],
  },

  thanks: { text: "Cảm ơn bạn đã dành tình cảm cho chúng mình", sign: "Thành Trung & Thu Hương" },

  // ---- Menu (thứ tự và tên mục; id khớp id section trong index.html) ----
  menu: [
    { id: "thiep-cuoi", label: "Thiệp cưới" },
    { id: "le-cuoi", label: "Thông tin lễ cưới" },
    { id: "tinh-yeu", label: "Câu chuyện tình yêu" },
    { id: "album", label: "Album ảnh" },
    { id: "tiec-cuoi", label: "Thông tin tiệc cưới" },
    { id: "so-luu-but", label: "Sổ lưu bút" },
    { id: "qua-mung", label: "Quà mừng" },
  ],

  music: { src: "assets/audio/Beautiful-In-White.mp3" }, // ví dụ "assets/audio/music.mp3"; để trống thì ẩn nút nhạc
  autoScroll: { pxPerSecond: 35 },

  // Dán cấu hình web app từ Firebase Console. Để apiKey trống thì dùng lời chúc mẫu.
  firebase: { 
    apiKey: "AIzaSyDYf3zZ3K368AagLhvVtdK_46l6FJTlM6k", 
    authDomain: "wedding-201226.firebaseapp.com", 
    projectId: "wedding-201226", 
    appId: "1:84058659143:web:cbb1d0297711d934211462" 
  },
};
