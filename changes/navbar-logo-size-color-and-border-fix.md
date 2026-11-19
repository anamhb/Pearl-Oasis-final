# Pearl Oasis — Navbar Logo Sizing, Golden 3D Emblem & Scrolled Line Removal

## Summary of Changes

### 1. Increased "Pearl Oasis" Text Image Sizing
- Tightly trimmed all empty transparent margins from `src/assets/images/logo-text.png` (originally 636x392 with 138px of blank top/bottom margins, now 575x254 tightly cropped).
- Because 100% of the image height is now the actual visible lettering, the displayed text is significantly larger, bolder, and crystal-clear.
- Maintained the overall navbar height by balancing container padding (`pt-[15px]`) so the navbar retains its sleek dimensions without expanding.

### 2. Enlarged & Converted 3D Logo to Vibrant Golden Color
- **Converted to Bright Golden Finish**: Updated `Logo3D.jsx` to explicitly set `mesh.material.color = 0xFFD700` with metalness `0.85`, roughness `0.22`, and a subtle warm gold emissive (`0x664400`) at intensity `0.35`.
- **Enhanced Studio Golden Lighting**: Upgraded ambient light to `3.2` and key directional/point lights to bright golden hues (`0xfff0b3`, `0xffd700`, `0xfff2a3`) for unmistakable brilliance and visibility against the dark emerald background.
- **Enlarged Scale**: Increased model fitting scale from `2.0` to `2.45` and canvas sizing to `w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10`, crowning prominently above the letter "l".

### 3. Removed White Horizontal Line on Scrolled Navbar
- Removed the `border-b border-[#C9A45C]/30` bottom border that was appearing as a thin light/white horizontal line across the screen when scrolled down.
- Set `border-b-0` so the scrolled navbar transitions smoothly with its deep emerald backdrop blur and subtle shadow without any distracting line.
