# Hoàn Thiện Đồng Bộ Hệ Thống Box, Quick-View Modal, Dropdown Bùi Vị & Bộ Sắp Xếp Sản Phẩm

Kế hoạch này chuẩn hóa toàn diện kích thước các thẻ/box trên toàn website (đảm bảo chiều cao đồng nhất và 2 nút hành động luôn nằm gọn trên 1 hàng), bổ sung nút **“Xem nhanh” (Quick-View Modal)** khi di chuột lên ảnh sản phẩm, đồng bộ tất cả ô chọn **Tỉnh / Thành phố** sang menu thả xuống tùy chỉnh mang bảng màu di sản Bùi Vị, và nâng cấp trang Danh sách sản phẩm với bộ sắp xếp thông minh kèm hiệu ứng chuyển tab mượt mà.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Toàn bộ 4 quyết định thiết kế và trải nghiệm tương tác bên dưới đã được xác nhận theo lựa chọn của bạn:

- **Quyết định 1 — Chuẩn hóa hệ thống Box & 2 nút hành động (`ProductCard`, Cam kết, Hành trình, Bài viết)**: Khóa chiều cao đồng nhất (`h-full flex flex-col justify-between`) cho tất cả các thẻ trong cùng một lưới trên mọi trang (`/`, `/san-pham`, `/ve-bui-vi`, `/bai-viet`, `/lien-he`). Chuyển cụm 2 nút *“Thêm vào giỏ”* và *“Mua ngay”* trên `ProductCard` sang bố cục lưới 2 cột (`grid-cols-2 gap-2.5 min-w-0`) để 2 nút luôn nằm trên cùng 1 hàng, không bao giờ bị rớt dòng hay tràn khung kể cả trong lưới 4 cột.
- **Quyết định 2 — Nút “Xem nhanh” (Quick-View Modal) khi hover trên `ProductCard`**: Khi người dùng di chuột vào khung ảnh sản phẩm (hoặc bấm nút kính lúp trên thiết bị cảm ứng), nút **“Xem nhanh”** nổi lên mượt mà; bấm vào sẽ mở hộp thoại xem nhanh ngay trên trang hiện tại với bộ 4 góc ảnh, chọn quy cách đóng gói, tăng/giảm số lượng, giá ưu đãi và nút *“Thêm vào giỏ”* / *“Mua ngay”*.
- **Quyết định 3 — Đồng bộ Menu thả xuống Tỉnh / Thành phố phong cách Bùi Vị**: Thay thế toàn bộ thẻ `<select>` mặc định của trình duyệt tại Bước 2 Thanh toán (`/thanh-toan`) và biểu mẫu Sổ địa chỉ (`/tai-khoan/dia-chi`) bằng menu thả xuống tùy chỉnh mang sắc thái giấy Điệp – Đỏ Di Sản – Xanh Rừng Kinh Bắc, hỗ trợ tìm kiếm nhanh hoặc chọn trực tiếp kèm dấu tích xác nhận.
- **Quyết định 4 — Bộ sắp xếp sản phẩm & Chuyển tab mượt trên `/san-pham`**: Bổ sung menu thả xuống sắp xếp (*Mặc định di sản*, *Giá: Thấp đến cao*, *Giá: Cao đến thấp*, *Mức tiết kiệm cao nhất*, *Bán chạy nhất*) đặt cạnh thanh tìm kiếm, kết hợp hiệu ứng crossfade và stagger mượt khi chuyển đổi giữa tab *“Sản phẩm”* và *“Set quà biếu Bùi Vị”*.

---

## 1. Overview & Core Concept

- **Mục tiêu trải nghiệm**: Mang lại cảm giác chỉn chu, đồng nhất tuyệt đối trên từng khung hình — từ chiều cao các thẻ sản phẩm, thẻ bài viết, thẻ cam kết chất lượng cho đến từng ô chọn thả xuống và chuyển động mở hộp thoại Xem nhanh.
- **Đối tượng phục vụ**: Khách hàng cá nhân và doanh nghiệp tìm mua Nem Kinh Bắc truyền thống hoặc Set quà biếu giấy Điệp Đông Hồ, cần so sánh nhanh quy cách/giá bán và thao tác đặt hàng liền mạch trên cả máy tính lẫn điện thoại.
- **Giá trị cốt lõi**:
  1. **Không lệch dòng, không tràn nút**: Mọi hàng thẻ sản phẩm (dù có giá gốc gạch ngang hay không) đều thẳng hàng đáy, đường kẻ giá và cụm 2 nút CTA.
  2. **Xem nhanh không rời trang**: Khách có thể xem 4 góc ảnh thực tế và chọn quy cách đóng gói ngay trong hộp thoại Quick-View mà không mất vị trí cuộn trang.
  3. **Đồng bộ nhận diện Bùi Vị 100%**: Loại bỏ hoàn toàn các menu `<select>` mặc định thô cứng của hệ điều hành trên toàn bộ luồng mua hàng và tài khoản.

---

## 2. User Experience & Visual Design

