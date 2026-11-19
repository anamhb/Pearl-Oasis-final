# Pearl Oasis Orders & Table Bookings API Skill

> Machine-readable guide to the live Pearl Oasis Restaurant Express HTTP API for food ordering (delivery and pickup) and dining table reservations in Kohat, Pakistan.

## OpenAPI Specification

- Full OpenAPI 3.1.0 schema: [https://pearl-oasis.ai.studio/openapi.json](https://pearl-oasis.ai.studio/openapi.json)
- Base URL: `https://pearl-oasis.ai.studio`
- Content-Type: `application/json`

## Endpoints

### Health Check
- `GET /api/health` — Returns `{ "ok": true }` when the server is reachable.

### Food Orders (`/api/orders`)
- `GET /api/orders` — List existing orders stored by the server.
- `GET /api/orders/{reference}` — Look up a single order by reference ID.
- `POST /api/orders` — Create a delivery or pickup food order.
  - Required fields: `fulfillmentType` (`"delivery"` or `"pickup"`), `customer.name`, `customer.phone` (minimum 8 characters), `items` (non-empty array).
  - Additional required fields when `fulfillmentType` is `"delivery"`: `customer.address.street` and `customer.address.city`.
- `PATCH /api/orders/{reference}/cancel` — Cancel an existing order by reference ID.
- `DELETE /api/orders/{reference}` — Remove an order record by reference ID.

### Table Reservations (`/api/bookings`)
- `GET /api/bookings` — List existing table reservations.
- `GET /api/bookings/{reference}` — Look up a reservation by reference ID.
- `POST /api/bookings` — Create a dining table reservation.
  - Required fields: `customer.name`, `customer.phone` (minimum 7 characters), `totalGuests` (integer >= 1).
  - Optional fields: `bookingDate`, `displayTime`, `composition` (`kids`, `male`, `female`), `hallPreference`, `customer.specialRequests`, `source`.
- `PATCH /api/bookings/{reference}/cancel` — Cancel an existing table booking by reference ID.
- `DELETE /api/bookings/{reference}` — Remove a table booking record by reference ID.

## Web Ordering & Booking Pages

- Interactive Full Menu & Online Ordering: [https://pearl-oasis.ai.studio/order-menu](https://pearl-oasis.ai.studio/order-menu)
- Interactive Table Reservation Form: [https://pearl-oasis.ai.studio/book-a-table](https://pearl-oasis.ai.studio/book-a-table)
