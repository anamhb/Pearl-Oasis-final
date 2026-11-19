# Pearl Oasis Location & Service Hours Section Update

## Overview
Updated the **Location & Service Hours Section** (`src/components/LocationHoursSection.jsx`) to feature a single unified luxury card on the left for Address, Phone, and Service Hours, alongside an interactive Google Map embed on the right for Pearl Oasis in Kohat.

---

## Detailed Changes

### 1. Left Side: Single Unified Information Card
- **Combined Card**: Merged the previous separate Service Hours and Address cards into a single luxury container (`bg-[#18080B]/95`, `border border-[#C9A45C]/35`).
- **Ordered Information Structure**:
  1. **Address**: `Kohat City Centre, near KDA Gate No. 1, Kohat, Khyber Pakhtunkhwa, Pakistan`.
  2. **Phone Number**: `+92 332 7515538` with clickable `tel:` link.
  3. **Service Hours**:
     - Daily Operating Hours: `11:00 AM – 11:00 PM`.
     - Friday Prayer Break: `1:00 PM – 2:30 PM`.
     - **Removed Line**: Removed `"Last kitchen orders accepted 30 minutes before closing."` per instructions.
  4. **Button**:
     - Labeled **"Get directions on Google Map"**.
     - Links directly to `https://maps.app.goo.gl/LeJogix9azNPMHiq7` in a new tab.

### 2. Right Side: Interactive Google Map
- **Removed Booking Form**: Removed the reservation form from the right side of the location section.
- **Embedded Google Map**: Embedded an interactive Google Map centered on Pearl Oasis in Kohat (`https://maps.google.com/maps?q=Pearl%20Oasis%20Kohat%20Khyber%20Pakhtunkhwa&t=&z=16&ie=UTF8&iwloc=&output=embed`).
- **Floating "Open in Maps" Overlay**:
  - Positioned an overlay button at the top-left corner of the map container matching the attached reference design.
  - Labeled **"Open in Maps"** with external link icon, pointing directly to `https://maps.app.goo.gl/LeJogix9azNPMHiq7`.

---

## Verification
1. **Compilation Check**: `compile_applet` passed cleanly.
2. **Linting Check**: `lint_applet` passed with zero errors.
3. **Dev Server**: Restarted dev server.
