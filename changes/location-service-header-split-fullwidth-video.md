# Location & Service Hours — External Header, Full-Bleed Edge-to-Edge Video & Split Left/Right Reveal

## Overview
Refined the **Location & Service Hours** section (`#contact`) to resolve three layout and content issues: placing the main heading and intro paragraph outside and above the video, eliminating black sidebars so the video fills the full width edge-to-edge, and splitting the scroll-revealed overlay content cleanly across the left and right sides of the video while removing the redundant `"Visit & Contact Us · Pearl Oasis, Kohat City Centre"` line.

## Key Changes

### 1. Section Heading & Intro Paragraph Above the Video
- **File:** `src/components/LocationHoursSection.jsx`
- Moved the centered **VISIT PEARL OASIS** eyebrow, gold accent rule, and **Location & Service Hours** main `<h2>` heading outside and above the scroll-controlled video runway, accompanied by a concise intro paragraph describing Pearl Oasis's location near KDA Gate No. 1 and daily dining hospitality.
- Attached `runwayRef` directly to the sticky video scroll runway beneath the header band so `progress = 0` aligns cleanly with the moment the video pins to the viewport while `#contact` anchor links land at the top of the section header.

### 2. Full-Width Edge-to-Edge Video Coverage (No Black Sidebars)
- **File:** `src/components/LocationHoursSection.jsx`
- Switched the `<video>` fit from `object-contain` to `object-cover object-center` inside the full-bleed `w-full` stage (`aspect-video` on mobile/tablet and `lg:absolute lg:inset-0 lg:h-full` on desktop).
- Eliminated the black left and right pillarbox bars on wide desktop viewports while keeping the centered metallic pin, glowing ripples, and animated map route intact.

### 3. Split Left & Right On-Video Content & Copy Cleanup
- **Files:** `src/utils/scrollVideoSync.js`, `src/components/LocationHoursSection.jsx`
- Removed `"Visit & Contact Us · Pearl Oasis, Kohat City Centre"` completely.
- Divided the cardless on-video information cleanly across two balanced sides framing the centered location pin, paired with independent bilateral feathered contrast scrims on desktop (left scrim fades in at Step 1; right scrim fades in at Step 3; center stays luminous):
  - **Left Side:**
    1. **Step 1 (`10%` scroll):** `Address` (`Kohat City Centre, near KDA Gate No. 1, Kohat, Pakistan`)
    2. **Step 2 (`30%` scroll):** `Phone Number` (`+92 332 7515538` clickable `tel:` link)
  - **Right Side:**
    3. **Step 3 (`52%` scroll):** `Service Hours` paired with `Open Daily`, showing Daily Operating Hours (`11:00 AM – 11:00 PM`) and Friday Prayer Break (`1:00 PM – 2:30 PM`)
    4. **Step 4 (`74%` scroll):** `Get directions on Google Map` button positioned at the end below Service Hours
- Preserved responsive stacking below the full-width video on mobile (`1` column) and tablet (`2` columns side-by-side) and static full visibility under `prefers-reduced-motion: reduce`.

## Verification
- Updated `src/utils/scrollVideoSync.test.mjs` to assert the 4 ordered split-side milestones (`left:address`, `left:phone`, `right:hours`, `right:directions`) and latched persistence (`6/6` passing via `node --test`).
- Verified TypeScript lint (`npm run lint`), production build (`npm run build`), and live server response on port `3000`.
