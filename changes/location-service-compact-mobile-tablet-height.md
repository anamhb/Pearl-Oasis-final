# Location & Service Hours — Compact Mobile & Tablet Heights and Upper Tablet Margin

## Summary
Refined mobile and tablet sizing and text alignment in **Location & Service Hours** (`#contact`) while preserving desktop landscape full-screen behavior, edge-to-edge video framing, and repeatable scroll reveals:

1. **Compact Mobile Video Height (`< md`)**
   - Replaced the tall `100dvh` mobile stage with a natural, content-hugging video container (`min-h-[340px]` with `py-8 sm:py-9` around the contiguous text stack) so there is no excess empty space above or below the mobile text and zero black space below the bottom of the video.

2. **Reduced Tablet Section Height & Added Upper Text Margin (`md` & `lg:portrait`)**
   - Replaced the multi-screen `250vh` tablet runway with a compact, single-screen section height (`md:h-[430px]`, `lg:portrait:h-[490px]` video stage directly below the section header, with the Footer starting immediately underneath and zero black space below the video).
   - Added a balanced top inset (`md:pt-16` / `lg:portrait:pt-20` with `md:items-start`) so the tablet text starts comfortably below the top edge of the video rather than flush against the top or centered halfway down.

3. **Direct Viewport-Travel Scroll Sync on Mobile & Tablet**
   - Added `computeViewportTravelProgress` in `src/utils/scrollVideoSync.js` so compact mobile and tablet stages scrub the video smoothly from `0% → 100%` and reveal all 4 steps progressively as the section scrolls through the viewport (automatically adapting to page bottom reachability on tall portrait tablets), while Desktop Landscape continues using the `360vh` sticky cinema runway.

## Verification
- Passed `7/7` unit tests in `src/utils/scrollVideoSync.test.mjs`.
- Passed TypeScript lint (`npm run lint`), production build (`npm run build`), and live server check on port `3000`.
