import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Ticket,
  PhoneCall,
  MapPin,
  LogOut,
  Package,
  Flame,
} from 'lucide-react';
import { Logo } from './Logo';
import { Img } from './Img';
import { useStore } from '../context/StoreContext';
import { SITE_CONFIG } from '../data/siteConfig';
import { PRODUCTS, formatPrice, getDiscountPercent } from '../data/products';
import { VOUCHERS } from '../data/vouchers';
import { AddToCartButton } from './AddToCartButton';
import { BuyNowButton } from './BuyNowButton';
import { CountUp, MOTION_TOKENS, MOTION_SETTINGS, useMotionPreferences } from '../motion';

export const Header: React.FC = () => {
  const {
    totalCartItemsCount,
    cartPromotion,
    cartBadgeBump,
    setMiniCartOpen,
    setSearchOverlayOpen,
    user,
    logoutUser,
  } = useStore();
  const location = useLocation();
  const { reducedMotion } = useMotionPreferences();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>('san-pham');
  const [promoIndex, setPromoIndex] = useState(0);
  const [promoPaused, setPromoPaused] = useState(false);
  const [headerCompacted, setHeaderCompacted] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = (key: string | null) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(key);
  };

  const scheduleCloseDropdown = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // Compact header smoothly when scrolling past 80px
  useEffect(() => {
    const onScroll = () => {
      setHeaderCompacted(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Rotate top announcement bar offers every 4s (pause on hover/focus or reduced motion)
  useEffect(() => {
    if (promoPaused || reducedMotion || !MOTION_SETTINGS.ENABLE_MARQUEE) return;
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % SITE_CONFIG.announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [promoPaused, reducedMotion]);

  // Close menus on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Keyboard Escape closes dropdowns
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const bestSellerSet = PRODUCTS.find((p) => p.id === 'prod-set-vinh-hoa') || PRODUCTS[3];
  const bestSellerDiscount = getDiscountPercent(bestSellerSet.price, bestSellerSet.oldPrice);
  const currentAnnouncement =
    SITE_CONFIG.announcements[promoIndex] || SITE_CONFIG.announcements[0];

  const toggleMobileSection = (key: string) => {
    setMobileExpanded((prev) => (prev === key ? null : key));
  };

  return (
    <>
      {/* Top Announcement Bar: Heritage Forest Green (#1F3D2A) with Cream (#FFF5E4) text; whole banner clickable to /khuyen-mai */}
      <div
        onMouseEnter={() => setPromoPaused(true)}
        onMouseLeave={() => setPromoPaused(false)}
        onFocus={() => setPromoPaused(true)}
        onBlur={() => setPromoPaused(false)}
        className="hidden md:block bg-[#1F3D2A] text-[#FFF5E4] text-xs py-2 px-4 border-b border-[#FFF5E4]/15"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link
            to={`/khuyen-mai#ma-voucher-${currentAnnouncement.code}`}
            className="flex-1 flex items-center justify-between gap-3 font-medium hover:text-[#F3D27A] transition-colors group overflow-hidden"
          >
            <div className="flex items-center gap-2 truncate relative overflow-hidden">
              <Ticket className="w-4 h-4 text-[#F3D27A] shrink-0" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={promoIndex}
                  initial={reducedMotion ? { opacity: 1 } : { y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reducedMotion ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
                  transition={{ duration: 0.28, ease: MOTION_TOKENS.easings.standard }}
                  className="truncate inline-block"
                >
                  {currentAnnouncement.text}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="inline-flex items-center gap-1 bg-[#951722] group-hover:bg-[#9B0514] text-[#FFF5E4] font-bold px-2.5 py-0.5 rounded-md whitespace-nowrap shrink-0 transition-colors">
              <span>Xem chi tiết ưu đãi</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
          <div className="flex items-center gap-3 shrink-0">
            <span aria-hidden="true" className="text-[#FFF5E4]/30">
              |
            </span>
            <a
              href={`tel:${SITE_CONFIG.contact.hotline.replace(/\s+/g, '')}`}
              className="hover:text-[#F3D27A] font-semibold whitespace-nowrap"
            >
              Hotline: {SITE_CONFIG.contact.hotline}
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header: Cream background (#FFF5E4), compacts 80px -> 68px past 80px scroll */}
      <header
        className={`sticky top-0 z-40 bg-[#FFF5E4] border-b border-[#951722] transition-all duration-200 ${
          headerCompacted ? 'h-[68px] shadow-md' : 'h-20'
        }`}
        onMouseLeave={scheduleCloseDropdown}
      >
        <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Zone 1: Brand Logo (scales to 0.9 on scroll compaction using transform) */}
          <Link
            to="/"
            aria-label="BÙI VỊ – Về trang chủ"
            className={`flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#951722] rounded-xl transition-transform duration-200 origin-left ${
              headerCompacted ? 'scale-90' : 'scale-100'
            }`}
          >
            <Logo variant="main" />
          </Link>

          {/* Zone 2: Desktop Navigation: Trang chủ | Sản phẩm | Khuyến mãi | Về Bùi Vị | Bài viết | Liên hệ */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden lg:flex items-center gap-6 xl:gap-7 h-full"
          >
            {/* 0. TRANG CHỦ */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => openDropdown(null)}
            >
              <Link
                to="/"
                className={`text-[18px] font-semibold tracking-[0.2px] py-2 flex items-center gap-1 transition-colors whitespace-nowrap relative group ${
                  location.pathname === '/'
                    ? 'text-[#951722]'
                    : 'text-[#171815] hover:text-[#951722]'
                }`}
              >
                <span>Trang chủ</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#951722] origin-left transition-transform duration-200 ${
                    location.pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            </div>

            {/* 1. SẢN PHẨM */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => openDropdown('san-pham')}
              onFocus={() => openDropdown('san-pham')}
            >
              <Link
                to="/san-pham"
                className={`text-[18px] font-semibold tracking-[0.2px] py-2 flex items-center gap-1 transition-colors whitespace-nowrap relative group ${
                  location.pathname.startsWith('/san-pham')
                    ? 'text-[#951722]'
                    : 'text-[#171815] hover:text-[#951722]'
                }`}
              >
                <span>Sản phẩm</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#951722] origin-left transition-transform duration-200 ${
                    activeDropdown === 'san-pham' || location.pathname.startsWith('/san-pham')
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            </div>

            {/* 2. KHUYẾN MÃI */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => openDropdown('khuyen-mai')}
              onFocus={() => openDropdown('khuyen-mai')}
            >
              <Link
                to="/khuyen-mai"
                className={`text-[18px] font-semibold tracking-[0.2px] py-2 flex items-center gap-1 transition-colors whitespace-nowrap relative group ${
                  location.pathname.startsWith('/khuyen-mai')
                    ? 'text-[#951722]'
                    : 'text-[#171815] hover:text-[#951722]'
                }`}
              >
                <span>Khuyến mãi</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#951722] origin-left transition-transform duration-200 ${
                    activeDropdown === 'khuyen-mai' || location.pathname.startsWith('/khuyen-mai')
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            </div>

            {/* 3. VỀ BÙI VỊ */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => openDropdown('ve-bui-vi')}
              onFocus={() => openDropdown('ve-bui-vi')}
            >
              <Link
                to="/ve-bui-vi"
                className={`text-[18px] font-semibold tracking-[0.2px] py-2 flex items-center gap-1 transition-colors whitespace-nowrap relative group ${
                  location.pathname.startsWith('/ve-bui-vi')
                    ? 'text-[#951722]'
                    : 'text-[#171815] hover:text-[#951722]'
                }`}
              >
                <span>Về Bùi Vị</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#951722] origin-left transition-transform duration-200 ${
                    activeDropdown === 've-bui-vi' || location.pathname.startsWith('/ve-bui-vi')
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            </div>

            {/* 4. BÀI VIẾT */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => openDropdown('bai-viet')}
              onFocus={() => openDropdown('bai-viet')}
            >
              <Link
                to="/bai-viet"
                className={`text-[18px] font-semibold tracking-[0.2px] py-2 flex items-center gap-1 transition-colors whitespace-nowrap relative group ${
                  location.pathname.startsWith('/bai-viet')
                    ? 'text-[#951722]'
                    : 'text-[#171815] hover:text-[#951722]'
                }`}
              >
                <span>Bài viết</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#951722] origin-left transition-transform duration-200 ${
                    activeDropdown === 'bai-viet' || location.pathname.startsWith('/bai-viet')
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            </div>

            {/* 5. LIÊN HỆ */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => openDropdown('lien-he')}
              onFocus={() => openDropdown('lien-he')}
            >
              <Link
                to="/lien-he"
                className={`text-[18px] font-semibold tracking-[0.2px] py-2 flex items-center gap-1 transition-colors whitespace-nowrap relative group ${
                  location.pathname.startsWith('/lien-he')
                    ? 'text-[#951722]'
                    : 'text-[#171815] hover:text-[#951722]'
                }`}
              >
                <span>Liên hệ</span>
                <ChevronDown className="w-4 h-4 opacity-70" />
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#951722] origin-left transition-transform duration-200 ${
                    activeDropdown === 'lien-he' || location.pathname.startsWith('/lien-he')
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            </div>
          </nav>

          {/* Zone 3: Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => setSearchOverlayOpen(true)}
              aria-label="Tìm kiếm"
              className="min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] p-1.5 sm:p-2 rounded-xl text-[#171815] hover:text-[#951722] hover:bg-[#951722]/10 transition-colors flex items-center justify-center cursor-pointer"
            >
              <Search className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* Account Button with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown('tai-khoan')}
            >
              <Link
                to="/tai-khoan"
                aria-label="Tài khoản"
                className="min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] p-1.5 sm:p-2 rounded-xl text-[#171815] hover:text-[#951722] hover:bg-[#951722]/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <User className="w-6 h-6 sm:w-7 sm:h-7" />
                {user && (
                  <span className="hidden xl:inline text-xs font-bold text-[#1F3D2A] max-w-[90px] truncate">
                    {user.fullName}
                  </span>
                )}
              </Link>

              {activeDropdown === 'tai-khoan' && (
                <div
                  className="absolute right-0 top-full pt-2 w-60 z-50"
                  onMouseEnter={() => openDropdown('tai-khoan')}
                  onMouseLeave={scheduleCloseDropdown}
                >
                  <div className="bg-[#FFFBF2] border-2 border-[#951722]/30 rounded-2xl shadow-xl p-3 space-y-1.5">
                    {user ? (
                      <>
                        <div className="px-3 py-2 border-b border-[#951722]/15">
                          <p className="text-xs text-[#171815]/60">Xin chào thành viên,</p>
                          <p className="font-bold text-sm text-[#1F3D2A] truncate">
                            {user.fullName}
                          </p>
                        </div>
                        <Link
                          to="/tai-khoan/ho-so"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#951722]/10 text-[#171815]"
                        >
                          <User className="w-4 h-4 text-[#951722]" />
                          <span>Hồ sơ cá nhân</span>
                        </Link>
                        <Link
                          to="/tai-khoan/don-hang"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#951722]/10 text-[#171815]"
                        >
                          <Package className="w-4 h-4 text-[#951722]" />
                          <span>Đơn hàng của tôi</span>
                        </Link>
                        <Link
                          to="/tai-khoan/so-dia-chi"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#951722]/10 text-[#171815]"
                        >
                          <MapPin className="w-4 h-4 text-[#951722]" />
                          <span>Sổ địa chỉ</span>
                        </Link>
                        <button
                          type="button"
                          onClick={logoutUser}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#9B0514]/10 text-[#9B0514] cursor-pointer text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/tai-khoan/dang-nhap"
                          className="block w-full text-center py-2.5 px-4 rounded-xl bg-[#951722] text-[#FFF5E4] font-bold text-sm hover:bg-[#9B0514]"
                        >
                          Đăng nhập
                        </Link>
                        <Link
                          to="/tai-khoan/dang-ky"
                          className="block w-full text-center py-2.5 px-4 rounded-xl border border-[#1F3D2A] text-[#1F3D2A] font-bold text-sm hover:bg-[#1F3D2A] hover:text-[#FFF5E4]"
                        >
                          Đăng ký thành viên
                        </Link>
                        <p className="text-[11px] text-center text-[#1F3D2A] pt-1 font-medium">
                          Đăng ký mới giảm ngay 30.000đ (<strong>THANHVIEN50</strong>)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Icon with Live Item-Count Badge AND Animated Total Amount on Desktop */}
            <button
              type="button"
              data-cart-target="desktop"
              onClick={() => setMiniCartOpen(true)}
              aria-label={`Giỏ hàng (${totalCartItemsCount} sản phẩm)`}
              className={`min-h-[40px] sm:min-h-[44px] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#951722] hover:bg-[#9B0514] text-[#FFF5E4] transition-transform flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-xs ${
                cartBadgeBump ? 'anim-cart-wiggle scale-110' : 'scale-100'
              }`}
            >
              <div className="relative flex items-center">
                <ShoppingBag className="w-5 h-5 sm:w-7 sm:h-7" />
                <span className="ml-1 sm:ml-1.5 font-price font-bold text-xs sm:text-sm bg-[#FFF5E4] text-[#951722] px-1.5 sm:px-2 py-0.5 rounded-full">
                  {totalCartItemsCount}
                </span>
              </div>
              <span className="hidden xl:inline font-price text-sm font-bold whitespace-nowrap">
                · <CountUp value={cartPromotion.finalTotal} formatter={formatPrice} />
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden min-w-[40px] sm:min-w-[44px] min-h-[40px] sm:min-h-[44px] p-1.5 sm:p-2 rounded-xl text-[#171815] hover:bg-[#951722]/10 flex items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>

        {/* DESKTOP MEGA-MENUS & DROPDOWN PANELS */}
        {activeDropdown === 'san-pham' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: MOTION_TOKENS.easings.standard }}
            className="hidden lg:block absolute left-0 right-0 top-full bg-[#FFFBF2] border-b-2 border-[#951722]/30 shadow-2xl z-50"
            onMouseEnter={() => openDropdown('san-pham')}
            onMouseLeave={scheduleCloseDropdown}
          >
            {/* Thin bamboo/woodblock divider line draws across the top */}
            <svg
              viewBox="0 0 1200 4"
              preserveAspectRatio="none"
              className="w-full h-1 block"
              aria-hidden="true"
            >
              <line
                x1="0"
                y1="2"
                x2="1200"
                y2="2"
                stroke="#951722"
                strokeWidth="3"
                strokeDasharray="1200"
                className="anim-stroke-draw"
              />
            </svg>
            <div className="max-w-7xl mx-auto px-8 py-6 grid grid-cols-12 gap-8">
              {/* 7 Products with direct detail links, starting price, "Bán chạy" and auto-calculated -X% badge */}
              <div className="col-span-8">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-[#951722]/15">
                  <div className="flex items-center gap-2">
                    <Link
                      to="/san-pham?nhom=san-pham"
                      className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FFF5E4] border border-[#951722]/25 text-[#171815] hover:bg-[#951722] hover:text-[#FFF5E4] transition-colors"
                    >
                      Sản phẩm (3 vị nem)
                    </Link>
                    <Link
                      to="/san-pham?nhom=set-qua-bieu"
                      className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FFF5E4] border border-[#951722]/25 text-[#171815] hover:bg-[#951722] hover:text-[#FFF5E4] transition-colors"
                    >
                      Set quà biếu Bùi Vị
                    </Link>
                  </div>
                  <Link
                    to="/san-pham"
                    className="text-xs font-bold text-[#951722] hover:underline"
                  >
                    Xem tất cả sản phẩm →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {PRODUCTS.map((prod) => {
                    const disc = getDiscountPercent(prod.price, prod.oldPrice);
                    const isBest = prod.isBestSeller || prod.bestSeller;
                    return (
                      <Link
                        key={prod.id}
                        to={`/san-pham/${prod.slug}`}
                        className="p-2.5 rounded-xl hover:bg-[#FFF5E4] border border-transparent hover:border-[#951722]/25 flex items-center gap-3 group transition-colors"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative bg-[#F5E6CC]">
                          <Img
                            src={prod.images[0].url}
                            alt={prod.name}
                            theme={prod.images[0].theme}
                            className="w-full h-full object-cover"
                          />
                          {disc && (
                            <span className="absolute top-0.5 right-0.5 bg-[#9B0514] text-[#FFF5E4] font-price text-[10px] font-bold px-1 rounded">
                              -{disc}%
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-display text-base text-[#171815] group-hover:text-[#951722] truncate">
                              {prod.name}
                            </p>
                            {isBest && (
                              <span className="font-display bg-[#951722] text-[#FFF5E4] text-[10px] px-1.5 py-0.5 rounded shrink-0">
                                Bán chạy
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#171815]/65 truncate">{prod.packSpec}</p>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="font-price text-[20px] text-[#9B0514]">
                              {formatPrice(prod.price)}
                            </span>
                            {prod.oldPrice && (
                              <span className="font-price text-sm text-[#171815]/45 line-through">
                                {formatPrice(prod.oldPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Best-selling Set Spotlight with "Bán chạy" badge & "Mua ngay" inside Mega-Menu */}
              <div className="col-span-4 bg-[#FFF5E4] border border-[#951722]/30 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[#1F3D2A]">
                      {bestSellerSet.packSpec}
                    </span>
                  </div>
                  <Link
                    to={`/san-pham/${bestSellerSet.slug}`}
                    className="block aspect-[16/10] rounded-xl overflow-hidden mb-3 relative"
                  >
                    <Img
                      src={bestSellerSet.images[0].url}
                      alt={bestSellerSet.name}
                      theme={bestSellerSet.images[0].theme}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 font-display text-[11px] bg-[#951722] text-[#FFF5E4] px-2.5 py-0.5 rounded shadow-xs">
                      <Flame className="w-3 h-3 text-[#F3D27A]" />
                      <span>Bán chạy</span>
                    </span>
                    {bestSellerDiscount && (
                      <span className="absolute top-2 right-2 bg-[#9B0514] text-[#FFF5E4] font-price text-xs px-2 py-0.5 rounded shadow-xs">
                        -{bestSellerDiscount}%
                      </span>
                    )}
                  </Link>
                  <Link
                    to={`/san-pham/${bestSellerSet.slug}`}
                    className="font-display text-[20px] text-[#171815] hover:text-[#951722] block"
                  >
                    {bestSellerSet.name}
                  </Link>
                  <p className="text-xs text-[#171815]/75 mt-1 line-clamp-2">
                    {bestSellerSet.shortDesc}
                  </p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-price text-[20px] text-[#9B0514]">
                      {formatPrice(bestSellerSet.price)}
                    </span>
                    {bestSellerSet.oldPrice && (
                      <span className="font-price text-xs text-[#171815]/50 line-through">
                        {formatPrice(bestSellerSet.oldPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <AddToCartButton
                    product={bestSellerSet}
                    size="sm"
                    fullWidth
                    onDone={() => setActiveDropdown(null)}
                  />
                  <BuyNowButton
                    product={bestSellerSet}
                    size="sm"
                    fullWidth
                    onDone={() => setActiveDropdown(null)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* KHUYẾN MÃI DROPDOWN */}
        {activeDropdown === 'khuyen-mai' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: MOTION_TOKENS.easings.standard }}
            className="hidden lg:block absolute left-0 right-0 top-full bg-[#FFFBF2] border-b-2 border-[#951722]/30 shadow-xl z-50"
            onMouseEnter={() => openDropdown('khuyen-mai')}
            onMouseLeave={scheduleCloseDropdown}
          >
            <div className="max-w-7xl mx-auto px-8 py-6 grid grid-cols-12 gap-8">
              <div className="col-span-4 space-y-2 border-r border-[#951722]/15 pr-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#1F3D2A] mb-2">
                  Chuyên mục Khuyến mãi
                </p>
                <Link
                  to="/khuyen-mai#uu-dai-hot"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FFF5E4] hover:bg-[#951722] hover:text-[#FFF5E4] font-bold text-sm transition-colors"
                >
                  <span>Ưu đãi hot / Khuyến mãi</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/khuyen-mai#combo-qua-tang"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FFF5E4] hover:bg-[#951722] hover:text-[#FFF5E4] font-bold text-sm transition-colors"
                >
                  <span>Combo & Quà tặng di sản</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/khuyen-mai#bang-so-sanh"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FFF5E4] hover:bg-[#951722] hover:text-[#FFF5E4] font-bold text-sm transition-colors"
                >
                  <span>Bảng so sánh các Voucher</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="col-span-8">
                <p className="text-xs font-bold uppercase tracking-wider text-[#1F3D2A] mb-3">
                  Danh sách mã Voucher đang hiệu lực
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {VOUCHERS.map((v) => (
                    <Link
                      key={v.code}
                      to={`/khuyen-mai#ma-voucher-${v.code}`}
                      className="p-3 rounded-xl bg-[#FFF5E4] border border-[#951722]/25 hover:border-[#951722] flex items-center justify-between gap-2 group"
                    >
                      <div>
                        <span className="font-display text-xs bg-[#1F3D2A] text-[#FFF5E4] px-2 py-0.5 rounded">
                          {v.code}
                        </span>
                        <span className="ml-2 font-price text-sm text-[#9B0514]">
                          – {v.valueText}
                        </span>
                        <p className="font-display text-xs text-[#171815]/80 mt-1 line-clamp-1">{v.title}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#951722] shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VỀ BÙI VỊ DROPDOWN */}
        {activeDropdown === 've-bui-vi' && (
          <div
            className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-full w-[520px] bg-[#FFFBF2] border-2 border-[#951722]/30 rounded-b-2xl shadow-xl p-5 z-50"
            onMouseEnter={() => openDropdown('ve-bui-vi')}
            onMouseLeave={scheduleCloseDropdown}
          >
            <div className="space-y-2">
              <Link
                to="/ve-bui-vi#cau-chuyen"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF5E4] font-bold text-sm text-[#171815] hover:text-[#951722]"
              >
                <div>
                  <p>Câu chuyện thương hiệu</p>
                  <p className="text-xs font-normal text-[#171815]/70">
                    Khởi nguồn từ vị bùi thính gạo Kinh Bắc & nghệ thuật giấy Điệp Đông Hồ
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </Link>
              <Link
                to="/ve-bui-vi#cam-ket"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF5E4] font-bold text-sm text-[#171815] hover:text-[#951722]"
              >
                <div>
                  <p>Cam kết chất lượng</p>
                  <p className="text-xs font-normal text-[#171815]/70">
                    Thính gạo rang củi, nguyên liệu tuyển chọn trong ngày, an toàn vệ sinh
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </Link>
              <Link
                to="/ve-bui-vi#hanh-trinh"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF5E4] font-bold text-sm text-[#171815] hover:text-[#951722]"
              >
                <div>
                  <p>Hành trình Bùi Vị & Ba dòng sản phẩm di sản</p>
                  <p className="text-xs font-normal text-[#171815]/70">
                    Vinh Hoa - Phú Quý, Bình An - Sung Túc và Độc Bản
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>
        )}

        {/* BÀI VIẾT DROPDOWN */}
        {activeDropdown === 'bai-viet' && (
          <div
            className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-full w-[480px] bg-[#FFFBF2] border-2 border-[#951722]/30 rounded-b-2xl shadow-xl p-5 z-50"
            onMouseEnter={() => openDropdown('bai-viet')}
            onMouseLeave={scheduleCloseDropdown}
          >
            <div className="space-y-2">
              <Link
                to="/bai-viet?chuyen-muc=van-hoa-am-thuc"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF5E4] font-bold text-sm text-[#171815] hover:text-[#951722]"
              >
                <div>
                  <p>Văn hóa ẩm thực</p>
                  <p className="text-xs font-normal text-[#171815]/70">
                    Nét đẹp đặc sản Kinh Bắc, nghệ thuật giấy Điệp & tranh Đông Hồ
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </Link>
              <Link
                to="/bai-viet?chuyen-muc=meo-hay-bi-quyet"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF5E4] font-bold text-sm text-[#171815] hover:text-[#951722]"
              >
                <div>
                  <p>Mẹo hay & bí quyết</p>
                  <p className="text-xs font-normal text-[#171815]/70">
                    Cách bảo quản nem tươi, kết hợp món ăn, bí quyết chọn quà biếu
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </Link>
              <Link
                to="/bai-viet?chuyen-muc=tin-tuc-su-kien"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF5E4] font-bold text-sm text-[#171815] hover:text-[#951722]"
              >
                <div>
                  <p>Tin tức & Sự kiện</p>
                  <p className="text-xs font-normal text-[#171815]/70">
                    Bộ sưu tập quà Tết và hoạt động tại Không gian Di sản Bùi Vị
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>
        )}

        {/* LIÊN HỆ DROPDOWN */}
        {activeDropdown === 'lien-he' && (
          <div
            className="hidden lg:block absolute right-24 top-full w-[420px] bg-[#FFFBF2] border-2 border-[#951722]/30 rounded-b-2xl shadow-xl p-5 z-50"
            onMouseEnter={() => openDropdown('lien-he')}
            onMouseLeave={scheduleCloseDropdown}
          >
            <div className="space-y-2">
              <Link
                to="/lien-he#form-lien-he"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF5E4] font-bold text-sm text-[#171815] hover:text-[#951722]"
              >
                <span>Form liên hệ & Gửi lời nhắn</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/lien-he#he-thong-cua-hang"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF5E4] font-bold text-sm text-[#171815] hover:text-[#951722]"
              >
                <span>Không gian Di sản Bùi Vị (Thuận Thành, Bắc Ninh)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/lien-he#kenh-ket-noi"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF5E4] font-bold text-sm text-[#171815] hover:text-[#951722]"
              >
                <span className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-[#951722]" />
                  <span>Hotline / Zalo / Fanpage ({SITE_CONFIG.contact.hotline})</span>
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* MOBILE HAMBURGER MENU (Trang chủ first item, 20px items, accordion expand) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-40 bg-[#FFF5E4] overflow-y-auto border-t border-[#951722]/25 pb-24">
          <div className="p-4 space-y-2">
            {/* Mobile Promo Strip (clickable to /khuyen-mai) */}
            <Link
              to={`/khuyen-mai#ma-voucher-${currentAnnouncement.code}`}
              className="block p-3 rounded-xl bg-[#1F3D2A] text-[#FFF5E4] text-xs font-medium mb-3"
            >
              <span className="text-[#F3D27A] font-bold">Ưu đãi: </span>
              <span>{currentAnnouncement.text}</span>
              <span className="block mt-1 text-[#F3D27A] font-bold underline">
                Xem chi tiết ưu đãi →
              </span>
            </Link>

            {/* 0. Trang chủ (First item in mobile hamburger menu) */}
            <Link
              to="/"
              className={`block py-3.5 text-[20px] font-bold border-b border-[#951722]/15 ${
                location.pathname === '/' ? 'text-[#951722]' : 'text-[#171815]'
              }`}
            >
              Trang chủ
            </Link>

            {/* 1. Accordion: Sản phẩm */}
            <div className="border-b border-[#951722]/15">
              <div className="flex items-center justify-between">
                <Link
                  to="/san-pham"
                  className="flex-1 py-3.5 text-[20px] font-bold text-[#171815]"
                >
                  Sản phẩm
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('san-pham')}
                  aria-label="Mở rộng danh mục Sản phẩm"
                  className="p-3 text-[#951722]"
                >
                  <ChevronDown
                    className={`w-6 h-6 transition-transform ${
                      mobileExpanded === 'san-pham' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
              {mobileExpanded === 'san-pham' && (
                <div className="pb-3 pl-3 space-y-2">
                  {PRODUCTS.map((p) => {
                    const disc = getDiscountPercent(p.price, p.oldPrice);
                    const isBest = p.isBestSeller || p.bestSeller;
                    return (
                      <Link
                        key={p.id}
                        to={`/san-pham/${p.slug}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-3 rounded-xl bg-[#FFFBF2] hover:bg-[#F5E6CC] text-base text-[#171815] gap-1 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold">{p.name}</span>
                          {isBest && (
                            <span className="text-[11px] font-bold bg-[#951722] text-[#FFF5E4] px-1.5 py-0.5 rounded-md">
                              Bán chạy
                            </span>
                          )}
                        </div>
                        <span className="font-price text-sm font-bold text-[#9B0514] shrink-0">
                          {formatPrice(p.price)} {disc ? `(-${disc}%)` : ''}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Accordion: Khuyến mãi */}
            <div className="border-b border-[#951722]/15">
              <div className="flex items-center justify-between">
                <Link
                  to="/khuyen-mai"
                  className="flex-1 py-3.5 text-[20px] font-bold text-[#171815]"
                >
                  Khuyến mãi
                </Link>
                <button
                  type="button"
                  onClick={() => toggleMobileSection('khuyen-mai')}
                  aria-label="Mở rộng danh mục Khuyến mãi"
                  className="p-3 text-[#951722]"
                >
                  <ChevronDown
                    className={`w-6 h-6 transition-transform ${
                      mobileExpanded === 'khuyen-mai' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
              {mobileExpanded === 'khuyen-mai' && (
                <div className="pb-3 pl-3 space-y-2">
                  {VOUCHERS.map((v) => (
                    <Link
                      key={v.code}
                      to={`/khuyen-mai#ma-voucher-${v.code}`}
                      className="flex items-center justify-between py-2 px-3 rounded-xl bg-[#FFFBF2] text-sm font-semibold"
                    >
                      <span className="font-bold text-[#1F3D2A]">{v.code}</span>
                      <span className="text-[#9B0514] font-bold">{v.valueText}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Về Bùi Vị */}
            <Link
              to="/ve-bui-vi"
              className="block py-3.5 text-[20px] font-bold text-[#171815] border-b border-[#951722]/15"
            >
              Về Bùi Vị
            </Link>

            {/* 4. Bài viết */}
            <Link
              to="/bai-viet"
              className="block py-3.5 text-[20px] font-bold text-[#171815] border-b border-[#951722]/15"
            >
              Bài viết
            </Link>

            {/* 5. Liên hệ */}
            <Link
              to="/lien-he"
              className="block py-3.5 text-[20px] font-bold text-[#171815] border-b border-[#951722]/15"
            >
              Liên hệ
            </Link>

            {/* Tài khoản & Sơ đồ trang */}
            <Link
              to="/tai-khoan"
              className="block py-3.5 text-[20px] font-bold text-[#1F3D2A] border-b border-[#951722]/15"
            >
              {user ? `Tài khoản (${user.fullName})` : 'Tài khoản (Đăng nhập / Đăng ký)'}
            </Link>
            <Link
              to="/so-do-trang"
              className="block py-3.5 text-[18px] font-semibold text-[#951722]"
            >
              Sơ đồ trang (Sitemap)
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
