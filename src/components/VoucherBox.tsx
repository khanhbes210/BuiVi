import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Ticket,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Gift,
  Truck,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  PromotionCalculationResult,
  validateManualVoucherCode,
  getVoucherSelectToast,
} from '../utils/promotionEngine';
import { formatPrice } from '../data/products';
import { useStore } from '../context/StoreContext';
import {
  AnimatedPrice,
  AnimationSlot,
  MOTION_TOKENS,
  useMotionPreferences,
} from '../motion';

export interface VoucherBoxProps {
  promotion: PromotionCalculationResult;
  allowedCodes?: string[];
  onSelectVoucherCode?: (code: string | null) => void;
  ineligibleWarning?: string | null;
  showPriceBreakdown?: boolean;
  compact?: boolean;
}

export const VoucherBox: React.FC<VoucherBoxProps> = ({
  promotion,
  allowedCodes,
  onSelectVoucherCode,
  ineligibleWarning,
  showPriceBreakdown = true,
  compact = false,
}) => {
  const { applyVoucherCode, removeAppliedVoucher, showToast } = useStore();
  const { reducedMotion } = useMotionPreferences();
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [shakeInput, setShakeInput] = useState(false);
  const [listExpanded, setListExpanded] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const visibleStatuses = allowedCodes
    ? promotion.voucherStatuses.filter((s) => allowedCodes.includes(s.voucher.code))
    : promotion.voucherStatuses;

  const bestCode = promotion.bestEligibleDiscountVoucher?.voucher.code || null;

  const getShortCondition = (code: string, minOrder: number, maxDiscount: number): string => {
    switch (code) {
      case 'BUIVI10':
        return `Đơn từ ${formatPrice(minOrder)}, tối đa ${formatPrice(maxDiscount)} (trừ Combo 3 hộp quà)`;
      case 'QUATET15':
        return `Áp dụng Set Vinh Hoa - Phú Quý & Set Độc Bản, tối đa ${formatPrice(maxDiscount)}`;
      case 'FREESHIP':
        return `Đơn từ ${formatPrice(minOrder)}, hỗ trợ tối đa ${formatPrice(maxDiscount)}`;
      case 'COMBO3':
        return 'Mua Combo 3 hộp quà giảm thêm 50.000đ + tặng túi Điệp & thiệp viết tay';
      case 'THANHVIEN50':
        return `Đơn đầu tiên thành viên mới từ ${formatPrice(minOrder)}, giảm ${formatPrice(maxDiscount)}`;
      case 'TANGHOP':
        return 'Mua từ 2 Set quà bất kỳ tặng 1 hộp Nem chua (trị giá 85.000đ)';
      default:
        return `Đơn từ ${formatPrice(minOrder)}, tối đa ${formatPrice(maxDiscount)}`;
    }
  };

  const triggerShake = () => {
    setShakeInput(false);
    requestAnimationFrame(() => {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 360);
    });
  };

  const handleApplyVoucherCard = (code: string) => {
    const targetStatus = promotion.voucherStatuses.find((s) => s.voucher.code === code);
    if (!targetStatus || !targetStatus.eligible) return;

    if (code === 'FREESHIP') {
      const msg = `Đã áp dụng mã FREESHIP – miễn phí vận chuyển (${formatPrice(
        targetStatus.estimatedDiscount
      )}) cho đơn này`;
      setFeedback({ ok: true, text: msg });
      showToast(msg);
      return;
    }

    if (code === 'TANGHOP') {
      const msg = 'Đã áp dụng mã TANGHOP – tặng 1 hộp Nem chua (trị giá 85.000đ) cho đơn này';
      setFeedback({ ok: true, text: msg });
      showToast(msg);
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
    } else {
      const res = applyVoucherCode(code, promotion);
      setFeedback({ ok: res.ok, text: res.message });
      if (!res.ok) triggerShake();
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
    handleApplyVoucherCard(check.voucher.code);
    setInputCode('');
  };

  const handleFocusSwitchList = () => {
    setListExpanded(true);
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
                <span>Đổi mã</span>
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

      {/* Selectable Radio-Style Voucher Cards */}
      <div
        ref={listRef}
        className="bg-[#FFF5E4] border border-[#951722]/25 rounded-2xl p-3.5 sm:p-4 space-y-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1F3D2A]">
            <Ticket className="w-4 h-4 text-[#951722]" />
            <span>
              Chọn mã ưu đãi ({visibleStatuses.filter((v) => v.eligible).length}/
              {visibleStatuses.length} đủ điều kiện)
            </span>
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

        {/* Radio-style Voucher Cards List */}
        {listExpanded && (
          <div
            role="radiogroup"
            aria-label="Danh sách mã giảm giá"
            className={`space-y-2.5 ${compact ? 'max-h-64 overflow-y-auto pr-1' : ''}`}
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
                      handleApplyVoucherCard(voucher.code);
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

                        {/* Short condition */}
                        <p className="text-[11px] text-[#171815]/80 leading-snug">
                          {getShortCondition(voucher.code, voucher.minOrder, voucher.maxDiscount)}
                        </p>

                        {/* Eligibility state */}
                        {eligible ? (
                          <p className="text-[11px] font-bold text-[#1F3D2A] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            <span>
                              Đủ điều kiện
                              {estimatedDiscount > 0 && voucher.type !== 'gift'
                                ? ` (Tiết kiệm ${formatPrice(estimatedDiscount)})`
                                : ''}
                            </span>
                          </p>
                        ) : (
                          <p className="text-[11px] font-semibold text-[#171815]/60">
                            {reasonIfIneligible || 'Chưa đủ điều kiện'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Button on Right */}
                    <div className="shrink-0">
                      {eligible ? (
                        isSelected ? (
                          <motion.span
                            initial={reducedMotion ? false : { scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1F3D2A] text-[#FFF5E4] text-[11px] font-bold"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#F3D27A]" />
                            <span>Đang áp dụng</span>
                          </motion.span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyVoucherCard(voucher.code);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#951722] hover:bg-[#9B0514] active:scale-95 text-[#FFF5E4] font-bold text-xs cursor-pointer transition-all"
                          >
                            Áp dụng
                          </button>
                        )
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-2.5 py-1 rounded-lg bg-[#171815]/10 text-[#171815]/45 font-bold text-[11px] cursor-not-allowed"
                        >
                          Chưa đủ ĐK
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Voucher Celebration Animation Holder when a discount voucher is active */}
        {promotion.appliedDiscountVoucher && promotion.voucherDiscountAmount > 0 && (
          <div className="pt-1 flex items-center justify-between gap-3 bg-[#FFFBF2] border border-[#951722]/20 rounded-xl p-2.5">
            <AnimationSlot
              id="promo-voucher-celebrate"
              compact
              className="w-12 h-12 shrink-0 !p-1"
            />
            <div className="text-xs text-[#1F3D2A] flex-1">
              <p className="font-display text-sm text-[#951722]">
                Ưu đãi {promotion.appliedDiscountCode} đã kích hoạt!
              </p>
              <p className="text-[11px] text-[#171815]/75">
                Đơn hàng được giảm trực tiếp{' '}
                <span className="font-price text-[#9B0514]">
                  {formatPrice(promotion.voucherDiscountAmount)}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Gifts Breakdown (TANGHOP / COMBO3) */}
      {showPriceBreakdown && promotion.gifts.length > 0 && (
        <div className="bg-[#FFF5E4] border border-[#1F3D2A]/30 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F3D2A]">
            <Gift className="w-4 h-4 text-[#951722]" />
            <span>Quà tặng kèm tự động:</span>
          </div>
          {promotion.gifts.map((g) => (
            <div
              key={g.code}
              className="flex items-center justify-between text-xs bg-[#FFFBF2] px-2.5 py-2 rounded-lg border border-[#951722]/15"
            >
              <span className="font-semibold text-[#171815]">{g.name}</span>
              <span className="font-price text-[#1F3D2A] bg-[#1F3D2A]/10 px-2 py-0.5 rounded whitespace-nowrap">
                {g.badgeText}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Animated Itemized Price Breakdown (Section B3.3) */}
      {showPriceBreakdown && (
        <div
          data-testid="voucher-price-breakdown"
          className="bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-2xl p-4 space-y-2.5 text-sm transition-all duration-300"
        >
          {promotion.oldSubtotal > promotion.subtotal && (
            <div className="flex justify-between items-center text-xs text-[#171815]/65">
              <span>Giá gốc:</span>
              <span className="font-price line-through">
                {formatPrice(promotion.oldSubtotal)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-[#171815]/85">Giá niêm yết:</span>
            <AnimatedPrice
              value={promotion.subtotal}
              className="font-price text-[20px] text-[#171815]"
            />
          </div>

          {promotion.appliedDiscountCode && promotion.voucherDiscountAmount > 0 && (
            <div className="flex justify-between items-center text-[#9B0514]">
              <span>
                Voucher <span className="font-display">{promotion.appliedDiscountCode}</span>:
              </span>
              <span className="font-price text-[20px]">
                −{formatPrice(promotion.voucherDiscountAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-[#171815]/85 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#1F3D2A]" />
              <span>Phí vận chuyển:</span>
            </span>
            <div className="text-right">
              {promotion.freeshipApplied ? (
                <div className="flex items-center gap-1.5">
                  <span className="font-price text-xs text-[#171815]/50 line-through">
                    {formatPrice(promotion.shippingFeeBeforeDiscount)}
                  </span>
                  <span className="font-price text-[#1F3D2A]">Miễn phí</span>
                </div>
              ) : (
                <span className="font-price text-[#171815]">
                  {formatPrice(promotion.finalShippingFee)}
                </span>
              )}
            </div>
          </div>

          <div className="pt-2.5 border-t border-[#951722]/20 flex justify-between items-baseline">
            <span className="font-display text-base text-[#171815]">Tạm tính sau ưu đãi:</span>
            <AnimatedPrice
              value={subtotalAfterDiscount}
              testId="subtotal-after-discount"
              showOldStrike
              className="font-price text-2xl text-[#9B0514]"
            />
          </div>

          <div className="flex justify-between items-baseline text-xs text-[#171815]/85">
            <span className="font-display">Tổng thanh toán (gồm phí vận chuyển):</span>
            <AnimatedPrice
              value={promotion.finalTotal}
              showOldStrike
              className="font-price text-[20px] text-[#171815]"
            />
          </div>

          {promotion.totalSavings > 0 && (
            <div className="bg-[#951722]/10 border border-[#951722]/30 rounded-xl py-2 px-3 text-center">
              <span className="font-display text-xs sm:text-sm text-[#9B0514]">
                Bạn đã tiết kiệm{' '}
                <span className="font-price underline">{formatPrice(promotion.totalSavings)}</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
