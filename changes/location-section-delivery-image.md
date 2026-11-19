# Location & Service Hours Section — Express Delivery Image Integration

## Overview
Updated the **Location & Service Hours Section** (`src/components/LocationHoursSection.jsx`) by integrating `src/assets/images/delivery.png` in the center space between the Left Information Card and Right Google Map Card.

---

## Key Features & Responsive Layout

### 1. 3-Element Desktop Row & Center Placement
- **Layout Architecture**: Adjusted the grid to a balanced 12-column row on desktop (`grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 xl:gap-8 items-center`):
  - **Left Card**: `lg:col-span-5` (Address, Phone, Service Hours, Get directions button).
  - **Center Delivery Showcase**: `lg:col-span-2` (Centered `delivery.png` asset with gold-accented badge).
  - **Right Card**: `lg:col-span-5` (Interactive Google Map container).

### 2. Image Preservation & Styling
- **Aspect Ratio**: Preserved the original 470x531 aspect ratio using `object-contain` and fluid `max-w-[150px] sm:max-w-[200px] lg:max-w-[160px] xl:max-w-[200px]`.
- **Pearl Oasis Visual Theme**: Encapsulated the image inside a glass-morphic luxury container (`bg-[#18080B]/85 border border-[#C9A45C]/30`) featuring a subtle drop shadow (`drop-shadow-[0_10px_20px_rgba(0,0,0,0.65)]`) and gold tracking badge ("EXPRESS DELIVERY • Hot & Fresh To Your Door").

### 3. Responsive & Mobile Discipline
- **Desktop (1024px+)**: Displays all three elements in one unified, well-aligned horizontal row.
- **Tablet & Mobile (< 1024px)**: Stacks vertically with clean margins (`my-4 lg:my-0`), preventing cramped spacing, overlap, or horizontal overflow.
- **Content Preservation**: Left and right cards retained 100% of their existing functionality, links, and content.

---

## Verification
1. **Compilation Check**: `compile_applet` passed with zero errors.
2. **Linting Check**: `lint_applet` passed cleanly.
3. **Dev Server**: Restarted dev server.
