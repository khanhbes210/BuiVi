/**
 * Motion Design Tokens — Single source of truth for BÙI VỊ animations.
 * Brand feeling: giấy Điệp (soft shimmer), tranh Đông Hồ (woodblock stamp),
 * and a heritage gift box being unwrapped.
 */

export const MOTION_TOKENS = {
  /** Durations in seconds (for motion/react) */
  durations: {
    instant: 0.12, // 120ms
    fast: 0.2,     // 200ms
    base: 0.32,    // 320ms
    slow: 0.52,    // 520ms
    hero: 0.8,     // 800ms (max interactive animation duration)
  },
  /** Durations in milliseconds (for timers / CSS) */
  durationsMs: {
    instant: 120,
    fast: 200,
    base: 320,
    slow: 520,
    hero: 800,
  },
  /** Cubic-bezier easing tuples for motion/react */
  easings: {
    standard: [0.22, 1, 0.36, 1] as const,   // soft ease-out
    emphasized: [0.16, 1, 0.3, 1] as const,  // refined heritage deceleration
    exit: [0.4, 0, 1, 1] as const,           // crisp exit
  },
  /** CSS cubic-bezier strings */
  easingsCss: {
    standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
    emphasized: 'cubic-bezier(0.16, 1, 0.3, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  /** Standard distances */
  distances: {
    reveal: 24,       // 24px scroll reveal offset
    pageRise: 12,     // 12px route incoming rise
    drawer: '100%',   // full drawer slide
    hoverLift: 4,     // 4px card hover lift
  },
  /** Sibling stagger configuration */
  stagger: {
    step: 0.06,       // 60ms between siblings
    stepMs: 60,
    maxItems: 8,      // max 8 items staggered; items >= 8 appear with item 8
  },
} as const;

/** Helper to calculate capped stagger delay in seconds */
export function getStaggerDelay(index: number, baseDelay = 0): number {
  const cappedIndex = Math.min(Math.max(0, index), MOTION_TOKENS.stagger.maxItems - 1);
  return Number((baseDelay + cappedIndex * MOTION_TOKENS.stagger.step).toFixed(3));
}
