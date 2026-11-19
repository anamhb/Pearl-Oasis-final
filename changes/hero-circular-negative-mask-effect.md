# Hero "Pearl Oasis" Circular Negative Mask Effect

## Summary
Replaced the Hero heading intro animation on **"PEARL OASIS"** (`src/components/Hero.jsx`) with a two-layer animated circular negative-mask reveal that glides smoothly along a curved 4-second arc on initial page load while leaving all other Hero elements, slider transitions, buttons, and typography unchanged.

## Implementation Details

### 1. Two Aligned Text Layers (`src/components/Hero.jsx`)
- Wrapped `PEARL` and `OASIS` inside a tightly sized `relative inline-flex` container inside `<h1>` (`hero-title`) preserving the exact `Cormorant Garamond` (`font-serif-heading`), uppercase, tracking (`tracking-[0.04em] sm:tracking-[0.08em]`), sizing (`clamp(1.85rem,7.2vw,6.2rem)`), and gap (`gap-2.5 sm:gap-5 md:gap-7`).
- **Base layer**: Renders the original `#F8F3E8` heading with its existing drop/text shadows.
- **Overlay layer** (`.hero-title-negative-overlay`): Positioned identically (`aria-hidden="true"`, `pointer-events-none`, `absolute inset-0`) with background-matched text colour (`#0B0708`) and animated `clip-path: circle(R% at X% Y%)` keyframes relative to the heading bounding box so proportions scale automatically across mobile and desktop viewports.

### 2. Smooth 4-Second Curved Arc (`@keyframes heroCircularNegativeMask`)
1. Starts near the center (`50% 50%`) oversized (`26%` radius).
2. Contracts (`15.5%`) as it arcs downward and left toward the lower-middle left area (`14% 66%`).
3. Curves smoothly upward to reach its highest apex near the center (`50% 24%`, `17.5%`).
4. Travels right and downward while expanding (`25.5%` near `87% 63%`).
5. Shrinks smoothly down to `0%`, unmounting the overlay on `onAnimationEnd` so `"PEARL OASIS"` remains completely visible.

### 3. Play-Once Behavior & Reduced Motion
- A module-level `hasHeroTitleRevealed` flag (set after StrictMode initial mount stabilization) plus `titleRevealDone` state ensures the animation plays strictly once on initial page load and never replays on scrolling, Hero slide transitions, or React re-renders.
- Respects `prefers-reduced-motion: reduce` both in React state initialization/listener and via CSS `@media (prefers-reduced-motion: reduce)`, displaying the normal heading immediately without animation.
