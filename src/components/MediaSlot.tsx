import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Flame,
} from 'lucide-react';
import { MEDIA_SLOTS, MediaSlotId } from '../data/media';
import { shouldShowMediaPlaceholders } from '../data/siteConfig';
import { PRODUCTS, formatPrice, getDiscountPercent } from '../data/products';
import { Img } from './Img';
import { AddToCartButton } from './AddToCartButton';
import { BuyNowButton } from './BuyNowButton';
import { resolveAssetUrl } from '../utils/assets';
import { MOTION_TOKENS, useMotionPreferences } from '../motion';

interface MediaSlotProps {
  slotId?: string;
  type?: 'banner' | 'poster' | 'video' | 'carousel';
  aspectRatio?: string;
  src?: string;
  mobileSrc?: string;
  poster?: string;
  alt?: string;
  link?: string;
  label?: string;
  subtext?: string;
  className?: string;
}

const PAGE_TOP_BANNER_SLOTS = new Set<string>(['promo-banner', 'about-banner', 'blog-banner']);

export const MediaSlot: React.FC<MediaSlotProps> = ({
  slotId,
  type: propType,
  aspectRatio: propAspect,
  src: propSrc,
  mobileSrc: propMobileSrc,
  poster: propPoster,
  alt: propAlt,
  link: propLink,
  className = '',
}) => {
  const { reducedMotion } = useMotionPreferences();
  const showPlaceholders = shouldShowMediaPlaceholders();
  const slotConfig = slotId ? MEDIA_SLOTS[slotId as MediaSlotId] : undefined;

  const type = propType || slotConfig?.type || 'banner';
  const aspectRatio = propAspect || slotConfig?.aspectRatio || '16/9';
  const src = (propSrc !== undefined ? propSrc : slotConfig?.src || '').trim();
  const mobileSrc = (propMobileSrc !== undefined ? propMobileSrc : slotConfig?.mobileSrc || '').trim();
  const poster = (propPoster !== undefined ? propPoster : slotConfig?.poster || '').trim();
  const alt = propAlt || slotConfig?.alt || 'Hình ảnh thương hiệu quà biếu di sản BÙI VỊ';
  const link = propLink !== undefined ? propLink : slotConfig?.link;

  const slides = slotConfig?.slides || [];
  const carouselProducts = PRODUCTS.filter((p) => p.featured).slice(0, 5);
  const slideCount = slides.length > 0 ? slides.length : carouselProducts.length;

  const [imgError, setImgError] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  useEffect(() => {
    if (type !== 'carousel' || isPaused || reducedMotion || slideCount <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(timer);
  }, [type, isPaused, slideCount, reducedMotion]);

  const aspectClass =
    aspectRatio === '1920/800' || aspectRatio === '12/5'
      ? 'aspect-[16/9] md:aspect-[12/5]'
      : aspectRatio === '4/5'
      ? 'aspect-[4/5]'
      : aspectRatio === '16/10'
      ? 'aspect-[16/10]'
      : aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : 'aspect-[16/9]';

  // P0-3: Slots that exist as a page-top banner (/khuyen-mai, /ve-bui-vi, /bai-viet):
  // when no file, DO NOT render the banner block so content appears above the fold.
  if (slotId && PAGE_TOP_BANNER_SLOTS.has(slotId) && (!src || imgError) && !showPlaceholders) {
    return null;
  }

  // 1. CAROUSEL RENDERER: falls back to a carousel of real product cards from products.ts when no slide src is set
  if (type === 'carousel') {
    const currentSlide = slides[activeSlide];
    const hasRealSlideSrc = Boolean(currentSlide?.src && currentSlide.src.trim() !== '');
    const currentProduct =
      carouselProducts[activeSlide % carouselProducts.length] || PRODUCTS[0];
    const disc = getDiscountPercent(currentProduct.price, currentProduct.oldPrice);

    return (
      <div
        className={`relative rounded-2xl overflow-hidden bg-[#FFF5E4] double-border-heritage shadow-xs select-none ${
          hasRealSlideSrc ? aspectClass : ''
        } ${className}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX;
          if (delta > 40) {
            setActiveSlide((prev) => (prev - 1 + slideCount) % slideCount);
          } else if (delta < -40) {
            setActiveSlide((prev) => (prev + 1) % slideCount);
          }
          setTouchStartX(null);
        }}
        data-media-slot={slotId || 'carousel'}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -18 }}
            transition={{
              duration: reducedMotion ? 0.15 : 0.42,
              ease: MOTION_TOKENS.easings.standard,
            }}
            className="w-full h-full"
          >
            {hasRealSlideSrc ? (
              <img
                src={resolveAssetUrl(currentSlide.src)}
                alt={currentSlide.alt}
                className="w-full h-full object-cover"
              />
            ) : (
              /* Real Product Card Showcase from products.ts */
              <div className="p-5 sm:p-8 pb-14 grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#FFFBF2]">
                <Link
                  to={`/san-pham/${currentProduct.slug}`}
                  className="md:col-span-5 aspect-[4/3] rounded-xl overflow-hidden relative bg-[#F5E6CC] border border-[#951722]/25 block group"
                >
                  <Img
                    src={currentProduct.images[0].url}
                    alt={currentProduct.images[0].alt}
                    theme={currentProduct.images[0].theme}
                    angleIndex={currentProduct.images[0].angleIndex}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {(currentProduct.isBestSeller || currentProduct.bestSeller) && (
                    <span className="absolute top-2.5 left-2.5 bg-[#951722] text-[#FFF5E4] font-display text-xs px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#F3D27A]" />
                      <span>Bán chạy</span>
                    </span>
                  )}
                  {disc && (
                    <span className="absolute top-2.5 right-2.5 bg-[#9B0514] text-[#FFF5E4] font-price text-xs px-2.5 py-1 rounded-md">
                      -{disc}%
                    </span>
                  )}
                </Link>

                <div className="md:col-span-7 space-y-3 text-left">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#1F3D2A]">
                    <span>{currentProduct.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentProduct.packSpec}</span>
                  </div>

                  <Link
                    to={`/san-pham/${currentProduct.slug}`}
                    className="block font-display text-2xl sm:text-3xl text-[#951722] hover:underline leading-snug"
                  >
                    {currentProduct.name}
                  </Link>

                  <p className="text-sm sm:text-base text-[#171815]/80 line-clamp-2 leading-relaxed">
                    {currentProduct.shortDesc}
                  </p>

                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="font-price text-2xl sm:text-3xl text-[#9B0514]">
                      {formatPrice(currentProduct.price)}
                    </span>
                    {currentProduct.oldPrice && currentProduct.oldPrice > currentProduct.price && (
                      <span className="font-price text-sm text-[#171815]/50 line-through">
                        {formatPrice(currentProduct.oldPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <AddToCartButton product={currentProduct} />
                    <BuyNowButton product={currentProduct} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next Arrows */}
        <button
          type="button"
          onClick={() => setActiveSlide((prev) => (prev - 1 + slideCount) % slideCount)}
          aria-label="Slide trước"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FFFBF2]/90 hover:bg-[#951722] text-[#171815] hover:text-[#FFF5E4] border border-[#951722]/30 flex items-center justify-center transition-colors cursor-pointer z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => setActiveSlide((prev) => (prev + 1) % slideCount)}
          aria-label="Slide tiếp theo"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FFFBF2]/90 hover:bg-[#951722] text-[#171815] hover:text-[#FFF5E4] border border-[#951722]/30 flex items-center justify-center transition-colors cursor-pointer z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#FFFBF2]/90 px-3 py-1.5 rounded-full border border-[#951722]/25 z-10">
          {Array.from({ length: slideCount }).map((_, idx) => {
            const isActive = activeSlide === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Chuyển đến slide ${idx + 1}`}
                className={`relative h-2.5 rounded-full overflow-hidden transition-all cursor-pointer ${
                  isActive
                    ? 'w-7 bg-[#951722]/25'
                    : 'w-2.5 bg-[#951722]/30 hover:bg-[#951722]/60'
                }`}
              >
                {isActive && (
                  <motion.span
                    key={`${activeSlide}-${isPaused ? 'paused' : 'playing'}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: isPaused || reducedMotion ? 0.1 : 5,
                      ease: 'linear',
                    }}
                    className="block w-full h-full bg-[#951722] origin-left"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. VIDEO RENDERER (when real video src is provided)
  if (type === 'video' && src && !imgError) {
    return (
      <div
        className={`relative rounded-2xl overflow-hidden bg-[#FFF5E4] double-border-heritage shadow-xs ${aspectClass} ${className}`}
        data-media-slot={slotId || 'video'}
      >
        <video
          src={src}
          poster={poster || undefined}
          controls
          playsInline
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        >
          Trình duyệt của bạn không hỗ trợ phát video.
        </video>
      </div>
    );
  }

  // 3. BANNER / POSTER IMAGE RENDERER (when real image src is provided)
  if ((type === 'banner' || type === 'poster') && src && !imgError) {
    const mediaImage = (
      <picture className="w-full h-full block">
        {mobileSrc && <source media="(max-width: 767px)" srcSet={resolveAssetUrl(mobileSrc)} />}
        <img
          src={resolveAssetUrl(src)}
          alt={alt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      </picture>
    );

    return (
      <div
        className={`relative rounded-2xl overflow-hidden bg-[#FFF5E4] double-border-heritage shadow-xs ${aspectClass} ${className}`}
        data-media-slot={slotId || type}
      >
        {link ? (
          <Link to={link} className="block w-full h-full">
            {mediaImage}
          </Link>
        ) : (
          mediaImage
        )}
      </div>
    );
  }

  // 4. HOMEPAGE HERO RIGHT COLUMN BUILT-IN BRAND VISUAL (P0-3)
  // Cream panel with thin double-line Đông Hồ frame, main BÙI VỊ logo large and centered,
  // soft giấy Điệp shimmer, and inline SVG line art of the hexagon gift box. No stock photos, no invented text.
  if (slotId === 'home-hero-banner') {
    const heroBrandVisual = (
      <div className="btn-sheen relative w-full h-full min-h-[260px] sm:min-h-[320px] flex items-center justify-center p-6 sm:p-8 bg-[#FFF5E4] overflow-hidden">
        {/* Soft giấy Điệp pearlescent shimmer backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,251,242,0.95)_0%,rgba(245,230,204,0.55)_70%,rgba(243,210,122,0.18)_100%)]"
        />

        {/* Inline SVG line art of the hexagonal Đông Hồ gift box & inner frame */}
        <svg
          viewBox="0 0 560 320"
          className="pointer-events-none absolute inset-0 w-full h-full p-3 sm:p-4"
          aria-hidden="true"
        >
          {/* Outer & inner Đông Hồ corner frame lines */}
          <rect
            x="10"
            y="10"
            width="540"
            height="300"
            rx="12"
            fill="none"
            stroke="#951722"
            strokeOpacity="0.32"
            strokeWidth="1.2"
          />
          <rect
            x="16"
            y="16"
            width="528"
            height="288"
            rx="9"
            fill="none"
            stroke="#1F3D2A"
            strokeOpacity="0.22"
            strokeWidth="0.9"
            strokeDasharray="6 4"
          />

          {/* Hexagonal gift box geometric line art centered behind/around the logo */}
          <g stroke="#951722" strokeOpacity="0.28" fill="none" strokeWidth="1.4">
            {/* Outer hexagon */}
            <polygon points="280,28 404,96 404,224 280,292 156,224 156,96" />
            {/* Inner concentric hexagon */}
            <polygon
              points="280,46 388,105 388,215 280,274 172,215 172,105"
              stroke="#1F3D2A"
              strokeOpacity="0.22"
              strokeWidth="1"
            />
            {/* Hexagon 6-petal fold lines */}
            <line x1="280" y1="28" x2="280" y2="92" />
            <line x1="280" y1="228" x2="280" y2="292" />
            <line x1="156" y1="96" x2="212" y2="128" />
            <line x1="348" y1="192" x2="404" y2="224" />
            <line x1="404" y1="96" x2="348" y2="128" />
            <line x1="212" y1="192" x2="156" y2="224" />
          </g>

          {/* Corner Đông Hồ diamond ornaments */}
          <polygon points="34,26 42,34 34,42 26,34" fill="none" stroke="#951722" strokeOpacity="0.4" strokeWidth="1.2" />
          <polygon points="526,26 534,34 526,42 518,34" fill="none" stroke="#951722" strokeOpacity="0.4" strokeWidth="1.2" />
          <polygon points="34,278 42,286 34,294 26,286" fill="none" stroke="#951722" strokeOpacity="0.4" strokeWidth="1.2" />
          <polygon points="526,278 534,286 526,294 518,286" fill="none" stroke="#951722" strokeOpacity="0.4" strokeWidth="1.2" />
        </svg>

        {/* Main BÙI VỊ logo large and centered */}
        <div className="relative z-10 flex items-center justify-center">
          <img
            src={`${import.meta.env.BASE_URL}logo-main.png`}
            alt={alt}
            className="h-36 sm:h-44 lg:h-48 w-auto object-contain rounded-xl shadow-sm"
          />
        </div>
      </div>
    );

    return (
      <div
        className={`relative rounded-2xl overflow-hidden bg-[#FFF5E4] double-border-heritage shadow-xs ${aspectClass} ${className}`}
        data-media-slot={slotId}
      >
        {link ? (
          <Link to={link} aria-label={alt} className="block w-full h-full">
            {heroBrandVisual}
          </Link>
        ) : (
          heroBrandVisual
        )}
      </div>
    );
  }

  // 5. CLEAN BRANDED FALLBACK CARD (for video, poster, blog thumbnails when no file is set)
  // Cream, double-line border, logo watermark at 15% opacity, and for video a play icon that does nothing, with NO technical wording.
  const cleanBrandedCard = (
    <div className="w-full h-full flex items-center justify-center p-6 bg-[#FFF5E4] relative overflow-hidden">
      {/* Subtle Đông Hồ inner frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 rounded-xl border border-[#951722]/20"
      />

      {/* BÙI VỊ logo watermark at 15% opacity */}
      <img
        src={`${import.meta.env.BASE_URL}logo-main.png`}
        alt={alt}
        className="h-24 sm:h-28 w-auto object-contain opacity-15 select-none pointer-events-none"
      />

      {/* For video slots: centered non-interactive play icon */}
      {type === 'video' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full bg-[#FFFBF2]/90 border-2 border-[#951722]/45 text-[#951722] flex items-center justify-center shadow-xs">
            <Play className="w-6 h-6 fill-[#951722]/20 ml-0.5" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-[#FFF5E4] double-border-heritage shadow-xs ${aspectClass} ${className}`}
      data-media-slot={slotId || type}
    >
      {link ? (
        <Link to={link} aria-label={alt} className="block w-full h-full hover:bg-[#FFFBF2] transition-colors">
          {cleanBrandedCard}
        </Link>
      ) : (
        cleanBrandedCard
      )}
    </div>
  );
};
