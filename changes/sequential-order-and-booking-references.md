# Sequential Order & Booking Reference Numbers

## Summary
Replaced client-side `Math.random()` reference number generation (`PO-XXXXXX` and `PO-RES-XXXXXX`) with backend, database-backed sequential reference numbers:
- **Orders**: `ORD-000001`, `ORD-000002`, `ORD-000003`, ...
- **Bookings**: `BK-000001`, `BK-000002`, `BK-000003`, ...

Each entity maintains its own independent monotonic sequence persisted in SQLite (`node:sqlite`), guaranteeing uniqueness, permanence, and concurrency safety.

---

## Backend & Database Changes

### 1. Database Schema & Sequence Store (`server/db.ts`)
Initialized a persistent SQLite database (`data/pearl-oasis.db`, configurable via `PEARL_OASIS_DB_PATH`) with WAL mode (`PRAGMA journal_mode = WAL`) and a 5-second lock wait (`PRAGMA busy_timeout = 5000`):
- **`order_sequences` & `booking_sequences`**: Separate tables with `seq INTEGER PRIMARY KEY AUTOINCREMENT`. SQLite's `AUTOINCREMENT` stores a high-water mark in `sqlite_sequence`, ensuring sequence numbers increment strictly and are never reused even if orders or bookings are cancelled or deleted.
- **`orders`**: Stores order payload, customer contact/address, items JSON, totals, nullable `sequence_number INTEGER UNIQUE`, and `reference_number TEXT NOT NULL UNIQUE`.
- **`bookings`**: Stores booking date, time, party composition (`kids_count`, `male_count`, `female_count`), guest details, source (`book-a-table` / `reservation-modal`), nullable `sequence_number INTEGER UNIQUE`, and `reference_number TEXT NOT NULL UNIQUE`.
- **Atomic Allocation (`withImmediateTransaction`)**: Order and booking creation execute inside `BEGIN IMMEDIATE ... COMMIT` transactions that insert into the respective `AUTOINCREMENT` sequence table (`RETURNING seq`), format the `ORD-######` or `BK-######` string, and insert the persisted domain row atomically.
- **Legacy Record Compatibility**: Keeping `sequence_number` nullable allows pre-existing records (such as earlier `PO-XXXXXX` orders in `localStorage` or migrated `PO-*` / `PO-RES-*` records in the DB) to coexist untouched without altering or invalidating previously issued reference numbers.

### 2. Express Server Entry Point (`server.ts` & `package.json`)
- Added `server.ts` mounting Vite in middleware mode during development (`npm run dev` via `tsx server.ts`) and serving the compiled `dist/` bundle in production (`npm run start` via `node server.ts`), listening on port `3000`.
- Added REST endpoints:
  - `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:reference`, `PATCH /api/orders/:reference/cancel`, `DELETE /api/orders/:reference`
  - `POST /api/bookings`, `GET /api/bookings`, `GET /api/bookings/:reference`, `PATCH /api/bookings/:reference/cancel`, `DELETE /api/bookings/:reference`
  - `GET /api/health`

---

## Frontend Changes
- **`src/components/CheckoutPage.jsx`**: Removed `Math.random()` ID generation; `handlePlaceOrder` submits to `POST /api/orders`, disables duplicate submission clicks while assigning the reference, displays the returned `ORD-######` reference in both the Order Confirmation Modal and WhatsApp summary, and appends the saved order into `localStorage` (`pearl_oasis_orders`) without modifying older entries.
- **`src/components/BookTablePage.jsx`**: Removed `Math.random()` ID generation; `handleSendViaWhatsApp` submits to `POST /api/bookings`, guards against duplicate clicks, displays the returned `BK-######` reference on the confirmation receipt, and includes it in the WhatsApp message.
- **`src/components/ReservationModal.jsx`**: Wired form submission to `POST /api/bookings` (`source: 'reservation-modal'`) and displays the assigned `BK-######` reference inside the modal confirmation box.

---

## Testing & Verification
1. **Automated Suite (`server/reference-sequence.test.ts`)** executed via `node --test server/reference-sequence.test.ts`:
   - Verified sequential `ORD-000001` and `BK-000001` generation across independent order and booking streams.
   - Executed 20 simultaneous `POST /api/orders` and 20 simultaneous `POST /api/bookings` requests via `Promise.all`; confirmed all 40 references were strictly unique and contiguous (`ORD-000002..ORD-000021` and `BK-000002..BK-000021`).
   - Cancelled and deleted orders/bookings (`ORD-000021`, `ORD-000020`, `BK-000021`) and verified the next created items received `ORD-000022` and `BK-000022` without reusing deleted/cancelled numbers.
   - Inserted legacy `PO-849201` and `PO-RES-412093` records and confirmed lookup compatibility alongside sequential records.
   - Reopened the SQLite database across two concurrent store instances and verified persistent continuation (`ORD-000023..000024`, `BK-000023..000024`).
2. **Build & Lint Verification**: `compile_applet` (`vite build`) and `lint_applet` (`tsc --noEmit`) passed with zero errors, followed by live server startup and endpoint verification on `http://localhost:3000`.

---

## Limitations
- SQLite is single-node file storage (`data/pearl-oasis.db`). In a multi-instance horizontally scaled deployment without shared storage, migrating the same `AUTOINCREMENT`/sequence design to a shared network database (such as PostgreSQL `SEQUENCE`) would be required so all instances draw from one centralized sequence.
- Node.js `node:sqlite` (`v22.23.2`) emits an `ExperimentalWarning` on stderr when the server boots cleanly.
