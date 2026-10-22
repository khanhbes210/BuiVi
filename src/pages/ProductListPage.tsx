import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Search, X, Ticket, ArrowRight } from 'lucide-react';
import { PRODUCTS, removeVietnameseTones } from '../data/products';
import { VOUCHERS } from '../data/vouchers';
import { ProductCard } from '../components/ProductCard';
import { FeaturedProductsBlock } from '../components/FeaturedProductsBlock';
import {
  AnimationSlot,
  Reveal,
  Stagger,
  MOTION_TOKENS,
  useMotionPreferences,
} from '../motion';

type TabGroup = 'san-pham' | 'set-qua-bieu';

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { reducedMotion } = useMotionPreferences();

  // Derive active tab from ?nhom=san-pham | ?nhom=set-qua-bieu (or fallback from legacy ?danh-muc)
  const activeTab: TabGroup = useMemo(() => {
    const nhom = searchParams.get('nhom');
    if (nhom === 'set-qua-bieu') return 'set-qua-bieu';
    if (nhom === 'san-pham') return 'san-pham';
    const legacyCat = searchParams.get('danh-muc') || '';
    if (
      legacyCat.includes('Set') ||
      legacyCat.includes('Combo') ||
      legacyCat.includes('quà')
    ) {
      return 'set-qua-bieu';
    }
    return 'san-pham';
  }, [searchParams]);

  const [rawQuery, setRawQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce instant search by 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(rawQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [rawQuery]);

  useEffect(() => {
    document.title =
      activeTab === 'set-qua-bieu'
        ? 'Set Quà Biếu Bùi Vị – Bộ Sưu Tập Di Sản Nem Kinh Bắc | BÙI VỊ'
        : 'Bộ Sưu Tập Di Sản Nem Kinh Bắc – Sản Phẩm | BÙI VỊ';
  }, [activeTab]);

  const handleSwitchTab = (tab: TabGroup) => {
    setSearchParams({ nhom: tab });
  };

  // 3 voucher chips read from VOUCHERS in vouchers.ts (P1-4)
  const promoChips = useMemo(() => {
    const buivi10 = VOUCHERS.find((v) => v.code === 'BUIVI10') || VOUCHERS[0];
    const freeship = VOUCHERS.find((v) => v.code === 'FREESHIP') || VOUCHERS[1];
    const combo3 = VOUCHERS.find((v) => v.code === 'COMBO3') || VOUCHERS[4];
    return [
      { code: buivi10.code, label: `${buivi10.code} · ${buivi10.valueText}` },
      { code: freeship.code, label: `${freeship.code} · Miễn phí vận chuyển` },
      { code: combo3.code, label: `${combo3.code} · Giảm thêm 50.000đ` },
    ];
  }, []);

  // Filter products by currently selected tab
  const tabProducts = useMemo(() => {
    if (activeTab === 'san-pham') {
      // 3 single products: Nem chua (85.000đ) < Nem bùi (95.000đ) < Nem ngựa (110.000đ)
      return PRODUCTS.filter((p) => !p.isGiftSet).sort((a, b) => a.price - b.price);
    }
    // 4 gift sets: Vinh Hoa - Phú Quý, Bình An - Sung Túc, Độc Bản, Combo 3 hộp quà
    return PRODUCTS.filter((p) => p.isGiftSet);
  }, [activeTab]);

  // Accent-insensitive search within currently selected tab (searches name, shortDesc, category)
  const filteredProducts = useMemo(() => {
    const q = removeVietnameseTones(debouncedQuery.trim());
    if (!q) return tabProducts;
    return tabProducts.filter((product) => {
      const nameNorm = removeVietnameseTones(product.name);
      const descNorm = removeVietnameseTones(product.shortDesc);
      const catNorm = removeVietnameseTones(product.category);
      return nameNorm.includes(q) || descNorm.includes(q) || catNorm.includes(q);
    });
  }, [tabProducts, debouncedQuery]);

  // 3 suggested products for empty state
  const suggestedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.isBestSeller).slice(0, 3);
  }, []);

  return (
    <div>
      <div className="py-8 md:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* 1) H1 Title (Yeseva One): "Bộ sưu tập di sản nem Kinh Bắc" */}
        <Reveal>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#951722] leading-tight">
            Bộ sưu tập di sản nem Kinh Bắc
          </h1>
        </Reveal>

        {/* 2) Category Switch (large pill tabs, min height 48px, active tab in heritage red with shared layoutId): "Sản phẩm" | "Set quà biếu Bùi Vị" */}
        <div
          role="tablist"
          aria-label="Phân nhóm sản phẩm"
          className="flex flex-wrap sm:inline-flex items-center gap-1.5 sm:gap-2.5 bg-[#FFFBF2] p-1.5 rounded-3xl sm:rounded-full border-2 border-[#951722]/25 w-full sm:w-auto"
        >
          {(
            [
              { id: 'san-pham', label: 'Sản phẩm' },
              { id: 'set-qua-bieu', label: 'Set quà biếu Bùi Vị' },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSwitchTab(tab.id)}
                className={`relative flex-1 sm:flex-initial min-h-[48px] px-4 sm:px-8 py-2.5 rounded-full font-display text-[16px] sm:text-[18px] transition-colors cursor-pointer whitespace-nowrap text-center ${
                  isActive
                    ? 'text-[#FFF5E4]'
                    : 'text-[#171815] hover:text-[#951722] hover:bg-[#951722]/10'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="product-tab-pill"
                    transition={{
                      duration: reducedMotion ? 0.1 : 0.28,
                      ease: MOTION_TOKENS.easings.standard,
                    }}
                    className="absolute inset-0 rounded-full bg-[#951722] shadow-sm"
                  />
                )}
                <span className="relative z-10 font-display">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3) Compact Row of 3 Voucher Chips from vouchers.ts + "Xem tất cả ưu đãi" link (P1-4) */}
        <div className="w-full bg-[#1F3D2A] text-[#FFF5E4] px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2.5 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Ticket className="w-4 h-4 text-[#F3D27A] shrink-0 hidden sm:inline" />
            {promoChips.map((chip) => (
              <Link
                key={chip.code}
                to={`/khuyen-mai#ma-voucher-${chip.code}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FFF5E4]/10 hover:bg-[#FFF5E4]/20 border border-[#F3D27A]/40 text-xs sm:text-sm text-[#FFF5E4] transition-colors whitespace-nowrap"
              >
                <span className="font-display text-[#F3D27A]">{chip.code}</span>
                <span aria-hidden="true" className="text-[#FFF5E4]/50">
                  ·
                </span>
                <span>{chip.label.split(' · ')[1]}</span>
              </Link>
            ))}
          </div>
          <Link
            to="/khuyen-mai"
            className="inline-flex items-center gap-1 text-xs sm:text-sm text-[#F3D27A] hover:underline whitespace-nowrap shrink-0 ml-auto"
          >
            <span>Xem tất cả ưu đãi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4) Search Bar (height 52px, search icon, clear "x" button scales in, instant debounced accent-insensitive search) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#951722] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              placeholder="Tìm sản phẩm: nem chua, nem bùi, set quà…"
              aria-label="Tìm sản phẩm: nem chua, nem bùi, set quà…"
              className="w-full h-[52px] pl-12 pr-11 rounded-2xl bg-[#FFFBF2] border-2 border-[#951722]/30 text-base font-medium text-[#171815] placeholder:text-[#171815]/50 focus:outline-none focus:ring-2 focus:ring-[#951722] focus:border-[#951722] transition-shadow"
            />
            <AnimatePresence>
              {rawQuery && (
                <motion.button
                  key="clear-search-btn"
                  type="button"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                  onClick={() => {
                    setRawQuery('');
                    setDebouncedQuery('');
                  }}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="w-8 h-8 rounded-full hover:bg-[#951722]/15 text-[#171815]/70 hover:text-[#951722] absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div
            aria-live="polite"
            className="text-sm font-bold text-[#1F3D2A] whitespace-nowrap shrink-0 px-1"
          >
            Tìm thấy {filteredProducts.length} sản phẩm
          </div>
        </div>

        {/* 5) Product Grid Immediately (or Empty State with search-empty AnimationSlot, "Xóa tìm kiếm" and 3 suggested products) */}
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div
              key="empty-search"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.26, ease: MOTION_TOKENS.easings.standard }}
              className="bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-3xl p-8 text-center space-y-6"
            >
              <div className="max-w-md mx-auto space-y-3">
                <AnimationSlot id="search-empty" className="max-w-[220px] mx-auto" />
                <h2 className="font-display text-2xl text-[#171815]">
                  Không tìm thấy sản phẩm phù hợp
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setRawQuery('');
                    setDebouncedQuery('');
                  }}
                  className="btn-sheen min-h-[46px] px-6 py-2.5 rounded-xl bg-[#951722] hover:bg-[#9B0514] text-[#FFF5E4] font-bold text-sm cursor-pointer transition-colors"
                >
                  Xóa tìm kiếm
                </button>
              </div>

              <div className="pt-4 border-t border-[#951722]/15 text-left space-y-4">
                <h3 className="font-display text-xl text-[#951722]">
                  Gợi ý 3 sản phẩm bán chạy của Bùi Vị
                </h3>
                <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {suggestedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </Stagger>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeTab}-${debouncedQuery}`}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.26, ease: MOTION_TOKENS.easings.standard }}
            >
              <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Stagger>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Featured Products Block */}
      <FeaturedProductsBlock
        title="Gợi Ý Kết Hợp Quà Biếu & Đặc Sản Kinh Bắc"
        subtitle="Mua từ 2 Set quà bất kỳ tặng ngay 01 hộp Nem chua (mã TANGHOP) · Miễn phí vận chuyển đơn từ 500.000đ"
      />
    </div>
  );
};
