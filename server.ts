import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import {
  createDatabaseStore,
  type CreateBookingInput,
  type CreateOrderInput,
  type DatabaseStore,
} from './server/db.ts';

export function createApiApp(store: DatabaseStore) {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // --- Orders API ---
  app.get('/api/orders', (_req, res) => {
    const orders = store.listOrders();
    res.json({ orders });
  });

  app.get('/api/orders/:reference', (req, res) => {
    const order = store.getOrderByReference(req.params.reference);
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }
    res.json({ order });
  });

  app.post('/api/orders', (req, res) => {
    const body = req.body as Partial<CreateOrderInput> | undefined;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Invalid order payload.' });
      return;
    }

    const fulfillmentType = body.fulfillmentType === 'delivery' ? 'delivery' : body.fulfillmentType === 'pickup' ? 'pickup' : null;
    if (!fulfillmentType) {
      res.status(400).json({ error: 'Invalid fulfillmentType.' });
      return;
    }

    const customerName = String(body.customer?.name || '').trim();
    const customerPhone = String(body.customer?.phone || '').trim();
    if (!customerName || customerPhone.length < 8) {
      res.status(400).json({ error: 'Valid customer name and phone number are required.' });
      return;
    }

    if (fulfillmentType === 'delivery') {
      const addr = body.customer?.address;
      if (!addr || !String(addr.street || '').trim() || !String(addr.city || '').trim()) {
        res.status(400).json({ error: 'Delivery street address and city are required.' });
        return;
      }
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      res.status(400).json({ error: 'Order must contain at least one item.' });
      return;
    }

    const order = store.createOrder({
      fulfillmentType,
      displayDate: String(body.displayDate || 'Today').trim(),
      displayTime: String(body.displayTime || 'ASAP').trim(),
      customer: {
        name: customerName,
        phone: customerPhone,
        notes: String(body.customer?.notes || '').trim(),
        ...(fulfillmentType === 'delivery' && body.customer?.address
          ? {
              address: {
                street: String(body.customer.address.street).trim(),
                floor: String(body.customer.address.floor || '').trim(),
                doorbell: String(body.customer.address.doorbell || '').trim(),
                postalCode: String(body.customer.address.postalCode || '').trim(),
                city: String(body.customer.address.city).trim(),
              },
            }
          : {}),
      },
      items: body.items,
      subtotal: Number(body.subtotal || 0),
      deliveryFee: Number(body.deliveryFee || 0),
      grandTotal: Number(body.grandTotal || 0),
    });

    res.status(201).json({ order });
  });

  app.patch('/api/orders/:reference/cancel', (req, res) => {
    const order = store.cancelOrderByReference(req.params.reference);
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }
    res.json({ order });
  });

  app.delete('/api/orders/:reference', (req, res) => {
    const deleted = store.deleteOrderByReference(req.params.reference);
    if (!deleted) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }
    res.json({ deleted: true });
  });

  // --- Bookings API ---
  app.get('/api/bookings', (_req, res) => {
    const bookings = store.listBookings();
    res.json({ bookings });
  });

  app.get('/api/bookings/:reference', (req, res) => {
    const booking = store.getBookingByReference(req.params.reference);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }
    res.json({ booking });
  });

  app.post('/api/bookings', (req, res) => {
    const body = req.body as Partial<CreateBookingInput> | undefined;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Invalid booking payload.' });
      return;
    }

    const customerName = String(body.customer?.name || '').trim();
    const customerPhone = String(body.customer?.phone || '').trim();
    const totalGuests = Number(body.totalGuests || 0);

    if (!customerName || customerPhone.length < 7) {
      res.status(400).json({ error: 'Valid guest name and phone number are required.' });
      return;
    }

    if (!Number.isFinite(totalGuests) || totalGuests < 1) {
      res.status(400).json({ error: 'At least 1 guest is required.' });
      return;
    }

    const booking = store.createBooking({
      bookingDate: String(body.bookingDate || 'Not specified').trim(),
      displayTime: String(body.displayTime || 'Not selected').trim(),
      totalGuests: Math.round(totalGuests),
      composition: {
        kids: Number(body.composition?.kids || 0),
        male: Number(body.composition?.male || 0),
        female: Number(body.composition?.female || 0),
      },
      hallPreference: String(body.hallPreference || '').trim(),
      customer: {
        name: customerName,
        phone: customerPhone,
        specialRequests: String(body.customer?.specialRequests || '').trim(),
      },
      source: String(body.source || 'book-a-table'),
    });

    res.status(201).json({ booking });
  });

  app.patch('/api/bookings/:reference/cancel', (req, res) => {
    const booking = store.cancelBookingByReference(req.params.reference);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }
    res.json({ booking });
  });

  app.delete('/api/bookings/:reference', (req, res) => {
    const deleted = store.deleteBookingByReference(req.params.reference);
    if (!deleted) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }
    res.json({ deleted: true });
  });

  // --- Explicit SEO & Agentic Discovery Routes (never swallowed by SPA HTML fallback) ---
  const resolvePublicFile = (relativePath: string) => {
    const prodCandidate = path.resolve(process.cwd(), 'dist', relativePath);
    if (process.env.NODE_ENV === 'production' && fs.existsSync(prodCandidate)) {
      return prodCandidate;
    }
    return path.resolve(process.cwd(), 'public', relativePath);
  };

  const serveDiscoveryFile = (
    routePath: string,
    relativeFilePath: string,
    contentType: string
  ) => {
    app.get(routePath, (_req, res) => {
      const filePath = resolvePublicFile(relativeFilePath);
      if (!fs.existsSync(filePath)) {
        res.status(404).type('text/plain; charset=utf-8').send('Not Found');
        return;
      }
      res
        .status(200)
        .set({
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600',
        })
        .sendFile(filePath);
    });
  };

  serveDiscoveryFile('/robots.txt', 'robots.txt', 'text/plain; charset=utf-8');
  serveDiscoveryFile('/sitemap.xml', 'sitemap.xml', 'application/xml; charset=utf-8');
  serveDiscoveryFile('/llms.txt', 'llms.txt', 'text/markdown; charset=utf-8');
  serveDiscoveryFile('/.well-known/ard.json', '.well-known/ard.json', 'application/json; charset=utf-8');
  serveDiscoveryFile('/.well-known/ai-catalog.json', '.well-known/ai-catalog.json', 'application/json; charset=utf-8');
  serveDiscoveryFile('/ai-catalog.json', '.well-known/ai-catalog.json', 'application/json; charset=utf-8');
  serveDiscoveryFile('/openapi.json', 'openapi.json', 'application/openapi+json; charset=utf-8');
  serveDiscoveryFile('/skills/pearl-oasis-dining.md', 'skills/pearl-oasis-dining.md', 'text/markdown; charset=utf-8');
  serveDiscoveryFile('/skills/pearl-oasis-orders-api.md', 'skills/pearl-oasis-orders-api.md', 'text/markdown; charset=utf-8');

  return app;
}

