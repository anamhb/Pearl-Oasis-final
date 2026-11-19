/**
 * Pure synchronization math for scroll-controlled video playback and
 * bidirectional re-triggerable 4-step content reveals in the Location & Service Hours section.
 */

export const LOCATION_VIDEO_RAW_URL =
  'https://res.cloudinary.com/z8nlnc6b/video/upload/v1794936603/Location_map.mp4';

// Same Cloudinary asset capped at 1080p with dense 0.1s keyframes and audio stripped
// (100 I-frames vs 1 raw I-frame; ~4.0 MB vs 12.9 MB raw) for lag-free bidirectional scrubbing.
export const LOCATION_VIDEO_SCRUB_URL =
  'https://res.cloudinary.com/z8nlnc6b/video/upload/c_limit,w_1920,ki_0.1,ac_none,q_auto/v1794936603/Location_map.mp4';

// Clean opening map frame poster (Location_map.mp4 starts cleanly at 0.0s with no storyboard intro).
export const LOCATION_VIDEO_POSTER_URL =
  'https://res.cloudinary.com/z8nlnc6b/video/upload/so_0.0,w_1920,f_jpg,q_auto/v1794936603/Location_map.jpg';

export const LOCATION_VIDEO_START_TIME = 0;
export const LOCATION_VIDEO_END_PADDING = 0.06;
export const LOCATION_REVEAL_HYSTERESIS = 0.025;

// Sequential 4-step reveal milestones coordinated with the map-pin video beats:
// 1. 0.10 (~1.0s): Hand lowers pin over map -> Address
// 2. 0.30 (~3.0s): Pin touches down on map -> Phone Number
// 3. 0.52 (~5.2s): Luminous ripples & glow activate -> Service Hours + Open Daily
// 4. 0.74 (~7.3s): Glowing route traces toward skyline -> Google Maps CTA
export const LOCATION_REVEAL_STEPS = [
  { id: 'address', side: 'left', threshold: 0.10 },
  { id: 'phone', side: 'left', threshold: 0.30 },
  { id: 'hours', side: 'right', threshold: 0.52 },
  { id: 'directions', side: 'right', threshold: 0.74 },
];

export function clamp01(value) {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
}

/**
 * Computes normalized [0, 1] scroll progress through a sticky runway container,
 * accounting for custom sticky heights (e.g. compact tablet stage) and top offsets.
 */
export function computeSectionScrollProgress(
  rectTop,
  runwayHeight,
  stickyHeight,
  stickyTopOffset = 0
) {
  if (
    !Number.isFinite(rectTop) ||
    !Number.isFinite(runwayHeight) ||
    !Number.isFinite(stickyHeight)
  ) {
    return 0;
  }

  const safeStickyTop = Number.isFinite(stickyTopOffset) ? stickyTopOffset : 0;
  const scrollableDistance = Math.max(1, runwayHeight - stickyHeight);
  return clamp01((safeStickyTop - rectTop) / scrollableDistance);
}

/**
 * Computes normalized [0, 1] scroll progress as a compact (non-sticky) video stage travels
 * through the viewport on mobile and tablet. Automatically accounts for the page bottom
 * (`minReachableTop`) so tall viewports still reach 100% playback and reveal all steps.
 */
export function computeViewportTravelProgress(
  rectTop,
  viewportHeight,
  minReachableTop = Number.NEGATIVE_INFINITY,
  startRatio = 0.88,
  idealEndRatio = 0.14
) {
  if (!Number.isFinite(rectTop) || !Number.isFinite(viewportHeight) || viewportHeight <= 0) {
    return 0;
  }

  let startTop = viewportHeight * startRatio;
  const idealEndTop = viewportHeight * idealEndRatio;
  const safeMinReachable = Number.isFinite(minReachableTop)
    ? minReachableTop + 12
    : Number.NEGATIVE_INFINITY;
  let endTop = Math.max(idealEndTop, safeMinReachable);

  if (startTop <= endTop + 40) {
    startTop = viewportHeight;
    endTop = Math.min(startTop - 1, safeMinReachable);
  }

  return clamp01((startTop - rectTop) / Math.max(1, startTop - endTop));
}

/**
 * Maps normalized scroll progress [0, 1] onto the usable playback window of the video.
 */
export function mapProgressToVideoTime(
  progress,
  duration,
  startOffset = LOCATION_VIDEO_START_TIME,
  endPadding = LOCATION_VIDEO_END_PADDING
) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 10;
  const effectiveStart = Math.min(Math.max(0, startOffset), Math.max(0, safeDuration - 0.2));
  const effectiveEnd = Math.max(effectiveStart + 0.05, safeDuration - Math.max(0, endPadding));
  return effectiveStart + clamp01(progress) * (effectiveEnd - effectiveStart);
}

/**
 * Computes how many sequential on-video items should be visible for the current scroll progress.
 * Replays smoothly every time the user leaves and returns to this section, while applying a
 * small hysteresis band on backward movement to prevent threshold jitter during scrolling.
 */
export function computeScrollRevealCount(
  progress,
  previousCount = 0,
  steps = LOCATION_REVEAL_STEPS,
  hysteresis = LOCATION_REVEAL_HYSTERESIS
) {
  const clampedProgress = clamp01(progress);
  const safePrev = Number.isFinite(previousCount)
    ? Math.min(Math.max(0, Math.floor(previousCount)), steps.length)
    : 0;
  const safeHysteresis = Math.max(0, Number.isFinite(hysteresis) ? hysteresis : 0);

  let count = 0;
  for (let i = 0; i < steps.length; i += 1) {
    const enterThreshold = steps[i].threshold;
    const exitThreshold = Math.max(0, enterThreshold - safeHysteresis);
    const wasVisible = i < safePrev;
    const activeThreshold = wasVisible ? exitThreshold : enterThreshold;

    if (clampedProgress >= activeThreshold) {
      count = i + 1;
    } else {
      break;
    }
  }

  return count;
}

/**
 * Frame-rate-independent exponential damping step for silky scroll-to-video smoothing.
 */
export function dampProgress(current, target, deltaSeconds, smoothingRate = 11) {
  const safeCurrent = clamp01(current);
  const safeTarget = clamp01(target);
  const clampedDelta = Math.min(Math.max(deltaSeconds, 0), 0.05);
  const factor = 1 - Math.exp(-smoothingRate * clampedDelta);
  const next = safeCurrent + (safeTarget - safeCurrent) * factor;
  if (Math.abs(safeTarget - next) < 0.0004) {
    return safeTarget;
  }
  return clamp01(next);
}
