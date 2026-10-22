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
    aspectRatio: '12/5',
    src: '',
    mobileSrc: '',
    alt: 'Banner chính BÙI VỊ – Quà biếu Nem Kinh Bắc trong hộp giấy Điệp Đông Hồ',
    placeholderLabel: 'Khu vực chèn Banner – 1920×800 (Desktop & Mobile)',
    placeholderSubtext: 'Đặt file tại /public/media/home-hero-banner.jpg',
    targetFileHint: '/media/home-hero-banner.jpg',
    link: '/san-pham',
  },
  'home-carousel': {
    id: 'home-carousel',
    type: 'carousel',
    aspectRatio: '16/9',
    src: '',
    slides: [
      {
        src: '',
        alt: 'Slide 1 – Bộ sưu tập Hộp quà Di sản Bùi Vị',
        caption: 'Slide 01/05 · Khu vực chèn Poster / Ảnh sản phẩm (Set Vinh Hoa - Phú Quý)',
        link: '/san-pham/set-vinh-hoa-phu-quy',
      },
      {
        src: '',
        alt: 'Slide 2 – Set Bình An - Sung Túc sum họp ấm cúng',
        caption: 'Slide 02/05 · Khu vực chèn Poster / Ảnh sản phẩm (Set Bình An - Sung Túc)',
        link: '/san-pham/set-binh-an-sung-tuc',
      },
      {
        src: '',
        alt: 'Slide 3 – Set Độc Bản hộp lục giác mở thành tranh Đông Hồ',
        caption: 'Slide 03/05 · Khu vực chèn Poster / Ảnh sản phẩm (Set Độc Bản – Hộp lục giác)',
        link: '/san-pham/set-doc-ban',
      },
      {
        src: '',
        alt: 'Slide 4 – Combo 3 hộp quà tiết kiệm 60.000đ',
        caption: 'Slide 04/05 · Khu vực chèn Poster / Ảnh sản phẩm (Combo 3 hộp quà – 950.000đ)',
        link: '/san-pham/combo-3-hop-qua',
      },
      {
        src: '',
        alt: 'Slide 5 – Ba thức Nem Kinh Bắc truyền thống',
        caption: 'Slide 05/05 · Khu vực chèn Poster / Ảnh sản phẩm (Nem chua · Nem bùi · Nem ngựa)',
        link: '/san-pham',
      },
    ],
    alt: 'Carousel 5 slide hình ảnh và poster sản phẩm Bùi Vị',
    placeholderLabel: 'Khu vực chèn Carousel – 5 Slide Ảnh / Poster Sản Phẩm',
    placeholderSubtext: 'Đặt 5 file tại /public/media/carousel-slide-1.jpg ... 5.jpg',
    targetFileHint: '/media/carousel-slide-1..5.jpg',
    link: '/san-pham',
  },
  'home-promo-poster': {
    id: 'home-promo-poster',
    type: 'poster',
    aspectRatio: '4/5',
    src: '',
    alt: 'Poster chương trình khuyến mãi BÙI VỊ',
    placeholderLabel: 'Khu vực chèn Poster Khuyến Mãi – Tỷ lệ 4:5',
    placeholderSubtext: 'Đặt file tại /public/media/home-promo-poster.jpg',
    targetFileHint: '/media/home-promo-poster.jpg',
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
    src: '',
    alt: 'Banner trang Về Bùi Vị – Một miền vun đắp, một vị lưu hương',
    placeholderLabel: 'Khu vực chèn Banner Về Bùi Vị – 1920×800',
    placeholderSubtext: 'Đặt file tại /public/media/about-banner.jpg',
    targetFileHint: '/media/about-banner.jpg',
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
    aspectRatio: '12/5',
    src: '',
    alt: 'Banner chương trình khuyến mãi BÙI VỊ',
    placeholderLabel: 'Khu vực chèn Banner Khuyến Mãi – 1920×800',
    placeholderSubtext: 'Đặt file tại /public/media/promo-banner.jpg',
    targetFileHint: '/media/promo-banner.jpg',
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
