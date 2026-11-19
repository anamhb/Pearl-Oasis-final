# Pearl Oasis — Lighthouse & Agentic Browsing Optimization

## Overview

This document details the evidence-based optimizations applied across the **Pearl Oasis Restaurant** web application to address every bottleneck identified in the baseline Lighthouse 13.5.0 Desktop audit (`report.pdf`), while preserving 100% of Pearl Oasis's luxury visual identity, animations, interactive 3D golden logo, scroll-controlled location map video, full menu ordering flow, checkout flow, table reservation system, and desktop/tablet/mobile responsiveness.

### Baseline Lighthouse Audit (`report.pdf`, Lighthouse 13.5.0 Desktop)

| Category | Baseline Score | Key Issues Identified |
| --- | --- | --- |
| **Performance** | `37 / 100` | FCP `3.3s`, LCP `3.7s`, TBT `600ms`, CLS `0.015`, Speed Index `8.2s`; ~`10,751 KiB` image savings; `18,864 KiB` network payload; `5.7s` main-thread work; `2.0s` JS execution; `601 KiB` unused JS; `10` long tasks; `240ms` render-blocking requests; forced reflows; `4` non-composited animations |
| **Accessibility** | `98 / 100` | `heading-order`: heading elements were not in sequentially-descending order (`<h2>` directly followed by `<h4>`) |
| **Best Practices** | `100 / 100` | Preserve `100/100`; minor diagnostic noted missing source maps for large first-party JS |
| **SEO** | `92 / 100` | `robots-txt`: `/robots.txt` returned SPA fallback HTML instead of a valid `robots.txt` (`21` syntax errors) |
| **Agentic Browsing** | `2 / 4` | `llms-txt` failed (`/llms.txt` returned SPA HTML) and `ard-schema` / `ai-catalog` failed (`/.well-known/ard.json` and `/.well-known/ai-catalog.json` returned SPA HTML) |

---

## 1. Performance Optimizations

### 1.1 Image Compression, Format Modernization & Loading Priorities

All active photographic and brand assets were converted to properly sized, crisp WebP assets (originals preserved untouched in `src/assets/images/`):

| Asset | Original Size | Optimized Size | Savings |
| --- | --- | --- | --- |
| Hero Slide 1 (`new-entrance.jpg` -> `public/images/hero-entrance.webp` / `-mobile.webp`) | `694.0 KiB` | `87.3 KiB` desktop / `33.5 KiB` mobile | `-87.4%` / `-95.2%` |
| Hero Slide 2 (`hero-second- image.jpg` -> `opt/hero-second.webp`) | `732.0 KiB` | `89.8 KiB` | `-87.7%` |
| Hero Slide 3 (`hero-third- image.jpg` -> `opt/hero-third.webp`) | `908.0 KiB` | `178.6 KiB` | `-80.3%` |
| Hero Thumbnails (3x dedicated `160x160` WebPs replacing full-res hero images) | `2,334.0 KiB` | `15.3 KiB` total (`~5 KiB` each) | `-99.3%` |
| Loader Royal Crest (`royal-crest-logo.png` -> `opt/royal-crest-logo.webp?inline`) | `194.0 KiB` (~`258 KiB` base64) | `10.7 KiB` (`14.4 KiB` base64) | `-94.5%` |
| Navbar/Footer Wordmark (`logo-text.png` -> `opt/logo-text.webp`) | `110.6 KiB` | `15.8 KiB` | `-85.7%` |
| Our Story Entrance (`Pearl Oasis Restaurant Entrance.png` -> `opt/pearl-oasis-entrance.webp`) | `2,544.4 KiB` | `114.1 KiB` | `-95.5%` |
| Warm Modern Interior (`Warm Modern Restaurant Interior.png` -> `opt/warm-modern-interior.webp`) | `2,250.4 KiB` | `88.0 KiB` | `-96.1%` |
| Experience Feast Background (`hero_oasis_feast...webp` -> `opt/hero-oasis-feast.webp`) | `215.6 KiB` | `149.9 KiB` | `-30.5%` |
| CEO Portrait (`CEO.jpg` -> `opt/ceo-portrait.webp`) | `98.3 KiB` | `32.7 KiB` | `-66.7%` |
| Signature Dishes (6 WebPs: Malai Boti, Fried Rice, Chow Mein, Soup, Wrap, Pasta) | `2,507.0 KiB` | `269.8 KiB` total | `-89.2%` |
| Moments Gallery (Cards 1–7 + Main Dining Hall WebPs; removed 3 unused legacy imports) | `1,152.8 KiB` | `347.8 KiB` total | `-69.8%` |
| Menu/Data Assets (Mutton Karahi, Oasis Burger, Emerald Entrance, Vegetable Soup) | `2,783.3 KiB` | `257.8 KiB` total | `-90.7%` |
| **3D Golden Logo GLB** (`PO-logo.glb` -> `opt/PO-logo.glb`, decimated & `UINT16` indexed) | `1,841.2 KiB` | `380.3 KiB` | `-79.3%` |

