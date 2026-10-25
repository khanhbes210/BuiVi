# Chuẩn Hóa Hiển Thị, Bố Cục & Nội Dung Hệ Thống Khuyến Mãi Bùi Vị

Kế hoạch này giải quyết triệt để các lỗi hiển thị trên trang Khuyến mãi (`/khuyen-mai`) và thẻ Voucher (`VoucherCard`): khắc phục hoàn toàn tình trạng chữ bị cắt ngang ở các mục *Sản phẩm áp dụng*, *Quy định cộng gộp*, *Giới hạn lượt dùng*, loại bỏ khoảng trống thừa trong khung *Cách sử dụng (3 bước)*, chuyển sang căn trái rõ ràng trong thẻ hẹp, và đồng bộ toàn bộ nội dung cùng logic nút **Mua ngay** của 6 mã ưu đãi.

## User Review & Critical Decisions

> [!IMPORTANT]
> Dưới đây là 3 quyết định thiết kế và nghiệp vụ đã được xác nhận để áp dụng thống nhất trên toàn bộ hệ thống khuyến mãi:

- **Quyết định 1 — Co giãn tự nhiên đồng đều theo hàng, hiển thị trọn vẹn chữ không cắt dòng**: Gỡ bỏ chiều cao cứng `900px` trên thẻ Voucher và gỡ bỏ các giới hạn cắt dòng cứng (`h-[44px]`, `h-[22px]`, `line-clamp-2` kết hợp `overflow-hidden`) đang làm mất nửa dưới dòng chữ. Các thẻ Voucher trên cùng một hàng tự động cân bằng chiều cao (`h-full flex flex-col justify-between` trong lưới `items-stretch`), hiển thị đầy đủ 100% nội dung và giữ khung *Cách sử dụng (3 bước)* vừa khít, cân đối.
- **Quyết định 2 — Căn trái rõ ràng, tách nhãn và nội dung, bỏ căn đều 2 bên (`justify`) trong thẻ hẹp**: Không áp dụng lớp `.story-justify` (`text-align: justify; font-size: 17px`) bên trong các trường thông tin hẹp của thẻ Voucher và dòng ghi chú đầu mục, giúp khoảng cách chữ tự nhiên, cỡ chữ chuẩn (`14px–15px`, `leading-relaxed`) và không bị rớt chữ xấu.
- **Quyết định 3 — Đồng bộ tất cả mã đang hoạt động ngay & gắn sản phẩm mặc định chuẩn cho nút Mua ngay**:
  - Chuẩn hóa trạng thái và thời hạn của toàn bộ 6 mã ưu đãi (`BUIVI10`, `FREESHIP`, `QUATET15`, `THANHVIEN50`, `COMBO3`, `TANGHOP`) sang trạng thái **Đang áp dụng** (không còn mâu thuẫn *"Đang mở đặt trước 01/11"* trên `QUATET15`).
  - Bổ sung đầy đủ cấu hình sản phẩm mặc định (`defaultEligibleProductIds` và `defaultBuyNowQuantity`) cho từng mã ưu đãi để khi bấm **Mua ngay** trên bất kỳ thẻ Voucher hay dòng nào trong Bảng so sánh, hệ thống lập tức khởi tạo đúng sản phẩm đủ điều kiện kèm mã ưu đãi đó và chuyển mượt sang bước Thanh toán.

---

## 1. Overview & Core Concept

