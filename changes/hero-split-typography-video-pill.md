# Pearl Oasis Hero Section — Split-Word Typography with Animated Video Pill

## Overview
Updated the **Pearl Oasis Hero Section** (`src/components/Hero.jsx`) by transforming the main brand title into a high-end split-word typography layout: **PEARL [VIDEO PILL] OASIS**, featuring an animated video pill seamlessly integrated between the two words.

---

## Key Features & Design Details

### 1. Unified Split-Word Heading
- **Brand Title**: Rendered as a single horizontal flex row (`PEARL` on left, `[VIDEO PILL]` in center, `OASIS` on right).
- **Typography**: Classical bold uppercase serif (`font-serif-heading`) styled in warm ivory (`#F8F3E8`), matching Pearl Oasis's luxury brand identity.
- **Proportions**: Scaled across responsive breakpoints (`text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl`), ensuring the full heading stays on a single line with zero awkward wrapping across all viewport sizes.

### 2. Two-Phase Animated Video Pill
- **Video Source**: Embedded the supplied Cloudinary MP4 URL (`https://res.cloudinary.com/z8nlnc6b/video/upload/v1794039821/Pearl-Oasis-hero-video.mp4`).
- **Autoplay & Muted**: Configured with `autoPlay`, `loop`, `muted`, `playsInline`, `object-fit: cover`, and fallback poster image (`hero_emerald_entrance_1793870275326.jpg`).
- **Pill Shape**: Styled as a wide horizontal capsule with `rounded-full`, a champagne gold rim border (`border-[#C9A45C]/80`), and an inner glow ring (`shadow-[0_0_25px_rgba(201,164,92,0.4)]`).
- **Two-Phase Expansion Animation**:
  - `Phase 1 (0% → 38%)`: The pill expands vertically from a thin center line (`scaleY(0) scaleX(0.04) → scaleY(1) scaleX(0.04)`).
  - `Phase 2 (38% → 100%)`: The pill expands horizontally into its wide pill form (`scaleY(1) scaleX(0.04) → scaleY(1) scaleX(1)`).
  - Driven by a smooth cubic-bezier easing curve (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Reduced Motion Support**: Controlled via `@media (prefers-reduced-motion: reduce)`, rendering the pill instantly in its final expanded state without motion.

### 3. Preserved Tagline & Buttons
- **Welcome Flourish**: Preserved `"Welcome"` in cursive script (`#F5C369`) above the heading.
- **Tagline**: Preserved `"Come hungry, leave happy"` in cursive script (`#F5C369`) directly below the split-word heading.
- **CTA Buttons**: Preserved `"Enter Restaurant"` and `"Reserve a Table"` CTA buttons with original gradient styles and modal handlers.
- **Scroll Cue**: Preserved the bottom scroll indicator pointing to `#our-story`.

---

## Verification

1. **Compilation Check**: `compile_applet` passed cleanly.
2. **Linting Check**: `lint_applet` passed with zero errors.
3. **Responsive Verification**: Verified scaling across mobile, tablet, and desktop viewports.
