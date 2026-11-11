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
    bio: "#8b1f37",        // dòng mô tả dưới tên cô dâu, chú rể
  },

  // ---- Ngày cưới (dùng cho đếm ngược) ----
  weddingDate: "2026-12-20T10:00:00+07:00",
  dateLabel: { weekday: "Chủ nhật", day: "20", month: "12", year: "2026", lunar: "(Tức ngày 12 tháng 11 năm Bính Ngọ)" },
  guestParam: "to", // link cá nhân hoá: ?to=anh long và gia đình → "Thân mời ..." ở bìa và "Trân trọng kính mời ..." ở thông tin lễ cưới; không có tham số thì không hiện

  // ---- Cô dâu & chú rể ----
  couple: {
    groom: { name: "Thành Trung", fullName: "Nguyễn Thành Trung", role: "Chú rể", parents: ["Bà Nguyễn Thị Tuyên"], address: "Hà Nội", photo: "assets/images/DSC09348.jpg", bio: "Chàng trai IT hiền lành, thích thể thao và nấu ăn." },
    bride: { name: "Thu Hương", fullName: "Nguyễn Thu Hương", role: "Cô dâu", parents: ["Bà Nguyễn Thanh Mai"], address: "Hà Nội", photo: "assets/images/DSC09301.jpg", bio: "Cô gái dịu dàng, yêu hoa và những buổi chiều hoàng hôn." },
  },

  // ---- Màn bìa ----
  hero: {
    photo: "assets/images/floral-background.webp", // ảnh cưới: làm nền mờ ở màn mở đầu
    lead: "Thân Mời",
    autoOpenSec: 5,                  // khách không bấm "Mở thiệp" thì tự mở sau ngần này giây (0 = không tự mở)
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
    inviteLabel: "Trân trọng kính mời",                       // nhãn dòng mời ở mục lời mời khi URL có ?to=...; không có thì hiện invitation.body
    parentsLabels: ["Nhà trai", "Nhà gái"],                    // nhãn trên tên bố mẹ: [cột trái, cột phải] (tên lấy từ couple.*.parents, tự bỏ "Ông"/"Bà" ở đầu)
    inviteLine2: "Tới tham dự lễ thành hôn của hai chúng tôi", // dòng thứ hai dưới "Trân trọng kính mời: <tên>" (chỉ hiện khi URL có ?to=...)
    announce: "TRÂN TRỌNG BÁO TIN\nLỄ THÀNH HÔN CỦA HAI CHÚNG TÔI", // lời báo tin (xuống dòng bằng \n)
    venue: "Nhà văn hóa thôn Quảng Tái\ncụm Quảng Tái, thôn Đạo Tú, xã Ứng Hòa, Hà Nội",                       // địa điểm làm lễ, hiện dưới "LỄ THÀNH HÔN TẠI" (xuống dòng bằng \n)
    startIso: "2026-12-20T11:00:00+07:00",
    durationMin: 120,
    timeline: [
      { time: "10:00", title: "Đón khách" },
      { time: "10:30", title: "Chụp ảnh lưu niệm" },
      { time: "11:00", title: "Lễ thành hôn" },
    ],
    locationForCalendar: "số 20, ngõ 15 cụm Quảng Tái, thôn Đạo Tú, xã Ứng Hòa, Hà Nội",
  },

  // ---- Câu chuyện tình yêu (cây thời gian). Mỗi mốc là một khối; mọi trường đều tuỳ chọn. ----
  story: {
    heading: "Từ một tin nhắn, đến một đời thương.",
    chapters: [
      {
      date: "22 Tháng 8, 2023",
      title: "Tin nhắn đầu tiên",
      photo: "assets/images/first-inbox.jpg",
      photoAlt: "Tin nhắn đầu tiên",
      text: "Chúng mình bắt đầu từ một tin nhắn, giữa những ngày tháng chẳng có gì đặc biệt. Khi ấy, chẳng ai biết rằng người ở đầu bên kia màn hình sẽ trở thành người cùng mình đi qua những năm tháng sau này. Một lời chào rất khẽ, nhưng lại mở ra cả một hành trình yêu thương."
    },
    {
      date: "9 Tháng 12, 2023",
      title: "Lần đầu gặp gỡ",
      photo: "assets/images/first-date.jpg",
      photoAlt: "Ngày đầu gặp nhau",
      text: "Sau những ngày chỉ biết nhau qua màn hình, chúng mình cuối cùng cũng gặp nhau. Ánh mắt, nụ cười và những câu chuyện chẳng muốn kết thúc… Từ hôm ấy, người từng chỉ xuất hiện trong những dòng tin nhắn đã trở thành một điều thật gần gũi, thật đặc biệt trong tim."
    },
    {
      date: "1 Tháng 5, 2024",
      title: "Ngày chúng mình thuộc về nhau",
      photo: "assets/images/couple-date.jpg",
      photoAlt: "Chính thức thành đôi",
      text: "Có những tình cảm chẳng cần quá nhiều lời để diễn tả, chỉ cần một bó hoa, một lời tỏ tình chân thành và một cái gật đầu hạnh phúc. Ngày 1 tháng 5, chúng mình chính thức bước vào cuộc đời nhau, cùng viết nên những trang đầu tiên của một chuyện tình mang tên chúng mình."
    },
    {
      date: "Năm 2025",
      title: "Tình yêu qua những thử thách",
      photo: "assets/images/love-date.jpg",
      photoAlt: "Mãi mãi bên nhau",
      text: "Tình yêu không phải lúc nào cũng là những ngày bình yên và ngọt ngào. Đã có những lúc khó khăn, những điều chưa thể nói thành lời. Nhưng sau tất cả, chúng mình vẫn chọn ở lại, chọn lắng nghe, thấu hiểu và nắm tay nhau bước tiếp. Bởi càng đi qua thử thách, chúng mình càng hiểu rằng: người mình muốn cùng đi đến cuối hành trình chính là người đang ở bên cạnh."
    },
    {
      date: "17 Tháng 10, 2026",
      title: "Lời cầu hôn – Hẹn ước trọn đời",
      photo: "assets/images/17-10-date.jpg",
      photoAlt: "Cầu hôn",
      text: "Từ một tin nhắn đầu tiên đến lời hẹn ước trăm năm, hành trình của chúng mình đã đi qua biết bao yêu thương và trưởng thành. Ngày anh ngỏ lời cầu hôn, em không chỉ nhận được một chiếc nhẫn, mà còn nhận được lời hứa về một mái nhà, một người đồng hành và một tình yêu sẽ luôn được gìn giữ. Từ hôm nay, chúng mình không chỉ yêu nhau, mà còn cùng nhau xây dựng một gia đình."
    },
    ],
  },

  // ---- Album ảnh: slide tự trượt + nút "Xem tất cả". Ảnh giữ nguyên bản gốc, không cắt/resize. ----
  album: {
    heading: "Album Ảnh Cưới",
    sliderCount: 27,            // số ảnh đầu tiên chạy trong slide
    intervalMs: 4500,           // thời gian giữa hai lần tự trượt
    viewAllLabel: "Xem tất cả", // nút mở toàn bộ ảnh
    photos: [
      { src: "assets/images/DSC00245.jpg", alt: "wedding" },
      { src: "assets/images/DSC00265.jpg", alt: "wedding" },
      { src: "assets/images/DSC09657.jpg", alt: "wedding" },
      { src: "assets/images/DSC00275.jpg", alt: "wedding" },
      { src: "assets/images/DSC09558.jpg", alt: "wedding" },
      { src: "assets/images/DSC08984.jpg", alt: "wedding" },
      { src: "assets/images/DSC09034.jpg", alt: "wedding" },
      { src: "assets/images/DSC09086.jpg", alt: "wedding" },
      { src: "assets/images/DSC09101.jpg", alt: "wedding" },
      { src: "assets/images/DSC09595.jpg", alt: "wedding" },
      { src: "assets/images/DSC09164.jpg", alt: "wedding" },
      { src: "assets/images/DSC09713.jpg", alt: "wedding" },
      { src: "assets/images/DSC09210.jpg", alt: "wedding" },
      { src: "assets/images/DSC09281.jpg", alt: "wedding" },
      { src: "assets/images/DSC09301.jpg", alt: "wedding" },
      { src: "assets/images/DSC08941.jpg", alt: "wedding" },
      { src: "assets/images/DSC09348.jpg", alt: "wedding" },
      { src: "assets/images/DSC09356.jpg", alt: "wedding" },
      { src: "assets/images/DSC09376.jpg", alt: "wedding" },
      { src: "assets/images/DSC09446.jpg", alt: "wedding" },
      { src: "assets/images/DSC09128.jpg", alt: "wedding" },
      { src: "assets/images/DSC09866.jpg", alt: "wedding" },
      { src: "assets/images/DSC09872.jpg", alt: "wedding" }, 
      { src: "assets/images/DSC09616.jpg", alt: "wedding" },
      { src: "assets/images/DSC09691.jpg", alt: "wedding" },
      { src: "assets/images/DSC09764.jpg", alt: "wedding" },
      { src: "assets/images/DSC09769.jpg", alt: "wedding" },
    ],
  },

  // ---- Thông tin tiệc cưới + xác nhận tham dự (form chỉ để điền, không lưu) ----
  banquet: {
    heading: "Thông Tin Tiệc Cưới",
    time: "11:30, Chủ nhật 20/12/2026",
    venueName: "Nhà hàng Hoa Hồng",
    note: "Sự hiện diện của bạn là niềm vui lớn của gia đình chúng mình.",
    dressCode: "Gam màu hồng, đỏ, kem",
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
      { side: "Nhà Trai", name: "Nhà văn hóa thôn Quảng Tái", address: "thôn Đạo Tú, xã Ứng Hòa, Hà Nội", time: "Tiệc thân mật: 17:30, 19/12/2026", mapQuery: "20.723599, 105.834350", mapLink: "https://maps.app.goo.gl/cnyWBQ23dKhC2Jpb6" },
      { side: "Nhà Gái", name: "Trung Tâm Tiệc Cưới H2T", address: "4QC8+6XH, Thiên Lộc, Hà Nội, Việt Nam", time: "Tiệc thân mật: 17:30, 19/12/2026", mapQuery: "21.120748719636122, 105.7683462301768", mapLink: "https://maps.app.goo.gl/AcrC89nYGQ4shy8E7" },
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
      { role: "Chú Rể", name: "NGUYEN THANH TRUNG", bank: "BIDV", account: "0367742336", qr: "assets/images/bidv-trung.jpg" },
      // { role: "Cô Dâu", name: "NGUYEN THU HUONG", bank: "BIDV", account: "1111111111", qr: "assets/qr/bride.svg" },
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
  autoScroll: { pxPerSecond: 60 }, // đã cố định 60px/giây trong js/autoscroll.js (khoá này không còn tác dụng)

  // Dán cấu hình web app từ Firebase Console. Để apiKey trống thì dùng lời chúc mẫu.
  firebase: { 
    apiKey: "AIzaSyDYf3zZ3K368AagLhvVtdK_46l6FJTlM6k", 
    authDomain: "wedding-201226.firebaseapp.com", 
    projectId: "wedding-201226", 
    appId: "1:84058659143:web:cbb1d0297711d934211462" 
  },
};
