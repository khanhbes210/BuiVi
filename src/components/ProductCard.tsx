import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Flame, Ticket } from 'lucide-react';
import { Product, formatPrice, getDiscountPercent, getSavingsAmount } from '../data/products';
import { useStore } from '../context/StoreContext';
import { Img } from './Img';
import { AddToCartButton } from './AddToCartButton';
import { BuyNowButton } from './BuyNowButton';
import { MOTION_TOKENS, useMotionPreferences } from '../motion';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { addToCart, startBuyNow } = useStore();
  const navigate = useNavigate();
  const { reducedMotion } = useMotionPreferences();
  const discountPercent = getDiscountPercent(product.price, product.oldPrice);
  const savingsAmount = getSavingsAmount(product.price, product.oldPrice);
  const mainImage = product.images[0];
  const secondaryImage = product.images.length > 1 ? product.images[1] : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1, product.packOptions[0]);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startBuyNow(product.id, 1, product.packOptions[0]);
    navigate('/thanh-toan?mode=buynow');
  };

  return (
    <article className="group relative bg-[#FFFBF2] border border-[#951722]/25 rounded-2xl overflow-hidden flex flex-col justify-between transition-transform duration-300 ease-out md:hover:-translate-y-1 hover:shadow-md">
      {/* Subtle Đông Hồ Corner Frame SVG that draws on hover */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <path
          d="M 2 22 L 2 2 L 22 2 M 178 2 L 198 2 L 198 22 M 198 178 L 198 198 L 178 198 M 22 198 L 2 198 L 2 178"
          fill="none"
          stroke="#951722"
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />
      </svg>

      <div>
        {/* Image Container */}
        <Link
          to={`/san-pham/${product.slug}`}
          className="block relative aspect-[4/3] overflow-hidden bg-[#F5E6CC]"
        >
          <Img
            src={mainImage.url}
            alt={mainImage.alt}
            theme={mainImage.theme}
            angleIndex={1}
            className="w-full h-full object-cover transition-transform duration-400 ease-out md:group-hover:scale-105"
          />

          {/* Optional secondary angle crossfade on desktop hover */}
          {secondaryImage && (
            <div className="hidden md:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none">
              <Img
                src={secondaryImage.url}
                alt={secondaryImage.alt}
                theme={secondaryImage.theme}
                angleIndex={2}
                className="w-full h-full object-cover transition-transform duration-400 ease-out group-hover:scale-105"
              />
            </div>
          )}

          {/* Top-left badge: "Bán chạy" in heritage red (#951722) with cream text */}
          {(product.isBestSeller || product.bestSeller) && (
            <motion.span
              initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.24,
                ease: MOTION_TOKENS.easings.emphasized,
              }}
              className="absolute top-3 left-3 bg-[#951722] text-[#FFF5E4] font-display text-sm px-2.5 py-1 rounded-md shadow-xs inline-flex items-center gap-1 z-10"
            >
              <Flame className="w-3.5 h-3.5 text-[#F3D27A] shrink-0" />
              <span>Bán chạy</span>
            </motion.span>
          )}

          {/* Top-right badge: Auto-calculated "-X%" discount badge so they never overlap */}
          {discountPercent && (
            <motion.span
              initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.24,
                delay: 0.05,
                ease: MOTION_TOKENS.easings.emphasized,
              }}
              className="absolute top-3 right-3 bg-[#9B0514] text-[#FFF5E4] font-price text-sm px-2.5 py-1 rounded-md shadow-xs z-10"
            >
              -{discountPercent}%
            </motion.span>
          )}

          {/* Bottom-left promo voucher hint */}
          {product.promoTag && (
            <span className="absolute bottom-3 left-3 bg-[#1F3D2A]/95 text-[#FFF5E4] text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs inline-flex items-center gap-1 z-10">
              <Ticket className="w-3 h-3 text-[#F3D27A] shrink-0" />
              <span>{product.promoTag}</span>
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="p-5">
          {/* Clean metadata */}
          <div className="flex items-center gap-2 text-xs text-[#1F3D2A] font-semibold mb-1.5">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.packSpec}</span>
          </div>

          <h3 className="font-display !text-[20px] leading-[1.3] mb-2">
            <Link
              to={`/san-pham/${product.slug}`}
              className="font-display text-[20px] text-[#171815] group-hover:text-[#951722] transition-colors block leading-[1.3]"
            >
              {product.name}
            </Link>
          </h3>

          {!compact && (
            <p className="text-sm text-[#171815]/80 line-clamp-2 mb-4 leading-relaxed">
              {product.shortDesc}
            </p>
          )}

          {/* Price Block */}
          <div className="flex items-baseline flex-wrap gap-2 pt-2 border-t border-[#951722]/15">
            <span className="font-price text-[22px] text-[#9B0514]">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <>
                <span className="font-price text-sm text-[#171815]/50 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                {savingsAmount > 0 && (
                  <span className="font-price text-xs text-[#9B0514] bg-[#9B0514]/10 px-2 py-0.5 rounded">
                    Tiết kiệm {formatPrice(savingsAmount)}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Two mandatory conversion CTAs using shared <AddToCartButton/> & <BuyNowButton/> */}
      <div className="px-5 pb-5 pt-1 flex flex-wrap gap-2.5">
        <AddToCartButton product={product} onClick={handleAddToCart} className="flex-1" />
        <BuyNowButton product={product} onClick={handleBuyNow} className="flex-1" />
      </div>
    </article>
  );
};
