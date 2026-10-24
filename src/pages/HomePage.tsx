import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Ticket,
  BookOpen,
  ShieldCheck,
  Award,
  Gift,
  Flame,
} from 'lucide-react';
import { SITE_CONFIG } from '../data/siteConfig';
import { PRODUCTS, formatPrice, getDiscountPercent } from '../data/products';
import { VOUCHERS } from '../data/vouchers';
import { ARTICLES } from '../data/articles';
import { ProductCard } from '../components/ProductCard';
import { VoucherCard } from '../components/VoucherCard';
import { MediaSlot } from '../components/MediaSlot';
import { AddToCartButton } from '../components/AddToCartButton';
import { BuyNowButton } from '../components/BuyNowButton';
import {
  AnimationSlot,
  Reveal,
  Stagger,
  WordRevealQuote,
  MOTION_TOKENS,
  useMotionPreferences,
} from '../motion';

export const HomePage: React.FC = () => {
  const { canKenBurns: allowKenBurns } = useMotionPreferences();
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    document.title = 'BÙI VỊ – Một miền vun đắp, một vị lưu hương | Quà Biếu Nem Kinh Bắc Di Sản';
  }, []);

  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      setReadingProgress(ratio);
    };
    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    window.addEventListener('resize', updateReadingProgress, { passive: true });
    updateReadingProgress();
    return () => {
      window.removeEventListener('scroll', updateReadingProgress);
      window.removeEventListener('resize', updateReadingProgress);
    };
  }, []);

  // All 7 featured products (3 single nem + 3 gift sets + Combo 3 hộp quà)
  const featuredProducts = PRODUCTS.filter((p) => p.featured);
  const highlightVouchers = VOUCHERS.slice(0, 3);
  const latestArticles = ARTICLES.slice(0, 3);
  const heroProduct = PRODUCTS.find((p) => p.id === 'prod-set-vinh-hoa') || PRODUCTS[3];
  const comboProduct = PRODUCTS.find((p) => p.id === 'prod-combo-3-set')!;
  const comboDiscount = getDiscountPercent(comboProduct.price, comboProduct.oldPrice);

  return (
    <div>
      {/* Top Heritage Red & Gold Reading Progress Bar on HomePage */}
      <div
        aria-hidden="true"
        data-testid="home-reading-progress-bar"
        className="fixed top-0 left-0 right-0 h-[3.5px] z-[60] bg-[#1F3D2A]/15 pointer-events-none"
      >
        <div
          className="h-full bg-gradient-to-r from-[#951722] via-[#9B0514] to-[#F3D27A] origin-left transition-transform duration-150"
          style={{ transform: `scaleX(${readingProgress})` }}
        />
      </div>

      {/* 1) HERO BANNER SECTION (Cream background #FFF5E4, Ink text #171815, Heritage Red headings #951722) */}
      <section className="relative bg-[#FFF5E4] text-[#171815] overflow-hidden border-b-2 border-[#951722]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy Column: Staggered Reveal (0ms -> 80ms -> 160ms -> 240ms) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <Reveal delay={0}>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1F3D2A] bg-[#1F3D2A]/10 px-3 py-1.5 rounded-lg border border-[#1F3D2A]/25">
                    <Sparkles className="w-4 h-4 text-[#951722]" />
                    <span>Tinh Hoa Ẩm Thực & Quà Biếu Di Sản Kinh Bắc</span>
                  </div>
                </Reveal>

                <Reveal delay={80}>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#951722] leading-tight">
                    Từ Vị Bùi Thính Gạo Quê Nhà Đến Tác Phẩm Di Sản Đông Hồ
                  </h1>
                </Reveal>

                <Reveal delay={160}>
                  <div className="space-y-2.5">
                    <p className="font-display text-lg sm:text-xl text-[#1F3D2A]">
                      “{SITE_CONFIG.slogan}”
                    </p>
                    {/* Animation Slot #1: home-hero-ornament under slogan */}
                    <AnimationSlot id="home-hero-ornament" className="max-w-md" />
                  </div>
                </Reveal>

                <Reveal delay={200}>
                  <p
                    lang="vi"
                    className="story-justify text-base sm:text-lg text-[#171815]/85 leading-relaxed max-w-2xl"
                  >
                    {SITE_CONFIG.brandDescription}
                  </p>
                </Reveal>
              </div>

              {/* Hero CTAs (P1-3: ONE primary "Mua ngay" + ONE secondary outline "Khám phá bộ sưu tập" -> /san-pham) */}
              <Reveal delay={240}>
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <BuyNowButton product={heroProduct} size="lg" className="min-w-[180px]" />

                  <Link
                    to="/san-pham"
                    className="btn-sheen min-h-[56px] px-6 py-3.5 rounded-xl border-2 border-[#951722] text-[#951722] hover:bg-[#951722] hover:text-[#FFF5E4] active:scale-[0.98] font-bold text-[18px] flex items-center gap-2 transition-all whitespace-nowrap"
                  >
                    <span>Khám phá bộ sưu tập</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </Reveal>

              {/* Featured Promotion Banner inside Hero: whole banner clickable -> /khuyen-mai, single CTA "Xem chi tiết ưu đãi" */}
              <Reveal delay={300}>
                <Link
                  to="/khuyen-mai"
                  className="p-4 sm:p-5 rounded-2xl bg-[#1F3D2A] hover:bg-[#183121] text-[#FFF5E4] border-2 border-[#F3D27A]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md transition-colors group block"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F3D27A]">
                      <Ticket className="w-4 h-4" />
                      <span>Ưu đãi đặc quyền đang diễn ra</span>
                    </div>
                    <p className="text-sm font-medium text-[#FFF5E4] leading-relaxed group-hover:text-[#F3D27A] transition-colors">
                      Giảm ngay{' '}
                      <strong className="text-[#F3D27A]">
                        15% (mã QUATET15, tối đa 60.000đ)
                      </strong>{' '}
                      cho Set Vinh Hoa - Phú Quý & Set Độc Bản • Mua từ 2 Set{' '}
                      <strong className="text-[#F3D27A]">Tặng 1 hộp Nem chua (mã TANGHOP)</strong>
                    </p>
                  </div>

                  <span className="min-h-[46px] px-4 py-2 rounded-xl border border-[#F3D27A]/70 text-[#F3D27A] group-hover:bg-[#F3D27A] group-hover:text-[#171815] font-bold text-xs whitespace-nowrap inline-flex items-center justify-center gap-1.5 transition-colors shrink-0">
                    <span>Xem chi tiết ưu đãi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </Reveal>
            </div>

            {/* Right Column: MediaSlot 'home-hero-banner' (16:9) with subtle Ken Burns slow zoom + Featured Set Quick Bar */}
            <div className="lg:col-span-6 space-y-4">
              <Reveal direction="up" delay={120}>
                <div className="overflow-hidden rounded-2xl">
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={allowKenBurns ? { scale: 1.03 } : { scale: 1 }}
                    transition={
                      allowKenBurns
                        ? {
                            duration: 8,
                            ease: MOTION_TOKENS.easings.standard,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }
                        : { duration: 0.2 }
                    }
                  >
                    <MediaSlot slotId="home-hero-banner" />
                  </motion.div>
                </div>
              </Reveal>

              <Reveal direction="up" delay={200}>
                <div className="p-4 rounded-2xl bg-[#FFFBF2] border-2 border-[#951722]/30 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-[#951722] text-[#FFF5E4] font-display text-[11px] px-2.5 py-0.5 rounded-md">
                        <Flame className="w-3 h-3 text-[#F3D27A]" />
                        <span>Bán chạy</span>
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1F3D2A]">
                        Set quà 1 hộp – 5 nem
                      </span>
                    </div>
                    <Link
                      to={`/san-pham/${heroProduct.slug}`}
                      className="block font-display text-[20px] text-[#951722] hover:underline"
                    >
                      {heroProduct.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 ml-auto">
                    <div className="text-right">
                      <span className="font-price text-2xl text-[#9B0514] block">
                        {formatPrice(heroProduct.price)}
                      </span>
                      {heroProduct.oldPrice && (
                        <span className="font-price text-xs text-[#171815]/50 line-through">
                          {formatPrice(heroProduct.oldPrice)}
                        </span>
                      )}
                    </div>
                    <BuyNowButton product={heroProduct} size="sm" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Animation Slot #2: home-section-divider */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <AnimationSlot id="home-section-divider" />
      </div>

      {/* Real 5-Slide Carousel Banner from pictures/ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Reveal>
          <div className="overflow-hidden rounded-2xl shadow-sm border border-[#951722]/20">
            <MediaSlot slotId="home-hero-carousel" aspectRatio="4/1" />
          </div>
        </Reveal>
      </div>

      {/* 2) SẢN PHẨM NỔI BẬT */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A] mb-2">
                  Tinh tuyển từ làng nghề Kinh Bắc
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-[#951722]">
                  Sản Phẩm Nổi Bật
                </h2>
                <p className="text-base text-[#171815]/80 mt-2 max-w-2xl">
                  Ba thức nem truyền thống (Nem chua 85.000đ, Nem bùi 95.000đ, Nem ngựa 110.000đ),
                  ba hộp quà lục giác giấy Điệp (1 hộp – 5 nem) và Combo 3 hộp quà trọn bộ.
                </p>
              </div>
              <Link
                to="/san-pham"
                className="inline-flex items-center gap-2 text-[#951722] hover:text-[#9B0514] font-bold text-lg whitespace-nowrap group"
              >
                <span>Xem tất cả sản phẩm</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Stagger>
        </div>

        {/* Highlight Banner for Combo 3 Hộp Quà (Links directly to /san-pham/combo-3-hop-qua) */}
        <Reveal>
          <div className="p-6 md:p-8 rounded-2xl bg-[#FFFBF2] double-border-heritage flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#1F3D2A]">
                <span className="bg-[#9B0514] text-[#FFF5E4] font-price px-2.5 py-0.5 rounded">
                  -{comboDiscount}% (Tiết kiệm 60.000đ)
                </span>
                <span>·</span>
                <Link
                  to="/khuyen-mai#ma-voucher-COMBO3"
                  className="hover:text-[#951722] underline underline-offset-2"
                >
                  Tự động giảm thêm 50.000đ + túi Điệp & thiệp viết tay (COMBO3)
                </Link>
                <span>·</span>
                <Link
                  to="/khuyen-mai#ma-voucher-TANGHOP"
                  className="hover:text-[#951722] underline underline-offset-2"
                >
                  Tặng 1 hộp Nem chua (TANGHOP)
                </Link>
              </div>

              <Link
                to={`/san-pham/${comboProduct.slug}`}
                className="block font-display text-2xl md:text-3xl text-[#951722] hover:underline"
              >
                {comboProduct.name} (Vinh Hoa + Bình An + Độc Bản)
              </Link>

              <p className="text-sm md:text-base text-[#171815]/80">
                Sở hữu trọn bộ 3 dòng hộp quà lục giác của Bùi Vị (tổng 15 nem đặc sản) chỉ với{' '}
                <strong className="font-price text-xl text-[#9B0514]">
                  {formatPrice(comboProduct.price)}
                </strong>{' '}
                (Giá gốc:{' '}
                <span className="line-through font-price">
                  {formatPrice(comboProduct.oldPrice!)}
                </span>
                ), tặng kèm túi giấy Điệp và thiệp viết tay.{' '}
                <Link
                  to={`/san-pham/${comboProduct.slug}`}
                  className="font-bold text-[#951722] underline hover:text-[#9B0514]"
                >
                  Xem chi tiết Combo →
                </Link>
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto shrink-0">
              <AddToCartButton
                product={comboProduct}
                size="lg"
                className="flex-1 sm:flex-initial"
              />
              <BuyNowButton product={comboProduct} size="lg" className="flex-1 sm:flex-initial" />
            </div>
          </div>
        </Reveal>

        {/* MediaSlot 'home-carousel' (5-slide carousel below Featured Products) */}
        <Reveal>
          <div className="pt-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
                  Không gian hình ảnh di sản
                </p>
                <h3 className="font-display text-2xl text-[#951722]">
                  Bộ Sưu Tập Hộp Quà Tranh Dân Gian Đông Hồ
                </h3>
              </div>
              <Link
                to="/san-pham?nhom=set-qua-bieu"
                className="text-sm font-bold text-[#951722] hover:underline"
              >
                Khám phá các Set quà →
              </Link>
            </div>
            <MediaSlot slotId="home-carousel" />
          </div>
        </Reveal>
      </section>

      {/* 3) KHUYẾN MÃI SECTION */}
      <section className="py-14 md:py-20 bg-[#F5E6CC]/60 border-y-2 border-[#951722]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A] mb-2">
                  Ưu đãi & Quà tặng đặc quyền
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-[#951722]">
                  Chương Trình Khuyến Mãi Nổi Bật
                </h2>
                <p className="text-base text-[#171815]/80 mt-2">
                  Sao chép mã, bấm “Dùng mã này” hoặc bấm “Xem chi tiết ưu đãi” để xem điều kiện áp
                  dụng tại trang Khuyến mãi.
                </p>
              </div>
              <Link
                to="/khuyen-mai"
                className="inline-flex items-center gap-2 text-[#951722] hover:text-[#9B0514] font-bold text-lg whitespace-nowrap group"
              >
                <span>Xem tất cả ưu đãi</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left/Side Poster Slot (4:5) */}
            <Reveal className="lg:col-span-4 space-y-3">
              <MediaSlot slotId="home-promo-poster" />
              <div className="p-4 rounded-xl bg-[#FFFBF2] border border-[#951722]/25 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#1F3D2A]">
                  Tổng hợp 6 mã giảm giá & quà tặng Bùi Vị
                </span>
                <Link
                  to="/khuyen-mai"
                  className="text-xs font-bold text-[#951722] hover:underline whitespace-nowrap"
                >
                  Xem chi tiết ưu đãi →
                </Link>
              </div>
            </Reveal>

            {/* Right: 3 Highlight Voucher Cards */}
            <Stagger className="lg:col-span-8 grid grid-cols-1 gap-6">
              {highlightVouchers.map((voucher) => (
                <VoucherCard key={voucher.code} voucher={voucher} compact />
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* 4) CÂU CHUYỆN BÙI VỊ SECTION */}
      <section className="py-14 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFBF2] double-border-forest rounded-3xl p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5" lang="vi">
            <Reveal>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
                <Award className="w-4 h-4 text-[#951722]" />
                <span>Câu chuyện Bùi Vị</span>
              </div>

              <h2 className="font-display text-3xl md:text-4xl text-[#951722] leading-snug mt-2">
                {SITE_CONFIG.slogan}
              </h2>
            </Reveal>

            <div className="space-y-4 max-w-[760px] text-[16px] md:text-[18px] text-[#171815]/90 leading-[1.75]">
              {/* Paragraph 1: Italic + Curly Quotes + Justified (.quote-lead) with word-by-word reveal */}
              <WordRevealQuote
                text={`“${SITE_CONFIG.brandDescription}”`}
                className="story-justify quote-lead text-[#1F3D2A] bg-[#FFF5E4] p-4 rounded-xl border-l-4 border-[#951722]"
              />

              {/* Paragraph 2: Regular weight + Justified */}
              <Reveal delay={80}>
                <p lang="vi" className="story-justify md:text-[18px]">
                  {SITE_CONFIG.productIntroduction}
                </p>
              </Reveal>

              {/* 3 Product Lines: Regular weight + Justified */}
              <Stagger className="space-y-2.5 pt-1">
                {SITE_CONFIG.storyProductLines.map((line) => (
                  <p key={line.name} lang="vi" className="story-justify md:text-[18px]">
                    <span className="font-display text-[#951722] underline underline-offset-4">
                      • {line.name}:
                    </span>{' '}
                    {line.description}
                  </p>
                ))}
              </Stagger>
            </div>

            <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 items-stretch">
              <div className="h-full p-3.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/20 flex flex-col justify-between">
                <div>
                  <ShieldCheck className="w-5 h-5 text-[#951722] mb-1" />
                  <p className="font-display text-[18px] text-[#951722]">Thính gạo rang củi</p>
                </div>
                <p className="text-sm text-[#171815]/80 mt-0.5">
                  Nếp cái hoa vàng dậy hương bùi thơm chuẩn vị Kinh Bắc
                </p>
              </div>
              <div className="h-full p-3.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/20 flex flex-col justify-between">
                <div>
                  <Sparkles className="w-5 h-5 text-[#951722] mb-1" />
                  <p className="font-display text-[18px] text-[#951722]">Giấy Điệp vỏ sò</p>
                </div>
                <p className="text-sm text-[#171815]/80 mt-0.5">
                  Óng ánh sắc trắng ngà tự nhiên từ làng tranh Đông Hồ
                </p>
              </div>
              <div className="h-full p-3.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/20 flex flex-col justify-between">
                <div>
                  <Gift className="w-5 h-5 text-[#951722] mb-1" />
                  <p className="font-display text-[18px] text-[#951722]">Hộp mở thành tranh</p>
                </div>
                <p className="text-sm text-[#171815]/80 mt-0.5">
                  Cấu trúc hộp lục giác độc bản lưu giữ làm tranh treo
                </p>
              </div>
            </Stagger>

            <Reveal delay={140}>
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Link
                  to="/ve-bui-vi"
                  className="btn-sheen min-h-[52px] px-6 py-3 rounded-xl bg-[#1F3D2A] hover:bg-[#162D1F] active:scale-[0.98] text-[#FFF5E4] text-[17px] tracking-[0.2px] leading-normal whitespace-nowrap inline-flex items-center gap-2 transition-all"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Xem câu chuyện</span>
                </Link>
                <Link
                  to="/san-pham/set-doc-ban"
                  className="btn-sheen min-h-[52px] px-6 py-3 rounded-xl border-2 border-[#951722] text-[#951722] hover:bg-[#951722] hover:text-[#FFF5E4] active:scale-[0.98] text-[17px] tracking-[0.2px] leading-normal whitespace-nowrap inline-flex items-center gap-2 transition-all"
                >
                  <span>Khám phá hộp lục giác</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right Column: MediaSlot 'home-brand-video' (16:9) + Animation Slot #3: home-gift-unbox */}
          <div className="lg:col-span-5 space-y-4">
            <Reveal>
              <MediaSlot slotId="home-brand-video" />
            </Reveal>
            <Reveal delay={100}>
              <AnimationSlot id="home-gift-unbox" />
            </Reveal>
            <Reveal delay={160}>
              <p
                lang="vi"
                className="story-justify text-sm text-[#1F3D2A] bg-[#FFF5E4] p-3.5 rounded-xl border border-[#951722]/20"
              >
                “Ngay cả khi hương vị đã trôi qua, chiếc hộp vẫn mở ra thành một bức tranh di sản
                vẹn nguyên để ngắm nhìn và lưu giữ.”
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5) BÀI VIẾT SECTION (3 latest article cards) */}
      <section className="py-14 md:py-20 bg-[#F5E6CC]/40 border-t border-[#951722]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A] mb-2">
                  Góc văn hóa & Thưởng thức
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-[#951722]">
                  Bài Viết Mới Nhất
                </h2>
                <p className="text-base text-[#171815]/80 mt-2">
                  Khám phá nét đẹp văn hóa ẩm thực Kinh Bắc, bí quyết bảo quản nem và câu chuyện
                  tranh Đông Hồ.
                </p>
              </div>
              <Link
                to="/bai-viet"
                className="inline-flex items-center gap-2 text-[#951722] hover:text-[#9B0514] font-bold text-lg whitespace-nowrap group"
              >
                <span>Xem tất cả bài viết</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
            {latestArticles.map((article) => (
              <article
                key={article.id}
                className="h-full bg-[#FFFBF2] border border-[#951722]/25 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 md:hover:-translate-y-1 hover:shadow-md"
              >
                <div>
                  <div className="p-3 pb-0">
                    <MediaSlot
                      slotId={article.thumbnail}
                      type="banner"
                      aspectRatio="16/10"
                      link={`/bai-viet/${article.slug}`}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-[#1F3D2A] mb-2">
                      <span>{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.date}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.readingTime}</span>
                    </div>
                    <h3 className="font-display !text-[20px] leading-[1.3] mb-2 min-h-[52px] line-clamp-2">
                      <Link
                        to={`/bai-viet/${article.slug}`}
                        className="font-display text-[20px] text-[#171815] hover:text-[#951722] transition-colors block leading-[1.3] line-clamp-2"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    <p
                      lang="vi"
                      className="story-justify text-sm text-[#171815]/80 line-clamp-3 leading-relaxed min-h-[66px]"
                    >
                      {article.excerpt}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2">
                  <Link
                    to={`/bai-viet/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm text-[#951722] hover:text-[#9B0514] underline underline-offset-4 group"
                  >
                    <span>Đọc tiếp</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
};
