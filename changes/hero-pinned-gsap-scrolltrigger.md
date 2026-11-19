# Hero Pinned GSAP ScrollTrigger Sequence Update

## Summary of Refined Requirements Implementation
1. **Fully Controllable Scroll (No Auto-Advance)**:
   - Completely removed `snap` from `ScrollTrigger` configuration.
   - Updated to `scrub: 0.3` so animation scrub follows the user's scroll directly without auto-jumping or snapping.

2. **Guaranteed Navbar Gap & Dynamic Height Calculations**:
   - Added `--nav-h: 72px` and `--gap: clamp(24px, 4vh, 48px)` to `.hero__inner` CSS with `padding-top: calc(var(--nav-h) + var(--gap))` and `padding-bottom: var(--gap)`.
   - Computed `maxH()` and `finalPillH()` dynamically so the video pill never exceeds the available viewport space between the navbar and action buttons.
   - Animated `.welcome` and `.tagline` to collapse (`opacity: 0, height: 0, marginTop: 0, marginBottom: 0, y: -10`) during Stage 3 so layout spacing remains stable without jumping.

3. **Always Visible Action Buttons**:
   - Removed `.buttons` from the fade-out timeline so "Enter Restaurant" and "Reserve a Table" remain visible throughout the scroll sequence beneath the video pill.
