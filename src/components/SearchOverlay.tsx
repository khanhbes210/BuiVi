import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, formatPrice, getDiscountPercent, removeVietnameseTones } from '../data/products';
import { ARTICLES } from '../data/articles';
import { Img } from './Img';
import { AddToCartButton } from './AddToCartButton';
import { BuyNowButton } from './BuyNowButton';

export const SearchOverlay: React.FC = () => {
  const { searchOverlayOpen, setSearchOverlayOpen } = useStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOverlayOpen) {
        setSearchOverlayOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchOverlayOpen, setSearchOverlayOpen]);

  if (!searchOverlayOpen) return null;

  const q = removeVietnameseTones(query);
  const matchedProducts = q
    ? PRODUCTS.filter(
        (p) =>
          removeVietnameseTones(p.name).includes(q) ||
          removeVietnameseTones(p.category).includes(q) ||
          removeVietnameseTones(p.shortDesc).includes(q)
      )
    : PRODUCTS.slice(0, 4);

  const matchedArticles = q
    ? ARTICLES.filter(
        (a) =>
          removeVietnameseTones(a.title).includes(q) ||
          removeVietnameseTones(a.excerpt).includes(q)
      ).slice(0, 3)
    : ARTICLES.slice(0, 2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOverlayOpen(false);
    navigate(`/tim-kiem?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-start justify-center pt-12 md:pt-20 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Tìm kiếm nhanh sản phẩm và bài viết"
      onClick={() => setSearchOverlayOpen(false)}
    >
      <div
        className="w-full max-w-4xl bg-[#FFF5E4] border-2 border-[#951722]/40 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit}
          className="p-4 md:p-5 bg-[#FFFBF2] border-b border-[#951722]/20 flex items-center gap-3"
        >
          <Search className="w-6 h-6 text-[#951722] shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm Nem bùi, Set Vinh Hoa - Phú Quý, Set Độc Bản, giấy Điệp..."
            className="flex-1 bg-transparent text-lg font-medium text-[#171815] placeholder:text-[#171815]/45 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#951722] text-[#FFF5E4] font-bold text-sm hover:bg-[#9B0514] cursor-pointer whitespace-nowrap"
          >
            Xem tất cả
          </button>
          <button
            type="button"
            onClick={() => setSearchOverlayOpen(false)}
            aria-label="Đóng tìm kiếm"
            className="w-10 h-10 rounded-full hover:bg-[#951722]/10 flex items-center justify-center text-[#171815] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        <div className="p-5 overflow-y-auto space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F3D2A]">
                {q ? `Sản phẩm phù hợp (${matchedProducts.length})` : 'Sản phẩm nổi bật gợi ý'}
              </h3>
              <Link
                to={`/tim-kiem?q=${encodeURIComponent(query)}`}
                onClick={() => setSearchOverlayOpen(false)}
                className="text-xs font-bold text-[#951722] hover:underline"
              >
                Mở trang Tìm kiếm đầy đủ →
              </Link>
            </div>

            {matchedProducts.length === 0 ? (
              <p className="text-sm text-[#171815]/70 py-3">
                Không tìm thấy sản phẩm khớp với "{query}". Hãy xem các sản phẩm bán chạy bên dưới tại trang Tìm kiếm.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchedProducts.map((p) => {
                  const disc = getDiscountPercent(p.price, p.oldPrice);
                  const isBest = p.isBestSeller || p.bestSeller;
                  return (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-[#FFFBF2] border border-[#951722]/20 flex items-center gap-3"
                    >
                      <Link
                        to={`/san-pham/${p.slug}`}
                        onClick={() => setSearchOverlayOpen(false)}
                        className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative bg-[#F5E6CC]"
                      >
                        <Img
                          src={p.images[0].url}
                          alt={p.name}
                          theme={p.images[0].theme}
                          className="w-full h-full object-cover"
                        />
                        {isBest && (
                          <span className="absolute top-1 left-1 bg-[#951722] text-[#FFF5E4] font-display text-[9px] px-1.5 py-0.5 rounded">
                            Bán chạy
                          </span>
                        )}
                        {disc && (
                          <span className="absolute top-1 right-1 bg-[#9B0514] text-[#FFF5E4] font-price text-[10px] px-1.5 py-0.5 rounded">
                            -{disc}%
                          </span>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/san-pham/${p.slug}`}
                          onClick={() => setSearchOverlayOpen(false)}
                          className="font-display text-base text-[#171815] hover:text-[#951722] block truncate"
                        >
                          {p.name}
                        </Link>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-price text-[20px] text-[#9B0514]">
                            {formatPrice(p.price)}
                          </span>
                          {p.oldPrice && (
                            <span className="font-price text-xs text-[#171815]/50 line-through">
                              {formatPrice(p.oldPrice)}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <AddToCartButton
                            product={p}
                            size="sm"
                            fullWidth
                            onDone={() => setSearchOverlayOpen(false)}
                          />
                          <BuyNowButton
                            product={p}
                            size="sm"
                            fullWidth
                            onDone={() => setSearchOverlayOpen(false)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {matchedArticles.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F3D2A] mb-2">
                Bài viết liên quan
              </h3>
              <div className="space-y-2">
                {matchedArticles.map((art) => (
                  <Link
                    key={art.id}
                    to={`/bai-viet/${art.slug}`}
                    onClick={() => setSearchOverlayOpen(false)}
                    className="block p-3 rounded-xl bg-[#FFFBF2] border border-[#951722]/15 hover:border-[#951722] transition-colors"
                  >
                    <span className="text-xs text-[#1F3D2A] font-semibold">{art.category}</span>
                    <p className="font-display text-base text-[#171815] mt-0.5">{art.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
