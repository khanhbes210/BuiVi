import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';

export interface HeritageDropdownOption {
  value: string;
  label: string;
  subtitle?: string;
}

export const PROVINCE_OPTIONS: HeritageDropdownOption[] = [
  { value: 'Hà Nội', label: 'Hà Nội', subtitle: 'Nội & ngoại thành Hà Nội' },
  { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh', subtitle: 'Giao nhanh 1–2 ngày' },
  { value: 'Hải Phòng', label: 'Hải Phòng', subtitle: 'Tuyến duyên hải Bắc Bộ' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng', subtitle: 'Trung tâm miền Trung' },
  { value: 'Cần Thơ', label: 'Cần Thơ', subtitle: 'Trung tâm Tây Nam Bộ' },
  { value: 'Bắc Ninh', label: 'Bắc Ninh', subtitle: 'Vùng lân cận Hà Nội' },
  { value: 'Hưng Yên', label: 'Hưng Yên', subtitle: 'Vùng lân cận Hà Nội' },
  { value: 'Quảng Ninh', label: 'Quảng Ninh', subtitle: 'Tuyến Đông Bắc Bộ' },
  { value: 'Thanh Hóa', label: 'Thanh Hóa', subtitle: 'Bắc Trung Bộ' },
  { value: 'Nghệ An', label: 'Nghệ An', subtitle: 'Bắc Trung Bộ' },
  { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế', subtitle: 'Duyên hải miền Trung' },
  { value: 'Khánh Hòa', label: 'Khánh Hòa', subtitle: 'Nam Trung Bộ' },
  { value: 'Lâm Đồng', label: 'Lâm Đồng', subtitle: 'Tây Nguyên' },
  { value: 'Bình Dương', label: 'Bình Dương', subtitle: 'Đông Nam Bộ' },
  { value: 'Đồng Nai', label: 'Đồng Nai', subtitle: 'Đông Nam Bộ' },
  { value: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu', subtitle: 'Đông Nam Bộ' },
  { value: 'Tỉnh / Thành phố khác', label: 'Tỉnh / Thành phố khác', subtitle: 'Giao hàng toàn quốc (2–4 ngày)' },
];

interface HeritageDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: HeritageDropdownOption[];
  placeholder?: string;
  headerTitle?: string;
  headerBadge?: string;
  triggerTestId?: string;
  listboxTestId?: string;
  optionTestIdPrefix?: string;
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const HeritageDropdown: React.FC<HeritageDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Chọn mục...',
  headerTitle = 'Danh sách lựa chọn',
  headerBadge,
  triggerTestId,
  listboxTestId,
  optionTestIdPrefix = 'heritage-dropdown-option',
  size = 'md',
  className = '',
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : value || placeholder;

  const isCompact = size === 'sm';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        data-testid={triggerTestId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2.5 rounded-xl border text-left transition-all duration-200 focus:outline-none ${
          isCompact
            ? 'h-[48px] px-3.5 text-[15px]'
            : 'h-[54px] px-4 text-[16px] sm:text-[17px]'
        } ${
          isOpen
            ? 'bg-[#FFFBF2] border-[#951722] ring-2 ring-[#951722]/15 shadow-md'
            : 'bg-[#FFF5E4] border-[#1F3D2A]/20 hover:border-[#951722]/50 hover:bg-[#FFFBF2]'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {icon ? (
            <span className="shrink-0 text-[#951722]">{icon}</span>
          ) : (
            <span className="w-2 h-2 rounded-full bg-[#951722] shrink-0" />
          )}
          <span
            className={`truncate font-semibold ${
              selectedOption || value ? 'text-[#171815]' : 'text-[#5E5A52]'
            }`}
          >
            {displayLabel}
          </span>
        </div>
        <span
          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
            isOpen
              ? 'bg-[#951722] text-[#FFFBF2] rotate-180'
              : 'bg-[#1F3D2A]/10 text-[#1F3D2A]'
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="listbox"
            data-testid={listboxTestId}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-[#FFFBF2] border-2 border-[#1F3D2A]/20 rounded-2xl shadow-[0_18px_40px_rgba(23,24,21,0.18)] overflow-hidden min-w-[240px]"
          >
            <div className="px-4 py-2.5 bg-[#1F3D2A] text-[#FFFBF2] flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#F3D27A]">
                {headerTitle}
              </span>
              <span className="text-[11px] text-[#FFFBF2]/75 font-medium">
                {headerBadge || `${options.length} lựa chọn`}
              </span>
            </div>
            <div className="p-1.5 max-h-[280px] overflow-y-auto divide-y divide-[#1F3D2A]/8">
              {options.map((item, idx) => {
                const isSelected = value === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-testid={`${optionTestIdPrefix}-${idx}`}
                    onClick={() => {
                      onChange(item.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between gap-3 transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#951722]/10 text-[#951722]'
                        : 'text-[#171815] hover:bg-[#FFF5E4]'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[15px] leading-[1.35] truncate ${
                          isSelected ? 'font-bold text-[#951722]' : 'font-semibold text-[#171815]'
                        }`}
                      >
                        {item.label}
                      </p>
                      {item.subtitle && (
                        <p className="text-[12.5px] text-[#5E5A52] truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'bg-[#1F3D2A] text-[#F3D27A] scale-100'
                          : 'border border-[#1F3D2A]/20 text-transparent scale-95'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
