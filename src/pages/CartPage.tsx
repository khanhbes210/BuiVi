import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  Gift,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getDiscountPercent } from '../data/products';
import { Img } from '../components/Img';
import { PromotionSummary } from '../components/PromotionSummary';
import { CheckoutStepper } from '../components/CheckoutStepper';
import {
  AnimatedPrice,
  AnimationSlot,
  RollingNumber,
  MOTION_TOKENS,
  useMotionPreferences,
} from '../motion';

const FREESHIP_THRESHOLD = 500000;

export const CartPage: React.FC = () => {
  const {
    cartPromotion,
    updateCartQuantity,
    removeFromCart,
    toggleSelectCartItem,
    selectAllCartItems,
  } = useStore();
  const navigate = useNavigate();
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    document.title = 'Giỏ Hàng Của Bạn | BÙI VỊ – Quà Biếu Di Sản';
  }, []);

  const allSelected =
    cartPromotion.lines.length > 0 && cartPromotion.lines.every((l) => l.selected);

  const freeshipRatio = Math.min(1, cartPromotion.subtotal / FREESHIP_THRESHOLD);
  const remainingForFreeship = Math.max(0, FREESHIP_THRESHOLD - cartPromotion.subtotal);

  return (
    <div className="pb-24 lg:pb-0">
      <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shared 3-Step Checkout Stepper UI: 1. Giỏ hàng -> 2. Thông tin giao hàng -> 3. Thanh toán */}
        <CheckoutStepper currentStep={1} />

        <h1 className="font-display text-3xl md:text-4xl text-[#951722] mb-6">
          Giỏ Hàng Của Bạn ({cartPromotion.lines.reduce((s, l) => s + l.quantity, 0)} sản phẩm)
        </h1>

        {cartPromotion.lines.length === 0 ? (
          <div className="bg-[#FFFBF2] double-border-heritage rounded-3xl p-8 sm:p-10 text-center space-y-5">
            {/* Animation Slot #5: cart-empty */}
            <AnimationSlot id="cart-empty" className="max-w-[260px] mx-auto" />
            <h2 className="font-display text-2xl text-[#171815]">
              Giỏ hàng của bạn hiện đang trống
            </h2>
            <p className="text-base text-[#171815]/75 max-w-md mx-auto">
              Hãy khám phá các dòng Nem Kinh Bắc truyền thống và Hộp quà lục giác giấy Điệp Đông Hồ
              bên dưới để nhận ưu đãi hấp dẫn.
            </p>
            <div className="pt-2">
              <Link
                to="/san-pham"
                className="btn-sheen min-h-[54px] px-7 py-3 rounded-xl bg-[#951722] hover:bg-[#9B0514] text-[#FFF5E4] font-bold text-[17px] inline-flex items-center gap-2 transition-colors"
              >
                <span>Khám phá sản phẩm ngay</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: Cart Item List + Free Shipping Progress Bar + Gift Rows */}
            <div className="lg:col-span-7 space-y-4">
              {/* Free-shipping progress bar (0 -> 500.000đ) */}
              <div className="bg-[#FFFBF2] border-2 border-[#1F3D2A]/25 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                  <span className="flex items-center gap-2 font-semibold text-[#1F3D2A]">
                    <Truck className="w-4 h-4 text-[#951722] shrink-0" />
                    {freeshipRatio >= 1 ? (
                      <span>
                        Chúc mừng! Đơn hàng đã đủ điều kiện{' '}
                        <strong className="text-[#951722]">Miễn phí vận chuyển (FREESHIP)</strong>
                      </span>
                    ) : (
                      <span>
                        Mua thêm{' '}
                        <strong className="font-price text-[#9B0514]">
                          {formatCurrency(remainingForFreeship)}
                        </strong>{' '}
                        để được Miễn phí vận chuyển
                      </span>
                    )}
                  </span>
                  <span className="font-price text-xs text-[#1F3D2A] shrink-0">
                    {Math.round(freeshipRatio * 100)}%
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[#F5E6CC] overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: freeshipRatio }}
                    transition={{
                      duration: 0.4,
                      ease: MOTION_TOKENS.easings.standard,
                    }}
                    className={`h-full w-full origin-left rounded-full ${
                      freeshipRatio >= 1
                        ? 'bg-[#1F3D2A] skeleton-shimmer'
                        : 'bg-[#951722]'
                    }`}
                  />
                </div>
              </div>

              {/* Select All Bar */}
              <div className="bg-[#FFFBF2] border border-[#951722]/20 rounded-xl p-4 flex items-center justify-between">
                <label className="inline-flex items-center gap-3 cursor-pointer font-semibold text-sm text-[#171815]">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => selectAllCartItems(e.target.checked)}
                    className="w-5 h-5 accent-[#951722] rounded cursor-pointer"
                  />
                  <span>
                    Chọn tất cả ({cartPromotion.lines.length} dòng sản phẩm)
                  </span>
                </label>
                <span className="text-xs text-[#1F3D2A] font-medium">
                  Miễn phí vận chuyển cho đơn từ 500.000đ
                </span>
              </div>

              {/* Cart Lines */}
              <AnimatePresence initial={false}>
                {cartPromotion.lines.map((line) => {
                  const disc = getDiscountPercent(line.product.price, line.product.oldPrice);
                  return (
                    <motion.div
                      key={`${line.product.id}-${line.selectedPack}`}
                      layout={!reducedMotion}
                      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -30 }}
                      transition={{
                        duration: MOTION_TOKENS.durations.fast,
                        ease: MOTION_TOKENS.easings.standard,
                      }}
                      className="bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={line.selected}
                          aria-label={`Chọn ${line.product.name}`}
                          onChange={() =>
                            toggleSelectCartItem(line.product.id, line.selectedPack)
                          }
                          className="w-5 h-5 mt-2 accent-[#951722] rounded cursor-pointer shrink-0"
                        />
                        <Link
                          to={`/san-pham/${line.product.slug}`}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#F5E6CC] shrink-0 relative"
                        >
                          <Img
                            src={line.product.images[0].url}
                            alt={line.product.name}
                            theme={line.product.images[0].theme}
                            className="w-full h-full object-cover"
                          />
                          {disc && (
                            <span className="absolute top-1.5 left-1.5 bg-[#9B0514] text-[#FFF5E4] font-price text-xs font-bold px-2 py-0.5 rounded">
                              -{disc}%
                            </span>
                          )}
                        </Link>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/san-pham/${line.product.slug}`}
                              className="font-display text-lg sm:text-xl text-[#171815] hover:text-[#951722]"
                            >
                              {line.product.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeFromCart(line.product.id, line.selectedPack)}
                              aria-label={`Xóa ${line.product.name} khỏi giỏ hàng`}
                              className="text-[#171815]/50 hover:text-[#9B0514] p-1.5 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <p className="text-xs sm:text-sm text-[#171815]/75 mt-0.5">
                            Quy cách: <strong>{line.selectedPack}</strong>
                          </p>

                          {/* Unit Price */}
                          <div className="flex items-baseline gap-2.5 mt-2">
                            <span className="font-price text-lg font-bold text-[#9B0514]">
                              {formatCurrency(line.product.price)}
                            </span>
                            {line.product.oldPrice && (
                              <span className="font-price text-xs text-[#171815]/50 line-through">
                                {formatCurrency(line.product.oldPrice)}
                              </span>
                            )}
                          </div>

                          {/* Per-line Promotion Tags */}
                          {line.appliedTags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {line.appliedTags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1F3D2A] bg-[#1F3D2A]/10 border border-[#1F3D2A]/25 px-2.5 py-1 rounded-md"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#951722]" />
                                  <span>{tag}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Quantity Stepper + Line Total */}
                        <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-[#951722]/15">
                          <div className="inline-flex items-center border-2 border-[#951722]/30 rounded-xl bg-[#FFF5E4]">
                            <button
                              type="button"
                              onClick={() =>
                                updateCartQuantity(
                                  line.product.id,
                                  line.selectedPack,
                                  line.quantity - 1
                                )
                              }
                              aria-label="Giảm số lượng"
                              className="w-9 h-9 flex items-center justify-center hover:bg-[#951722]/10 active:scale-95 cursor-pointer transition-transform"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <RollingNumber
                              value={line.quantity}
                              className="w-10 text-center font-price font-bold text-sm"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateCartQuantity(
                                  line.product.id,
                                  line.selectedPack,
                                  line.quantity + 1
                                )
                              }
                              aria-label="Tăng số lượng"
                              className="w-9 h-9 flex items-center justify-center hover:bg-[#951722]/10 active:scale-95 cursor-pointer transition-transform"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-display text-sm text-[#171815]/65 block">
                              Thành tiền:
                            </span>
                            <AnimatedPrice
                              value={line.lineSubtotal}
                              className="font-price text-[20px] text-[#9B0514]"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Dedicated Free Gift Rows in Cart (e.g. TANGHOP: 0đ – Quà tặng) */}
              {cartPromotion.gifts.map((gift) => (
                <div
                  key={gift.code}
                  className="bg-[#1F3D2A]/10 border-2 border-[#1F3D2A]/40 rounded-2xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#1F3D2A] text-[#F3D27A] flex items-center justify-center shrink-0">
                      <Gift className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#1F3D2A]">
                        Chương trình <span className="font-display">{gift.code}</span> (Tự động tặng
                        kèm)
                      </span>
                      <p className="font-display text-base text-[#171815]">{gift.name}</p>
                      {gift.normalPrice > 0 && (
                        <p className="text-xs text-[#171815]/60 line-through font-price">
                          Giá niêm yết: {formatCurrency(gift.normalPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-price text-sm sm:text-base text-[#1F3D2A] bg-[#FFFBF2] border border-[#1F3D2A] px-3 py-1.5 rounded-xl whitespace-nowrap">
                    {gift.badgeText}
                  </span>
                </div>
              ))}
            </div>

            {/* RIGHT: Promotion Summary & Checkout CTA (Step 1 -> Step 2: Thông tin giao hàng) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <PromotionSummary
                promotion={cartPromotion}
                primaryCtaLabel="Tiếp tục điền thông tin giao hàng"
                onPrimaryCtaClick={() => navigate('/thanh-toan')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Bottom CTA Bar for Cart */}
      {cartPromotion.lines.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFBF2] border-t-2 border-[#951722]/40 p-3 shadow-2xl">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
            <div>
              <span className="font-display text-sm text-[#171815]/70 block">Tổng thanh toán:</span>
              <AnimatedPrice
                value={cartPromotion.finalTotal}
                className="font-price text-[20px] text-[#9B0514]"
              />
            </div>
            <button
              type="button"
              onClick={() => navigate('/thanh-toan')}
              className="btn-sheen font-body min-h-[54px] px-5 py-3 rounded-xl bg-[#951722] hover:bg-[#9B0514] active:scale-[0.98] text-[#FFF5E4] text-[16px] leading-normal tracking-[0.2px] whitespace-nowrap flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Điền thông tin giao hàng</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
