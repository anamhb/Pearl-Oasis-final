# "An Unforgettable Dining Experience" Pinned Background Image Reveal

## Overview
Redesigned the **"An Unforgettable Dining Experience"** section (`src/components/ExperienceSection.jsx`) with a cinematic **Pinned Background Image Reveal** effect. As the user scrolls through the page, the authentic feast photography remains visually stationary relative to the viewport while the section window scrolls over it, creating a seamless windowed reveal.

---

## Key Implementation Details

### 1. Viewport-Pinned Background Layer
- **Background Asset**: `src/assets/images/hero_oasis_feast_1793682567417.jpg` showing authentic Pearl Oasis culinary spreads (Shinwari Karahi, tandoori naans, dragon noodles, artisan burgers, and table condiments).
- **Pinning Technique**:
  - The section has `position: relative`, `overflow: hidden`, and a responsive height of `clamp(520px, 80vh, 850px)`.
  - The background image container has `position: absolute; top: 0; left: 0; width: 100%; height: 100vh;`.
  - In a `requestAnimationFrame` loop, `updatePin()` measures the section's `getBoundingClientRect().top` and updates the background's `translate3d(0, ${-rect.top}px, 0)` so the background element's screen coordinate remains pinned at `y = 0` (top of the viewport) while the section passes over it.
  - Zero layout shifts, zero DOM reflows: strictly uses GPU compositor translation (`will-change: transform`).
  - Active only while the section is on screen via `IntersectionObserver` (`rootMargin: '100px 0px'`).
  - Compatible with smooth scrolling systems (Lenis/native) using passive scroll listeners without scroll hijacking.
  - Full `prefers-reduced-motion` compliance: motion is cleanly disabled and replaced with a static centered background.

### 2. Centered Editorial Heading Presentation
- **Line 1 ("An Unforgettable")**:
  - Rendered in flowing script typography using `'Alex Brush', cursive`.
  - Warm champagne gold color (`#E8CC8B`).
  - Scaled responsively: `text-4xl sm:text-6xl md:text-7xl lg:text-8xl`.
- **Line 2 ("Dining Experience")**:
  - Rendered in classical bold uppercase serif typography.
  - Soft warm ivory (`#F8F3E8`) with refined letter spacing (`tracking-[0.14em] sm:tracking-[0.2em]`).
  - Scaled responsively: `text-3xl sm:text-5xl md:text-6xl lg:text-7xl`.
- **Center Alignment**: Centered both horizontally and vertically with soft text drop shadows for legibility.
- **Decorative Gold Divider**: Hairline gold accents with diamond star `✦`.
- **Preserved Functionality**: The "Reserve Your Table" CTA remains accessible and connected to `onOpenReservation`.

### 3. Subtle Dark Overlay
- Multi-layer non-destructive gradient overlay:
  - Vertical transition: `bg-gradient-to-b from-[#0B0708]/85 via-[#18080B]/50 to-[#0B0708]/90`.
  - Central vignette: `bg-[radial-gradient(ellipse_at_center,rgba(36,12,17,0.35)_0%,rgba(11,7,8,0.78)_100%)]`.
  - The food details, sizzle, and warm colors stay clearly visible and appetizing without muddy or excessive dimming.

---

## Verification
- **Compilation**: Verified via `compile_applet` (TypeScript build succeeds).
- **Linting**: Verified via `lint_applet` (0 errors).
- **Responsive Layout**: Verified at desktop (1440px+), tablet (768px - 1024px), and mobile (<640px).
- **Subsequent Sections**: The sticky horizontal Moments Gallery directly follows without any visual gaps or layout shift.