- **LCP Preload**: Added `<link rel="preload" as="image" type="image/webp" href="/images/hero-entrance.webp" imagesrcset="/images/hero-entrance-mobile.webp 800w, /images/hero-entrance.webp 1365w" imagesizes="100vw" fetchpriority="high">` in `index.html`, paired with matching `srcSet`, `sizes="100vw"`, `width`, `height`, and `fetchPriority="high"` on Hero Slide 1 in `src/components/Hero.jsx`.
- **Below-the-Fold Lazy Loading**: Switched every below-the-fold `<img>` across `OurStory.jsx`, `SignatureDishes.jsx`, `MalaiBotiScrollTransition.jsx`, `ExperienceSection.jsx`, `MomentsGallery.jsx`, `CircularOrbitImage.jsx`, and `MenuSection.jsx` from `loading="eager"` to `loading="lazy"` + `decoding="async"` + explicit `width` and `height` attributes.
- **Single-Breakpoint Gallery DOM**: Updated `MomentsGallery.jsx` to mount only the active viewport layout (`matchMedia('(min-width: 1024px)')`), eliminating 9 duplicate hidden-breakpoint `<img>` elements from the DOM.

### 1.2 Deferred Video & 3D Asset Loading

- **Location Video (`LocationHoursSection.jsx`)**: Deferred attaching `<video src>` and `<video poster>`, changed initial `preload` to `"none"`, and moved Cloudinary RAM Blob pre-buffering behind an `IntersectionObserver` (`rootMargin: '900px 0px'`). Initial page load transfers **0 bytes** of the `~4.18 MB` video and poster while still pre-buffering smoothly into RAM before the visitor reaches the Location & Service Hours section.
- **3D Golden Logo (`BrandLogo.jsx` & `Logo3D.jsx`)**:
  - Code-split `Logo3D` (`three` + `GLTFLoader`) via `React.lazy`, mounting the navbar instance on `requestIdleCallback` (with fallback timer) and the footer instance only when approaching the viewport via `IntersectionObserver`, displaying a matching-dimension golden crest SVG placeholder with zero CLS.
  - Decimated `PO-logo.glb` (`41,527 -> 16,154` vertices, `115,486 -> 32,466` triangles, bounding-box delta `<= 0.0016`, `1,841.2 KiB -> 380.3 KiB`) and added a module-level shared `ArrayBuffer` fetch cache so the GLB downloads only once across Navbar + Footer.
  - Added off-screen `IntersectionObserver` and `document.visibilitychange` pausing for `requestAnimationFrame`, plus `prefers-reduced-motion` support.

### 1.3 JavaScript Bundle Size, Code Splitting & Production Mode Enforcement

- **Removed `gsap` from Critical Path (`Hero.jsx`)**: Replaced GSAP slide transitions with native Web Animations API (`Element.animate()`), eliminating ~72 KiB of third-party animation JS from the initial bundle.
- **Route & Modal Code Splitting (`App.jsx`)**: Lazy-loaded `FullMenuOrderPage`, `CheckoutPage`, `BookTablePage`, `OrderTrayDrawer`, and `ReservationModal` with `React.lazy` + `<Suspense>`, conditionally mounting drawers/modals only when open, and dynamically importing `pearlOasisFullMenu.js` only when a dish is added from the landing page.
- **Chunk Architecture & Source Maps (`vite.config.ts`, `package.json`)**:
  - Configured explicit manual chunks (`vendor-react`, `vendor-icons`, `vendor-three`) and enabled `build.sourcemap: true` (resolving Best Practices source-map diagnostic).
  - Fixed a critical build-environment trap where `NODE_ENV=development` caused Vite 8 to bundle `react-dom-client.development.js` (`404.8 KiB` raw / `123.2 KiB` gzip) into production output. Both `vite.config.ts` (`command === 'build'`) and `package.json` (`"build": "NODE_ENV=production vite build"`) now guarantee React's minified production runtime.

