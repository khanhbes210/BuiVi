import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { ADD_TO_CART } from '../constants/ui';
import { Product } from '../data/products';
import { useStore } from '../context/StoreContext';

export interface AddToCartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  product?: Product;
  quantity?: number;
  packOption?: string;
  size?: 'sm' | 'md' | 'lg';
  onDone?: () => void;
  label?: string;
  showIcon?: boolean;
  variant?: 'outline' | 'solid';
  fullWidth?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  packOption,
  size = 'md',
  onDone,
  label = ADD_TO_CART,
  showIcon = true,
  variant = 'solid',
  fullWidth = false,
  className = '',
  style,
  onClick,
  ...props
}) => {
  const { addToCart, triggerFlyToCart } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const sizeClasses =
    size === 'lg'
      ? 'min-w-[160px] min-h-[56px] px-6 py-3 text-[17px]'
      : size === 'sm'
      ? 'min-w-[135px] min-h-[52px] px-4 py-2.5 text-[16px]'
      : 'min-w-[160px] min-h-[52px] px-6 py-2.5 text-[16px] sm:text-[17px]';

  const baseClasses = `${sizeClasses} group/cta btn-sheen rounded-xl font-body font-medium leading-normal tracking-[0.2px] normal-case whitespace-nowrap overflow-hidden inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shrink-0 hover:-translate-y-0.5 active:scale-[0.98]`;

  const variantClasses =
    variant === 'outline'
      ? 'border-2 border-[#1F3D2A] text-[#1F3D2A] bg-transparent hover:bg-[#1F3D2A] hover:text-[#FFF5E4]'
      : 'bg-[#1F3D2A] hover:bg-[#173020] text-[#FFF5E4] border-2 border-[#1F3D2A] shadow-xs';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 600);

    if (product) {
      triggerFlyToCart(product, e.currentTarget);
    }

    if (onClick) {
      onClick(e);
    } else if (product) {
      e.preventDefault();
      e.stopPropagation();
      addToCart(product.id, quantity, packOption || product.packOptions[0] || product.packSpec);
    }
    if (onDone) onDone();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={style}
      className={`${baseClasses} ${variantClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {showIcon &&
        (justAdded ? (
          <Check
            className={`w-5 h-5 shrink-0 transition-transform duration-200 scale-110 ${
              variant === 'outline' ? '' : 'text-[#F3D27A]'
            }`}
          />
        ) : (
          <ShoppingBag
            className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover/cta:-rotate-6 ${
              variant === 'outline' ? '' : 'text-[#F3D27A]'
            }`}
          />
        ))}
      <span>{label}</span>
    </button>
  );
};
