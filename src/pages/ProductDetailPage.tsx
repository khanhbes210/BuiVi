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
  Star,
  Truck,
  ShieldCheck,
  Heart,
  Share2,
  Copy,
  Check,
  ShoppingCart,
  Store,
  Clock,
  Award,
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
  const { addToCart, startBuyNow, appliedVoucherCode, setPdpMobileBarVisible, triggerFlyToCart } = useStore();
  const { reducedMotion } = useMotionPreferences();

  // Support current slug as well as legacySlugs
  const product = PRODUCTS.find(
    (p) => p.slug === slug || (p.legacySlugs && slug && p.legacySlugs.includes(slug))
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedPack, setSelectedPack] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(128);
  const [justAdded, setJustAdded] = useState(false);

  // Local voucher code state for interactive calculation on the Product Detail page
  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string | null>(
    appliedVoucherCode
  );
  const [ineligibleWarning, setIneligibleWarning] = useState<string | null>(null);

  // Accordion state: first item open by default
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

  // Re-check eligibility when quantity changes
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

  const handleAddToCart = (e?: React.MouseEvent) => {
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 800);
    if (e) {
      triggerFlyToCart(product, e.currentTarget as HTMLElement);
    }
    addToCart(product.id, quantity, selectedPack, voucherCarryCode);
  };

  const handleBuyNow = () => {
    startBuyNow(product.id, quantity, selectedPack, voucherCarryCode);
    navigate('/thanh-toan?mode=buynow');
  };

  const toggleAccordion = (idx: number) => {
    setOpenAccordions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
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
      title: 'Hướng dẫn bảo quản & Hạn sử dụng',
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
      title: 'Chính sách giao hàng & Đổi trả',
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
    <div className="pb-24 lg:pb-16 bg-[#FDF9F3]">
      <div className="py-4 md:py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* SHOPEE BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-[#171815]/70 flex items-center flex-wrap gap-1.5">
          <Link to="/" className="hover:text-[#951722] hover:underline">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#171815]/40" />
          <Link to="/san-pham" className="hover:text-[#951722] hover:underline">
            Sản phẩm
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#171815]/40" />
          <span className="text-[#1F3D2A] font-semibold">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#171815]/40" />
          <span className="text-[#951722] font-bold line-clamp-1 max-w-[280px]">
            {product.name}
          </span>
        </nav>

        {/* SHOPEE MAIN PRODUCT SHOWCASE CONTAINER (White/Cream elevated card) */}
        <div className="bg-white rounded-2xl border border-[#951722]/15 shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* SHOPEE LEFT COLUMN: SQUARE GALLERY + THUMBNAIL STRIP + SOCIAL SHARE */}
            <div className="lg:col-span-5 space-y-4">
              {/* Main Square Image Viewport (1:1 Ratio like Shopee) */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F5E6CC] border border-[#951722]/20 shadow-xs group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full cursor-zoom-in"
                    onClick={() => setLightboxOpen(true)}
                  >
                    <Img
                      src={currentImg.url}
                      alt={currentImg.alt}
                      theme={currentImg.theme}
                      angleIndex={currentImg.angleIndex}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Shopee Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                  <span className="bg-[#951722] text-[#FFF5E4] font-display text-xs font-bold px-2.5 py-1 rounded-sm shadow-xs inline-flex items-center gap-1 uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 text-[#F3D27A]" />
                    <span>Mall Di Sản</span>
                  </span>
                  {(product.isBestSeller || product.bestSeller) && (
                    <span className="bg-[#B8860B] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm shadow-xs inline-flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#FFF5E4]" />
                      <span>Bán chạy</span>
                    </span>
                  )}
                </div>

                {Boolean(discountPercent) && (
                  <span className="absolute top-3 right-3 bg-[#9B0514] text-[#FFF5E4] font-price text-sm font-bold px-2.5 py-1 rounded-sm shadow-xs z-10 pointer-events-none">
                    -{discountPercent}%
                  </span>
                )}

                {/* Left/Right Quick Preview Arrows */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex(
                      (activeImageIndex - 1 + product.images.length) % product.images.length
                    )
                  }
                  aria-label="Ảnh trước"
                  className="w-9 h-9 rounded-full bg-[#171815]/65 hover:bg-[#951722] text-[#FFF5E4] absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer transition-colors z-10 opacity-80 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((activeImageIndex + 1) % product.images.length)
                  }
                  aria-label="Ảnh tiếp theo"
                  className="w-9 h-9 rounded-full bg-[#171815]/65 hover:bg-[#951722] text-[#FFF5E4] absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer transition-colors z-10 opacity-80 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Bottom Zoom Button */}
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  aria-label="Phóng to ảnh sản phẩm"
                  className="absolute bottom-3 right-3 bg-[#171815]/75 hover:bg-[#171815] text-[#FFF5E4] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer z-10 transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Phóng to ({activeImageIndex + 1}/5)</span>
                </button>
              </div>

              {/* SHOPEE HORIZONTAL THUMBNAIL STRIP */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex(
                      (activeImageIndex - 1 + product.images.length) % product.images.length
                    )
                  }
                  aria-label="Lùi ảnh trước"
                  className="w-8 h-8 rounded-lg bg-[#FFF5E4] border border-[#951722]/20 hover:border-[#951722] text-[#951722] flex items-center justify-center cursor-pointer shrink-0 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-5 gap-2 w-full">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseEnter={() => setActiveImageIndex(idx)}
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`Xem góc chụp ${idx + 1}`}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#F5E6CC] ${
                        activeImageIndex === idx
                          ? 'border-[#951722] ring-2 ring-[#951722]/30 scale-102'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:border-[#951722]/40'
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

                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((activeImageIndex + 1) % product.images.length)
                  }
                  aria-label="Tới ảnh tiếp theo"
                  className="w-8 h-8 rounded-lg bg-[#FFF5E4] border border-[#951722]/20 hover:border-[#951722] text-[#951722] flex items-center justify-center cursor-pointer shrink-0 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* SHOPEE SOCIAL SHARE & FAVORITE ROW */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#171815]/75 border-t border-[#951722]/10">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#171815]/80">Chia sẻ:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            window.location.href
                          )}`,
                          '_blank'
                        )
                      }
                      title="Chia sẻ lên Facebook"
                      className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 cursor-pointer text-xs font-bold"
                    >
                      f
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                            window.location.href
                          )}&text=${encodeURIComponent(product.name)}`,
                          '_blank'
                        )
                      }
                      title="Chia sẻ lên X / Twitter"
                      className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 cursor-pointer text-xs font-bold"
                    >
                      𝕏
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      title="Sao chép liên kết"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#FFF5E4] border border-[#951722]/20 hover:border-[#951722] text-[#951722] font-semibold cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" />
                          <span className="text-[11px] text-green-700">Đã chép link</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Sao chép link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="h-4 w-px bg-[#171815]/20" />
                  <button
                    type="button"
                    onClick={handleToggleLike}
                    className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#951722] cursor-pointer transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform ${
                        liked ? 'fill-[#951722] text-[#951722] scale-110' : 'text-[#171815]/60'
                      }`}
                    />
                    <span>Đã thích ({likeCount})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SHOPEE RIGHT COLUMN: TITLE, RATINGS, PRICE BOX, SPECS, VARIATIONS, QUANTITY & CTAs */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Product Title with Shopee Mall Badge */}
              <div className="space-y-1.5">
                <h1 className="font-display text-2xl sm:text-3xl text-[#171815] leading-snug">
                  <span className="inline-block bg-[#951722] text-[#FFF5E4] text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs align-middle mr-2.5 shadow-2xs">
                    Mall Di Sản
                  </span>
                  {product.name}
                </h1>
                <p className="text-sm text-[#1F3D2A] font-medium leading-relaxed">
                  {product.tagline}
                </p>
              </div>

              {/* Shopee Ratings & Sold Row (Classic Shopee social proof bar) */}
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 py-1 text-sm border-b border-[#951722]/10 pb-3">
                <div className="flex items-center gap-1.5 text-[#951722]">
                  <span className="font-bold border-b border-[#951722] text-base leading-none">
                    5.0
                  </span>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <span className="h-3.5 w-px bg-[#171815]/20" />

                <div className="flex items-center gap-1.5 text-[#171815]/80">
                  <span className="font-bold text-[#171815] border-b border-[#171815]">128</span>
                  <span className="text-xs">Đánh Giá</span>
                </div>

                <span className="h-3.5 w-px bg-[#171815]/20" />

                <div className="flex items-center gap-1.5 text-[#171815]/80">
                  <span className="font-bold text-[#171815]">3.2k+</span>
                  <span className="text-xs">Đã Bán</span>
                </div>

                <div className="ml-auto text-xs font-semibold text-[#1F3D2A] bg-[#1F3D2A]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Chính hãng 100%</span>
                </div>
              </div>

              {/* SHOPEE HIGHLIGHTED PRICE CONTAINER */}
              <div className="rounded-xl bg-[#FFF5E4] p-4 sm:p-5 border border-[#951722]/20 space-y-3">
                <div className="flex items-baseline flex-wrap gap-3">
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="font-price text-lg text-[#171815]/45 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                  <span className="font-price text-3xl sm:text-4xl font-bold text-[#9B0514]">
                    {formatPrice(product.price)}
                  </span>
                  {Boolean(discountPercent) && (
                    <span className="bg-[#9B0514] text-[#FFF5E4] text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                      {discountPercent}% GIẢM
                    </span>
                  )}
                  {Boolean(unitSavings && unitSavings > 0) && (
                    <span className="text-xs font-bold text-[#1F3D2A] bg-[#1F3D2A]/10 px-2 py-0.5 rounded">
                      Tiết kiệm {formatPrice(unitSavings)}
                    </span>
                  )}
                </div>

                {/* Shopee Flash Tag / Banner inside Price Box */}
                <div className="flex items-center gap-2 text-xs font-semibold text-[#951722] bg-[#951722]/10 px-3 py-1.5 rounded-lg border border-[#951722]/15">
                  <Flame className="w-4 h-4 text-[#951722] shrink-0" />
                  <span>
                    Ưu đãi độc quyền: Giảm thêm 10% khi áp mã <strong>BUIVI10</strong> • Miễn phí vận chuyển từ 500k
                  </span>
                </div>
              </div>

              {/* SHOPEE SPECIFICATION & ATTRIBUTE ROWS */}
              <div className="space-y-4 pt-1 text-sm text-[#171815]">
                
                {/* Row 1: Mã Giảm Giá Của Shop (Shop Vouchers) */}
                <div className="flex items-start gap-4">
                  <span className="w-28 sm:w-32 text-xs sm:text-sm text-[#171815]/65 shrink-0 pt-1 font-medium">
                    Mã Giảm Giá:
                  </span>
                  <div className="flex-1 flex flex-wrap gap-2 items-center">
                    {product.voucherEligibility.map((code) => {
                      const isSelected = selectedVoucherCode === code;
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setIneligibleWarning(null);
                            setSelectedVoucherCode(isSelected ? null : code);
                          }}
                          className={`text-xs px-2.5 py-1 rounded-sm border dashed font-semibold cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#951722] text-[#FFF5E4] border-[#951722]'
                              : 'bg-[#FFF5E4] text-[#951722] border-[#951722]/40 hover:border-[#951722]'
                          }`}
                        >
                          Mã {code} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 2: Vận chuyển (Shipping) */}
                <div className="flex items-start gap-4">
                  <span className="w-28 sm:w-32 text-xs sm:text-sm text-[#171815]/65 shrink-0 pt-0.5 font-medium">
                    Vận Chuyển:
                  </span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1F3D2A]">
                      <Truck className="w-4 h-4 text-[#1F3D2A] shrink-0" />
                      <span>Miễn phí vận chuyển cho đơn từ 500.000đ</span>
                    </div>
                    <p className="text-xs text-[#171815]/80">
                      Giao hỏa tốc 2h tại Bắc Ninh & Hà Nội kèm túi giữ nhiệt đá gel chuyên dụng.
                    </p>
                  </div>
                </div>

                {/* Row 3: Cam kết di sản (Heritage Guarantee) */}
                <div className="flex items-start gap-4">
                  <span className="w-28 sm:w-32 text-xs sm:text-sm text-[#171815]/65 shrink-0 pt-0.5 font-medium">
                    Bảo Hiểm Bùi Vị:
                  </span>
                  <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#171815]/85">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#951722]" />
                      15 ngày đổi trả miễn phí
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1F3D2A]" />
                      100% Thịt lợn thảo mộc OCOP
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                      Tranh Đông Hồ giấy Điệp thật
                    </span>
                  </div>
                </div>

                {/* Row 4: Phân loại / Quy cách (Shopee Variations) */}
                <div className="flex items-start gap-4">
                  <span className="w-28 sm:w-32 text-xs sm:text-sm text-[#171815]/65 shrink-0 pt-2 font-medium">
                    Quy Cách:
                  </span>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap gap-2.5">
                      {product.packOptions.map((pack) => {
                        const isSelected = selectedPack === pack;
                        return (
                          <button
                            key={pack}
                            type="button"
                            onClick={() => setSelectedPack(pack)}
                            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border text-left transition-all cursor-pointer flex items-center gap-2 ${
                              isSelected
                                ? 'bg-[#FFF5E4] border-[#951722] text-[#951722] shadow-2xs ring-1 ring-[#951722]'
                                : 'bg-white border-[#171815]/20 text-[#171815] hover:border-[#951722]/50'
                            }`}
                          >
                            <span>{pack}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#951722]" />}
                          </button>
                        );
                      })}
                    </div>
                    {product.nemMixPerBox && (
                      <p className="text-xs text-[#1F3D2A] font-semibold italic">
                        Cấu hình: {product.nemMixPerBox}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 5: Số lượng (Shopee Quantity Stepper + Stock Count) */}
                <div className="flex items-center gap-4">
                  <span className="w-28 sm:w-32 text-xs sm:text-sm text-[#171815]/65 shrink-0 font-medium">
                    Số Lượng:
                  </span>
                  <div className="flex-1 flex items-center gap-4">
                    <div className="inline-flex items-center border border-[#171815]/30 rounded-lg bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        aria-label="Giảm số lượng"
                        className="w-8 h-8 flex items-center justify-center text-[#171815] hover:bg-[#951722]/10 active:scale-95 cursor-pointer transition-transform border-r border-[#171815]/20"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <RollingNumber
                        value={quantity}
                        testId="detail-quantity-value"
                        className="w-12 text-center font-price text-sm font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        aria-label="Tăng số lượng"
                        className="w-8 h-8 flex items-center justify-center text-[#171815] hover:bg-[#951722]/10 active:scale-95 cursor-pointer transition-transform border-l border-[#171815]/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-[#171815]/65">
                      Còn {product.stock} sản phẩm có sẵn
                    </span>
                  </div>
                </div>

                {/* Row 6: Tạm tính live price */}
                <div className="flex items-center gap-4 pt-1">
                  <span className="w-28 sm:w-32 text-xs sm:text-sm text-[#171815]/65 shrink-0 font-medium">
                    Tạm Tính:
                  </span>
                  <div className="flex-1 flex items-baseline gap-2">
                    <AnimatedPrice
                      value={liveSubtotalAfterDiscount}
                      className="font-price text-2xl font-bold text-[#9B0514]"
                    />
                    {detailPromotion.voucherDiscountAmount > 0 && (
                      <span className="text-xs text-[#1F3D2A] font-semibold bg-[#1F3D2A]/10 px-2 py-0.5 rounded">
                        Đã giảm {formatPrice(detailPromotion.voucherDiscountAmount)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Ineligible warning if voucher not met */}
                {ineligibleWarning && (
                  <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    {ineligibleWarning}
                  </p>
                )}
              </div>

              {/* SHOPEE DUAL CONVERSION ACTION BUTTONS */}
              <div ref={mainCtaRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3">
                {/* Button 1: Thêm Vào Giỏ Hàng (Shopee style secondary red-tint button) */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="min-h-[54px] rounded-xl font-bold text-sm sm:text-base border-2 border-[#951722] bg-[#FFF5E4] text-[#951722] hover:bg-[#951722]/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-5 h-5 text-[#951722]" />
                      <span>Đã Thêm Vào Giỏ!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 text-[#951722]" />
                      <span>Thêm Vào Giỏ Hàng</span>
                    </>
                  )}
                </button>

                {/* Button 2: Mua Ngay (Shopee style solid red primary CTA) */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="min-h-[54px] rounded-xl font-bold text-sm sm:text-base bg-[#951722] hover:bg-[#7C121C] text-[#FFF5E4] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Mua Ngay</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* SHOPEE ASSURANCE FOOTER */}
              <div className="pt-2 flex items-center gap-2 text-xs text-[#171815]/75 border-t border-[#951722]/10">
                <ShieldCheck className="w-4 h-4 text-[#951722] shrink-0" />
                <span>
                  <strong>BÙI VỊ Đảm Bảo:</strong> 3 Ngày Trả Hàng / Hoàn Tiền 100% nếu không đúng chuẩn vị truyền thống làng nghề Kinh Bắc.
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* SHOPEE SHOP INFO CARD (Official Store Banner) */}
        <div className="bg-white rounded-2xl border border-[#951722]/15 shadow-sm p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-16 h-16 rounded-full bg-[#951722] text-[#FFF5E4] flex items-center justify-center font-display text-xl font-bold border-2 border-[#F3D27A] shadow-xs shrink-0">
              BÙI VỊ
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#171815]">
                  BÙI VỊ – Tinh Hoa Nem Kinh Bắc
                </h3>
                <span className="bg-[#951722] text-[#FFF5E4] text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  Mall
                </span>
              </div>
              <p className="text-xs text-[#171815]/65 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Online 2 phút trước • Làng nghề Bùi Xá, Ninh Xá, Bắc Ninh</span>
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Link
                  to="/san-pham"
                  className="px-3 py-1 rounded-md bg-[#FFF5E4] border border-[#951722]/30 text-[#951722] text-xs font-semibold hover:bg-[#951722] hover:text-[#FFF5E4] transition-colors flex items-center gap-1"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Xem Shop</span>
                </Link>
                <a
                  href="tel:0988000000"
                  className="px-3 py-1 rounded-md bg-white border border-[#171815]/20 text-[#171815] text-xs font-semibold hover:border-[#951722] transition-colors flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5 text-[#1F3D2A]" />
                  <span>Hotline Tư Vấn</span>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto text-center md:text-left text-xs border-t md:border-t-0 md:border-l border-[#951722]/15 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-[#171815]/60 block">Đánh Giá</span>
              <span className="font-bold text-[#951722] text-sm">4.9 / 5.0</span>
            </div>
            <div>
              <span className="text-[#171815]/60 block">Sản Phẩm</span>
              <span className="font-bold text-[#171815] text-sm">7 Đặc Sản</span>
            </div>
            <div>
              <span className="text-[#171815]/60 block">Tỉ Lệ Phản Hồi</span>
              <span className="font-bold text-[#1F3D2A] text-sm">100%</span>
            </div>
            <div>
              <span className="text-[#171815]/60 block">Thời Gian Phản Hồi</span>
              <span className="font-bold text-[#171815] text-sm">Trong vài phút</span>
            </div>
          </div>
        </div>

        {/* SHOPEE HERITAGE ACCORDION DETAILS SECTION */}
        <section aria-label="Thông tin chi tiết sản phẩm" className="space-y-4">
          <div className="border-b-2 border-[#951722]/20 pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1F3D2A]">
                Chi tiết & Câu chuyện nghệ nhân
              </span>
              <h2 className="font-display text-xl md:text-2xl text-[#951722] mt-0.5">
                Thông Tin Chi Tiết Sản Phẩm
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {accordionItems.map((item, idx) => {
              const isOpen = Boolean(openAccordions[idx]);
              const headingId = `acc-heading-${idx}`;
              const panelId = `acc-panel-${idx}`;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#951722]/20 rounded-xl overflow-hidden transition-colors shadow-2xs"
                >
                  <div role="heading" aria-level={3} className="font-body">
                    <button
                      type="button"
                      id={headingId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleAccordion(idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FFF5E4]/60 transition-colors cursor-pointer"
                    >
                      <span className="font-semibold text-base sm:text-lg text-[#171815]">
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
                          duration: 0.24,
                          ease: MOTION_TOKENS.easings.standard,
                        }}
                        className="px-5 pb-6 pt-2 border-t border-[#951722]/10 bg-[#FFFDF9]"
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

        {/* SHOPEE CUSTOMER REVIEWS SECTION */}
        <section aria-label="Đánh giá của khách hàng" className="bg-white rounded-2xl border border-[#951722]/15 shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
          <div>
            <h2 className="font-display text-xl md:text-2xl text-[#951722]">
              ĐÁNH GIÁ SẢN PHẨM
            </h2>
          </div>

          {/* Review Score Summary Box */}
          <div className="bg-[#FFF5E4] rounded-xl p-4 sm:p-6 border border-[#951722]/20 flex flex-col md:flex-row items-center gap-6">
            <div className="text-center md:text-left shrink-0">
              <div className="flex items-baseline justify-center md:justify-start gap-1">
                <span className="font-price text-4xl font-bold text-[#951722]">5.0</span>
                <span className="text-sm text-[#171815]/70">trên 5</span>
              </div>
              <div className="flex justify-center md:justify-start text-amber-500 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            {/* Shopee Filter Pills */}
            <div className="flex-1 flex flex-wrap gap-2">
              <span className="px-3.5 py-1.5 rounded-lg bg-[#951722] text-[#FFF5E4] text-xs font-semibold cursor-pointer shadow-2xs">
                Tất Cả (128)
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-white border border-[#171815]/20 text-[#171815] text-xs font-semibold hover:border-[#951722] cursor-pointer">
                5 Sao (120)
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-white border border-[#171815]/20 text-[#171815] text-xs font-semibold hover:border-[#951722] cursor-pointer">
                Có Hình Ảnh / Video (45)
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-white border border-[#171815]/20 text-[#171815] text-xs font-semibold hover:border-[#951722] cursor-pointer">
                Có Bình Luận (88)
              </span>
            </div>
          </div>

          {/* Sample Reviews List */}
          <div className="space-y-4 divide-y divide-[#951722]/10">
            {/* Review 1 */}
            <div className="pt-4 first:pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1F3D2A] text-white flex items-center justify-center font-bold text-xs">
                    NQ
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#171815] block">nguyentuanquang_88</span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-[#171815]/50">2026-10-21 14:32</span>
              </div>
              <p className="text-xs text-[#171815]/60">Phân loại hàng: {product.packOptions[0]}</p>
              <p className="text-xs sm:text-sm text-[#171815]/90 leading-relaxed">
                Nem cực kỳ thơm ngon, chuẩn vị làng Bùi Xá luôn! Thịt lợn thảo mộc ăn ngọt đậm, bì giòn sần sật cuốn lá sung chấm tương ớt cay cay quá đỉnh. Đóng gói hộp rất trang trọng, có túi đá gel lạnh nên lúc nhận nem vẫn tươi mát. Sẽ ủng hộ shop dài dài!
              </p>
            </div>

            {/* Review 2 */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#951722] text-white flex items-center justify-center font-bold text-xs">
                    TH
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#171815] block">tranthithuhang_hn</span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-[#171815]/50">2026-10-18 09:15</span>
              </div>
              <p className="text-xs text-[#171815]/60">Phân loại hàng: {product.packOptions[0]}</p>
              <p className="text-xs sm:text-sm text-[#171815]/90 leading-relaxed">
                Mua làm quà biếu đối tác ai cũng khen tấm tắc. Vỏ hộp giấy Điệp tranh Đông Hồ làm rất chỉn chu, mở ra là thấy ngay nét văn hóa Kinh Bắc. Giao hỏa tốc đúng 2 tiếng là tới nhà. 10 điểm cho chất lượng và dịch vụ của Bùi Vị!
              </p>
            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS SECTION */}
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
                Sản Phẩm Tương Tự
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

      {/* SHOPEE MOBILE STICKY BOTTOM CTA BAR */}
      <div
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#951722]/30 px-3 pt-2.5 shadow-2xl transition-transform duration-300 ${
          mobileStickyVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          <div className="pr-1 shrink-0">
            <span className="text-[10px] text-[#171815]/75 block">Tạm tính:</span>
            <AnimatedPrice
              value={liveSubtotalAfterDiscount}
              className="font-price text-lg font-bold text-[#9B0514]"
            />
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 min-h-[48px] rounded-xl font-bold text-xs border border-[#951722] bg-[#FFF5E4] text-[#951722] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Thêm Vào Giỏ</span>
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 min-h-[48px] rounded-xl font-bold text-xs bg-[#951722] text-[#FFF5E4] flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Mua Ngay</span>
          </button>
        </div>
      </div>

      {/* LIGHTBOX MODAL WITH PREV/NEXT ARROWS */}
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
