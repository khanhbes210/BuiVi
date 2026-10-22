import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { PRODUCTS, removeVietnameseTones } from '../data/products';
import { ARTICLES } from '../data/articles';
import { ProductCard } from '../components/ProductCard';
import { FeaturedProductsBlock } from '../components/FeaturedProductsBlock';
import { AnimationSlot, Reveal, Stagger } from '../motion';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    document.title = query
      ? `Tìm kiếm "${query}" | BÙI VỊ`
      : 'Tìm Kiếm Sản Phẩm & Bài Viết | BÙI VỊ';
  }, [query]);

  const handleInputChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const q = removeVietnameseTones(query);
  const matchedProducts = q
    ? PRODUCTS.filter(
        (p) =>
          removeVietnameseTones(p.name).includes(q) ||
          removeVietnameseTones(p.category).includes(q) ||
          removeVietnameseTones(p.shortDesc).includes(q) ||
          p.tags.some((t) => removeVietnameseTones(t).includes(q))
      )
    : PRODUCTS;

  const matchedArticles = q
    ? ARTICLES.filter(
        (a) =>
          removeVietnameseTones(a.title).includes(q) ||
          removeVietnameseTones(a.excerpt).includes(q) ||
          removeVietnameseTones(a.category).includes(q)
      )
    : [];

  return (
    <div>
      <div className="py-8 md:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Search Box */}
        <Reveal>
          <div className="bg-[#FFFBF2] double-border-heritage rounded-3xl p-6 md:p-8 space-y-4">
            <h1 className="font-display text-3xl md:text-4xl text-[#951722]">
              Tìm Kiếm Đặc Sản & Hộp Quà Di Sản
            </h1>
            <div className="relative">
              <Search className="w-6 h-6 text-[#951722] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Nhập tên sản phẩm (VD: Nem bùi, Nem ngựa, Vinh Hoa, Độc Bản, Combo...)"
                aria-label="Từ khóa tìm kiếm"
                className="w-full min-h-[56px] pl-12 pr-4 py-3 rounded-2xl bg-[#FFF5E4] border-2 border-[#951722]/35 text-base font-medium text-[#171815] focus:outline-none focus:ring-2 focus:ring-[#951722]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-[#1F3D2A]">Từ khóa phổ biến:</span>
              {['Nem bùi', 'Set Vinh Hoa', 'Set Độc Bản', 'Combo 3 set', 'Nem ngựa'].map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleInputChange(kw)}
                  className="px-3 py-1 rounded-lg bg-[#FFF5E4] border border-[#951722]/25 hover:border-[#951722] font-semibold text-[#171815] cursor-pointer transition-colors"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Instant Results or Empty State with search-empty AnimationSlot + Suggested Products */}
        {q && matchedProducts.length === 0 && matchedArticles.length === 0 ? (
          <div className="bg-[#FFFBF2] border-2 border-[#951722]/25 rounded-3xl p-8 text-center space-y-6">
            <div className="max-w-xl mx-auto space-y-3">
              {/* Animation Slot #9: search-empty */}
              <AnimationSlot id="search-empty" className="max-w-[240px] mx-auto" />
              <h2 className="font-display text-2xl text-[#171815]">
                Không tìm thấy kết quả trùng khớp với “{query}”
              </h2>
              <p className="text-sm text-[#171815]/75">
                Gợi ý sản phẩm bán chạy, khuyến mãi đặc sắc của Bùi Vị dành cho quý khách:
              </p>
            </div>
            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-4">
              {PRODUCTS.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Stagger>
          </div>
        ) : (
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl text-[#1F3D2A] mb-6">
                {q
                  ? `Sản Phẩm Phù Hợp (${matchedProducts.length})`
                  : 'Gợi Ý Sản Phẩm Bán Chạy & Khuyến Mãi'}
              </h2>
              <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {matchedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </Stagger>
            </div>

            {matchedArticles.length > 0 && (
              <div>
                <h2 className="font-display text-2xl text-[#1F3D2A] mb-4">
                  Bài Viết Phù Hợp ({matchedArticles.length})
                </h2>
                <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedArticles.map((art) => (
                    <Link
                      key={art.id}
                      to={`/bai-viet/${art.slug}`}
                      className="p-5 rounded-2xl bg-[#FFFBF2] border border-[#951722]/25 hover:border-[#951722] flex items-center justify-between gap-4 transition-colors"
                    >
                      <div>
                        <span className="text-xs font-bold text-[#1F3D2A]">{art.category}</span>
                        <h3 className="font-display text-lg text-[#171815] mt-1">{art.title}</h3>
                        <p className="text-xs text-[#171815]/75 mt-1 line-clamp-2">{art.excerpt}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#951722] shrink-0" />
                    </Link>
                  ))}
                </Stagger>
              </div>
            )}
          </div>
        )}
      </div>

      <FeaturedProductsBlock />
    </div>
  );
};
