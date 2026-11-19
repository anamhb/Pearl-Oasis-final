# The Person Behind It / Our Vision Section

## Overview
Added an elegant new section immediately following the Guest Testimonials section and preceding the Location & Service Hours / Footer. This section introduces **Abrar Sikandar**, the Founder and CEO behind Pearl Oasis, and conveys the vision and culinary dedication guiding the restaurant in Kohat.

## 1. Content & Typography Structure (Left Column)
- **Section Eyebrow**: `The Person Behind It / Our Vision` styled with a subtle horizontal gold hairline rule (`#F5C369`) and uppercase tracking.
- **CEO Name**: `Abrar Sikandar` rendered in the signature editorial serif face (`Cormorant Garamond` / `font-serif-heading`) at `text-4xl sm:text-5xl lg:text-6xl text-[#F8F3E8]`, paired with a golden subtitle label `Founder & Chief Executive Officer`.
- **Subheading**: `Our Vision & Commitment` presented with an accent diamond indicator.
- **CEO Message**: 
  > "Pearl Oasis was born out of a passion to redefine the food flavors and dining experience in Kohat. Located near KDA Gate, our vision has always been to create a space where families and friends can gather to enjoy exceptional multi-cuisine flavors—from authentic traditional karahis and sizzling BBQ platters to artisan pizzas—all served with uncompromising quality, warmth, and genuine local hospitality."
  Presented inside a rich dark burgundy card (`bg-[#18080B]/80`) with a gold border (`border-[#C9A45C]/30`), subtle box shadow, decorative quote glyph, and attribution badge.

## 2. Circular Orbit CEO Image (Right Column)
- Reused and parameterized `CircularOrbitImage.jsx` to maintain 100% visual consistency with the existing About Us section:
  - Stationary central circular portrait of CEO Abrar Sikandar (`src/assets/images/CEO.jpg`), framed in a rounded border (`border-[#C9A45C]/60`) with inner vignette depth.
  - Smooth 360-degree rotating outer circular ring with dashed outline and decorative gold accent dots.
  - Continuous circular rotating SVG text:
    `PEARL OASIS · OUR VISION · QUALITY & HOSPITALITY · A PASSION FOR FLAVOUR ·`
  - Pauses rotation smoothly upon user hover.
  - Automatically respects `prefers-reduced-motion` using Tailwind's `motion-reduce:animate-none`.
  - Applied unique SVG path IDs via React `useId()` to prevent SVG `<textPath>` collisions between multiple circular orbit components on the page.

## 3. Layout & Visual Harmony
- 2-column responsive layout (`grid-cols-1 lg:grid-cols-12`):
  - On desktop: text on the left, circular rotating CEO portrait on the right.
  - On tablet & mobile: vertically stacked and centered with responsive sizing (`w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px]`).
- Thematic consistency with deep black `#0B0708` canvas, radial burgundy glows, warm ivory `#F8F3E8` headings, and warm gold `#F5C369` accents.
