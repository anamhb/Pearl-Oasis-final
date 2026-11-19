# Location & Service Hours Section — Theme-Matched Circular Orbit Icons

## Overview
Updated the **Location & Service Hours Section** (`src/components/LocationHoursSection.jsx`) by removing the white background from the 5 feature icon badges, applying dark burgundy glassmorphism with a warm metallic gold circle border and soft gold glow shadow, increasing the icon badge sizes, and animating them in a continuous 360° circular motion around the delivery scooter.

---

## Detailed Styling & Motion Enhancements

### 1. Brand Theme Alignment (No White Background)
- **Background**: Replaced `bg-white/95` with `bg-[#18080B]/90 backdrop-blur-md` (dark burgundy glass matching Pearl Oasis luxury aesthetic).
- **Circle Border**: Applied `border-2 border-[#C9A45C]/80` (warm metallic gold border) with hover glow to `#F5C369`.
- **Gold & Dark Shadow**: Applied `shadow-[0_4px_25px_rgba(201,164,92,0.35)]` for depth against the dark background.
- **Increased Icon Size**: Upgraded badge dimensions from `w-11 h-11` to `w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20`, with inner icon images scaled up (`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12`).

### 2. Smooth 360° Circular Orbit Animation
- **Continuous Circular Motion**: Wrapped the 5 feature icons (`shop.png`, `food.png`, `map.png`, `home.png`, `rating.png`) in a 360° rotating orbit ring (`animation: orbitSpin 26s linear infinite`).
- **Upright Counter-Rotation**: Added counter-rotation (`animation: orbitCounterSpin 26s linear infinite`) to each inner icon badge so every icon image remains right-side up while revolving around the delivery scooter.
- **Accessibility**: Controlled via `@media (prefers-reduced-motion: reduce)` to pause rotation when reduced motion is preferred.

### 3. Preserved Functionality
- Kept the Left Card (Address, Phone Number, Service Hours, and "Get directions on Google Map" button) completely intact.

---

## Verification
1. **Compilation Check**: `compile_applet` passed cleanly.
2. **Linting Check**: `lint_applet` passed with zero errors.
3. **Dev Server**: Restarted dev server.
