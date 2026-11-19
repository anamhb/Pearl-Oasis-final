import React, { useEffect, useRef, useState } from 'react';
import { RESTAURANT_INFO } from '../data/restaurantData.js';
import { MapPin } from 'lucide-react';
import {
  LOCATION_REVEAL_STEPS,
  LOCATION_VIDEO_POSTER_URL,
  LOCATION_VIDEO_RAW_URL,
  LOCATION_VIDEO_SCRUB_URL,
  LOCATION_VIDEO_START_TIME,
  computeScrollRevealCount,
  computeSectionScrollProgress,
  computeViewportTravelProgress,
  dampProgress,
  mapProgressToVideoTime,
} from '../utils/scrollVideoSync.js';

const MAP_DIRECT_URL = RESTAURANT_INFO.mapsUrl || 'https://maps.app.goo.gl/LeJogix9azNPMHiq7';
const TOTAL_REVEAL_STEPS = LOCATION_REVEAL_STEPS.length;
const REDUCED_MOTION_PREVIEW_TIME = 9.0;

export default function LocationHoursSection() {
  const runwayRef = useRef(null);
  const stickyStageRef = useRef(null);
  const videoRef = useRef(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [revealedCount, setRevealedCount] = useState(() =>
    prefersReducedMotion ? TOTAL_REVEAL_STEPS : 0
  );
  const [videoSrc, setVideoSrc] = useState(LOCATION_VIDEO_SCRUB_URL);
  const [hasFallenBackToRaw, setHasFallenBackToRaw] = useState(false);
  const [isNearSection, setIsNearSection] = useState(false);

  const revealedCountRef = useRef(prefersReducedMotion ? TOTAL_REVEAL_STEPS : 0);
  const targetProgressRef = useRef(0);
  const smoothedProgressRef = useRef(0);
  const pendingTimeRef = useRef(LOCATION_VIDEO_START_TIME);
  const rafIdRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const blobUrlRef = useRef(null);
  const blobPrefetchStartedRef = useRef(false);

  // Respect user reduced-motion preference dynamically
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
      if (event.matches) {
        revealedCountRef.current = TOTAL_REVEAL_STEPS;
        setRevealedCount(TOTAL_REVEAL_STEPS);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Defer attaching video/poster and RAM Blob pre-buffering until the user approaches
  // the Location section (~900px ahead), keeping the 4+ MB video completely off initial page load.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const runwayEl = runwayRef.current;
    if (!runwayEl) return undefined;

    const controller = new AbortController();

    const startBlobPrefetch = async () => {
      if (prefersReducedMotion || blobPrefetchStartedRef.current) return;
      blobPrefetchStartedRef.current = true;

      try {
        const response = await fetch(LOCATION_VIDEO_SCRUB_URL, {
          signal: controller.signal,
          mode: 'cors',
        });
        if (!response.ok) return;

        const videoBlob = await response.blob();
        if (controller.signal.aborted) return;

        const objectUrl = URL.createObjectURL(videoBlob);
        blobUrlRef.current = objectUrl;

        // Swap before active mid-section scrubbing begins to avoid any frame flash.
        if (targetProgressRef.current <= 0.05) {
          setVideoSrc(objectUrl);
        }
      } catch {
        // Silent fallback: the direct Cloudinary streaming URL remains active.
      }
    };

    const activateMedia = () => {
      setIsNearSection(true);
      startBlobPrefetch();
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            activateMedia();
            observer.disconnect();
          }
        },
        { rootMargin: '900px 0px' }
      );
      observer.observe(runwayEl);
      return () => {
        observer.disconnect();
        controller.abort();
      };
    }

    activateMedia();
    return () => controller.abort();
  }, [prefersReducedMotion]);

  // Revoke in-memory Blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  // Scroll-to-video synchronization and re-triggerable sequential reveal engine
  useEffect(() => {
    const runwayEl = runwayRef.current;
    const stickyEl = stickyStageRef.current;
    const videoEl = videoRef.current;
    if (!runwayEl || !stickyEl || !videoEl) return undefined;

    const enforcePaused = () => {
      if (!videoEl.paused) {
        videoEl.pause();
      }
    };

    if (prefersReducedMotion) {
      revealedCountRef.current = TOTAL_REVEAL_STEPS;
      setRevealedCount(TOTAL_REVEAL_STEPS);

      const applyStaticPreview = () => {
        enforcePaused();
        const target = Math.min(
          REDUCED_MOTION_PREVIEW_TIME,
          Math.max(LOCATION_VIDEO_START_TIME, (videoEl.duration || 10) - 0.1)
        );
        try {
          videoEl.currentTime = target;
        } catch {
          // Ignore seek errors before metadata is decoded
        }
      };

      if (videoEl.readyState >= 1) {
        applyStaticPreview();
      }
      videoEl.addEventListener('loadedmetadata', applyStaticPreview);
      videoEl.addEventListener('play', enforcePaused);
      return () => {
        videoEl.removeEventListener('loadedmetadata', applyStaticPreview);
        videoEl.removeEventListener('play', enforcePaused);
      };
    }

    const measureProgress = (cachedRect) => {
      const runwayRect = cachedRect || runwayEl.getBoundingClientRect();
      const stickyHeight = stickyEl.offsetHeight || window.innerHeight;
      const isStickyRunway = runwayRect.height - stickyHeight > 40;

      if (isStickyRunway) {
        const parsedTop = Number.parseFloat(window.getComputedStyle(stickyEl).top);
        const stickyTopOffset = Number.isFinite(parsedTop) ? parsedTop : 0;

        return computeSectionScrollProgress(
          runwayRect.top,
          runwayRect.height,
          stickyHeight,
          stickyTopOffset
        );
      }

      const viewportHeight = window.innerHeight || 1;
      const docHeight = Math.max(
        document.documentElement?.scrollHeight || 0,
        document.body?.scrollHeight || 0
      );
      const maxScrollY = Math.max(0, docHeight - viewportHeight);
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      const absoluteTop = runwayRect.top + currentScrollY;
      const minReachableTop = absoluteTop - maxScrollY;

      return computeViewportTravelProgress(runwayRect.top, viewportHeight, minReachableTop);
    };

    const syncRevealsForProgress = (progress) => {
      const nextCount = computeScrollRevealCount(
        progress,
        revealedCountRef.current,
        LOCATION_REVEAL_STEPS
      );
      if (nextCount !== revealedCountRef.current) {
        revealedCountRef.current = nextCount;
        setRevealedCount(nextCount);
      }
    };

    const applyVideoTime = (desiredTime) => {
      pendingTimeRef.current = desiredTime;
      if (videoEl.readyState < 1 || !Number.isFinite(videoEl.duration) || videoEl.duration <= 0) {
        return;
      }
      if (videoEl.seeking) {
        return;
      }
      if (Math.abs(videoEl.currentTime - desiredTime) > 0.015) {
        try {
          videoEl.currentTime = desiredTime;
        } catch {
          // Safe guard if decoder is switching sources
        }
      }
    };

    const tick = (now) => {
      const dt = lastFrameTimeRef.current ? (now - lastFrameTimeRef.current) / 1000 : 1 / 60;
      lastFrameTimeRef.current = now;

      const nextProgress = dampProgress(
        smoothedProgressRef.current,
        targetProgressRef.current,
        dt,
        11
      );
      smoothedProgressRef.current = nextProgress;

      // Sync step reveals directly with the smoothed video timeline (replays on every visit)
      syncRevealsForProgress(nextProgress);

      const targetTime = mapProgressToVideoTime(nextProgress, videoEl.duration);
      applyVideoTime(targetTime);

      const stillMoving = Math.abs(targetProgressRef.current - smoothedProgressRef.current) > 0.0004;
      const seekPending =
        videoEl.readyState >= 1 &&
        Number.isFinite(videoEl.duration) &&
        Math.abs(videoEl.currentTime - targetTime) > 0.02;

      if (stillMoving || seekPending) {
        rafIdRef.current = window.requestAnimationFrame(tick);
      } else {
        rafIdRef.current = null;
        lastFrameTimeRef.current = 0;
      }
    };

    const scheduleTick = () => {
      if (rafIdRef.current === null) {
        lastFrameTimeRef.current = 0;
        rafIdRef.current = window.requestAnimationFrame(tick);
      }
    };

    const handleScrollOrResize = () => {
      const runwayRect = runwayEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const isOffscreenBelow = runwayRect.top >= viewportHeight;
      const isOffscreenAbove = runwayRect.bottom <= 0;

      if (isOffscreenBelow) {
        targetProgressRef.current = 0;
        smoothedProgressRef.current = 0;
        syncRevealsForProgress(0);
        applyVideoTime(mapProgressToVideoTime(0, videoEl.duration));
        return;
      }

      if (isOffscreenAbove) {
        targetProgressRef.current = 1;
        smoothedProgressRef.current = 1;
        if (revealedCountRef.current !== 0) {
          revealedCountRef.current = 0;
          setRevealedCount(0);
        }
        return;
      }

      targetProgressRef.current = measureProgress(runwayRect);
      scheduleTick();
    };

    const handleMetadataReady = () => {
      enforcePaused();
      const initialProgress = measureProgress();
      targetProgressRef.current = initialProgress;
      smoothedProgressRef.current = initialProgress;
      syncRevealsForProgress(initialProgress);

      const initialTime = mapProgressToVideoTime(initialProgress, videoEl.duration);
      pendingTimeRef.current = initialTime;
      try {
        videoEl.currentTime = initialTime;
      } catch {
        // Ignore transient seek before data is buffered
      }
    };

    const handleSeeked = () => {
      const latestDesired = pendingTimeRef.current;
      if (
        videoEl.readyState >= 1 &&
        !videoEl.seeking &&
        Math.abs(videoEl.currentTime - latestDesired) > 0.02
      ) {
        try {
          videoEl.currentTime = latestDesired;
        } catch {
          // Ignore transient seek error
        }
      }
    };

    // Sync initial state on mount
    handleScrollOrResize();
    if (videoEl.readyState >= 1) {
      handleMetadataReady();
    }

    videoEl.addEventListener('loadedmetadata', handleMetadataReady);
    videoEl.addEventListener('loadeddata', handleMetadataReady);
    videoEl.addEventListener('seeked', handleSeeked);
    videoEl.addEventListener('play', enforcePaused);
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      videoEl.removeEventListener('loadedmetadata', handleMetadataReady);
      videoEl.removeEventListener('loadeddata', handleMetadataReady);
      videoEl.removeEventListener('seeked', handleSeeked);
      videoEl.removeEventListener('play', enforcePaused);
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [prefersReducedMotion, videoSrc, isNearSection]);

  const handleVideoError = () => {
    if (!hasFallenBackToRaw && videoSrc !== LOCATION_VIDEO_RAW_URL) {
      setHasFallenBackToRaw(true);
      setVideoSrc(LOCATION_VIDEO_RAW_URL);
    }
  };

  const activeSteps = prefersReducedMotion ? TOTAL_REVEAL_STEPS : revealedCount;
  const isStepVisible = (stepNumber) => activeSteps >= stepNumber;
  const leftScrimActive = isStepVisible(1);
  const rightScrimActive = isStepVisible(3);

  const revealClass = (visible) =>
    `transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'
    }`;

  return (
    <section
      id="contact"
      aria-label="Location and Service Hours"
      className="relative bg-[#0B0708] border-b border-[#C9A45C]/20"
    >
      {/* Section Header Outside & Above the Video */}
      <div className="relative pt-11 pb-6 sm:pt-14 sm:pb-7 md:pt-14 md:pb-8 lg:landscape:pt-20 lg:landscape:pb-11 px-5 sm:px-8 lg:px-12 bg-[#0B0708]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(68,20,28,0.34)_0%,rgba(11,7,8,1)_72%)] pointer-events-none"
        />
        <div className="relative max-w-2xl mx-auto text-center flex flex-col items-center">
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent mb-2.5" />
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#F5C369] font-semibold mb-1.5">
            VISIT PEARL OASIS
          </p>
          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl text-[#F8F3E8] font-normal leading-tight [text-wrap:balance]">
            Location &amp; Service Hours
          </h2>
          <p className="mt-2 sm:mt-2.5 text-xs sm:text-[13px] text-[#D8C5B8]/90 font-light leading-relaxed max-w-md">
            Visit us near KDA Gate No. 1, Kohat — open daily for authentic dining.
          </p>
        </div>
      </div>

      {/* Scroll-Controlled Full-Width Video Runway: compact natural height on mobile/tablet (zero black gap below), pinned 360vh cinema runway on desktop landscape */}
      <div
        ref={runwayRef}
        className={`relative w-full ${
          prefersReducedMotion ? 'h-auto' : 'h-auto lg:landscape:h-[360vh]'
        }`}
      >
        {/* Full-Width Edge-to-Edge Video Stage */}
        <div
          ref={stickyStageRef}
          className={
            prefersReducedMotion
              ? 'relative w-full min-h-[340px] md:h-[430px] lg:portrait:h-[490px] lg:landscape:min-h-[580px] overflow-hidden bg-[#0B0708] flex flex-col'
              : 'relative w-full min-h-[340px] md:h-[430px] lg:portrait:h-[490px] lg:landscape:sticky lg:landscape:top-0 lg:landscape:h-screen overflow-hidden bg-[#0B0708] flex flex-col'
          }
        >
          {/* Full-Bleed Edge-to-Edge Video Background Layer */}
          <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-[#0B0708]">
            <video
              ref={videoRef}
              src={isNearSection ? videoSrc : undefined}
              poster={isNearSection ? LOCATION_VIDEO_POSTER_URL : undefined}
              muted
              playsInline
              preload={isNearSection ? (prefersReducedMotion ? 'metadata' : 'auto') : 'none'}
              crossOrigin="anonymous"
              disablePictureInPicture
              controlsList="nodownload noplaybackrate"
              onError={handleVideoError}
              aria-hidden="true"
              className="w-full h-full object-cover object-center select-none pointer-events-none"
            />

            {/* Subtle top/bottom vertical feathering into obsidian edges */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(11,7,8,0.52)_0%,transparent_12%,transparent_88%,rgba(11,7,8,0.68)_100%)]"
            />
          </div>

          {/* Mobile Unified Readability Veil (< md): fades in at Step 1 for crisp contrast behind contiguous stack */}
          <div
            aria-hidden="true"
            className={`md:hidden absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(to_bottom,rgba(11,7,8,0.64)_0%,rgba(11,7,8,0.78)_48%,rgba(11,7,8,0.72)_100%)] transition-opacity duration-600 ease-out ${
              leftScrimActive ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Tablet & Desktop Bilateral Contrast Scrims (md+): Left fades in at Step 1, Right fades in at Step 3; center stays luminous */}
          <div
            aria-hidden="true"
            className={`hidden md:block absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(90deg,rgba(11,7,8,0.92)_0%,rgba(11,7,8,0.8)_22%,rgba(11,7,8,0.36)_36%,transparent_48%)] transition-opacity duration-600 ease-out ${
              leftScrimActive ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <div
            aria-hidden="true"
            className={`hidden md:block absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(270deg,rgba(11,7,8,0.92)_0%,rgba(11,7,8,0.8)_22%,rgba(11,7,8,0.36)_36%,transparent_48%)] transition-opacity duration-600 ease-out ${
              rightScrimActive ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Overlaid Editorial Content: Compact Tight Stack on Mobile (< md), Upper-Inset Left/Right Split on Tablet (md & portrait tablets), Centered Split on Desktop Landscape */}
          <div className="relative z-20 flex-1 h-full w-full max-w-[1440px] mx-auto px-5 sm:px-7 md:px-7 lg:px-8 xl:px-12 py-8 sm:py-9 md:pt-16 md:pb-8 lg:portrait:pt-20 lg:landscape:pt-20 lg:landscape:pb-10 pointer-events-none flex flex-col justify-center md:flex-row md:items-start lg:landscape:items-center md:justify-between gap-2.5 sm:gap-3.5 md:gap-8 lg:gap-12">
              {/* LEFT / FIRST GROUP: Address (Step 1) & Phone Number (Step 2) */}
              <div className="w-full max-w-[340px] md:max-w-[265px] lg:max-w-[330px] xl:max-w-[375px] space-y-2.5 sm:space-y-3 md:space-y-5 lg:space-y-6">
                {/* STEP 1: Address */}
                <div
                  data-reveal-step="1"
                  data-revealed={isStepVisible(1)}
                  className={revealClass(isStepVisible(1))}
                >
                  <div className="w-12 h-[1px] bg-gradient-to-r from-[#C9A45C] to-transparent mb-1.5 sm:mb-2" />
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#C9A45C] font-semibold mb-0.5 sm:mb-1 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
                    Address
                  </div>
                  <p className="text-[13px] sm:text-sm md:text-[14px] lg:text-[15px] xl:text-base text-[#F8F3E8] font-normal leading-snug sm:leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    {RESTAURANT_INFO.address}
                  </p>
                </div>

                {/* STEP 2: Phone Number */}
                <div
                  data-reveal-step="2"
                  data-revealed={isStepVisible(2)}
                  className={`pt-2.5 sm:pt-3 md:pt-4 border-t border-[#C9A45C]/30 ${revealClass(
                    isStepVisible(2)
                  )}`}
                >
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#C9A45C] font-semibold mb-0.5 sm:mb-1 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
                    Phone Number
                  </div>
                  <a
                    href={`tel:${RESTAURANT_INFO.phone.replace(/\s+/g, '')}`}
                    tabIndex={isStepVisible(2) ? undefined : -1}
                    className={`font-serif-heading text-xl sm:text-2xl md:text-[24px] lg:text-[26px] xl:text-[30px] text-[#F5C369] hover:text-[#F8F3E8] transition-colors duration-200 tracking-wide font-medium tabular-nums inline-flex items-center min-h-[32px] sm:min-h-[38px] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C369] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0708] rounded-sm ${
                      isStepVisible(2) ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                  >
                    {RESTAURANT_INFO.phone}
                  </a>
                </div>
              </div>

              {/* RIGHT / SECOND GROUP (Immediately Follows First Group on Mobile): Service Hours + Open Daily (Step 3) & Compact Directions Button (Step 4) */}
              <div className="w-full max-w-[340px] md:max-w-[275px] lg:max-w-[340px] xl:max-w-[385px] space-y-2.5 sm:space-y-3.5 md:space-y-5 lg:space-y-6 md:text-right">
                {/* STEP 3: Service Hours & Open Daily */}
                <div
                  data-reveal-step="3"
                  data-revealed={isStepVisible(3)}
                  className={`pt-2.5 sm:pt-3 md:pt-0 border-t border-[#C9A45C]/30 md:border-t-0 ${revealClass(
                    isStepVisible(3)
                  )}`}
                >
                  <div className="hidden md:block w-12 h-[1px] bg-gradient-to-l from-[#C9A45C] to-transparent ml-auto mb-2" />
                  <div className="flex flex-wrap items-baseline justify-between md:justify-end gap-x-3 gap-y-1 mb-1.5 sm:mb-2 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#C9A45C] font-semibold">
                      Service Hours
                    </span>
                    <span aria-hidden="true" className="hidden md:inline text-[#C9A45C]/65">
                      ·
                    </span>
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#F5C369] font-semibold">
                      Open Daily
                    </span>
                  </div>

                  <dl className="space-y-1.5 sm:space-y-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                    <div className="flex items-baseline justify-between md:flex-col md:items-end gap-x-4 gap-y-0.5">
                      <dt className="text-xs sm:text-sm text-[#D8C5B8] font-light">
                        Daily Operating Hours
                      </dt>
                      <dd className="font-sans text-[13px] sm:text-sm md:text-[15px] lg:text-base xl:text-[17px] text-[#F5C369] font-semibold tabular-nums tracking-wide">
                        {RESTAURANT_INFO.openingHours.hours}
                      </dd>
                    </div>

                    <div className="pt-1.5 sm:pt-2 border-t border-[#C9A45C]/25 flex items-baseline justify-between md:flex-col md:items-end gap-x-4 gap-y-0.5">
                      <dt className="text-xs sm:text-sm text-[#D8C5B8] font-light">
                        Friday Prayer Break
                      </dt>
                      <dd className="font-sans text-xs sm:text-[13px] md:text-sm xl:text-[15px] text-[#F8F3E8] font-medium tabular-nums tracking-wide">
                        {RESTAURANT_INFO.openingHours.fridayBreak}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* STEP 4: Get Directions Button at the End */}
                <div
                  data-reveal-step="4"
                  data-revealed={isStepVisible(4)}
                  className={`pt-0.5 sm:pt-1 flex justify-start md:justify-end ${revealClass(
                    isStepVisible(4)
                  )}`}
                >
                  <a
                    href={MAP_DIRECT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isStepVisible(4) ? undefined : -1}
                    className={`inline-flex items-center justify-center gap-1.5 min-h-[38px] sm:min-h-[40px] py-2 px-4 rounded-full bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:from-[#9B1C28] hover:to-[#D12B3D] hover:brightness-110 text-[#F8F3E8] font-semibold text-[11px] uppercase tracking-[0.06em] whitespace-nowrap transition-all duration-200 shadow-[0_6px_20px_rgba(186,37,53,0.4)] hover:shadow-[0_8px_24px_rgba(186,37,53,0.6)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C369] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0708] cursor-pointer ${
                      isStepVisible(4) ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#F5C369] shrink-0" aria-hidden="true" />
                    <span>Get directions on Google Map</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