### A. Chuẩn hóa Chiều cao Box & Cụm 2 Nút CTA trên `ProductCard`
- **Khóa cấu trúc dòng trong `ProductCard`**:
  - Dòng danh mục & quy cách: cố định 1 dòng (`min-h-[20px] truncate`).
  - Tiêu đề sản phẩm (`Yeseva One`): khóa vùng hiển thị 2 dòng (`line-clamp-2 min-h-[52px]`) để sản phẩm tên ngắn và tên dài luôn chiếm cùng một khoảng cao.
  - Mô tả ngắn: khóa vùng hiển thị 2 dòng (`line-clamp-2 min-h-[44px]`).
  - Khối giá bán & mức tiết kiệm: khóa chiều cao tối thiểu (`min-h-[56px] flex items-baseline flex-wrap gap-2`) để thẻ sản phẩm đơn lẻ (không có giá gạch ngang) và thẻ Set quà (có giá gạch ngang + nhãn *Tiết kiệm*) luôn cân bằng chiều cao tuyệt đối.
  - Cụm 2 nút hành động (*“Thêm vào giỏ”* & *“Mua ngay”*): đặt trong lưới 2 cột đều nhau (`grid grid-cols-2 gap-2.5 w-full`), mỗi nút co giãn linh hoạt (`w-full min-w-0 min-h-[48px] px-3`), đảm bảo không bao giờ bị tràn ngang hoặc rớt thành 2 dòng trên mọi độ rộng màn hình.
- **Đồng bộ các Box nội dung khác**:
  - Trang **Về Bùi Vị** (`/ve-bui-vi`): 4 thẻ *Cam kết chất lượng* và 4 thẻ *Hành trình Bùi Vị* được gắn `h-full flex flex-col justify-between` để các cột cao bằng nhau tuyệt đối.
  - Trang **Chủ** (`/`) & **Bài viết** (`/bai-viet`): Các thẻ bài viết trong lưới 3 cột khóa chiều cao tiêu đề (`min-h-[56px]`) và đoạn trích (`min-h-[68px]`) kèm liên kết *“Đọc bài viết”* luôn neo sát đáy thẻ.

### B. Tương tác Hover & Hộp Thoại Xem Nhanh (`Quick-View Modal`)
- **Nút kích hoạt trên ảnh `ProductCard`**:
  - Khi di chuột vào thẻ sản phẩm trên máy tính, bên cạnh hiệu ứng vẽ khung góc Đông Hồ và chuyển góc ảnh phụ, một nút **“Xem nhanh”** (nền `#FFFBF2/95`, viền `#951722/40`, chữ `#171815` chuyển sang `#951722` khi hover) xuất hiện mượt ở chính giữa cạnh dưới khung ảnh.
- **Giao diện hộp thoại `Quick-View Modal`**:
  - Thiết kế 2 cột cân đối trên nền giấy Điệp ấm (`#FFFBF2`), viền đôi di sản:
    - **Cột trái**: Ảnh chính tỉ lệ `4:3` kèm 4 ảnh thu nhỏ (thumbnails) để đổi góc nhìn tức thì, có nhãn *Bán chạy* và *-%* ưu đãi.
    - **Cột phải**: Danh mục, tên sản phẩm (`Yeseva One`), giá bán & mức tiết kiệm, mô tả ngắn, bộ chọn **Quy cách đóng gói**, bộ chọn **Số lượng** (tự động nhân giá tạm tính), 2 nút hành động chính (*“Thêm vào giỏ”* có hiệu ứng bay vào giỏ & *“Mua ngay”*) cùng liên kết *“Xem chi tiết đầy đủ sản phẩm →”*.
  - Hỗ trợ đóng bằng nút `X`, bấm ra ngoài nền mờ hoặc nhấn phím `Escape`.

### C. Menu Thả Xuống Tùy Chỉnh Đồng Bộ Bùi Vị (`HeritageSelect`)
- Áp dụng chung một ngôn ngữ thiết kế menu thả xuống (`#FFF5E4` / `#FFFBF2`, thanh tiêu đề phụ `#1F3D2A` chữ vàng kim `#F3D27A`, mục đang chọn tô nền `#951722/10` kèm dấu tích tròn `#1F3D2A`) cho:
  1. Ô chọn **Tỉnh / Thành phố** tại **Bước 2: Thông tin giao hàng** (`/thanh-toan`).
  2. Ô chọn **Tỉnh / Thành phố** trong biểu mẫu thêm/sửa địa chỉ tại **Sổ địa chỉ** (`/tai-khoan/dia-chi`).
  3. Bộ chọn **Sắp xếp sản phẩm** tại trang **Danh sách sản phẩm** (`/san-pham`).

### D. Bộ Sắp Xếp & Chuyển Tab Mượt trên `/san-pham`
- Thanh công cụ phía trên lưới sản phẩm gồm:
  - Ô tìm kiếm tức thì không phân biệt dấu tiếng Việt (bên trái).
  - Số lượng sản phẩm tìm thấy + Menu thả xuống **Sắp xếp theo** (*Mặc định di sản*, *Giá: Thấp đến cao*, *Giá: Cao đến thấp*, *Ưu đãi tiết kiệm nhất*, *Bán chạy nhất*) đồng bộ màu sắc Bùi Vị (bên phải).
