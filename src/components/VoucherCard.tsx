import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Copy, Check, ChevronDown, Ticket, ArrowRight } from 'lucide-react';
import { Voucher } from '../data/vouchers';
import { formatPrice } from '../data/products';
import { useStore } from '../context/StoreContext';
import { BuyNowButton } from './BuyNowButton';
import { MicroConfetti, MOTION_TOKENS, useMotionPreferences } from '../motion';

interface VoucherCardProps {
  voucher: Voucher;
  compact?: boolean;
  highlighted?: boolean;
}

export const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  compact = false,
  highlighted = false,
}) => {
  const { copyVoucherCode, saveVoucherForLater, appliedVoucherCode } = useStore();
  const navigate = useNavigate();
  const { reducedMotion } = useMotionPreferences();
  const [copied, setCopied] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const isSaved = appliedVoucherCode === voucher.code;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyVoucherCode(voucher.code);
    setCopied(true);
    setConfettiTrigger(false);
    requestAnimationFrame(() => setConfettiTrigger(true));
    setTimeout(() => {
      setCopied(false);
      setConfettiTrigger(false);
    }, 2000);
  };

  const handleUseVoucher = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveVoucherForLater(voucher.code);
  };

  const handleBuyNowEligible = (e: React.MouseEvent) => {
    e.stopPropagation();
    saveVoucherForLater(voucher.code);
    if (voucher.targetFilterCategory === 'Combo 3 set') {
      navigate('/san-pham/combo-3-hop-qua');
    } else if (voucher.targetFilterCategory && voucher.targetFilterCategory !== 'Tất cả') {
      navigate('/san-pham?nhom=set-qua-bieu');
    } else {
      navigate('/san-pham');
    }
  };

  return (
    <article
      lang="vi"
      className={`bg-[#FFFBF2] border-2 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between relative transition-all duration-300 md:hover:-translate-y-1 hover:shadow-md ${
        highlighted
          ? 'border-[#951722] ring-4 ring-[#951722]/30 shadow-xl voucher-hash-pulse'
          : 'border-[#951722]/35'
      }`}
    >
      {/* Top Perforated Ticket Header – Clickable to /khuyen-mai#ma-voucher-<code> */}
      <div
        onClick={() => navigate(`/khuyen-mai#ma-voucher-${voucher.code}`)}
        className="bg-[#1F3D2A] text-[#FFF5E4] p-5 relative border-b-2 border-dashed border-[#FFF5E4]/30 cursor-pointer hover:bg-[#193323] transition-colors"
      >
        {/* Left & Right ticket punch cutouts */}
        <div
          aria-hidden="true"
          className="w-5 h-5 rounded-full bg-[#FFF5E4] border border-[#951722]/30 absolute -bottom-2.5 -left-2.5"
        />
        <div
          aria-hidden="true"
          className="w-5 h-5 rounded-full bg-[#FFF5E4] border border-[#951722]/30 absolute -bottom-2.5 -right-2.5"
        />

        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-block text-xs uppercase tracking-widest text-[#F3D27A] font-semibold mb-1">
              {voucher.countdownText}
            </span>
            <div className="font-price text-2xl md:text-3xl text-[#FFF5E4]">
              {voucher.valueText}
            </div>
            <h3 className="font-display !text-[20px] text-[#FFF5E4]/95 mt-1 leading-[1.3]">
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
                  <span>Đã sao chép ✓</span>
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

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5 text-sm text-[#171815]">
          <div className="flex justify-between gap-2 py-1 border-b border-[#951722]/10">
            <span className="text-[#171815]/70">Đơn tối thiểu:</span>
            <span className="font-semibold font-price">
              {voucher.minOrder > 0 ? formatPrice(voucher.minOrder) : '0đ (Không yêu cầu)'}
            </span>
          </div>
          <div className="flex justify-between gap-2 py-1 border-b border-[#951722]/10">
            <span className="text-[#171815]/70">Mức ưu đãi tối đa:</span>
            <span className="font-semibold font-price text-[#9B0514]">
              {formatPrice(voucher.maxDiscount)}
            </span>
          </div>
          <div className="py-1 border-b border-[#951722]/10">
            <span className="text-[#171815]/70 block mb-0.5">Sản phẩm áp dụng:</span>
            <p lang="vi" className="story-justify font-medium text-[#1F3D2A] leading-[1.7]">
              {voucher.applicableProductsText}
            </p>
          </div>
          <div className="flex justify-between gap-2 py-1 border-b border-[#951722]/10">
            <span className="text-[#171815]/70">Thời hạn ưu đãi:</span>
            <span className="font-medium">{voucher.expiryDisplay}</span>
          </div>

          {compact ? (
            <div className="pt-1">
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
              <div className="py-1 border-b border-[#951722]/10">
                <span className="text-[#171815]/70 block mb-0.5">Quy định cộng gộp:</span>
                <p lang="vi" className="story-justify font-medium leading-[1.7]">
                  {voucher.stackableText}
                </p>
              </div>
              <div className="py-1 border-b border-[#951722]/10">
                <span className="text-[#171815]/70 block mb-0.5">Giới hạn lượt dùng:</span>
                <p lang="vi" className="story-justify font-medium leading-[1.7]">
                  {voucher.usageLimit}
                </p>
              </div>

              {/* 3-step How to use */}
              <div className="bg-[#FFF5E4] p-3.5 rounded-xl border border-[#951722]/20">
                <span className="font-bold text-xs uppercase tracking-wider text-[#951722] mb-2 block">
                  Cách sử dụng (3 bước):
                </span>
                <ol className="space-y-1.5 text-xs text-[#171815]/90">
                  {voucher.howToUse.map((step, idx) => (
                    <li key={idx} className="story-justify leading-[1.7]" lang="vi">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Expandable detailed terms */}
              <div>
                <button
                  type="button"
                  onClick={() => setTermsOpen(!termsOpen)}
                  aria-expanded={termsOpen}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#1F3D2A] hover:text-[#951722] py-1.5 cursor-pointer"
                >
                  <span>Điều khoản chi tiết & Điều kiện áp dụng</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      termsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {termsOpen && (
                    <motion.div
                      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: MOTION_TOKENS.durations.fast }}
                      className="mt-2 p-3 bg-[#FFF5E4]/70 rounded-lg border border-[#1F3D2A]/20 text-xs space-y-1.5 text-[#171815]/85"
                    >
                      <span className="font-semibold text-[#171815] block">
                        Điều kiện chương trình:
                      </span>
                      <ul className="list-disc pl-4 space-y-1">
                        {voucher.conditions.map((c, i) => (
                          <li key={i} className="story-justify leading-[1.7]" lang="vi">
                            {c}
                          </li>
                        ))}
                        {voucher.detailedTerms.map((t, i) => (
                          <li key={`t-${i}`} className="story-justify leading-[1.7]" lang="vi">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Two Action Buttons */}
        <div className="pt-3 flex flex-wrap gap-2.5">
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