export async function startServer() {
  const store = createDatabaseStore();
  const app = createApiApp(store);
  const args = process.argv.slice(2);
  const portArgIndex = args.indexOf('--port');
  const portFromArgs = portArgIndex !== -1 ? Number(args[portArgIndex + 1]) : null;
  const port = portFromArgs || Number(process.env.DEFAULT_APP_PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Advertise Agentic Resource Discovery (ARD) on all HTML document responses in dev and prod
  app.use((req, res, next) => {
    if (
      req.method === 'GET' &&
      !req.path.startsWith('/api') &&
      !req.path.startsWith('/.well-known') &&
      !path.extname(req.path)
    ) {
      res.setHeader('Link', '</.well-known/ard.json>; rel="ard"; type="application/json"');
    }
    next();
  });

  if (isProd) {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(
      '/assets',
      express.static(path.join(distDir, 'assets'), {
        maxAge: '1y',
        immutable: true,
      })
    );
    app.use(
      express.static(distDir, {
        maxAge: '1h',
      })
    );
    app.get('*', (_req, res) => {
      res.set('Link', '</.well-known/ard.json>; rel="ard"; type="application/json"');
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Ensure non-API GET requests fall back cleanly to index.html if needed
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        next();
        return;
      }
      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let html = fs.readFileSync(indexPath, 'utf-8');
        html = await vite.transformIndexHtml(req.originalUrl, html);
        res
          .status(200)
          .set({
            'Content-Type': 'text/html; charset=utf-8',
            Link: '</.well-known/ard.json>; rel="ard"; type="application/json"',
          })
          .end(html);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  }

  return app.listen(port, '0.0.0.0', () => {
    console.log(`Pearl Oasis server listening on http://0.0.0.0:${port}`);
  });
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
