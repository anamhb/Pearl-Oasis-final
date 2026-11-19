# Pearl Oasis — Landing Page Improvements

## Summary of Changes

### 1. Navbar Improvements
- **3D Rotating Logo**: Integrated `PO-logo.glb` via a high-performance Three.js `Logo3D` component that continuously and smoothly rotates 360 degrees. Configured with ambient, directional, and point studio lighting to highlight gold metallic details. Handled lifecycle cleanup, memory disposal, and graceful fallback.
- **Brand Text Logo**: Replaced the static text and emblem with `src/assets/images/logo-text.png` paired side-by-side with the 3D rotating logo, with balanced height and alignment.
- **Navigation Links**: Removed the **Testimonials** link from the navigation bar while preserving Home, Our Story, Menu, Signature Dishes, Contact, and the interactive Cart and Order Now buttons.

### 2. Hero Section Background Video
- Replaced the hero section's static background image with the Cloudinary video:
  `https://res.cloudinary.com/z8nlnc6b/video/upload/v1793960187/Pearl-Oasis_resturant.mp4`
- Implemented with `autoPlay`, `loop`, `muted`, `playsInline`, `object-fit: cover`, and poster fallback image (`hero_emerald_entrance_1793870275326.jpg`).
- Preserved dark emerald gradient overlays, ensuring high contrast and legibility for all hero text, titles, flourishes, and CTA buttons.

### 3. Our Story Image Frame Redesign
- Redesigned the Our Story right column presentation from a circular portal into a **large, elegant arch-shaped oval frame** extending slightly beyond and cropped by the right canvas edge.
- Crafted double gold borders: an outer thicker metallic gold border (`border-[3px] border-[#C9A45C]`) with a soft gold glow, a spaced gap, and an inner thinner gold line (`border border-[#E8CC8B]/80`).
- Applied deep emerald background and subtle vignette overlays over the dining hall photograph.
- Completely removed the `EST. KOHAT` badge.

### 4. Signature Dishes — Expanded to Six Cards
- Expanded the culinary highlights cards from 4 to 6 dishes:
  1. **Chicken Fried Rice** — Chinese Speciality (wok-fried jasmine rice with scrambled egg, chicken & scallions)
  2. **Chicken Chow Mein** — Wok Classic (stir-fried noodles with chicken, vegetables & dark soy)
  3. **Alfredo Pasta** — Chef's Creation (creamy garlic parmesan fettuccine with grilled chicken)
  4. **Chicken Malai Boti** — Charcoal BBQ (cream & cardamom marinated chicken grilled over embers)
  5. **Lebanese Wrap** — Artisan Fast Food (toasted pita wrap with spiced chicken, pickles & garlic toum)
  6. **Chicken Corn Soup** — House Specialty Soup (velvety chicken broth with sweetcorn & egg ribbons)
- Formatted as a balanced 3-column desktop, 2-column tablet, and 1-column mobile grid with functioning carousel navigation chevrons and quick "Add to Tray" controls.

### 5. Menu Section — Mutton Karahi Price Layout
- Updated the card header layout to prevent any clipping or awkward wrapping of dual variation pricing ("Half: Rs. 1,890 | Full: Rs. 3,790").
- Dual-tier prices are rendered in a dedicated, pill-bordered gold badge with normal whitespace wrapping, guaranteeing crystal-clear legibility across all viewport widths.

### 6. Location & Service Hours Update
- Updated daily operating schedule to:
  - **Daily Operating Hours**: `11:00 AM – 11:00 PM`
  - **Friday Prayer Break**: `1:00 PM – 2:30 PM`
- Removed previous separate Lunch Service, Dinner, and Family Feasts timings from `LocationHoursSection.jsx`, `restaurantData.js`, and `Footer.jsx`.

### 7. Address & Directions — Contact Details
- Set contact telephone to display **only** `+92 332 7515538`, removing all previous phone numbers.
- Updated the Google Maps direction button to link directly to `https://maps.app.goo.gl/nFe7yNkap5ks5xBc8`.
