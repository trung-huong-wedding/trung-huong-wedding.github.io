# Thiệp cưới online – Thiết kế

## Mục tiêu
Web thiệp cưới cá nhân gửi link cho khách mời. Web tĩnh (HTML/CSS/JS thuần), nội dung text/ảnh viết cứng, ảnh lưu trong repo. Deploy GitHub Pages/Netlify. Ngoại lệ duy nhất cần dữ liệu động: sổ lưu bút, lưu bằng Firebase Firestore.

## Quyết định đã chốt
- Sổ lưu bút: Firebase Firestore (client SDK qua CDN, không server riêng).
- RSVP: chỉ là form UI; gửi xong hiện lời cảm ơn, không lưu/xử lý. Kèm nút nhắn Zalo xác nhận.
- Link cá nhân hoá `?to=Tên khách` hiển thị ở phần lời mời.
- Nội dung ban đầu là dữ liệu mẫu giữ chỗ, người dùng thay sau trong `js/config.js` và `assets/`.
- **Nội dung theo khối (block), layout co giãn theo nội dung**: xem mục "Nội dung theo khối và layout co giãn".
- **Câu chuyện tình yêu** là cây thời gian (timeline) dọc; **Album ảnh** là slide tự động trượt (~10 ảnh) kèm nút "Xem tất cả".
- **Ảnh giữ nguyên kích thước và độ phân giải gốc**: không resize, không nén lại, không cắt, không đổi định dạng; xem mục "Quy tắc về ảnh".

## Phong cách
Lãng mạn, hoa hồng/hoa đào, tông chủ đạo đỏ hồng. Màu (đặt thành biến CSS để dễ chỉnh): nền kem hồng `#FFF6F5`, hồng phấn `#F7C6CE`, hồng đậm `#E0607E`, đỏ hồng chủ đạo `#C8304F`, đỏ rượu (chữ tiêu đề, nút) `#8E1F3A`, vàng ánh kim nhấn `#C9A25B`. Trái tim rơi và hộp quà dùng gam hồng–đỏ. Font: Cormorant Garamond/Playfair Display (tiêu đề), Great Vibes (chữ viết tay), Be Vietnam Pro (nội dung). Họa tiết hoa SVG vẽ bằng code, ký hiệu ❦ phân cách. Mobile-first (ưu tiên màn dọc), một cột; toàn bộ trang (kể cả màn bìa) nằm trong một khung rộng tối đa **1000px**, căn giữa màn hình (trên màn nhỏ hơn thì full-width); phần hai bên khung là nền hồng nhạt có đổ bóng nhẹ để người xem tập trung vào giữa. Ở màn 1024–1459px khung dời sang phải sidebar để không bị đè.

## Ngôn ngữ thiết kế (nguyên tắc thống nhất cho toàn trang)
Cảm giác mong muốn: mở một tấm thiệp cưới điện tử dọc cao cấp, không phải website. Mọi section đều theo các quy tắc dưới đây.

**Không có "dấu hiệu web"**: không navbar ngang kiểu website (menu điều hướng vẫn có nhưng theo dạng riêng ở mục "Menu điều hướng"), không card có viền/đổ bóng kiểu dashboard, không lưới đều, không nút bo vuông kiểu UI kit, không tiêu đề section in đậm kiểu landing page. Thay vào đó là các "trang thiệp" nối tiếp nhau, mỗi trang là một khoảnh khắc: nhiều khoảng trắng, căn giữa, chữ là nhân vật chính.

**Typography**
- Tên cô dâu/chú rể: rất lớn (mobile ~15–18vw, tối đa ~120px desktop), chữ viết tay (Great Vibes hoặc Pinyon Script), màu đỏ rượu, dấu "&" nhỏ hơn, vàng ánh kim.
- Tiêu đề phụ và ngày tháng: serif thanh (Cormorant Garamond), chữ hoa giãn cách rộng (letter-spacing ~0.3em), cỡ nhỏ.
- Thân bài: serif nhẹ hoặc Be Vietnam Pro mảnh, dòng ngắn, căn giữa, nhiều khoảng thở. Ngày giờ dùng số kiểu thiệp (chữ số lớn, serif).
- Mỗi section chỉ 1 cụm "tiêu đề viết tay + đường kẻ mảnh + ❦", không dùng chữ đậm nặng.

