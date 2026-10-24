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
    const defaultPid = voucher.defaultEligibleProductIds[0];
    if (defaultPid) {
      startBuyNow(defaultPid, voucher.defaultBuyNowQuantity, undefined, voucher.code);
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
      className={`group flex-1 w-full ${
        compact ? 'h-full min-h-[526px]' : 'h-[920px] min-h-[920px]'
      } bg-[#FFFBF2] border-2 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between relative transition-all duration-300 md:hover:-translate-y-1 hover:shadow-md ${
        highlighted
          ? 'border-[#951722] ring-4 ring-[#951722]/30 shadow-xl voucher-hash-pulse'
          : 'border-[#951722]/35 hover:border-[#951722]/65'
      }`}
    >
      {/* Top Perforated Ticket Header – Clickable to /khuyen-mai#ma-voucher-<code> */}
      <div
        onClick={() => navigate(`/khuyen-mai#ma-voucher-${voucher.code}`)}
        className="voucher-header-sheen bg-[#1F3D2A] text-[#FFF5E4] p-5 h-[156px] min-h-[156px] shrink-0 flex flex-col justify-center relative border-b-2 border-dashed border-[#FFF5E4]/30 cursor-pointer hover:bg-[#193323] transition-colors"
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
            <span className="inline-block text-xs uppercase tracking-widest text-[#F3D27A] font-semibold mb-1 line-clamp-1">
              {voucher.countdownText}
            </span>
            <div className="font-price text-2xl md:text-3xl text-[#FFF5E4] line-clamp-1">
              {voucher.valueText}
            </div>
            <h3 className="font-display !text-[19px] text-[#FFF5E4]/95 mt-1 leading-[1.3] line-clamp-2 min-h-[49px]">
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
              <MicroConfetti active={confettiTrigger} />
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Xong</span>
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

      {/* Body Details — relative container so Detailed Terms opens as an in-card overlay without resizing the card */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4 relative overflow-hidden">
        <div className="flex-1 flex flex-col justify-between space-y-2.5 text-sm text-[#171815]">
          <div className="flex items-center justify-between gap-2 py-1 min-h-[34px] shrink-0 border-b border-[#951722]/10">
            <span className="text-[#171815]/70">Đơn tối thiểu:</span>
            <span className="font-semibold font-price text-right">
              {voucher.minOrder > 0 ? formatPrice(voucher.minOrder) : '0đ (Không yêu cầu)'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 py-1 min-h-[34px] shrink-0 border-b border-[#951722]/10">
            <span className="text-[#171815]/70">Mức ưu đãi tối đa:</span>
            <span className="font-semibold font-price text-[#9B0514] text-right">
              {formatPrice(voucher.maxDiscount)}
            </span>
          </div>
          <div className="py-1 min-h-[76px] shrink-0 flex flex-col justify-center border-b border-[#951722]/10">
            <span className="text-[#171815]/70 block mb-0.5">Sản phẩm áp dụng:</span>
            <p
              lang="vi"
              className="story-justify font-medium text-[#1F3D2A] leading-[1.65] line-clamp-2 h-[46px] min-h-[46px]"
            >
              {voucher.applicableProductsText}
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 py-1 min-h-[34px] shrink-0 border-b border-[#951722]/10">
            <span className="text-[#171815]/70">Thời hạn ưu đãi:</span>
            <span className="font-medium text-right">{voucher.expiryDisplay}</span>
          </div>

          {compact ? (
            <div className="pt-1 mt-auto">
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
              <div className="py-1 min-h-[76px] shrink-0 flex flex-col justify-center border-b border-[#951722]/10">
                <span className="text-[#171815]/70 block mb-0.5">Quy định cộng gộp:</span>
                <p
                  lang="vi"
                  className="story-justify font-medium leading-[1.65] line-clamp-2 h-[46px] min-h-[46px]"
                >
                  {voucher.stackableText}
                </p>
              </div>
              <div className="py-1 min-h-[54px] shrink-0 flex flex-col justify-center border-b border-[#951722]/10">
                <span className="text-[#171815]/70 block mb-0.5">Giới hạn lượt dùng:</span>
                <p
                  lang="vi"
                  className="story-justify font-medium leading-[1.65] line-clamp-1 h-[24px] min-h-[24px]"
                >
                  {voucher.usageLimit}
                </p>
              </div>

              {/* 3-step How to use — flex-1 so sibling cards align at the bottom */}
              <div className="flex-1 flex flex-col justify-between bg-[#FFF5E4] p-3.5 rounded-xl border border-[#951722]/20 min-h-[188px]">
                <span className="font-bold text-xs uppercase tracking-wider text-[#951722] mb-1.5 block">
                  Cách sử dụng (3 bước):
                </span>
                <ol className="space-y-1.5 text-xs text-[#171815]/90 my-auto">
                  {voucher.howToUse.map((step, idx) => (
                    <li
                      key={idx}
                      className="story-justify leading-[1.6] line-clamp-2"
                      lang="vi"
                    >
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Trigger button to open in-card Detailed Terms overlay */}
              <div className="shrink-0">
                <button
                  type="button"
                  data-testid={`voucher-terms-btn-${voucher.code}`}
                  onClick={() => setTermsOpen((prev) => !prev)}
                  aria-expanded={termsOpen}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#1F3D2A] hover:text-[#951722] py-2 px-3 rounded-xl bg-[#FFF5E4]/80 hover:bg-[#FFF5E4] border border-[#1F3D2A]/20 transition-colors cursor-pointer"
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
              className="absolute inset-x-4 top-3 bottom-[78px] z-20 rounded-2xl bg-[#FFFBF2] border-2 border-[#1F3D2A] shadow-xl flex flex-col overflow-hidden"
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

              <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs text-[#171815]/90">
                <div className="p-3 rounded-xl bg-[#FFF5E4] border border-[#951722]/20 space-y-1">
                  <span className="font-bold text-[#951722] block">
                    Tóm tắt ưu đãi ({voucher.valueText}):
                  </span>
                  <p lang="vi" className="leading-[1.6] text-[#171815]/85">
                    {voucher.applicableProductsText}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-[#1F3D2A] block">
                    1. Điều kiện áp dụng chương trình:
                  </span>
                  <ul className="list-disc pl-4 space-y-1.5">
                    {voucher.conditions.map((c, i) => (
                      <li key={i} className="story-justify leading-[1.65]" lang="vi">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-[#951722]/15">
                  <span className="font-bold text-[#1F3D2A] block">
                    2. Quy định chi tiết & Lưu ý:
                  </span>
                  <ul className="list-disc pl-4 space-y-1.5">
                    {voucher.detailedTerms.map((t, i) => (
                      <li key={`t-${i}`} className="story-justify leading-[1.65]" lang="vi">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Two Action Buttons */}
        <div className="pt-2 shrink-0 flex flex-wrap gap-2.5 relative z-10">
          <button
            type="button"
            onClick={handleUseVoucher}
            className={`btn-sheen flex-1 min-w-[160px] min-h-[52px] px-6 py-2.5 rounded-xl font-bold text-[17px] leading-[1.3] transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer active:scale-[0.98] ${
              isSaved
                ? 'bg-[#1F3D2A] text-[#FFF5E4] border-2 border-[#1F3D2A]'
                : 'border-2 border-[#1F3D2A] text-[#1F3D2A] hover:bg-[#1F3D2A] hover:text-[#FFF5E4]'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-5 h-5 shrink-0" />
                <span>Đã lưu mã</span>
              </>
            ) : (
              <span>Dùng mã này</span>
            )}
          </button>
          <BuyNowButton onClick={handleBuyNowEligible} className="flex-1" />
        </div>
      </div>
    </article>
  );
};
