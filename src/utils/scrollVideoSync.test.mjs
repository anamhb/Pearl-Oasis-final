import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LOCATION_REVEAL_STEPS,
  LOCATION_VIDEO_END_PADDING,
  LOCATION_VIDEO_POSTER_URL,
  LOCATION_VIDEO_RAW_URL,
  LOCATION_VIDEO_SCRUB_URL,
  LOCATION_VIDEO_START_TIME,
  computeScrollRevealCount,
  computeSectionScrollProgress,
  computeViewportTravelProgress,
  dampProgress,
  mapProgressToVideoTime,
} from './scrollVideoSync.js';

test('Cloudinary video constants reference the Location_map.mp4 video', () => {
  assert.equal(
    LOCATION_VIDEO_RAW_URL,
    'https://res.cloudinary.com/z8nlnc6b/video/upload/v1794936603/Location_map.mp4'
  );
  assert.ok(
    LOCATION_VIDEO_SCRUB_URL.includes('ki_0.1') &&
      LOCATION_VIDEO_SCRUB_URL.includes('v1794936603/Location_map.mp4'),
    'Scrubbing URL should apply dense keyframe interval to the exact Location_map.mp4 asset'
  );
  assert.ok(
    LOCATION_VIDEO_POSTER_URL.includes('v1794936603/Location_map.jpg'),
    'Poster URL should derive from the exact Location_map.mp4 asset'
  );
});

test('computeSectionScrollProgress supports full-screen desktop and offset compact tablet sticky stages', () => {
  // Desktop: sticky top 0, full viewport height 900, runway 3240 (2340px scrollable)
  assert.equal(computeSectionScrollProgress(400, 3240, 900, 0), 0);
  assert.equal(computeSectionScrollProgress(0, 3240, 900, 0), 0);
  assert.equal(computeSectionScrollProgress(-1170, 3240, 900, 0), 0.5);
  assert.equal(computeSectionScrollProgress(-2340, 3240, 900, 0), 1);

  // Tablet: sticky top 72px (below navbar), compact stage height 500px, runway 2250px (1750px scrollable)
  assert.equal(computeSectionScrollProgress(120, 2250, 500, 72), 0);
  assert.equal(computeSectionScrollProgress(72, 2250, 500, 72), 0);
  assert.equal(computeSectionScrollProgress(72 - 875, 2250, 500, 72), 0.5);
  assert.equal(computeSectionScrollProgress(72 - 1750, 2250, 500, 72), 1);
  assert.equal(computeSectionScrollProgress(Number.NaN, 2250, 500, 72), 0);
});

test('computeViewportTravelProgress scrubs cleanly across mobile, tablet, and tall portrait viewports', () => {
  // Mobile (844px tall, footer tall enough that minReachableTop = -200)
  assert.equal(computeViewportTravelProgress(900, 844, -200), 0);
  const mobileMid = computeViewportTravelProgress(430, 844, -200);
  assert.ok(mobileMid > 0.45 && mobileMid < 0.55);
  assert.equal(computeViewportTravelProgress(100, 844, -200), 1);

  // Tall portrait tablet (1366px tall, page bottom caps minReachableTop at 406px)
  assert.equal(computeViewportTravelProgress(1300, 1366, 406), 0);
  const tabletMid = computeViewportTravelProgress(810, 1366, 406);
  assert.ok(tabletMid > 0.45 && tabletMid < 0.55);
  assert.equal(computeViewportTravelProgress(406, 1366, 406), 1);
});

test('mapProgressToVideoTime starts cleanly at 0s and progresses monotonically', () => {
  const duration = 9.92;
  const start = mapProgressToVideoTime(0, duration);
  const quarter = mapProgressToVideoTime(0.25, duration);
  const mid = mapProgressToVideoTime(0.5, duration);
  const end = mapProgressToVideoTime(1, duration);

  assert.equal(start, LOCATION_VIDEO_START_TIME);
  assert.equal(start, 0);
  assert.ok(quarter > start && mid > quarter && end > mid);
  assert.ok(Math.abs(end - (duration - LOCATION_VIDEO_END_PADDING)) < 1e-6);
  assert.ok(end < duration, 'End timestamp must stay strictly within video duration');
});

test('LOCATION_REVEAL_STEPS defines 4 ordered split-side milestones (left then right)', () => {
  assert.equal(LOCATION_REVEAL_STEPS.length, 4);
  assert.deepEqual(
    LOCATION_REVEAL_STEPS.map((s) => `${s.side}:${s.id}`),
    ['left:address', 'left:phone', 'right:hours', 'right:directions']
  );

  for (let i = 1; i < LOCATION_REVEAL_STEPS.length; i += 1) {
    assert.ok(
      LOCATION_REVEAL_STEPS[i].threshold > LOCATION_REVEAL_STEPS[i - 1].threshold,
      'Each sequential reveal step must occur at a strictly later scroll threshold'
    );
  }
});

test('computeScrollRevealCount reveals progressively, resists jitter, and replays on revisit', () => {
  // First visit: progressive reveal 0 -> 1 -> 2 -> 3 -> 4
  assert.equal(computeScrollRevealCount(0, 0), 0);
  assert.equal(computeScrollRevealCount(0.05, 0), 0);

  const s1 = computeScrollRevealCount(0.11, 0);
  assert.equal(s1, 1);

  // Small backward micro-nudge inside hysteresis band does not flicker step 1 off
  assert.equal(computeScrollRevealCount(0.09, s1), 1);

  const s2 = computeScrollRevealCount(0.32, s1);
  assert.equal(s2, 2);

  const s3 = computeScrollRevealCount(0.55, s2);
  assert.equal(s3, 3);

  const s4 = computeScrollRevealCount(0.76, s3);
  assert.equal(s4, 4);

  // Remains visible through the end of the video
  assert.equal(computeScrollRevealCount(1.0, s4), 4);

  // Scrolling back up out of the section cleanly resets reveal state to 0
  const reset = computeScrollRevealCount(0.0, s4);
  assert.equal(reset, 0);

  // Second visit: replays step-by-step from 0 -> 1 -> 2 -> 3 -> 4
  assert.equal(computeScrollRevealCount(0.06, reset), 0);
  assert.equal(computeScrollRevealCount(0.12, reset), 1);
  assert.equal(computeScrollRevealCount(0.33, 1), 2);
  assert.equal(computeScrollRevealCount(0.54, 2), 3);
  assert.equal(computeScrollRevealCount(0.78, 3), 4);
});

test('dampProgress converges smoothly and snaps cleanly within tolerance', () => {
  let current = 0;
  const target = 0.75;
  for (let i = 0; i < 60; i += 1) {
    const next = dampProgress(current, target, 1 / 60, 11);
    assert.ok(next >= current && next <= target);
    current = next;
  }
  assert.equal(current, target);
});
