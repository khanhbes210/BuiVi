import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ARTICLES } from '../data/articles';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

export const PageNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;

  // Do not render on Homepage "/"
  if (pathname === '/') return null;

  const searchParams = new URLSearchParams(search);
  const isBuyNowCheckout =
    pathname === '/thanh-toan' && searchParams.get('mode') === 'buynow';

  // Determine logical parent fallback route & breadcrumb trail
  let parentRoute = '/';
  const crumbs: BreadcrumbItem[] = [{ label: 'Trang chủ', to: '/' }];

  if (pathname === '/san-pham') {
    const nhom = searchParams.get('nhom');
    if (nhom === 'set-qua-bieu') {
      crumbs.push({ label: 'Sản phẩm', to: '/san-pham' });
      crumbs.push({ label: 'Set quà biếu Bùi Vị' });
    } else if (nhom === 'san-pham') {
      crumbs.push({ label: 'Sản phẩm', to: '/san-pham' });
      crumbs.push({ label: 'Sản phẩm nem Kinh Bắc' });
    } else {
      crumbs.push({ label: 'Sản phẩm' });
    }
    parentRoute = '/';
  } else if (pathname.startsWith('/san-pham/')) {
    const slug = pathname.replace('/san-pham/', '');
    const product = PRODUCTS.find(
      (p) => p.slug === slug || (p.legacySlugs && p.legacySlugs.includes(slug))
    );
    const groupParam = product?.isGiftSet ? 'set-qua-bieu' : 'san-pham';
    parentRoute = `/san-pham?nhom=${groupParam}`;
    crumbs.push({ label: 'Sản phẩm', to: `/san-pham?nhom=${groupParam}` });
    crumbs.push({ label: product ? product.name : 'Chi tiết sản phẩm' });
  } else if (pathname === '/khuyen-mai') {
    crumbs.push({ label: 'Khuyến mãi' });
    parentRoute = '/';
  } else if (pathname === '/ve-bui-vi') {
    crumbs.push({ label: 'Về Bùi Vị' });
    parentRoute = '/';
  } else if (pathname === '/bai-viet') {
    crumbs.push({ label: 'Bài viết' });
    parentRoute = '/';
  } else if (pathname.startsWith('/bai-viet/')) {
    const slug = pathname.replace('/bai-viet/', '');
    const article = ARTICLES.find((a) => a.slug === slug);
    parentRoute = '/bai-viet';
    crumbs.push({ label: 'Bài viết', to: '/bai-viet' });
    if (article) {
      crumbs.push({
        label: article.category,
        to: `/bai-viet?chuyen-muc=${encodeURIComponent(article.category)}`,
      });
      crumbs.push({ label: article.title });
    } else {
      crumbs.push({ label: 'Chi tiết bài viết' });
    }
  } else if (pathname === '/lien-he') {
    crumbs.push({ label: 'Liên hệ' });
    parentRoute = '/';
  } else if (pathname === '/tim-kiem') {
    crumbs.push({ label: 'Tìm kiếm' });
    parentRoute = '/san-pham';
  } else if (pathname.startsWith('/tai-khoan')) {
    parentRoute = '/';
    crumbs.push({ label: 'Tài khoản', to: '/tai-khoan' });
    const sub = pathname.replace('/tai-khoan/', '').replace('/tai-khoan', '');
    if (sub === 'dang-nhap') crumbs.push({ label: 'Đăng nhập' });
    else if (sub === 'dang-ky') crumbs.push({ label: 'Đăng ký' });
    else if (sub === 'ho-so') crumbs.push({ label: 'Hồ sơ cá nhân' });
    else if (sub === 'don-hang') crumbs.push({ label: 'Đơn hàng của tôi' });
    else if (sub === 'so-dia-chi') crumbs.push({ label: 'Sổ địa chỉ' });
  } else if (pathname === '/gio-hang') {
    parentRoute = '/san-pham';
    crumbs.push({ label: 'Giỏ hàng' });
  } else if (pathname === '/thanh-toan') {
    parentRoute = isBuyNowCheckout ? '/san-pham' : '/gio-hang';
    if (!isBuyNowCheckout) {
      crumbs.push({ label: 'Giỏ hàng', to: '/gio-hang' });
    }
    crumbs.push({
      label: isBuyNowCheckout ? 'Thanh toán nhanh (Mua ngay)' : 'Thanh toán',
    });
  } else if (pathname === '/dat-hang-thanh-cong') {
    parentRoute = '/san-pham';
    crumbs.push({ label: 'Đặt hàng thành công' });
  } else if (pathname === '/thanh-toan-that-bai') {
    parentRoute = '/gio-hang';
    crumbs.push({ label: 'Giỏ hàng', to: '/gio-hang' });
    crumbs.push({ label: 'Thanh toán chưa hoàn tất' });
  } else if (pathname === '/so-do-trang') {
    parentRoute = '/';
    crumbs.push({ label: 'Sơ đồ trang' });
  } else {
    parentRoute = '/';
    crumbs.push({ label: 'Trang không tồn tại (404)' });
  }

  const handleGoBack = () => {
    // Check if history has an in-site entry
    if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(parentRoute);
    }
  };

  return (
    <div
      data-testid="page-nav-bar"
      className="bg-[#FFFBF2] border-b border-[#951722]/20 h-11 max-h-[44px] px-4 sm:px-6 lg:px-8 flex items-center"
    >
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-2 sm:gap-3 h-full overflow-hidden">
        {/* Left: Back Button + Trang chủ Icon Button + Breadcrumb on the same single line */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 w-full h-full">
          <button
            type="button"
            onClick={handleGoBack}
            className="h-8 px-2.5 rounded-lg border border-[#951722]/35 bg-[#FFF5E4] hover:bg-[#951722] text-[#951722] hover:text-[#FFF5E4] text-xs sm:text-sm inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span>{isBuyNowCheckout ? 'Quay lại mua tiếp' : 'Quay lại'}</span>
          </button>

          <Link
            to="/"
            aria-label="Trang chủ"
            title="Trang chủ"
            className="h-8 w-8 sm:w-auto sm:px-2.5 rounded-lg border border-[#1F3D2A]/35 bg-[#FFF5E4] hover:bg-[#1F3D2A] text-[#1F3D2A] hover:text-[#FFF5E4] text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden lg:inline">Trang chủ</span>
          </Link>

          <span aria-hidden="true" className="text-[#171815]/30 text-xs shrink-0 px-0.5">
            |
          </span>

          {/* Breadcrumb trail: full on desktop, last 2 levels on tablet, only current page title on mobile */}
          <nav
            aria-label="Breadcrumb"
            className="text-xs sm:text-sm text-[#171815]/75 flex items-center gap-1 min-w-0 overflow-hidden whitespace-nowrap"
          >
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              const isSecondLast = index === crumbs.length - 2;
              const visibilityClass = isLast
                ? 'inline-flex'
                : isSecondLast
                ? 'hidden md:inline-flex'
                : 'hidden lg:inline-flex';

              return (
                <span
                  key={index}
                  className={`${visibilityClass} items-center gap-1 min-w-0 ${
                    isLast ? 'truncate' : 'shrink-0'
                  }`}
                >
                  {index > 0 && (
                    <ChevronRight
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 text-[#171815]/40 shrink-0 ${
                        isLast ? 'hidden md:inline' : ''
                      }`}
                    />
                  )}
                  {crumb.to && !isLast ? (
                    <Link
                      to={crumb.to}
                      className="hover:text-[#951722] transition-colors whitespace-nowrap"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[#951722] truncate">{crumb.label}</span>
                  )}
                </span>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
