# Pearl Oasis Hero Title Intro Animation Fix

## Overview
Fixed the intro animation of the hero title **PEARL [VIDEO PILL] OASIS** in `src/components/Hero.jsx`. The animation now starts precisely as a thin vertical line between the two words, expands into a pill, holds, and then enlarges the video pill while smoothly shrinking the side words (`PEARL` and `OASIS`) on a single 4.2-second timeline.

---

## Key Improvements & Technical Implementation

### 1. Base CSS & 0% Frame Alignment (Problem 1 Fix)
- **Base CSS Alignment**: Styled `.hero-pill` before the animation starts to match the `0%` keyframe exactly:
  ```css
  width: 2px;
  height: 0;
  border-radius: 0;
  opacity: 0;
  overflow: hidden;
  flex: none;
  min-width: 0;
  padding: 0;
  margin: 0 1vw;
  border: 0;
  box-shadow: none;
  ```
  This guarantees that before `.is-play` is triggered, no pill shape, width, height, or gold border is pre-rendered or visible.
- **Absolute Video Positioning**: Applied `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;` to the `<video>` element, ensuring the video never dictates the dimensions of the pill container.
- **Event-Driven Play Readiness**: The animation starts only after page load and video `loadeddata` (with a 1.5s fallback timeout). `animation-fill-mode: both` applies `0%` styling from the start frame.
- **Poster Fallback**: Displayed poster image inside the pill wrapper until video playback begins.

### 2. Single 4.2s Keyframe Timeline (Problem 2 Fix)
Configured a single continuous timeline (`--dur: 4.2s`, `cubic-bezier(.77, 0, .18, 1)`):
- **Pill Animation (`@keyframes pillTimeline`)**:
  - `0%`: Vertical line `width: 2px; height: 0; opacity: 1; border: 0; box-shadow: none;`
  - `18%`: Vertical line grows full height `width: 2px; height: var(--h1); border: 0;`
  - `45%`: Opens into initial pill shape `width: var(--w1); height: var(--h1); border-radius: 999px; gold rim & glow fade in`
  - `60%`: Short hold at initial pill size (`--w1`, `--h1`)
  - `100%`: Enlarges into final prominent video pill (`--w2`, `--h2`) with full gold rim glow (`box-shadow: 0 0 35px rgba(201,164,92,0.45)`)
- **Word Animation (`@keyframes wordTimeline`)**:
  - `0% - 60%`: Large initial font size `font-size: var(--fs1)`
  - `100%`: Smoothly shrinks to `font-size: var(--fs2)`, allowing the central video pill to become larger and more visible without horizontal overflow.

### 3. Responsive Proportions & Layout Stability
- Configured fluid clamp CSS variables tuned for mobile, tablet, and desktop viewports:
  - `--fs1: clamp(3rem, 9.5vw, 8rem);`
  - `--fs2: clamp(1.4rem, 4.5vw, 3.8rem);`
  - `--h1: clamp(45px, 8vw, 115px);`
  - `--w1: clamp(110px, 18vw, 270px);`
  - `--h2: clamp(85px, 15vw, 210px);`
  - `--w2: clamp(150px, 32vw, 500px);`
- **Natural Flex Flow**: "Welcome", tagline ("Come hungry, leave happy"), and buttons remain in standard flex column flow, moving down smoothly as the heading height expands from `--h1` to `--h2`.
- **Accessibility**: Full `prefers-reduced-motion` support cleanly bypasses the animation to render the final state instantly.

---

## Verification
1. **Compilation Check**: `compile_applet` passed with zero errors.
2. **Linting Check**: `lint_applet` passed cleanly.
3. **Dev Server**: Restarted dev server.
