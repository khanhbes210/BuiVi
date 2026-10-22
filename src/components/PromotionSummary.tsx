import React from 'react';
import { PromotionCalculationResult } from '../utils/promotionEngine';
import { VoucherBox } from './VoucherBox';

interface PromotionSummaryProps {
  promotion: PromotionCalculationResult;
  primaryCtaLabel?: string;
  onPrimaryCtaClick?: () => void;
  showVoucherList?: boolean;
}

export const PromotionSummary: React.FC<PromotionSummaryProps> = ({
  promotion,
  primaryCtaLabel,
  onPrimaryCtaClick,
}) => {
  return (
    <div className="bg-[#FFFBF2] border-2 border-[#951722]/30 rounded-2xl p-5 md:p-6 space-y-5">
      <VoucherBox promotion={promotion} showPriceBreakdown />

      {primaryCtaLabel && onPrimaryCtaClick && (
        <button
          type="button"
          onClick={onPrimaryCtaClick}
          disabled={promotion.lines.filter((l) => l.selected).length === 0}
          className="font-body w-full min-h-[56px] px-6 py-3.5 rounded-xl bg-[#951722] hover:bg-[#9B0514] disabled:bg-[#171815]/30 text-[#FFF5E4] text-[17px] leading-normal tracking-[0.2px] whitespace-nowrap shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{primaryCtaLabel}</span>
        </button>
      )}
    </div>
  );
};
