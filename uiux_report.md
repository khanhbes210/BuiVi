# 🏛️ BÁO CÁO ĐÁNH GIÁ TOÀN DIỆN UI/UX & THIẾT KẾ – WEBSITE BÙI VỊ (BUIVI2.0)

> **Người thực hiện:** Senior Frontend & UI/UX Specialist  
> **Thời điểm review:** Tháng 10/2026  
> **Môi trường thử nghiệm:** Vite Dev Server chạy trực tiếp (`http://localhost:3002/`)  
> **Thiết bị kiểm thử:** Desktop (1920×1080, 1440×900, 1280×800) & Mobile (iPhone 14 / 390×844)  
> **Nguyên tắc:** **Đánh giá khách quan, chi tiết, KHÔNG tự ý chỉnh sửa source code.**

---

## 📑 MỤC LỤC
1. [Tóm Tắt Tổng Quan & Điểm Đánh Giá](#1-tóm-tắt-tổng-quan--điểm-đánh-giá)
2. [Ma Trận Phân Loại Vấn Đề (P0 – P3)](#2-ma-trận-phân-loại-vấn-đề-p0--p3)
3. [Đánh Giá Chi Tiết Theo 10 Khía Cạnh UI/UX](#3-đánh-giá-chi-tiết-theo-10-khía-cạnh-uiux)
4. [Đánh Giá Trực Quan Từng Trang (Kèm Hình Ảnh Thực Tế)](#4-đánh-giá-trực-quan-từng-trang-kèm-hình-ảnh-thực-tế)
5. [Đánh Giá Trải Nghiệm Mobile (Responsive)](#5-đánh-giá-trải-nghiệm-mobile-responsive)
6. [Kế Hoạch & Đề Xuất Khắc Phục Từng Bước](#6-kế-hoạch--đề-xuất-khắc-phục-từng-bước)

---

## 1. TÓM TẮT TỔNG QUAN & ĐIỂM ĐÁNH GIÁ

Website **Bùi Vị (buivi2.0)** được xây dựng với định vị là thương hiệu **Quà biếu Di sản Nem Kinh Bắc kết hợp nghệ thuật tranh Đông Hồ & Giấy Điệp**. Thiết kế mang đậm phong cách truyền thống, sử dụng bảng màu di sản rất tốt (Đỏ Heritage `#951722`, Xanh Forest `#1F3D2A`, Kem giấy Điệp `#FFF5E4`, Vàng kim `#F3D27A`).

| Khía cạnh | Điểm (Thang 10) | Nhận xét nhanh |
|---|:---:|---|
| **1. Visual Design & Brand Identity** | **8.5/10** | Bản sắc văn hóa Kinh Bắc rất rõ nét, khung viền kép, họa tiết trang nhã, màu sắc đậm chất truyền thống. |
| **2. Layout & Bố cục** | **7.5/10** | Cấu trúc cân đối trên Desktop, tuy nhiên một số trang còn bị chiếm diện tích bởi banner placeholder rỗng. |
| **3. Typography** | **6.5/10** | Font Yeseva One rất sang trọng, nhưng việc khóa cứng trọng số (`font-weight: 500 !important`) làm mất đi cấp bậc tương phản (hierarchy). |
| **4. Spacing & Whitespace** | **8.0/10** | Khoảng cách các section thoáng đãng, lề chuẩn desktop. |
| **5. Màu sắc & Tương phản** | **8.5/10** | Bảng màu hài hòa, phối màu đỏ trầm và xanh rêu rất sang trọng, độ tương phản đọc tốt. |
| **6. Trải nghiệm Mobile (Responsive)** | **7.0/10** | Sticky CTA dưới đáy tốt, nhưng thanh thumbnail ảnh quá bé và menu có chỗ bị cắt chữ. |
| **7. Luồng mua hàng & Chuyển đổi (UX Flows)** | **6.5/10** | Giỏ hàng và tính toán ưu đãi mượt, nhưng màn hình Thanh toán có 2 nút CTA trùng nhau và lộ toggle kiểm thử. |
| **8. Nội dung & Copywriting** | **7.0/10** | Câu chuyện thương hiệu trau chuốt, nhưng trang Liên hệ còn để lộ văn bản mẫu `[Có thể chỉnh sửa]`. |
| **9. Accessibility (Khả năng tiếp cận)** | **7.5/10** | Hỗ trợ `prefers-reduced-motion`, ARIA labels khá đủ; thiếu nút Copy mã VietQR nhanh. |
| **10. Hiệu ứng & Animation** | **8.0/10** | Micro-interactions thú vị (sheen giấy điệp, lắc giỏ hàng); cần tinh giản bớt số lượng chuyển động nền. |
| **TỔNG THỂ** | **7.5/10** | **Nền tảng xuất sắc, cần tinh chỉnh các chi tiết vận hành & hoàn thiện nội dung trước khi ra mắt chính thức.** |

---

## 2. MA TRẬN PHÂN LOẠI VẤN ĐỀ (P0 – P3)

```mermaid
quadrantChart
    title Ma Trận Mức Độ Ưu Tiên & Ảnh Hưởng
    x-axis Độ phức tạp xử lý: Thấp --> Cao
    y-axis Mức độ ảnh hưởng: Thấp --> Nghiêm trọng
    quadrant-1 Triển khai có kế hoạch
    quadrant-2 ƯU TIÊN SỬA NGAY (Quick Fixes)
    quadrant-3 Cải tiến sau (Polish)
    quadrant-4 Tối ưu hóa sâu
    "Dev toggle thanh toán lộ ngoài": [0.15, 0.95]
    "Text [Có thể chỉnh sửa]": [0.10, 0.90]
    "Slot placeholder lộ ID kỹ thuật": [0.25, 0.85]
    "Thiếu nút Copy VietQR": [0.20, 0.80]
    "2 nút CTA trùng trên Checkout": [0.15, 0.75]
    "Khóa cứng font-weight 500": [0.45, 0.70]
    "Placeholder 1920x800 chiếm màn hình": [0.35, 0.72]
    "Quá nhiều CTA trên Hero": [0.30, 0.60]
    "Thumbnail mobile dưới 44px": [0.35, 0.55]
    "Trùng lặp PageNavBar & Header": [0.40, 0.50]
```

---

## 3. ĐÁNH GIÁ CHI TIẾT THEO 10 KHÍA CẠNH UI/UX

### 3.1. Visual Design (Thẩm mỹ & Nhận diện thương hiệu)
* **Điểm mạnh:**
  - Ngôn ngữ thiết kế đậm chất văn hóa Đông Hồ: Đường viền kép `double-border-heritage` và `double-border-forest` tạo cảm giác trang trọng như khung tranh gỗ hoặc hộp quà truyền thống.
  - Phối hợp khéo léo giữa hoa văn giấy Điệp ánh xà cừ và đồ họa hộp quà lục giác độc bản.
* **Điểm cần khắc phục:**
  - **Slot Placeholder lộ mã code:** Khi bật `SHOW_ANIMATION_PLACEHOLDERS = true`, người dùng thấy các ô viền nét đứt kèm dòng chữ kỹ thuật: `Slot ID: home-hero-ornament`, `Hỗ trợ Lottie JSON / WebM / MP4 / SVG`. Điều này làm mất đi tính chuyên nghiệp của một website quà tặng cao cấp.
  - **Banner rỗng chiếm trọn tầm mắt đầu trang:** Ở `/khuyen-mai` và `/ve-bui-vi`, một hộp xám viền đỏ kích thước lớn 1920×800 nằm ngay dưới menu khiến khách hàng phải cuộn một đoạn dài mới thấy nội dung chính.

### 3.2. Layout & Bố cục
* **Điểm mạnh:**
  - Grid 12 cột chuẩn, tỷ lệ 2 cột tại Hero và trang chi tiết sản phẩm (58% gallery bên trái, 42% order panel sticky bên phải) rất hiện đại và hợp lý cho desktop.
* **Điểm cần khắc phục:**
  - **Trùng lặp thanh điều hướng phụ (`PageNavBar`):** Ở các trang danh mục, giỏ hàng, thanh `<- Quay lại | Trang chủ` xuất hiện ngay sát dưới thanh Header chính (vốn đã có logo để bấm về trang chủ), làm tốn mất 60px chiều cao màn hình quý giá.
  - **Hai nút giỏ hàng cùng tồn tại:** Khi cuộn trang qua 300px, cả nút Giỏ hàng trên Header sticky và nút Giỏ hàng nổi (Floating Cart) ở góc phải dưới đều cùng hiển thị, gây dư thừa giao diện.

### 3.3. Typography (Kiểu chữ & Cấp bậc phân cấp)
* **Điểm mạnh:**
  - Tiêu đề dùng font có chân cổ điển `Yeseva One`, tạo cảm giác hoàng gia, truyền thống Kinh Bắc. Thân chữ dùng `Montserrat` hiện đại, dễ đọc tiếng Việt có dấu.
* **Điểm cần khắc phục (RẤT QUAN TRỌNG):**
  - **Khóa cứng trọng số (`font-weight: 500 !important`):** Trong file `src/index.css`, tất cả các thẻ `p`, `span`, `div`, `strong`, `b`, và các class `font-bold`, `font-semibold` đều bị ép cứng về `font-weight: 500`. Hậu quả là:
    - Chữ in đậm (`strong`, `font-bold`) không thể đậm hơn bình thường.
    - Tiêu đề sản phẩm, giá tiền và mô tả phụ nhìn đều đều nhau, làm suy yếu thị giác phân cấp (Visual Hierarchy).
  - **Cưỡng ép kích cỡ tối thiểu 14px cho micro-labels:** Các nhãn nhỏ như badge `-9%`, chỉ số ảnh `1/5`, số lượng `x1` trong thẻ con bị phóng to lên 14px, làm vỡ tỷ lệ cân đối của các badge nhỏ.

### 3.4. Spacing & Whitespace
* Nhìn chung padding và margin rất thoáng (khoảng 32px – 48px giữa các khối). Không gian đệm vừa phải, không bị ngộp thở.

### 3.5. Colors & Độ tương phản (WCAG)
* **Màu sắc chủ đạo:**
  - Đỏ Heritage (`#951722`) và Đỏ Chu sa (`#9B0514`): Quyến rũ, may mắn, kích thích mua sắm.
  - Xanh Rêu (`#1F3D2A`): Vững chãi, tự nhiên, tượng trưng cho làng nghề và lá chuối ủ nem.
  - Vàng Kim (`#F3D27A` / `#B8860B`): Sang trọng, quyền quý.
  - Màu nền Giấy Điệp (`#FFF5E4`): Êm dịu cho mắt, không bị chói như màu trắng tinh (`#FFFFFF`).
* Độ tương phản giữa chữ và nền đều đạt chuẩn WCAG AA (độ tương phản trên 4.5:1).

### 3.6. Trải nghiệm Mobile (Responsive)
* **Điểm mạnh:**
  - Drawer menu mở mượt mà, phân cấp danh mục theo Accordion rõ ràng.
  - Trang chi tiết sản phẩm có thanh CTA cố định dưới chân (Sticky Bottom Bar) hiển thị tổng tiền và 2 nút "Thêm vào giỏ" / "Mua ngay".
* **Điểm cần khắc phục:**
  - **Kích thước Thumbnail gallery quá bé:** 5 ảnh con chỉ rộng khoảng 32px, nằm san sát nhau, rất khó chạm chính xác trên ngón tay cảm ứng (chuẩn Apple HIG và Google Material khuyến nghị tối thiểu 44×44px hoặc 48×48px).
  - **Tên sản phẩm bị cắt ngắn trong menu:** Hạng mục `Combo 3 hộp quà (Trọn bộ 3 Set Di...` bị mất chữ do không gian flexbox quá hẹp.
  - **Thiếu safe-area-inset cho iPhone:** Nút bấm dưới đáy cần thêm `padding-bottom: env(safe-area-inset-bottom)` để tránh bị thanh điều hướng Home của iOS che khuất.

### 3.7. Luồng mua hàng & Tối ưu tỷ lệ chuyển đổi (UX Flows)
* **Điểm mạnh:**
  - Thanh tiến trình miễn phí vận chuyển ("Mua thêm 210.000đ để được Freeship") kích thích khách mua thêm sản phẩm rất hiệu quả.
  - Tính năng tự động áp voucher thông minh (`VoucherBox`), hiển thị rõ số tiền tiết kiệm được.
* **Điểm cần khắc phục:**
  - **Trang Thanh toán có 2 nút CTA giống hệt nhau:** Trong cùng một màn hình thanh toán VietQR, có tới hai nút màu đỏ cùng mang tên `Tôi đã chuyển khoản` (một nút nằm trong hộp QR, một nút nằm ở thanh tổng kết bên phải). Khách hàng sẽ bối rối không biết nên nhấn nút nào.
  - **Thiếu nút sao chép (Copy) thông tin tài khoản:** Khi khách hàng chuyển khoản thủ công, họ phải ghi nhớ hoặc bôi đen thủ công số tài khoản `0988688999` và nội dung chuyển khoản `BV26106500 SDT`. Nếu có nút "Sao chép" 1 chạm, tỷ lệ thanh toán thành công sẽ tăng đáng kể.
  - **Tên bước trong Stepper không đồng nhất:**
    - Ở Giỏ hàng: Bước 3 ghi là `Thanh toán QR / COD`.
    - Ở Thanh toán: Bước 3 lại ghi là `3. Thanh toán hoàn tất`.

### 3.8. Nội dung & Biên tập (Content Integrity)
* **Vấn đề nghiêm trọng:** Trang Liên hệ (`/lien-he`) đang hiển thị công khai các chuỗi dữ liệu giữ chỗ chưa hoàn thiện:
  - `Điểm giới thiệu quà biếu Bùi Vị – Cơ sở 2 [Có thể chỉnh sửa]`
  - `[Địa chỉ cơ sở 2 – có thể chỉnh sửa]`
  - `[Số điện thoại liên hệ – có thể chỉnh sửa]`
  - `Bản đồ: [Tọa độ bản đồ – có thể chỉnh sửa]`
  *(Điều này cần được thay bằng địa chỉ thực tế hoặc ẩn tạm thời 2 cơ sở này trước khi công khai).*

---

## 4. ĐÁNH GIÁ TRỰC QUAN TỪNG TRANG (KÈM HÌNH ẢNH THỰC TẾ)

### 4.1. Trang Chủ (HomePage)

![Giao diện đầu Trang chủ Bùi Vị](file:///C:/Users/khanh/.gemini/antigravity-ide/brain/5ca79d4c-303f-41e8-89cd-e47c8248665d/homepage_view_1792682333649.png)

* **Phân tích:**
  - **Header:** Thanh thông báo màu xanh rêu trên cùng chạy xoay vòng voucher rất thu hút. Hotline và nút "Xem chi tiết ưu đãi" rõ ràng.
  - **Hero Title:** Dòng chữ Yeseva One "Từ Vị Bùi Thính Gạo Quê Nhà Đến Tác Phẩm Di Sản Đông Hồ" có độ thẩm mỹ rất cao.
  - **Vấn đề:** Khung viền đứt "Khu vực chèn Animation – Hoạ tiết Đông Hồ Hero (Slot ID: home-hero-ornament)" xuất hiện ngay dưới câu slogan, gây cảm giác trang web đang làm dở.

![Khu vực giữa Trang chủ Bùi Vị](file:///C:/Users/khanh/.gemini/antigravity-ide/brain/5ca79d4c-303f-41e8-89cd-e47c8248665d/homepage_scrolled_1792682340720.png)

* **Phân tích:**
  - **Bên trái:** Có quá nhiều nút kêu gọi hành động (CTA) dồn cục: `Mua ngay ->`, `Thêm vào giỏ`, `Khám phá 7 sản phẩm`, ngay dưới đó lại có thêm một banner xanh với `Xem chi tiết ưu đãi` và `Mua ngay ->`. Khách hàng dễ bị quá tải lựa chọn (choice overload).
  - **Bên phải:** Banner chính kích thước 1920×800 hiện tại chỉ là placeholder text hướng dẫn kỹ thuật `Đặt file tại /public/media/home-hero-banner.jpg`.

---

### 4.2. Trang Danh Sách Sản Phẩm (ProductListPage)

![Giao diện Trang danh mục sản phẩm](file:///C:/Users/khanh/.gemini/antigravity-ide/brain/5ca79d4c-303f-41e8-89cd-e47c8248665d/product_list_page_1792682349990.png)

* **Phân tích:**
  - Thanh tab chuyển đổi "Sản phẩm" / "Set quà biếu Bùi Vị" dạng viên thuốc (pill) thiết kế rất đẹp.
  - Ô tìm kiếm to rõ, kèm số đếm sản phẩm `Tìm thấy 3 sản phẩm`.
  - **Vấn đề:** Ngay dưới thanh tab lại có một banner xanh lặp lại y nguyên thông báo ở Top bar (`Nhập BUIVI10 – Giảm 10%...`). Việc lặp lại liên tiếp 2 lần cùng một nội dung trên cùng màn hình tạo cảm giác trùng lặp không cần thiết.

---

### 4.3. Trang Chi Tiết Sản Phẩm (ProductDetailPage)

![Giao diện Chi tiết sản phẩm Bùi Vị](file:///C:/Users/khanh/.gemini/antigravity-ide/brain/5ca79d4c-303f-41e8-89cd-e47c8248665d/product_detail_page_1792682360784.png)

* **Phân tích:**
  - Bảng đặt hàng bên phải (Order Panel) cực kỳ chuyên nghiệp: Có huy hiệu "Bán chạy", tên nem, quy cách đóng gói, giá nổi bật.
  - Nút tùy chọn đóng gói theo từng dòng rất trực quan.
  - Bộ 5 Accordion bên dưới (Câu chuyện hộp quà, Hướng dẫn thưởng thức, Hạn sử dụng, Chính sách vận chuyển) cung cấp đầy đủ thông tin giúp tăng độ tin cậy.

---

### 4.4. Giỏ Hàng & Màn Hình Thanh Toán (Cart & Checkout)

![Giao diện Giỏ hàng](file:///C:/Users/khanh/.gemini/antigravity-ide/brain/5ca79d4c-303f-41e8-89cd-e47c8248665d/cart_page_1792682373429.png)

![Giao diện Thanh toán](file:///C:/Users/khanh/.gemini/antigravity-ide/brain/5ca79d4c-303f-41e8-89cd-e47c8248665d/checkout_page_1792682388111.png)

![Chi tiết mã VietQR và toggle thử nghiệm tại trang thanh toán](file:///C:/Users/khanh/.gemini/antigravity-ide/brain/5ca79d4c-303f-41e8-89cd-e47c8248665d/checkout_dev_toggle_1792682568459.png)

* **Phân tích chi tiết lỗi Thanh Toán:**
  1. **Lỗi nghiêm trọng (P0):** Nút checkbox `[ ] Chế độ kiểm thử: Mô phỏng giao dịch thanh toán thất bại` nằm ngay dưới phần thanh toán VietQR. Người mua hàng nhìn thấy dòng này sẽ mất lòng tin vào hệ thống thanh toán tự động.
  2. **Trùng lặp 2 nút CTA (P1):** Nút đỏ `Tôi đã chuyển khoản` ở cột trái và nút đỏ `Tôi đã chuyển khoản` ở cột phải nằm cạnh nhau.
  3. **Thiếu nút Copy số tài khoản (P1):** Thông tin Vietcombank `0988688999` và `BV26106500 SDT` chưa có nút "Copy" 1 chạm.

---

### 4.5. Trang Khuyến Mãi & Giới Thiệu (Promotions & About)

![Banner placeholder rỗng tại Trang Khuyến Mãi](file:///C:/Users/khanh/.gemini/antigravity-ide/brain/5ca79d4c-303f-41e8-89cd-e47c8248665d/promotions_page_1792682404497.png)

* **Phân tích:** Khung placeholder khổng lồ chiếm trọn màn hình đầu trang, đẩy toàn bộ nội dung chương trình khuyến mãi xuống dưới nếp gấp (below the fold).

---

### 4.6. Trang Liên Hệ & Hệ Thống Cửa Hàng (ContactPage)

![Văn bản giữ chỗ chưa sửa tại trang liên hệ](file:///C:/Users/khanh/.gemini/antigravity-ide/brain/5ca79d4c-303f-41e8-89cd-e47c8248665d/contact_store_locations_1792682590739.png)

* **Phân tích (Lỗi P0):** Các thông tin liên hệ Cơ sở 2 và Cơ sở 3 hiển thị nguyên văn các chuỗi `[Có thể chỉnh sửa]`, `[Địa chỉ cơ sở 2 – có thể chỉnh sửa]`, `[Tọa độ bản đồ – có thể chỉnh sửa]`. Cần cập nhật thông tin chuẩn hoặc ẩn bớt chi nhánh chưa mở.

---

### 4.7. Chân Trang (Footer)

![Chân trang Bùi Vị](file:///C:/Users/khanh/.gemini/antigravity-ide/brain/5ca79d4c-303f-41e8-89cd-e47c8248665d/homepage_footer_actual_1792682682671.png)

* **Phân tích:**
  - Bố cục 4 cột màu xanh rêu (`#1F3D2A`) kết hợp chữ vàng kim và kem rất bề thế, sang trọng.
  - Có đầy đủ các nút mạng xã hội (Facebook, Zalo, TikTok, Instagram).
  - **Điểm trừ nhỏ:** Dòng chữ `Phông chữ: Yeseva One, Montserrat (SIL Open Font License)` hiển thị dưới chân trang là thông tin kỹ thuật không cần thiết đối với khách mua hàng.

---

## 5. ĐÁNH GIÁ TRẢI NGHIỆM MOBILE (RESPONSIVE)

| Màn hình Mobile Drawer Menu | Màn hình Sticky CTA Chi tiết sản phẩm |
|:---:|:---:|
| ![Mobile Drawer](file:///C:/Users/khanh/.gemini/antigravity-ide/brain/5ca79d4c-303f-41e8-89cd-e47c8248665d/mobile_nav_menu_open_1792682753817.png) | ![Mobile Sticky CTA](file:///C:/Users/khanh/.gemini/antigravity-ide/brain/5ca79d4c-303f-41e8-89cd-e47c8248665d/mobile_product_detail_sticky_cta_1792682774817.png) |

* **Đánh giá trên Mobile (iPhone 14 / Viewport 390×844):**
  - **Menu mở:** Danh mục sản phẩm mở dạng accordion có sẵn giá và badge bán chạy rất tiện lợi. Điểm trừ: Dòng cuối `Combo 3 hộp quà (Trọn bộ 3 Set Di...` bị cắt chữ.
  - **Sticky Bottom Bar:** Giúp người dùng lướt xem ảnh thoải mái mà vẫn có thể bấm "Mua ngay" hoặc "Thêm vào giỏ" bất cứ lúc nào mà không cần cuộn ngược lên đầu.
  - **Thanh thumbnail trên mobile:** Quá bé (khoảng 32px), cần tăng kích thước để dễ dùng cảm ứng hơn.

---

## 6. KẾ HOẠCH & ĐỀ XUẤT KHẮC PHỤC TỪNG BƯỚC

Dưới đây là các khuyến nghị xử lý theo thứ tự ưu tiên mà không làm thay đổi kiến trúc hệ thống:

### Giai đoạn 1: Sửa chữa các lỗi quan trọng (P0 & P1 - Ưu tiên hàng đầu)
1. **Ẩn hoàn toàn Developer Toggle trên trang thanh toán:** Xóa hoặc đặt điều kiện `import.meta.env.DEV` để checkbox mô phỏng lỗi không hiển thị cho người dùng thực.
2. **Cập nhật dữ liệu tại `siteConfig.ts`:**
   - Thay thế toàn bộ chuỗi text `[Có thể chỉnh sửa]` bằng địa chỉ thực tế, hoặc cấu hình chỉ hiển thị Cơ sở 1 (Làng nghề Bùi Xá, Bắc Ninh) nếu các chi nhánh khác chưa khai trương.
3. **Điều chỉnh hiển thị MediaSlot & AnimationSlot:**
   - Tắt chế độ hiển thị khung giữ chỗ kỹ thuật (`SHOW_ANIMATION_PLACEHOLDERS = false`) để web hiển thị giao diện mượt mà, không lộ các dòng chữ debug slot ID.
   - Với các banner 1920×800 chưa có ảnh, nên ẩn khối banner hoặc hiển thị một poster đồ họa Đông Hồ có sẵn thay vì ô rỗng.
4. **Tối ưu UX Trang Thanh Toán (VietQR):**
   - Thêm nút **Sao chép** (Copy to clipboard) cạnh Số tài khoản và Nội dung chuyển khoản kèm thông báo toast "Đã sao chép".
   - Loại bỏ nút `Tôi đã chuyển khoản` trùng lặp ở cột bên trái, chỉ giữ lại một nút chính rõ ràng ở cột tóm tắt bên phải.

### Giai đoạn 2: Cân chỉnh Typography & Phân cấp thị giác (P2)
1. **Giải phóng ràng buộc `font-weight: 500 !important` trong `index.css`:**
   - Cho phép các tiêu đề thẻ, giá tiền, badge sử dụng trọng số `font-semibold` (600) hoặc `font-bold` (700) để tạo độ tương phản đậm/nhạt rõ ràng, giúp mắt người đọc quét thông tin nhanh hơn.
2. **Loại bỏ cưỡng ép 14px cho badge siêu nhỏ:**
   - Cho phép các nhãn nhỏ như `-9%`, `x1` giữ cỡ 11px - 12px để không bị thô kệch so với khung chứa.
3. **Tinh gọn số lượng nút CTA trên Hero Trang chủ:**
   - Giữ lại 1 nút Primary (`Mua ngay`) và 1 nút Secondary (`Khám phá bộ sưu tập`), lược bớt nút phụ thứ 3 để tránh làm phân tán sự chú ý của khách hàng.

### Giai đoạn 3: Tối ưu Mobile & Hoàn thiện giao diện (P3)
1. **Tăng kích thước touch target của thumbnail ảnh trên mobile:** Tối thiểu 44×44px.
2. **Thêm `env(safe-area-inset-bottom)`:** Đảm bảo thanh CTA đáy không bị cấn thanh điều hướng trên iPhone.
3. **Lược bỏ dòng thông tin bản quyền phông chữ ở chân trang:** Giữ footer gọn gàng và tập trung vào các cam kết thương hiệu.

---
> 💡 *Bản báo cáo này đã hoàn thành dựa trên việc chạy thực tế toàn bộ ứng dụng và kiểm thử chi tiết. Code của bạn được giữ nguyên trạng thái nguyên bản 100%.*