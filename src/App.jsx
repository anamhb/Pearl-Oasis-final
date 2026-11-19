import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import OurStory from './components/OurStory.jsx';
import SignatureDishes from './components/SignatureDishes.jsx';
import MalaiBotiScrollTransition from './components/MalaiBotiScrollTransition.jsx';
import WhyChooseSection from './components/WhyChooseSection.jsx';
import ExperienceSection from './components/ExperienceSection.jsx';
import TestimonialsSection from './components/TestimonialsSection.jsx';
import CeoVisionSection from './components/CeoVisionSection.jsx';
import LocationHoursSection from './components/LocationHoursSection.jsx';
import Footer from './components/Footer.jsx';
import RoyalRadianceLoader from './components/RoyalRadianceLoader.jsx';
import { RESTAURANT_INFO } from './data/restaurantData.js';

const OrderTrayDrawer = lazy(() => import('./components/OrderTrayDrawer.jsx'));
const ReservationModal = lazy(() => import('./components/ReservationModal.jsx'));
const FullMenuOrderPage = lazy(() => import('./components/FullMenuOrderPage.jsx'));
const CheckoutPage = lazy(() => import('./components/CheckoutPage.jsx'));
const BookTablePage = lazy(() => import('./components/BookTablePage.jsx'));

const ROUTE_META = {
  landing: {
    title: 'Pearl Oasis — Fine Dining Restaurant in Kohat, Pakistan',
    path: '/',
  },
  'order-menu': {
    title: 'Full Menu & Online Ordering — Pearl Oasis Restaurant Kohat',
    path: '/order-menu',
  },
  'book-a-table': {
    title: 'Book a Table — Pearl Oasis Restaurant Kohat',
    path: '/book-a-table',
  },
  checkout: {
    title: 'Checkout — Pearl Oasis Restaurant Kohat',
    path: '/checkout',
  },
};

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#0B0708] text-[#F8F3E8] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#C9A45C] border-t-transparent animate-spin" aria-label="Loading view" />
    </div>
  );
}

const PEARL_OASIS_WHATSAPP = (
  import.meta.env.VITE_WHATSAPP_NUMBER ||
  RESTAURANT_INFO.whatsapp ||
  '+923327515538'
).replace(/[^0-9]/g, '');

const LANDING_WHATSAPP_URL = `https://wa.me/${PEARL_OASIS_WHATSAPP}?text=${encodeURIComponent(
  'Hello Pearl Oasis! I would like to inquire about dining, menu, or reservations.'
)}`;

