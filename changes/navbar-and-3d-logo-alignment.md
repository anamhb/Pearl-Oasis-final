# Navbar Alignment & 3D Logo Positioning Update

## Summary of Changes
1. **3D Logo Emblem Precision Positioning**:
   - Updated `src/components/BrandLogo.jsx` style transform from `translateX(-2px)` to `translateX(16px)` so the bottom finial of the rotating 3D gold emblem points directly over the tip of the letter 'l' in "Pearl".
   - This exact alignment is shared across both the Navbar and Footer brand headers.

2. **Navbar Layout & Component Alignment**:
   - Enforced a unified vertical center axis across the Navbar container (`min-h-[52px]`).
   - Aligned the Brand Logo link, desktop navigation links (`Home`, `Our Story`, `Menu`, `Signature Dishes`, `Contact`), and action buttons (`Cart`, `Order Now`) along the exact same vertical center line.
