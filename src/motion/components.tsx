import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { MOTION_TOKENS, getStaggerDelay } from './tokens';
import { MOTION_SETTINGS, useMotionPreferences } from './settings';
import { formatPrice } from '../data/products';

/* ============================================================================
 * 1. <Reveal /> — Scroll-in reveal (once: true by default, never hides if JS fails)
 * ========================================================================== */
export interface RevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  once?: boolean;
  className?: string;
  as?: 'div' | 'section' | 'article';
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  once = true,
  className = '',
  as = 'div',
}) => {
  const { reducedMotion } = useMotionPreferences();
  const [settled, setSettled] = useState(false);

  if (!MOTION_SETTINGS.ENABLE_SCROLL_REVEAL || reducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const dist = MOTION_TOKENS.distances.reveal;
  const initialOffset =
    direction === 'up'
      ? { y: dist }
      : direction === 'down'
      ? { y: -dist }
      : direction === 'left'
      ? { x: dist }
      : direction === 'right'
      ? { x: -dist }
      : {};

  const MotionTag = motion[as];

  return (
    <MotionTag
      initial={{ opacity: 0.01, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-40px' }}
      transition={{
        duration: MOTION_TOKENS.durations.base,
        delay,
        ease: MOTION_TOKENS.easings.standard,
      }}
      onAnimationComplete={() => setSettled(true)}
      style={settled ? { transform: 'none' } : undefined}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

/* ============================================================================
 * 2. <Stagger /> & <StaggerItem /> — Sibling stagger (60ms, capped at 8 items)
 * ========================================================================== */
export interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  baseDelay?: number;
  once?: boolean;
}

export const Stagger: React.FC<StaggerProps> = ({
  children,
  className = '',
  baseDelay = 0,
  once = true,
}) => {
  const { reducedMotion } = useMotionPreferences();
  const items = React.Children.toArray(children);

  if (!MOTION_SETTINGS.ENABLE_SCROLL_REVEAL || reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {items.map((child, idx) => (
        <Reveal
          key={(child as React.ReactElement)?.key ?? idx}
          delay={getStaggerDelay(idx, baseDelay)}
          once={once}
        >
          {child}
        </Reveal>
      ))}
    </div>
  );
};

/* ============================================================================
 * 3. <PageTransition /> & <RouteProgressBar /> — Section 1 Page Transitions
 *    CRITICAL: Never leaves transform on ancestors of position: sticky!
 * ========================================================================== */
export const RouteProgressBar: React.FC = () => {
  const location = useLocation();
  const [progress, setProgress] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    setVisible(true);
    setProgress(35);
    const t1 = setTimeout(() => setProgress(82), 90);
    const t2 = setTimeout(() => setProgress(100), 220);
    const t3 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 380);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [location.pathname, location.search]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      data-testid="route-progress-bar"
      className="fixed top-0 left-0 right-0 z-[70] h-[3px] pointer-events-none overflow-hidden"
    >
      <div
        className="h-full bg-[#951722] origin-left transition-transform duration-200 ease-out"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
};

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { reducedMotion } = useMotionPreferences();
  const [animDone, setAnimDone] = useState(false);

  // On pages with sticky columns (/san-pham/:slug, /gio-hang, /thanh-toan, /bai-viet/:slug),
  // never apply a 2D/3D transform to the page wrapper because CSS position:sticky breaks
  // if ANY ancestor has transform !== 'none'.
  const hasStickyDescendant =
    (location.pathname.startsWith('/san-pham/') && location.pathname !== '/san-pham') ||
    location.pathname === '/gio-hang' ||
    location.pathname === '/thanh-toan' ||
    location.pathname.startsWith('/bai-viet/');

  useEffect(() => {
    setAnimDone(false);
  }, [location.pathname]);

  if (!MOTION_SETTINGS.ENABLE_PAGE_TRANSITIONS) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={
          reducedMotion || hasStickyDescendant
            ? { opacity: 0.92 }
            : { opacity: 0, y: MOTION_TOKENS.distances.pageRise }
        }
        animate={
          reducedMotion || hasStickyDescendant
            ? { opacity: 1 }
            : { opacity: 1, y: 0 }
        }
        exit={{
          opacity: 0,
          transition: {
            duration: reducedMotion ? 0.1 : 0.15,
            ease: MOTION_TOKENS.easings.exit,
          },
        }}
        transition={{
          duration: reducedMotion ? 0.12 : MOTION_TOKENS.durations.base,
          ease: MOTION_TOKENS.easings.standard,
        }}
        onAnimationComplete={() => setAnimDone(true)}
        transformTemplate={(_, generated) => {
          if (hasStickyDescendant || animDone) return 'none';
          if (generated === 'none' || generated.includes('translateY(0px)')) return 'none';
          return generated;
        }}
        style={hasStickyDescendant || animDone ? { transform: 'none' } : undefined}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/* ============================================================================
 * 4. <Magnetic /> — Subtle desktop-only magnetic hover wrapper (±3px)
 * ========================================================================== */
export const Magnetic: React.FC<{
  children: React.ReactNode;
  className?: string;
  strength?: number;
}> = ({ children, className = '', strength = 3 }) => {
  const { reducedMotion, isMobile } = useMotionPreferences();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement | null>(null);

  if (reducedMotion || isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        setOffset({
          x: Number((relX * strength).toFixed(2)),
          y: Number((relY * strength).toFixed(2)),
        });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={{
        transform:
          offset.x === 0 && offset.y === 0
            ? undefined
            : `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

/* ============================================================================
 * 5. <CountUp /> & <AnimatedPrice /> — Smooth 400ms number tween & price flash
 * ========================================================================== */
export interface CountUpProps {
  value: number;
  formatter?: (val: number) => string;
  durationMs?: number;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  formatter = (v) => Math.round(v).toLocaleString('vi-VN'),
  durationMs = 400,
  className = '',
}) => {
  const { reducedMotion } = useMotionPreferences();
  const [displayValue, setDisplayValue] = useState<number>(value);
  const prevValueRef = useRef<number>(value);

  useEffect(() => {
    if (reducedMotion || prevValueRef.current === value) {
      setDisplayValue(value);
      prevValueRef.current = value;
      return;
    }

    const startValue = prevValueRef.current;
    const delta = value - startValue;
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayValue(Math.round(startValue + delta * eased));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
        prevValueRef.current = value;
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [value, durationMs, reducedMotion]);

  return <span className={className}>{formatter(displayValue)}</span>;
};

export interface AnimatedPriceProps {
  value: number;
  className?: string;
  /** Show struck-through old value for 1.5s when price decreases (e.g. voucher applied) */
  showOldStrike?: boolean;
  prefix?: string;
  testId?: string;
}

export const AnimatedPrice: React.FC<AnimatedPriceProps> = ({
  value,
  className = '',
  showOldStrike = false,
  prefix = '',
  testId,
}) => {
  const { reducedMotion } = useMotionPreferences();
  const [flashing, setFlashing] = useState(false);
  const [tempOldValue, setTempOldValue] = useState<number | null>(null);
  const prevRef = useRef<number>(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      if (showOldStrike && value < prevRef.current) {
        setTempOldValue(prevRef.current);
      }
      setFlashing(true);
      prevRef.current = value;
      const flashTimer = setTimeout(() => setFlashing(false), 420);
      const oldTimer = setTimeout(() => setTempOldValue(null), 1500);
      return () => {
        clearTimeout(flashTimer);
        clearTimeout(oldTimer);
      };
    }
  }, [value, showOldStrike]);

  return (
    <span className="inline-flex items-baseline gap-2">
      <AnimatePresence>
        {tempOldValue !== null && !reducedMotion && (
          <motion.span
            key={`old-${tempOldValue}`}
            initial={{ opacity: 0.85, x: -4 }}
            animate={{ opacity: 0.55, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="font-price text-sm text-[#171815]/50 line-through"
          >
            {formatPrice(tempOldValue)}
          </motion.span>
        )}
      </AnimatePresence>
      <span
        data-testid={testId}
        className={`font-price inline-block transition-transform duration-200 ${
          flashing && !reducedMotion ? 'text-[#9B0514] scale-[1.04]' : ''
        } ${className}`}
      >
        {prefix}
        <CountUp value={value} formatter={formatPrice} durationMs={400} />
      </span>
    </span>
  );
};

/* ============================================================================
 * 6. <RollingNumber /> — Slot-machine vertical digit roll (180ms) for quantity
 * ========================================================================== */
export const RollingNumber: React.FC<{
  value: number;
  className?: string;
  testId?: string;
}> = ({ value, className = '', testId }) => {
  const { reducedMotion } = useMotionPreferences();
  const prevRef = useRef<number>(value);
  const direction = value >= prevRef.current ? 1 : -1;

  useEffect(() => {
    prevRef.current = value;
  }, [value]);

  if (reducedMotion) {
    return (
      <span data-testid={testId} className={`font-price ${className}`}>
        {value}
      </span>
    );
  }

  return (
    <span
      data-testid={testId}
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: direction * 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction * -14, opacity: 0 }}
          transition={{ duration: 0.18, ease: MOTION_TOKENS.easings.standard }}
          className="font-price inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

/* ============================================================================
 * 7. <MicroConfetti /> — 6–8 tiny gold & red dots burst in 500ms (Section 7)
 * ========================================================================== */
const CONFETTI_DOTS = [
  { dx: -26, dy: -22, color: '#F3D27A' },
  { dx: -12, dy: -30, color: '#951722' },
  { dx: 6, dy: -28, color: '#F3D27A' },
  { dx: 24, dy: -20, color: '#9B0514' },
  { dx: -22, dy: 16, color: '#951722' },
  { dx: 0, dy: 24, color: '#F3D27A' },
  { dx: 22, dy: 18, color: '#1F3D2A' },
];

export const MicroConfetti: React.FC<{ active: boolean }> = ({ active }) => {
  const { canMicroConfetti } = useMotionPreferences();
  if (!active || !canMicroConfetti) return null;

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-20"
    >
      {CONFETTI_DOTS.map((dot, idx) => (
        <motion.span
          key={idx}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
          animate={{ x: dot.dx, y: dot.dy, scale: 1, opacity: 0 }}
          transition={{ duration: 0.5, ease: MOTION_TOKENS.easings.standard }}
          style={{ backgroundColor: dot.color }}
          className="absolute w-1.5 h-1.5 rounded-full"
        />
      ))}
    </span>
  );
};

/* ============================================================================
 * 8. <WordRevealQuote /> — Word-group opacity reveal on scroll (keeps justify)
 * ========================================================================== */
export const WordRevealQuote: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = '' }) => {
  const { reducedMotion } = useMotionPreferences();
  // Group into chunks of ~4 words so DOM stays light and justified spacing stays identical
  const words = text.split(' ');
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += 4) {
    chunks.push(words.slice(i, i + 4).join(' '));
  }

  if (reducedMotion || !MOTION_SETTINGS.ENABLE_SCROLL_REVEAL) {
    return (
      <p lang="vi" className={className}>
        “{text}”
      </p>
    );
  }

  return (
    <motion.p
      lang="vi"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.035,
          },
        },
      }}
      className={className}
    >
      “
      {chunks.map((chunk, i) => (
        <React.Fragment key={i}>
          <motion.span
            variants={{
              hidden: { opacity: 0.25 },
              visible: { opacity: 1, transition: { duration: 0.32 } },
            }}
          >
            {chunk}
          </motion.span>
          {i < chunks.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
      ”
    </motion.p>
  );
};
