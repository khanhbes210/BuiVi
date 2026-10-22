export type AnimationSlotType = 'lottie' | 'video' | 'svg' | 'css';
export type AnimationTrigger = 'loop' | 'once' | 'scroll' | 'hover' | 'click';

export type AnimationSlotId =
  | 'home-hero-ornament'
  | 'home-section-divider'
  | 'home-gift-unbox'
  | 'product-detail-box-open'
  | 'cart-empty'
  | 'add-to-cart-success'
  | 'order-success-stamp'
  | 'payment-failed'
  | 'search-empty'
  | 'page-loader'
  | 'about-timeline-ornament'
  | 'promo-voucher-celebrate'
  | 'page-404';

export interface AnimationSlotConfig {
  id: AnimationSlotId;
  type: AnimationSlotType;
  /** Drop a .json / .webm / .mp4 / .svg path here to replace the built-in animation */
  src: string;
  trigger: AnimationTrigger;
  /** Static poster/fallback image when prefers-reduced-motion is enabled or asset fails */
  fallbackSrc: string;
  aspectRatio: string;
  loop: boolean;
  speed: number;
  dimensions: string;
  title: string;
  description: string;
}

/**
 * Central registry for all 13 Animation Holders (Section 12).
 * Leave `src: ''` to render the built-in CSS/SVG heritage animation + placeholder frame
 * (controlled by SHOW_ANIMATION_PLACEHOLDERS in siteConfig.ts).
 * When a Lottie JSON (.json), video (.webm/.mp4), or animated SVG path is placed in `src`,
 * <AnimationSlot id="..." /> will automatically render that asset instead!
 */
