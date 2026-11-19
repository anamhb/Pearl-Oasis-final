# Delivery Icons — Position & Floating Animation Separation Fix

## Overview
Fixed the floating animation structure for the 5 circular feature icons (`shop.png`, `food.png`, `map.png`, `home.png`, `rating.png`) surrounding the delivery rider in `src/components/LocationHoursSection.jsx`.

---

## Technical Details & Architecture

### 1. Two-Layer Component Architecture
To ensure CSS animation transforms (`translateY`) never override or disturb the fixed grid positioning transforms (`-translate-y-1/2`, `-translate-x-1/2`), positioning styles were completely separated from floating animation logic:

- **Outer Wrapper (`div`)**:
  - Handles **fixed grid reference positioning ONLY**.
  - Retains exact original Tailwind positioning:
    - **Icon 1 (`shop.png`)**: `absolute left-[2%] top-[42%] -translate-y-1/2`
    - **Icon 2 (`food.png`)**: `absolute left-[16%] top-[14%]`
    - **Icon 3 (`map.png`)**: `absolute left-1/2 top-[2%] -translate-x-1/2`
    - **Icon 4 (`home.png`)**: `absolute right-[16%] top-[14%]`
    - **Icon 5 (`rating.png`)**: `absolute right-[2%] top-[42%] -translate-y-1/2`

- **Inner Element (`div`)**:
  - Contains icon size, white background badge styling, and the floating animation class (`icon-float-1` through `icon-float-5`).
  - Animates pure relative vertical displacement (`translateY(0px)` → `translateY(-7px)` → `translateY(0px)`).

### 2. Zero Positional Drift & Preserved Alignment
- Because the outer wrapper anchors the fixed reference point, the inner element floats `-7px` up and down strictly relative to its parent frame.
- At `0%` and `100%`, the inner element returns to `translateY(0px)`, anchoring the icons permanently around their exact original reference coordinates without any positional drift.

### 3. Asynchronous Timings & Accessibility
- Preserved unique, offset timings (`3.2s` to `4.1s` durations with `0s` to `1.1s` delays).
- Full `prefers-reduced-motion` support cleanly bypasses inner animation without disturbing icon placement.

---

## Verification
1. **Compilation Check**: `compile_applet` passed cleanly.
2. **Linting Check**: `lint_applet` passed with zero errors.
3. **Dev Server**: Restarted dev server.
