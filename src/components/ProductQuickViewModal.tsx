import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Flame,
  Ticket,
  Minus,
  Plus,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, getDiscountPercent, getSavingsAmount } from '../data/products';
import { Img } from './Img';
import { AddToCartButton } from './AddToCartButton';
import { BuyNowButton } from './BuyNowButton';
import { AnimatedPrice, RollingNumber } from '../motion';

export const ProductQuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, addToCart, startBuyNow } = useStore();
  const navigate = useNavigate();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedPack, setSelectedPack] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImageIdx(0);
      setSelectedPack(quickViewProduct.packOptions[0] || quickViewProduct.packSpec);
      setQuantity(1);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    if (!quickViewProduct) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeQuickView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickViewProduct, closeQuickView]);

  if (!quickViewProduct) return null;

  const discountPercent = getDiscountPercent(quickViewProduct.price, quickViewProduct.oldPrice);
  const savingsAmount = getSavingsAmount(quickViewProduct.price, quickViewProduct.oldPrice);
  const currentImg =
    quickViewProduct.images[selectedImageIdx] || quickViewProduct.images[0];

  const handleQuickAddToCart = () => {
    addToCart(quickViewProduct.id, quantity, selectedPack);
    closeQuickView();
  };

  const handleQuickBuyNow = () => {
    startBuyNow(quickViewProduct.id, quantity, selectedPack);
    closeQuickView();
    navigate('/thanh-toan?mode=buynow');
  };

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-[75] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-view-product-title"
          data-testid="product-quick-view-modal"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeQuickView}
            className="fixed inset-0 bg-[#171815]/65 backdrop-blur-[2px]"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-4xl bg-[#FFFBF2] border-2 border-[#951722]/35 rounded-3xl shadow-[0_24px_64px_rgba(23,24,21,0.35)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Top Bar */}
            <div className="px-5 py-3.5 bg-[#1F3D2A] text-[#FFF5E4] flex items-center justify-between gap-3 border-b border-[#F3D27A]/30 shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F3D27A]">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Xem Nhanh Thức Quà Di Sản Bùi Vị</span>
              </div>
              <button
                type="button"
                data-testid="close-quick-view-btn"
                onClick={closeQuickView}
                aria-label="Đóng cửa sổ xem nhanh"
                className="w-8 h-8 rounded-full bg-[#FFF5E4]/10 hover:bg-[#951722] text-[#FFF5E4] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-7 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Image Gallery */}
              <div className="md:col-span-6 space-y-3">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5E6CC] border border-[#951722]/20">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedImageIdx}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0.3 }}
                      transition={{ duration: 0.18 }}
                      className="w-full h-full"
                    >
                      <Img
                        src={currentImg.url}
                        alt={currentImg.alt}
                        theme={currentImg.theme}
                        angleIndex={selectedImageIdx + 1}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {(quickViewProduct.isBestSeller || quickViewProduct.bestSeller) && (
                    <span className="absolute top-3 left-3 bg-[#951722] text-[#FFF5E4] font-display text-xs px-2.5 py-1 rounded-md shadow-xs inline-flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#F3D27A]" />
                      <span>Bán chạy</span>
                    </span>
                  )}

                  {discountPercent && (
                    <span className="absolute top-3 right-3 bg-[#9B0514] text-[#FFF5E4] font-price text-xs px-2.5 py-1 rounded-md shadow-xs">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                {/* 4 Angle Thumbnails */}
                {quickViewProduct.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2.5">
                    {quickViewProduct.images.slice(0, 4).map((img, idx) => {
                      const active = idx === selectedImageIdx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImageIdx(idx)}
                          className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            active
                              ? 'border-[#951722] ring-2 ring-[#951722]/25 scale-[1.02]'
                              : 'border-[#951722]/20 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <Img
                            src={img.url}
                            alt={img.alt}
                            theme={img.theme}
                            angleIndex={idx + 1}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-[#FFF5E4] border border-[#1F3D2A]/20 flex items-center gap-2.5 text-xs text-[#1F3D2A] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#951722] shrink-0" />
                  <span>
                    Chế biến tươi trong ngày · Đóng gói giữ nhiệt chuyên dụng · Quà biếu giấy Điệp Đông Hồ
                  </span>
                </div>
              </div>

              {/* Right Column: Product Info & Actions */}
              <div className="md:col-span-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#1F3D2A]">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#1F3D2A]/10 text-[#1F3D2A]">
                      {quickViewProduct.category}
                    </span>
                    <span>·</span>
                    <span>{quickViewProduct.weight}</span>
                    {quickViewProduct.promoTag && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 text-[#951722]">
                          <Ticket className="w-3.5 h-3.5" />
                          {quickViewProduct.promoTag}
                        </span>
                      </>
                    )}
                  </div>

                  <h2
                    id="quick-view-product-title"
                    className="font-display text-2xl sm:text-3xl text-[#171815] leading-snug"
                  >
                    {quickViewProduct.name}
                  </h2>

                  <p className="text-sm text-[#171815]/85 leading-relaxed">
                    {quickViewProduct.shortDesc}
                  </p>

                  {/* Price Box */}
                  <div className="p-3.5 rounded-2xl bg-[#FFF5E4] border border-[#951722]/25 flex flex-wrap items-baseline gap-2.5">
                    <AnimatedPrice
                      value={quickViewProduct.price * quantity}
                      className="font-price text-2xl sm:text-3xl text-[#9B0514] font-bold"
                    />
                    {quickViewProduct.oldPrice && quickViewProduct.oldPrice > quickViewProduct.price && (
                      <>
                        <span className="font-price text-sm text-[#171815]/50 line-through">
                          {formatPrice(quickViewProduct.oldPrice * quantity)}
                        </span>
                        {savingsAmount > 0 && (
                          <span className="font-price text-xs text-[#9B0514] bg-[#9B0514]/10 px-2 py-0.5 rounded font-semibold">
                            Tiết kiệm {formatPrice(savingsAmount * quantity)}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Pack Selector */}
                  {quickViewProduct.packOptions.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#1F3D2A]">
                        Quy cách đóng gói:
                      </label>
                      <div className="flex flex-col gap-1.5">
                        {quickViewProduct.packOptions.map((pack) => {
                          const isSelected = selectedPack === pack;
                          return (
                            <button
                              key={pack}
                              type="button"
                              onClick={() => setSelectedPack(pack)}
                              className={`px-3.5 py-2 rounded-xl border text-left text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#951722]/10 border-[#951722] text-[#951722]'
                                  : 'bg-[#FFF5E4] border-[#1F3D2A]/20 text-[#171815] hover:border-[#951722]/40'
                              }`}
                            >
                              <span className="line-clamp-1">{pack}</span>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-[#951722] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between gap-4 pt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#1F3D2A]">
                      Số lượng:
                    </span>
                    <div className="inline-flex items-center border-2 border-[#951722]/30 rounded-xl bg-[#FFF5E4]">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        aria-label="Giảm số lượng"
                        className="w-9 h-9 flex items-center justify-center text-[#171815] hover:text-[#951722] cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <RollingNumber
                        value={quantity}
                        className="w-10 text-center font-price font-bold text-base text-[#171815]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((q) => Math.min(quickViewProduct.stock, q + 1))
                        }
                        aria-label="Tăng số lượng"
                        className="w-9 h-9 flex items-center justify-center text-[#171815] hover:text-[#951722] cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Always 2 buttons on 1 row + Full Detail Link */}
                <div className="space-y-3 pt-2 border-t border-[#951722]/15">
                  <div className="grid grid-cols-2 gap-2.5 w-full">
                    <AddToCartButton
                      product={quickViewProduct}
                      quantity={quantity}
                      selectedPack={selectedPack}
                      size="sm"
                      onClick={handleQuickAddToCart}
                      className="w-full !min-w-0 !min-h-[48px] !px-3"
                    />
                    <BuyNowButton
                      product={quickViewProduct}
                      quantity={quantity}
                      selectedPack={selectedPack}
                      size="sm"
                      onClick={handleQuickBuyNow}
                      className="w-full !min-w-0 !min-h-[48px] !px-3"
                    />
                  </div>

                  <Link
                    to={`/san-pham/${quickViewProduct.slug}`}
                    onClick={closeQuickView}
                    className="w-full py-2 rounded-xl bg-[#FFF5E4] hover:bg-[#F5E6CC] border border-[#951722]/25 text-xs sm:text-sm font-bold text-[#951722] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Xem đầy đủ chi tiết & câu chuyện sản phẩm</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
