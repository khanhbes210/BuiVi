import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  CheckCircle2,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Gift,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getDiscountPercent } from '../data/products';
import { Logo } from './Logo';
import { Img } from './Img';
import {
  AnimationSlot,
  AnimatedPrice,
  RollingNumber,
  MOTION_TOKENS,
  useMotionPreferences,
} from '../motion';

export const MiniCartDrawer: React.FC = () => {
  const {
    miniCartOpen,
    setMiniCartOpen,
    lastAddedItem,
    cartPromotion,
    totalCartItemsCount,
    updateCartQuantity,
    removeFromCart,
  } = useStore();
  const navigate = useNavigate();
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && miniCartOpen) {
        setMiniCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [miniCartOpen, setMiniCartOpen]);

  return (
    <AnimatePresence>
      {miniCartOpen && (
        <motion.div
          key="minicart-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.12 : MOTION_TOKENS.durations.fast }}
          className="fixed inset-0 z-50 flex justify-end bg-[#171815]/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Giỏ hàng nhanh Bùi Vị"
          onClick={() => setMiniCartOpen(false)}
        >
          <motion.div
            key="minicart-panel"
            initial={reducedMotion ? { opacity: 0 } : { x: '100%' }}
            animate={reducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{
              duration: reducedMotion ? 0.15 : MOTION_TOKENS.durations.base,
              ease: MOTION_TOKENS.easings.standard,
            }}
            className="w-full sm:max-w-lg md:max-w-[540px] bg-[#FFF5E4] h-full shadow-2xl border-l-2 border-[#951722]/30 flex flex-col justify-between overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Header with Brand Logo, Cart count badge and Close button */}
            <div className="p-4 sm:p-5 bg-[#FFFBF2] border-b border-[#951722]/20">
              <div className="flex items-center justify-between gap-3">
                <Link
                  to="/"
                  onClick={() => setMiniCartOpen(false)}
                  className="flex items-center gap-3 group"
                >
                  <Logo
                    variant="main"
                    imgClassName="!min-h-0 h-10 sm:h-12 w-auto transition-transform group-hover:scale-105"
                  />
                  <div>
                    <span className="font-display font-bold text-base sm:text-lg text-[#951722] tracking-wider block leading-tight">
                      BÙI VỊ
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[#1F3D2A] uppercase tracking-wider font-semibold block">
                      Quà Biếu Di Sản
                    </span>
                  </div>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#951722] bg-[#951722]/10 px-3 py-1 rounded-full border border-[#951722]/20">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Giỏ hàng ({totalCartItemsCount})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMiniCartOpen(false)}
                    aria-label="Đóng giỏ hàng"
                    className="w-9 h-9 rounded-full bg-[#FFF5E4] hover:bg-[#951722] text-[#171815] hover:text-[#FFF5E4] border border-[#951722]/20 flex items-center justify-center cursor-pointer transition-colors shadow-2xs active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Success Banner when an item was just added */}
              <AnimatePresence mode="popLayout">
                {lastAddedItem && (
                  <motion.div
                    key={`${lastAddedItem.product.id}-${lastAddedItem.selectedPack}`}
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: MOTION_TOKENS.durations.fast }}
                    className="mt-3.5 p-3 rounded-xl bg-[#1F3D2A] text-[#FFF5E4] flex items-center gap-3 shadow-xs"
                  >
                    <AnimationSlot
                      id="add-to-cart-success"
                      compact
                      className="w-10 h-10 shrink-0 !bg-[#FFF5E4]/95 !p-1 rounded-lg"
                    />
                    <div className="text-xs leading-snug min-w-0">
                      <p className="font-bold text-xs text-[#F3D27A] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Đã thêm vào giỏ hàng thành công</span>
                      </p>
                      <p className="mt-0.5 truncate text-[#FFF5E4]/90">
                        <span className="font-semibold">{lastAddedItem.product.name}</span> (SL:{' '}
                        {lastAddedItem.quantity}) – {lastAddedItem.selectedPack}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Scrollable Cart Items + Promotion Status */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
              {cartPromotion.lines.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <AnimationSlot id="cart-empty" className="max-w-[220px] mx-auto" />
                  <p className="font-display text-lg text-[#171815]">Giỏ hàng đang trống</p>
                  <p className="text-sm text-[#171815]/70 max-w-xs mx-auto">
                    Hãy chọn những thức quà di sản Kinh Bắc thơm ngon cho người thân yêu.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {cartPromotion.lines.map((line) => {
                        const disc = getDiscountPercent(line.product.price, line.product.oldPrice);
                        return (
                          <motion.div
                            key={`${line.product.id}-${line.selectedPack}`}
                            layout={!reducedMotion}
                            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
                            transition={{
                              duration: MOTION_TOKENS.durations.fast,
                              ease: MOTION_TOKENS.easings.standard,
                            }}
                            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#951722]/20 shadow-xs flex gap-3.5 sm:gap-4 hover:shadow-sm transition-shadow"
                          >
                            <Link
                              to={`/san-pham/${line.product.slug}`}
                              onClick={() => setMiniCartOpen(false)}
                              className="w-22 h-22 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-[#F5E6CC] relative border border-[#951722]/15 shadow-2xs group"
                            >
                              <Img
                                src={line.product.images[0].url}
                                alt={line.product.name}
                                theme={line.product.images[0].theme}
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                              {disc && (
                                <span className="absolute top-1 left-1 bg-[#9B0514] text-[#FFF5E4] font-price text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs">
                                  -{disc}%
                                </span>
                              )}
                            </Link>

                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <Link
                                    to={`/san-pham/${line.product.slug}`}
                                    onClick={() => setMiniCartOpen(false)}
                                    className="font-display text-sm sm:text-base font-bold text-[#171815] hover:text-[#951722] line-clamp-2 leading-snug"
                                  >
                                    {line.product.name}
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeFromCart(line.product.id, line.selectedPack)
                                    }
                                    aria-label={`Xóa ${line.product.name}`}
                                    title="Xóa sản phẩm này"
                                    className="text-[#171815]/40 hover:text-[#9B0514] hover:bg-[#9B0514]/10 p-1.5 rounded-lg cursor-pointer transition-colors shrink-0"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>

                                <p className="text-xs text-[#1F3D2A] font-semibold bg-[#1F3D2A]/10 px-2.5 py-0.5 rounded-md inline-block mt-1">
                                  {line.selectedPack}
                                </p>

                                <div className="flex items-baseline gap-2 mt-1.5">
                                  <span className="font-price text-base sm:text-lg font-bold text-[#9B0514]">
                                    {formatCurrency(line.product.price)}
                                  </span>
                                  {line.product.oldPrice && (
                                    <span className="font-price text-xs text-[#171815]/50 line-through">
                                      {formatCurrency(line.product.oldPrice)}
                                    </span>
                                  )}
                                </div>

                                {/* Line promotion tags styled as clean pills */}
                                {line.appliedTags.length > 0 && (
                                  <div className="mt-1.5 flex flex-wrap gap-1">
                                    {line.appliedTags.map((t, idx) => (
                                      <span
                                        key={idx}
                                        className="text-[11px] font-medium text-[#1F3D2A] bg-[#1F3D2A]/8 px-2 py-0.5 rounded-md inline-flex items-center gap-1"
                                      >
                                        ✓ {t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#951722]/10">
                                <div className="inline-flex items-center border border-[#171815]/20 rounded-lg bg-[#FFF5E4] shadow-2xs overflow-hidden">
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
                                    className="w-7 h-7 flex items-center justify-center text-[#171815] hover:bg-[#951722] hover:text-[#FFF5E4] active:scale-95 cursor-pointer transition-colors border-r border-[#171815]/15"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="px-3 text-xs sm:text-sm font-price font-bold">
                                    <RollingNumber value={line.quantity} />
                                  </span>
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
                                    className="w-7 h-7 flex items-center justify-center text-[#171815] hover:bg-[#951722] hover:text-[#FFF5E4] active:scale-95 cursor-pointer transition-colors border-l border-[#171815]/15"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="text-right">
                                  <AnimatedPrice
                                    value={line.lineSubtotal}
                                    className="font-price text-base sm:text-lg font-bold text-[#171815]"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Active Voucher & Gifts Summary */}
                  {cartPromotion.appliedDiscountVoucher && (
                    <div className="p-3 rounded-xl bg-[#1F3D2A]/10 border border-[#1F3D2A]/30 text-xs flex items-center gap-2 text-[#1F3D2A]">
                      <Sparkles className="w-4 h-4 shrink-0 text-[#951722]" />
                      <span>
                        Đã áp dụng mã{' '}
                        <span className="font-display font-bold">{cartPromotion.appliedDiscountCode}</span> (
                        <span>{cartPromotion.appliedDiscountVoucher.valueText}</span>
                        ):{' '}
                        <strong className="text-[#9B0514] font-price">
                          -{formatCurrency(cartPromotion.voucherDiscountAmount)}
                        </strong>
                      </span>
                    </div>
                  )}

                  {cartPromotion.gifts.map((g) => (
                    <div
                      key={g.code}
                      className="p-3 rounded-xl bg-[#FFFBF2] border border-[#1F3D2A]/30 text-xs flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 text-[#1F3D2A] font-semibold">
                        <Gift className="w-4 h-4 text-[#951722] shrink-0" />
                        <span>{g.name}</span>
                      </div>
                      <span className="font-price font-bold text-[#1F3D2A] whitespace-nowrap">
                        {g.badgeText}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Footer with Subtotal & Balanced, Ergonomic Action Buttons */}
            <div className="p-4 sm:p-5 bg-[#FFFBF2] border-t-2 border-[#951722]/20 space-y-3">
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-[#171815]/75">Tạm tính:</span>
                  <AnimatedPrice
                    value={cartPromotion.subtotal}
                    className="font-price text-base sm:text-lg font-semibold"
                  />
                </div>
                {cartPromotion.voucherDiscountAmount > 0 && (
                  <div className="flex justify-between items-baseline text-[#9B0514]">
                    <span>
                      Giảm giá ưu đãi (
                      <span className="font-bold">{cartPromotion.appliedDiscountCode}</span>):
                    </span>
                    <span className="font-price text-base font-bold">
                      -{formatCurrency(cartPromotion.voucherDiscountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-1.5 border-t border-[#951722]/15">
                  <span className="font-bold text-sm sm:text-base text-[#171815]">Tổng thanh toán dự kiến:</span>
                  <AnimatedPrice
                    value={cartPromotion.finalTotal}
                    className="font-price text-xl sm:text-2xl font-bold text-[#9B0514]"
                  />
                </div>
                {cartPromotion.totalSavings > 0 && (
                  <p className="text-xs text-[#1F3D2A] font-semibold text-right">
                    Bạn đã tiết kiệm{' '}
                    <span className="font-price">{formatCurrency(cartPromotion.totalSavings)}</span>
                  </p>
                )}
              </div>

              {/* Ergonomic Action Buttons (Well-proportioned height, saving ~60px vertical height) */}
              <div className="space-y-2 pt-1">
                {/* Button 1: Xem giỏ hàng & thanh toán (Primary) */}
                <button
                  type="button"
                  onClick={() => {
                    setMiniCartOpen(false);
                    navigate('/gio-hang');
                  }}
                  className="group/cta btn-sheen btn-breathe w-full h-11 sm:h-12 px-5 rounded-xl bg-[#951722] hover:bg-[#7C121C] active:scale-[0.98] text-[#FFF5E4] font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Xem giỏ hàng & thanh toán</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
                </button>

                {/* Button 2: Tiếp tục mua sắm (Closes drawer smoothly) */}
                <button
                  type="button"
                  onClick={() => setMiniCartOpen(false)}
                  className="group/cta btn-sheen w-full h-9 sm:h-10 px-4 rounded-xl border-2 border-[#1F3D2A]/35 text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-[#FFF5E4] hover:border-[#1F3D2A] active:scale-[0.98] font-bold text-xs sm:text-sm transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  <span>Tiếp tục mua sắm</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