#### Measured Production Build (`dist/`)

| Initial Entry Asset (loaded on `/`) | Raw Size | Gzipped Size | Source Map |
| --- | --- | --- | --- |
| `/assets/index-*.js` (landing page app) | `134.6 KiB` | `42.8 KiB` | Yes |
| `/assets/vendor-react-*.js` (React 19 prod) | `206.0 KiB` | `63.7 KiB` | Yes |
| `/assets/vendor-icons-*.js` (Lucide icons) | `15.3 KiB` | `5.9 KiB` | Yes |
| `/assets/rolldown-runtime-*.js` | `0.7 KiB` | `0.4 KiB` | — |
| `/assets/index-*.css` (Tailwind v4) | `119.4 KiB` | `17.5 KiB` | — |
| **Total Initial Entry JS + CSS** | **`476.0 KiB`** | **`130.3 KiB`** | — |

Lazy-loaded chunks excluded from initial `/` load:
- `vendor-three` (`615.8 kB` raw / `153.6 kB` gzip) + `Logo3D` (`4.0 kB` raw / `2.0 kB` gzip) — loaded on idle / footer scroll.
- `BookTablePage` (`42.4 kB` / `8.0 kB` gzip), `CheckoutPage` (`28.1 kB` / `6.5 kB` gzip), `FullMenuOrderPage` (`27.9 kB` / `6.0 kB` gzip), `pearlOasisFullMenu` (`23.7 kB` / `6.0 kB` gzip), `OrderTrayDrawer` (`8.3 kB` / `2.4 kB` gzip), `ReservationModal` (`7.9 kB` / `2.4 kB` gzip) — loaded strictly on navigation or interaction.

### 1.4 Render-Blocking Resources, Forced Reflows & Non-Composited Animations

- **Render-Blocking Fonts (`index.html`, `src/index.css`)**: Trimmed Google Fonts from 6 font families down to only the 3 actually used (`Alex Brush`, `Cormorant Garamond`, `Montserrat`), removed unused `.font-editorial` CSS, and switched the stylesheet to non-blocking `media="print" onload="this.media='all'"` with `<noscript>` fallback.
- **Royal Radiance Loader (`RoyalRadianceLoader.jsx`)**: Switched from waiting on slow `window.load` (`1,500ms` dwell + `600ms` fade + `3,800ms` safety cap) to dismissing promptly after DOM ready (`420ms` dwell + `320ms` fade), using the `10.7 KiB` compressed WebP inline logo and removing non-composited `filter: blur(10px)` repaints.
- **Forced Reflow Elimination**:
  - `MalaiBotiScrollTransition.jsx`: Removed `measure()` (`getBoundingClientRect()`) from the `scroll` handler entirely; geometry is now measured only on mount, `document.fonts.ready`, `ResizeObserver`, and `window.resize`.
  - `MomentsGallery.jsx`: Reordered `updateLayoutAndScroll()` so all DOM geometry reads (`scrollWidth`, `clientWidth`, `getBoundingClientRect().top`) execute before any style writes (`style.height`, `style.transform`).
  - `WhyChooseSection.jsx`: Deferred `offsetWidth` measurement until the section enters the viewport via `IntersectionObserver`, cached `moving-left` class transitions so `classList` only mutates on direction flips, and moved CSS rules from an inline `<style>` tag to `src/index.css`.
  - `LocationHoursSection.jsx`: Passed cached `runwayRect` into `measureProgress()` to eliminate duplicate `getBoundingClientRect()` reads on scroll.
