# Location & Service Hours — Full-Width Map Pin Video & Cardless Step-by-Step Scroll Reveal

## Overview
Redesigned the **Location & Service Hours** section (`#contact`) by replacing the background video with the new Cloudinary location-pin map animation (`Location_pin_animation_on_map_73ff717a.mp4`), completely removing the boxed information card, and introducing a 5-step scroll-coordinated editorial reveal synchronized directly with the video's visual beats.

## Key Changes

### 1. Full-Width Map Pin Background Video Replacement
- **Files:** `src/utils/scrollVideoSync.js`, `src/components/LocationHoursSection.jsx`
- Replaced the previous video asset with `https://res.cloudinary.com/z8nlnc6b/video/upload/v1794934530/Location_pin_animation_on_map_73ff717a.mp4` (`1280×720`, 16:9, `24 fps`, `10.0s`).
- **Smooth Bidirectional Scrubbing:** Inspected the source MP4 with `ffprobe` and found only `3` I-frames in the raw file. The component serves the same Cloudinary asset with dense `0.1s` keyframes (`ki_0.1,ac_none,q_auto` — `101` I-frames, `~2.5 MB`), pre-buffers it into an in-memory Blob URL via `IntersectionObserver` (`rootMargin: '2200px 0px'`, swapped only before mid-section scrubbing begins), and automatically falls back to the raw Cloudinary URL on playback errors.
- **Clean Start Frame & Poster:** Frame inspection revealed an opening storyboard graphic during `0.00s–0.28s`. Scroll playback maps across `0.42s → 9.94s` so the section opens cleanly on the sunlit establishing map shot, paired with a matching `so_0.5` Cloudinary JPEG poster to avoid blank flashes on initial paint.
- **Full-Width Aspect-Ratio Preservation:** Uses `w-full h-full object-contain` across the entire section width on desktop, tablet, and mobile (`max-h-[32svh] sm:max-h-[44svh] lg:max-h-none`) with zero cropping, zero side borders/insets, and no auto-play.

### 2. Cardless Editorial Layout & Subtle Contrast Scrim
- **File:** `src/components/LocationHoursSection.jsx`
- Completely removed the boxed information card (`bg-[#15070A]/86`, `rounded-2xl`, bordered card shell, nested Service Hours box, square icon boxes, and the pill-styled `OPEN DAILY` capsule).
- Presented all preserved Pearl Oasis information directly in an open, left-aligned luxury editorial stack separated by subtle antique-gold hairline rules (`border-[#C9A45C]/25`) using Pearl Oasis's existing Cormorant Garamond serif display, Montserrat body typography, warm gold (`#F5C369`), antique gold (`#C9A45C`), ivory (`#F8F3E8`), and crimson CTA palette.
- Added a subtle left-side directional obsidian scrim on desktop (`opacity-0` initially, fading in with Step 1) plus light text-shadow grounding so warm ivory and gold typography remains effortlessly legible over the bright sunlit map frames while keeping the center pin, glowing ripples, and right-side animated map route completely unobstructed.

### 3. Five-Step Scroll-Coordinated Content Reveal
- **Files:** `src/utils/scrollVideoSync.js`, `src/components/LocationHoursSection.jsx`
- Extended the sticky scroll runway (`h-[340vh] sm:h-[380vh] lg:h-[420vh]`) and coupled `computeLatchedRevealCount` directly to the damped `smoothedProgress` timeline that drives `video.currentTime` so each reveal occurs in exact lockstep with the visible video frame:
  1. **Step 1 (`8%` / `~1.2s`, hand enters holding pin):** Gold hairline, `VISIT PEARL OASIS`, `Location & Service Hours`, and unboxed `Visit & Contact Us · Pearl Oasis, Kohat City Centre · Open Daily` line.
  2. **Step 2 (`25%` / `~2.8s`, pin touches down on map):** `Address` (`Kohat City Centre, near KDA Gate No. 1, Kohat, Pakistan`).
  3. **Step 3 (`43%` / `~4.5s`, concentric ripples radiate):** `Phone Number` (`+92 332 7515538` clickable `tel:` link with `tabular-nums`).
  4. **Step 4 (`61%` / `~6.2s`, pin illuminates in dusk glow):** `Service Hours` (`Daily Operating Hours: 11:00 AM – 11:00 PM` and `Friday Prayer Break: 1:00 PM – 2:30 PM`).
  5. **Step 5 (`79%` / `~8.0s`, glowing route traces across map):** Primary `Get directions on Google Map` CTA linking to `https://maps.app.goo.gl/LeJogix9azNPMHiq7`.
- All steps start hidden (`opacity-0`, `translate-y-5`, `pointer-events-none`, inactive links excluded from tab focus) and latch open monotonically so previously revealed items stay calmly visible without layout shift or overlap while subsequent items arrive.

### 4. Responsive & Accessible Behavior
- **Desktop (`lg:`+):** Full-bleed edge-to-edge uncropped video behind the left-aligned cardless column (`lg:max-w-[365px] xl:max-w-[405px]`), keeping the central location pin and right-side glowing route clear.
- **Mobile & Tablet (`< lg`):** Edge-to-edge full-width `16:9` video starts vertically centered while all text is hidden, then smoothly glides upward beneath the navbar when Step 1 reveals so all five unboxed steps appear cleanly underneath without covering the video.
- **Reduced Motion:** Honors `prefers-reduced-motion: reduce` with a static full-width video preview (`t = 9.0s`, showing the glowing pin and illuminated map route) and all five cardless information items immediately visible.

## Verification
- Updated `src/utils/scrollVideoSync.test.mjs` covering the new Cloudinary asset URLs, sticky runway progress clamping, storyboard-skipping timestamp mapping, strictly ordered 5-step thresholds, latched sequential persistence, and exponential damping convergence (`6/6` passing via `node --test`).
- Verified `tsc --noEmit` (`npm run lint`), production Vite build (`npm run build`), HTTP `200` availability of the new Cloudinary video streams and poster, and live Express/Vite server response on port `3000`.
