# Moments at Pearl Oasis — Pinned Scroll Engine, Bottom Gap Removal, and Left Fade Effect

## Summary
Resolved the gallery section pinning behavior, removed the empty bottom gap before Testimonials, eliminated the left-side text background panel, and implemented a smooth gradient opacity fade as gallery images travel toward and underneath the left text area.

## Key Changes & Fixes

### 1. Root Cause of Premature Unpinning & Broken Pinning
- **Root Cause Identified**:
  - `src/components/ExperienceSection.jsx` had `overflow-hidden` on its root `<section id="experience">`. In CSS specifications, any ancestor with `overflow: hidden` creates an overflow/scroll container that disables viewport-relative `position: sticky` on child elements.
  - `src/App.jsx` had `overflow-x-hidden` on its root container, which similarly interfered with sticky positioning across browsers.
- **Correction**:
  - Removed `overflow-hidden` from `<section id="experience">` in `ExperienceSection.jsx`, placing it exclusively on the inner hero banner div to preserve its background image clipping without trapping child sticky elements.
  - Replaced `overflow-x-hidden` with `overflow-x-clip` in `App.jsx`, preventing horizontal window scrollbars while allowing `position: sticky` to pin to the window viewport.

### 2. Elimination of Unnecessary Bottom Gap & Exact Scroll Distance Math
- **Formula Implemented**:
  - Calculated the exact required horizontal travel distance from the DOM:
    $$\Delta X = \text{track.scrollWidth} - \text{trackContainer.clientWidth}$$
  - The vertical scroll runway distance $S$ is set exactly equal to $\Delta X$, rather than using arbitrary multipliers or manual padding buffers:
    $$S = \Delta X$$
    $$\text{containerHeight} = \text{window.innerHeight} + S$$
  - At every scroll position $y$ past the section's entrance:
    $$\text{translateX} = \text{clamp}(0, y, \Delta X)$$
  - As soon as the user scrolls through distance $S$:
    - The final column (*Szechuan Kung Pao & Private Dining Chamber*) reaches its exact resting position fully visible within the viewport.
    - At that exact pixel offset, the container reaches the bottom of the viewport, the sticky pin releases naturally, and normal vertical scrolling continues immediately into Testimonials.
  - There is zero dead spacer, zero buffer runway, and zero empty bottom gap before the Testimonials section.

### 3. Left Text Background Removal & Dissolve Fade Effect
- **Clean Left Typography**:
  - Removed all panel styling, backgrounds, and borders behind the left heading and paragraph. The text now floats directly on the section's ambient dark emerald canvas.
- **Left Gradient Mask & Vignette Fade**:
  - Configured a linear gradient mask on the moving track container (`mask-image` and `-webkit-mask-image`), paired with a soft ambient left gradient vignette:
    - Right / center viewport: $100\%$ visible and vibrant.
    - As images move left toward the text area ($480\text{px} \to 280\text{px}$): their opacity smoothly dissolves from $100\%$ down to $15\%$.
    - Directly behind the left text ($160\text{px} \to 0\text{px}$): the images become completely transparent ($0\%$ opacity).
  - Images appear to dissolve naturally into the dark ambiance instead of abruptly stopping or covering the text, keeping the heading and paragraph crisp and readable throughout the entire scroll journey.
- **Symmetric Reverse Scrolling**:
  - Scrolling upward reverses the animation smoothly without jumps, re-pinning at the final image and returning gracefully to the initial frame.
