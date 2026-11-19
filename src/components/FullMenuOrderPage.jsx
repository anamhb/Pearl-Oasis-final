import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FULL_MENU_DATA } from '../data/pearlOasisFullMenu.js';
import DishCustomizationModal from './DishCustomizationModal.jsx';
import BrandLogo from './BrandLogo.jsx';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  ShoppingBag, 
  Clock, 
  Truck,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

export default function FullMenuOrderPage({
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearOrder,
  onAddToCart,
  onProceedToCheckout,
  onBackToHome
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDishForCustomization, setActiveDishForCustomization] = useState(null);
  const [isMobileOrderOpen, setIsMobileOrderOpen] = useState(false);
  const categoryRefs = useRef({});
  const categoryNavRef = useRef(null);
  const [canCatScrollLeft, setCanCatScrollLeft] = useState(false);
  const [canCatScrollRight, setCanCatScrollRight] = useState(true);

  const updateCategoryScrollState = () => {
    if (!categoryNavRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = categoryNavRef.current;
    setCanCatScrollLeft(scrollLeft > 10);
    setCanCatScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = categoryNavRef.current;
    if (!el) return;
    updateCategoryScrollState();
    el.addEventListener('scroll', updateCategoryScrollState, { passive: true });
    window.addEventListener('resize', updateCategoryScrollState);
    return () => {
      el.removeEventListener('scroll', updateCategoryScrollState);
      window.removeEventListener('resize', updateCategoryScrollState);
    };
  }, []);

  const handleCategoryScroll = (direction) => {
    if (!categoryNavRef.current) return;
    const scrollAmount = 260;
    categoryNavRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  const totalItemsCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const orderSubtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Filtered categories & items
  const filteredCategories = useMemo(() => {
    return FULL_MENU_DATA.map((cat) => {
      const items = cat.items.filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description && item.description.toLowerCase().includes(query);
        const matchesPortion = item.portion && item.portion.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesPortion;
      });
      return { ...cat, items };
    }).filter((cat) => {
      if (selectedCategory !== 'all' && cat.id !== selectedCategory) {
        return false;
      }
      return cat.items.length > 0;
    });
  }, [searchQuery, selectedCategory]);

  const scrollToCategory = (catId) => {
    setSelectedCategory(catId);
    if (categoryRefs.current[catId]) {
      categoryRefs.current[catId].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0708] text-[#F8F3E8] flex flex-col font-sans selection:bg-[#C02636] selection:text-[#F8F3E8]">
      
      {/* 1. Top Bar & Branding Navigation */}
      <header className="sticky top-0 z-40 bg-[#140608]/95 backdrop-blur-md border-b border-[#C9A45C]/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Brand Logo (Back button moved below navbar) */}
          <button
            onClick={onBackToHome}
            className="flex items-center group focus:outline-none cursor-pointer"
            aria-label="Pearl Oasis Home"
          >
            <BrandLogo variant="navbar" className="scale-90 sm:scale-100 origin-left" />
          </button>

          {/* Opening & Pickup Indicator */}
          <div className="hidden md:flex items-center gap-4 text-xs sm:text-sm text-[#D8C5B8]">
            <div className="flex items-center gap-2 bg-[#18080B]/80 px-3.5 py-1.5 rounded-full border border-[#C9A45C]/20">
              <Clock className="w-4 h-4 text-[#F5C369]" />
              <span>Open Daily: 11:00 AM – 11:00 PM (Friday Break: 1:00 PM – 2:30 PM)</span>
            </div>
            <div className="flex items-center gap-2 bg-[#18080B]/80 px-3.5 py-1.5 rounded-full border border-[#C9A45C]/20">
              <Truck className="w-4 h-4 text-[#F5C369]" />
              <span>Delivery & Pickup Available</span>
            </div>
          </div>

          {/* Mobile Order Button */}
          <button
            onClick={() => setIsMobileOrderOpen(true)}
            className="lg:hidden relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-[#F8F3E8] bg-gradient-to-r from-[#8A1826] to-[#C02636] hover:brightness-110 transition-all shadow-md cursor-pointer"
            aria-label="View Order"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order</span>
            {totalItemsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#18080B] text-[#F5C369] text-xs font-black flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>

        {/* Search & Back Button Subheader (Today ASAP replaced with Back button) */}
        <div className="border-t border-[#381017] bg-[#18080B]/90 px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-3">
            
            {/* Back button placed where Today ASAP was positioned */}
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#F5C369] hover:text-white bg-[#240C11] hover:bg-[#381017] border border-[#C9A45C]/40 hover:border-[#F5C369] transition-all cursor-pointer shadow-sm shrink-0 active:scale-95"
              aria-label="Back to Restaurant Website"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Search Input Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4.5 h-4.5 text-[#C9A45C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all dishes, karahis, pizzas, steaks..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#120709] border border-[#C9A45C]/35 rounded-full text-xs sm:text-sm text-[#F8F3E8] placeholder-[#D8C5B8]/70 focus:outline-none focus:border-[#F5C369] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D8C5B8] hover:text-white cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Category Horizontal Scrolling Navigation Bar with Left & Right Arrow Buttons */}
        <div className="border-t border-[#381017]/80 bg-[#140608] px-3 sm:px-6 lg:px-8 py-2.5 relative">
          <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3">
            
            {/* Left Category Scroll Arrow */}
            <button
              type="button"
              onClick={() => handleCategoryScroll('prev')}
              disabled={!canCatScrollLeft}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#18080B] hover:bg-[#F5C369] text-[#F5C369] hover:text-[#18080B] border border-[#C9A45C]/50 hover:border-[#F5C369] flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer shadow-sm ${
                !canCatScrollLeft ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-90 hover:opacity-100 hover:scale-105 active:scale-95'
              }`}
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Horizontal Tabs Row (One single line, never wraps, touch scrolling preserved) */}
            <div 
              ref={categoryNavRef}
              className="flex-1 flex items-center gap-2 sm:gap-2.5 overflow-x-auto scroll-smooth whitespace-nowrap flex-nowrap no-scrollbar py-1"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-[#8A1826] to-[#C02636] text-[#F8F3E8] shadow-sm'
                    : 'text-[#F8F3E8]/90 hover:text-white hover:bg-[#240C11] bg-[#18080B]/60 border border-[#C9A45C]/25'
                }`}
              >
                All Categories
              </button>
              {FULL_MENU_DATA.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-[#8A1826] to-[#C02636] text-[#F8F3E8] shadow-sm'
                      : 'text-[#F8F3E8]/90 hover:text-white hover:bg-[#240C11] bg-[#18080B]/60 border border-[#C9A45C]/25'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Right Category Scroll Arrow */}
            <button
              type="button"
              onClick={() => handleCategoryScroll('next')}
              disabled={!canCatScrollRight}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#18080B] hover:bg-[#F5C369] text-[#F5C369] hover:text-[#18080B] border border-[#C9A45C]/50 hover:border-[#F5C369] flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer shadow-sm ${
                !canCatScrollRight ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'opacity-90 hover:opacity-100 hover:scale-105 active:scale-95'
              }`}
              aria-label="Scroll categories right"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>

          </div>
        </div>
      </header>

      {/* 2. Main Ordering Layout: Left = Menu Cards, Right = Sticky "Your Order" panel */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-24 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Menu Categories & Dish Cards (approx 7-8 columns on desktop) */}
          <main className="lg:col-span-8 space-y-12">
            <h1 className="sr-only">Pearl Oasis Full Dining Menu and Online Ordering</h1>
            
            {filteredCategories.length === 0 ? (
              <div className="text-center py-20 bg-[#18080B]/80 rounded-2xl border border-[#C9A45C]/30 p-8">
                <Search className="w-12 h-12 text-[#C9A45C]/50 mx-auto mb-3" />
                <h2 className="font-serif-heading text-2xl sm:text-3xl text-[#F5C369]">No dishes found</h2>
                <p className="text-xs sm:text-sm text-[#D8C5B8] mt-1 max-w-md mx-auto">
                  We couldn't find any dishes matching "{searchQuery}". Try searching for karahi, boti, handi, pizza, or soup.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#8A1826] to-[#C02636] hover:brightness-110 text-[#F8F3E8] transition-all cursor-pointer shadow-md"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <section
                  key={cat.id}
                  ref={(el) => (categoryRefs.current[cat.id] = el)}
                  className="scroll-mt-44 sm:scroll-mt-48 space-y-4"
                >
                  {/* Category Title & Badge */}
                  <div className="border-b border-[#C9A45C]/30 pb-3 flex items-end justify-between">
                    <div>
                      <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl text-[#F5C369] font-normal">
                        {cat.name}
                      </h2>
                      {cat.description && (
                        <p className="text-xs sm:text-sm text-[#D8C5B8] mt-1">
                          {cat.description}
                        </p>
                      )}
                    </div>
                    {cat.badge && (
                      <span className="hidden sm:inline-block text-xs uppercase tracking-wider text-[#F5C369] bg-[#240C11] px-3 py-1 rounded-full border border-[#C9A45C]/30 font-semibold shrink-0">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  {/* 2-Column Grid of Dish Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {cat.items.map((dish) => {
                      const displayPrice = dish.hasVariations
                        ? `From Rs. ${dish.variations[0].price.toLocaleString()}`
                        : `Rs. ${dish.price.toLocaleString()}`;

                      return (
                        <article
                          key={dish.id}
                          onClick={() => setActiveDishForCustomization({ ...dish, category: cat.name })}
                          className="group relative bg-[#18080B]/95 hover:bg-[#200B10] border border-[#C9A45C]/25 hover:border-[#F5C369] rounded-xl p-3.5 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-200 hover:shadow-[0_8px_24px_rgba(138,24,38,0.2)] cursor-pointer"
                          aria-label={`View and customize ${dish.name}`}
                        >
                          {/* Dish Information */}
                          <div className="flex-1 min-w-0 pr-1">
                            <h3 className="font-serif-heading text-base sm:text-lg md:text-xl text-[#F8F3E8] group-hover:text-[#F5C369] transition-colors leading-snug font-bold">
                              {dish.name}
                            </h3>

                            {/* Portion or includes snippet */}
                            {dish.portion && (
                              <p className="text-xs sm:text-sm text-[#D8C5B8] mt-1 font-medium truncate">
                                {dish.portion}
                              </p>
                            )}

                            {dish.description && (
                              <p className="text-xs sm:text-sm text-[#D8C5B8]/85 mt-1 line-clamp-2 leading-relaxed font-light">
                                {dish.description}
                              </p>
                            )}

                            {/* Price display */}
                            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                              <span className="font-serif-heading text-base sm:text-lg text-[#F5C369] font-bold">
                                {displayPrice}
                              </span>
                              {dish.hasVariations && (
                                <span className="text-xs text-[#D8C5B8]">
                                  (Options available)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Dish Thumbnail + Overlaid Round "+" Button */}
                          {dish.image ? (
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-[#C9A45C]/30 bg-[#120709]">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDishForCustomization({ ...dish, category: cat.name });
                                }}
                                className="absolute top-1.5 right-1.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#18080B]/90 backdrop-blur-xs hover:bg-gradient-to-r hover:from-[#8A1826] hover:to-[#C02636] text-[#F5C369] hover:text-[#F8F3E8] border border-[#C9A45C]/60 hover:border-[#F5C369] flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
                                aria-label={`Add ${dish.name} to order`}
                              >
                                <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4]" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDishForCustomization({ ...dish, category: cat.name });
                              }}
                              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#240C11] hover:bg-gradient-to-r hover:from-[#8A1826] hover:to-[#C02636] text-[#F5C369] hover:text-[#F8F3E8] border border-[#C9A45C]/40 hover:border-[#F5C369] flex items-center justify-center shrink-0 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                              aria-label={`Add ${dish.name} to order`}
                            >
                              <Plus className="w-5 h-5 stroke-[2.2]" />
                            </button>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))
            )}

          </main>

          {/* Right Column: Sticky "Your order" Desktop Panel */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-36">
            <div className="bg-[#140608] border border-[#C9A45C]/35 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-160px)]">
              
              {/* Panel Header */}
              <div className="p-5 bg-[#18080B] border-b border-[#C9A45C]/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#F5C369]" />
                  <h3 className="font-serif-heading text-xl sm:text-2xl text-[#F5C369]">Your order</h3>
                </div>
                {orderItems.length > 0 && (
                  <button
                    onClick={onClearOrder}
                    className="text-xs text-[#D8C5B8] hover:text-[#F5C369] transition-colors cursor-pointer font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3.5">
                {orderItems.length === 0 ? (
                  <div className="text-center py-12 px-4 space-y-2.5">
                    <div className="w-12 h-12 rounded-full bg-[#18080B] border border-[#C9A45C]/30 flex items-center justify-center mx-auto text-[#C9A45C]">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <p className="text-base font-semibold text-[#F8F3E8]">Your order is empty</p>
                    <p className="text-xs sm:text-sm text-[#D8C5B8] max-w-xs mx-auto leading-relaxed">
                      Select dishes from the menu to start building your order.
                    </p>
                  </div>
                ) : (
                  orderItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="bg-[#18080B]/90 p-4 rounded-xl border border-[#C9A45C]/25 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-[#F8F3E8] leading-tight">
                            {item.name}
                          </h4>
                          {item.variation && (
                            <span className="inline-block text-xs text-[#F5C369] font-medium bg-[#240C11] px-2 py-0.5 rounded mt-1 border border-[#C9A45C]/20">
                              {item.variation}
                            </span>
                          )}
                          {item.specialNotes && (
                            <p className="text-xs text-[#D8C5B8] italic mt-1 line-clamp-2">
                              Note: {item.specialNotes}
                            </p>
                          )}
                        </div>
                        <span className="font-serif-heading text-sm sm:text-base text-[#F5C369] font-bold shrink-0">
                          Rs. {item.totalPrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Quantity adjustment & Remove */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-[#381017]">
                        <span className="text-xs text-[#D8C5B8]">
                          Rs. {item.unitPrice.toLocaleString()} each
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-[#240C11] px-2.5 py-1 rounded-full border border-[#C9A45C]/30">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="text-[#C9A45C] hover:text-white p-0.5 cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs sm:text-sm font-bold text-[#F8F3E8] w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="text-[#C9A45C] hover:text-white p-0.5 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="p-1 text-[#D8C5B8] hover:text-red-400 transition-colors cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Panel Footer Total & Proceed Button */}
              {orderItems.length > 0 && (
                <div className="p-5 bg-[#18080B] border-t border-[#C9A45C]/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-[#F8F3E8]">Total</span>
                    <span className="font-serif-heading text-2xl sm:text-3xl text-[#F5C369] font-bold">
                      Rs. {orderSubtotal.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onProceedToCheckout}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:from-[#9B1C28] hover:to-[#D12B3D] hover:brightness-110 text-[#F8F3E8] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-[0_4px_20px_rgba(186,37,53,0.5)] flex items-center justify-center gap-2 active:scale-95 cursor-pointer group"
                  >
                    <span>Proceed</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

            </div>
          </aside>

        </div>
      </div>

      {/* 3. Mobile Sticky Order Bar & Slide-up Modal */}
      {orderItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#140608]/95 backdrop-blur-md border-t border-[#C9A45C]/30 shadow-2xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-[#D8C5B8]">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
              </span>
              <span className="font-serif-heading text-xl text-[#F5C369] font-bold leading-none">
                Rs. {orderSubtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMobileOrderOpen(true)}
                className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#F5C369] border border-[#C9A45C]/40 bg-[#18080B] cursor-pointer"
              >
                View Items
              </button>
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F8F3E8] bg-gradient-to-r from-[#8A1826] to-[#C02636] hover:brightness-110 shadow-md cursor-pointer"
              >
                <span>Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Slide-Up Order Drawer */}
      {isMobileOrderOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#140608] h-full shadow-2xl flex flex-col justify-between border-l border-[#C9A45C]/35">
            {/* Header */}
            <div className="p-4 bg-[#18080B] border-b border-[#C9A45C]/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#F5C369]" />
                <h3 className="font-serif-heading text-xl text-[#F5C369]">Your order</h3>
              </div>
              <button
                onClick={() => setIsMobileOrderOpen(false)}
                className="p-1 text-[#F5C369] hover:text-white cursor-pointer"
                aria-label="Close order drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {orderItems.length === 0 ? (
                <p className="text-center text-sm text-[#D8C5B8] py-8">Your order is empty.</p>
              ) : (
                orderItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="bg-[#18080B] p-4 rounded-xl border border-[#C9A45C]/25 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-[#F8F3E8] leading-tight">{item.name}</h4>
                        {item.variation && (
                          <span className="inline-block text-xs text-[#F5C369] bg-[#240C11] px-2 py-0.5 rounded mt-1 border border-[#C9A45C]/20">
                            {item.variation}
                          </span>
                        )}
                        {item.specialNotes && (
                          <p className="text-xs text-[#D8C5B8] italic mt-1">Note: {item.specialNotes}</p>
                        )}
                      </div>
                      <span className="font-serif-heading text-sm sm:text-base text-[#F5C369] font-bold">
                        Rs. {item.totalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-[#381017]">
                      <span className="text-xs text-[#D8C5B8]">
                        Rs. {item.unitPrice.toLocaleString()} each
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-[#240C11] px-2.5 py-1 rounded-full border border-[#C9A45C]/30">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                            className="text-[#C9A45C] p-0.5 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs sm:text-sm font-bold text-[#F8F3E8] w-4 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                            className="text-[#C9A45C] p-0.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.cartItemId)}
                          className="p-1 text-[#D8C5B8] hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {orderItems.length > 0 && (
              <div className="p-4 bg-[#18080B] border-t border-[#C9A45C]/30 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-[#F8F3E8]">Total</span>
                  <span className="font-serif-heading text-2xl text-[#F5C369] font-bold">
                    Rs. {orderSubtotal.toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileOrderOpen(false);
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:brightness-110 text-[#F8F3E8] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Dish Customisation Dialog */}
      <DishCustomizationModal
        dish={activeDishForCustomization}
        isOpen={!!activeDishForCustomization}
        onClose={() => setActiveDishForCustomization(null)}
        onAddToCart={onAddToCart}
      />
    </div>
  );
}
