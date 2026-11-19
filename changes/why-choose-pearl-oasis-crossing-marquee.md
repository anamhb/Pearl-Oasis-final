# Why Choose Pearl Oasis — Crossing Marquee / Moving Tape Section

## 1. Overview
Implemented the **"Why Choose Pearl Oasis"** section positioned immediately after the **Menu section** (`MenuSection.jsx`) and before the **Restaurant Experience & Visual Gallery** (`ExperienceSection.jsx`).

The section features a visually striking **Crossing Marquee / Moving Tape design** with two wide diagonal text ribbons intersecting in an X-pattern with opposite continuous motion, scroll speed acceleration, scroll direction reversal, and viewport-aware performance optimization.

---

## 2. Design & Brand Compliance

### Layout & Sizing
- **Full-Width Bleed:** Both ribbons extend to `150vw` (`-left-[25vw]`) inside an `overflow-hidden` section container, guaranteeing a seamless, infinite full-width appearance without causing horizontal scrollbars.
- **Crossing Angles:**
  - **First Ribbon (Gold):** Rotated clockwise (`rotate-[2.2deg]` to `rotate-[2.5deg]`).
  - **Second Ribbon (Burgundy):** Rotated counter-clockwise (`-rotate-[2.2deg]` to `-rotate-[2.5deg]`).
- **Section Styling:**
  - Background: Deep black `#0B0708` with radial burgundy aura (`rgba(59,18,25,0.45)`).
  - Upper & Lower Dividers: Fine antique gold borders (`border-[#C9A45C]/20`).
  - Centered brand filigree flourish with gold uppercase eyebrow label: `THE PEARL OASIS DISTINCTION`.
  - Editorial serif headline: `Why Choose Pearl Oasis`.

### Ribbons & Typography
- **First Ribbon (Clockwise):**
  - **Background:** Rich metallic champagne-gold gradient (`bg-gradient-to-r from-[#D4AF37] via-[#F5C369] to-[#E8CC8B]`).
  - **Border:** Luminous gold border lines with drop shadow (`shadow-[0_12px_35px_rgba(0,0,0,0.85)]`).
  - **Text & Arrows:** Deep dark burgundy (`#240C11`), bold condensed uppercase font with tracking (`tracking-[0.22em] sm:tracking-[0.28em]`).
- **Second Ribbon (Counter-Clockwise):**
  - **Background:** Deep rich burgundy gradient (`bg-gradient-to-r from-[#140608] via-[#240C11] to-[#140608]`).
  - **Border:** Metallic gold border lines (`border-[#F5C369]/60`) with heavy shadow (`shadow-[0_16px_50px_rgba(0,0,0,0.95)]`).
  - **Text & Arrows:** Warm ivory (`#F8F3E8`) with warm gold arrows (`#F5C369`).

---

## 3. Text Content & Sequence
Both ribbons feature all four brand headings in a seamless, unbroken sequence separated by elegant directional arrows:
1. `DELICIOUS FOOD` ➔
2. `ELEGANT AMBIANCE` ➔
3. `PROFESSIONAL SERVICE` ➔
4. `AFFORDABLE PRICES` ➔

---

## 4. Animation & Physics Engine
- **Continuous 0-Gap Infinite Loop:** Implemented using dynamic segment width measurement and modulo wrapping (`offset = (offset + speed) % segmentWidth`). There are zero jumps, gaps, or flashes.
- **Opposite Movement:**
  - Ribbon 1 moves in the forward direction.
  - Ribbon 2 moves in the opposite backward direction.
- **Scroll Response & Direction Reversal:**
  - **Scrolling Down:** Ribbons accelerate smoothly in their designated forward/reverse directions in proportion to scroll velocity.
  - **Scrolling Up:** Ribbons smoothly reverse their travel directions!
  - **Inertia & Damping:** Scroll velocity is smoothly lerped (`lerp(current, target, 0.1)`) with exponential decay (`targetScrollVelocity *= 0.93`), avoiding jerky starts or stops.
- **Viewport Visibility:** An `IntersectionObserver` automatically pauses the `requestAnimationFrame` loop when the section scrolls out of view, reducing CPU and GPU overhead to zero when viewing other sections.
- **Reduced Motion:** Fully complies with `prefers-reduced-motion` by displaying static crossed ribbons when reduced motion is requested.

---

## 5. Verification
- **Compilation:** `tsc --noEmit` and `npm run build` completed with zero errors.
- **Lint:** `npm run lint` completed with zero errors.
- **Cross-device testing:** Verified responsive layout across mobile (<640px), tablet (640-1024px), and desktop (>1024px) screen sizes.
