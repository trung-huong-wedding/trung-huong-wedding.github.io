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
    sliderCount: 10,            // số ảnh đầu tiên chạy trong slide
    intervalMs: 4500,           // thời gian giữa hai lần tự trượt
    viewAllLabel: "Xem tất cả", // nút mở toàn bộ ảnh
    photos: [
      { src: "assets/images/hero.jpg", alt: "Khoảnh khắc hoàng hôn" },
      { src: "assets/images/couple-1.jpg", alt: "Nắm tay bên biển" },
      { src: "assets/images/couple-2.jpg", alt: "Vũ điệu hoàng hôn" },
      { src: "assets/images/couple-3.jpg", alt: "Nụ hôn bên biển" },
      { src: "assets/images/couple-4.jpg", alt: "Ôm nhau lúc hoàng hôn" },
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
  venues: {
    heading: "Địa Chỉ",
    items: [
      { side: "Nhà Trai", name: "Nhà hàng Hoa Hồng", address: "12 Phố Huế, Hai Bà Trưng, Hà Nội", time: "Tiệc thân mật: 11:30, 20/12/2026", mapEmbed: "https://www.google.com/maps?q=12+Ph%E1%BB%91+Hu%E1%BA%BF,+H%C3%A0+N%E1%BB%99i&output=embed", mapLink: "https://www.google.com/maps/search/?api=1&query=12+Ph%E1%BB%91+Hu%E1%BA%BF+H%C3%A0+N%E1%BB%99i" },
      { side: "Nhà Gái", name: "Trung tâm tiệc cưới Hoa Sen", address: "45 Láng Hạ, Đống Đa, Hà Nội", time: "Tiệc thân mật: 18:00, 19/12/2026", mapEmbed: "https://www.google.com/maps?q=45+L%C3%A1ng+H%E1%BA%A1,+H%C3%A0+N%E1%BB%99i&output=embed", mapLink: "https://www.google.com/maps/search/?api=1&query=45+L%C3%A1ng+H%E1%BA%A1+H%C3%A0+N%E1%BB%99i" },
    ],
  },

  // ---- Sổ lưu bút ----
  guestbook: {
    heading: "Sổ Lưu Bút",
    maxName: 50,
    maxMessage: 300,
    cooldownSec: 30,
    pageSize: 10,
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
    { id: "dia-chi", label: "Địa chỉ" },
    { id: "so-luu-but", label: "Sổ lưu bút" },
    { id: "qua-mung", label: "Quà mừng" },
  ],

  music: { src: "" }, // ví dụ "assets/audio/music.mp3"; để trống thì ẩn nút nhạc
  autoScroll: { pxPerSecond: 35 },

  // Dán cấu hình web app từ Firebase Console. Để apiKey trống thì dùng lời chúc mẫu.
  firebase: { apiKey: "", authDomain: "", projectId: "", appId: "" },
};
