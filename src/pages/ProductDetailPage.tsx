import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Minus,
  Plus,
  CheckCircle2,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Flame,
  Gift,
  Sparkles,
} from 'lucide-react';
import {
  PRODUCTS,
  formatPrice,
  getDiscountPercent,
  getSavingsAmount,
} from '../data/products';
import { calculateCartPromotions } from '../utils/promotionEngine';
import { useStore } from '../context/StoreContext';
import { Img } from '../components/Img';
import { MediaSlot } from '../components/MediaSlot';
import { VoucherBox } from '../components/VoucherBox';
import { AddToCartButton } from '../components/AddToCartButton';
import { BuyNowButton } from '../components/BuyNowButton';
import { ProductCard } from '../components/ProductCard';
import { NotFoundPage } from './SitemapAndNotFoundPages';
import {
  AnimatedPrice,
  AnimationSlot,
  RollingNumber,
  Stagger,
  MOTION_TOKENS,
  useMotionPreferences,
} from '../motion';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, startBuyNow, appliedVoucherCode, setPdpMobileBarVisible } = useStore();
  const { reducedMotion } = useMotionPreferences();

  // Support current slug as well as legacySlugs
  const product = PRODUCTS.find(
    (p) => p.slug === slug || (p.legacySlugs && slug && p.legacySlugs.includes(slug))
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedPack, setSelectedPack] = useState('');

  // Local voucher code state for interactive calculation on the Product Detail page
  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string | null>(
    appliedVoucherCode
  );
  const [ineligibleWarning, setIneligibleWarning] = useState<string | null>(null);

  // Accordion state: first item open by default, multiple items can be open simultaneously
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
  });

  // Track if main CTA block is in view (for mobile sticky bar slide-up)
  const mainCtaRef = useRef<HTMLDivElement | null>(null);
  const [mobileStickyVisible, setMobileStickyVisible] = useState(false);

  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setQuantity(1);
      setSelectedPack(product.packOptions[0] || product.packSpec);
      setSelectedVoucherCode(appliedVoucherCode);
      setIneligibleWarning(null);
      setOpenAccordions({ 0: true, 1: false, 2: false, 3: false, 4: false });
      document.title = `${product.name} (${formatPrice(product.price)}) | BÙI VỊ – Quà Biếu Di Sản`;
    }
  }, [product, appliedVoucherCode]);

  // Observe vertical scrolling images on desktop to highlight active dot/thumbnail index
  useEffect(() => {
    if (!product) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-image-index'));
            if (!Number.isNaN(idx)) {
              setActiveImageIndex(idx);
            }
          }
        }
      },
      { threshold: 0.55 }
    );

    imageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [product]);

  // Observe main CTA block on mobile to slide up sticky bar when main CTAs scroll out of view
  useEffect(() => {
    const el = mainCtaRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const showBar = !entry.isIntersecting;
        setMobileStickyVisible(showBar);
        setPdpMobileBarVisible(showBar);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      setPdpMobileBarVisible(false);
    };
  }, [product, setPdpMobileBarVisible]);

  // Compute live promotion breakdown for current product & quantity
  const detailPromotion = useMemo(() => {
    if (!product) {
      return calculateCartPromotions([], null, true, true, true);
    }
    return calculateCartPromotions(
      [
        {
          productId: product.id,
          quantity,
          selectedPack: selectedPack || product.packOptions[0],
          selected: true,
        },
      ],
      selectedVoucherCode,
      true,
      true,
      true
    );
  }, [product, quantity, selectedPack, selectedVoucherCode]);

  // Re-check eligibility when quantity changes (Section B3.4)
  useEffect(() => {
    if (!product) return;
    if (selectedVoucherCode && selectedVoucherCode !== 'NONE') {
      const status = detailPromotion.voucherStatuses.find(
        (s) => s.voucher.code === selectedVoucherCode
      );
      if (status && !status.eligible) {
        const fallbackCode = detailPromotion.bestEligibleDiscountVoucher?.voucher.code || null;
        setIneligibleWarning(
          `Số lượng hiện tại chưa đủ điều kiện áp dụng mã ${selectedVoucherCode}.${
            fallbackCode
              ? ` Hệ thống đã tự động chọn mã tốt nhất còn lại (${fallbackCode}).`
              : ''
          }`
        );
        setSelectedVoucherCode(fallbackCode);
      } else {
        setIneligibleWarning(null);
      }
    }
  }, [quantity, product, selectedVoucherCode, detailPromotion]);

  if (!product) {
    return <NotFoundPage />;
  }

  const discountPercent = getDiscountPercent(product.price, product.oldPrice);
  const unitSavings = getSavingsAmount(product.price, product.oldPrice);
  const currentImg = product.images[activeImageIndex] || product.images[0];

  const voucherCarryCode =
    selectedVoucherCode === 'NONE'
      ? 'NONE'
      : detailPromotion.appliedDiscountCode || selectedVoucherCode;

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedPack, voucherCarryCode);
  };

  const handleBuyNow = () => {
    startBuyNow(product.id, quantity, selectedPack, voucherCarryCode);
    navigate('/thanh-toan?mode=buynow');
  };

  const scrollToImage = (idx: number) => {
    setActiveImageIndex(idx);
    const el = imageRefs.current[idx];
    if (el && window.innerWidth >= 1024) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const toggleAccordion = (idx: number) => {
    setOpenAccordions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
  const liveSubtotalAfterDiscount = Math.max(
    0,
    detailPromotion.subtotal - detailPromotion.voucherDiscountAmount
  );

  const accordionItems = [
    {
      title: 'Mô tả sản phẩm & Cách thưởng thức',
      content: (
        <div className="space-y-4 text-sm sm:text-base text-[#171815]/90 leading-relaxed" lang="vi">
          <p className="story-justify">{product.description}</p>
          <div className="p-4 rounded-xl bg-[#FFF5E4] border border-[#1F3D2A]/25 space-y-1.5">
            <h4 className="font-bold text-[#1F3D2A] text-sm uppercase tracking-wider">
              Cách thưởng thức trọn vị Kinh Bắc:
            </h4>
            <p className="story-justify text-sm text-[#171815]/85">{product.enjoyment}</p>
          </div>
          {product.isGiftSet && (
            <div className="pt-2">
              <MediaSlot slotId="product-unboxing-video" />
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Thành phần & Quy cách',
      content: (
        <div className="space-y-4 text-sm sm:text-base text-[#171815]/90 leading-relaxed">
          <div className="p-4 rounded-xl bg-[#FFF5E4] border border-[#951722]/20 space-y-1">
            <p className="font-bold text-[#951722]">
              Quy cách đóng gói: <span className="text-[#171815]">{product.packSpec}</span>
            </p>
            <p className="text-xs sm:text-sm text-[#171815]/80">
              Khối lượng / Chi tiết: {product.weightOrCount}
            </p>
            {product.nemMixPerBox && (
              <p className="text-xs sm:text-sm font-semibold text-[#1F3D2A]">
                Cấu hình nem trong hộp: {product.nemMixPerBox}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[#1F3D2A] text-sm uppercase tracking-wider">
              Thành phần chi tiết:
            </h4>
            <ul className="space-y-2">
              {product.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFF5E4]/70 border border-[#951722]/15 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#1F3D2A] shrink-0 mt-0.5" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {product.includedSets && product.includedSets.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h4 className="font-bold text-[#951722] text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-4 h-4" />
                <span>Chi tiết 3 Hộp Quà Trong Combo:</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {product.includedSets.map((setInfo) => (
                  <Link
                    key={setInfo.id}
                    to={`/san-pham/${setInfo.slug}`}
                    className="p-3.5 rounded-xl bg-[#FFF5E4] border border-[#951722]/25 hover:border-[#951722] transition-colors block space-y-1"
                  >
                    <p className="font-bold text-sm text-[#951722]">{setInfo.name}</p>
                    <p className="text-xs font-semibold text-[#1F3D2A]">
                      {setInfo.packSpec} · Giá lẻ: {formatPrice(setInfo.price)}
                    </p>
                    <p className="text-xs text-[#171815]/75">{setInfo.nemMixPerBox}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Hướng dẫn bảo quản',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
          <div className="p-4 rounded-xl bg-[#FFF5E4] border border-[#951722]/20 space-y-1.5">
            <h4 className="font-bold text-[#951722]">Nhiệt độ & Điều kiện bảo quản</h4>
            <p className="story-justify text-sm text-[#171815]/85 leading-relaxed" lang="vi">
              {product.storage}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#FFF5E4] border border-[#1F3D2A]/25 space-y-1.5">
            <h4 className="font-bold text-[#1F3D2A]">Thời hạn sử dụng</h4>
            <p className="story-justify text-sm text-[#171815]/85 leading-relaxed" lang="vi">
              {product.shelfLife}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Câu chuyện hộp quà (Đông Hồ & Giấy Điệp)',
      content: (
        <div className="space-y-4 text-sm sm:text-base text-[#171815]/90 leading-relaxed" lang="vi">
          <p className="story-justify">{product.boxStory}</p>
          {/* Animation Slot #4: product-detail-box-open */}
          <AnimationSlot id="product-detail-box-open" />
          <div className="p-4 rounded-xl bg-[#1F3D2A] text-[#FFF5E4] text-xs sm:text-sm flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#F3D27A] shrink-0" />
            <span>
              Mỗi hộp quà Bùi Vị được chế tác từ giấy Điệp vỏ sò tự nhiên vùng Thuận Thành – Bắc
              Ninh, mở phẳng thành bức tranh di sản Đông Hồ lưu giữ dài lâu.
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Giao hàng & Đổi trả',
      content: (
        <div className="space-y-3 text-sm sm:text-base text-[#171815]/90 leading-relaxed" lang="vi">
          <p className="story-justify">{product.shipping}</p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-[#171815]/80 space-y-1">
            <li>
              Miễn phí vận chuyển nội thành cho đơn hàng từ 500.000đ (tự động áp dụng mã{' '}
              <strong>FREESHIP</strong>).
            </li>
            <li>
              Đóng gói tiêu chuẩn kèm túi giữ nhiệt và đá gel lạnh chuyên dụng, giữ nguyên hương vị
              khi trao tặng.
            </li>
            <li>
              Đổi mới 1–1 miễn phí trong vòng 24 giờ nếu hộp quà hoặc sản phẩm có bất kỳ sai sót nào
              trong quá trình vận chuyển.
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <div className="py-8 md:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* TOP SECTION: Desktop 2 Columns (~58% Left Scrolling Gallery / ~42% Right Sticky Order Panel)
            IMPORTANT: Never put transform/overflow/filter on ancestors of the sticky right column! */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN: 5 Product Images */}
          <div className="lg:col-span-7 space-y-4">
            {/* Mobile / Tablet Main Active Image Viewer with 240ms crossfade */}
            <div className="lg:hidden relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5E6CC] border-2 border-[#951722]/30 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.24 }}
                  className="w-full h-full"
                >
                  <Img
                    src={currentImg.url}
                    alt={currentImg.alt}
                    theme={currentImg.theme}
                    angleIndex={currentImg.angleIndex}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Top-left: "Bán chạy" badge */}
              {(product.isBestSeller || product.bestSeller) && (
                <span className="absolute top-3 left-3 bg-[#951722] text-[#FFF5E4] font-display text-xs px-3 py-1 rounded-md shadow-xs inline-flex items-center gap-1 z-10">
                  <Flame className="w-3.5 h-3.5 text-[#F3D27A]" />
                  <span>Bán chạy</span>
                </span>
              )}

              {/* Top-right: "-X%" badge */}
              {discountPercent && (
                <span className="absolute top-3 right-3 bg-[#9B0514] text-[#FFF5E4] font-price text-sm px-3 py-1 rounded-md shadow-xs z-10">
                  -{discountPercent}%
                </span>
              )}

              {/* Mobile Prev/Next Swipe Buttons */}
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex(
                    (activeImageIndex - 1 + product.images.length) % product.images.length
                  )
                }
                aria-label="Ảnh trước"
                className="w-9 h-9 rounded-full bg-[#171815]/70 text-[#FFF5E4] absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIndex((activeImageIndex + 1) % product.images.length)}
                aria-label="Ảnh tiếp theo"
                className="w-9 h-9 rounded-full bg-[#171815]/70 text-[#FFF5E4] absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Phóng to ảnh sản phẩm"
                className="absolute bottom-3 right-3 bg-[#171815]/80 text-[#FFF5E4] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer z-10"
              >
                <ZoomIn className="w-4 h-4" />
                <span>Phóng to ({activeImageIndex + 1}/5)</span>
              </button>
            </div>

            {/* Thumbnail & Dot Index Bar (Sticky on Desktop top-24 so user always knows which image they are viewing) */}
            <div className="lg:sticky lg:top-[88px] z-20 bg-[#FFFBF2]/95 backdrop-blur-xs border border-[#951722]/25 rounded-2xl p-2.5 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToImage(idx)}
                    aria-label={`Xem góc chụp ${idx + 1}`}
                    className={`w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer relative ${
                      activeImageIndex === idx
                        ? 'border-[#951722] ring-2 ring-[#951722]/30 scale-[1.03]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Img
                      src={img.url}
                      alt={img.alt}
                      theme={img.theme}
                      angleIndex={img.angleIndex}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Dots + Counter */}
              <div className="hidden sm:flex items-center gap-2 pr-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToImage(idx)}
                      aria-label={`Chuyển tới ảnh ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'w-5 bg-[#951722]'
                          : 'w-2 bg-[#951722]/30 hover:bg-[#951722]/60'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-price text-xs text-[#1F3D2A]">
                  {activeImageIndex + 1}/5
                </span>
              </div>
            </div>

            {/* Desktop Vertical Scrolling Stack of 5 Large Product Images */}
            <div className="hidden lg:block space-y-6">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    imageRefs.current[idx] = el;
                  }}
                  data-image-index={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setLightboxOpen(true);
                  }}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5E6CC] border-2 border-[#951722]/25 shadow-sm cursor-zoom-in"
                >
                  <Img
                    src={img.url}
                    alt={img.alt}
                    theme={img.theme}
                    angleIndex={img.angleIndex}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />

                  {/* Top-left: "Bán chạy" badge on first image */}
                  {idx === 0 && (product.isBestSeller || product.bestSeller) && (
                    <span className="absolute top-4 left-4 bg-[#951722] text-[#FFF5E4] font-display text-xs px-3 py-1.5 rounded-md shadow-xs inline-flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#F3D27A]" />
                      <span>Bán chạy</span>
                    </span>
                  )}

                  {/* Top-right: "-X%" discount badge on first image */}
                  {idx === 0 && discountPercent && (
                    <span className="absolute top-4 right-4 bg-[#9B0514] text-[#FFF5E4] font-price text-sm px-3 py-1.5 rounded-md shadow-xs">
                      -{discountPercent}%
                    </span>
                  )}

                  {/* Bottom Caption & Zoom Button */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#171815]/80 via-[#171815]/40 to-transparent p-4 flex items-center justify-between gap-3 text-[#FFF5E4]">
                    <span className="text-xs sm:text-sm font-medium">{img.caption}</span>
                    <span className="bg-[#171815]/75 px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shrink-0">
                      <ZoomIn className="w-3.5 h-3.5 text-[#F3D27A]" />
                      <span>Phóng to ({idx + 1}/5)</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Order Panel (position: sticky; top: 96px on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-[96px] bg-[#FFFBF2] border-2 border-[#951722]/30 rounded-3xl p-5 sm:p-6 shadow-md space-y-5">
            {/* Badges & Category */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {(product.isBestSeller || product.bestSeller) && (
                  <span className="bg-[#951722] text-[#FFF5E4] font-display text-xs px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#F3D27A]" />
                    <span>Bán chạy</span>
                  </span>
                )}
                <span className="text-xs font-bold uppercase tracking-wider text-[#1F3D2A] bg-[#1F3D2A]/10 px-2.5 py-1 rounded-md">
                  {product.category}
                </span>
              </div>

              {discountPercent && (
                <span className="bg-[#9B0514] text-[#FFF5E4] font-price text-sm px-2.5 py-1 rounded-md">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Product Name & Tagline */}
            <div>
              <h1 className="font-display text-2xl sm:text-3xl text-[#171815] leading-snug">
                {product.name}
              </h1>
              <p className="text-sm text-[#1F3D2A] font-medium mt-1">{product.tagline}</p>
            </div>

            {/* Price + OldPrice + Pack Spec ("1 hộp – 5 nem" for sets) */}
            <div className="p-3.5 rounded-2xl bg-[#FFF5E4] border border-[#951722]/25 space-y-2">
              <div className="flex items-baseline flex-wrap gap-2.5">
                <span className="font-price text-3xl text-[#9B0514]">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <>
                    <span className="font-price text-base text-[#171815]/50 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                    <span className="font-price text-xs text-[#9B0514] bg-[#9B0514]/10 px-2 py-0.5 rounded">
                      Tiết kiệm {formatPrice(unitSavings)}
                    </span>
                  </>
                )}
              </div>

              <div className="text-xs sm:text-sm text-[#171815]/85 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t border-[#951722]/15">
                <span>
                  Quy cách: <strong className="text-[#1F3D2A]">{product.packSpec}</strong>
                </span>
                {product.nemMixPerBox && (
                  <span className="text-xs text-[#171815]/75">({product.nemMixPerBox})</span>
                )}
              </div>
            </div>

            {/* Pack Option Selector */}
            {product.packOptions.length > 1 && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171815]">
                  Tùy chọn đóng gói:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {product.packOptions.map((pack) => (
                    <button
                      key={pack}
                      type="button"
                      onClick={() => setSelectedPack(pack)}
                      className={`px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        selectedPack === pack
                          ? 'bg-[#951722] text-[#FFF5E4] border-[#951722]'
                          : 'bg-[#FFF5E4] text-[#171815] border-[#951722]/25 hover:border-[#951722]'
                      }`}
                    >
                      <span>{pack}</span>
                      {selectedPack === pack && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector (with vertical RollingNumber) + Live Animated Tạm tính */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#171815]">Số lượng:</span>
                <div className="inline-flex items-center border-2 border-[#951722]/35 rounded-xl bg-[#FFF5E4] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Giảm số lượng"
                    className="w-10 h-10 flex items-center justify-center text-[#171815] hover:bg-[#951722]/10 active:scale-95 cursor-pointer transition-transform"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <RollingNumber
                    value={quantity}
                    testId="detail-quantity-value"
                    className="w-11 text-center font-price text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    aria-label="Tăng số lượng"
                    className="w-10 h-10 flex items-center justify-center text-[#171815] hover:bg-[#951722]/10 active:scale-95 cursor-pointer transition-transform"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="font-display text-xs text-[#171815]/75 block">Tạm tính:</span>
                <AnimatedPrice
                  value={liveSubtotalAfterDiscount}
                  className="font-price text-[22px] text-[#9B0514]"
                />
              </div>
            </div>

            {/* Interactive <VoucherBox/> (Section B3) */}
            <VoucherBox
              promotion={detailPromotion}
              allowedCodes={product.voucherEligibility}
              onSelectVoucherCode={(code) => {
                setIneligibleWarning(null);
                setSelectedVoucherCode(code);
              }}
              ineligibleWarning={ineligibleWarning}
              showPriceBreakdown
              compact
            />

            {/* Two Large Conversion CTAs (min-h-[56px]) using shared <AddToCartButton/> & <BuyNowButton/> */}
            <div ref={mainCtaRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <AddToCartButton
                product={product}
                onClick={handleAddToCart}
                className="min-h-[56px] w-full"
              />
              <BuyNowButton
                product={product}
                onClick={handleBuyNow}
                className="min-h-[56px] w-full"
              />
            </div>
          </div>
        </div>

        {/* SECTION B2: FULL-WIDTH ACCESSIBLE 5-ITEM ACCORDION BELOW TOP SECTION */}
        <section aria-label="Thông tin chi tiết sản phẩm" className="space-y-4">
          <div className="border-b-2 border-[#951722]/20 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
              Thông tin chi tiết & Câu chuyện di sản
            </span>
            <h2 className="font-display text-2xl md:text-3xl text-[#951722] mt-1">
              Khám Phá Chi Tiết {product.name}
            </h2>
          </div>

          <div className="space-y-3">
            {accordionItems.map((item, idx) => {
              const isOpen = Boolean(openAccordions[idx]);
              const headingId = `acc-heading-${idx}`;
              const panelId = `acc-panel-${idx}`;
              return (
                <div
                  key={idx}
                  className="bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl overflow-hidden transition-colors"
                >
                  <div role="heading" aria-level={3} className="font-body">
                    <button
                      type="button"
                      id={headingId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleAccordion(idx)}
                      className="font-body w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FFF5E4]/80 transition-colors cursor-pointer"
                    >
                      <span className="font-body text-[17px] sm:text-[18px] text-[#171815]">
                        {idx + 1}. {item.title}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#951722] shrink-0 transition-transform duration-260 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={panelId}
                        id={panelId}
                        role="region"
                        aria-labelledby={headingId}
                        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{
                          duration: 0.26,
                          ease: MOTION_TOKENS.easings.standard,
                        }}
                        className="font-body px-5 sm:px-6 pb-6 pt-2 border-t border-[#951722]/15"
                      >
                        {item.content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* RELATED PRODUCTS SECTION ("Sản phẩm liên quan" with both CTAs) */}
        <section
          aria-label="Sản phẩm liên quan"
          className="space-y-6 pt-4 border-t-2 border-[#951722]/20"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
                Gợi ý thưởng thức & trao tặng
              </span>
              <h2 className="font-display text-2xl md:text-3xl text-[#951722] mt-1">
                Sản Phẩm Liên Quan
              </h2>
            </div>
            <Link to="/san-pham" className="text-sm font-bold text-[#951722] hover:underline">
              Xem toàn bộ bộ sưu tập →
            </Link>
          </div>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </Stagger>
        </section>
      </div>

      {/* MOBILE STICKY BOTTOM CTA BAR (56px CTAs) — slides up when main CTAs scroll out of view */}
      <div
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFBF2] border-t-2 border-[#951722]/40 px-3 pt-3 shadow-2xl transition-transform duration-300 ${
          mobileStickyVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          <div className="pr-1 shrink-0">
            <span className="font-display text-[11px] text-[#171815]/75 block">Tạm tính:</span>
            <AnimatedPrice
              value={liveSubtotalAfterDiscount}
              className="font-price text-[20px] text-[#9B0514]"
            />
          </div>
          <AddToCartButton
            product={product}
            onClick={handleAddToCart}
            className="flex-1 min-h-[56px] !min-w-[130px] !px-3 !text-base"
          />
          <BuyNowButton
            product={product}
            onClick={handleBuyNow}
            className="flex-1 min-h-[56px] !min-w-[130px] !px-3 !text-base"
          />
        </div>
      </div>

      {/* LIGHTBOX MODAL WITH PREV/NEXT ARROWS (scale 0.94 -> 1 + backdrop fade 240ms) */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="pdp-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Xem ảnh phóng to"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              key="pdp-lightbox-content"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{
                duration: 0.24,
                ease: MOTION_TOKENS.easings.emphasized,
              }}
              className="relative max-w-4xl w-full bg-[#FFF5E4] rounded-2xl overflow-hidden p-3 sm:p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-[#171815]">{currentImg.caption}</span>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  aria-label="Đóng ảnh phóng to"
                  className="w-9 h-9 rounded-full bg-[#951722] text-[#FFF5E4] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                <Img
                  src={currentImg.url}
                  alt={currentImg.alt}
                  theme={currentImg.theme}
                  angleIndex={currentImg.angleIndex}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex(
                      (activeImageIndex - 1 + product.images.length) % product.images.length
                    )
                  }
                  aria-label="Ảnh trước"
                  className="w-11 h-11 rounded-full bg-[#171815]/80 text-[#FFF5E4] absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((activeImageIndex + 1) % product.images.length)
                  }
                  aria-label="Ảnh tiếp theo"
                  className="w-11 h-11 rounded-full bg-[#171815]/80 text-[#FFF5E4] absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
