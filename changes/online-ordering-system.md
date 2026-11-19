# Pearl Oasis — Complete Interactive Online Food-Ordering System

## Overview
Upgraded the Pearl Oasis restaurant web application from a static menu display into a complete, interactive, end-to-end online food-ordering system inspired by the Qissa online ordering and checkout UX, while preserving Pearl Oasis's signature **Emerald Elegance** aesthetic (`#062E25`, `#031D18`, `#C9A45C`, `#E8CC8B`, `#F8F3E8`).

---

## 1. Full Menu Page (`src/components/FullMenuOrderPage.jsx`)
- **Navigation**:
  - Clicking **"View the Full Menu"** in the landing page's Menu section or clicking **"Order Now"** in the top navigation bar routes seamlessly to the dedicated ordering portal.
  - Quick **"← Back"** button allows guests to return to the restaurant landing page at any moment.
- **Menu Source of Truth (`src/data/pearlOasisFullMenu.js`)**:
  - Exactly transcribed from `pearl_oasis_restaurant_menu.txt` with 100% price and category fidelity.
  - Encompasses all **13 categories**:
    1. Soups (Serves 2 Persons)
    2. Chinese Cuisine
    3. Oasis Rice
    4. Pakistani Karahi (Half / Full)
    5. Traditional Handi (Half / Full)
    6. Traditional BBQ
    7. BBQ Platters (Oasis BBQ Platter 2 Persons, Shahi Platter 3-4 Persons, Shah Jahan Platter 5-6 Persons)
    8. Traditional Tandoor
    9. Fast Food - Appetizers
    10. Burgers
    11. Steaks (Chicken / Beef)
    12. Pasta & Wraps
    13. Chef Special Pizza Section (Small / Med / Large / Family)
- **Dish Cards**:
  - Two-column responsive card layout featuring dish title, portion, authentic price / price range, and a circular `+` button matching the Qissa design pattern.
- **Category Navigation & Search**:
  - Horizontal scrolling category filter tabs for all 13 sections with instant smooth scroll/filtering.
  - Real-time search filter matching dish names, descriptions, and portions with clear-button capability.
  - Date and time fulfillment indicator (Today · ASAP 35–45 mins).

---

## 2. Dish Customisation Dialog (`src/components/DishCustomizationModal.jsx`)
- Modal dialog inspired by the Qissa offer interface:
  - Dish image preview (when available) with dark vignette and portion tags.
  - Dish title, category, and descriptive notes.
  - **Dynamic Variation Selector**:
    - Half / Full for Karahis and Handis.
    - Chicken / Beef for Steaks.
    - Small / Medium / Large / Family for Pizzas.
    - Half kg / 1 kg for Boneless Fish.
  - **Special Notes Field**: Textarea for kitchen instructions, spice adjustments, and allergies.
  - **Quantity Controls**: `−` and `+` steppers with live quantity state.
  - **Calculated Total CTA**: Dynamic "Add to Your Order • Rs. X,XXX" button that automatically recalculates as options and quantities change.

---

## 3. "Your Order" Sticky Panel (`src/components/FullMenuOrderPage.jsx`)
- **Desktop Sidebar**:
  - Positioned on the right side with sticky viewport positioning (`lg:col-span-4 sticky top-36`).
  - Displays selected dishes, size variations, special notes, line totals, and overall order total.
  - In-line quantity adjustment (`−` / `+`) and item removal (`Trash`).
  - **"Proceed →"** button that navigates directly to Checkout.
- **Mobile Experience**:
  - Floating sticky bottom bar showing item count and total (`X items • Rs. Y,YYY`) with a **"View Items"** button and direct **"Proceed"** CTA.
  - Opens a clean slide-up order drawer for mobile users without cluttering the screen.

---

## 4. Dedicated Checkout Page (`src/components/CheckoutPage.jsx`)
- Inspired by Qissa checkout screenshots:
  - Header with `←` back button to menu, "Your order" title, and Pearl Oasis Kohat subtitle.
  - **Fulfillment Method Toggle**:
    - **Pickup**: Displays restaurant address (`Kohat City Centre, near KDA Gate No. 1, Kohat, Pakistan`), free fulfillment fee.
    - **Delivery**: Automatically enables the "Your Address" card and applies standard Kohat delivery fee (Rs. 150).
  - **Fulfillment Time**:
    - Date selector (Today, Tomorrow, Saturday).
    - Time slot selector (ASAP 30–45 mins, 19:30–20:00, 20:00–20:30, etc.).
  - **Customer Information**:
    - Name (required, with error validation).
    - Phone Number (required, with format checks).
    - Special Note (optional).
  - **Delivery Address Form** (when Delivery is selected):
    - **`[⌖ Use Current Location] ⓘ`**: GPS browser geolocation integration with coordinate detection and status feedback.
    - Street Address * (required).
    - Floor (optional).
    - Name on Doorbell (optional).
    - Zip / Postal Code * (required, prefilled with 26000 for Kohat).
    - Town / City * (required, default Kohat).
  - **"Your items" Summary Column**:
    - Complete order overview with direct quantity adjustments.
    - Itemized breakdown, subtotal, delivery fee, and grand total.
    - **"Place an Order • Rs. X,XXX"** CTA button.
  - **Order Confirmation & Dispatch**:
    - Generates authentic Order ID (`PO-XXXXXX`).
    - Saves order to `localStorage` order history.
    - Detailed receipt with order details, itemization, and fulfillment schedule.
    - Direct **"Send Order Confirmation via WhatsApp"** button pre-filling the complete order receipt to Pearl Oasis's WhatsApp (`+923001234567`).
    - Print receipt and return to website buttons.

---

## 5. Architectural & State Preservation
- `orderItems` cart state is preserved seamlessly across all view transitions (`landing` ↔ `order-menu` ↔ `checkout`) and persisted in `localStorage`.
- All unrelated sections of Pearl Oasis (Hero, Our Story, Signature Dishes, Restaurant Experience, Testimonials, Location & Hours, Reservation Modal, Footer) remain completely intact and visually coherent.
