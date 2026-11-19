import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import entranceThumbImg from '../assets/images/opt/hero-entrance-thumb.webp';
import diningHallHeroImg from '../assets/images/opt/hero-second.webp';
import diningHallThumbImg from '../assets/images/opt/hero-second-thumb.webp';
import rooftopHeroImg from '../assets/images/opt/hero-third.webp';
import rooftopThumbImg from '../assets/images/opt/hero-third-thumb.webp';

const HERO_SLIDES = [
  {
    id: 'entrance',
    image: '/images/hero-entrance.webp',
    srcSet: '/images/hero-entrance-mobile.webp 800w, /images/hero-entrance.webp 1365w',
    thumb: entranceThumbImg,
    width: 1365,
    height: 768,
    alt: 'Grand entrance of Pearl Oasis restaurant in Kohat',
    label: 'Grand Entrance · Kohat',
  },
  {
    id: 'dining-hall',
    image: diningHallHeroImg,
    thumb: diningHallThumbImg,
    width: 1280,
    height: 960,
    alt: 'Warm wood and marble main dining hall at Pearl Oasis',
    label: 'Main Dining Hall',
  },
  {
    id: 'roadside',
    image: rooftopHeroImg,
    thumb: rooftopThumbImg,
    width: 1376,
    height: 768,
    alt: 'Evening roadside outdoor dining setup at Pearl Oasis',
    label: 'Roadside Outdoor Dining',
  },
];

const AUTOPLAY_INTERVAL_MS = 4500;

// Ensures the Hero title shimmer reveal plays only once per page load
let hasHeroTitleRevealed = false;

