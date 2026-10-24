import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Ticket,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  Gift,
  Truck,
  RefreshCw,
  ChevronDown,
} from 'lucide-react';
import { PromotionCalculationResult, validateManualVoucherCode } from '../utils/promotionEngine';
import { formatCurrency, formatPrice } from '../data/products';
import { useStore } from '../context/StoreContext';
import {
  AnimatedPrice,
  MOTION_TOKENS,
  useMotionPreferences,
} from '../motion';

export interface VoucherBoxProps {
  promotion: PromotionCalculationResult;
  compact?: boolean;
  /**
   * Optional override when used in BuyNow mode where voucher state is local or shared
   */
  onSelectVoucherCode?: (code: string) => void;
}

/**
 * Formats the exact required toast copy when switching vouchers (P1-5):
 * "Đã đổi sang mã QUATET15 (giảm 153.000đ) thay cho BUIVI10 (giảm 102.000đ)"
 */
export function getVoucherSelectToast(
  prevCode: string | null,
  prevDiscount: number,
  nextCode: string,
  nextDiscount: number
): string {
  if (prevCode && prevCode !== nextCode && prevDiscount > 0) {
    return `Đã đổi sang mã ${nextCode} (giảm ${formatPrice(
      nextDiscount
    )}) thay cho ${prevCode} (giảm ${formatPrice(prevDiscount)})`;
  }
  return `Đã áp dụng mã ${nextCode} – giảm ${formatPrice(nextDiscount)} cho đơn này`;
}

