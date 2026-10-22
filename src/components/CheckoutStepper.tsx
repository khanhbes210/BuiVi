import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CHECKOUT_STEPS } from '../constants/ui';
import { MOTION_TOKENS } from '../motion';

export interface CheckoutStepperProps {
  /**
   * 1 = Giỏ hàng (/gio-hang)
   * 2 = Thông tin giao hàng & Thanh toán (/thanh-toan)
   * 'completed' = Đặt hàng thành công (/dat-hang-thanh-cong)
   * 'failed' = Thanh toán chưa hoàn tất (/thanh-toan-that-bai)
   */
  currentStep: 1 | 2 | 3 | 'completed' | 'failed';
  className?: string;
}

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
  currentStep,
  className = '',
}) => {
  const isCompletedAll = currentStep === 'completed';
  const isFailed = currentStep === 'failed';

  const progressRatio =
    isCompletedAll || isFailed
      ? 1
      : currentStep === 1
      ? 0.33
      : currentStep === 2
      ? 0.85
      : 1;

  return (
    <div
      data-testid="checkout-stepper"
      className={`bg-[#FFFBF2] border border-[#951722]/25 rounded-2xl p-4 md:p-5 mb-8 space-y-2.5 ${className}`}
    >
      <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
        {CHECKOUT_STEPS.map((label, idx) => {
          const stepNum = idx + 1;
          const isStepCompleted =
            isCompletedAll ||
            (isFailed && stepNum < 3) ||
            (typeof currentStep === 'number' && stepNum < currentStep);
          const isStepActive =
            (isFailed && stepNum === 3) ||
            (typeof currentStep === 'number' &&
              (stepNum === currentStep || (currentStep === 2 && stepNum === 3)));

          const badgeClass = isStepCompleted
            ? 'bg-[#1F3D2A] text-[#FFF5E4]'
            : isFailed && stepNum === 3
            ? 'bg-[#9B0514] text-[#FFF5E4] ring-4 ring-[#9B0514]/20'
            : isStepActive
            ? 'bg-[#951722] text-[#FFF5E4] ring-4 ring-[#951722]/15'
            : 'bg-[#171815]/15 text-[#171815]/70';

          const textClass = isStepCompleted
            ? 'text-[#1F3D2A]'
            : isFailed && stepNum === 3
            ? 'text-[#9B0514]'
            : isStepActive
            ? 'text-[#951722]'
            : 'text-[#171815]/55';

          const content = (
            <>
              <span
                className={`w-7 h-7 rounded-full font-price text-sm flex items-center justify-center shrink-0 transition-colors ${badgeClass}`}
              >
                {isStepCompleted ? '✓' : stepNum}
              </span>
              <span className="text-xs sm:text-sm whitespace-nowrap">{label}</span>
            </>
          );

          if (stepNum === 1 && currentStep !== 1) {
            return (
              <Link
                key={label}
                to="/gio-hang"
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 hover:underline ${textClass}`}
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={label}
              className={`flex flex-col sm:flex-row items-center justify-center gap-2 ${textClass}`}
            >
              {content}
            </div>
          );
        })}
      </div>

      <div className="h-1 w-full bg-[#F5E6CC] rounded-full overflow-hidden">
        <motion.div
          initial={{ scaleX: 0.33 }}
          animate={{ scaleX: progressRatio }}
          transition={{ duration: 0.45, ease: MOTION_TOKENS.easings.standard }}
          className={`h-full w-full origin-left ${
            isCompletedAll
              ? 'bg-[#1F3D2A]'
              : isFailed
              ? 'bg-[#9B0514]'
              : 'bg-[#951722]'
          }`}
        />
      </div>
    </div>
  );
};