**Cấu trúc hai trang tách biệt (nguyên tắc nền tảng)**
- **Trang 1 — Màn mở đầu:** một trang riêng phủ kín màn hình (`position: fixed`, tự cuộn được nếu màn quá thấp), KHÔNG nằm trong khung 1000px. Nền là ảnh cưới làm mờ phủ toàn màn hình; thiệp (thẻ kính mờ) nằm chính giữa màn hình. Không có khối main 1000px ở trang này.
- **Trang 2 — Nội dung chính:** nằm gọn trong khung `main` rộng tối đa 1000px, căn giữa; hai bên khung là màu hồng nhạt trơn. Nền ảnh mờ của trang này CHỈ nằm trong khung 1000px (không bao giờ phủ toàn màn hình). Thiệp ở trang 1 không hiển thị lại ở trang này.
- Bấm "Mở thiệp": lớp màn quét qua, khoá cuộn được gỡ, trang 1 mờ dần rồi ẩn hẳn để lộ trang 2.

**Hero (màn mở đầu, cũng là màn bìa)** — theo mẫu "kính mờ" người dùng cung cấp
- Nền màn mở đầu: **chính ảnh cưới (`hero.photo`) làm mờ** (`blur ~22px`) phủ kín toàn màn hình, cộng một lớp kem–hồng nhạt.
- Ở giữa là **một thẻ kính mờ làm theo đúng code mẫu của người dùng** (kích thước, khoảng cách, màu và bóng đổ như mẫu; chỉ khác tên, ngày tháng, thông tin riêng và font): bo góc 8px, nền trắng 30% + `backdrop-filter: blur(6px) saturate(1.08)`, viền mảnh màu `heroAccent` 15%, bóng `0 25px 60px -12px rgba(0,0,0,.45), 0 8px 24px rgba(0,0,0,.2), 0 0 40px heroAccent 15%`; hai góc (trên-trái xoay 2°, dưới-phải lật và xoay 85°) có **cụm hoa vẽ bằng SVG** (cao 9rem, ≥768px 10rem). Phần thân thẻ `padding: 7rem 1.5rem 3.5rem` (≥768px: `6rem … 2rem`). Màu `heroAccent` (#CB5D6C) và `heroInk` (#933845) khai báo trong `CONFIG.theme`.
- Chữ trong thẻ (căn giữa, từ trên xuống): tên chú rể / "&" / tên cô dâu (font viết tay hiện tại, 30px, ≥640px 36px, màu `heroAccent`) → đường kẻ gradient 2.5rem hai bên ký hiệu ❦ → "Chủ nhật, 20 tháng 12, 2026" (serif 18px, `heroInk` 80%) → câu mời `hero.lead` ("Thân Mời") và "Thân mời <tên khách>" nếu có `?to=` → nút **"Mở thiệp"** `padding .625rem 2rem`, bo tròn hoàn toàn, nền `heroAccent`, chữ trắng 18px (600; ≥640px 500), bóng `0 4px 14px heroAccent 35%`, có **vệt sáng trắng 40% quét qua mỗi 3s**.
- Màn thấp (< 700px cao): padding thẻ co theo `svh` để thẻ luôn vừa màn; nếu vẫn cao hơn màn thì tự mở khoá cuộn để luôn chạm được nút.
- Trái tim rơi: ít (khoảng 12–18 cái mobile), nhỏ, mờ, xoay rất chậm, nằm giữa nền mờ và thẻ.
- Bấm "Mở thiệp": một lớp "màn" hồng phấn quét từ giữa ra hai bên rồi tan; màn mở đầu mờ dần và ẩn, trang nội dung hiện ra, mở khoá cuộn và bắt đầu tự cuộn.

**Bố cục & nhịp điệu**
- Mobile dọc là thiết kế gốc: mỗi section cao tối thiểu ~90svh, một ý chính mỗi màn, ảnh lớn xen kẽ với các trang chữ. Ảnh được đặt trong khung bo góc mềm có đổ bóng, khung co theo tỉ lệ thật của ảnh (không cắt ảnh cho vừa khung); ảnh chân dung cô dâu chú rể có thể bo vòm phía trên nhưng vẫn giữ nguyên tỉ lệ ảnh.
- Các section nối nhau bằng chuyển cảnh mềm: đường cong/sóng SVG, nền chuyển sắc kem hồng ↔ hồng phấn, nhánh hoa gối lên ranh giới hai section, không có đường kẻ cứng.
- Desktop: khung nội dung 900px ở giữa, hero và nền chuyển sắc phủ full-width; hai lề có line-art hoa rất mờ. Nội dung vẫn cảm giác như một tấm thiệp đặt giữa, không kéo giãn thành bố cục web nhiều cột; riêng cây thời gian câu chuyện tình yêu bố trí hai bên đường giữa, và cửa sổ "Xem tất cả" của album có thể nhiều cột.

**Chuyển động (chậm, ít, tinh tế)**
- Mọi animation vào cảnh: fade + trượt lên 16–24px, thời lượng 1.2–1.8s, easing mềm (ease-out), ngắt nhau (stagger) 150–250ms; chỉ chạy một lần khi vào khung hình.
- Không bounce, không xoay mạnh, không zoom gấp, không nhiều hiệu ứng đồng thời trong cùng một màn. Mỗi màn tối đa một chuyển động "nổi bật".
- Chuyển động nền liên tục chỉ giới hạn ở: trái tim rơi ở hero và hộp quà nhún nhẹ (biên độ ~6–8px, chu kỳ 3–4s).
- Tốc độ tự cuộn chậm (~30–40px/giây), điều chỉnh trong config.

**Chi tiết hoàn thiện**
- Ảnh bo nhẹ, đổ bóng rất mềm và rộng thay vì viền; hạt nhiễu (grain) rất mờ trên nền để giống giấy thiệp.
- Con trỏ, focus, popup QR và lightbox đều theo cùng gam màu, cùng easing chậm; popup QR trình bày như một tấm thiệp nhỏ (khung vàng mảnh, chữ viết tay "Hộp quà yêu thương").
- Ảnh tải lười (`loading="lazy"`, `decoding="async"`) trừ ảnh hero và ảnh đầu tiên của slide; không xử lý file ảnh (xem "Quy tắc về ảnh").

## Section (theo thứ tự)
1. Màn bìa toàn màn hình: tên cô dâu & chú rể, ngày cưới, dòng "Trân trọng kính mời / Thân mời" (kèm tên khách nếu có `?to=`) và nút "Mở thiệp". Các trái tim nhỏ (kích thước, tốc độ, độ trong suốt ngẫu nhiên) rơi liên tục từ đỉnh xuống đáy màn hình. Bấm "Mở thiệp": hiệu ứng mở (bìa tách/trượt ra), bật nhạc, hiện trang chính và bắt đầu tự cuộn.
   Mục menu **Thiệp cưới** bắt đầu từ khối đầu trang nội dung (mục 3 bên dưới).
2. Lời mời (+ tên khách từ `?to=`)
3. **Khối đầu trang nội dung — cô dâu chú rể** (theo code mẫu của người dùng): vùng cao tối thiểu 840px (≥768px: 900px, padding-top 210px / 330px); hai cụm hoa trang trí lớn (SVG vẽ theo màu theme, vị trí và góc xoay như mẫu, trôi nhẹ theo cuộn — parallax) ở phía sau; một dải trang trí ngang (rộng bằng khung 1000px, không rộng bằng màn hình) ở top 170px / 280px; hai ảnh polaroid nghiêng trong khung viền vàng 5px, tỉ lệ 2:3 — ảnh chú rể xoay −17° ở trên-trái, kèm vai trò (`role`) và tên (`name`, font viết tay hiện tại) bên phải; ảnh cô dâu xoay 13° ở dưới-phải, chữ bên trái, căn phải. Kích thước ảnh 155px (≥768px: 235px). Vùng bố cục 320×440px (≥768px: 500×640px). Bố mẹ và giới thiệu (`parents`, `bio`) hiển thị ở khối chữ ngay bên dưới.
4. Đếm ngược đến ngày cưới
5. **Thông tin lễ cưới**: ngày giờ lễ (số lớn kiểu thiệp), lịch tháng với ngày cưới khoanh trái tim, các mốc (đón khách, lễ thành hôn…), nút "Thêm vào lịch" (.ics).
6. **Câu chuyện tình yêu — cây thời gian (timeline)**: một "thân cây" là đường dọc mảnh màu vàng ánh kim chạy từ đầu đến cuối section; mỗi **mốc** là một nút tròn nhỏ (hoặc trái tim nhỏ) nằm trên đường, kèm nhãn thời gian viết tay (ví dụ "Tháng 6, 2021"), một **ảnh** và một **đoạn mô tả** của giai đoạn đó. Mỗi mốc là một khối độc lập.
   - Desktop: đường nằm giữa, các mốc xen kẽ trái/phải (ảnh một bên, chữ một bên, đổi bên ở mốc kế tiếp), một nhánh nhỏ nối nút vào khối. Mobile: đường nằm sát lề trái, nút trên đường, ảnh và chữ xếp dọc ở bên phải đường.
   - Đường kéo dài đúng bằng tổng chiều cao các mốc, nên thêm mốc thì cây dài ra và các khối bên dưới bị đẩy xuống, không vỡ layout. Đường có thể "vẽ dần" theo vị trí cuộn (tiến độ tô màu đỏ hồng), chậm và nhẹ.
   - Ảnh giữ nguyên tỉ lệ gốc (không cắt), chiều cao khối tự theo nội dung; đoạn mô tả dài hay ngắn đều được.
   - Mỗi mốc hiện dần chậm khi cuộn tới. Mốc có thể không có ảnh (chỉ chữ) hoặc không có chữ (chỉ ảnh).
   - Nếu `story.chapters` rỗng thì ẩn cả section và mục menu tương ứng. Ban đầu có 4 mốc dùng ảnh giữ chỗ.
7. **Album ảnh — slide tự động trượt + nút "Xem tất cả"**:
   - Slide là **vòng ảnh 3D** (coverflow): ảnh chính ở giữa, các ảnh khác xếp hai bên như một vòng quay — ảnh kế bên nghiêng 45° (lùi 150px, thu 0.85, mờ 0.75), tiếp theo 90°/135° (lùi sâu hơn, thu 0.7, mờ 0.5/0.3), xa hơn 3 bước thì ẩn; chuyển động 1.1s ease-in-out, `perspective: 1000px`. Độ dịch ngang của ảnh bên cạnh tính theo bề rộng của ảnh đang ở giữa nên ảnh khác tỉ lệ vẫn xếp đúng vòng. Khoảng 10 ảnh đầu (`album.sliderCount`), tự quay mỗi ~4.5s theo vòng; chiều cao khung 340px (mobile) / 520px (≥768px). Có nút trái/phải (chỉ ≥768px), chấm chỉ vị trí (chấm hiện tại dài hơn), vuốt ngang trên điện thoại (bỏ qua vuốt chéo); bấm ảnh bên cạnh thì quay tới ảnh đó, bấm ảnh chính thì mở lightbox. Rê chuột (chỉ chuột) hoặc chạm thì tạm dừng; cũng dừng khi tab ẩn, khi có popup mở hoặc khi slide ra khỏi màn hình. `prefers-reduced-motion`: không tự quay.
   - Mỗi ảnh hiển thị trọn vẹn theo tỉ lệ gốc (`object-fit: contain`, khung theo `aspect-ratio` thật của ảnh), không bị cắt hay méo.
   - Lightbox có số thứ tự "1 / N", mũi tên, vuốt, Esc và **dải ảnh thu nhỏ** bên dưới (ảnh hiện tại có viền); thumbnail là ô vuông nhỏ nên được cắt giữa ảnh, ảnh lớn thì không.
   - Bấm vào ảnh trên slide: mở lightbox xem ảnh lớn (←/→, vuốt, Esc, ✕).
   - Nút **"Xem tất cả"** dưới slide: mở cửa sổ toàn màn hình hiện toàn bộ ảnh trong `album.photos` (không giới hạn 10) dạng lưới masonry giữ tỉ lệ gốc, cuộn được; bấm một ảnh thì mở lightbox ở ảnh đó; đóng bằng ✕/Esc. Khi cửa sổ này mở thì tự cuộn trang tạm dừng.
   - Nếu `album.photos` rỗng thì ẩn cả section và mục menu; nếu ít hơn 2 ảnh thì không hiện mũi tên/chấm và không tự trượt.
8. **Thông tin tiệc cưới**: giờ, tên nhà hàng/địa điểm tiệc, dress code nếu có, kèm form **Xác nhận tham dự** (tên, số người, tham dự/không, lời nhắn; không lưu; nút Zalo).
9. **Địa chỉ**: địa chỉ chi tiết, Google Maps nhúng, nút "Chỉ đường"; tổ chức ở 2 nơi nên luôn có 2 địa điểm (nhà trai, nhà gái), mỗi nơi một thẻ với tên, địa chỉ, giờ, bản đồ Google Maps nhúng riêng và nút "Chỉ đường". Danh sách địa điểm khai báo dạng mảng trong `config.js`.
10. **Sổ lưu bút** (form tên + lời chúc ≤300 ký tự; danh sách mới nhất trước, "xem thêm"; realtime)
11. **Quà mừng** (hộp quà mừng cưới) (tham khảo code mẫu người dùng cung cấp): tiêu đề "Hộp Quà Mừng" + một hộp quà lớn ở giữa (khoảng 260×280px), chữ gợi ý "Nhấn để mở". Hộp tự nhún lên xuống nhẹ, bóng dưới chân co giãn theo, vài ngôi sao ✦ vàng nhấp nháy quanh hộp. Rê chuột vào (desktop) hoặc chạm (mobile) thì các hộp quà nhỏ quanh hộp bay lên và tan dần, kèm confetti/trái tim nhỏ bắn ra từ nắp. Bấm vào hộp thì mở popup (dạng bottom-sheet trên mobile, hộp giữa màn hình trên desktop) chứa QR của cả chú rể và cô dâu cạnh nhau: tên, ngân hàng, STK, chủ tài khoản, nút "Sao chép STK" và "Lưu QR" (tải ảnh). Đóng bằng nút ✕, bấm ra ngoài hoặc phím Esc.
    - Vì không có ảnh hộp quà, toàn bộ hộp quà, hộp quà nhỏ, confetti được vẽ bằng SVG/CSS theo gam đỏ hồng–vàng, không phụ thuộc file ảnh ngoài.
    - QR: file ảnh QR người dùng cung cấp đặt trong `assets/qr/` (không gọi API QR bên ngoài, vì trang tĩnh); ban đầu dùng QR giữ chỗ. Thông tin ngân hàng khai báo trong `config.js`.
12. Cảm ơn + chân trang

Cố định: nút bật/tắt nhạc và menu điều hướng.

## Menu điều hướng
Mục menu, theo đúng thứ tự trên trang: **Thiệp cưới**, **Thông tin lễ cưới**, **Câu chuyện tình yêu**, **Album ảnh**, **Thông tin tiệc cưới**, **Địa chỉ**, **Sổ lưu bút**, **Quà mừng**. Tên và thứ tự các mục khai báo trong `config.js`.
- **Chỉ hiện sau khi mở thiệp** (màn bìa sạch, không có menu).
- **Desktop (≥ 1024px):** sidebar dọc cố định bên trái màn hình, luôn hiển thị từ đầu đến cuối trang, không ẩn khi cuộn. Nội dung 900px vẫn căn giữa màn hình (menu nằm trong lề trái, không đẩy lệch nội dung). Thiết kế tối giản kiểu thiệp: nền trong suốt hoặc kính mờ hồng nhạt, mỗi mục là chấm nhỏ + chữ serif chữ hoa giãn cách; mục đang xem được tô đỏ hồng kèm đường kẻ vàng mảnh, các mục khác mờ. Đầu sidebar là monogram tên viết tắt hoặc ❦ trang trí.
- **Mobile/tablet nhỏ (< 1024px):** không hiện menu sẵn. Một nút tròn nhỏ (biểu tượng hoa/hai gạch) cố định ở góc, bấm thì mở menu dạng lớp phủ toàn màn hình nền kem hồng mờ, các mục xếp dọc căn giữa chữ viết tay/serif lớn, hiện dần chậm. Bấm một mục, bấm nút đóng hoặc bấm ra ngoài thì đóng. Nút nhạc đặt ở góc đối diện, không chồng lên nút menu.
- Bấm một mục: cuộn mượt đến section tương ứng. Trong lúc cuộn mượt, tự cuộn tạm dừng rồi tự chạy tiếp nếu trước đó đang chạy. Bấm vào menu không được tính là bấm "tạm dừng/chạy" của tự cuộn.
- Mục đang xem cập nhật theo vị trí cuộn (IntersectionObserver). Có hỗ trợ bàn phím và `aria-label`.

## Tự cuộn trang
- Sau khi mở thiệp, trang tự cuộn chậm từ trên xuống dưới (tốc độ không đổi, chỉnh được trong `config.js`), dừng ở cuối trang.
- Bấm vào vùng trống của màn hình: tạm dừng; bấm lần nữa: chạy tiếp. Có biểu tượng nhỏ hiện ngắn ("⏸ / ▶") để báo trạng thái.
- Bấm vào phần tử tương tác (nút, form, hộp quà, ảnh/lightbox, popup QR, link) thì không đổi trạng thái tự cuộn. Khi popup/lightbox mở hoặc khi người dùng đang nhập form thì tự cuộn tạm dừng, đóng lại thì tự chạy tiếp nếu trước đó đang chạy.
- Người dùng vẫn cuộn tay (chuột, chạm) được bình thường: tự cuộn không giành quyền điều khiển, sau khi dừng cuộn tay thì tự cuộn tiếp từ vị trí mới nếu đang ở trạng thái chạy.
- Tôn trọng `prefers-reduced-motion`: mặc định tắt tự cuộn.

## Hiệu ứng
Trái tim rơi ở màn bìa (canvas hoặc CSS, nhẹ), hộp quà nhún nhẹ và hộp quà nhỏ bay lên khi hover. Fade-up khi cuộn (IntersectionObserver), ảnh zoom nhẹ, hiệu ứng mở bìa kèm cánh hoa rơi, cánh hoa/lá rơi nền (ít, nhẹ), tên hiện dần, trái tim đập ở ngày cưới. Tôn trọng `prefers-reduced-motion`.

## Nội dung theo khối và layout co giãn
Mục tiêu: người dùng chỉ sửa `js/config.js` (text, đường dẫn ảnh), thêm hoặc bớt phần tử trong mảng mà layout vẫn đẹp, không vỡ, tự dài ra và đẩy các khối bên dưới xuống.

**Nguyên tắc nội dung**
- Mỗi section có một khối cấu hình riêng trong `config.js` (lời mời, cô dâu chú rể, lễ cưới, câu chuyện, album, tiệc cưới, địa chỉ, sổ lưu bút, quà mừng, cảm ơn), có chú thích tiếng Việt cho từng trường.
- Các danh sách là **mảng khối**: `story.chapters[]` (mỗi mốc: `date`, `title`, `text`, `photo`, `photoAlt`), `album.photos[]` (`src`, `alt`), `ceremony.timeline[]`, `venues.items[]`, `gift.people[]`, `guestbook.samples[]`, `menu[]`. Thêm một mốc/ảnh/địa điểm = thêm một object vào mảng, không phải động đến HTML hay CSS.
- Trường không bắt buộc (ví dụ `photo`, `title`, `text` của một mốc) có thể bỏ trống; khối tự thu gọn tương ứng. Mảng rỗng thì section và mục menu của nó tự ẩn.
- Văn bản trong config là văn bản thường: xuống dòng bằng `\n`, không cho phép HTML (dùng `textContent`) để không vỡ trang và không có lỗ hổng chèn mã.

**Nguyên tắc layout co giãn**
- Không đặt chiều cao cố định cho khối nội dung; dùng `min-height` cho section, chiều cao theo nội dung, khoảng cách bằng `gap`/`padding` theo `clamp()`.
- Văn bản dài: `overflow-wrap: anywhere`, dòng tự xuống; ảnh luôn `max-width: 100%`, `height: auto`.
- Các khối xếp theo luồng dọc; thêm nội dung chỉ làm trang dài ra. Menu, scrollspy, tự cuộn và hiệu ứng hiện dần phải hoạt động với bất kỳ số khối nào (tính toán từ DOM đã render, không hard-code vị trí/chiều cao).
- Kiểm thử bằng bộ dữ liệu cực trị: 1 mốc, 12 mốc, đoạn chữ 1 dòng và 500 chữ, ảnh dọc/ngang/vuông, không ảnh, mảng rỗng.

## Quy tắc về ảnh
- **Không xử lý file ảnh**: giữ nguyên kích thước (px), độ phân giải, định dạng và chất lượng gốc; không resize, không nén lại, không crop, không đổi sang WebP, không tạo bản nhỏ. Người dùng tự đặt ảnh gốc vào `assets/images/` và khai báo trong config.
- Hiển thị: ảnh trong câu chuyện, album, lightbox và "Xem tất cả" hiện theo tỉ lệ thật, không cắt (kích thước hiển thị do CSS co giãn theo khung, không đổi file). Ngoại lệ duy nhất: **ảnh nền hero** dùng `background-size: cover` vì phải phủ kín màn hình (file vẫn nguyên gốc, chỉ phần hiển thị bị che bớt ở mép).
- Hệ quả cần biết: ảnh gốc lớn (vài MB mỗi ảnh) làm trang tải chậm hơn trên 4G và tốn dữ liệu của khách; giảm nhẹ bằng `loading="lazy"`, `decoding="async"`, chỉ tải ảnh khi gần vào khung hình, slide chỉ tải ảnh kế tiếp. Kích thước repo cũng tăng theo dung lượng ảnh gốc.
- Các ảnh hiện có trong `assets/images/` (hero.jpg, couple-1..4.jpg) là ảnh giữ chỗ đã được thu nhỏ/cắt từ ảnh cá nhân; sẽ được thay bằng ảnh gốc của người dùng sau.

## Cấu trúc
```
index.html
css/tokens.css, hero.css, sections.css, timeline.css, album.css, menu.css, gift.css
js/config.js        # toàn bộ nội dung + cấu hình Firebase (theo khối, có chú thích)
js/render.js        # đổ config vào DOM, ẩn section khi mảng rỗng
js/hero.js, reveal.js, countdown.js, calendar.js, timeline.js, slider.js, lightbox.js, gallery.js
js/menu.js, music.js, autoscroll.js, gift.js, guestbook.js, rsvp.js, main.js
js/lib/             # hàm thuần có test (date, text, autoscroll-state)
assets/images, audio, qr
firestore.rules
README.md           # đổi nội dung, tạo Firebase, rules, deploy
```

## Sổ lưu bút – chi tiết
- Collection `guestbook`, document: `name` (string ≤50), `message` (string ≤300), `createdAt` (server timestamp).
- Firestore rules: cho phép `read` và `create` công khai với kiểm tra độ dài/kiểu trường; cấm `update`/`delete`.
- Client: escape nội dung khi render (chống XSS, dùng `textContent`), chặn gửi rỗng, giới hạn tần suất gửi phía client (ví dụ 1 lần/30s qua localStorage).
- Fallback: nếu Firebase chưa cấu hình/lỗi mạng, hiển thị lời chúc mẫu trong config và thông báo nhẹ khi gửi không được.
- Khoá cấu hình Firebase là công khai, an toàn nhờ rules.

## Kiểm thử
Web tĩnh nên kiểm thử thủ công: chạy server tĩnh cục bộ, kiểm tra responsive (điện thoại/desktop), luồng mở bìa, `?to=`, đếm ngược, lightbox, RSVP, gửi/hiển thị lời chúc (Firestore emulator hoặc project thật), reduced-motion.

## Ngoài phạm vi
Backend riêng, CMS, đăng nhập, quản trị lời chúc trong web (quản lý qua Firebase console), lưu RSVP.
