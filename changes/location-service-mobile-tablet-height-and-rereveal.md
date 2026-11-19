# Location & Service Hours — Mobile Gap Fix, Compact Tablet Video Height & Re-Triggerable Scroll Reveals

## Summary
Resolved three functional and responsive layout issues in the **Location & Service Hours** section (`#contact`):

1. **Removed Large Gap Between Top and Bottom Text on Mobile (`< md`)**
   - Changed the mobile overlay layout from `justify-between` (which pushed `Address`/`Phone Number` to the top edge and `Service Hours`/`Directions` to the bottom edge with a wide empty gap) to `justify-center` with a tight, unified vertical stack (`gap-2.5 sm:gap-3.5`) so `Service Hours · Open Daily` and the **Get directions on Google Map** button sit immediately below `Phone Number` separated by a subtle antique-gold divider.
   - Replaced the split top/bottom mobile gradients with a unified obsidian readability veil (`md:hidden`) fading in at Step 1 for even contrast behind the contiguous text block.

2. **Reduced Oversized Video Height on Tablet (`md:` & portrait tablets) to Fit One Screen**
   - Framed the Section Header (outside & above the video) together with a reduced-height full-width video stage (`h-[clamp(360px,56svh,490px)]` on mobile, `md:h-[clamp(360px,50svh,520px)]` on tablet, `lg:portrait:h-[clamp(460px,48svh,580px)]` on large portrait tablets) inside a single `100svh` sticky viewport so the heading and entire video fit comfortably on one screen with balanced proportions around the centered Left/Right text — eliminating excessive empty space above/below the text and avoiding dead space under the video while scrolling.
   - Preserved the full-viewport `100vh` edge-to-edge video layout (`lg:landscape:h-full`) with the header above the runway on desktop landscape screens.
   - Updated `computeSectionScrollProgress` and `measureProgress()` to calculate progress accurately from the sticky stage's rendered height and top offset across all breakpoints.

3. **Re-Triggerable Scroll-Based Text Reveals on Every Visit**
   - Replaced the one-time reveal latch (`computeLatchedRevealCount`) with a bidirectional, hysteresis-stabilized reveal function (`computeScrollRevealCount`, hysteresis `0.025`) plus instant off-screen reset when the section leaves the viewport (`runwayRect.top >= window.innerHeight` or `runwayRect.bottom <= 0`).
   - Text starts hidden, appears step-by-step in sync with the scroll-controlled video, avoids threshold flicker, and replays cleanly every time the user leaves and returns to **Location & Service Hours**.

## Verification
- Verified `6/6` unit tests in `src/utils/scrollVideoSync.test.mjs` covering `Location_map.mp4` URLs, offset/compact sticky scroll progress math, hysteresis stability, and multi-visit replay behavior.
- Verified TypeScript lint (`npm run lint`), production build (`npm run build`), generated Tailwind v4 utility classes (`duration-600`, `lg:portrait:`, `lg:landscape:`), and live server response on port `3000`.
