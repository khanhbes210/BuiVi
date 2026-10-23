export type MediaSlotId =
  | 'home-hero-banner'
  | 'home-carousel'
  | 'home-promo-poster'
  | 'home-brand-video'
  | 'about-banner'
  | 'about-video'
  | 'promo-banner'
  | 'blog-banner'
  | 'blog-thumb-nghe-thuat-lam-nem-bui-kinh-bac'
  | 'blog-thumb-giay-diep-dong-ho-hop-qua-bui-vi'
  | 'blog-thumb-bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac'
  | 'blog-thumb-goi-y-chon-set-qua-bieu-di-san-bui-vi'
  | 'blog-thumb-bui-vi-ra-mat-bo-suu-tap-qua-tet-2027'
  | 'blog-thumb-khong-gian-di-san-bui-vi-thuan-thanh'
  | 'blog-hero-nghe-thuat-lam-nem-bui-kinh-bac'
  | 'blog-hero-giay-diep-dong-ho-hop-qua-bui-vi'
  | 'blog-hero-bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac'
  | 'blog-hero-goi-y-chon-set-qua-bieu-di-san-bui-vi'
  | 'blog-hero-bui-vi-ra-mat-bo-suu-tap-qua-tet-2027'
  | 'blog-hero-khong-gian-di-san-bui-vi-thuan-thanh';

export interface MediaSlotConfig {
  id: MediaSlotId;
  type: 'banner' | 'poster' | 'video' | 'carousel';
  aspectRatio: string;
  /**
   * Điền đường dẫn file trong /public/media/... (ví dụ: '/media/home-hero-desktop.jpg')
   * Khi để trống (''), hệ thống hiển thị khung giữ chỗ Đông Hồ sạch sẽ.
   */
  src: string;
  mobileSrc?: string;
  poster?: string;
  slides?: {
    src: string;
    alt: string;
    caption: string;
    link?: string;
  }[];
  alt: string;
  placeholderLabel: string;
  placeholderSubtext: string;
  targetFileHint: string;
  link?: string;
}

