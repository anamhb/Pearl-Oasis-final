# Pearl Oasis — Menu Section & Navbar Enhancements

## Overview
Implemented improvements to the Pearl Oasis landing page **Menu** section and top **Navbar** as requested:

---

### 1. Corrected Menu Items & Descriptions (`src/data/restaurantData.js` & `src/components/MenuSection.jsx`)
Updated the 4 featured cards in the staggered grid on the landing page:
- **Pakistani Cuisine Category**: Renamed category to **"PAKISTANI KARAHI"**.
  - **Dish Name**: Replaced with **"Mutton Karahi"**.
  - **Description**: *"Tender bone-in mutton slow-cooked to perfection in an authentic iron wok with ripe vine tomatoes, julienned ginger, and freshly cracked black pepper."*
  - **Pricing**: *"Half: Rs. 1,890 | Full: Rs. 3,790"*.
  - **Image**: High-resolution `dish_mutton_karahi_1793682586059.jpg`.
- **Chinese Cuisine Category**:
  - **Dish Name**: Replaced with **"Chicken Manchurian with Rice"**.
  - **Description**: *"Succulent crispy chicken bites simmered in a luscious sweet and zesty ginger-garlic sauce, served alongside fragrant wok-tossed egg fried rice."*
  - **Pricing**: *"Rs. 1,250"*.
  - **Image**: Authentic Chinese wok presentation `dish_chinese_kungpao_1793682601783.jpg`.
- **Fast Food Category**: Renamed category to **"Fast Food"**.
  - **Dish Name**: Replaced with **"Classic Chicken Burger"**.
  - **Description**: *"Tender seasoned grilled chicken patty nestled in a soft toasted sesame bun with crisp iceberg lettuce, ripe tomatoes, and rich creamy garlic mayo."*
  - **Pricing**: *"Rs. 600"*.
  - **Image**: Gourmet burger photography `dish_oasis_burger_1793682616523.jpg`.
- **Traditional BBQ Category**:
  - **Dish Name**: Replaced with **"Chicken Malai Boti"**.
  - **Description**: *"Melt-in-your-mouth boneless chicken cubes marinated in fresh heavy cream, mild aromatic spices, and green cardamoms, grilled gently over live charcoal."*
  - **Pricing**: *"Rs. 1,450"*.
  - **Image**: Skewered malai boti photography `malai-boti.jpg`.

---

### 2. Download Menu Button (`src/components/MenuSection.jsx`)
- Added an official **"Download Menu (PDF)"** action button alongside the existing **"View the Full Menu"** button.
- Asset Integration: Directly imported `src/assets/images/Pearl-Oasis-Menu.pdf` using Vite's static asset-handling approach.
- Triggers standard native browser download of the restaurant's complete 7-page official menu (`Pearl-Oasis-Menu.pdf`).
- Preserved the existing **"View the Full Menu"** button and its routing to the interactive online ordering portal.
- Responsive flex layout with gold-accented styling matching Pearl Oasis's **Emerald Elegance** identity.

---

### 3. Cart Button in Navbar (`src/components/Navbar.jsx` & `src/App.jsx`)
- Added a dedicated **Cart** button to the top Navbar on desktop and mobile.
- **Design & Identity**: Styled with antique gold border (`#C9A45C`), emerald background, and a gold item-counter badge when dishes are in the cart.
- **Behavior**:
  - Clicking **Cart** opens the existing slide-out `OrderTrayDrawer` (or navigates to the order overview).
  - Displays the live item count badge (`trayCount`) and total price calculation (`cartTotal`).
  - Preserves all selected dishes, size variations, cooking instructions, and totals across pages.
- **Responsive & Accessible**:
  - Visible on desktop alongside "Order Now".
  - Visible in mobile header bar and inside the slide-down mobile navigation menu.
  - Proper ARIA labels and focus states.

---

### 4. Verification
- TypeScript / Lint check passed with zero errors (`tsc --noEmit`).
- Dev server verified and running on port 3000.
