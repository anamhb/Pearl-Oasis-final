# Location & Service Hours — Unified Mobile/Tablet Overlay Over Video & Concise Intro Paragraph

## Summary
Resolved the mobile/tablet layout mismatch and reduced the intro paragraph size in `src/components/LocationHoursSection.jsx`:

1. **Unified Full-Screen Video Background & On-Video Scroll Reveal Across Mobile, Tablet, and Desktop**
   - Removed the previous `< lg` vertical split where the video sat above the text container on mobile and tablet.
   - The video layer now fills the entire pinned viewport (`absolute inset-0 z-0 w-full h-full object-cover object-center`) on **all devices**, scrubbing smoothly on scroll while the progressive 4-step content reveals directly **on top of the video**:
     - **Tablet (`md:`+, `768px+`) & Desktop:** Uses the identical left/right bilateral split (`Address` + `Phone Number` on the left; `Service Hours · Open Daily` + `Get directions on Google Map` on the right) with feathered left/right contrast scrims framing the centered location pin.
     - **Mobile (`< md`, `< 768px`):** Anchors `Address` + `Phone Number` over the upper portion of the full-screen video and `Service Hours · Open Daily` + the compact `Get directions on Google Map` button over the lower portion, paired with subtle top/bottom feathered scrims that fade in on reveal while keeping the center pin and ripples open between them.

2. **Smaller, Shorter Header Paragraph Across All Devices**
   - Reduced both font size (`text-xs sm:text-[13px]`, `max-w-md`) and copy length (`"Visit us near KDA Gate No. 1, Kohat — open daily for authentic dining."`) directly beneath the **Location & Service Hours** heading for a cleaner, more balanced header proportion across mobile, tablet, and desktop.

## Verification
- Verified TypeScript lint (`npm run lint`), production build (`npm run build`), unit tests (`src/utils/scrollVideoSync.test.mjs`), and live server health on port `3000`.
