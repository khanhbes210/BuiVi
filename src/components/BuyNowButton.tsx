import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BUY_NOW } from '../constants/ui';
import { Product } from '../data/products';
import { useStore } from '../context/StoreContext';

export interface BuyNowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  product?: Product;
  quantity?: number;
  packOption?: string;
  size?: 'sm' | 'md' | 'lg';
  onDone?: () => void;
  label?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}

export const BuyNowButton: React.FC<BuyNowButtonProps> = ({
  product,
  quantity = 1,
  packOption,
  size = 'md',
  onDone,
  label = BUY_NOW,
  showIcon = true,
  fullWidth = false,
  className = '',
  style,
  onClick,
  ...props
}) => {
  const { startBuyNow } = useStore();
  const navigate = useNavigate();

  const sizeClasses =
    size === 'lg'
      ? 'min-w-[160px] min-h-[56px] px-6 py-3 text-[17px]'
      : size === 'sm'
      ? 'min-w-[135px] min-h-[52px] px-4 py-2.5 text-[16px]'
      : 'min-w-[160px] min-h-[52px] px-6 py-2.5 text-[16px] sm:text-[17px]';

  const baseClasses = `${sizeClasses} group/cta btn-sheen btn-breathe rounded-xl bg-[#951722] hover:bg-[#7C121C] text-[#FFF5E4] font-body font-medium leading-normal tracking-[0.2px] normal-case whitespace-nowrap overflow-hidden shadow-xs hover:shadow-md inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shrink-0 hover:-translate-y-0.5 active:scale-[0.98]`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    } else if (product) {
      e.preventDefault();
      e.stopPropagation();
      startBuyNow(product.id, quantity, packOption || product.packOptions[0] || product.packSpec);
      navigate('/thanh-toan?mode=buynow');
    }
    if (onDone) onDone();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={style}
      className={`${baseClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      <span>{label}</span>
      {showIcon && (
        <ArrowRight className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover/cta:translate-x-1" />
      )}
    </button>
  );
};