export default function Hero({ onOpenReservation, onNavigateToBookTable }) {
  const heroRef = useRef(null);
  const heroInnerRef = useRef(null);
  const thumbRefs = useRef([]);
  const revealLayerRef = useRef(null);
  const revealImgRef = useRef(null);
  const slideAnimsRef = useRef([]);
  const isTransitioningRef = useRef(false);

  // Slide 1 (/images/hero-entrance.webp, preloaded in index.html) is active on initial load
  const [activeIndex, setActiveIndex] = useState(0);
  const [baseIndex, setBaseIndex] = useState(0);
  const [incomingSlide, setIncomingSlide] = useState(null);
  const [autoplayResetTick, setAutoplayResetTick] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [titleRevealDone, setTitleRevealDone] = useState(
    () => hasHeroTitleRevealed || prefersReducedMotion
  );

  // Track prefers-reduced-motion changes dynamically
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        hasHeroTitleRevealed = true;
        setTitleRevealDone(true);
      }
    };
    setPrefersReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      hasHeroTitleRevealed = true;
      setTitleRevealDone(true);
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // Mark one-time hero title reveal complete after short GPU-composited reveal window
  useEffect(() => {
    if (titleRevealDone) return undefined;

    const completeTimer = window.setTimeout(() => {
      hasHeroTitleRevealed = true;
      setTitleRevealDone(true);
    }, 1850);

    return () => {
      window.clearTimeout(completeTimer);
    };
  }, [titleRevealDone]);

  const cancelSlideAnimations = useCallback(() => {
    slideAnimsRef.current.forEach((anim) => {
      try {
        anim.cancel();
      } catch {
        // Ignore already finished animations
      }
    });
    slideAnimsRef.current = [];
  }, []);

  // Trigger circular reveal transition from the selected thumbnail's center
  const transitionToSlide = useCallback(
    (targetIndex, isManual = false) => {
      if (targetIndex === activeIndex || isTransitioningRef.current) return;

      if (isManual) {
        setAutoplayResetTick((prev) => prev + 1);
      }

      if (prefersReducedMotion) {
        setActiveIndex(targetIndex);
        setBaseIndex(targetIndex);
        setIncomingSlide(null);
        return;
      }

      const heroEl = heroInnerRef.current;
      const thumbEl = thumbRefs.current[targetIndex];
      if (!heroEl) {
        setActiveIndex(targetIndex);
        setBaseIndex(targetIndex);
        return;
      }

      const heroRect = heroEl.getBoundingClientRect();
      let originX = heroRect.width * 0.88;
      let originY = heroRect.height * 0.5;
      let startRadius = 24;

      if (thumbEl) {
        const thumbRect = thumbEl.getBoundingClientRect();
        originX = thumbRect.left - heroRect.left + thumbRect.width / 2;
        originY = thumbRect.top - heroRect.top + thumbRect.height / 2;
        startRadius = Math.max(18, thumbRect.width / 2);
      }

      const endRadius =
        Math.ceil(
          Math.max(
            Math.hypot(originX, originY),
            Math.hypot(heroRect.width - originX, originY),
            Math.hypot(originX, heroRect.height - originY),
            Math.hypot(heroRect.width - originX, heroRect.height - originY)
          )
        ) + 24;

      isTransitioningRef.current = true;
      setActiveIndex(targetIndex);
      setIncomingSlide({
        index: targetIndex,
        originX,
        originY,
        startRadius,
        endRadius,
      });
    },
    [activeIndex, prefersReducedMotion]
  );

  // Run circular expansion + incoming zoom transition via native Web Animations API (zero GSAP bundle)
  useLayoutEffect(() => {
    if (!incomingSlide || !revealLayerRef.current || !revealImgRef.current) return;

    const { index, originX, originY, startRadius, endRadius } = incomingSlide;
    const layerEl = revealLayerRef.current;
    const imgEl = revealImgRef.current;

    cancelSlideAnimations();

    let cancelled = false;
    const finish = () => {
      if (cancelled) return;
      setBaseIndex(index);
      setIncomingSlide(null);
      isTransitioningRef.current = false;
    };

    if (typeof layerEl.animate !== 'function') {
      finish();
      return undefined;
    }

    const clipAnim = layerEl.animate(
      [
        { clipPath: `circle(${startRadius}px at ${originX}px ${originY}px)` },
        { clipPath: `circle(${endRadius}px at ${originX}px ${originY}px)` },
      ],
      {
        duration: 950,
        easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
        fill: 'forwards',
      }
    );

    const scaleAnim = imgEl.animate(
      [{ transform: 'scale(1.09)' }, { transform: 'scale(1)' }],
      {
        duration: 1050,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      }
    );

    slideAnimsRef.current = [clipAnim, scaleAnim];
    scaleAnim.onfinish = finish;

    return () => {
      cancelled = true;
      cancelSlideAnimations();
    };
  }, [incomingSlide, cancelSlideAnimations]);

  // Cleanup slide transition guard on unmount
  useEffect(() => {
    return () => {
      cancelSlideAnimations();
      isTransitioningRef.current = false;
    };
  }, [cancelSlideAnimations]);

  // Autoplay every 4.5s; resets on manual selection, pauses when tab hidden or reduced-motion
  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    let timerId = null;

    const clearTimer = () => {
      if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
      }
    };

    const startTimer = () => {
      clearTimer();
      if (document.hidden) return;
      timerId = window.setInterval(() => {
        if (document.hidden || isTransitioningRef.current) return;
        const nextIdx = (activeIndex + 1) % HERO_SLIDES.length;
        transitionToSlide(nextIdx, false);
      }, AUTOPLAY_INTERVAL_MS);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimer();
      } else {
        startTimer();
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeIndex, autoplayResetTick, prefersReducedMotion, transitionToSlide]);

  const handleEnterClick = (e) => {
    e.preventDefault();
    const target = document.getElementById('our-story');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const baseSlide = HERO_SLIDES[baseIndex];

  return (
    <section ref={heroRef} id="hero" className="hero relative min-h-screen bg-[#0B0708] overflow-hidden">
      <div ref={heroInnerRef} className="hero__inner relative w-full bg-[#0B0708]">
        {/* Background Slider Stage (Slide 1 preloaded in HTML for optimal LCP) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Base Slide Image */}
          <img
            src={baseSlide.image}
            srcSet={baseSlide.srcSet}
            sizes={baseSlide.srcSet ? '100vw' : undefined}
            width={baseSlide.width}
            height={baseSlide.height}
            alt={baseSlide.alt}
            loading="eager"
            decoding="async"
            fetchPriority={baseIndex === 0 ? 'high' : 'auto'}
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[1.03] contrast-[1.04]"
          />

          {/* Incoming Circular Reveal Layer */}
          {incomingSlide && (
            <div
              ref={revealLayerRef}
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `circle(${incomingSlide.startRadius}px at ${incomingSlide.originX}px ${incomingSlide.originY}px)`,
              }}
            >
              <img
                ref={revealImgRef}
                src={HERO_SLIDES[incomingSlide.index].image}
                srcSet={HERO_SLIDES[incomingSlide.index].srcSet}
                sizes={HERO_SLIDES[incomingSlide.index].srcSet ? '100vw' : undefined}
                width={HERO_SLIDES[incomingSlide.index].width}
                height={HERO_SLIDES[incomingSlide.index].height}
                alt={HERO_SLIDES[incomingSlide.index].alt}
                decoding="async"
                className="w-full h-full object-cover object-center filter brightness-[1.03] contrast-[1.04] will-change-transform"
                style={{ transform: 'scale(1.09)' }}
              />
            </div>
          )}

          {/* Subtle vignette keeping photography vibrant while preserving text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0708]/45 via-black/10 to-[#0B0708]/65" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 md:px-20 lg:px-24 text-center flex flex-col items-center justify-center w-full">
          {/* Concise Cross-Fading Slide Context Label */}
          <div
            className="hero-slide-caption relative h-5 sm:h-6 w-full max-w-xs mx-auto mb-1.5 sm:mb-2 overflow-hidden flex items-center justify-center"
            aria-live="polite"
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <span
                  key={slide.id}
                  className={`absolute inset-x-0 text-center text-[10px] sm:text-xs uppercase tracking-[0.28em] font-semibold text-[#E8CC8B] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] ${
                    prefersReducedMotion
                      ? isCurrent
                        ? 'opacity-100'
                        : 'opacity-0'
                      : `transition-[opacity,transform] duration-500 ease-out ${
                          isCurrent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5 pointer-events-none'
                        }`
                  }`}
                >
                  {slide.label}
                </span>
              );
            })}
          </div>

          {/* 1. "Welcome to" */}
          <p className="welcome font-script text-3xl sm:text-4xl md:text-5xl text-[#F5C369] tracking-wide mb-2 sm:mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] overflow-hidden">
            Welcome to
          </p>

          {/* 2. Main Heading: PEARL OASIS */}
          <div className="hero-heading-wrapper w-full flex items-center justify-center my-1 sm:my-2">
            <h1 className="hero-title w-full flex flex-row items-center justify-center flex-nowrap font-serif-heading font-bold uppercase tracking-[0.04em] sm:tracking-[0.08em] leading-none select-none">
              <span className="relative inline-flex flex-row items-center justify-center flex-nowrap gap-2.5 sm:gap-5 md:gap-7 overflow-hidden">
                {/* Base Original Heading Layer */}
                <span className="inline-flex flex-row items-center justify-center flex-nowrap gap-2.5 sm:gap-5 md:gap-7 text-[#F8F3E8] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] [text-shadow:_0_4px_24px_rgba(0,0,0,0.95)]">
                  <span className="hero-word-left text-[clamp(1.85rem,7.2vw,6.2rem)] leading-none">PEARL</span>
                  <span className="hero-word-right text-[clamp(1.85rem,7.2vw,6.2rem)] leading-none">OASIS</span>
                </span>

                {/* Pure GPU-Composited Gold Sweep Reveal (transform + opacity only, 0 non-composited animations) */}
                {!titleRevealDone && (
                  <span
                    aria-hidden="true"
                    onAnimationEnd={() => {
                      hasHeroTitleRevealed = true;
                      setTitleRevealDone(true);
                    }}
                    className="hero-title-shimmer pointer-events-none select-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#F5C369]/35 to-transparent"
                  />
                )}
              </span>
            </h1>
          </div>

          {/* 3. Tagline */}
          <p className="tagline font-script text-3xl sm:text-4xl md:text-5xl text-[#F5C369] tracking-wide mt-2.5 sm:mt-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] overflow-hidden">
            Come hungry, leave happy
          </p>

          {/* 4. Action Buttons */}
          <div className="buttons relative z-20 flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-[var(--gap)]">
            <a
              href="#our-story"
              onClick={handleEnterClick}
              className="inline-flex items-center gap-2 px-6 sm:px-10 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wider text-[#F8F3E8] bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:from-[#9B1C28] hover:to-[#D12B3D] hover:brightness-110 rounded-full transition-transform duration-300 shadow-[0_8px_30px_rgba(186,37,53,0.45)] hover:shadow-[0_12px_40px_rgba(186,37,53,0.65)] hover:scale-105 active:scale-95 cursor-pointer group whitespace-nowrap shrink-0"
            >
              <span>Enter Restaurant</span>
              <span className="text-base group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
            </a>

            {(onNavigateToBookTable || onOpenReservation) && (
              <button
                type="button"
                onClick={onNavigateToBookTable || onOpenReservation}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-medium tracking-wider text-[#F8F3E8] border border-[#C9A45C]/60 hover:border-[#F5C369] bg-[#18080B]/80 hover:bg-[#280D12] rounded-full transition-colors duration-300 cursor-pointer backdrop-blur-xs whitespace-nowrap shrink-0"
              >
                <span>Book A Table</span>
              </button>
            )}
          </div>
        </div>

        {/* Circular Thumbnail Slide Navigation (uses compact 5 KiB 160x160 WebP thumbs & GPU scale) */}
        <nav
          aria-label="Hero showcase slides"
          className="hero-thumbs absolute z-30 bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 flex flex-row items-center gap-2 sm:gap-3 md:bottom-auto md:left-auto md:right-6 lg:right-10 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:flex-col md:gap-3.5"
        >
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                ref={(el) => {
                  thumbRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => transitionToSlide(idx, true)}
                aria-label={`View slide ${idx + 1}: ${slide.label}`}
                aria-current={isActive ? 'true' : undefined}
                title={slide.label}
                className={`hero-thumb cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C369] shrink-0 ${
                  isActive ? 'hero-thumb--active' : ''
                }`}
              >
                <span aria-hidden="true" className="hero-thumb__ring hero-thumb__ring--1" />
                <span aria-hidden="true" className="hero-thumb__ring hero-thumb__ring--2" />

                <span
                  className={`hero-thumb__media block w-full h-full rounded-full overflow-hidden box-border ${
                    isActive
                      ? 'border-2 border-[#F5C369] opacity-100'
                      : 'border border-[#C9A45C]/50 opacity-75 hover:opacity-100'
                  } bg-[#18080B]`}
                >
                  <img
                    src={slide.thumb}
                    alt=""
                    width="78"
                    height="78"
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-center"
                  />
                </span>
              </button>
            );
          })}
        </nav>

        {/* Embedded CSS Styles (100% GPU-composited transform & opacity transitions) */}
        <style>{`
          :root {
            --nav-h: 72px;
            --gap: clamp(24px, 4vh, 48px);
          }

          .hero__inner {
            min-height: 100svh;
            padding-top: calc(var(--nav-h) + 16px);
            padding-bottom: 120px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          @media (min-width: 768px) {
            .hero__inner {
              padding-top: calc(var(--nav-h) + var(--gap));
              padding-bottom: calc(var(--gap) + 28px);
            }
          }

          .hero-thumbs {
            --d: 56px;
            overflow: visible;
          }

          @media (min-width: 640px) {
            .hero-thumbs {
              --d: 64px;
            }
          }

          @media (min-width: 768px) {
            .hero-thumbs {
              --d: 78px;
            }
          }

          .hero-thumb {
            position: relative;
            overflow: visible;
            width: var(--d);
            height: var(--d);
            box-sizing: border-box;
            border-radius: 50%;
          }

          .hero-thumb__media {
            position: relative;
            z-index: 2;
            transform: scale(0.64);
            transition: opacity 0.3s ease, transform 0.35s ease-out;
            will-change: transform, opacity;
          }

          .hero-thumb--active .hero-thumb__media {
            transform: scale(1);
          }

          .hero-thumb:not(.hero-thumb--active):hover .hero-thumb__media {
            transform: scale(0.72);
          }

          .hero-thumb__ring {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0.55);
            aspect-ratio: 1;
            border: 1px solid rgba(245, 195, 105, 0.8);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            z-index: 1;
            transition: opacity 0.7s ease, transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1);
            will-change: transform, opacity;
          }

          .hero-thumb__ring--1 {
            width: calc(var(--d) * 1.72);
            border-color: rgba(245, 195, 105, 0.8);
          }

          .hero-thumb__ring--2 {
            width: calc(var(--d) * 2.62);
            border-color: rgba(201, 164, 92, 0.45);
            transition-delay: 0.15s;
          }

          .hero-thumb--active .hero-thumb__ring {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }

          .hero-title-shimmer {
            transform: translate3d(-130%, 0, 0) skewX(-18deg);
            opacity: 0;
            will-change: transform, opacity;
            animation: heroTitleShimmer 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
          }

          @keyframes heroTitleShimmer {
            0% {
              transform: translate3d(-130%, 0, 0) skewX(-18deg);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            80% {
              opacity: 0.9;
            }
            100% {
              transform: translate3d(380%, 0, 0) skewX(-18deg);
              opacity: 0;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .hero-title-shimmer {
              display: none !important;
              animation: none !important;
            }
          }
        `}</style>

        {/* Subtle Scroll Indicator */}
        <a
          href="#our-story"
          onClick={handleEnterClick}
          aria-label="Scroll to Our Story"
          className="absolute bottom-1.5 sm:bottom-2.5 left-1/2 -translate-x-1/2 z-30 text-[#C9A45C]/80 hover:text-[#F5C369] transition-colors flex flex-col items-center gap-0.5 cursor-pointer pointer-events-auto"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Explore
          </span>
          <svg
            aria-hidden="true"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
