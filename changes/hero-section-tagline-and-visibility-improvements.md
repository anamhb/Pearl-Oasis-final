# Hero Section Improvements: Tagline, Hierarchy & Video Visibility

## Overview
This update refines the Hero section of the Pearl Oasis website by restructuring the typography hierarchy, introducing the new tagline, increasing the clarity and brightness of the background video, and ensuring all hero content and CTA buttons fit seamlessly within the initial viewport across all devices.

## 1. Text Hierarchy & Content Updates
- **"Welcome"**: Preserved in its elegant cursive script (`Alex Brush` via `font-script text-3xl sm:text-4xl md:text-5xl text-[#F5C369] tracking-wide`).
- **"PEARL OASIS"**: Kept as the grand serif heading (`Cormorant Garamond` / `font-serif-heading`) with crisp uppercase tracking and cinematic glow.
- **"Come hungry, leave happy"**: Added immediately below the "PEARL OASIS" heading. Styled identically to "Welcome" using the same font family (`font-script`), warm golden yellow color (`#F5C369`), and text shadow.
- **Removed**: "A Culinary Journey in the Heart of Kohat" has been completely removed from the Hero section.
- **Clean Hierarchy**:
  1. Welcome
  2. Pearl Oasis
  3. Come hungry, leave happy
  4. [Hero CTA Buttons: "Enter Restaurant" & "Reserve a Table"]

## 2. Background Video Visibility
- **Overlay Lightening**: Replaced the previous stacked heavy dark overlays with a balanced, lighter cinematic treatment:
  - Gradient: `bg-gradient-to-b from-[#0B0708]/55 via-transparent to-[#0B0708]/75` allowing the interior dining hall, chandeliers, and ambiance of the video to be visibly brighter and clearer.
  - Subtle edge vignette: `bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(11,7,8,0.45)_100%)]`.
- **Text Readability & Contrast**: Added a localized, soft centered diffuser backdrop behind the text container (`bg-black/35 blur-2xl`) combined with text drop-shadows, ensuring crisp WCAG-compliant legibility without obscuring the background video.

## 3. Responsive Viewport Layout
- **Initial Viewport Guarantee**: Configured the Hero container with `h-screen min-h-screen` and adjusted vertical padding (`pt-16 sm:pt-14 pb-12 sm:pb-8`) so that "Welcome", "Pearl Oasis", "Come hungry, leave happy", and the CTA buttons are visible together above the fold without scrolling.
- **Desktop, Tablet & Mobile**: Balanced text sizing and spacing to prevent clipping or unnecessary scrolling on both large monitors, laptops, tablets, and mobile screens.
- **CTA Actions**: Preserved the primary crimson gradient "Enter Restaurant" button (smooth scrolls to `#our-story`) and the gold-bordered "Reserve a Table" button (triggers the reservation modal).
