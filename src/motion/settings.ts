import { useState, useEffect } from 'react';

/**
 * Easy-to-toggle motion feature flags (Section 13).
 * Set any flag to false to disable that effect without deleting code.
 */
export const MOTION_SETTINGS = {
  ENABLE_PAGE_TRANSITIONS: true,
  ENABLE_SCROLL_REVEAL: true,
  ENABLE_PARALLAX: true,
  ENABLE_FLY_TO_CART: true,
  ENABLE_MICRO_CONFETTI: true,
  ENABLE_HERO_KENBURNS: true,
  ENABLE_MARQUEE: true,
};

export const ENABLE_PAGE_TRANSITIONS = MOTION_SETTINGS.ENABLE_PAGE_TRANSITIONS;
export const ENABLE_SCROLL_REVEAL = MOTION_SETTINGS.ENABLE_SCROLL_REVEAL;
export const ENABLE_PARALLAX = MOTION_SETTINGS.ENABLE_PARALLAX;
export const ENABLE_FLY_TO_CART = MOTION_SETTINGS.ENABLE_FLY_TO_CART;
export const ENABLE_MICRO_CONFETTI = MOTION_SETTINGS.ENABLE_MICRO_CONFETTI;
export const ENABLE_HERO_KENBURNS = MOTION_SETTINGS.ENABLE_HERO_KENBURNS;
export const ENABLE_MARQUEE = MOTION_SETTINGS.ENABLE_MARQUEE;

export interface MotionPreferences {
  reducedMotion: boolean;
  isMobile: boolean;
  canParallax: boolean;
  canFlyToCart: boolean;
  canMicroConfetti: boolean;
  canKenBurns: boolean;
}

/**
 * Hook that tracks prefers-reduced-motion and mobile viewport (< 768px)
 * so heavy effects automatically degrade on mobile or reduced-motion mode.
 */
export function useMotionPreferences(): MotionPreferences {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    reducedMotion,
    isMobile,
    canParallax: MOTION_SETTINGS.ENABLE_PARALLAX && !reducedMotion && !isMobile,
    canFlyToCart: MOTION_SETTINGS.ENABLE_FLY_TO_CART && !reducedMotion,
    canMicroConfetti: MOTION_SETTINGS.ENABLE_MICRO_CONFETTI && !reducedMotion,
    canKenBurns: MOTION_SETTINGS.ENABLE_HERO_KENBURNS && !reducedMotion && !isMobile,
  };
}
