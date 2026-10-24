import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CHECKOUT_STEPS } from '../constants/ui';
import { MOTION_TOKENS } from '../motion';

export interface CheckoutStepperProps {
  /**
   * 1 = Giỏ hàng (/gio-hang)
   * 2 = Thông tin giao hàng (/thanh-toan - bước 2)
   * 3 = Thanh toán (/thanh-toan - bước 3)
   * 4 | 'completed' = Kết quả: Đặt hàng thành công (/dat-hang-thanh-cong)
   * 'failed' = Kết quả: Thanh toán chưa hoàn tất (/thanh-toan-that-bai)
   */
  currentStep: 1 | 2 | 3 | 4 | 'completed' | 'failed';
  onSelectStep?: (step: 2 | 3) => void;
  className?: string;
}

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
  currentStep,
  onSelectStep,
  className = '',
}) => {
  const isCompletedAll = currentStep === 'completed' || currentStep === 4;
  const isFailed = currentStep === 'failed';

  const progressRatio =
    isCompletedAll || isFailed
      ? 1
      : currentStep === 1
      ? 0.25
      : currentStep === 2
      ? 0.5
      : currentStep === 3
      ? 0.75
      : 1;

  return (
    <div
      data-testid="checkout-stepper"
      className={`bg-[#FFFBF2] border border-[#951722]/25 rounded-2xl p-4 md:p-5 mb-8 space-y-2.5 ${className}`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-4 text-center">
        {CHECKOUT_STEPS.map((label, idx) => {
          const stepNum = idx + 1;
          const isStepCompleted =
            isCompletedAll ||
            (isFailed && stepNum < 4) ||
            (typeof currentStep === 'number' && stepNum < currentStep);
          const isStepActive =
            (isFailed && stepNum === 4) ||
            (isCompletedAll && stepNum === 4) ||
            (typeof currentStep === 'number' && stepNum === currentStep);

          const badgeClass =
            isCompletedAll && stepNum === 4
              ? 'bg-[#1F3D2A] text-[#F3D27A] ring-4 ring-[#1F3D2A]/20'
              : isStepCompleted
              ? 'bg-[#1F3D2A] text-[#FFF5E4]'
              : isFailed && stepNum === 4
              ? 'bg-[#9B0514] text-[#FFF5E4] ring-4 ring-[#9B0514]/20'
              : isStepActive
              ? 'bg-[#951722] text-[#FFF5E4] ring-4 ring-[#951722]/15'
              : 'bg-[#171815]/15 text-[#171815]/70';

          const textClass =
            isCompletedAll && stepNum === 4
              ? 'text-[#1F3D2A] font-bold'
              : isStepCompleted
              ? 'text-[#1F3D2A] font-semibold'
              : isFailed && stepNum === 4
              ? 'text-[#9B0514] font-bold'
              : isStepActive
              ? 'text-[#951722] font-bold'
              : 'text-[#171815]/55';

          const content = (
            <>
              <span
                className={`w-7 h-7 rounded-full font-price text-sm flex items-center justify-center shrink-0 transition-colors ${badgeClass}`}
              >
                {isStepCompleted ? '✓' : isFailed && stepNum === 4 ? '!' : stepNum}
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

          if (stepNum === 2 && currentStep === 3 && onSelectStep) {
            return (
              <button
                key={label}
                type="button"
                onClick={() => onSelectStep(2)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 hover:underline cursor-pointer ${textClass}`}
              >
                {content}
              </button>
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

      {/* Animated Progress Bar */}
      <div className="h-1.5 w-full rounded-full bg-[#F5E6CC] overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progressRatio }}
          transition={{
            duration: MOTION_TOKENS.durations.normal,
            ease: MOTION_TOKENS.easings.standard,
          }}
          className={`h-full w-full origin-left rounded-full ${
            isFailed ? 'bg-[#9B0514]' : isCompletedAll ? 'bg-[#1F3D2A]' : 'bg-[#951722]'
          }`}
        />
      </div>
    </div>
  );
};