export const MEDIA_SLOTS: Record<MediaSlotId, MediaSlotConfig> = {
  'home-hero-banner': {
    id: 'home-hero-banner',
    type: 'banner',
    aspectRatio: '4/1',
    src: '/media/Carousel--2-.jpg',
    mobileSrc: '/media/Carousel--2-.jpg',
    alt: 'Banner chính BÙI VỊ – Quà biếu Nem Kinh Bắc trong hộp giấy Điệp Đông Hồ',
    placeholderLabel: 'Khu vực chèn Banner – BÙI VỊ NEM KINH BẮC',
    placeholderSubtext: 'Đã gắn /media/Carousel--2-.jpg',
    targetFileHint: '/media/Carousel--2-.jpg',
    link: '/san-pham',
  },
  'home-carousel': {
    id: 'home-carousel',
    type: 'carousel',
    aspectRatio: '4/1',
    src: '/media/Carousel.jpg',
    slides: [
      {
        src: '/media/Carousel.jpg',
        alt: 'Slide 1 – Bộ sưu tập Hộp quà Di sản Bùi Vị',
        caption: 'Khám phá Tuyệt tác Quà tặng Di sản Bùi Vị',
        link: '/san-pham',
      },
      {
        src: '/media/Carousel--2-.jpg',
        alt: 'Slide 2 – Bùi Vị Nem Kinh Bắc Di Sản',
        caption: 'Bùi Vị Nem Kinh Bắc – Gói vị quê, Mở nét Việt',
        link: '/san-pham?nhom=set-qua-bieu',
      },
      {
        src: '/media/Carousel--3-.jpg',
        alt: 'Slide 3 – Nem Bùi Kinh Bắc',
        caption: 'Nem Bùi Kinh Bắc – Vị thính gạo quê nhà',
        link: '/san-pham/nem-bui',
      },
      {
        src: '/media/Carousel--4-.jpg',
        alt: 'Slide 4 – Nem Chua Thính Kinh Bắc',
        caption: 'Nem Chua Thính Kinh Bắc – Lên men tự nhiên',
        link: '/san-pham/nem-chua',
      },
      {
        src: '/media/Carousel--5-.jpg',
        alt: 'Slide 5 – Nem Ngựa Bùi Vị',
        caption: 'Nem Ngựa Bùi Vị – Đậm đà đặc sản truyền thống',
        link: '/san-pham/nem-ngua',
      },
    ],
    alt: 'Carousel 5 slide hình ảnh và poster sản phẩm Bùi Vị',
    placeholderLabel: 'Khu vực chèn Carousel – 5 Slide Ảnh / Poster Sản Phẩm',
    placeholderSubtext: 'Đã gắn 5 slide hình ảnh thực tế từ Carousel Bùi Vị',
    targetFileHint: '/media/Carousel.jpg',
    link: '/san-pham',
  },
  'home-promo-poster': {
    id: 'home-promo-poster',
    type: 'poster',
    aspectRatio: '0.71',
    src: '/media/poster-heritage.jpg',
    alt: 'Poster chương trình di sản BÙI VỊ',
    placeholderLabel: 'Khu vực chèn Poster Khuyến Mãi',
    placeholderSubtext: 'Đã gắn /media/poster-heritage.jpg',
    targetFileHint: '/media/poster-heritage.jpg',
    link: '/khuyen-mai',
  },
  'home-brand-video': {
    id: 'home-brand-video',
    type: 'video',
    aspectRatio: '16/9',
    src: '',
    poster: '',
    alt: 'Video Câu chuyện thương hiệu BÙI VỊ & Nghệ thuật hộp lục giác giấy Điệp Đông Hồ',
    placeholderLabel: 'Khu vực chèn Video – 16:9 (Câu chuyện Bùi Vị)',
    placeholderSubtext: 'Đặt file tại /public/media/home-brand-video.mp4',
    targetFileHint: '/media/home-brand-video.mp4',
  },
  'about-banner': {
    id: 'about-banner',
    type: 'banner',
    aspectRatio: '12/5',
    src: '/media/banner-products.png',
    alt: 'Banner trang Về Bùi Vị – Một miền vun đắp, một vị lưu hương',
    placeholderLabel: 'Khu vực chèn Banner Về Bùi Vị',
    placeholderSubtext: 'Đã gắn /media/banner-products.png',
    targetFileHint: '/media/banner-products.png',
  },
  'about-video': {
    id: 'about-video',
    type: 'video',
    aspectRatio: '16/9',
    src: '',
    poster: '',
    alt: 'Video hành trình chế tác Nem Kinh Bắc và giấy Điệp Đông Hồ',
    placeholderLabel: 'Khu vực chèn Video Hành Trình Chế Tác – 16:9',
    placeholderSubtext: 'Đặt file tại /public/media/about-video.mp4',
    targetFileHint: '/media/about-video.mp4',
  },
  'promo-banner': {
    id: 'promo-banner',
    type: 'banner',
    aspectRatio: '8/1',
    src: '/media/leaderboard-banner.png',
    alt: 'Banner chương trình khuyến mãi BÙI VỊ',
    placeholderLabel: 'Khu vực chèn Banner Khuyến Mãi',
    placeholderSubtext: 'Đã gắn /media/leaderboard-banner.png',
    targetFileHint: '/media/leaderboard-banner.png',
    link: '/khuyen-mai#uu-dai-hot',
  },
  'blog-banner': {
    id: 'blog-banner',
    type: 'banner',
    aspectRatio: '12/5',
    src: '',
    alt: 'Banner chuyên mục Bài viết văn hóa ẩm thực Kinh Bắc',
    placeholderLabel: 'Khu vực chèn Banner Bài Viết – 1920×800',
    placeholderSubtext: 'Đặt file tại /public/media/blog-banner.jpg',
    targetFileHint: '/media/blog-banner.jpg',
  },

  // BLOG THUMBNAIL SLOTS (blog-thumb-<slug>)
  'blog-thumb-nghe-thuat-lam-nem-bui-kinh-bac': {
    id: 'blog-thumb-nghe-thuat-lam-nem-bui-kinh-bac',
    type: 'banner',
    aspectRatio: '16/10',
    src: '',
    alt: 'Nghệ thuật làm nem bùi Kinh Bắc: Khi hương thính gạo giữ trọn hồn quê',
    placeholderLabel: 'Ảnh đại diện bài viết – 16:10',
    placeholderSubtext: 'Đặt file tại /public/media/blog-thumb-nghe-thuat-lam-nem-bui-kinh-bac.jpg',
    targetFileHint: '/media/blog-thumb-nghe-thuat-lam-nem-bui-kinh-bac.jpg',
  },
  'blog-thumb-giay-diep-dong-ho-hop-qua-bui-vi': {
    id: 'blog-thumb-giay-diep-dong-ho-hop-qua-bui-vi',
    type: 'banner',
    aspectRatio: '16/10',
    src: '',
    alt: 'Giấy Điệp Đông Hồ và hành trình đưa di sản vào hộp quà Bùi Vị',
    placeholderLabel: 'Ảnh đại diện bài viết – 16:10',
    placeholderSubtext: 'Đặt file tại /public/media/blog-thumb-giay-diep-dong-ho-hop-qua-bui-vi.jpg',
    targetFileHint: '/media/blog-thumb-giay-diep-dong-ho-hop-qua-bui-vi.jpg',
  },
  'blog-thumb-bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac': {
    id: 'blog-thumb-bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac',
    type: 'banner',
    aspectRatio: '16/10',
    src: '',
    alt: 'Bí quyết bảo quản và thưởng thức nem Kinh Bắc giữ trọn hương vị',
    placeholderLabel: 'Ảnh đại diện bài viết – 16:10',
    placeholderSubtext: 'Đặt file tại /public/media/blog-thumb-bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac.jpg',
    targetFileHint: '/media/blog-thumb-bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac.jpg',
  },
  'blog-thumb-goi-y-chon-set-qua-bieu-di-san-bui-vi': {
    id: 'blog-thumb-goi-y-chon-set-qua-bieu-di-san-bui-vi',
    type: 'banner',
    aspectRatio: '16/10',
    src: '',
    alt: 'Gợi ý chọn set quà biếu di sản Bùi Vị phù hợp cho từng dịp trọng đại',
    placeholderLabel: 'Ảnh đại diện bài viết – 16:10',
    placeholderSubtext: 'Đặt file tại /public/media/blog-thumb-goi-y-chon-set-qua-bieu-di-san-bui-vi.jpg',
    targetFileHint: '/media/blog-thumb-goi-y-chon-set-qua-bieu-di-san-bui-vi.jpg',
  },
  'blog-thumb-bui-vi-ra-mat-bo-suu-tap-qua-tet-2027': {
    id: 'blog-thumb-bui-vi-ra-mat-bo-suu-tap-qua-tet-2027',
    type: 'banner',
    aspectRatio: '16/10',
    src: '',
    alt: 'Bùi Vị ra mắt bộ sưu tập quà Tết 2027 - Quà biếu Di sản',
    placeholderLabel: 'Ảnh đại diện bài viết – 16:10',
    placeholderSubtext: 'Đặt file tại /public/media/blog-thumb-bui-vi-ra-mat-bo-suu-tap-qua-tet-2027.jpg',
    targetFileHint: '/media/blog-thumb-bui-vi-ra-mat-bo-suu-tap-qua-tet-2027.jpg',
  },
  'blog-thumb-khong-gian-di-san-bui-vi-thuan-thanh': {
    id: 'blog-thumb-khong-gian-di-san-bui-vi-thuan-thanh',
    type: 'banner',
    aspectRatio: '16/10',
    src: '',
    alt: 'Khám phá Không gian Di sản Bùi Vị tại Thuận Thành, Bắc Ninh',
    placeholderLabel: 'Ảnh đại diện bài viết – 16:10',
    placeholderSubtext: 'Đặt file tại /public/media/blog-thumb-khong-gian-di-san-bui-vi-thuan-thanh.jpg',
    targetFileHint: '/media/blog-thumb-khong-gian-di-san-bui-vi-thuan-thanh.jpg',
  },

  // BLOG HERO SLOTS (16:9 under the title on article detail page)
  'blog-hero-nghe-thuat-lam-nem-bui-kinh-bac': {
    id: 'blog-hero-nghe-thuat-lam-nem-bui-kinh-bac',
    type: 'banner',
    aspectRatio: '16/9',
    src: '',
    alt: 'Nghệ thuật làm nem bùi Kinh Bắc: Khi hương thính gạo giữ trọn hồn quê',
    placeholderLabel: 'Ảnh chính bài viết – 16:9',
    placeholderSubtext: 'Đặt file tại /public/media/blog-hero-nghe-thuat-lam-nem-bui-kinh-bac.jpg',
    targetFileHint: '/media/blog-hero-nghe-thuat-lam-nem-bui-kinh-bac.jpg',
  },
  'blog-hero-giay-diep-dong-ho-hop-qua-bui-vi': {
    id: 'blog-hero-giay-diep-dong-ho-hop-qua-bui-vi',
    type: 'banner',
    aspectRatio: '16/9',
    src: '',
    alt: 'Giấy Điệp Đông Hồ và hành trình đưa di sản vào hộp quà Bùi Vị',
    placeholderLabel: 'Ảnh chính bài viết – 16:9',
    placeholderSubtext: 'Đặt file tại /public/media/blog-hero-giay-diep-dong-ho-hop-qua-bui-vi.jpg',
    targetFileHint: '/media/blog-hero-giay-diep-dong-ho-hop-qua-bui-vi.jpg',
  },
  'blog-hero-bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac': {
    id: 'blog-hero-bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac',
    type: 'banner',
    aspectRatio: '16/9',
    src: '',
    alt: 'Bí quyết bảo quản và thưởng thức nem Kinh Bắc giữ trọn hương vị',
    placeholderLabel: 'Ảnh chính bài viết – 16:9',
    placeholderSubtext: 'Đặt file tại /public/media/blog-hero-bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac.jpg',
    targetFileHint: '/media/blog-hero-bi-quyet-bao-quan-thuong-thuc-nem-kinh-bac.jpg',
  },
  'blog-hero-goi-y-chon-set-qua-bieu-di-san-bui-vi': {
    id: 'blog-hero-goi-y-chon-set-qua-bieu-di-san-bui-vi',
    type: 'banner',
    aspectRatio: '16/9',
    src: '',
    alt: 'Gợi ý chọn set quà biếu di sản Bùi Vị phù hợp cho từng dịp trọng đại',
    placeholderLabel: 'Ảnh chính bài viết – 16:9',
    placeholderSubtext: 'Đặt file tại /public/media/blog-hero-goi-y-chon-set-qua-bieu-di-san-bui-vi.jpg',
    targetFileHint: '/media/blog-hero-goi-y-chon-set-qua-bieu-di-san-bui-vi.jpg',
  },
  'blog-hero-bui-vi-ra-mat-bo-suu-tap-qua-tet-2027': {
    id: 'blog-hero-bui-vi-ra-mat-bo-suu-tap-qua-tet-2027',
    type: 'banner',
    aspectRatio: '16/9',
    src: '',
    alt: 'Bùi Vị ra mắt bộ sưu tập quà Tết 2027 - Quà biếu Di sản',
    placeholderLabel: 'Ảnh chính bài viết – 16:9',
    placeholderSubtext: 'Đặt file tại /public/media/blog-hero-bui-vi-ra-mat-bo-suu-tap-qua-tet-2027.jpg',
    targetFileHint: '/media/blog-hero-bui-vi-ra-mat-bo-suu-tap-qua-tet-2027.jpg',
  },
  'blog-hero-khong-gian-di-san-bui-vi-thuan-thanh': {
    id: 'blog-hero-khong-gian-di-san-bui-vi-thuan-thanh',
    type: 'banner',
    aspectRatio: '16/9',
    src: '',
    alt: 'Khám phá Không gian Di sản Bùi Vị tại Thuận Thành, Bắc Ninh',
    placeholderLabel: 'Ảnh chính bài viết – 16:9',
    placeholderSubtext: 'Đặt file tại /public/media/blog-hero-khong-gian-di-san-bui-vi-thuan-thanh.jpg',
    targetFileHint: '/media/blog-hero-khong-gian-di-san-bui-vi-thuan-thanh.jpg',
  },
};
