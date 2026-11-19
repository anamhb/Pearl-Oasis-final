# Pearl Oasis — Navbar Logo, Carousel, and Category Navigation Improvements

## Summary of Changes

### 1. Navbar Logo
- **Replaced Text with `logo-text.png`**: Swapped the text branding with `src/assets/images/logo-text.png`, displaying the authentic 3D metallic gold cursive script.
- **Restored 3D Logo Original Gold Finish**: Restored the original metallic gold material properties (roughness: 0.35, metalness: 0.70) and studio lighting in `Logo3D.jsx` (`ambientLight: 0xfff5e6`, key directional light `0xe8cc8b`, warm rim `0xc9a45c`), returning to its native gold luster.
- **Fixed Positioning Above Letter "l"**: Positioned the 3D rotating gold emblem at `left: 51.5%` (directly corresponding to the ascender of the letter "l" in "Pearl") with vertical clearance (`paddingTop: 20px` in navbar, `top: 0px`), ensuring it sits clearly above the letter "l" without any overlapping.
- **Preserved Smooth 360° Rotation**: The 3D logo maintains continuous, smooth 360-degree rotation animation.

### 2. Signature Dishes Carousel
- **Prevented Arrow Overlap**: Moved the left and right navigation arrows completely outside the card track into dedicated flanking positions (`shrink-0` flex siblings), guaranteeing the left arrow never overlaps the first dish card.
- **Hidden Partial Cards at the Right Edge**: Set exact viewport-proportional card widths:
  - Desktop: `w-[calc((100%-48px)/3)]` (displays exactly 3 full cards)
  - Tablet: `w-[calc((100%-24px)/2)]` (displays exactly 2 full cards)
  - Mobile: `w-full` (displays exactly 1 full card)
  Combined with `overflow-hidden` on the viewport wrapper, the 4th card (and any remaining cards) are strictly clipped and hidden until scrolled.
- **Smooth Navigation & Swipe**: Clicking the arrow buttons smoothly advances or returns by one full card distance. Touch-swiping on mobile/tablet is preserved via CSS scroll-snap (`snap-x snap-mandatory`), with carousel pagination dots kept in sync.

### 3. Full Menu — Category Navigation
- **Left and Right Arrow Controls**: Added circular arrow buttons (`ChevronLeft` and `ChevronRight`) on either side of the category tabs row below the search bar in `FullMenuOrderPage.jsx`.
- **Smooth Category Scrolling**: Clicking the arrows smoothly scrolls through hidden categories (`scrollBy({ left: ±260, behavior: 'smooth' })`), with disabled/active state tracking when reaching scroll bounds.
- **Single Horizontal Row**: Category tabs are maintained strictly in one horizontal line (`whitespace-nowrap flex-nowrap overflow-x-auto no-scrollbar`) without wrapping or overlapping.
- **Preserved Selection & Touch**: Full category filtering, active tab highlighting, and mobile touch-scrolling remain fully functional.
