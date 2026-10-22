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
  ArrowLeft,
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
          className="fixed inset-0 z-50 flex justify-end bg-[#171815]/35 backdrop-blur-xs"
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
            className="w-full max-w-md bg-[#FFF5E4] h-full shadow-2xl border-l-2 border-[#951722]/30 flex flex-col justify-between overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Header with Logo & <- Về trang chủ */}
            <div className="p-4 bg-[#FFFBF2] border-b border-[#951722]/20">
              <div className="flex items-center justify-between gap-2 mb-2">
                <Link
                  to="/"
                  onClick={() => setMiniCartOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F3D2A] hover:text-[#951722] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Về trang chủ</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMiniCartOpen(false)}
                  aria-label="Đóng giỏ hàng nhanh"
                  className="w-10 h-10 rounded-full hover:bg-[#951722]/10 flex items-center justify-center text-[#171815] cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <Link to="/" onClick={() => setMiniCartOpen(false)}>
                  <Logo variant="main" className="scale-90 origin-left" />
                </Link>
                <div className="flex items-center gap-1.5 text-sm font-bold text-[#951722]">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Giỏ hàng ({totalCartItemsCount})</span>
                </div>
              </div>

              {/* Success Banner when an item was just added + add-to-cart-success AnimationSlot */}
              <AnimatePresence mode="popLayout">
                {lastAddedItem && (
                  <motion.div
                    key={`${lastAddedItem.product.id}-${lastAddedItem.selectedPack}`}
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: MOTION_TOKENS.durations.fast }}
                    className="mt-3 p-3 rounded-xl bg-[#1F3D2A] text-[#FFF5E4] flex items-center gap-3"
                  >
                    <AnimationSlot
                      id="add-to-cart-success"
                      compact
                      className="w-11 h-11 shrink-0 !bg-[#FFF5E4]/95 !p-1"
                    />
                    <div className="text-xs leading-snug min-w-0">
                      <p className="font-bold text-sm text-[#F3D27A] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Đã thêm vào giỏ hàng</span>
                      </p>
                      <p className="mt-0.5 truncate">
                        <span className="font-semibold">{lastAddedItem.product.name}</span> (SL:{' '}
                        {lastAddedItem.quantity}) – {lastAddedItem.selectedPack}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Scrollable Cart Items + Promotion Status */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartPromotion.lines.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <AnimationSlot id="cart-empty" className="max-w-[220px] mx-auto" />
                  <p className="font-display text-lg text-[#171815]">Giỏ hàng đang trống</p>
                  <p className="text-sm text-[#171815]/70">
                    Hãy chọn những thức quà di sản Kinh Bắc cho người thân yêu.
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
                            className="p-3 rounded-xl bg-[#FFFBF2] border border-[#951722]/20 flex gap-3"
                          >
                            <Link
                              to={`/san-pham/${line.product.slug}`}
                              onClick={() => setMiniCartOpen(false)}
                              className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#F5E6CC] relative"
                            >
                              <Img
                                src={line.product.images[0].url}
                                alt={line.product.name}
                                theme={line.product.images[0].theme}
                                className="w-full h-full object-cover"
                              />
                              {disc && (
                                <span className="absolute top-1 left-1 bg-[#9B0514] text-[#FFF5E4] font-price text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  -{disc}%
                                </span>
                              )}
                            </Link>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  to={`/san-pham/${line.product.slug}`}
                                  onClick={() => setMiniCartOpen(false)}
                                  className="font-display text-base text-[#171815] hover:text-[#951722] truncate"
                                >
                                  {line.product.name}
                                </Link>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeFromCart(line.product.id, line.selectedPack)
                                  }
                                  aria-label={`Xóa ${line.product.name}`}
                                  className="text-[#171815]/50 hover:text-[#9B0514] p-1 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-xs text-[#171815]/70 truncate">
                                {line.selectedPack}
                              </p>

                              <div className="flex items-baseline gap-2 mt-1">
                                <span className="font-price text-[20px] text-[#9B0514]">
                                  {formatCurrency(line.product.price)}
                                </span>
                                {line.product.oldPrice && (
                                  <span className="font-price text-sm text-[#171815]/50 line-through">
                                    {formatCurrency(line.product.oldPrice)}
                                  </span>
                                )}
                              </div>

                              {/* Line promotion tags */}
                              {line.appliedTags.length > 0 && (
                                <div className="mt-1 space-y-0.5">
                                  {line.appliedTags.map((t, idx) => (
                                    <p key={idx} className="text-xs text-[#1F3D2A]">
                                      • {t}
                                    </p>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-2">
                                <div className="inline-flex items-center border border-[#951722]/30 rounded-lg bg-[#FFF5E4]">
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
                                    className="w-7 h-7 flex items-center justify-center text-[#171815] hover:bg-[#951722]/10 active:scale-95 cursor-pointer transition-transform"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="px-2.5 text-sm font-price">
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
                                    className="w-7 h-7 flex items-center justify-center text-[#171815] hover:bg-[#951722]/10 active:scale-95 cursor-pointer transition-transform"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <AnimatedPrice
                                  value={line.lineSubtotal}
                                  className="font-price text-[20px] text-[#171815]"
                                />
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
                        <span className="font-display">{cartPromotion.appliedDiscountCode}</span> (
                        <span className="font-display">
                          {cartPromotion.appliedDiscountVoucher.valueText}
                        </span>
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
                      className="p-3 rounded-xl bg-[#FFFBF2] border border-[#1F3D2A]/40 text-xs flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 text-[#1F3D2A] font-semibold">
                        <Gift className="w-4 h-4 text-[#951722] shrink-0" />
                        <span>{g.name}</span>
                      </div>
                      <span className="font-price text-[#1F3D2A] whitespace-nowrap">
                        {g.badgeText}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Footer with Subtotal & 3 Mandatory Large Actions */}
            <div className="p-4 bg-[#FFFBF2] border-t-2 border-[#951722]/25 space-y-3">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="font-display text-[#171815]/85">Tạm tính:</span>
                  <AnimatedPrice
                    value={cartPromotion.subtotal}
                    className="font-price text-[20px]"
                  />
                </div>
                {cartPromotion.voucherDiscountAmount > 0 && (
                  <div className="flex justify-between text-xs text-[#9B0514]">
                    <span>
                      Giảm giá ưu đãi (
                      <span className="font-display">{cartPromotion.appliedDiscountCode}</span>):
                    </span>
                    <span className="font-price text-[20px]">
                      -{formatCurrency(cartPromotion.voucherDiscountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-1 border-t border-[#951722]/15">
                  <span className="font-display text-base">Tổng thanh toán dự kiến:</span>
                  <AnimatedPrice
                    value={cartPromotion.finalTotal}
                    className="font-price text-2xl text-[#9B0514]"
                  />
                </div>
                {cartPromotion.totalSavings > 0 && (
                  <p className="font-display text-xs text-[#1F3D2A] text-right">
                    Bạn đã tiết kiệm{' '}
                    <span className="font-price">{formatCurrency(cartPromotion.totalSavings)}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2.5 pt-1">
                {/* Button 1: Xem giỏ hàng & thanh toán (Primary) */}
                <button
                  type="button"
                  onClick={() => {
                    setMiniCartOpen(false);
                    navigate('/gio-hang');
                  }}
                  className="btn-sheen w-full min-h-[54px] px-5 py-3 rounded-xl bg-[#951722] hover:bg-[#9B0514] active:scale-[0.98] text-[#FFF5E4] font-bold text-[17px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Xem giỏ hàng & thanh toán</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Button 2: Tiếp tục mua sắm (Closes drawer and stays on current page) */}
                <button
                  type="button"
                  onClick={() => setMiniCartOpen(false)}
                  className="btn-sheen w-full min-h-[52px] px-5 py-2.5 rounded-xl border-2 border-[#1F3D2A] text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-[#FFF5E4] active:scale-[0.98] font-bold text-[17px] transition-all flex items-center justify-center cursor-pointer"
                >
                  <span>Tiếp tục mua sắm</span>
                </button>

                {/* Link 3: Về trang chủ */}
                <div className="text-center pt-1">
                  <Link
                    to="/"
                    onClick={() => setMiniCartOpen(false)}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#951722] hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Về trang chủ</span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
