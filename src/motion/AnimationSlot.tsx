import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Sparkles, Play } from 'lucide-react';
import {
  ANIMATION_SLOTS,
  AnimationSlotId,
  AnimationSlotType,
  AnimationTrigger,
} from '../data/animations';
import { shouldShowAnimationPlaceholders } from '../data/siteConfig';
import { useMotionPreferences } from './settings';

const LazyLottie = React.lazy(() =>
  import('lottie-react').then((m) => ({ default: ((m as any).default ?? m) as React.ComponentType<any> }))
);

export interface AnimationSlotProps {
  id: AnimationSlotId;
  type?: AnimationSlotType;
  src?: string;
  trigger?: AnimationTrigger;
  fallbackSrc?: string;
  aspectRatio?: string;
  loop?: boolean;
  speed?: number;
  className?: string;
  /** Compact inline mode (e.g. inside mini-cart banner or small ornament) */
  compact?: boolean;
}

export const AnimationSlot: React.FC<AnimationSlotProps> = ({
  id,
  type: propType,
  src: propSrc,
  trigger: propTrigger,
  fallbackSrc: propFallbackSrc,
  aspectRatio: propAspect,
  loop: propLoop,
  speed: propSpeed,
  className = '',
  compact = false,
}) => {
  const slot = ANIMATION_SLOTS[id];
  const { reducedMotion } = useMotionPreferences();
  const showPlaceholders = shouldShowAnimationPlaceholders();

  const type = propType || slot?.type || 'svg';
  const src = (propSrc !== undefined ? propSrc : slot?.src || '').trim();
  const trigger = propTrigger || slot?.trigger || 'loop';
  const fallbackSrc = (
    propFallbackSrc !== undefined ? propFallbackSrc : slot?.fallbackSrc || ''
  ).trim();
  const aspectRatio = propAspect || slot?.aspectRatio || '16 / 9';
  const loop = propLoop !== undefined ? propLoop : (slot?.loop ?? true);
  const speed = propSpeed !== undefined ? propSpeed : (slot?.speed ?? 1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(true);
  const [hasTriggeredOnce, setHasTriggeredOnce] = useState(false);
  const [lottieData, setLottieData] = useState<Record<string, unknown> | null>(null);
  const [assetError, setAssetError] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  // Pause off-screen animations via IntersectionObserver
  useEffect(() => {
    if (!src && !showPlaceholders) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
          if (entry.isIntersecting) {
            setHasTriggeredOnce(true);
          }
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, showPlaceholders]);

  // Control HTML5 video playback when off-screen or reduced-motion
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.playbackRate = speed;
    if (reducedMotion || !inView) {
      vid.pause();
    } else if (trigger === 'loop' || (trigger === 'scroll' && inView) || trigger === 'once') {
      vid.play().catch(() => {});
    }
  }, [inView, reducedMotion, speed, trigger]);

  // Fetch Lottie JSON if src is configured and ends with .json
  useEffect(() => {
    setAssetError(false);
    setLottieData(null);
    if (!src || type !== 'lottie') return;

    let cancelled = false;
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load Lottie JSON');
        return r.json();
      })
      .then((json) => {
        if (!cancelled) setLottieData(json);
      })
      .catch(() => {
        if (!cancelled) setAssetError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [src, type]);

  // P0-3: When SHOW_ANIMATION_PLACEHOLDERS is false (and no ?slots=1) and slot has no src, render nothing and take no space
  if (!src && !showPlaceholders) {
    return null;
  }

  const isPlaying = !reducedMotion && (inView || (trigger === 'once' && hasTriggeredOnce));

  // Render built-in heritage artwork for each of the 13 slots
  const renderBuiltInArtwork = () => {
    switch (id) {
      case 'home-hero-ornament':
        return (
          <svg
            viewBox="0 0 320 56"
            className="w-full max-w-[320px] h-12 mx-auto overflow-visible"
            aria-hidden="true"
          >
            <path
              d="M12 28 C60 8, 108 48, 160 28 C212 8, 260 48, 308 28"
              fill="none"
              stroke="#951722"
              strokeWidth="2"
              strokeDasharray="340"
              strokeDashoffset={isPlaying ? '0' : '0'}
              className={isPlaying ? 'anim-stroke-draw' : ''}
            />
            <path
              d="M44 28 C84 18, 124 38, 160 28 C196 18, 236 38, 276 28"
              fill="none"
              stroke="#1F3D2A"
              strokeWidth="1.2"
              strokeDasharray="6 4"
            />
            <circle cx="160" cy="28" r="10" fill="#951722" />
            <circle
              cx="160"
              cy="28"
              r="15"
              fill="none"
              stroke="#F3D27A"
              strokeWidth="1.5"
              className={isPlaying ? 'anim-slow-spin origin-center' : ''}
            />
            <circle cx="44" cy="28" r="4" fill="#1F3D2A" />
            <circle cx="276" cy="28" r="4" fill="#1F3D2A" />
          </svg>
        );

      case 'home-section-divider':
        return (
          <svg
            viewBox="0 0 480 36"
            className="w-full max-w-[480px] h-9 mx-auto overflow-visible"
            aria-hidden="true"
          >
            <line
              x1="16"
              y1="18"
              x2="205"
              y2="18"
              stroke="#951722"
              strokeWidth="1.5"
              strokeDasharray="200"
              className={isPlaying ? 'anim-stroke-draw' : ''}
            />
            <line
              x1="275"
              y1="18"
              x2="464"
              y2="18"
              stroke="#951722"
              strokeWidth="1.5"
              strokeDasharray="200"
              className={isPlaying ? 'anim-stroke-draw' : ''}
            />
            <polygon
              points="240,6 254,18 240,30 226,18"
              fill="#FFF5E4"
              stroke="#951722"
              strokeWidth="2"
            />
            <circle cx="240" cy="18" r="4" fill="#1F3D2A" />
          </svg>
        );

      case 'home-gift-unbox':
      case 'product-detail-box-open':
        return (
          <svg
            viewBox="0 0 260 150"
            className="w-44 h-28 mx-auto overflow-visible"
            aria-hidden="true"
          >
            <polygon
              points="130,36 196,60 196,112 130,136 64,112 64,60"
              fill="#951722"
              stroke="#F3D27A"
              strokeWidth="2"
            />
            <polygon
              points="130,22 198,46 130,70 62,46"
              fill="#9B0514"
              stroke="#F3D27A"
              strokeWidth="2"
              className={isPlaying ? 'anim-lid-float' : ''}
            />
            <circle cx="130" cy="46" r="10" fill="#F3D27A" />
            <path
              d="M95 88 L130 104 L165 88"
              fill="none"
              stroke="#FFF5E4"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'cart-empty':
        return (
          <svg
            viewBox="0 0 140 120"
            className="w-28 h-24 mx-auto overflow-visible"
            aria-hidden="true"
          >
            <path
              d="M20 38 Q70 22 120 38"
              fill="none"
              stroke="#951722"
              strokeWidth="3"
              strokeLinecap="round"
              className={isPlaying ? 'anim-gentle-sway' : ''}
            />
            <line x1="35" y1="34" x2="26" y2="74" stroke="#1F3D2A" strokeWidth="1.5" />
            <line x1="35" y1="34" x2="44" y2="74" stroke="#1F3D2A" strokeWidth="1.5" />
            <path d="M18 74 Q35 94 52 74 Z" fill="#F5E6CC" stroke="#951722" strokeWidth="2" />
            <line x1="105" y1="34" x2="96" y2="74" stroke="#1F3D2A" strokeWidth="1.5" />
            <line x1="105" y1="34" x2="114" y2="74" stroke="#1F3D2A" strokeWidth="1.5" />
            <path d="M88 74 Q105 94 122 74 Z" fill="#F5E6CC" stroke="#951722" strokeWidth="2" />
          </svg>
        );

      case 'add-to-cart-success':
        return (
          <svg
            viewBox="0 0 44 44"
            className="w-9 h-9 shrink-0 overflow-visible"
            aria-hidden="true"
          >
            <circle
              cx="22"
              cy="22"
              r="19"
              fill="#1F3D2A"
              stroke="#F3D27A"
              strokeWidth="2"
            />
            <path
              d="M14 22.5 L19.5 28 L30.5 16.5"
              fill="none"
              stroke="#F3D27A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="36"
              className={isPlaying ? 'anim-stroke-draw' : ''}
            />
          </svg>
        );

      case 'order-success-stamp':
        return (
          <svg
            viewBox="0 0 140 140"
            className={`w-28 h-28 mx-auto overflow-visible ${
              isPlaying ? 'anim-woodblock-stamp' : ''
            }`}
            aria-hidden="true"
          >
            <rect
              x="18"
              y="18"
              width="104"
              height="104"
              rx="14"
              fill="#951722"
              stroke="#F3D27A"
              strokeWidth="3"
            />
            <rect
              x="26"
              y="26"
              width="88"
              height="88"
              rx="10"
              fill="none"
              stroke="#FFF5E4"
              strokeWidth="1.5"
              strokeDasharray="6 3"
            />
            <path
              d="M48 72 L63 87 L94 54"
              fill="none"
              stroke="#F3D27A"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="80"
              className={isPlaying ? 'anim-stroke-draw' : ''}
            />
          </svg>
        );

      case 'payment-failed':
        return (
          <svg
            viewBox="0 0 120 120"
            className="w-24 h-24 mx-auto overflow-visible"
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="60"
              r="46"
              fill="#9B0514"
              fillOpacity="0.12"
              stroke="#9B0514"
              strokeWidth="3"
            />
            <path
              d="M44 44 L76 76 M76 44 L44 76"
              fill="none"
              stroke="#9B0514"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="60"
              className={isPlaying ? 'anim-stroke-draw' : ''}
            />
          </svg>
        );

      case 'search-empty':
        return (
          <svg
            viewBox="0 0 140 110"
            className="w-28 h-22 mx-auto overflow-visible"
            aria-hidden="true"
          >
            <line x1="70" y1="8" x2="70" y2="24" stroke="#951722" strokeWidth="2" />
            <ellipse
              cx="70"
              cy="54"
              rx="32"
              ry="28"
              fill="#FFF5E4"
              stroke="#951722"
              strokeWidth="2.5"
              className={isPlaying ? 'anim-gentle-sway' : ''}
            />
            <path d="M54 30 Q70 54 54 78" fill="none" stroke="#951722" strokeWidth="1.2" />
            <path d="M86 30 Q70 54 86 78" fill="none" stroke="#951722" strokeWidth="1.2" />
            <line x1="70" y1="82" x2="70" y2="98" stroke="#1F3D2A" strokeWidth="2.5" />
          </svg>
        );

      case 'page-loader':
        return (
          <svg
            viewBox="0 0 80 80"
            className={`w-16 h-16 mx-auto ${isPlaying ? 'anim-slow-spin' : ''}`}
            aria-hidden="true"
          >
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#951722"
              strokeWidth="3"
              strokeDasharray="18 8"
            />
            <circle cx="40" cy="40" r="20" fill="#1F3D2A" />
            <circle cx="40" cy="40" r="7" fill="#F3D27A" />
          </svg>
        );

      case 'about-timeline-ornament':
        return (
          <svg
            viewBox="0 0 320 64"
            className="w-full max-w-[300px] h-14 mx-auto overflow-visible"
            aria-hidden="true"
          >
            <path
              d="M10 38 Q50 14, 90 38 T170 38 T250 38 T310 38"
              fill="none"
              stroke="#F3D27A"
              strokeWidth="2.5"
              strokeDasharray="360"
              className={isPlaying ? 'anim-stroke-draw' : ''}
            />
            <circle cx="90" cy="38" r="5" fill="#FFF5E4" />
            <circle cx="170" cy="38" r="5" fill="#FFF5E4" />
            <circle cx="250" cy="38" r="5" fill="#FFF5E4" />
          </svg>
        );

      case 'promo-voucher-celebrate':
        return (
          <svg
            viewBox="0 0 260 64"
            className="w-full max-w-[240px] h-14 mx-auto overflow-visible"
            aria-hidden="true"
          >
            <rect
              x="40"
              y="12"
              width="180"
              height="40"
              rx="10"
              fill="#1F3D2A"
              stroke="#F3D27A"
              strokeWidth="2"
            />
            <circle cx="22" cy="24" r="4" fill="#951722" />
            <circle cx="238" cy="22" r="4" fill="#9B0514" />
            <circle cx="28" cy="44" r="3" fill="#F3D27A" />
            <circle cx="232" cy="44" r="3" fill="#F3D27A" />
            <path
              d="M116 32 L126 41 L146 22"
              fill="none"
              stroke="#F3D27A"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'page-404':
      default:
        return (
          <svg
            viewBox="0 0 240 120"
            className="w-48 h-24 mx-auto overflow-visible"
            aria-hidden="true"
          >
            <ellipse
              cx="120"
              cy="52"
              rx="78"
              ry="20"
              fill="#F5E6CC"
              stroke="#951722"
              strokeWidth="2.5"
              className={isPlaying ? 'anim-gentle-sway' : ''}
            />
            <ellipse cx="120" cy="52" rx="44" ry="10" fill="none" stroke="#1F3D2A" strokeWidth="1.5" />
            <path
              d="M78 62 Q120 105 162 62"
              fill="none"
              stroke="#951722"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
          </svg>
        );
    }
  };

  // 1. Reduced-motion static poster if fallbackSrc is provided
  if (reducedMotion && fallbackSrc && !assetError) {
    return (
      <div
        ref={containerRef}
        data-animation-slot={id}
        style={{ aspectRatio: compact ? undefined : aspectRatio }}
        className={`relative rounded-2xl overflow-hidden bg-[#FFF5E4] border border-[#951722]/30 flex items-center justify-center ${className}`}
      >
        <img src={fallbackSrc} alt={slot?.title || id} className="w-full h-full object-contain" />
      </div>
    );
  }

  // 2. Real Lottie JSON asset when `src` is provided
  if (src && type === 'lottie' && lottieData && !assetError) {
    return (
      <div
        ref={containerRef}
        data-animation-slot={id}
        style={{ aspectRatio: compact ? undefined : aspectRatio }}
        className={`relative rounded-2xl overflow-hidden bg-[#FFF5E4] border border-[#951722]/25 flex items-center justify-center ${className}`}
      >
        <Suspense fallback={renderBuiltInArtwork()}>
          <LazyLottie
            animationData={lottieData}
            loop={!reducedMotion && loop}
            autoplay={isPlaying}
            className="w-full h-full"
          />
        </Suspense>
      </div>
    );
  }

  // 3. Real Video (.webm / .mp4) when `src` is provided
  if (src && type === 'video' && !assetError) {
    return (
      <div
        ref={containerRef}
        data-animation-slot={id}
        style={{ aspectRatio: compact ? undefined : aspectRatio }}
        className={`relative rounded-2xl overflow-hidden bg-[#FFF5E4] border border-[#951722]/25 flex items-center justify-center ${className}`}
      >
        <video
          ref={videoRef}
          src={src}
          poster={fallbackSrc || undefined}
          loop={!reducedMotion && loop}
          muted
          playsInline
          onError={() => setAssetError(true)}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // 4. Real SVG / Image asset when `src` is provided
  if (src && (type === 'svg' || type === 'css') && !assetError) {
    return (
      <div
        ref={containerRef}
        data-animation-slot={id}
        style={{ aspectRatio: compact ? undefined : aspectRatio }}
        className={`relative rounded-2xl overflow-hidden bg-[#FFF5E4] border border-[#951722]/25 flex items-center justify-center ${className}`}
      >
        <img
          src={src}
          alt={slot?.title || id}
          onError={() => setAssetError(true)}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // 5. Compact mode (only reached if showPlaceholders is true or src fallback)
  if (compact) {
    return (
      <div
        ref={containerRef}
        data-animation-slot={id}
        className={`inline-flex items-center justify-center ${className}`}
      >
        {renderBuiltInArtwork()}
      </div>
    );
  }

  // 6. Optional Developer Slot Preview (only when SHOW_ANIMATION_PLACEHOLDERS = true or ?slots=1)
  return (
    <div
      ref={containerRef}
      data-animation-slot={id}
      onClick={() => {
        if (trigger === 'click' || trigger === 'once') {
          setPlayCount((c) => c + 1);
        }
      }}
      className={`relative rounded-2xl overflow-hidden bg-[#FFF5E4] double-border-heritage p-3.5 sm:p-4 text-center transition-colors ${className}`}
    >
      <div key={playCount} className="relative z-10 flex flex-col items-center justify-center gap-2">
        {renderBuiltInArtwork()}

        {showPlaceholders && slot && (
          <div className="space-y-0.5 pt-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#951722]/10 border border-[#951722]/25 text-[#951722] text-xs">
              <Play className="w-3 h-3 fill-[#951722]" />
              <span>{slot.title}</span>
            </div>
            <p className="text-xs text-[#1F3D2A]/85 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-[#951722] shrink-0" />
              <span>{slot.description}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