- **Composited Animations Only**:
  - `MalaiBotiScrollTransition.jsx`: Replaced per-scroll `width`, `height`, and `filter: drop-shadow(...)` mutations with GPU-composited `transform: translate3d(...) scale(...)` and a radial glow layer animated via `opacity`.
  - `Hero.jsx`: Replaced non-composited thumbnail `width`/`height` transitions and `clip-path` title animations with GPU-composited `transform` + `opacity` animations.
  - `TestimonialsSection.jsx`, `CircularOrbitImage.jsx`, `src/index.css`: Promoted marquee keyframes to `translate3d` and added `IntersectionObserver` pausing (`.marquee-paused`) when off-screen.
- **HTTP Caching (`server.ts`)**: Added `maxAge: '1y', immutable: true` for hashed `/assets/*` in production and `Cache-Control: public, max-age=3600` for discovery files.

---

## 2. Accessibility Optimizations (`98 -> target 100`)

- **Fixed Heading Order Skip (`TestimonialsSection.jsx`)**: Changed guest review card names from `<h4>` to `<h3>` beneath `<h2>Words from Our Guests</h2>`, directly resolving the Lighthouse `heading-order` audit failure.
- **Secondary Route Heading Audits**:
  - `CheckoutPage.jsx`: Changed checkout item headings from `<h4>` to `<h3>` beneath `<h2>Your items</h2>`.
  - `FullMenuOrderPage.jsx`: Added `<h1 className="sr-only">Pearl Oasis Full Dining Menu and Online Ordering</h1>` inside `<main>` and changed the empty-search heading from `<h3>` to `<h2>`.
- **Keyboard & Dialog Accessibility**: Added `role="button"`, `tabIndex={0}`, `onKeyDown` (`Enter`/`Space`), focus-visible rings, and descriptive `aria-label` attributes on interactive cards in `SignatureDishes.jsx`, `MomentsGallery.jsx`, and `TestimonialsSection.jsx`; added `role="dialog" aria-modal="true"`, `Escape`-key dismissal, and explicit `type="button"` on modal/action buttons.

---

## 3. SEO Optimizations (`92 -> target 100`)

- **Valid `/robots.txt` (`public/robots.txt`, `server.ts`)**: Created an RFC 9309 + Lighthouse `robots-txt` compliant `robots.txt` using strictly standard directives (`User-agent`, `Allow`, `Disallow`, `Sitemap`) and registered an explicit Express route before Vite/SPA fallback (`200 OK`, `text/plain; charset=utf-8`, `Access-Control-Allow-Origin: *`).
- **XML Sitemap (`public/sitemap.xml`, `server.ts`)**: Added valid XML sitemap indexing `/`, `/order-menu`, and `/book-a-table`, served at `/sitemap.xml` with `application/xml; charset=utf-8`.
- **Metadata, Social Cards & Structured Data (`index.html`, `App.jsx`, `public/og-pearl-oasis.jpg`)**:
  - Added canonical `<link rel="canonical">`, synchronized route-specific `<title>` and canonical URLs across `/`, `/order-menu`, `/book-a-table`, and `/checkout`.
  - Generated a `1200x630` OpenGraph / Twitter image (`/og-pearl-oasis.jpg`, `114.6 KiB`) and added full OpenGraph + Twitter Card metadata.
  - Embedded verified `Schema.org` `Restaurant` JSON-LD with both Kohat branches, addresses, phone numbers, daily hours (`11:00–23:00`), cuisines, and menu/reservation links.

---

## 4. Agentic Browsing Optimizations (`2/4 -> target 4/4`)

- **Standards-Compliant `/llms.txt` (`public/llms.txt`, `server.ts`)**: Authored following `llmstxt.org` and Lighthouse `llms-txt` guidelines (H1 title, concise blockquote summary, factual Kohat branch details and service hours, structured `##` sections with verified markdown links), served as `text/markdown; charset=utf-8` with CORS `*`.
- **Valid ARD & AI-Catalog Discovery (`public/.well-known/ard.json`, `public/.well-known/ai-catalog.json`, `server.ts`, `index.html`)**:
  - Authored identical JSON manifests conforming strictly to Lighthouse v13.5.0's `AICatalogManifest` JSON Schema (`specVersion: "1.0"`, `host`, `entries` with `urn:air:` identifiers, standard `text/markdown; profile="urn:air:agent-skills"` media types, capabilities, and 3 representative queries per entry).
  - Served at `/.well-known/ard.json`, `/.well-known/ai-catalog.json`, and `/ai-catalog.json` with `application/json; charset=utf-8` and `Access-Control-Allow-Origin: *`.
  - Advertised via HTML `<link rel="ard">` and `<link rel="ai-catalog">` tags in `index.html` AND via HTTP `Link: </.well-known/ard.json>; rel="ard"; type="application/json"` response headers on HTML routes in both dev and production.
