import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { AddressInfo } from 'node:net';
import { createDatabaseStore } from './db.ts';
import { createApiApp } from '../server.ts';

function makeTempDbPath() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pearl-oasis-seq-test-'));
  return { dir, dbPath: path.join(dir, 'test.db') };
}

function makeOrderPayload(index: number) {
  const fulfillmentType: 'pickup' | 'delivery' = index % 2 === 0 ? 'pickup' : 'delivery';
  return {
    fulfillmentType,
    displayDate: 'Today (Mon, 16 Nov)',
    displayTime: 'ASAP (30–45 mins)',
    customer: {
      name: `Guest ${index}`,
      phone: `0300000${String(index).padStart(4, '0')}`,
      notes: '',
      ...(index % 2 !== 0
        ? {
            address: {
              street: `House ${index}, KDA Sector`,
              postalCode: '26000',
              city: 'Kohat',
            },
          }
        : {}),
    },
    items: [
      {
        dishId: 'karahi-chicken',
        name: 'Chicken Karahi',
        unitPrice: 1190,
        quantity: 1,
        totalPrice: 1190,
      },
    ],
    subtotal: 1190,
    deliveryFee: index % 2 !== 0 ? 150 : 0,
    grandTotal: index % 2 !== 0 ? 1340 : 1190,
  };
}

function makeBookingPayload(index: number) {
  return {
    bookingDate: 'Tuesday, 17 November 2026',
    displayTime: '7:00 PM (Dinner)',
    totalGuests: 4,
    composition: { kids: 1, male: 2, female: 1 },
    customer: {
      name: `Table Guest ${index}`,
      phone: `0333000${String(index).padStart(4, '0')}`,
      specialRequests: '',
    },
    source: 'book-a-table',
  };
}

test('sequential order and booking generation, concurrency, deletion invariance, persistence, and legacy compatibility', async () => {
  const { dir, dbPath } = makeTempDbPath();
  let store = createDatabaseStore(dbPath);
  const app = createApiApp(store);

  const server = await new Promise<ReturnType<typeof app.listen>>((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const port = (server.address() as AddressInfo).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Sequential basic checks via HTTP API
    const o1Res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(makeOrderPayload(1)),
    });
    assert.equal(o1Res.status, 201);
    const o1 = (await o1Res.json()).order;
    assert.equal(o1.orderId, 'ORD-000001');
    assert.equal(o1.referenceNumber, 'ORD-000001');

    const b1Res = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(makeBookingPayload(1)),
    });
    assert.equal(b1Res.status, 201);
    const b1 = (await b1Res.json()).booking;
    assert.equal(b1.referenceNumber, 'BK-000001');

    // 2. Simultaneous / concurrent creation (20 orders & 20 bookings concurrently)
    const concurrentOrders = await Promise.all(
      Array.from({ length: 20 }, (_, idx) =>
        fetch(`${baseUrl}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(makeOrderPayload(idx + 2)),
        }).then(async (r) => {
          assert.equal(r.status, 201);
          return (await r.json()).order.referenceNumber as string;
        })
      )
    );

    const concurrentBookings = await Promise.all(
      Array.from({ length: 20 }, (_, idx) =>
        fetch(`${baseUrl}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(makeBookingPayload(idx + 2)),
        }).then(async (r) => {
          assert.equal(r.status, 201);
          return (await r.json()).booking.referenceNumber as string;
        })
      )
    );

    assert.equal(new Set(concurrentOrders).size, 20);
    assert.equal(new Set(concurrentBookings).size, 20);
    assert.deepEqual(
      [...concurrentOrders].sort(),
      Array.from({ length: 20 }, (_, i) => `ORD-${String(i + 2).padStart(6, '0')}`)
    );
    assert.deepEqual(
      [...concurrentBookings].sort(),
      Array.from({ length: 20 }, (_, i) => `BK-${String(i + 2).padStart(6, '0')}`)
    );

    // 3. Deletion & Cancellation must NEVER reuse old reference numbers
    const cancelOrderRes = await fetch(`${baseUrl}/api/orders/ORD-000021/cancel`, { method: 'PATCH' });
    assert.equal(cancelOrderRes.status, 200);
    const delOrderRes = await fetch(`${baseUrl}/api/orders/ORD-000020`, { method: 'DELETE' });
    assert.equal(delOrderRes.status, 200);

    const delBookingRes = await fetch(`${baseUrl}/api/bookings/BK-000021`, { method: 'DELETE' });
    assert.equal(delBookingRes.status, 200);

    const nextOrder = (
      await (
        await fetch(`${baseUrl}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(makeOrderPayload(99)),
        })
      ).json()
    ).order;
    assert.equal(nextOrder.referenceNumber, 'ORD-000022');

    const nextBooking = (
      await (
        await fetch(`${baseUrl}/api/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(makeBookingPayload(99)),
        })
      ).json()
    ).booking;
    assert.equal(nextBooking.referenceNumber, 'BK-000022');

    // 4. Existing / legacy record compatibility (does not alter legacy IDs or perturb sequences)
    store.insertLegacyOrderForCompat({
      referenceNumber: 'PO-849201',
      fulfillmentType: 'pickup',
      displayDate: 'Thu, 05 Nov',
      displayTime: '20:00',
      customerName: 'Legacy Order Customer',
      customerPhone: '03001112233',
      items: [{ name: 'Chicken Karahi', unitPrice: 1190, quantity: 1, totalPrice: 1190 }],
      subtotal: 1190,
      grandTotal: 1190,
    });
    store.insertLegacyBookingForCompat({
      referenceNumber: 'PO-RES-412093',
      bookingDate: 'Thursday, 5 November 2026',
      displayTime: '8:00 PM (Dinner)',
      totalGuests: 6,
      customerName: 'Legacy Booking Customer',
      customerPhone: '03004445566',
    });

    const fetchedLegacyOrder = await (await fetch(`${baseUrl}/api/orders/PO-849201`)).json();
    assert.equal(fetchedLegacyOrder.order.orderId, 'PO-849201');
    const fetchedLegacyBooking = await (await fetch(`${baseUrl}/api/bookings/PO-RES-412093`)).json();
    assert.equal(fetchedLegacyBooking.booking.referenceNumber, 'PO-RES-412093');

    await new Promise<void>((resolve) => server.close(() => resolve()));
    store.close();

    // 5. Reopen persistence & dual-connection WAL concurrency verification
    const storeA = createDatabaseStore(dbPath);
    const storeB = createDatabaseStore(dbPath);
    try {
      const resultsA = storeA.createOrder(makeOrderPayload(100));
      const resultsB = storeB.createOrder(makeOrderPayload(101));
      assert.equal(resultsA.referenceNumber, 'ORD-000023');
      assert.equal(resultsB.referenceNumber, 'ORD-000024');

      const bookingA = storeA.createBooking(makeBookingPayload(100));
      const bookingB = storeB.createBooking(makeBookingPayload(101));
      assert.equal(bookingA.referenceNumber, 'BK-000023');
      assert.equal(bookingB.referenceNumber, 'BK-000024');
    } finally {
      storeA.close();
      storeB.close();
    }
  } finally {
    if (server.listening) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
