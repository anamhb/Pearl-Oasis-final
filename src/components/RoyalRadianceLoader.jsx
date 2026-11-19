import React, { useCallback, useEffect, useRef, useState } from 'react';
import Logo3D from './Logo3D.jsx';

// Helper to build a circular SVG arc path centered at (cx, cy) from startDeg to endDeg
function describeCircularArc(cx, cy, radius, startDeg, endDeg) {
  const startRad = ((startDeg - 90) * Math.PI) / 180;
  const endRad = ((endDeg - 90) * Math.PI) / 180;
  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = endDeg >= startDeg ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

// Single compact inner circle radius centered at (200, 200) inside 400x400 viewBox
const INNER_RADIUS = 64;

// Full 360-degree spin speed for the 3D loader logo (~1.38s per full revolution)
const LOADER_3D_ROTATION_SPEED = Math.PI * 1.45;

// Top-anchored luminous node trails along the inner circle (rotated smoothly 360 deg via outer container)
const INNER_TRAIL_CW = describeCircularArc(200, 200, INNER_RADIUS, -28, 0);
const INNER_TRAIL_CCW = describeCircularArc(200, 200, INNER_RADIUS, 0, 28);

function NodeHaloGradient({ id }) {
  return (
    <radialGradient id={id} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#E8C46A" stopOpacity="1" />
      <stop offset="36%" stopColor="#D0A64A" stopOpacity="0.88" />
      <stop offset="72%" stopColor="#B8892D" stopOpacity="0.42" />
      <stop offset="100%" stopColor="#A87524" stopOpacity="0" />
    </radialGradient>
  );
}

function CrestFallback360() {
  return (
    <div
      className="energy-loader__fallback-360 w-[76%] h-[76%] flex items-center justify-center"
      aria-hidden="true"
    >
      <svg viewBox="0 0 36 36" className="w-full h-full text-[#C49A36]" fill="none">
        <path
          d="M18 4L25 14L22 25L18 32L14 25L11 14L18 4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="rgba(212, 164, 55, 0.24)"
        />
        <circle cx="18" cy="16" r="3.2" fill="#D0A64A" />
      </svg>
    </div>
  );
}

export default function RoyalRadianceLoader() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [has3DError, setHas3DError] = useState(false);

  const dismissStateRef = useRef(null);
  if (!dismissStateRef.current) {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    dismissStateRef.current = {
      domReady: typeof document !== 'undefined' && document.readyState !== 'loading',
      rotationDone: false,
      fadeTriggered: false,
      prefersReduced,
      fadeOutMs: prefersReduced ? 160 : 360,
      unmountTimer: null,
      delayTimer: null,
    };
  }

  const triggerDismiss = useCallback(() => {
    const state = dismissStateRef.current;
    if (state.fadeTriggered) return;
    if (state.domReady && state.rotationDone) {
      state.fadeTriggered = true;
      setIsFadingOut(true);
      state.unmountTimer = window.setTimeout(() => {
        setIsUnmounted(true);
      }, state.fadeOutMs);
    }
  }, []);

  const handle3DLoaded = useCallback(() => {
    const state = dismissStateRef.current;
    if (state.prefersReduced && !state.rotationDone) {
      state.delayTimer = window.setTimeout(() => {
        state.rotationDone = true;
        triggerDismiss();
      }, 220);
    }
  }, [triggerDismiss]);

  const handle3DFullRotation = useCallback(() => {
    dismissStateRef.current.rotationDone = true;
    triggerDismiss();
  }, [triggerDismiss]);

  const handle3DError = useCallback(() => {
    setHas3DError(true);
    const state = dismissStateRef.current;
    if (!state.rotationDone) {
      state.delayTimer = window.setTimeout(() => {
        state.rotationDone = true;
        triggerDismiss();
      }, state.prefersReduced ? 200 : 1100);
    }
  }, [triggerDismiss]);

  useEffect(() => {
    const state = dismissStateRef.current;
    state.domReady = typeof document !== 'undefined' && document.readyState !== 'loading';

    const handleDomReady = () => {
      state.domReady = true;
      triggerDismiss();
    };

    if (!state.domReady) {
      document.addEventListener('DOMContentLoaded', handleDomReady, { once: true });
    }

    // Safety cap ensures the loader always dismisses even on slow devices or blocked WebGL
    const maxSafetyTimer = window.setTimeout(() => {
      state.domReady = true;
      state.rotationDone = true;
      triggerDismiss();
    }, state.prefersReduced ? 450 : 2600);

    return () => {
      document.removeEventListener('DOMContentLoaded', handleDomReady);
      window.clearTimeout(maxSafetyTimer);
      if (state.delayTimer) {
        window.clearTimeout(state.delayTimer);
      }
      if (state.unmountTimer) {
        window.clearTimeout(state.unmountTimer);
      }
    };
  }, [triggerDismiss]);

  if (isUnmounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Pearl Oasis"
      className={`energy-loader fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden select-none bg-[#FFFFFF] ${
        isFadingOut ? 'energy-loader--exit pointer-events-none' : ''
      }`}
    >
      {/* Compact Centered Energy Core Stage */}
      <div className="relative flex items-center justify-center w-[184px] h-[184px] sm:w-[252px] sm:h-[252px] md:w-[296px] md:h-[296px] max-w-[85vw] max-h-[85vw]">
        {/* Inner Circle Clipped Stage (exact 31.6% diameter matches INNER_RADIUS = 64 inside 400x400) */}
        <div
          className="energy-inner-disc absolute z-10 w-[31.6%] h-[31.6%] rounded-full overflow-hidden flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          {/* Soft Champagne-Gold Ambient Glow — strictly confined inside the inner circle */}
          <div className="energy-ambient-glow absolute inset-0 rounded-full pointer-events-none" />

          {/* Central 360-Degree Rotating 3D Golden Logo — rendered synchronously on Frame 1 */}
          <div className="relative z-10 w-[94%] h-[94%] flex items-center justify-center pointer-events-none">
            {has3DError ? (
              <CrestFallback360 />
            ) : (
              <Logo3D
                className="w-full h-full"
                surface="light"
                rotationSpeed={LOADER_3D_ROTATION_SPEED}
                showLoadingSpinner={false}
                interactive={false}
                onLoaded={handle3DLoaded}
                onFullRotation={handle3DFullRotation}
                onError={handle3DError}
              />
            )}
          </div>
        </div>

        {/* Inner Circle Base Layer */}
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 z-20 w-full h-full overflow-visible pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="coreInnerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B8892D" stopOpacity="0.94" />
              <stop offset="35%" stopColor="#C49A36" stopOpacity="1" />
              <stop offset="60%" stopColor="#D0A64A" stopOpacity="1" />
              <stop offset="100%" stopColor="#B8892D" stopOpacity="0.94" />
            </linearGradient>
          </defs>

          <g className="energy-ring-inner">
            <circle
              cx="200"
              cy="200"
              r={INNER_RADIUS}
              fill="none"
              stroke="url(#coreInnerGoldGrad)"
              strokeWidth="1.65"
            />
            <circle
              cx="200"
              cy="200"
              r={INNER_RADIUS}
              fill="none"
              stroke="#E8C46A"
              strokeWidth="0.55"
              opacity="0.45"
            />
          </g>
        </svg>

        {/* FULL 360-DEGREE ORBITING NODE 1: Inner Circle (CW, starts at 0 deg) */}
        <div className="energy-spin-layer energy-orbit--node1 absolute inset-0 z-30 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="trailCW1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A87524" stopOpacity="0" />
                <stop offset="58%" stopColor="#B8892D" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#E8C46A" stopOpacity="0.98" />
              </linearGradient>
              <NodeHaloGradient id="coreNodeHalo1" />
            </defs>
            <path d={INNER_TRAIL_CW} fill="none" stroke="url(#trailCW1)" strokeWidth="1.85" strokeLinecap="round" />
            <g>
              <circle cx="200" cy={200 - INNER_RADIUS} r="6.4" fill="url(#coreNodeHalo1)" />
              <circle cx="200" cy={200 - INNER_RADIUS} r="2.35" fill="#A87524" />
              <circle cx="200" cy={200 - INNER_RADIUS} r="1.15" fill="#E8C46A" />
            </g>
          </svg>
        </div>

        {/* FULL 360-DEGREE ORBITING NODE 2: Inner Circle (CCW, starts at 165 deg) */}
        <div className="energy-spin-layer energy-orbit--node2 absolute inset-0 z-30 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="trailCCW2" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#A87524" stopOpacity="0" />
                <stop offset="58%" stopColor="#B8892D" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#E8C46A" stopOpacity="0.95" />
              </linearGradient>
              <NodeHaloGradient id="coreNodeHalo2" />
            </defs>
            <path d={INNER_TRAIL_CCW} fill="none" stroke="url(#trailCCW2)" strokeWidth="1.6" strokeLinecap="round" />
            <g>
              <circle cx="200" cy={200 - INNER_RADIUS} r="5.8" fill="url(#coreNodeHalo2)" />
              <circle cx="200" cy={200 - INNER_RADIUS} r="2.05" fill="#A87524" />
              <circle cx="200" cy={200 - INNER_RADIUS} r="1.05" fill="#E8C46A" />
            </g>
          </svg>
        </div>
      </div>

      <span className="sr-only">Loading Pearl Oasis...</span>

      <style>{`
        .energy-loader {
          background-color: #ffffff;
          opacity: 1;
          transition: opacity 360ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity;
        }

        .energy-loader--exit {
          opacity: 0;
        }

        .energy-inner-disc {
          clip-path: circle(50% at 50% 50%);
        }

        .energy-ambient-glow {
          background: radial-gradient(
            circle at center,
            rgba(240, 212, 132, 0.28) 0%,
            rgba(224, 188, 96, 0.14) 52%,
            rgba(212, 174, 82, 0.04) 80%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: energyGlowPulse 3.6s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .energy-loader__fallback-360 {
          animation: fallbackSpin360 1.4s linear infinite;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .energy-ring-inner {
          animation: energyInnerPulse 4s ease-in-out infinite;
          will-change: opacity;
        }

        .energy-spin-layer {
          transform-origin: center center;
          will-change: transform;
        }

        .energy-orbit--node1 {
          animation: orbitFrom0CW 3.4s linear infinite;
        }

        .energy-orbit--node2 {
          animation: orbitFrom165CCW 4.8s linear infinite;
        }

        @keyframes fallbackSpin360 {
          from { transform: perspective(360px) rotateY(0deg); }
          to { transform: perspective(360px) rotateY(360deg); }
        }

        @keyframes orbitFrom0CW {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbitFrom165CCW {
          from { transform: rotate(165deg); }
          to { transform: rotate(-195deg); }
        }

        @keyframes energyGlowPulse {
          0%, 100% {
            transform: scale(0.94);
            opacity: 0.78;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes energyInnerPulse {
          0%, 100% { opacity: 0.84; }
          50% { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .energy-loader {
            transition-duration: 160ms !important;
          }
          .energy-ambient-glow,
          .energy-ring-inner,
          .energy-spin-layer,
          .energy-loader__fallback-360 {
            animation: none !important;
          }
          .energy-ambient-glow {
            transform: scale(1) !important;
            opacity: 0.85 !important;
          }
          .energy-ring-inner { opacity: 0.92 !important; }
          .energy-orbit--node1 { transform: rotate(0deg); }
          .energy-orbit--node2 { transform: rotate(165deg); }
        }
      `}</style>
    </div>
  );
}
