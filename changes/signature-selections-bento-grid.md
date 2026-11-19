# Pearl Oasis — Signature Selections Redesign
## Modern Minimalist Asymmetric Bento Grid Implementation Note

### Overview
The "Signature Selections" section (`src/components/SignatureDishes.jsx`) was redesigned from a uniform 3-card layout into a sophisticated, editorial **Asymmetric Bento Grid**. The design features seven distinct tiles with varied proportions, authentic restaurant photography, smooth 0.5s hover reveal animations with a 45-degree rotating arrow badge, and an integrated Pearl Oasis philosophy tile.

---

### Grid Architecture & 7-Tile Composition

The desktop layout uses a 4-column asymmetric CSS grid (`grid-cols-4`, `auto-rows-[220px]`):

1. **Tile A (Top-Left Vertical)**:
   - Placement: `lg:col-start-1 lg:col-span-1 lg:row-start-1 lg:row-span-2`
   - Content: *Shinwari Mutton Karahi* (`src/assets/images/dish_mutton_karahi_1793682586059.jpg`)
   - Spans 2 vertical rows on desktop.

2. **Tile B (Wide Horizontal Middle)**:
   - Placement: `lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:row-span-1`
   - Content: *The Grand Oasis Feast* (`src/assets/images/hero_oasis_feast_1793682567417.jpg`)
   - Spans 2 horizontal columns on desktop.

3. **Tile C (Top-Right Compact)**:
   - Placement: `lg:col-start-4 lg:col-span-1 lg:row-start-1 lg:row-span-1`
   - Content: *Szechuan Kung Pao Chicken* (`src/assets/images/dish_chinese_kungpao_1793682601783.jpg`)
   - Single 1x1 grid cell.

4. **Tile D (Featured Information Tile)**:
   - Placement: `lg:col-start-2 lg:col-span-1 lg:row-start-2 lg:row-span-1`
   - Content: Deep forest-green card (`#344536`) with serif heading (*"Ancestral Flame & Quiet Mastery"*), minimal description of the 3 dedicated kitchens on Bannu Road in Kohat, and an understated link to the full menu. Contains no fabricated metrics or awards.

5. **Tile E (Middle Food Tile)**:
   - Placement: `lg:col-start-3 lg:col-span-1 lg:row-start-2 lg:row-span-1`
   - Content: *The Oasis Smash Supreme* (`src/assets/images/dish_oasis_burger_1793682616523.jpg`)
   - Single 1x1 grid cell beside Tile D.

6. **Tile F (Bottom-Right Vertical)**:
   - Placement: `lg:col-start-4 lg:col-span-1 lg:row-start-2 lg:row-span-2`
   - Content: *Smoky Chicken Malai Boti* (`src/assets/images/malai-boti.jpg`)
   - Spans 2 vertical rows on desktop, anchoring the right side with full-bleed photography.

7. **Tile G (Bottom-Wide Horizontal)**:
   - Placement: `lg:col-start-1 lg:col-span-3 lg:row-start-3 lg:row-span-1`
   - Content: *Pearl Special Dragon Chowmein* (`src/assets/images/chawmen.jpg`)
   - Spans 3 horizontal columns across the bottom with full-bleed marble table photography.

---

### Interactive Animations & Hover States

- **Subtle Zoom**: Images scale smoothly (`scale-105`) over 500ms using `ease-out`.
- **Forest-Green Scrim**: A dark gradient overlay (`from-[#241D18]/95 via-[#344536]/80 to-transparent`) transitions from `opacity-0` to `opacity-100` on hover and focus.
- **Text Reveal**: The serif dish name and tagline slide up subtly (`translate-y-2` to `translate-y-0`).
- **Circular Arrow Badge**: Positioned at `top-4 right-4`, this circular badge fades in and rotates ~45 degrees (`group-hover:rotate-45 group-focus-visible:rotate-45 duration-500`).
- **Functionality**: Clicking on any food card or its "Add" action invokes `onAddToTray(dish)` with visual confirmation feedback.

---

### Responsive Behavior

- **Desktop (>=1024px)**: 4-column asymmetric composition.
- **Tablet (640px–1023px)**: 2-column balanced grid where vertical tiles span 2 rows and Tile D / Tile G span across columns.
- **Mobile (<640px)**: 2-column fluid grid with prominent cards spanning both columns (`col-span-2`), while compact cards sit side-by-side (`col-span-1`). Essential dish names and portions are immediately legible without requiring mouse hover. Zero horizontal scrollbar overflow.

---

### Accessibility & Performance

- Full keyboard navigation with `tabIndex={0}`, visible focus rings (`focus-visible:ring-2 focus-visible:ring-[#344536]`), and Enter/Space key triggers.
- Meaningful `alt` and `aria-label` tags for assistive technology.
- `@media (prefers-reduced-motion: reduce)` compliance configured in `src/index.css` to neutralize animations when requested.
- Pure CSS transitions with zero third-party animation dependencies.
