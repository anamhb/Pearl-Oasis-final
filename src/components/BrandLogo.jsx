import React, { Suspense, useEffect, useRef, useState } from 'react';
import logoTextImg from '../assets/images/opt/logo-text.webp';
import Logo3D from './Logo3D.jsx';

function CrestPlaceholder() {
  return (
    <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 36 36" className="w-6 h-6 text-[#F5C369] drop-shadow-[0_2px_10px_rgba(255,215,0,0.45)]" fill="none">
        <path
          d="M18 4L25 14L22 25L18 32L14 25L11 14L18 4Z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="rgba(245, 195, 105, 0.25)"
        />
        <circle cx="18" cy="16" r="3" fill="#FFD700" />
      </svg>
    </div>
  );
}

export default function BrandLogo({ variant = "navbar", className = "" }) {
  const wrapperRef = useRef(null);
  const [shouldMount3D, setShouldMount3D] = useState(false);

  useEffect(() => {
    if (variant === 'footer') {
      const el = wrapperRef.current;
      if (!el || typeof IntersectionObserver === 'undefined') {
        setShouldMount3D(true);
        return undefined;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setShouldMount3D(true);
            observer.disconnect();
          }
        },
        { rootMargin: '250px 0px' }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }

    // Navbar 3D emblem: defer Three.js + GLB initialization until after initial paint & LCP
    let cancelled = false;
    let idleId = null;
    let timerId = null;

    const mount = () => {
      if (!cancelled) setShouldMount3D(true);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(mount, { timeout: 1600 });
    } else {
      timerId = window.setTimeout(mount, 1100);
    }

    return () => {
      cancelled = true;
      if (idleId !== null && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
    };
  }, [variant]);

  return (
    <div
      ref={wrapperRef}
      className={`relative inline-flex flex-col items-center justify-center select-none group ${className}`}
    >
      {/* 3D Rotating Golden Emblem directly above "Pearl Oasis" */}
      <div 
        className="relative z-10 flex items-center justify-center pointer-events-none w-8 h-8 sm:w-9 sm:h-9"
        style={{
          transform: 'translateX(-2px)',
          marginBottom: '-8px',
        }}
        aria-hidden="true"
      >
        {shouldMount3D ? (
          <Suspense fallback={<CrestPlaceholder />}>
            <Logo3D className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-[0_2px_12px_rgba(255,215,0,0.55)]" />
          </Suspense>
        ) : (
          <CrestPlaceholder />
        )}
      </div>

      {/* Brand Text Logo Image: Pearl Oasis RESTAURANT */}
      <img
        src={logoTextImg}
        alt="Pearl Oasis Restaurant"
        width="320"
        height="142"
        decoding="async"
        className="h-8 sm:h-9 md:h-10 max-h-[42px] w-auto object-contain transition-opacity duration-300 filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] group-hover:brightness-110"
        loading={variant === 'footer' ? 'lazy' : 'eager'}
      />
    </div>
  );
}
