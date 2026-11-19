# Hero Section Background Image Visibility Fix

## Root Cause Analysis
During inspection of `src/components/Hero.jsx`, three compounding factors were identified that drastically reduced the visibility of `entrance.jpg`:

1. **Center Backdrop Blur Diffuser**: An internal backdrop element `<div className="absolute -inset-x-6 sm:-inset-x-12 -inset-y-6 bg-black/40 rounded-3xl blur-3xl pointer-events-none -z-10" />` placed inside the relative hero content wrapper applied a massive dark `bg-black/40 blur-3xl` box directly over the center of the image.
2. **Image Brightness Filter**: The `img` tag had `brightness-[0.85]` applied, which artificially dimmed the raw image colors by 15%.
3. **Stacked Multi-Layer Dark Overlays**: Two heavy full-screen overlay divs (`bg-gradient-to-b from-[#0B0708]/60 via-[#18080B]/25 to-[#0B0708]/80` and `radial-gradient(rgba(24,8,11,0.15) 0%, rgba(11,7,8,0.65) 100%)`) multiplied darkness over the image, obscuring architectural details and warm lighting of the restaurant entrance.

## Applied Solution
1. **Removed Center Blur Diffuser**: Eliminated the `bg-black/40 blur-3xl` element behind the text container.
2. **Enhanced Image Filter**: Removed `brightness-[0.85]` and updated to `filter brightness-[1.03] contrast-[1.05]`, allowing the entrance image's vibrant tones to pop.
3. **Consolidated Atmospheric Overlay**: Replaced the multi-layer dark gradients with a single lightweight gradient (`from-[#0B0708]/50 via-black/15 to-[#0B0708]/75`), providing smooth navbar/footer section transitions without obscuring the background.
4. **Preserved Text Legibility**: Maintained strong text-shadows (`drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]`) so headings, script text, and action buttons remain fully legible over the clear background image.
