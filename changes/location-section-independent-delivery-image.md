# Location & Service Hours Section — Independent Delivery Image Update

## Overview
Updated the **Location & Service Hours Section** (`src/components/LocationHoursSection.jsx`) by removing the Google Map and placing `src/assets/images/delivery.png` on the right side as a clean, standalone, independent image without any card container or text overlay.

---

## Detailed Changes

### 1. Left Side: Unified Location & Hours Card
- Retained the single unified luxury card containing:
  - **Address**: `Kohat City Centre, near KDA Gate No. 1, Kohat, Khyber Pakhtunkhwa, Pakistan`.
  - **Phone Number**: `+92 332 7515538` (clickable `tel:` link).
  - **Service Hours**: Daily Operating Hours (11:00 AM – 11:00 PM) & Friday Prayer Break (1:00 PM – 2:30 PM).
  - **Button**: **"Get directions on Google Map"** linking to `https://maps.app.goo.gl/LeJogix9azNPMHiq7`.

### 2. Right Side: Standalone Delivery Image
- **Google Map Removed**: Removed the Google Map iframe and container.
- **Independent Image**: Displayed `src/assets/images/delivery.png` directly as a clean, independent image without card borders, background boxes, or text overlays.
- **Responsive Proportions**: Preserved original aspect ratio using `object-contain` and responsive sizing (`max-w-[380px] sm:max-w-[460px] lg:max-w-[480px] xl:max-w-[540px]`), centered vertically alongside the left card.

---

## Verification
1. **Compilation Check**: `compile_applet` passed with zero errors.
2. **Linting Check**: `lint_applet` passed cleanly.
3. **Dev Server**: Restarted dev server.
