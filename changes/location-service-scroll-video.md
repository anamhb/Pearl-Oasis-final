# Location & Service Section — Scroll-Controlled Background Video Redesign

## Overview
Redesigned the **Location & Service** section (`#contact`) to replace the previous right-side delivery scooter and floating 3D badge graphics with a full-section, scroll-controlled Cloudinary background video (`Creating_restaurant_introduction__b70fbf73.mp4`) and a latched scroll-triggered reveal for the preserved left-side contact and service-hours content.

## Key Changes

### 1. Background Video Integration & Smooth Scrubbing Optimization
- **Files:** `src/utils/scrollVideoSync.js`, `src/components/LocationHoursSection.jsx`
- Integrated the required Cloudinary video (`https://res.cloudinary.com/z8nlnc6b/video/upload/v1794931588/Creating_restaurant_introduction__b70fbf73.mp4`) as the section's main visual element.
- **Dense-Keyframe Scrubbing Stream + Raw Fallback:** Inspected the source video with `ffprobe` (`1280×720`, 16:9, `24 fps`, `10.0s`) and found that the raw asset contains only a single keyframe (`1 I-frame`), which causes frame-decode stalls during bidirectional scrubbing. The component streams the same Cloudinary asset with dense keyframes (`ki_0.1,ac_none,q_auto` — 100 I-frames, 4.58 MB) and automatically falls back to the raw Cloudinary URL on any playback error.
- **In-Memory Blob Pre-Buffering:** Uses an `IntersectionObserver` (`rootMargin: '2200px 0px'`) to pre-fetch the scrubbing stream into an in-memory `Blob` URL (swapped cleanly only while the user is still near the start of the runway, and revoked on unmount) so frame-by-frame seeking runs from local memory with zero network stalls.
- **Clean Start Frame & Instant Poster:** Frame inspection showed an AI-generation storyboard crossfade during the first `~0.38s` of the clip. Playback starts cleanly at `0.45s` (`LOCATION_VIDEO_START_TIME`) on the sunlit map-pin shot and pairs with a matching Cloudinary `so_0.5` JPEG poster frame to prevent any dark/blank flash on initial paint.
- **No Auto-Play:** The `<video>` is strictly paused (`muted`, `playsInline`, `preload="auto"`, no `autoPlay` or `loop`, plus a `play` listener guard) so progression is driven exclusively by scroll position.

### 2. Removal of Previous Right-Side Images
- **File:** `src/components/LocationHoursSection.jsx`
- Removed all six previous image imports (`new_delivery.png`, `shop3D.png`, `Pfood3D.png`, `map3D.png`, `home3D.png`, `star3D.png`), the dashed SVG arc and traveling dot animation, the five circular feature badges, and the embedded `@keyframes iconFloat` CSS block.

### 3. Scroll-Controlled Playback Architecture
- **Files:** `src/utils/scrollVideoSync.js`, `src/components/LocationHoursSection.jsx`
- Uses the repository's sticky-runway scroll architecture (`h-[300vh] sm:h-[340vh] lg:h-[380vh]` outer container paired with a `sticky top-0 h-[100svh] lg:h-screen` pinned stage, compatible with `overflow-x: clip` in `src/index.css` and `#contact` anchor links in `Navbar` and `Footer`).
- Smoothly synchronizes scroll progress to `video.currentTime` using a passive scroll listener, frame-rate-independent exponential damping (`dampProgress`) inside an on-demand `requestAnimationFrame` loop, and seek-queue gating (`!video.seeking` + `seeked` listener) to eliminate lag and stuttering while stopping idle rAF frames when stationary.

### 4. Latched Scroll-Triggered Text Reveal & Preserved Content
- **File:** `src/components/LocationHoursSection.jsx`
- **Hidden Initially:** At `progress < 0.12`, no text or left readability scrim is visible (`opacity-0`, `pointer-events-none`, links excluded from tab focus), letting the opening map-pin frame display unobstructed.
- **Smooth Staggered Entrance & Persistence:** Once scroll progress crosses `12%` (`LOCATION_REVEAL_SCROLL_THRESHOLD`), a latched reveal state triggers a three-beat GPU-composited (`opacity` + `transform`) entrance revealing the section header (`VISIT PEARL OASIS` / `Location & Service Hours`), the translucent dark burgundy `Visit & Contact Us` card, and the preserved address, `tel:` phone link, daily operating hours (`11:00 AM – 11:00 PM`), Friday Prayer Break (`1:00 PM – 2:30 PM`), and Google Maps CTA (`https://maps.app.goo.gl/LeJogix9azNPMHiq7`). Once revealed, the content remains continuously visible while the video continues progressing through the golden portal and into the Pearl Oasis reception lobby.

### 5. Uncropped Aspect Ratio & Responsive Framing
- Preserves the full `16:9` aspect ratio using `object-contain` inside an obsidian-and-burgundy ambient backdrop (`#0B0708` with radial burgundy glow and subtle edge feathering) so no visual details are cropped or zoomed.
- **Desktop (`lg:`+):** Full-viewport uncropped background video with the left-side content anchored cleanly in a compact left column (`lg:max-w-[355px] xl:max-w-[395px]`), keeping the centered golden portal and illuminated **"PEARL OASIS RESTAURANT"** marble reception wall clearly visible alongside the card.
- **Mobile & Tablet (`< lg`):** Full-width uncropped `16:9` video starts vertically centered while zero text is visible, then glides smoothly to the upper frame as the Location & Service card reveals underneath — preventing the card from covering the video on portrait screens.
- **Reduced Motion:** Honors `prefers-reduced-motion: reduce` with a static split layout showing the framed video preview and immediately visible contact/hours details.

## Verification
- Added unit tests in `src/utils/scrollVideoSync.test.mjs` verifying Cloudinary asset constants, normalized scroll progress clamping, clean start-frame mapping, exponential damping convergence, and latched text-reveal persistence (`5/5` passed via `node --test`).
- Verified TypeScript type-checking (`npm run lint`), production build (`npm run build`), and live server response on port `3000`.