- **What It Does**: Tái cấu trúc giao diện thẻ Voucher (`VoucherCard`), trang Chương trình Khuyến mãi (`/khuyen-mai`) và dữ liệu ưu đãi để mọi thông tin điều kiện, quy định cộng gộp, hướng dẫn 3 bước và điều khoản chi tiết hiển thị sắc nét, dễ đọc và chính xác tuyệt đối.
- **Target Audience / Persona**: Khách hàng tìm hiểu mã ưu đãi, so sánh quyền lợi giữa các gói quà biếu di sản Kinh Bắc và muốn áp dụng mã ngay lập tức vào giỏ hàng hoặc mua nhanh.
- **Key Value**: Loại bỏ hoàn toàn lỗi cắt chữ và khoảng trắng bất thường, đồng thời đảm bảo 100% nút hành động trên trang Khuyến mãi hoạt động chính xác với bộ tính toán ưu đãi.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Xem & So sánh thẻ Voucher**: Khách hàng lướt qua Phần 1 (*Ưu đãi Hot / Khuyến mãi đang áp dụng*) và Phần 2 (*Combo & Quà tặng di sản*). Mọi thẻ trên cùng một hàng có chiều cao bằng nhau, phần thông tin điều kiện ở trên và khối *Cách sử dụng (3 bước)* + 2 nút hành động neo thẳng hàng ở đáy thẻ.
  2. **Xem Điều khoản chi tiết ngay trong thẻ**: Khi bấm **Điều khoản chi tiết & Điều kiện áp dụng**, lớp phủ (`overlay`) mở mượt ngay bên trong thân thẻ đó với thanh cuộn độc lập, không làm xô lệch hay kéo giãn thẻ bên cạnh.
  3. **Bấm "Dùng mã này" hoặc "Mua ngay"**:
     - Bấm **Dùng mã này**: Lưu mã ưu đãi vào giỏ hàng, hiển thị thông báo xác nhận và đổi trạng thái nút thành **Đã lưu mã**.
     - Bấm **Mua ngay**: Tự động chọn sản phẩm tiêu biểu đủ điều kiện của mã đó (ví dụ: `BUIVI10` $\to$ 01 *Set Bình An - Sung Túc* 330.000đ; `FREESHIP` $\to$ 02 *Set Vinh Hoa - Phú Quý* đạt 580.000đ; `QUATET15` $\to$ 01 *Set Vinh Hoa - Phú Quý*; `COMBO3` $\to$ 01 *Combo 3 hộp quà*; `THANHVIEN50` $\to$ 01 *Set Vinh Hoa - Phú Quý*; `TANGHOP` $\to$ 02 *Set Vinh Hoa - Phú Quý*), gắn sẵn mã ưu đãi và chuyển thẳng tới bước **Thông tin giao hàng**.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Phong cách thẻ vé di sản Đông Hồ – Kinh Bắc trang trọng, rõ ràng, dễ tra cứu.
  - *Color Palette & Mood*: Nền giấy điệp `#FFFBF2`, khung hướng dẫn `#FFF5E4`, đầu vé xanh rừng già `#1F3D2A`, chữ nhũ vàng `#F3D27A`, điểm nhấn đỏ di sản `#951722` và đỏ son `#9B0514` cho mức giảm tối đa.
  - *Typography & Hierarchy*:
    - Giá trị ưu đãi & Mã code: `Yeseva One` (`font-display` / `font-price`) nổi bật.
    - Nhãn trường thông tin (`Đơn tối thiểu`, `Mức ưu đãi tối đa`, `Sản phẩm áp dụng`, `Quy định cộng gộp`, `Giới hạn lượt dùng`): `Montserrat` `14px` (`text-sm`), màu `#171815/70`, căn trái.
    - Nội dung chi tiết: `Montserrat` `14px–15px` (`text-[14.5px] leading-[1.55]`), căn trái tự nhiên (`text-left`), hiển thị trọn vẹn không cắt dòng.
  - *Component Styling & Layout*:
    - Khoảng đệm cuộn (`scroll-mt-32`) cho các neo `#uu-dai-hot`, `#combo-qua-tang`, `#bang-so-sanh` và `#ma-voucher-*` để tiêu đề mục không bao giờ bị thanh Header cố định che khuất.
    - Khung *Cách sử dụng (3 bước)* đặt khoảng cách dòng hợp lý (`space-y-2`), căn trái từng bước với huy hiệu số bước rõ ràng.

---

## 3. Key Product Decisions & Trade-Offs

- **Quyết định 1: Chiều cao thẻ tự thích ứng theo hàng (`h-full`) thay vì khóa cứng `900px`**
  - *Chosen Approach*: Sử dụng `h-full flex flex-col justify-between` trên thẻ Voucher kết hợp `items-stretch` trên lưới 2 cột; nhóm các dòng thông tin ở phần trên và nhóm khối *Cách sử dụng (3 bước)* + nút *Điều khoản* + 2 nút CTA ở phần dưới.
  - *Why*: Đảm bảo chữ dài hay ngắn đều hiển thị đầy đủ 100%, không bao giờ bị cắt mất nửa chữ và cũng không tạo khoảng trống thừa giữa khung *Cách sử dụng*.
  - *Alternatives Considered*: Giữ `h-[900px]` và tăng chiều cao từng dòng — bị loại bỏ vì gây dư thừa khoảng trắng trên các mã có mô tả ngắn như `FREESHIP`.
