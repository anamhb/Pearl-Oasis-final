# Delivery Icons — Subtle Floating Animation

## Overview
Added a soft, natural floating animation to the 5 circular feature icons (`shop.png`, `food.png`, `map.png`, `home.png`, `rating.png`) surrounding the delivery rider in `src/components/LocationHoursSection.jsx`.

---

## Technical Details & Behavior

### 1. Natural Vertical Movement
- **Animation Style**: Configured pure vertical motion (`translateY`) with peak amplitude of `-7px` in a smooth `ease-in-out` continuous loop.
- **Base Transform Alignment**: Preserved the original positioning transforms:
  - **Standard Top Icons (`food.png`, `home.png`)**: `@keyframes floatBasic` translates from `0px` to `-7px`.
  - **Vertical Centered Icons (`shop.png`, `rating.png`)**: `@keyframes floatYCentered` translates from `-50%` to `calc(-50% - 7px)`.
  - **Horizontal Centered Icon (`map.png`)**: `@keyframes floatXCentered` translates from `translateX(-50%) translateY(0px)` to `translateX(-50%) translateY(-7px)`.

### 2. Asynchronous Durations & Delays
To prevent synchronized movement, each icon uses a unique duration and animation delay:
1. **Icon 1 (`shop.png`)**: `3.2s` duration, `0.0s` delay (`.icon-float-1`).
2. **Icon 2 (`food.png`)**: `3.8s` duration, `0.5s` delay (`.icon-float-2`).
3. **Icon 3 (`map.png`)**: `3.4s` duration, `1.1s` delay (`.icon-float-3`).
4. **Icon 4 (`home.png`)**: `4.1s` duration, `0.2s` delay (`.icon-float-4`).
5. **Icon 5 (`rating.png`)**: `3.6s` duration, `0.8s` delay (`.icon-float-5`).

### 3. Layout Stability & Accessibility
- **Zero Layout Shifts**: Driven by GPU-composited CSS transforms (`will-change: transform`), preventing any reflow or collision with the delivery rider image.
- **Accessibility**: Controlled via `@media (prefers-reduced-motion: reduce)`, disabling motion completely when reduced motion is preferred.
- **Isolated Effect**: Only applied to the 5 circular icons. The rider image, background, and surrounding layout remain unaffected.

---

## Verification
1. **Compilation Check**: `compile_applet` passed cleanly.
2. **Linting Check**: `lint_applet` passed with zero errors.
3. **Dev Server**: Restarted dev server.
