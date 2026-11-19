# Our Story (Second Section) Update: Left Image, Malai Boti Plate & Right Text

## Overview
Updated the second section (`OurStory.jsx` / `#our-story`) with the requested layout swap, reduced image width, and overlapping dish plate composition matching `image_77e6b3ec.png`:

1. **Section Image Shifted to Left**:
   - The restaurant entrance image (`Pearl Oasis Restaurant Entrance.png`) has been shifted to the left column (`lg:col-span-5`).
   - Image width has been refined and slightly reduced (`max-w-[420px] sm:max-w-[450px]`) for clean proportions.
   - Preserves the smooth organic asymmetric curved border (`rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-2xl rounded-bl-2xl`), gold perimeter border, and ambient burgundy glow.

2. **Malai Boti Dish Placed at Bottom-Right Corner**:
   - Added `src/assets/images/Malai_Boti.png` positioned at the bottom-right corner of the section image (`absolute -bottom-8 -right-6 sm:-bottom-10 sm:-right-8 md:-bottom-12 md:-right-10 z-20`).
   - Framed with realistic multi-layer depth shadows (`drop-shadow-[0_16px_30px_rgba(0,0,0,0.95)] drop-shadow-[0_0_20px_rgba(186,37,53,0.35)]`), matching the visual treatment shown in the reference image.

3. **Text Shifted to Right**:
   - Eyebrow ("OUR STORY"), Heading ("About Pearl Oasis"), and the narrative paragraphs are positioned on the right column (`lg:col-span-7 lg:pl-4`).
   - No buttons are included in this section.
