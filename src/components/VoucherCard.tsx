import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Ticket,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  X,
  FileText,
} from 'lucide-react';
import { Voucher } from '../data/vouchers';
import { formatPrice } from '../data/products';
import { useStore } from '../context/StoreContext';
import { BuyNowButton } from './BuyNowButton';
import { MicroConfetti, MOTION_TOKENS, useMotionPreferences } from '../motion';

export interface VoucherCardProps {
  voucher: Voucher;
  highlighted?: boolean;
  compact?: boolean;
}

export const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  highlighted = false,
  compact = false,
}) => {
  const { appliedVoucherCode, saveVoucherForLater, startBuyNow, showToast } = useStore();
  const [copied, setCopied] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [termsOpen, setTermsOpen] = useState(false);
  const navigate = useNavigate();
  const { reducedMotion } = useMotionPreferences();

  const isSaved = appliedVoucherCode === voucher.code;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(voucher.code).catch(() => {});
    }
    setCopied(true);
    setConfettiTrigger((c) => c + 1);
    showToast(`Đã sao chép mã ${voucher.code}`);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleUseVoucher = () => {
    saveVoucherForLater(voucher.code);
  };

  const handleBuyNowEligible = () => {
    const defaultPid = voucher.defaultEligibleProductIds?.[0];
    const qty = voucher.defaultBuyNowQuantity || 1;
    if (defaultPid) {
      startBuyNow(defaultPid, qty, undefined, voucher.code);
      navigate('/thanh-toan?mode=buynow');
    } else {
      saveVoucherForLater(voucher.code);
      navigate('/san-pham');
    }
  };

  return (
    <article
      lang="vi"
      data-testid={`voucher-box-${voucher.code}`}
      className={`group h-full w-full bg-[#FFFBF2] border-2 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between relative transition-all duration-300 md:hover:-translate-y-1 hover:shadow-md ${
        highlighted
          ? 'border-[#951722] ring-4 ring-[#951722]/30 shadow-xl voucher-hash-pulse'
          : 'border-[#951722]/35 hover:border-[#951722]/65'
      }`}
    >
      {/* Top Perforated Ticket Header – Clickable to /khuyen-mai#ma-voucher-<code> */}
      <div
        onClick={() => navigate(`/khuyen-mai#ma-voucher-${voucher.code}`)}
        className="voucher-header-sheen bg-[#1F3D2A] text-[#FFF5E4] p-5 min-h-[154px] shrink-0 flex flex-col justify-center relative border-b-2 border-dashed border-[#FFF5E4]/30 cursor-pointer hover:bg-[#193323] transition-colors"
      >
        {/* Left & Right ticket punch cutouts */}
        <div
          aria-hidden="true"
          className="w-5 h-5 rounded-full bg-[#FFF5E4] border border-[#951722]/30 absolute -bottom-2.5 -left-2.5 z-10"
        />
        <div
          aria-hidden="true"
          className="w-5 h-5 rounded-full bg-[#FFF5E4] border border-[#951722]/30 absolute -bottom-2.5 -right-2.5 z-10"
        />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="inline-block text-xs uppercase tracking-wider text-[#F3D27A] font-semibold mb-1">
              {voucher.countdownText}
            </span>
            <div className="font-price text-2xl md:text-3xl text-[#FFF5E4] leading-tight">
              {voucher.valueText}
            </div>
            <h3 className="font-display !text-[18px] sm:!text-[19px] text-[#FFF5E4]/95 mt-1.5 leading-[1.35]">
              {voucher.title}
            </h3>
          </div>

          <div className="flex flex-col items-end shrink-0 relative">
            <div className="bg-[#FFF5E4] text-[#951722] px-3 py-1.5 rounded-lg border border-[#951722] font-display text-sm tracking-wider flex items-center gap-1.5">
              <Ticket className="w-4 h-4 shrink-0" />
              <span className="font-display">{voucher.code}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="relative mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#F3D27A] hover:underline cursor-pointer"
            >
              <MicroConfetti active={confettiTrigger > 0} />
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép mã</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Body Details — natural auto-height per row, zero text clipping, left-aligned clean prose */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4 relative">
        {/* Top Metadata Rows */}
        <div className="space-y-2.5 text-sm text-[#171815] text-left">
          <div className="flex items-center justify-between gap-3 py-1.5 border-b border-[#951722]/12">
            <span className="text-[#171815]/70 shrink-0">Đơn tối thiểu:</span>
            <span className="font-semibold font-price text-[#171815] text-right">
              {voucher.minOrder > 0 ? formatPrice(voucher.minOrder) : '0đ (Không yêu cầu)'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 py-1.5 border-b border-[#951722]/12">
            <span className="text-[#171815]/70 shrink-0">Mức ưu đãi tối đa:</span>
            <span className="font-semibold font-price text-[#9B0514] text-right">
              {formatPrice(voucher.maxDiscount)}
            </span>
          </div>

          <div className="py-1.5 border-b border-[#951722]/12 space-y-1">
            <span className="text-[#171815]/70 block text-xs uppercase tracking-wider font-semibold">
              Sản phẩm áp dụng:
            </span>
            <div className="text-[14.5px] font-semibold text-[#1F3D2A] leading-[1.55] text-left">
              {voucher.applicableProductsText}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 py-1.5 border-b border-[#951722]/12">
            <span className="text-[#171815]/70 shrink-0">Thời hạn ưu đãi:</span>
            <span className="font-semibold text-[#171815] text-right">
              {voucher.expiryDisplay}
            </span>
          </div>

          {!compact && (
            <>
              <div className="py-1.5 border-b border-[#951722]/12 space-y-1">
                <span className="text-[#171815]/70 block text-xs uppercase tracking-wider font-semibold">
                  Quy định cộng gộp:
                </span>
                <div className="text-[14.5px] font-medium text-[#171815] leading-[1.55] text-left">
                  {voucher.stackableText}
                </div>
              </div>

              <div className="py-1.5 border-b border-[#951722]/12 space-y-1">
                <span className="text-[#171815]/70 block text-xs uppercase tracking-wider font-semibold">
                  Giới hạn lượt dùng:
                </span>
                <div className="text-[14.5px] font-medium text-[#171815] leading-[1.55] text-left">
                  {voucher.usageLimit}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Anchored Section: 3-Step Box + Detailed Terms Trigger + 2 Action Buttons */}
        <div className="mt-auto space-y-3 pt-1">
          {compact ? (
            <div>
              <Link
                to={`/khuyen-mai#ma-voucher-${voucher.code}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#951722] hover:underline"
              >
                <span>Xem chi tiết ưu đãi ({voucher.code})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <>
              {/* 3-step How to use — snug fit, clean left alignment */}
              <div className="bg-[#FFF5E4] p-4 rounded-xl border border-[#951722]/20 space-y-2 text-left">
                <span className="font-bold text-xs uppercase tracking-wider text-[#951722] block">
                  Cách sử dụng (3 bước):
                </span>
                <ol className="space-y-1.5 text-[13.5px] sm:text-[14px] text-[#171815]/90 leading-[1.55]">
                  {voucher.howToUse.map((step, idx) => (
                    <li key={idx} className="text-left">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Trigger button to open in-card Detailed Terms overlay */}
              <div>
                <button
                  type="button"
                  data-testid={`voucher-terms-btn-${voucher.code}`}
                  onClick={() => setTermsOpen((prev) => !prev)}
                  aria-expanded={termsOpen}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#1F3D2A] hover:text-[#951722] py-2.5 px-3.5 rounded-xl bg-[#FFF5E4]/85 hover:bg-[#FFF5E4] border border-[#1F3D2A]/20 transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#951722]" />
                    <span>Điều khoản chi tiết & Điều kiện áp dụng</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      termsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            </>
          )}

          {/* Two Action Buttons — 2-column grid with min-w-0 so buttons never overflow horizontally or vertically */}
          <div className="pt-0.5 grid grid-cols-2 gap-2.5 w-full relative z-10">
            <button
              type="button"
              onClick={handleUseVoucher}
              className={`btn-sheen w-full min-w-0 min-h-[48px] px-3.5 sm:px-4 py-2 rounded-xl font-bold text-[15px] sm:text-[16px] leading-[1.3] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-[0.98] ${
                isSaved
                  ? 'bg-[#1F3D2A] text-[#FFF5E4] border-2 border-[#1F3D2A]'
                  : 'border-2 border-[#1F3D2A] text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-[#FFF5E4]'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Đã lưu mã</span>
                </>
              ) : (
                <span>Dùng mã này</span>
              )}
            </button>
            <BuyNowButton
              onClick={handleBuyNowEligible}
              size="sm"
              className="w-full !min-w-0 !min-h-[48px] !px-3.5 sm:!px-4 !py-2 !text-[15px] sm:!text-[16px]"
            />
          </div>
        </div>

        {/* In-card Overlay for Detailed Terms & Conditions — isolated to THIS card only, zero height change */}
        <AnimatePresence initial={false}>
          {!compact && termsOpen && (
            <motion.div
              key="terms-overlay"
              data-testid={`voucher-terms-overlay-${voucher.code}`}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              transition={{
                duration: MOTION_TOKENS.durations.fast,
                ease: MOTION_TOKENS.easings.standard,
              }}
              className="absolute inset-x-4 top-3 bottom-[72px] z-20 rounded-2xl bg-[#FFFBF2] border-2 border-[#1F3D2A] shadow-xl flex flex-col overflow-hidden text-left"
            >
              <div className="bg-[#1F3D2A] text-[#FFF5E4] px-4 py-2.5 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-[#F3D27A] shrink-0" />
                  <span className="font-display text-sm text-[#FFF5E4] truncate">
                    Điều khoản & Điều kiện · Mã {voucher.code}
                  </span>
                </div>
                <button
                  type="button"
                  data-testid={`voucher-terms-close-${voucher.code}`}
                  onClick={() => setTermsOpen(false)}
                  aria-label={`Đóng điều khoản mã ${voucher.code}`}
                  className="px-2.5 py-1 rounded-lg bg-[#FFF5E4]/15 hover:bg-[#FFF5E4]/25 text-[#F3D27A] text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                >
                  <span>Đóng</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 space-y-3 text-[13.5px] text-[#171815]/90 leading-[1.6]">
                <div className="p-3 rounded-xl bg-[#FFF5E4] border border-[#951722]/20 space-y-1">
                  <span className="font-bold text-[#951722] block text-xs uppercase tracking-wider">
                    Tóm tắt ưu đãi ({voucher.valueText}):
                  </span>
                  <div className="text-[13.5px] leading-[1.55] text-[#171815] font-medium">
                    {voucher.applicableProductsText}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-[#1F3D2A] block">
                    1. Điều kiện áp dụng chương trình:
                  </span>
                  <ul className="list-disc pl-4 space-y-1.5">
                    {voucher.conditions.map((c, i) => (
                      <li key={i} className="leading-[1.6] text-left">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#951722]/15">
                  <span className="font-bold text-[#1F3D2A] block">
                    2. Quy định chi tiết & Lưu ý:
                  </span>
                  <ul className="list-disc pl-4 space-y-1.5">
                    {voucher.detailedTerms.map((t, i) => (
                      <li key={`t-${i}`} className="leading-[1.6] text-left">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
};
