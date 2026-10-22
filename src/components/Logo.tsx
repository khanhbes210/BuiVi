import React from 'react';

interface LogoProps {
  variant?: 'main' | 'positive' | 'negative';
  className?: string;
  showTextBeside?: boolean;
  imgClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'main',
  className = '',
  imgClassName = 'h-14 lg:h-16 w-auto',
}) => {
  const srcMap: Record<'main' | 'positive' | 'negative', string> = {
    main: '/logo-main',
    positive: '/logo-positive',
    negative: '/logo-negative',
  };

  return (
    <div
      className={`inline-flex items-center select-none shrink-0 ${className}`}
      data-logo-variant={variant}
    >
      <img
        src={srcMap[variant]}
        alt={`Logo thương hiệu BÙI VỊ (${variant})`}
        className={`${imgClassName} min-h-[56px] object-contain shrink-0 rounded-lg`}
      />
    </div>
  );
};
