import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MotionConfig, motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, CheckCircle2, ArrowUp, X } from 'lucide-react';
import { Header } from './Header';
import { PageNavBar } from './PageNavBar';
import { Footer } from './Footer';
import { MiniCartDrawer } from './MiniCartDrawer';
import { SearchOverlay } from './SearchOverlay';
import { Img } from './Img';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../data/products';
import {
  PageTransition,
  RouteProgressBar,
  CountUp,
  MOTION_TOKENS,
  useMotionPreferences,
} from '../motion';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname, hash } = useLocation();
  const {
    totalCartItemsCount,
    cartPromotion,
    setMiniCartOpen,
    toasts,
    dismissToast,
    setToastsPaused,
    flyingItem,
    cartBadgeBump,
    pdpMobileBarVisible,
  } = useStore();
  const { canFlyToCart } = useMotionPreferences();
  const [scrolledPast600, setScrolledPast600] = useState(false);
  const [cartTargetPos, setCartTargetPos] = useState<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth - 80 : 1200,
    y: 40,
  });

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname, hash]);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPast600(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Measure target cart button coordinates when flyingItem starts
  useEffect(() => {
    if (!flyingItem || typeof document === 'undefined') return;
    const isDesktop = window.innerWidth >= 1024;
    const targetEl =
      document.querySelector(
        isDesktop ? '[data-cart-target="desktop"]' : '[data-cart-target="mobile"]'
      ) || document.querySelector('[data-cart-target="desktop"]');
    if (targetEl) {
      const r = targetEl.getBoundingClientRect();
      setCartTargetPos({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
  }, [flyingItem]);

  const isCartOrCheckout = pathname === '/gio-hang' || pathname === '/thanh-toan';
  const isProductDetail = pathname.startsWith('/san-pham/') && pathname !== '/san-pham';
  const mobileStickyBarActive =
    (isProductDetail && pdpMobileBarVisible) ||
    (pathname === '/gio-hang' && cartPromotion.lines.length > 0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#FFF5E4] text-[#171815]">
        <RouteProgressBar />
        <Header />
        <PageNavBar />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />

        <MiniCartDrawer />
        <SearchOverlay />

        {/* Fly-to-Cart Curved Flight Thumbnail (48px circle, 450ms) */}
        <AnimatePresence>
          {flyingItem && canFlyToCart && (
            <motion.div
              key={flyingItem.id}
              aria-hidden="true"
              initial={{
                x: flyingItem.startX - 24,
                y: flyingItem.startY - 24,
                scale: 1,
                opacity: 0.95,
              }}
              animate={{
                x: [
                  flyingItem.startX - 24,
                  (flyingItem.startX + cartTargetPos.x) / 2 - 24,
                  cartTargetPos.x - 24,
                ],
                y: [
                  flyingItem.startY - 24,
                  Math.min(flyingItem.startY, cartTargetPos.y) - 90,
                  cartTargetPos.y - 24,
                ],
                scale: [1, 1.08, 0.35],
                opacity: [0.95, 1, 0.2],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.45,
                ease: MOTION_TOKENS.easings.emphasized,
              }}
              className="fixed top-0 left-0 z-[80] w-12 h-12 rounded-full overflow-hidden border-2 border-[#951722] shadow-xl pointer-events-none bg-[#FFF5E4]"
            >
              <Img
                src={flyingItem.product.images[0].url}
                alt={flyingItem.product.name}
                theme={flyingItem.product.images[0].theme}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Stack:
            - Desktop (>=1024px): Only "Về đầu trang" button (single cart entry point is in the sticky header).
            - Mobile/Tablet (<1024px): Stack "Về đầu trang" above the floating cart with a 12px gap (gap-3),
              respecting env(safe-area-inset-bottom), and hide both while the sticky bottom CTA bar is shown. */}
        <div
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          className={`fixed right-4 sm:right-5 bottom-5 z-30 flex flex-col items-end gap-3 pointer-events-none ${
            mobileStickyBarActive ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* "Về đầu trang" Button (appears after 600px scroll) */}
          <AnimatePresence>
            {scrolledPast600 && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 12 }}
                transition={{
                  duration: MOTION_TOKENS.durations.fast,
                  ease: MOTION_TOKENS.easings.standard,
                }}
                onClick={scrollToTop}
                aria-label="Về đầu trang"
                title="Về đầu trang"
                className="pointer-events-auto w-11 h-11 rounded-full bg-[#FFFBF2] hover:bg-[#951722] text-[#951722] hover:text-[#FFF5E4] border-2 border-[#951722]/40 shadow-lg flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowUp className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Mobile/Tablet Floating Cart Button (< 1024px ONLY; hidden on desktop and on cart/checkout) */}
          {!isCartOrCheckout && (
            <button
              type="button"
              data-cart-target="mobile"
              onClick={() => setMiniCartOpen(true)}
              aria-label="Mở giỏ hàng nhanh"
              className={`pointer-events-auto lg:hidden bg-[#1F3D2A] hover:bg-[#951722] text-[#FFF5E4] px-4 py-3 rounded-2xl shadow-xl border-2 border-[#F3D27A]/60 flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                cartBadgeBump ? 'anim-cart-wiggle scale-110' : 'scale-100'
              }`}
            >
              <ShoppingBag className="w-5 h-5 text-[#F3D27A]" />
              <span className="font-bold text-sm">{totalCartItemsCount} món</span>
              <span aria-hidden="true" className="text-[#FFF5E4]/40">
                ·
              </span>
              <span className="font-price font-bold text-sm text-[#F3D27A]">
                <CountUp value={cartPromotion.finalTotal} formatter={formatPrice} />
              </span>
            </button>
          )}
        </div>

        {/* Stacked Toast Notifications (max 3, pause on hover, swipe to dismiss) */}
        <div
          onMouseEnter={() => setToastsPaused(true)}
          onMouseLeave={() => setToastsPaused(false)}
          className="fixed bottom-6 right-5 z-50 flex flex-col gap-2 items-end max-w-md w-[92%] sm:w-auto pointer-events-none"
        >
          <AnimatePresence initial={false}>
            {toasts.map((toast, idx) => {
              const isLatest = idx === toasts.length - 1;
              return (
                <motion.div
                  key={toast.id}
                  layout
                  drag="x"
                  dragConstraints={{ left: 0, right: 200 }}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) > 60) {
                      dismissToast(toast.id);
                    }
                  }}
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{
                    duration: 0.22,
                    ease: MOTION_TOKENS.easings.standard,
                  }}
                  role="status"
                  aria-live="polite"
                  data-testid={isLatest ? 'global-toast' : undefined}
                  className="pointer-events-auto bg-[#171815] text-[#FFF5E4] px-4 py-3 rounded-2xl shadow-2xl border border-[#F3D27A]/50 flex items-center justify-between gap-3 text-sm w-full sm:w-auto"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#F3D27A] shrink-0" />
                    <span>{toast.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    aria-label="Đóng thông báo"
                    className="text-[#FFF5E4]/60 hover:text-[#FFF5E4] p-1 cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
};