- **Grounded Agent Resources (`public/skills/pearl-oasis-dining.md`, `public/skills/pearl-oasis-orders-api.md`, `public/openapi.json`)**:
  - Created factual dining & menu skill documentation, Orders & Table Bookings API skill documentation, and an OpenAPI 3.1.0 specification matching the real Express endpoints implemented in `server.ts` (`/api/health`, `/api/orders`, `/api/bookings`). No speculative or non-existent capabilities were invented.

---

## 5. Verification Results & Limitations

### Automated Verification Executed

1. **TypeScript & Production Build**: `npm run lint` (`tsc --noEmit`) passed with 0 errors; `npm run build` (`NODE_ENV=production vite build`) succeeded with minified production React runtime and `.js.map` source maps generated.
2. **Unit Tests**: `node --test src/utils/scrollVideoSync.test.mjs` — **7 / 7 tests passed** (scroll-to-video synchronization, viewport travel progress, 4-step reveal milestones, hysteresis, and damping).
3. **Live HTTP Endpoint & Header Checks (`http://localhost:3000`)**: Verified `200 OK`, exact `Content-Type`, CORS headers, HTTP `Link` header on HTML routes (`/`, `/order-menu`, `/book-a-table`), and zero SPA HTML leakage on:
   - `/robots.txt` (`text/plain; charset=utf-8`, `0` Lighthouse parser errors)
   - `/sitemap.xml` (`application/xml; charset=utf-8`)
   - `/llms.txt` (`text/markdown; charset=utf-8`, passes all Lighthouse `llms-txt` structure checks)
   - `/.well-known/ard.json`, `/.well-known/ai-catalog.json`, `/ai-catalog.json` (`application/json; charset=utf-8`)
   - `/openapi.json` (`application/openapi+json; charset=utf-8`, valid OpenAPI 3.1.0 JSON)
   - `/skills/pearl-oasis-dining.md` & `/skills/pearl-oasis-orders-api.md` (`text/markdown; charset=utf-8`)
   - `/api/health`, `/images/hero-entrance.webp`, `/images/hero-entrance-mobile.webp`, `/og-pearl-oasis.jpg`
4. **Official Lighthouse v13.5.0 ARD Validator**: Executed upstream `GoogleChrome/lighthouse` v13.5.0 `third-party/ard/ard.js` (`ConformanceTester`) + compiled `schema-validator.js` directly against the live responses at `/.well-known/ard.json`, `/.well-known/ai-catalog.json`, and `/ai-catalog.json` -> **`valid=true`, `0` errors, `0` warnings**.
5. **Heading Hierarchy Audit**: Audited all JSX heading elements across `/`, `/order-menu`, `/checkout`, and `/book-a-table` confirming strictly sequential heading levels on every view.

### Environment Limitations & Re-Test Instructions

- **No Headless Chrome Binary in Container**: Because this build environment does not have Chrome/Chromium installed, a live browser Lighthouse score cannot be captured directly inside the container; therefore no simulated Lighthouse scores are claimed here.
- **How to Re-Test Accurately**:
  1. Deploy or serve the production build (`npm run build && NODE_ENV=production npm start`).
  2. Open a clean **Chrome Incognito window** with all browser extensions disabled (the baseline report noted extension/cache interference).
  3. Run Lighthouse (Desktop and Mobile) against the deployed URL (`https://pearl-oasis.ai.studio/`) across Performance, Accessibility, Best Practices, SEO, and Agentic Browsing.
  4. Visually confirm hero slider transitions, navbar/footer 3D golden logo rotation, Malai Boti scroll flight, crossing marquee tapes, Moments Gallery pinned scroll + lightbox, guest review modal, CEO circular orbit, Location & Service Hours scroll-controlled video + 4-step reveals, full menu ordering, checkout, and table booking on desktop, tablet, and mobile.
