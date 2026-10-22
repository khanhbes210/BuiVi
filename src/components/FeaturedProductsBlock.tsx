import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

interface FeaturedProductsBlockProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  excludeId?: string;
}

export const FeaturedProductsBlock: React.FC<FeaturedProductsBlockProps> = ({
  title = 'Tuyệt Phẩm Quà Biếu & Đặc Sản Nổi Bật',
  subtitle = 'Chọn thức quà di sản Kinh Bắc – Gói trọn tấm lòng người trao trong hộp giấy Điệp Đông Hồ',
  limit = 3,
  excludeId,
}) => {
  const featuredList = PRODUCTS.filter((p) => p.id !== excludeId).slice(0, limit);

  return (
    <section
      aria-label="Sản phẩm nổi bật gợi ý"
      className="py-12 md:py-16 border-t-2 border-[#951722]/20 bg-[#FFF5E4]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1F3D2A] mb-2">
              Gợi ý thưởng thức & trao tặng
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-[#951722]">{title}</h2>
            <p className="text-base text-[#171815]/80 mt-1">{subtitle}</p>
          </div>
          <Link
            to="/san-pham"
            className="inline-flex items-center gap-2 text-[#951722] hover:text-[#9B0514] font-bold text-base whitespace-nowrap shrink-0 group"
          >
            <span>Xem toàn bộ 7 dòng sản phẩm</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {featuredList.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </div>
    </section>
  );
};