export const ANIMATION_SLOTS: Record<AnimationSlotId, AnimationSlotConfig> = {
  'home-hero-ornament': {
    id: 'home-hero-ornament',
    type: 'lottie',
    src: '',
    trigger: 'loop',
    fallbackSrc: '',
    aspectRatio: '16 / 3',
    loop: true,
    speed: 1,
    dimensions: '320×60px',
    title: 'Hoạ tiết Đông Hồ Hero',
    description: 'Hoạ tiết mây lành & triện khắc gỗ Kinh Bắc dưới câu slogan',
  },
  'home-section-divider': {
    id: 'home-section-divider',
    type: 'svg',
    src: '',
    trigger: 'scroll',
    fallbackSrc: '',
    aspectRatio: '12 / 1',
    loop: false,
    speed: 1,
    dimensions: '480×40px',
    title: 'Đường diềm lá chuối & lạt giang',
    description: 'Hoa văn lá chuối & dây lạt vẽ nét khi cuộn qua các phân đoạn',
  },
  'home-gift-unbox': {
    id: 'home-gift-unbox',
    type: 'lottie',
    src: '',
    trigger: 'scroll',
    fallbackSrc: '',
    aspectRatio: '4 / 3',
    loop: true,
    speed: 1,
    dimensions: '360×270px',
    title: 'Mở hộp quà di sản Bùi Vị',
    description: 'Diễn hoạt mở nắp hộp quà lụa đỏ & lớp lá chuối ủ nem Kinh Bắc',
  },
  'product-detail-box-open': {
    id: 'product-detail-box-open',
    type: 'lottie',
    src: '',
    trigger: 'once',
    fallbackSrc: '',
    aspectRatio: '16 / 9',
    loop: false,
    speed: 1,
    dimensions: '400×225px',
    title: 'Cấu trúc hộp quà 3 lớp Bùi Vị',
    description: 'Minh hoạ 3D/Lottie mở hộp quà trong mục "4. Câu chuyện hộp quà"',
  },
  'cart-empty': {
    id: 'cart-empty',
    type: 'lottie',
    src: '',
    trigger: 'loop',
    fallbackSrc: '',
    aspectRatio: '1 / 1',
    loop: true,
    speed: 1,
    dimensions: '180×180px',
    title: 'Quang gánh Kinh Bắc chờ thức quà',
    description: 'Minh hoạ giỏ quà tre đan trống trong ngăn giỏ hàng và trang /gio-hang',
  },
  'add-to-cart-success': {
    id: 'add-to-cart-success',
    type: 'svg',
    src: '',
    trigger: 'once',
    fallbackSrc: '',
    aspectRatio: '1 / 1',
    loop: false,
    speed: 1,
    dimensions: '44×44px',
    title: 'Dấu tích thêm vào giỏ thành công',
    description: 'Biểu tượng dấu ấn xanh lá rừng khi vừa thêm sản phẩm vào giỏ',
  },
  'order-success-stamp': {
    id: 'order-success-stamp',
    type: 'lottie',
    src: '',
    trigger: 'once',
    fallbackSrc: '',
    aspectRatio: '1 / 1',
    loop: false,
    speed: 1,
    dimensions: '160×160px',
    title: 'Triện son Bùi Vị – Đặt hàng thành công',
    description: 'Con dấu gỗ truyền thống đóng triện đỏ son lên giấy Điệp',
  },
  'payment-failed': {
    id: 'payment-failed',
    type: 'lottie',
    src: '',
    trigger: 'once',
    fallbackSrc: '',
    aspectRatio: '1 / 1',
    loop: false,
    speed: 1,
    dimensions: '140×140px',
    title: 'Cảnh báo giao dịch gián đoạn',
    description: 'Biểu tượng lạt buộc tạm ngưng trên trang /thanh-toan-that-bai',
  },
  'search-empty': {
    id: 'search-empty',
    type: 'lottie',
    src: '',
    trigger: 'loop',
    fallbackSrc: '',
    aspectRatio: '4 / 3',
    loop: true,
    speed: 1,
    dimensions: '200×150px',
    title: 'Không tìm thấy thức quà phù hợp',
    description: 'Minh hoạ đèn lồng giấy Điệp soi tìm sản phẩm trên trang tìm kiếm & bộ lọc',
  },
  'page-loader': {
    id: 'page-loader',
    type: 'svg',
    src: '',
    trigger: 'loop',
    fallbackSrc: '',
    aspectRatio: '1 / 1',
    loop: true,
    speed: 1,
    dimensions: '96×96px',
    title: 'Triện xoay tải trang Bùi Vị',
    description: 'Con dấu tròn Bùi Vị xoay nhẹ khi đang tải dữ liệu hoặc chuyển trang',
  },
  'about-timeline-ornament': {
    id: 'about-timeline-ornament',
    type: 'svg',
    src: '',
    trigger: 'scroll',
    fallbackSrc: '',
    aspectRatio: '4 / 1',
    loop: true,
    speed: 1,
    dimensions: '320×80px',
    title: 'Dòng chảy di sản Bùi Xá – Kinh Bắc',
    description: 'Hoạ tiết sóng nước sông Đuống & mái đình cổ trên trang /ve-bui-vi',
  },
  'promo-voucher-celebrate': {
    id: 'promo-voucher-celebrate',
    type: 'lottie',
    src: '',
    trigger: 'once',
    fallbackSrc: '',
    aspectRatio: '3 / 1',
    loop: false,
    speed: 1,
    dimensions: '280×92px',
    title: 'Hoa giấy Điệp mừng ưu đãi',
    description: 'Hiệu ứng ánh nhũ điệp vàng & sắc đỏ son khi áp dụng mã ưu đãi thành công',
  },
  'page-404': {
    id: 'page-404',
    type: 'lottie',
    src: '',
    trigger: 'loop',
    fallbackSrc: '',
    aspectRatio: '16 / 9',
    loop: true,
    speed: 1,
    dimensions: '320×180px',
    title: 'Lạc bước miền quan họ (404)',
    description: 'Minh hoạ nón quai thao & chiếu rượu Kinh Bắc dẫn lối về trang chủ',
  },
};

export const REQUIRED_ANIMATION_SLOT_IDS: AnimationSlotId[] = Object.keys(
  ANIMATION_SLOTS
) as AnimationSlotId[];
