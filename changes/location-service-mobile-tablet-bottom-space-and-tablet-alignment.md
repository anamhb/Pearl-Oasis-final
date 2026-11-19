# Location & Service Hours — Remove Bottom Video Black Space & Upper Tablet Text Alignment

## Summary
Applied targeted responsive layout refinements to the **Location & Service Hours** section (`#contact`) while keeping desktop landscape, video playback, and re-triggerable scroll reveals untouched:

1. **Removed Extra Black Space Below the Video (Mobile & Tablet)**
   - Removed vertical centering (`justify-center`) and bottom padding (`pb-3 sm:pb-4 md:pb-5`) from the sticky viewport container and upgraded its height to `h-screen supports-[height:100dvh]:h-dvh`.
   - Replaced the capped fixed-clamp video stage height with `flex-1 min-h-0` so the full-bleed `object-cover` video stretches cleanly from directly beneath the section header all the way to the bottom edge of the viewport with zero extra black strip below it on phones and tablets.

2. **Upper-Left / Upper-Right Text Start on Tablet**
   - Changed tablet vertical content alignment from vertical center (`md:items-center`) to upper-aligned (`md:items-start md:pt-10 lg:portrait:pt-14`) so the Left (`Address`, `Phone Number`) and Right (`Service Hours · Open Daily`, `Get directions on Google Map`) groups start near the top-left and top-right of the video instead of leaving empty vertical space above them.
   - Preserved centered vertical alignment (`lg:landscape:items-center`) on desktop landscape screens and the tight contiguous centered stack on mobile.

## Verification
- Verified TypeScript lint (`npm run lint`), production build (`npm run build`), generated Tailwind v4 `dvh` & orientation rules, `6/6` unit tests in `src/utils/scrollVideoSync.test.mjs`, and live server HTTP `200 OK` on port `3000`.
