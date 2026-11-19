# Our Story Section — Circular Orbit Image Redesign

## Summary
Updated the right-side image area of the **Our Story** section to feature a premium, circular orbit-style design.

## Changes Implemented

### 1. Circular Orbit Presentation
- **Component**: Created `src/components/CircularOrbitImage.jsx` to encapsulate the circular design logic.
- **Central Image**: Replaced the previous arch-shaped container with a large, perfectly circular image (`object-fit: cover`) containing the existing restaurant photograph.
- **Rotating Ring**: Added a surrounding circular ring featuring curved, elegant typography (`PEARL OASIS · FRESH FLAVOURS · FINE DINING · UNFORGETTABLE MOMENTS ·`) created via SVG `<textPath>`.
- **Decoration**: Included a subtle dashed circular outline and decorative dots on the ring.
- **Animation**: Implemented a smooth, continuous 360-degree rotation animation (`animate-spin-slow`) that pauses on hover (`hover:[animation-play-state:paused]`).
- **Reduced Motion Support**: Added `@media (prefers-reduced-motion: reduce)` support within CSS to stop the rotation for users who prefer reduced motion.

### 2. Styling & Responsiveness
- **Pearl Oasis Identity**: Used signature gold (`#C9A45C`, `#E8CC8B`) for the ring, text, and decorative dots to align with the website’s emerald and gold branding.
- **Layout Consistency**: Maintained the original left-side heading and narrative layout. The new circular component is centered in the right column, ensuring responsive balance across desktop, tablet, and mobile breakpoints without altering the section’s overall layout structure.
