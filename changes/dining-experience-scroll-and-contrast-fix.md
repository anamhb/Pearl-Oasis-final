# "An Unforgettable Dining Experience" Scroll Jump & Contrast Fix

## 1. Root Cause of the Scrolling & Image Jump Issue

Analysis of the previous scroll-based image positioning identified two distinct causes for the sudden image jumping and uneven movement:

1. **IntersectionObserver Asynchronous Trigger Latency**:
   - In the previous implementation, the scroll listener had an early-exit guard: `if (!isVisible) return;`.
   - The flag `isVisible` was governed by an `IntersectionObserver` with a narrow threshold.
   - When a user scrolled down from preceding sections into the dining experience banner, the native/Lenis scroll events fired immediately, but `IntersectionObserver` callbacks are delivered asynchronously in the browser event loop.
   - By the time `IntersectionObserver` fired and set `isVisible = true`, the section had already scrolled hundreds of pixels into the viewport.
   - The transform abruptly snapped from its uninitialized/stale coordinate (`translate3d(0, 0, 0)`) to the current coordinate (`translate3d(0, -450px, 0)`), causing a jarring visual jump.
   - Similarly, when scrolling backwards (upwards), un-pinning and re-pinning would stall and suddenly jump into place.

2. **Unclamped Linear Offset**:
   - The offset was calculated as a raw `-rect.top`. When the section was far outside the viewport, this value drifted into thousands of pixels.
   - When scrolling into view, any slight frame delay resulted in large position differentials instead of starting smoothly from a known boundary.

---

## 2. Solution Implemented

### Consistent Scroll Progress Mapping & Pre-Warming
- **Normalized Clamped Progress**:
  ```javascript
  const totalDistance = windowHeight + sectionHeight;
  const currentDistance = windowHeight - rect.top;
  const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));
  ```
- **Boundary-Anchored Travel**:
  ```javascript
  const translateY = -windowHeight + progress * totalDistance;
  bgRef.current.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0)`;
  ```
  - When the section is below the screen (`rect.top >= windowHeight`): `progress = 0`, and the background rests at exactly `-windowHeight`.
  - When the section enters pixel 1 of the screen: `progress` smoothly increases from `0.0`. There is zero jump because the background is already at the exact starting position.
  - When the section is centered: `progress = 0.5`.
  - When the section leaves the viewport: `progress = 1.0`, resting cleanly at `sectionHeight`.
- **Generous 250px Lookahead Margin**:
  - The `IntersectionObserver` uses `rootMargin: '250px 0px'`, activating updates 250 pixels before the section enters the screen.
  - This ensures coordinates are pre-calculated before the user can see any movement, completely eliminating pop-in, jump, or stutter.
- **Lenis Smooth-Scrolling Compatibility**:
  - Uses passive scroll listeners with single-frame `requestAnimationFrame` debouncing, preventing frame drops and coordinating with Lenis smooth-scrolling loops.

---

## 3. Paragraph Readability Enhancements

- **Warm Ivory / Cream Color Tone (`#F5EBE1`)**:
  - Replaced the muted, grayish-brown `#D8C5B8` with warm ivory cream `#F5EBE1`.
  - Complements the dark burgundy, charcoal, and champagne-gold brand aesthetic while lifting text contrast to exceed WCAG AAA standards.
- **Font Weight Adjustment**:
  - Updated from `font-light` (300 weight) to `font-normal` (400 weight), giving letterforms clean, crisp definition over detailed food photography.
- **Layered Text Shadow**:
  - Added `drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]` to ensure effortless legibility.
- **Balanced Overlay**:
  - Tuned the dark gradient (`from-[#0B0708]/75 via-[#140608]/40 to-[#0B0708]/85`) and subtle central vignette (`rgba(11,7,8,0.25)`) to keep the food vibrant and appetizing without muddying contrast.

---

## 4. Verification

- **Compilation**: Clean build with `compile_applet`.
- **Linting**: 0 errors with `lint_applet`.
- **Motion Accessibility**: Verified that `prefers-reduced-motion` cleanly defaults to a centered static background.
- **Scroll Directions**: Verified smooth continuous movement in both scroll directions (scrolling down and scrolling up).
