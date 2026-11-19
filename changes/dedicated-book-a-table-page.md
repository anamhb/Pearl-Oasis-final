# Dedicated "Book a Table" Experience Documentation

## Overview
A complete, modern, user-friendly **Book a Table** feature has been implemented for Pearl Oasis (Kohat, Pakistan). The feature provides a dedicated restaurant reservation page at `/book-a-table` with a guided 5-step multistep booking flow seamlessly integrated into the restaurant's dark luxury burgundy, gold, and ivory branding.

---

## 1. Components and Files Created & Modified

### New Files Created
- **`src/components/BookTablePage.jsx`**:
  Dedicated 5-step table reservation page component with compact card sizing, external progress stepper, direct guest composition selector (Kids, Male, Female with automatic total calculation), quick date cards (Today, Tomorrow, Choose Another Date with calendar popup), automatic time selection popup modal (12:00 PM – 10:00 PM with Friday break and past-time validation), streamlined guest details form, structured review & submit layout, and WhatsApp click-to-chat integration.
- **`changes/dedicated-book-a-table-page.md`**:
  Comprehensive architectural and user-flow documentation.

### Existing Files Modified
- **`src/App.jsx`**:
  - Registered `book-a-table` view in navigation state.
  - Implemented URL-aware routing (`/book-a-table`) with full browser refresh and popstate (back/forward) support.
  - Rendered `Navbar`, `BookTablePage`, and `Footer` in the dedicated booking route.
  - Connected all "Book A Table" triggers across Hero, ExperienceSection, Navbar, and Footer.
- **`src/components/Navbar.jsx`**:
  - Added dedicated "Book A Table" navigation item in desktop nav links.
  - Added "Book A Table" action button in mobile drawer.
- **`src/components/Hero.jsx`**:
  - Wired secondary CTA button directly to navigate to `/book-a-table`.
- **`src/components/ExperienceSection.jsx`**:
  - Wired "An Unforgettable Dining Experience" CTA button directly to navigate to `/book-a-table`.
- **`src/components/Footer.jsx`**:
  - Added "Book A Table" link in the footer navigation column.
- **`.env.example`**:
  - Documented `VITE_WHATSAPP_NUMBER` configuration variable (`+923327515538`).

---

## 2. Dedicated Booking Page Route (`/book-a-table`)
- **Direct Access**: Accessible at `/book-a-table` or through any of the "Book A Table" buttons.
- **Direct Refresh**: Reloading the page or entering the URL directly in the browser correctly initializes and displays the booking experience.
- **Consistency**: Retains the luxury header navbar and footer, keeping the navigation flow and brand context intact.

---

## 3. The Five-Step Booking Flow

```
Step 1: People ──> Step 2: Date (auto Time popup) ──> Step 3: Time ──> Step 4: Details ──> Step 5: Submit
```

1. **Step 1 – People (Guest Composition)**:
   - Displays `TOTAL GUESTS` automatically summed from `KIDS`, `MALE`, and `FEMALE` counters.
   - Users adjust counts directly with `-` and `+` buttons (up to 30 total guests, minimum 1 guest required).
2. **Step 2 – Date & Automatic Time Popup**:
   - Presents three quick cards: **TODAY**, **TOMORROW**, and **CHOOSE ANOTHER DATE** (opens a calendar popup with past dates disabled).
   - Selecting any date immediately opens the **Time Selection Popup Modal** so guests can pick a time without an extra click.
3. **Step 3 – Time**:
   - Slots cover **12:00 PM – 10:00 PM** across Lunch & Afternoon (`12:00 PM – 4:30 PM`) and Dinner & Evening (`5:00 PM – 10:00 PM`).
   - If booking for today, slots earlier than current time + 30 minutes are disabled.
   - On Fridays, slots between 1:00 PM and 2:30 PM are disabled for Friday prayer break.
4. **Step 4 – Details**:
   - Full Name (required, min 2 chars).
   - Phone / WhatsApp Number (required, validates local/international format).
   - Special Requests (optional notes).
5. **Step 5 – Review & Submit**:
   - Structured summary with **YOUR PARTY**, **RESERVATION**, and **GUEST DETAILS** sections with direct `EDIT` links back to each step.
   - Clear policy disclosure indicating the submission is a booking request pending restaurant confirmation.
   - Primary CTA **"Confirm Table Request"** dispatches via WhatsApp and shows a reference receipt.

---

## 4. Guest Composition Logic
- **Direct Adjustment**:
  Guests increment or decrement `Kids`, `Male`, and `Female` directly in Step 1.
- **Validation Rules**:
  - `totalGuests = kids + male + female` (1 to 30 guests).
  - Minus (-) button disabled at 0; Plus (+) button disabled at 30 total guests.
  - Continue button disabled if `totalGuests < 1`.

---

## 5. WhatsApp Integration & Configuration
- Uses `import.meta.env.VITE_WHATSAPP_NUMBER` with automatic fallback to `RESTAURANT_INFO.whatsapp` (`+923327515538`).
- Formats message into clean, readable text:
  ```text
  Hello! I would like to request a table reservation.

  Booking Details (Ref: PO-RES-123456):
  - Guests: 6
  - Kids: 2
  - Male: 2
  - Female: 2
  - Date: Friday, 14 November 2026
  - Time: 8:00 PM (Dinner)

  Customer Details:
  - Name: Asad Khattak
  - Phone: +92 332 7515538

  Special Requests:
  High chairs for kids please.

  Thank you!
  ```
- URL-encoded and dispatched via `https://wa.me/{number}?text=...` supporting desktop and mobile.

---

## 6. Backend Availability Limitations
- In the absence of a live table-management database, the frontend date/time picker enforces operating hours, prayer breaks, and advance-booking limits.
- The interface transparently informs guests that their submission is a **booking request** that will be confirmed by Pearl Oasis staff via WhatsApp or call.

---

## 7. Responsive & Visual Verification
- Tested across mobile, tablet, and desktop viewports.
- External stepper timeline sits cleanly above the compact booking card.
- Calendar and time selection modals center smoothly on all screen sizes.
- Passed `tsc --noEmit`, lint, and Vite build with zero warnings or errors.
