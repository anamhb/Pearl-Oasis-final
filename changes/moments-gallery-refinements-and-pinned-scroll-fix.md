# Moments at Pearl Oasis — Minimalist Layout & Pinned Scroll Optimization

## Summary
Updated the **Moments at Pearl Oasis** gallery based on the visual references to create a minimal, editorial presentation with smoothly rounded image corners, refined viewport sizing, and a deterministic pinned scroll engine.

## Key Changes

### 1. Minimalist Left Text Area
- Stripped all extraneous widgets from the left column: removed the "Visual Sanctuary" badge, scroll hints, gallery progress bar, percentage readout, navigation arrow buttons, and "Click photo to enlarge" cue.
- Removed the vertical border line and separate panel styling.
- Retained only the clean, bold main heading (*"Moments at Pearl Oasis"*) and a short, readable introductory paragraph, allowing the gallery imagery to extend naturally toward the text area.

### 2. Smoothly Rounded Image Corners
- Applied uniform `rounded-[26px]` / `rounded-[28px]` curvature to all standalone and stacked image cards, matching the reference design.
- Enforced `overflow-hidden` across all card containers and image layers to ensure hover scales (`scale-106`) remain clipped inside the rounded boundaries.

### 3. Refined Gallery Dimensions & Viewport Fit
- Reduced card heights to $400\text{px}$–$420\text{px}$ for standalone cards and $192\text{px}$–$200\text{px}$ for stacked pairs.
- Eliminated vertical clipping and overflow, ensuring every image is comfortably framed within the viewport on both 1080p desktop and compact laptop screens.

### 4. Deterministic Pinned Scroll Engine (Zero-Lag Pinning & Full Final Image Reveal)
- Replaced the loose Lerp animation loop with a synchronized, `requestAnimationFrame`-buffered scroll mapper.
- Added a $120\text{px}$ starting rest buffer and a $380\text{px}$ ending rest buffer:
  - When entering the section, the gallery rests at the initial cards.
  - As the user scrolls vertically, the track translates horizontally until the final image is $100\%$ fully revealed.
  - The gallery remains pinned in place through the end buffer so the user can comfortably view the final image without the section prematurely moving upward or unpinning.
  - Once the scroll runway completes, the pinned section smoothly releases into normal vertical scrolling.
  - Scrolling upward in reverse works symmetrically without jumps.
- Mobile layout maintains a clean, touch-friendly swipeable carousel with snap points.