export const VoucherBox: React.FC<VoucherBoxProps> = ({
  promotion,
  compact = false,
  onSelectVoucherCode,
}) => {
  const {
    applyVoucherCode,
    removeAppliedVoucher,
    ineligibleWarning,
    showToast,
  } = useStore();
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  // Collapsed by default so the right-hand Cart/Checkout column stays compact; expands when clicking "Chọn mã ưu đãi" or "Đổi mã"
  const [listExpanded, setListExpanded] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [savingsPulse, setSavingsPulse] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const prevSavingsRef = useRef(promotion.totalSavings);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    if (promotion.totalSavings !== prevSavingsRef.current && promotion.totalSavings > 0) {
      setSavingsPulse(true);
      const t = setTimeout(() => setSavingsPulse(false), 320);
      prevSavingsRef.current = promotion.totalSavings;
      return () => clearTimeout(t);
    }
    prevSavingsRef.current = promotion.totalSavings;
  }, [promotion.totalSavings]);

  const visibleStatuses = promotion.voucherStatuses;
  const eligibleCount = visibleStatuses.filter((v) => v.eligible).length;

  // Identify the single best eligible discount voucher to badge as "Mã tốt nhất"
  const bestEligibleStatus = visibleStatuses
    .filter((s) => s.eligible && s.estimatedDiscount > 0)
    .sort((a, b) => b.estimatedDiscount - a.estimatedDiscount)[0];
  const bestCode = bestEligibleStatus?.voucher.code || null;

  const triggerShake = () => {
    setShakeInput(false);
    requestAnimationFrame(() => {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 360);
    });
  };

  const handleApplyVoucherCard = (code: string, closeDrawerAfter = false) => {
    const targetStatus = promotion.voucherStatuses.find((s) => s.voucher.code === code);
    if (!targetStatus || !targetStatus.eligible) return;

    if (code === 'FREESHIP') {
      const msg = `Đã áp dụng mã FREESHIP – miễn phí vận chuyển (${formatPrice(
        targetStatus.estimatedDiscount
      )}) cho đơn này`;
      setFeedback({ ok: true, text: msg });
      showToast(msg);
      if (closeDrawerAfter) setListExpanded(false);
      return;
    }

    if (code === 'TANGHOP') {
      const msg = 'Đã áp dụng mã TANGHOP – tặng 1 hộp Nem chua (trị giá 85.000đ) cho đơn này';
      setFeedback({ ok: true, text: msg });
      showToast(msg);
      if (closeDrawerAfter) setListExpanded(false);
      return;
    }

    const prevCode = promotion.appliedDiscountCode;
    const prevDiscount = promotion.voucherDiscountAmount;
    const nextDiscount = targetStatus.estimatedDiscount;
    const toastMsg = getVoucherSelectToast(prevCode, prevDiscount, code, nextDiscount);

    if (onSelectVoucherCode) {
      onSelectVoucherCode(code);
      setFeedback({ ok: true, text: toastMsg });
      showToast(toastMsg);
      if (closeDrawerAfter) setListExpanded(false);
    } else {
      const res = applyVoucherCode(code, promotion);
      setFeedback({ ok: res.ok, text: res.message });
      if (!res.ok) {
        triggerShake();
      } else if (closeDrawerAfter) {
        setListExpanded(false);
      }
    }
  };

  const handleRemoveVoucher = () => {
    setFeedback(null);
    if (onSelectVoucherCode) {
      onSelectVoucherCode('NONE');
      showToast('Đã bỏ mã ưu đãi và khôi phục giá niêm yết.');
    } else {
      removeAppliedVoucher();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const activeLines = promotion.lines
      .filter((l) => l.selected)
      .map((l) => ({ product: l.product, quantity: l.quantity }));
    const check = validateManualVoucherCode(inputCode, activeLines, true, true);
    if (!check.ok || !check.voucher || !check.status) {
      setFeedback({ ok: false, text: check.message });
      triggerShake();
      return;
    }
    handleApplyVoucherCard(check.voucher.code, true);
    setInputCode('');
  };

  const handleFocusSwitchList = () => {
    setListExpanded((prev) => !prev);
    if (listRef.current) {
      listRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const subtotalAfterDiscount = Math.max(
    0,
    promotion.subtotal - promotion.voucherDiscountAmount
  );

  return (
    <div className="space-y-4">
      {/* Active Voucher Header Chip: "Đang áp dụng: BUIVI10 – Giảm 10%" with "Đổi mã" and "Bỏ mã" */}
      <AnimatePresence mode="popLayout">
        {promotion.appliedDiscountVoucher && promotion.appliedDiscountCode && (
          <motion.div
            key={promotion.appliedDiscountCode}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{
              duration: MOTION_TOKENS.durations.fast,
              ease: MOTION_TOKENS.easings.standard,
            }}
            data-testid="active-voucher-chip"
            className="bg-[#1F3D2A] text-[#FFF5E4] px-3.5 py-2.5 rounded-xl border border-[#F3D27A]/50 flex flex-wrap items-center justify-between gap-2 shadow-xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-[#F3D27A] shrink-0" />
              <span className="text-xs sm:text-sm truncate">
                Đang áp dụng:{' '}
                <span className="font-display text-[#F3D27A]">
                  {promotion.appliedDiscountCode}
                </span>{' '}
                –{' '}
                <span className="font-display">
                  {promotion.appliedDiscountVoucher.valueText}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-xs font-bold">
              <button
                type="button"
                onClick={handleFocusSwitchList}
                className="px-2.5 py-1 rounded-lg bg-[#FFF5E4]/15 hover:bg-[#FFF5E4]/25 text-[#F3D27A] inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{listExpanded ? 'Thu gọn' : 'Đổi mã'}</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveVoucher}
                className="px-2.5 py-1 rounded-lg bg-[#9B0514] hover:bg-[#951722] text-[#FFF5E4] inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Bỏ mã</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Polite inline warning if quantity change invalidated previous voucher */}
      {ineligibleWarning && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-[#9B0514]/10 border border-[#9B0514]/30 text-xs font-semibold text-[#9B0514] flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{ineligibleWarning}</span>
        </div>
      )}

      {/* Compact Voucher Input & Collapsible Selector Drawer */}
      <div
        ref={listRef}
        className="bg-[#FFF5E4] border border-[#951722]/25 rounded-2xl p-3.5 sm:p-4 space-y-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1F3D2A]">
            <Ticket className="w-4 h-4 text-[#951722]" />
            <span>Mã ưu đãi & Khuyến mãi</span>
          </div>
          <Link
            to="/khuyen-mai"
            className="text-xs font-bold text-[#951722] hover:underline whitespace-nowrap"
          >
            Xem điều kiện →
          </Link>
        </div>

        {/* Manual Code Input Bar with horizontal shake on invalid code */}
        <form
          onSubmit={handleManualSubmit}
          className={`flex gap-2 ${shakeInput ? 'anim-shake-x' : ''}`}
        >
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã ưu đãi: BUIVI10, QUATET15..."
            aria-label="Nhập mã ưu đãi"
            className={`flex-1 min-h-[42px] px-3 py-1.5 rounded-xl bg-[#FFFBF2] border text-xs sm:text-sm font-body uppercase text-[#171815] focus:outline-none focus:ring-2 transition-colors ${
              feedback && !feedback.ok
                ? 'border-[#9B0514] focus:ring-[#9B0514]'
                : 'border-[#951722]/30 focus:ring-[#951722]'
            }`}
          />
          <button
            type="submit"
            className="btn-sheen min-h-[42px] px-4 py-1.5 rounded-xl bg-[#1F3D2A] hover:bg-[#173020] active:scale-[0.98] text-[#FFF5E4] font-bold text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-all"
          >
            Áp dụng
          </button>
        </form>

        <AnimatePresence mode="popLayout">
          {feedback && (
            <motion.div
              key={feedback.text}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: MOTION_TOKENS.durations.fast }}
              role="status"
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                feedback.ok
                  ? 'bg-[#1F3D2A]/10 text-[#1F3D2A] border border-[#1F3D2A]/30'
                  : 'bg-[#9B0514]/10 text-[#9B0514] border border-[#9B0514]/30'
              }`}
            >
              {feedback.ok ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{feedback.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button to Expand / Collapse Available Vouchers */}
        <button
          type="button"
          data-testid="toggle-voucher-list-btn"
          aria-expanded={listExpanded}
          onClick={() => setListExpanded((prev) => !prev)}
          className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#FFFBF2] hover:bg-[#F5E6CC]/65 border border-[#951722]/30 flex items-center justify-between gap-2 text-xs sm:text-sm font-semibold text-[#171815] transition-colors cursor-pointer"
        >
          <div className="flex flex-wrap items-center gap-2 min-w-0 text-left">
            <span className="text-[#1F3D2A]">
              {listExpanded
                ? 'Thu gọn danh sách mã ưu đãi'
                : `Chọn mã ưu đãi có sẵn (${eligibleCount}/${visibleStatuses.length} đủ điều kiện)`}
            </span>
            {!listExpanded && bestCode && (
              <span className="badge-micro inline-flex items-center gap-1 bg-[#951722]/10 text-[#951722] border border-[#951722]/25 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3 text-[#951722]" />
                <span>Gợi ý: {bestCode}</span>
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#951722] shrink-0 transition-transform duration-200 ${
              listExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Collapsible Radio-style Voucher Cards List */}
        <AnimatePresence initial={false}>
          {listExpanded && (
            <motion.div
              key="voucher-radio-list"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{
                duration: MOTION_TOKENS.durations.fast,
                ease: MOTION_TOKENS.easings.standard,
              }}
              role="radiogroup"
              aria-label="Danh sách mã giảm giá"
              className={`space-y-2.5 pt-1 ${
                compact ? 'max-h-60' : 'max-h-[310px]'
              } overflow-y-auto pr-1`}
            >
              {visibleStatuses.map((status) => {
                const { voucher, eligible, estimatedDiscount, reasonIfIneligible } = status;
                const isDiscountVoucher = ['BUIVI10', 'QUATET15', 'COMBO3', 'THANHVIEN50'].includes(
                  voucher.code
                );
                const isSelected = isDiscountVoucher
                  ? promotion.appliedDiscountCode === voucher.code
                  : (voucher.code === 'FREESHIP' && promotion.freeshipApplied) ||
                    (voucher.code === 'TANGHOP' && promotion.tangHopGiftActive);
                const isBest = bestCode === voucher.code && eligible;

                return (
                  <div
                    key={voucher.code}
                    data-testid={`voucher-card-${voucher.code}`}
                    onClick={() => {
                      if (eligible && !isSelected) {
                        handleApplyVoucherCard(voucher.code, true);
                      }
                    }}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      eligible
                        ? isSelected
                          ? 'bg-[#1F3D2A]/10 border-[#1F3D2A] shadow-xs cursor-default'
                          : 'bg-[#FFFBF2] border-[#951722]/25 hover:border-[#951722] cursor-pointer'
                        : 'bg-[#F5E6CC]/45 border-[#171815]/15 opacity-75 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        {/* Radio / Check indicator */}
                        <div
                          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'border-[#1F3D2A] bg-[#1F3D2A] text-[#FFF5E4]'
                              : eligible
                              ? 'border-[#951722]'
                              : 'border-[#171815]/30'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#FFF5E4]" />}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`font-display text-xs px-2 py-0.5 rounded ${
                                eligible
                                  ? 'bg-[#1F3D2A] text-[#FFF5E4]'
                                  : 'bg-[#171815]/20 text-[#171815]/70'
                              }`}
                            >
                              {voucher.code}
                            </span>
                            <span className="font-price text-sm text-[#9B0514]">
                              {voucher.valueText}
                            </span>
                            {isBest && (
                              <span className="inline-flex items-center gap-1 bg-[#951722] text-[#FFF5E4] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                <Sparkles className="w-2.5 h-2.5 text-[#F3D27A]" />
                                <span>Mã tốt nhất</span>
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#171815]/80">
                            Đơn tối thiểu:{' '}
                            <strong className="font-price">
                              {voucher.minOrder > 0 ? formatPrice(voucher.minOrder) : '0đ'}
                            </strong>{' '}
                            · Tối đa:{' '}
                            <strong className="font-price">{formatPrice(voucher.maxDiscount)}</strong>
                          </p>

                          {eligible ? (
                            <p className="text-xs font-semibold text-[#1F3D2A]">
                              ✓ Đủ điều kiện · Tiết kiệm{' '}
                              <span className="font-price">{formatPrice(estimatedDiscount)}</span>
                            </p>
                          ) : (
                            <p className="text-xs font-semibold text-[#9B0514]">
                              ✕ Chưa đủ điều kiện: {reasonIfIneligible}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0">
                        {eligible ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isSelected) handleApplyVoucherCard(voucher.code, true);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#1F3D2A] text-[#FFF5E4]'
                                : 'bg-[#951722] hover:bg-[#9B0514] text-[#FFF5E4]'
                            }`}
                          >
                            {isSelected ? 'Đang dùng' : 'Dùng mã'}
                          </button>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded bg-[#171815]/10 text-[#171815]/55 text-[11px] font-semibold">
                            Chưa thỏa
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detailed Transparent Price Calculation Breakdown */}
      <div className="bg-[#FFFBF2] border-2 border-[#951722]/30 rounded-2xl p-4 sm:p-5 space-y-3">
        <h4 className="font-display text-lg text-[#951722] border-b border-[#951722]/15 pb-2">
          Chi Tiết Tính Giá & Khuyến Mãi
        </h4>

        <div className="space-y-2 text-sm">
          {/* 1. Original Price */}
          <div className="flex justify-between items-center text-[#171815]/75">
            <span className="font-display">Giá gốc niêm yết:</span>
            <AnimatedPrice
              value={promotion.oldSubtotal}
              className="font-price line-through"
            />
          </div>

          {/* 2. Product sale / Combo discount */}
          {promotion.directSaleSavings > 0 && (
            <div className="flex justify-between items-center text-[#1F3D2A]">
              <span>Tiết kiệm giá ưu đãi / Combo Set:</span>
              <span className="font-price font-semibold">
                -<AnimatedPrice value={promotion.directSaleSavings} />
              </span>
            </div>
          )}

          {/* 3. Subtotal before voucher */}
          <div className="flex justify-between items-center font-medium text-[#171815] pt-1 border-t border-dashed border-[#951722]/15">
            <span className="font-display">Tạm tính (giá đang bán):</span>
            <AnimatedPrice value={promotion.subtotal} className="font-price font-semibold" />
          </div>

          {/* 4. Voucher Discount */}
          {promotion.voucherDiscountAmount > 0 && promotion.appliedDiscountCode && (
            <div className="flex justify-between items-center text-[#9B0514] bg-[#9B0514]/5 px-2.5 py-1.5 rounded-lg">
              <span className="flex items-center gap-1.5 font-semibold">
                <Ticket className="w-4 h-4 shrink-0" />
                <span>
                  Voucher <span className="font-display">{promotion.appliedDiscountCode}</span>:
                </span>
              </span>
              <span className="font-price font-bold">
                -<AnimatedPrice value={promotion.voucherDiscountAmount} />
              </span>
            </div>
          )}

          {/* 5. Subtotal after discount */}
          {promotion.voucherDiscountAmount > 0 && (
            <div className="flex justify-between items-center text-[#171815]/85">
              <span>Tạm tính sau giảm mã:</span>
              <AnimatedPrice
                value={subtotalAfterDiscount}
                className="font-price font-semibold"
              />
            </div>
          )}

          {/* 6. Shipping Fee & FREESHIP */}
          <div className="flex justify-between items-center text-[#171815]/85">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#1F3D2A]" />
              <span>Phí vận chuyển tiêu chuẩn:</span>
            </span>
            {promotion.subtotal === 0 ? (
              <span className="font-price">0đ</span>
            ) : promotion.freeshipApplied ? (
              <span className="font-price">
                <span className="line-through text-[#171815]/50 mr-1.5">
                  {formatCurrency(promotion.shippingFeeBeforeDiscount)}
                </span>
                <strong className="text-[#1F3D2A]">0đ (FREESHIP)</strong>
              </span>
            ) : (
              <AnimatedPrice value={promotion.finalShippingFee} className="font-price" />
            )}
          </div>

          {/* 7. Free Gifts Line (0đ - Quà tặng) */}
          {promotion.gifts.length > 0 && (
            <div className="pt-2 border-t border-dashed border-[#951722]/15 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F3D2A] flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-[#951722]" />
                <span>Quà tặng kèm trong đơn (0đ):</span>
              </span>
              {promotion.gifts.map((g) => (
                <div
                  key={g.code}
                  className="flex justify-between items-start gap-2 text-xs bg-[#1F3D2A]/10 text-[#1F3D2A] px-2.5 py-1.5 rounded-lg"
                >
                  <span className="font-display">{g.name}</span>
                  <span className="font-price whitespace-nowrap shrink-0">{g.badgeText}</span>
                </div>
              ))}
            </div>
          )}

          {/* 8. Final Total */}
          <div className="pt-3 border-t-2 border-[#951722]/30 flex justify-between items-baseline">
            <span className="font-display text-base text-[#171815]">Tổng thanh toán:</span>
            <AnimatedPrice
              value={promotion.finalTotal}
              className="font-price text-2xl text-[#9B0514]"
            />
          </div>

          {/* 9. Total Savings Highlight */}
          {promotion.totalSavings > 0 && (
            <motion.div
              animate={savingsPulse && !reducedMotion ? { scale: [1, 1.03, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1F3D2A] text-[#FFF5E4] px-3 py-2 rounded-xl flex items-center justify-between text-xs"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#F3D27A] shrink-0" />
                <span className="font-display text-sm">Bạn đã tiết kiệm tổng cộng:</span>
              </span>
              <AnimatedPrice
                value={promotion.totalSavings}
                className="font-price text-[#F3D27A] text-sm"
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
