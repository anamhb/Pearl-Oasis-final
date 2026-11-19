# Hero Section Three-Image Circular Picker Slider

## Overview
Updated the existing Pearl Oasis Hero section (`src/components/Hero.jsx`) to feature an interactive three-image circular picker slider while preserving the existing Pearl Oasis branding, typography, GSAP ScrollTrigger pinned video-pill animation, CTAs, and Explore scroll prompt.

---

## 1. Files Modified & Created
- **Modified**: `src/components/Hero.jsx`
- **Created**: `changes/hero-circular-picker-slider.md`

---

## 2. Background Image Sequence & Initial State
Configured `HERO_SLIDES` in the exact requested order using the existing workspace assets:
1. **Slide 1 (Initial)**: `src/assets/images/new-entrance.jpg` (*Grand Entrance · Kohat*)
2. **Slide 2**: `src/assets/images/hero-second- image.jpg` (*Main Dining Hall*)
3. **Slide 3**: `src/assets/images/hero-third- image.jpg` (*Rooftop Terrace*)

- Slide 1 loads immediately on first paint (`baseIndex = 0`, `activeIndex = 0`, `incomingSlide = null`) with zero blank frame or startup wipe.
- Background scrims remain light (`from-[#0B0708]/45 via-black/10 to-[#0B0708]/65`) so all three photographs remain prominent while keeping headlines and CTAs legible.

---

## 3. Circular Thumbnail Navigation
- **Desktop (`>= 768px`)**: Vertically centered stack of three circular thumbnail buttons along the right edge of the hero.
- **Mobile (`< 768px`)**: Centered horizontal row positioned cleanly at the bottom-center (`bottom-12`), clear of the hero CTAs above, the **Explore** scroll prompt below, and the floating bottom-right WhatsApp button.
- **Active vs. Inactive States**:
  - Thumbnails display each slide's image cropped with `object-cover`.
  - Active thumbnail enlarges (`w-14 h-14 sm:w-16 sm:h-16 md:w-[68px] md:h-[68px]`) and renders two subtle concentric champagne-gold outline rings (`-inset-[5px]` and `-inset-[10px]`) plus a crisp gold border.
  - Inactive thumbnails stay smaller (`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12`) with subdued opacity and hover scale feedback.

---

## 4. Circular Expansion Reveal & Cross-Fade Transitions
- Clicking another circular thumbnail computes the button's center coordinates `(originX, originY)` and maximum corner distance (`endRadius`) relative to `.hero__inner`.
- Using GSAP `useLayoutEffect`, the incoming image layer expands via `clip-path: circle(startRadius at originX originY)` to `circle(endRadius at originX originY)` until covering the entire hero.
- Simultaneously, the incoming image smoothly settles from `scale(1.09)` to `scale(1.0)`, the active thumbnail rings update immediately, and the concise slide context label (`Grand Entrance · Kohat` / `Main Dining Hall` / `Rooftop Terrace`) cross-fades cleanly.
- Rapid clicks during an active transition are blocked via `isTransitioningRef` to prevent overlapping animations.

---

## 5. Autoplay & Accessibility
- **Autoplay Interval**: Advances automatically to the next slide every **6.5 seconds** (`6500ms`).
- **Manual Reset**: Clicking any thumbnail restarts the 6.5-second timer (`autoplayResetTick`).
- **Tab Visibility**: Listens to `document.visibilitychange` and pauses/clears autoplay whenever `document.hidden` is true, resuming cleanly when visible again.
- **`prefers-reduced-motion`**: Disables automatic advancement and skips circular expansion/zoom/fade animations, performing clean instant slide switching on manual selection.

---

## 6. Verification
- Verified all three image asset filenames and sizes in `src/assets/images/`.
- Compiled production bundle with `compile_applet` (`npm run build`) and validated TypeScript/syntax with `lint_applet` (`tsc --noEmit`).
- Verified desktop and mobile responsive spacing, existing GSAP ScrollTrigger pill reveal compatibility, and restarted the development server.
