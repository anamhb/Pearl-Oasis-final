# Location & Service Hours — New Video URL, Uniform Time Typography & Compact CTA Button

## Summary
Applied three targeted updates to the **Location & Service Hours** section (`#contact`):

1. **Updated Video Asset (`Location_map.mp4`)**
   - Replaced the background video URL with `https://res.cloudinary.com/z8nlnc6b/video/upload/v1794936603/Location_map.mp4` (`2560×1440`, `24 fps`, `9.92s`).
   - Verified frame `0.0s` starts cleanly on the sunlit establishing map view (no storyboard frames), updating `LOCATION_VIDEO_START_TIME` to `0` and the poster to `so_0.0,w_1920,f_jpg,q_auto`.
   - Configured the scrubbing stream with `c_limit,w_1920,ki_0.1,ac_none,q_auto` (`100` I-frames vs. `1` in the raw file, `~4.0 MB` vs. `12.9 MB` raw) with automatic fallback to the raw Cloudinary URL.

2. **Uniform Numeral & AM/PM Typography in Service Hours**
   - Switched the `Daily Operating Hours` (`11:00 AM – 11:00 PM`) and `Friday Prayer Break` (`1:00 PM – 2:30 PM`) values from Cormorant Garamond (`font-serif-heading`, which renders shorter old-style numerals relative to uppercase `AM`/`PM`) to Montserrat (`font-sans tabular-nums`) so digits and `AM`/`PM` render at identical optical height and scale.

3. **More Compact Directions Button**
   - Reduced the width and visual bulk of the `Get directions on Google Map` button by removing the secondary trailing arrow icon, tightening horizontal padding (`px-4 py-2`), reducing icon gap (`gap-1.5`), and tightening typography/tracking (`text-[11px] tracking-[0.06em]`) while keeping a comfortable `40px` hit target.

## Verification
- Passed all `6/6` unit tests in `src/utils/scrollVideoSync.test.mjs`.
- Verified `tsc --noEmit`, `vite build`, HTTP `200` availability of the new `Location_map.mp4` streams/poster, and live server response on port `3000`.