export default function App() {
  // Navigation view: 'landing' | 'order-menu' | 'checkout' | 'book-a-table'
  const getInitialView = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/book-a-table' || path === '/book-table') return 'book-a-table';
      if (path === '/order' || path === '/order-menu') return 'order-menu';
      if (path === '/checkout') return 'checkout';
    }
    return 'landing';
  };

  const [currentView, setCurrentView] = useState(getInitialView);
  
  // Persistent Order Cart Items
  const [orderItems, setOrderItems] = useState(() => {
    try {
      const saved = localStorage.getItem('pearl_oasis_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    // Default initial items reflecting authentic Pearl Oasis menu
    return [
      {
        cartItemId: "item-chicken-karahi-half",
        dishId: "karahi-chicken",
        name: "Chicken Karahi",
        category: "Pakistani Karahi",
        variation: "Half",
        unitPrice: 1190,
        quantity: 1,
        specialNotes: "",
        totalPrice: 1190,
        portion: "Half",
      },
      {
        cartItemId: "item-tandoori-roghni-naan",
        dishId: "tandoor-roghni",
        name: "Roghni Naan",
        category: "Traditional Tandoor",
        variation: null,
        unitPrice: 150,
        quantity: 2,
        specialNotes: "",
        totalPrice: 300,
        portion: "1 pc",
      }
    ];
  });

  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('pearl_oasis_cart', JSON.stringify(orderItems));
    } catch (e) {
      console.warn('Could not persist cart', e);
    }
  }, [orderItems]);

  // Keep document title & canonical link synchronized across SPA views
  useEffect(() => {
    const meta = ROUTE_META[currentView] || ROUTE_META.landing;
    document.title = meta.title;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://pearl-oasis.ai.studio${meta.path}`);
    }
  }, [currentView]);

  // Support direct URL refresh and browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/book-a-table' || path === '/book-table') {
        setCurrentView('book-a-table');
      } else if (path === '/order' || path === '/order-menu') {
        setCurrentView('order-menu');
      } else if (path === '/checkout') {
        setCurrentView('checkout');
      } else {
        setCurrentView('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top and sync browser path on view changes
  const navigateTo = (view) => {
    setCurrentView(view);
    const path = 
      view === 'book-a-table' ? '/book-a-table' : 
      view === 'order-menu' ? '/order-menu' : 
      view === 'checkout' ? '/checkout' : '/';
    
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({ view }, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Item to Order with Full Customization Details
  const handleAddToCart = (newItem) => {
    setOrderItems((prev) => {
      // Check if item with same dishId, variation, and specialNotes already exists
      const existingIdx = prev.findIndex(
        (item) =>
          item.dishId === newItem.dishId &&
          item.variation === newItem.variation &&
          item.specialNotes === newItem.specialNotes
      );

      if (existingIdx !== -1) {
        const updated = [...prev];
        const existing = updated[existingIdx];
        const updatedQty = existing.quantity + newItem.quantity;
        updated[existingIdx] = {
          ...existing,
          quantity: updatedQty,
          totalPrice: existing.unitPrice * updatedQty,
        };
        return updated;
      }

      return [...prev, newItem];
    });
  };

  // Quick add from Landing Page (Signature Dishes or Menu Preview) — loads full menu data lazily
  const handleAddToTrayFromLanding = async (dish) => {
    let matchedItem = null;
    let matchedCategory = 'Specialty';

    try {
      const { FULL_MENU_DATA } = await import('./data/pearlOasisFullMenu.js');
      for (const cat of FULL_MENU_DATA) {
        const found = cat.items.find(
          (i) => i.name.toLowerCase() === dish.name.toLowerCase() || i.id === dish.id
        );
        if (found) {
          matchedItem = found;
          matchedCategory = cat.name;
          break;
        }
      }
    } catch {
      // Fallback gracefully to dish props if dynamic chunk fails
    }

    const price = matchedItem
      ? (matchedItem.hasVariations ? matchedItem.variations[0].price : matchedItem.price)
      : (dish.price || 950);

    const variation = matchedItem && matchedItem.hasVariations
      ? matchedItem.variations[0].name
      : null;

    const cartItem = {
      cartItemId: `${dish.id || 'item'}-${Date.now()}`,
      dishId: dish.id || 'dish-generic',
      name: dish.name,
      category: dish.category || matchedCategory,
      variation,
      unitPrice: price,
      quantity: 1,
      specialNotes: '',
      totalPrice: price,
      portion: dish.portion || (matchedItem ? matchedItem.portion : ''),
    };

    handleAddToCart(cartItem);
  };

  // Quantity adjustments
  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setOrderItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQuantity, totalPrice: item.unitPrice * newQuantity }
          : item
      )
    );
  };

  // Remove single line item
  const handleRemoveItem = (cartItemId) => {
    setOrderItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  // Clear entire cart
  const handleClearOrder = () => {
    setOrderItems([]);
  };

  const totalItemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = orderItems.reduce((sum, item) => sum + (item.totalPrice || item.unitPrice * item.quantity), 0);

  const renderActiveView = () => {
    // Render dedicated Full Menu Ordering Page
    if (currentView === 'order-menu') {
      return (
        <Suspense fallback={<RouteFallback />}>
          <FullMenuOrderPage
            orderItems={orderItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearOrder={handleClearOrder}
            onAddToCart={handleAddToCart}
            onProceedToCheckout={() => navigateTo('checkout')}
            onBackToHome={() => navigateTo('landing')}
          />
        </Suspense>
      );
    }

  // Render dedicated Checkout Page
  if (currentView === 'checkout') {
    return (
      <Suspense fallback={<RouteFallback />}>
        <CheckoutPage
          orderItems={orderItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearOrder={handleClearOrder}
          onBackToMenu={() => navigateTo('order-menu')}
          onBackToHome={() => navigateTo('landing')}
        />
      </Suspense>
    );
  }

  // Render dedicated Book A Table Page (/book-a-table)
  if (currentView === 'book-a-table') {
    return (
      <div className="min-h-screen bg-[#0B0708] text-[#F8F3E8] flex flex-col font-sans selection:bg-[#C02636] selection:text-[#F8F3E8]">
        <Navbar
          trayCount={totalItemCount}
          cartTotal={cartTotal}
          onOpenTray={() => setIsTrayOpen(true)}
          onOpenReservation={() => navigateTo('book-a-table')}
          onNavigateToBookTable={() => navigateTo('book-a-table')}
          onNavigateToFullMenu={() => navigateTo('order-menu')}
          onNavigateHome={() => navigateTo('landing')}
          currentView={currentView}
        />

        <main className="flex-1">
          <Suspense fallback={<RouteFallback />}>
            <BookTablePage
              onBackToHome={() => navigateTo('landing')}
              onOpenMenu={() => navigateTo('order-menu')}
            />
          </Suspense>
        </main>

        <Footer
          onOpenReservation={() => navigateTo('book-a-table')}
          onNavigateHome={() => navigateTo('landing')}
          currentView={currentView}
        />

        {isTrayOpen && (
          <Suspense fallback={null}>
            <OrderTrayDrawer
              isOpen={isTrayOpen}
              onClose={() => setIsTrayOpen(false)}
              items={orderItems.map((item) => ({
                id: item.cartItemId,
                name: item.name,
                portion: item.variation ? `${item.portion || ''} (${item.variation})` : item.portion,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
              }))}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearTray={handleClearOrder}
              onProceedToCheckout={() => {
                setIsTrayOpen(false);
                navigateTo('checkout');
              }}
              onBrowseFullMenu={() => {
                setIsTrayOpen(false);
                navigateTo('order-menu');
              }}
            />
          </Suspense>
        )}
      </div>
    );
  }

  // Default Landing Page View
  return (
    <div className="min-h-screen bg-[#0B0708] text-[#F8F3E8] flex flex-col font-sans selection:bg-[#C02636] selection:text-[#F8F3E8]">
      {/* 1. Navbar */}
      <Navbar
        trayCount={totalItemCount}
        cartTotal={cartTotal}
        onOpenTray={() => setIsTrayOpen(true)}
        onOpenReservation={() => navigateTo('book-a-table')}
        onNavigateToBookTable={() => navigateTo('book-a-table')}
        onNavigateToFullMenu={() => navigateTo('order-menu')}
        onNavigateHome={() => navigateTo('landing')}
        currentView={currentView}
      />

      <main className="flex-1">
        {/* 2. Hero */}
        <Hero
          onOpenReservation={() => navigateTo('book-a-table')}
          onNavigateToBookTable={() => navigateTo('book-a-table')}
        />

        {/* 3. Our Story */}
        <OurStory />

        {/* 4. Signature Dishes */}
        <SignatureDishes
          onAddToTray={handleAddToTrayFromLanding}
          onNavigateToFullMenu={() => navigateTo('order-menu')}
        />

        {/* Scroll-driven Malai Boti flight animation between Section 2 and Section 3 */}
        <MalaiBotiScrollTransition />

        {/* 5. Why Choose Pearl Oasis (Crossing Marquee Moving Tapes) */}
        <WhyChooseSection />

        {/* 6. Restaurant Experience & Visual Gallery */}
        <ExperienceSection
          onOpenReservation={() => navigateTo('book-a-table')}
          onNavigateToBookTable={() => navigateTo('book-a-table')}
        />

        {/* 7. Testimonials */}
        <TestimonialsSection />

        {/* 7b. The Person Behind It / Our Vision */}
        <CeoVisionSection />

        {/* 8. Location and Contact */}
        <LocationHoursSection />
      </main>

      {/* 9. Footer */}
      <Footer
        onOpenReservation={() => navigateTo('book-a-table')}
        onNavigateHome={() => navigateTo('landing')}
        currentView={currentView}
      />

      {/* Interactive Drawers & Modals (code-split & loaded only when opened) */}
      {isTrayOpen && (
        <Suspense fallback={null}>
          <OrderTrayDrawer
            isOpen={isTrayOpen}
            onClose={() => setIsTrayOpen(false)}
            items={orderItems.map((item) => ({
              id: item.cartItemId,
              name: item.name,
              portion: item.variation ? `${item.portion || ''} (${item.variation})` : item.portion,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            }))}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearTray={handleClearOrder}
            onProceedToCheckout={() => {
              setIsTrayOpen(false);
              navigateTo('checkout');
            }}
            onBrowseFullMenu={() => {
              setIsTrayOpen(false);
              navigateTo('order-menu');
            }}
          />
        </Suspense>
      )}

      {isReservationOpen && (
        <Suspense fallback={null}>
          <ReservationModal
            isOpen={isReservationOpen}
            onClose={() => setIsReservationOpen(false)}
          />
        </Suspense>
      )}

      {/* Floating Bottom-Right WhatsApp Redirect Button */}
      <a
        href={LANDING_WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Pearl Oasis on WhatsApp"
        title="Chat on WhatsApp"
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white border-2 border-[#F5C369]/60 shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_28px_rgba(37,211,102,0.45)] flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C369]"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current"
          aria-hidden="true"
        >
          <path d="M16.002 2.667C8.64 2.667 2.667 8.638 2.667 16c0 2.352.615 4.647 1.783 6.667L2.667 29.333l6.827-1.751A13.28 13.28 0 0 0 16.002 29.333C23.362 29.333 29.333 23.362 29.333 16S23.362 2.667 16.002 2.667zm0 24.442c-2.078 0-4.115-.558-5.894-1.613l-.423-.251-4.051 1.039 1.073-3.947-.276-.438a11.066 11.066 0 0 1-1.693-5.9c0-6.122 4.982-11.104 11.106-11.104 6.123 0 11.103 4.982 11.103 11.104 0 6.124-4.98 11.11-11.105 11.11zm6.091-8.323c-.334-.167-1.975-.974-2.281-1.086-.306-.111-.529-.167-.751.167-.223.334-.863 1.086-1.058 1.309-.195.223-.39.251-.724.084-.334-.167-1.41-.52-2.685-1.658-.993-.885-1.663-1.979-1.858-2.313-.195-.334-.021-.515.146-.681.15-.15.334-.39.501-.585.167-.195.223-.334.334-.557.111-.223.056-.418-.028-.585-.083-.167-.751-1.811-1.03-2.479-.271-.651-.547-.563-.751-.573l-.641-.011c-.223 0-.585.084-.891.418-.306.334-1.169 1.142-1.169 2.786s1.197 3.231 1.364 3.454c.167.223 2.356 3.597 5.708 5.044.797.344 1.42.55 1.905.704.801.255 1.53.219 2.106.133.642-.096 1.975-.808 2.253-1.588.279-.78.279-1.448.195-1.588-.083-.139-.306-.223-.64-.39z" />
        </svg>
      </a>
    </div>
    );
  };

  return (
    <>
      <RoyalRadianceLoader />
      {renderActiveView()}
    </>
  );
}
