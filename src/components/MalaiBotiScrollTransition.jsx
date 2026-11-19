import React, { useEffect, useRef, useState } from 'react';
import malaiBotiImg from '../assets/images/opt/malai-boti.webp';

export default function MalaiBotiScrollTransition() {
  const dishRef = useRef(null);
  const scalerRef = useRef(null);
  const glowRef = useRef(null);
  const boundsRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Measure source and target coordinates relative to page document.
  // Called ONLY on mount, layout resize, or font settlement — never during scroll!
  const measure = () => {
    const sourceEl = document.getElementById('malai-boti-source-slot');
    const targetEl = document.getElementById('malai-boti-target-slot');
    if (!sourceEl || !targetEl || !dishRef.current) return false;

    const sRect = sourceEl.getBoundingClientRect();
    const tRect = targetEl.getBoundingClientRect();
    if (sRect.width <= 0 || sRect.height <= 0 || tRect.width <= 0 || tRect.height <= 0) {
      return false;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    boundsRef.current = {
      sourceX: sRect.left + scrollX,
      sourceY: sRect.top + scrollY,
      sourceW: sRect.width,
      sourceH: sRect.height,
      targetX: tRect.left + scrollX,
      targetY: tRect.top + scrollY,
      targetW: tRect.width,
      targetH: tRect.height,
      viewportH: window.innerHeight || 800,
    };

    // Set fixed base dimensions ONCE outside the scroll loop so scroll only mutates GPU transform
    dishRef.current.style.width = `${sRect.width}px`;
    dishRef.current.style.height = `${sRect.height}px`;

    return true;
  };

  useEffect(() => {
    let animationFrameId = null;
    let resizeRafId = null;

    const updatePosition = () => {
      if (!boundsRef.current || !dishRef.current) return;

      const {
        sourceX,
        sourceY,
        sourceW,
        sourceH,
        targetX,
        targetY,
        targetW,
        targetH,
        viewportH,
      } = boundsRef.current;

      const scrollY = window.scrollY || window.pageYOffset;

      // Flight begins as Section 2 scrolls past center, completes when Section 3 reaches view
      const flightStart = sourceY - viewportH * 0.40;
      const flightEnd = Math.max(flightStart + 200, targetY - viewportH * 0.58);

      let rawProgress = 0;
      if (scrollY <= flightStart) {
        rawProgress = 0;
      } else if (scrollY >= flightEnd) {
        rawProgress = 1;
      } else {
        rawProgress = (scrollY - flightStart) / (flightEnd - flightStart);
      }

      // Smooth cubic ease-in-out curve
      const p = rawProgress < 0.5
        ? 4 * rawProgress * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

      // Interpolate document coordinates + subtle parabolic arc lift
      const currentX = sourceX + (targetX - sourceX) * p;
      const arcLift = Math.sin(rawProgress * Math.PI) * -35;
      const currentY = sourceY + (targetY - sourceY) * p + arcLift;

      // Interpolate scale ratios relative to fixed sourceW/sourceH (100% GPU-composited, zero layout thrash)
      const currentW = sourceW + (targetW - sourceW) * p;
      const currentH = sourceH + (targetH - sourceH) * p;
      const boxScaleX = currentW / sourceW;
      const boxScaleY = currentH / sourceH;

      dishRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${boxScaleX}, ${boxScaleY})`;

      // Scale inner wrapper: 1.0 at Section 2 -> 1.55 at Section 3 to fill the circular gold frame edge-to-edge
      if (scalerRef.current) {
        const innerScale = 1.0 + p * 0.55;
        scalerRef.current.style.transform = `scale(${innerScale})`;
      }

      // Fade ambient radial shadow via GPU-composited opacity instead of mutating CSS filter
      if (glowRef.current) {
        glowRef.current.style.opacity = String(Math.max(0.15, 1 - p * 0.85));
      }
    };

    // Scroll handler NEVER calls getBoundingClientRect() — eliminates forced synchronous reflows
    const onScroll = () => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(() => {
        animationFrameId = null;
        updatePosition();
      });
    };

    const scheduleRemeasure = () => {
      if (resizeRafId) return;
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        if (measure()) {
          setIsReady(true);
          updatePosition();
        }
      });
    };

    // Initial measurement after mount
    const timer = setTimeout(() => {
      if (measure()) {
        setIsReady(true);
        updatePosition();
      }
    }, 60);

    // Re-measure once web fonts finish loading in case heading metrics shifted vertical offset
    let cancelled = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) scheduleRemeasure();
      });
    }

    // Watch source/target section resizing without polling on scroll
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(scheduleRemeasure);
      const ourStoryEl = document.getElementById('our-story');
      const signaturesEl = document.getElementById('signatures');
      if (ourStoryEl) resizeObserver.observe(ourStoryEl);
      if (signaturesEl) resizeObserver.observe(signaturesEl);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', scheduleRemeasure, { passive: true });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scheduleRemeasure);
    };
  }, []);

  const handleDishClick = () => {
    const targetCard = document.querySelector('[data-specialty-card="specialty-malai-boti"]');
    if (targetCard) {
      targetCard.click();
    }
  };

  return (
    <div
      ref={dishRef}
      onClick={handleDishClick}
      className={`absolute top-0 left-0 z-30 select-none cursor-pointer transition-opacity duration-300 ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transformOrigin: 'top left',
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      {/* GPU-composited shadow halo replacing per-frame CSS filter drop-shadow mutation */}
      <div
        ref={glowRef}
        className="absolute -inset-3 rounded-full pointer-events-none bg-[radial-gradient(circle_at_50%_58%,rgba(0,0,0,0.88)_0%,rgba(138,24,38,0.34)_48%,transparent_72%)]"
        style={{ willChange: 'opacity' }}
      />

      <div className="w-full h-full relative rounded-full overflow-hidden flex items-center justify-center">
        {/* Dedicated Scaling Wrapper: free of rotate keyframes so transform: scale(...) is never overwritten */}
        <div
          ref={scalerRef}
          className="w-full h-full flex items-center justify-center pointer-events-auto"
          style={{
            transform: 'scale(1)',
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          <img
            src={malaiBotiImg}
            alt="Artisanal chicken malai boti specialty dish"
            width={436}
            height={573}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain animate-spin-slow motion-reduce:animate-none hover:[animation-play-state:paused]"
            style={{
              animationDuration: '26s',
            }}
          />
        </div>
      </div>
    </div>
  );
}
