# Our Story Circular Orbit Image Refinements

## Summary
Refined the circular orbit image presentation in the **Our Story** section based on the reference layout (`image.png`).

## Changes Implemented

1. **Increased Central Image Size**:
   - Expanded the central restaurant image container to ~78% of the orbit frame (`w-[77.5%] h-[77.5%]`), matching the proportions of the reference image.

2. **Reduced Gap Between Text and Image**:
   - Positioned the SVG circular text path tightly around the central image border at radius `170px`, eliminating excessive empty space.

3. **High-Visibility Rotating Text with Airy Separator Spacing**:
   - Enhanced text legibility using crisp `#E8CC8B` gold color, `fontWeight="700"`, letter spacing, and a text shadow filter for contrast against the dark canvas.
   - Applied generous, airy spacing around the dot separators (`\u00A0\u00A0\u00A0·\u00A0\u00A0\u00A0` with `xmlSpace="preserve"`) matching the exact text spacing style in the reference image.

4. **Outer Boundary Outline Above Text**:
   - Moved the dashed outline ring to radius `192px`, placing it OUTSIDE/ABOVE the rotating text and encircling the entire composition, with 4 cardinal gold accent dots (`#E8CC8B`).
