# 🎨 BÙI VỊ – UI/UX COMPREHENSIVE REVIEW PLAN

> **Mục tiêu:** Cải thiện chất lượng thiết kế, tối ưu trải nghiệm mua hàng & chuyển đổi (conversion), đánh giá tổng thể tình trạng hiện tại.
>
> **Đối tượng:** B2B + B2C (ưu tiên Desktop-first, khách hàng B2B dùng máy tính nhiều)
>
> **Phạm vi:** Tất cả 13 trang, 16 components, 10 khía cạnh review
>
> **Phương pháp:** Lập plan → Review từng trang & component → Tổng hợp → Hỏi ý kiến trước khi sửa

---

## 📋 TỔNG QUAN HIỆN TRẠNG SAU KHI ĐỌC CODE

| Tiêu chí | Đánh giá sơ bộ |
|---|---|
| **Tech Stack** | React 19 + Vite 8 + TailwindCSS v4 + Motion (Framer Motion) + Lucide Icons |
| **Fonts** | Yeseva One (Display/Heading) + Montserrat 500 (Body) |
| **Color Palette** | Cream (#FFF5E4), Heritage Red (#951722), Vermilion (#9B0514), Forest (#1F3D2A), Ink (#171815), Gold (#F3D27A) |
| **Design System** | Custom CSS vars + Tailwind theme tokens + nhiều custom animations |
| **Số lượng trang** | 13 routes (HomePage, ProductList, ProductDetail, Cart, Checkout, Promotions, About, Articles, Contact, Search, Account, OrderStatus, Sitemap/404) |
| **Components** | 16 shared components (Header mega-menu, Footer, Layout, ProductCard, VoucherBox, MediaSlot, v.v.) |
| **Media** | Tất cả media slots đều đang `src: ''` → hiển thị placeholder |
| **Animations** | 15+ CSS keyframe animations + Framer Motion (Reveal, Stagger, WordReveal, PageTransition, FlyToCart, v.v.) |

---

## 🔍 10 KHÍA CẠNH REVIEW

Mỗi trang/component sẽ được đánh giá theo 10 dimension sau:

| # | Khía cạnh | Mô tả chi tiết |
|---|---|---|
| 1 | **Visual Design** | Tính thẩm mỹ tổng thể, balance giữa các elements, visual hierarchy, use of whitespace |
| 2 | **Layout & Grid** | Cấu trúc grid, alignment, proportion giữa các cột, responsive breakpoints |
| 3 | **Typography** | Font pairing, font sizes, line-height, letter-spacing, readability, text hierarchy |
| 4 | **Spacing** | Padding, margin, gap consistency, breathing room, cramped vs spacious |
| 5 | **Colors** | Color contrast (WCAG), color meaning, brand consistency, hover/active states |
| 6 | **Responsive** | Desktop → Tablet → Mobile adaptations, touch targets, content reflow |
| 7 | **UX Flows** | User journey, conversion funnel, navigation clarity, error handling, feedback |
| 8 | **Content** | Copywriting quality, information hierarchy, CTA clarity, text length |
| 9 | **Accessibility** | Keyboard nav, screen reader, ARIA labels, focus states, contrast ratios |
| 10 | **Animation** | Motion appropriateness, performance, reduced motion support, timing |

---

## 📐 PHASE 1: GLOBAL ELEMENTS (Header, Footer, Layout, Navigation)

### 1.1 Announcement Bar (Top Bar)
- [ ] Đánh giá visibility & readability trên desktop
- [ ] Kiểm tra animation xoay promo có gây rối không
- [ ] CTA "Xem chi tiết ưu đãi" có đủ nổi bật không
- [ ] Hotline placement có hợp lý không

### 1.2 Header (1006 dòng code – component lớn nhất)
- [ ] Logo scaling on scroll (80px → 68px) có mượt không
- [ ] Desktop Navigation: 6 menu items – spacing, font size 18px, hover states
- [ ] Mega-menu Sản phẩm: layout 12-col grid, product list + best seller spotlight
- [ ] Mega-menu Khuyến mãi: voucher listing rõ ràng không
- [ ] Dropdown Về Bùi Vị, Bài viết, Liên hệ: width & content hierarchy
- [ ] Action icons zone: Search, Account dropdown, Cart button
- [ ] Cart button: badge, total amount, wiggle animation
- [ ] Mobile hamburger menu: accordion structure, UX flow
- [ ] Sticky behavior: z-index conflicts, shadow timing

### 1.3 Footer (4-column grid)
- [ ] Layout balance: Brand + Links + Products + Contact
- [ ] Social channel buttons: discoverability, hover states
- [ ] Copyright & font license: necessary or clutter?
- [ ] Mobile stacking order: priority of information

### 1.4 Layout Global Elements
- [ ] PageNavBar (breadcrumb) – usefulness, visibility
- [ ] Floating Cart Button: position, timing (300px scroll), overlap issues
- [ ] "Về đầu trang" button: position, z-index conflicts with floating cart
- [ ] Toast notifications: position, stacking, swipe-to-dismiss
- [ ] Fly-to-Cart animation: curve path, timing, visual feedback
- [ ] Route progress bar: visibility, timing
- [ ] SearchOverlay: UX, design, instant search

---

## 🏠 PHASE 2: TRANG CHỦ (HomePage – 569 dòng)

### 2.1 Section 1: Hero Banner
- [ ] Layout 2-column (6+6 cols): balance giữa copy và media
- [ ] H1 heading: font size hierarchy, readability
- [ ] Brand description paragraph: quá dài hay vừa đủ?
- [ ] 3 CTAs (Mua ngay + Thêm giỏ + Khám phá): hierarchy rõ ràng không
- [ ] Featured Promotion Banner (forest green): CTA duplication issue?
- [ ] MediaSlot hero placeholder: appearance khi chưa có ảnh
- [ ] Featured Set Quick Bar below hero image
- [ ] AnimationSlot ornament: purpose & visibility

### 2.2 Section 2: Sản Phẩm Nổi Bật (7 products)
- [ ] Section header + "Xem tất cả" link
- [ ] 3-column ProductCard grid: card design, hover states
- [ ] Combo 3 Hộp Quà highlight banner: visual prominence
- [ ] Home Carousel (5 slides): placeholder state, controls
- [ ] Animation Stagger: timing appropriate?

### 2.3 Section 3: Khuyến Mãi
- [ ] 2-column layout: Poster + 3 VoucherCards
- [ ] VoucherCard compact mode: readability
- [ ] Background color change (cream-dark): visual separation

### 2.4 Section 4: Câu Chuyện Bùi Vị
- [ ] Long-form text section: readability, text-align justify
- [ ] WordRevealQuote animation: performance, readability
- [ ] 3 feature cards (Thính gạo, Giấy Điệp, Hộp mở thành tranh)
- [ ] MediaSlot video + AnimationSlot
- [ ] Double-border-forest container: visual weight

### 2.5 Section 5: Bài Viết (3 article cards)
- [ ] Article card design: thumbnail, meta info, excerpt
- [ ] "Đọc tiếp" link: visibility

---

## 🛍️ PHASE 3: TRANG SẢN PHẨM (ProductList + ProductDetail)

### 3.1 ProductListPage (269 dòng)
- [ ] H1 title: clear hierarchy
- [ ] Tab switcher (Sản phẩm / Set quà biếu): pill design, animated layoutId
- [ ] Promo strip (forest green): content & CTA
- [ ] Search bar (52px): placeholder, clear button UX
- [ ] "Tìm thấy X sản phẩm" count: position
- [ ] Empty state: animation slot, suggested products
- [ ] FeaturedProductsBlock at bottom: relevance

### 3.2 ProductDetailPage (879 dòng – 2nd largest)
- [ ] 2-column layout (58% gallery / 42% order panel): proportion
- [ ] Mobile image viewer: swipe, prev/next buttons, zoom
- [ ] Thumbnail bar: sticky behavior, dot indicators
- [ ] Desktop vertical scrolling images: IntersectionObserver sync
- [ ] **Order Panel (sticky right):**
  - Badges row (Bán chạy, Category, Discount%)
  - Product name & tagline
  - Price block: main price, old price, savings
  - Pack option selector: single-column buttons
  - Quantity stepper + Live animated subtotal
  - VoucherBox: interactive voucher selection
  - 2 CTAs: Thêm giỏ + Mua ngay (min-h 56px)
- [ ] 5-item Accordion section: spacing, toggle behavior
- [ ] Related Products (3 cards): placement
- [ ] Mobile sticky bottom CTA bar: slide-up behavior, price + 2 buttons
- [ ] Lightbox: implementation missing? Only state exists

---

## 🛒 PHASE 4: GIỎI HÀNG & THANH TOÁN (Cart → Checkout → Order Status)

### 4.1 CartPage (386 dòng)
- [ ] 3-Step Stepper UI: visual design, step highlighting
- [ ] Free-shipping progress bar: animation, text clarity
- [ ] Select All bar: checkbox design
- [ ] Cart line items: checkbox + image + info + quantity + total layout
- [ ] Per-line promotion tags: visibility
- [ ] Gift rows (TANGHOP): visual distinction
- [ ] PromotionSummary panel (right sticky): contents
- [ ] Mobile sticky bottom bar: total + CTA
- [ ] Empty cart state: animation slot, CTA

### 4.2 CheckoutPage (771 dòng)
- [ ] Stepper UI (step 2-3 active): consistency with Cart stepper
- [ ] Product summary section: editable quantity in BuyNow mode
- [ ] Shipping form: field layout, validation UX, shake animation
- [ ] Gift card option: expand/collapse UX
- [ ] Payment method selector (QR vs COD): card design
- [ ] VietQR display: QR code styling, scan-line animation, countdown timer
- [ ] Bank info display: readability, copy-ability
- [ ] COD option: trust signals
- [ ] Dev toggle "Simulate payment failure": should this be hidden?
- [ ] PromotionSummary panel (right sticky): mirroring cart

### 4.3 OrderStatusPages
- [ ] OrderSuccessPage: celebration state, order details, next actions
- [ ] PaymentFailedPage: error state, retry options, trust recovery

---

## 📄 PHASE 5: CONTENT PAGES (About, Articles, Contact, Promotions)

### 5.1 AboutPage (233 dòng)
- [ ] Banner media slot
- [ ] Section 1 (Câu chuyện): WordRevealQuote, long text, CTAs
- [ ] Section 2 (Cam kết chất lượng): 4-card grid, icon system
- [ ] Section 3 (Hành trình): dark forest-green section, 4-step timeline
- [ ] Section 4 (Gợi ý sản phẩm): 3 ProductCards

### 5.2 ArticlesPages (ArticleList + ArticleDetail)
- [ ] Article list: card grid, filtering by category
- [ ] Article detail: hero image, content structure, related articles
- [ ] Blog thumbnail & hero media slots

### 5.3 ContactPage (332 dòng)
- [ ] Form: field design, validation, success state
- [ ] Right panel: Hotline, Zalo, Email, working hours
- [ ] Store listing (3 cards): map placeholder, store info
- [ ] Placeholder data: "[Có thể chỉnh sửa]" text in stores 2 & 3

### 5.4 PromotionsPage (326 dòng)
- [ ] Hero header (forest green): H1, description, 3 anchor links
- [ ] Section 1 (Ưu đãi hot): VoucherCard grid
- [ ] Section 2 (Combo & Quà tặng): VoucherCards + Combo spotlight
- [ ] Section 3 (Bảng so sánh): responsive table, "Dùng mã" & "Mua ngay" CTAs
- [ ] Hash-based highlight (#ma-voucher-CODE): pulse animation

---

## 🧩 PHASE 6: SHARED COMPONENTS

### 6.1 ProductCard
- [ ] Card anatomy: image, badges, name, price, pack spec, CTAs
- [ ] Hover effects: translate-y, shadow, image scale
- [ ] "Bán chạy" badge: placement, size
- [ ] Discount badge: readability
- [ ] 2 CTA buttons: sizing, touch targets

### 6.2 VoucherCard & VoucherBox
- [ ] VoucherCard: code display, copy button, "Dùng mã" flow
- [ ] VoucherBox (in ProductDetail): voucher selection, eligibility logic, price breakdown
- [ ] Highlight pulse animation: timing

### 6.3 MediaSlot & Img
- [ ] Placeholder appearance: Đông Hồ themed placeholder design
- [ ] Loading states: skeleton shimmer
- [ ] Aspect ratios: consistency across pages

### 6.4 MiniCartDrawer
- [ ] Slide-in drawer: width, overlay, scroll behavior
- [ ] Item list: compact layout
- [ ] Summary & CTAs: prominence

### 6.5 AddToCartButton & BuyNowButton
- [ ] Visual distinction: primary vs secondary
- [ ] Size variants (sm/lg): consistency
- [ ] Hover/active states, sheen animation

---

## 🎯 PHASE 7: CROSS-CUTTING CONCERNS

### 7.1 Design System Consistency
- [ ] Color usage: có hardcoded colors ngoài design tokens không?
- [ ] Spacing scale: consistent use of Tailwind spacing
- [ ] Border radius: rounded-xl (12px) vs rounded-2xl (16px) vs rounded-3xl (24px) – rules?
- [ ] Shadow scale: shadow-xs, shadow-sm, shadow-md, shadow-xl – khi nào dùng cái nào?
- [ ] Font weight: tất cả đều bị lock 500 (Montserrat) / 400 (Yeseva One) – có bị mất hierarchy?

### 7.2 Typography Deep-Dive
- [ ] All font weights locked to 500 via `!important` – intentional but impacts text hierarchy
- [ ] `text-xs` forced to 14px – đúng hay sai?
- [ ] `.story-justify`: text-align justify + hyphens – readability on narrow screens?
- [ ] Font-synthesis disabled everywhere – italic rendering
- [ ] `.quote-lead` class: font-synthesis-style re-enabled for italic

### 7.3 Animation Audit
- [ ] 15+ CSS keyframes: necessary? performance impact?
- [ ] `prefers-reduced-motion` support: ✅ implemented
- [ ] Stagger delays: appropriate timing?
- [ ] Ken Burns effect on hero: subtle enough?
- [ ] Cart wiggle: frequency, intrusiveness

### 7.4 Responsive Design Audit
- [ ] Desktop-first: ưu tiên trải nghiệm 1280px+
- [ ] Breakpoints: sm (640), md (768), lg (1024), xl (1280)
- [ ] Mobile menu: full-screen accordion vs drawer?
- [ ] Touch targets: minimum 44x44px compliance
- [ ] Horizontal scroll issues: tables, product grids

### 7.5 Accessibility Audit
- [ ] Focus-visible rings: consistent styling
- [ ] ARIA labels: đầy đủ trên interactive elements
- [ ] Color contrast: cream text on heritage-red, gold on forest-green
- [ ] Keyboard navigation: tab order, escape key handlers
- [ ] Screen reader: announcements, aria-live regions

### 7.6 Content & SEO
- [ ] Page titles: dynamic, descriptive
- [ ] Meta descriptions: only on index.html
- [ ] H1 per page: compliance
- [ ] Semantic HTML: section, article, nav, main usage
- [ ] Image alt texts: quality and SEO value
- [ ] Placeholder content: "[Có thể chỉnh sửa]" strings in siteConfig.ts stores

---

## 📊 PHASE 8: TỔNG HỢP & ĐỀ XUẤT

### 8.1 Priority Matrix
Phân loại issues theo:
- **P0 (Critical):** Lỗi giao diện, UX blocking, accessibility failures
- **P1 (High):** Ảnh hưởng conversion, visual inconsistency lớn
- **P2 (Medium):** Cải thiện readability, spacing, polish
- **P3 (Low):** Nice-to-have, micro-optimizations

### 8.2 Quick Wins
Các thay đổi nhỏ nhưng impact lớn, có thể sửa nhanh.

### 8.3 Strategic Improvements
Các thay đổi cần thiết kế lại, cần thảo luận trước khi triển khai.

---

## 🗓️ EXECUTION ORDER

| Bước | Hành động | Ước tính |
|---|---|---|
| ✅ Step 0 | Đọc toàn bộ code & lập plan | **Hoàn thành** |
| 🔜 Step 1 | Chạy dev server, mở browser, screenshot toàn bộ 13+ trang | ~20 phút |
| Step 2 | Review Global Elements (Header, Footer, Layout) | ~30 phút |
| Step 3 | Review HomePage (5 sections) | ~25 phút |
| Step 4 | Review Product pages (List + Detail) | ~30 phút |
| Step 5 | Review Cart & Checkout flow | ~25 phút |
| Step 6 | Review Content pages (About, Articles, Contact, Promotions) | ~20 phút |
| Step 7 | Review shared components | ~15 phút |
| Step 8 | Cross-cutting concerns (Design System, Typography, Animation, Responsive, A11y) | ~20 phút |
| Step 9 | **Tổng hợp toàn bộ findings → Artifact report** | ~20 phút |
| Step 10 | **Trình bày & thảo luận với bạn trước khi sửa** | — |

---

> [!IMPORTANT]
> Plan này sẽ **không tự động sửa code**. Sau khi review xong, tôi sẽ tổng hợp tất cả findings thành một báo cáo chi tiết với priority matrix, sau đó **hỏi ý kiến bạn** trước khi bắt tay vào sửa bất kỳ điều gì.

> [!NOTE]
> **Tiếp theo:** Bạn muốn tôi bắt đầu **Step 1** (chạy dev server và screenshot toàn bộ trang để review trực quan) ngay bây giờ không?
