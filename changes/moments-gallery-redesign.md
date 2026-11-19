# Moments at Pearl Oasis — Scroll-Driven Horizontal Gallery Redesign

## Summary
Redesigned the "Moments at Pearl Oasis" section from a standard 2-row photo grid into a full-screen, sticky scroll-driven horizontal gallery that maps vertical page scrolling into silky horizontal gallery movement.

## Key Changes & Implementations

### 1. Sticky Full-Screen Architecture & Stationary Branding
- **Desktop Sticky Runway**: Designed a `320vh` container with a `sticky top-0 h-screen` viewport stage on screens $\ge 1024\text{px}$.
- **Stationary Left Editorial Panel**: The section kicker (`VISUAL SANCTUARY`), editorial headline (`Moments at Pearl Oasis`), introductory prose, interactive progress meter, and manual navigation arrow buttons remain fixed on the left while images glide horizontally across the screen.
- **Background Ambiance**: Formatted in Pearl Oasis's signature deep emerald canvas (`#021410`, `#062E25`) with subtle gold and warm ambient radial vignettes (`#C9A45C`, `#E8CC8B`).

### 2. Editorial Rhythm & Varied Image Sequencing
Arranged 9 genuine restaurant photographs in an alternating, visually compelling column sequence:
1. **Column 1 (Grand Standalone)**: *Grand Emerald Entrance* (Architecture, $420\text{px} \times 490\text{px}$)
2. **Column 2 (Stacked Pair)**: *Desi Chicken Karahi* & *Emerald Dining Hall* ($330\text{px} \times 235\text{px}$ each)
3. **Column 3 (Panoramic Standalone)**: *Chandelier Grand Hall* (Atmosphere, $540\text{px} \times 490\text{px}$)
4. **Column 4 (Stacked Pair)**: *Charcoal Malai Boti* & *Dragon Chow Mein* ($330\text{px} \times 235\text{px}$ each)
5. **Column 5 (Editorial Standalone)**: *Grand Oasis Feast* (Culinary Spread, $420\text{px} \times 490\text{px}$)
6. **Column 6 (Stacked Pair)**: *Szechuan Kung Pao* & *Private Dining Chamber* ($330\text{px} \times 235\text{px}$ each)

### 3. Smooth Lerp Motion & Performance
- **Linear Interpolation (Lerp)**: Used `requestAnimationFrame` with a $0.1$ easing factor to ensure velvety smooth translation without abrupt jumps or scroll stutter. The animation loop halts cleanly when position reaches target.
- **Interactive Manual Arrows**: Included left/right gold step buttons that smoothly scroll the page window to glide forward or backward by one column.
- **Hardware Acceleration**: Set `translate3d` and `will-change-transform` for GPU compositing.

### 4. Responsive Mobile Experience & Accessibility
- **Mobile Touch Carousel**: On mobile screens (`< 1024px`), displays the heading and intro text on top, followed by a native, touch-friendly swipeable carousel with CSS snap points (`snap-x snap-mandatory`), rounded cards, and swipe prompts.
- **Reduced Motion Support**: Detects `prefers-reduced-motion: reduce` and renders a clean, unpinned, manually scrollable gallery with zero scroll-jacking.
- **Fullscreen Lightbox**: Clicking any photo on desktop or mobile opens an unobstructed high-resolution lightbox with caption, category, photo counter, and keyboard navigation (`ESC`, `ArrowLeft`, `ArrowRight`).