- Khi chuyển đổi giữa tab *“Sản phẩm”* và *“Set quà biếu Bùi Vị”* hoặc đổi tiêu chí sắp xếp, lưới sản phẩm chuyển cảnh bằng `AnimatePresence mode="wait"` kết hợp hiệu ứng xuất hiện tuần tự (`Stagger`) mượt mà.

---

## 3. Key Product Decisions & Trade-Offs

- **Quyết định 1: Quản lý trạng thái Quick-View tập trung tại Context toàn cục**
  - *Phương án chọn*: Lưu sản phẩm đang mở Quick-View trong `StoreContext` và hiển thị hộp thoại một lần duy nhất ở tầng `Layout`.
  - *Lý do*: Tránh nhân bản DOM của modal trong từng thẻ `ProductCard`, đồng thời giúp mọi thẻ sản phẩm ở bất kỳ trang nào (`/`, `/san-pham`, `/ve-bui-vi`, `/bai-viet/:slug`) đều mở được Quick-View tức thì mà không bị giới hạn bởi `overflow-hidden` của thẻ cha.
- **Quyết định 2: Tái sử dụng Component Menu Thả Xuống Di Sản (`HeritageDropdown`)**
  - *Phương án chọn*: Xây dựng một component menu thả xuống dùng chung hỗ trợ bàn phím (`Escape`), click ra ngoài để đóng và hiệu ứng `AnimatePresence`.
  - *Lý do*: Đảm bảo sự đồng bộ 100% về màu sắc, khoảng đệm, bo góc và độ mượt giữa trang Liên hệ, trang Sản phẩm, trang Thanh toán và trang Tài khoản.

---

## 4. Technical Architecture & Data Strategy

### Sơ đồ Kiến trúc & Luồng Tương tác

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              StoreContext                                  │
│  • quickViewProduct: Product | null                                        │
│  • openQuickView(product) / closeQuickView()                               │
│  • addToCart(...) / startBuyNow(...) / triggerFlyToCart(...)               │
└───────────────────┬────────────────────────────────────┬───────────────────┘
                    │                                    │
                    ▼                                    ▼
┌───────────────────────────────────────┐  ┌─────────────────────────────────┐
│        ProductCard (Đồng nhất)        │  │     ProductQuickViewModal       │
│ • Khung ảnh 4:3 + Khung Đông Hồ SVG   │  │ • Bộ chọn 4 góc ảnh crossfade   │
│ • Nút "Xem nhanh" nổi lên khi hover   ├─►│ • Chọn quy cách & số lượng      │
│ • Khóa min-h cho Tiêu đề / Mô tả / Giá│  │ • Tính tạm tính & tiết kiệm     │
│ • Lưới 2 cột (grid-cols-2) cho 2 CTA  │  │ • CTA Thêm vào giỏ & Mua ngay   │
└───────────────────────────────────────┘  └─────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                   HeritageDropdown (Menu Thả Xuống Bùi Vị)                 │
├─────────────────────────┬──────────────────────────┬───────────────────────┤
│   /san-pham (Sắp xếp)   │ /thanh-toan (Bước 2 Tỉnh)│ /tai-khoan/dia-chi    │
│ • Mặc định / Giá tăng   │ • TP. Hà Nội, Bắc Ninh,  │ • Chọn Tỉnh/Thành phố │
│   giảm / Ưu đãi / Hot   │   TP.HCM, Hải Phòng...   │   đồng bộ bảng màu    │
└─────────────────────────┴──────────────────────────┴───────────────────────┘
```

### Ánh xạ Trạng thái & Xử lý Sự kiện
- **Mở/Đóng Quick-View**: Bấm nút *“Xem nhanh”* trên `ProductCard` gọi `e.preventDefault(); e.stopPropagation(); openQuickView(product)`. Khi modal mở, khóa cuộn nền (`document.body.style.overflow = 'hidden'`), tự động đặt ảnh góc 1 và quy cách mặc định của sản phẩm.
- **Sắp xếp & Chuyển tab trên `/san-pham`**: State `sortBy` (`'default' | 'price-asc' | 'price-desc' | 'discount-desc' | 'bestseller'`) kết hợp cùng `activeTab` và `debouncedQuery` trong `useMemo` để tái tính toán danh sách hiển thị tức thì và kích hoạt khóa chuyển cảnh `key={`${activeTab}-${sortBy}`}` trên lưới sản phẩm.
- **Chọn Tỉnh / Thành phố**: Bấm vào nút mở menu sẽ hiển thị danh sách các Tỉnh/Thành phố trọng điểm với mô tả thời gian giao hàng dự kiến (ví dụ: *Nội thành Hà Nội & Bắc Ninh: Giao nhanh 2h–4h*, *Các tỉnh thành khác: Giao tiêu chuẩn 24h–48h*), chọn xong tự động cập nhật state và đóng menu mượt mà.