- **Quyết định 2: Chuẩn hóa dữ liệu 6 mã ưu đãi & sản phẩm mặc định khi bấm "Mua ngay"**
  - *Chosen Approach*: Cập nhật toàn bộ thời hạn áp dụng trong năm 2026 (`Đang áp dụng`), làm rõ câu chữ điều kiện và gắn sản phẩm mặc định + số lượng chuẩn vào từng mã ưu đãi để nút **Mua ngay** kích hoạt được ngay ưu đãi tương ứng.
  - *Why*: Tránh lỗi runtime khi bấm **Mua ngay** trên thẻ Voucher và đảm bảo khách hàng thấy ngay số tiền được giảm tại trang Thanh toán.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     Dữ Liệu Khuyến Mãi Chuẩn Hóa                         │
│  • 6 Mã Ưu Đãi: BUIVI10, FREESHIP, QUATET15, COMBO3, THANHVIEN50, TANGHOP│
│  • Bổ sung: defaultEligibleProductIds & defaultBuyNowQuantity            │
│  • Chuẩn hóa trạng thái thời gian: Đang áp dụng trực tiếp                │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
┌────────────────────────────────────┐  ┌──────────────────────────────────┐
│        Thẻ Ưu Đãi (VoucherCard)    │  │   Trang Khuyến Mãi (/khuyen-mai) │
│ • Co giãn đồng đều theo hàng (h-full│  │ • Neo cuộn chuẩn (scroll-mt-32)  │
│   flex-col justify-between)        │  │ • Phần 1: 4 Mã giảm giá & Ship   │
│ • Căn trái tự nhiên, 0 cắt chữ     │  │ • Phần 2: 2 Mã Combo & Quà tặng  │
│ • Khung 3 bước gọn, rõ ràng        │  │ • Phần 3: Bảng so sánh đồng bộ   │
│ • Lớp phủ Điều khoản cuộn độc lập  │  │   nút Dùng mã & Mua ngay         │
│ • 2 nút CTA cùng 1 hàng (grid-2)   │  │                                  │
└────────────────────────────────────┘  └──────────────────────────────────┘
```

- **Data Model & State**:
  - Mở rộng mô hình `Voucher` với `defaultEligibleProductIds: string[]` và `defaultBuyNowQuantity: number` để mọi mã đều có cấu hình mua nhanh hợp lệ:
    - `BUIVI10` (đơn từ 300.000đ, trừ Combo 3): Mặc định `prod-set-binh-an` (*Set Bình An - Sung Túc* 330.000đ, số lượng `1`) để đủ ngay điều kiện giảm 10% (33.000đ).
    - `FREESHIP` (đơn từ 500.000đ): Mặc định `prod-set-vinh-hoa` (*Set Vinh Hoa - Phú Quý* 290.000đ, số lượng `2` = 580.000đ) để đủ ngay điều kiện miễn phí vận chuyển 40.000đ.
    - `QUATET15` (giảm 15% Set Vinh Hoa hoặc Độc Bản): Mặc định `prod-set-vinh-hoa` (số lượng `1`), cập nhật `countdownText: 'Ưu đãi đặc quyền – Đang áp dụng'` và `expiryDisplay: 'Đến 31/12/2026'`.
    - `COMBO3` (giảm thêm 50.000đ cho Combo 3 hộp quà): Mặc định `prod-combo-3-set` (số lượng `1`).
    - `THANHVIEN50` (giảm 30.000đ đơn từ 200.000đ): Mặc định `prod-set-vinh-hoa` (290.000đ, số lượng `1`).
    - `TANGHOP` (mua từ 2 Set tặng 1 hộp Nem chua): Mặc định `prod-set-vinh-hoa` (số lượng `2`).
- **Interactive Component & State Mapping**:
  - Trên `VoucherCard`: Bấm **Điều khoản chi tiết & Điều kiện áp dụng** bật/tắt `termsOpen` cục bộ, hiển thị lớp phủ `inset-x-4 top-4 bottom-[80px]` đè lên vùng thông tin mà vẫn giữ nguyên 2 nút CTA ở đáy thẻ.
  - Trên `PromotionsPage`: Đồng bộ nút **Mua ngay** trong *Bảng So Sánh Các Voucher* dùng chung logic khởi tạo sản phẩm mặc định như trên `VoucherCard` để trải nghiệm nhất quán ở mọi vị trí.
