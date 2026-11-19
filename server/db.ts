import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export type SequenceType = 'order' | 'booking';

export interface OrderItemInput {
  cartItemId?: string;
  dishId?: string;
  name: string;
  category?: string;
  variation?: string | null;
  unitPrice: number;
  quantity: number;
  specialNotes?: string;
  totalPrice: number;
  portion?: string;
}

export interface CreateOrderInput {
  fulfillmentType: 'pickup' | 'delivery';
  displayDate: string;
  displayTime: string;
  customer: {
    name: string;
    phone: string;
    notes?: string;
    address?: {
      street: string;
      floor?: string;
      doorbell?: string;
      postalCode: string;
      city: string;
    };
  };
  items: OrderItemInput[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
}

export interface OrderRecord {
  id: number;
  orderId: string;
  referenceNumber: string;
  sequenceNumber: number | null;
  status: string;
  fulfillmentType: string;
  displayDate: string;
  displayTime: string;
  customer: CreateOrderInput['customer'];
  items: OrderItemInput[];
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  createdAt: string;
}

export interface CreateBookingInput {
  bookingDate: string;
  displayTime: string;
  totalGuests: number;
  composition?: {
    kids?: number;
    male?: number;
    female?: number;
  };
  hallPreference?: string;
  customer: {
    name: string;
    phone: string;
    specialRequests?: string;
  };
  source?: string;
}

export interface BookingRecord {
  id: number;
  referenceNumber: string;
  sequenceNumber: number | null;
  status: string;
  bookingDate: string;
  displayTime: string;
  totalGuests: number;
  composition: {
    kids: number;
    male: number;
    female: number;
  };
  hallPreference: string;
  customer: {
    name: string;
    phone: string;
    specialRequests: string;
  };
  source: string;
  createdAt: string;
}

export function formatReferenceNumber(type: SequenceType, sequenceNumber: number): string {
  const prefix = type === 'order' ? 'ORD' : 'BK';
  return `${prefix}-${String(sequenceNumber).padStart(6, '0')}`;
}

export function createDatabaseStore(dbFilePath?: string) {
  const resolvedPath =
    dbFilePath ||
    process.env.PEARL_OASIS_DB_PATH ||
    path.join(process.cwd(), 'data', 'pearl-oasis.db');

  if (resolvedPath !== ':memory:') {
    fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
  }

  const db = new DatabaseSync(resolvedPath);

  // Enable WAL mode (for disk DBs) and busy timeout for safe concurrent access
  if (resolvedPath !== ':memory:') {
    db.exec('PRAGMA journal_mode = WAL;');
  }
  db.exec('PRAGMA busy_timeout = 5000;');
  db.exec('PRAGMA foreign_keys = ON;');

  // Initialize database-level AUTOINCREMENT sequence tables and domain tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_sequences (
      seq INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS booking_sequences (
      seq INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sequence_number INTEGER UNIQUE,
      reference_number TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'Confirmed & Sent to Kitchen',
      fulfillment_type TEXT NOT NULL,
      display_date TEXT NOT NULL,
      display_time TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_notes TEXT NOT NULL DEFAULT '',
      delivery_address_json TEXT,
      items_json TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      delivery_fee INTEGER NOT NULL DEFAULT 0,
      grand_total INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sequence_number INTEGER UNIQUE,
      reference_number TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'Pending Confirmation',
      booking_date TEXT NOT NULL,
      display_time TEXT NOT NULL,
      total_guests INTEGER NOT NULL,
      kids_count INTEGER NOT NULL DEFAULT 0,
      male_count INTEGER NOT NULL DEFAULT 0,
      female_count INTEGER NOT NULL DEFAULT 0,
      hall_preference TEXT NOT NULL DEFAULT '',
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      special_requests TEXT NOT NULL DEFAULT '',
      source TEXT NOT NULL DEFAULT 'book-a-table',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const nextOrderSeqStmt = db.prepare('INSERT INTO order_sequences DEFAULT VALUES RETURNING seq');
  const nextBookingSeqStmt = db.prepare('INSERT INTO booking_sequences DEFAULT VALUES RETURNING seq');

  const insertOrderStmt = db.prepare(`
    INSERT INTO orders (
      sequence_number,
      reference_number,
      status,
      fulfillment_type,
      display_date,
      display_time,
      customer_name,
      customer_phone,
      customer_notes,
      delivery_address_json,
      items_json,
      subtotal,
      delivery_fee,
      grand_total,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `);

  const insertBookingStmt = db.prepare(`
    INSERT INTO bookings (
      sequence_number,
      reference_number,
      status,
      booking_date,
      display_time,
      total_guests,
      kids_count,
      male_count,
      female_count,
      hall_preference,
      customer_name,
      customer_phone,
      special_requests,
      source,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `);

  function mapOrderRow(row: Record<string, unknown>): OrderRecord {
    const ref = String(row.reference_number);
    return {
      id: Number(row.id),
      orderId: ref,
      referenceNumber: ref,
      sequenceNumber: row.sequence_number === null ? null : Number(row.sequence_number),
      status: String(row.status),
      fulfillmentType: String(row.fulfillment_type),
      displayDate: String(row.display_date),
      displayTime: String(row.display_time),
      customer: {
        name: String(row.customer_name),
        phone: String(row.customer_phone),
        notes: String(row.customer_notes || ''),
        ...(row.delivery_address_json
          ? { address: JSON.parse(String(row.delivery_address_json)) }
          : {}),
      },
      items: JSON.parse(String(row.items_json)),
      subtotal: Number(row.subtotal),
      deliveryFee: Number(row.delivery_fee),
      grandTotal: Number(row.grand_total),
      createdAt: String(row.created_at),
    };
  }

  function mapBookingRow(row: Record<string, unknown>): BookingRecord {
    return {
      id: Number(row.id),
      referenceNumber: String(row.reference_number),
      sequenceNumber: row.sequence_number === null ? null : Number(row.sequence_number),
      status: String(row.status),
      bookingDate: String(row.booking_date),
      displayTime: String(row.display_time),
      totalGuests: Number(row.total_guests),
      composition: {
        kids: Number(row.kids_count),
        male: Number(row.male_count),
        female: Number(row.female_count),
      },
      hallPreference: String(row.hall_preference || ''),
      customer: {
        name: String(row.customer_name),
        phone: String(row.customer_phone),
        specialRequests: String(row.special_requests || ''),
      },
      source: String(row.source),
      createdAt: String(row.created_at),
    };
  }

  function withImmediateTransaction<T>(fn: () => T): T {
    db.exec('BEGIN IMMEDIATE');
    try {
      const result = fn();
      db.exec('COMMIT');
      return result;
    } catch (error) {
      try {
        db.exec('ROLLBACK');
      } catch {
        // Ignore rollback failure if transaction already closed
      }
      throw error;
    }
  }

  function createOrder(input: CreateOrderInput): OrderRecord {
    return withImmediateTransaction(() => {
      const seqRow = nextOrderSeqStmt.get() as { seq: number };
      const sequenceNumber = Number(seqRow.seq);
      const referenceNumber = formatReferenceNumber('order', sequenceNumber);
      const createdAt = new Date().toISOString();

      const row = insertOrderStmt.get(
        sequenceNumber,
        referenceNumber,
        'Confirmed & Sent to Kitchen',
        input.fulfillmentType,
        input.displayDate,
        input.displayTime,
        input.customer.name.trim(),
        input.customer.phone.trim(),
        (input.customer.notes || '').trim(),
        input.fulfillmentType === 'delivery' && input.customer.address
          ? JSON.stringify(input.customer.address)
          : null,
        JSON.stringify(input.items),
        Math.round(Number(input.subtotal)),
        Math.round(Number(input.deliveryFee || 0)),
        Math.round(Number(input.grandTotal)),
        createdAt
      ) as Record<string, unknown>;

      return mapOrderRow(row);
    });
  }

  function createBooking(input: CreateBookingInput): BookingRecord {
    return withImmediateTransaction(() => {
      const seqRow = nextBookingSeqStmt.get() as { seq: number };
      const sequenceNumber = Number(seqRow.seq);
      const referenceNumber = formatReferenceNumber('booking', sequenceNumber);
      const createdAt = new Date().toISOString();

      const kids = Math.max(0, Number(input.composition?.kids || 0));
      const male = Math.max(0, Number(input.composition?.male || 0));
      const female = Math.max(0, Number(input.composition?.female || 0));

      const row = insertBookingStmt.get(
        sequenceNumber,
        referenceNumber,
        'Pending Confirmation',
        input.bookingDate,
        input.displayTime,
        Number(input.totalGuests),
        kids,
        male,
        female,
        (input.hallPreference || '').trim(),
        input.customer.name.trim(),
        input.customer.phone.trim(),
        (input.customer.specialRequests || '').trim(),
        input.source || 'book-a-table',
        createdAt
      ) as Record<string, unknown>;

      return mapBookingRow(row);
    });
  }

  function listOrders(): OrderRecord[] {
    const rows = db.prepare('SELECT * FROM orders ORDER BY id DESC').all() as Record<string, unknown>[];
    return rows.map(mapOrderRow);
  }

  function getOrderByReference(referenceNumber: string): OrderRecord | null {
    const row = db
      .prepare('SELECT * FROM orders WHERE reference_number = ?')
      .get(referenceNumber) as Record<string, unknown> | undefined;
    return row ? mapOrderRow(row) : null;
  }

  function cancelOrderByReference(referenceNumber: string): OrderRecord | null {
    const row = db
      .prepare("UPDATE orders SET status = 'Cancelled' WHERE reference_number = ? RETURNING *")
      .get(referenceNumber) as Record<string, unknown> | undefined;
    return row ? mapOrderRow(row) : null;
  }

  function deleteOrderByReference(referenceNumber: string): boolean {
    const result = db.prepare('DELETE FROM orders WHERE reference_number = ?').run(referenceNumber);
    return Number(result.changes) > 0;
  }

  function listBookings(): BookingRecord[] {
    const rows = db.prepare('SELECT * FROM bookings ORDER BY id DESC').all() as Record<string, unknown>[];
    return rows.map(mapBookingRow);
  }

  function getBookingByReference(referenceNumber: string): BookingRecord | null {
    const row = db
      .prepare('SELECT * FROM bookings WHERE reference_number = ?')
      .get(referenceNumber) as Record<string, unknown> | undefined;
    return row ? mapBookingRow(row) : null;
  }

  function cancelBookingByReference(referenceNumber: string): BookingRecord | null {
    const row = db
      .prepare("UPDATE bookings SET status = 'Cancelled' WHERE reference_number = ? RETURNING *")
      .get(referenceNumber) as Record<string, unknown> | undefined;
    return row ? mapBookingRow(row) : null;
  }

  function deleteBookingByReference(referenceNumber: string): boolean {
    const result = db.prepare('DELETE FROM bookings WHERE reference_number = ?').run(referenceNumber);
    return Number(result.changes) > 0;
  }

  // Insert a legacy record without modifying or incrementing current sequence counters
  function insertLegacyOrderForCompat(legacy: {
    referenceNumber: string;
    fulfillmentType: string;
    displayDate: string;
    displayTime: string;
    customerName: string;
    customerPhone: string;
    items: OrderItemInput[];
    subtotal: number;
    deliveryFee?: number;
    grandTotal: number;
    status?: string;
    createdAt?: string;
  }): OrderRecord {
    const row = insertOrderStmt.get(
      null,
      legacy.referenceNumber,
      legacy.status || 'Confirmed & Sent to Kitchen',
      legacy.fulfillmentType,
      legacy.displayDate,
      legacy.displayTime,
      legacy.customerName,
      legacy.customerPhone,
      '',
      null,
      JSON.stringify(legacy.items),
      legacy.subtotal,
      legacy.deliveryFee || 0,
      legacy.grandTotal,
      legacy.createdAt || new Date().toISOString()
    ) as Record<string, unknown>;
    return mapOrderRow(row);
  }

  function insertLegacyBookingForCompat(legacy: {
    referenceNumber: string;
    bookingDate: string;
    displayTime: string;
    totalGuests: number;
    customerName: string;
    customerPhone: string;
    status?: string;
    createdAt?: string;
  }): BookingRecord {
    const row = insertBookingStmt.get(
      null,
      legacy.referenceNumber,
      legacy.status || 'Confirmed',
      legacy.bookingDate,
      legacy.displayTime,
      legacy.totalGuests,
      0,
      0,
      0,
      '',
      legacy.customerName,
      legacy.customerPhone,
      '',
      'legacy',
      legacy.createdAt || new Date().toISOString()
    ) as Record<string, unknown>;
    return mapBookingRow(row);
  }

  function close() {
    db.close();
  }

  return {
    db,
    createOrder,
    createBooking,
    listOrders,
    getOrderByReference,
    cancelOrderByReference,
    deleteOrderByReference,
    listBookings,
    getBookingByReference,
    cancelBookingByReference,
    deleteBookingByReference,
    insertLegacyOrderForCompat,
    insertLegacyBookingForCompat,
    close,
  };
}

export type DatabaseStore = ReturnType<typeof createDatabaseStore>;
