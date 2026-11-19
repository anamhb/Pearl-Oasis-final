# Hero Section Update: Entrance Image Background & Scroll-Driven Pill Animation

## Summary of Changes
1. **Background Image Integration & High Visibility**:
   - Replaced video sources in the hero section background and the expansion pill with `src/assets/images/entrance.jpg`.
   - Increased image opacity to 100% (`opacity-100`) and lightened vignette overlays so the entrance image is clearly and richly visible across the background.

2. **Flourish Text Update**:
   - Updated top script text flourish to `"Welcome to"` (with lowercase 't').

3. **Scroll-Driven Animation**:
   - Converted the timed automatic play animation into a smooth scroll-driven step-by-step animation (`setScrollProgress`).
   - As the user scrolls down through the hero section, the central pill grows vertically, expands horizontally into a rounded gold-rimmed pill, and finally expands into its full heroic aspect ratio while scaling down text accordingly.
   - Maintained full responsiveness and `prefers-reduced-motion` compatibility.
