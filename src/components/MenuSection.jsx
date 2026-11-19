import React, { useState, useMemo } from 'react';
import { MENU_CATEGORIES } from '../data/restaurantData.js';
import { Plus, Check, Download, ArrowRight } from 'lucide-react';
import feastFlatlayImg from '../assets/images/opt/hero-oasis-feast.webp';
import menuPdf from '../assets/images/Pearl-Oasis-Menu.pdf';

export default function MenuSection({ onAddToTray, onNavigateToFullMenu }) {
  const [addedMap, setAddedMap] = useState({});

  // Curate premier 4 dishes for the single staggered row (one from each culinary pillar)
  const firstRowDishes = useMemo(() => {
    return MENU_CATEGORIES.map((cat) => {
      const item = cat.items[0];
      return {
        id: `row1-${cat.id}-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        categoryId: cat.id,
        categoryTitle: cat.title,
        name: item.name,
        portion: item.portion,
        heat: item.heat,
        desc: item.desc,
        price: item.price || null,
        image: item.image || cat.image,
      };
    });
  }, []);

  const handleAddDish = (dish, e) => {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    if (onAddToTray) {
      onAddToTray({
        id: dish.id || `dish-${dish.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: dish.name,
        category: dish.categoryTitle || (typeof e === 'string' ? e : 'Specialty'),
        portion: dish.portion,
        prepTime: '15–20 mins',
      });
    }
    setAddedMap((prev) => ({ ...prev, [dish.name]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [dish.name]: false }));
    }, 1800);
  };

  return (
    <section id="menu" className="relative py-24 sm:py-32 bg-[#0B0708] overflow-hidden border-b border-[#C9A45C]/20">
      {/* Background Dark Marble / Ambient Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,18,25,0.45)_0%,rgba(11,7,8,0.98)_80%)] pointer-events-none" />

      {/* Decorative Culinary Garnishes at Edges */}
      <div className="absolute -left-24 -top-12 w-72 h-72 rounded-full overflow-hidden opacity-25 pointer-events-none border border-[#C9A45C]/30 blur-xs">
        <img src={feastFlatlayImg} alt="" width={1279} height={714} loading="lazy" decoding="async" className="w-full h-full object-cover scale-125" />
      </div>
      <div className="absolute -right-24 -bottom-12 w-72 h-72 rounded-full overflow-hidden opacity-25 pointer-events-none border border-[#C9A45C]/30 blur-xs">
        <img src={feastFlatlayImg} alt="" width={1279} height={714} loading="lazy" decoding="async" className="w-full h-full object-cover scale-125 rotate-90" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18 flex flex-col items-center">
          
          {/* Centered Ornate Filigree Flourish SVG */}
          <div className="w-48 sm:w-60 h-8 flex items-center justify-center text-[#C9A45C] opacity-90 mb-3" aria-hidden="true">
            <svg viewBox="0 0 200 30" className="w-full h-full fill-none stroke-current" strokeWidth="1.2">
              <path d="M10 15 Q50 15 80 5 Q95 0 100 15 Q105 0 120 5 Q150 15 190 15" strokeLinecap="round" />
              <path d="M40 15 Q70 24 95 18 L100 24 L105 18 Q130 24 160 15" strokeLinecap="round" />
              <circle cx="100" cy="15" r="2.5" fill="#F5C369" />
              <circle cx="85" cy="15" r="1.5" fill="#C9A45C" />
              <circle cx="115" cy="15" r="1.5" fill="#C9A45C" />
            </svg>
          </div>

          {/* Eyebrow */}
          <p className="text-xs uppercase tracking-[0.28em] text-[#F5C369] font-semibold mb-2.5">
            OUR MENU
          </p>

          {/* Main Headline */}
          <h2 className="font-serif-heading text-4xl sm:text-6xl lg:text-7xl text-[#F8F3E8] font-normal leading-tight mb-4">
            Explore Our Menu
          </h2>

          {/* Subtitle / Description */}
          <p className="font-sans text-sm sm:text-base md:text-lg text-[#D8C5B8] font-light max-w-2xl leading-relaxed">
            From traditional Pakistani favourites to authentic Chinese specialties and artisan burgers, discover dishes crafted for every craving.
          </p>
        </div>

        {/* First Row of Staggered Cards (4 cards per row on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8 pb-16 lg:pb-24">
          {firstRowDishes.map((dish, index) => {
            const isAdded = !!addedMap[dish.name];
            // Alternate vertical positions across the 4-column desktop grid to create a subtle staggered rhythm
            const isStaggered = (index % 4) % 2 === 1;

            return (
              <div
                key={dish.id}
                className={`transition-transform duration-500 ease-out ${
                  isStaggered ? 'lg:translate-y-8' : 'lg:translate-y-0'
                }`}
              >
                <article
                  tabIndex={0}
                  role="region"
                  aria-label={`${dish.name} - ${dish.categoryTitle}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAddDish(dish);
                    }
                  }}
                  className="group relative flex flex-col h-full bg-[#18080B]/95 rounded-2xl overflow-hidden border border-[#C9A45C]/30 hover:border-[#F5C369] shadow-xl hover:shadow-[0_16px_36px_rgba(0,0,0,0.7),0_0_24px_rgba(138,24,38,0.25)] transition-all duration-300 ease-out motion-safe:hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C369]"
                >
                  {/* Top: Large, Prominent Food Image */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#120709]">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out motion-safe:group-hover:scale-108"
                      loading="lazy"
                    />
                    {/* Dark Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#18080B] via-transparent to-transparent opacity-85" />

                    {/* Category Badge Floating Top-Left */}
                    <div className="absolute top-3 left-3 bg-[#240C11]/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider text-[#F5C369] border border-[#C9A45C]/30 font-medium shadow-xs">
                      {dish.categoryTitle}
                    </div>

                    {/* Portion Badge Floating Bottom-Right */}
                    {dish.portion && (
                      <div className="absolute bottom-2.5 right-3 bg-[#120709]/85 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-[#D8C5B8] border border-[#C9A45C]/20">
                        {dish.portion}
                      </div>
                    )}
                  </div>

                  {/* Card Content with Generous Spacing */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-4">
                    
                    <div className="space-y-2">
                      {/* Dish Name & Price Header */}
                      <div className="flex flex-col space-y-1.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="font-serif-heading text-xl sm:text-2xl text-[#F8F3E8] group-hover:text-[#F5C369] transition-colors leading-snug">
                            {dish.name}
                          </h3>
                          {/* Single price badge */}
                          {dish.price && !dish.price.includes('|') && (
                            <span className="font-serif-heading text-lg text-[#F5C369] shrink-0 font-medium">
                              {dish.price}
                            </span>
                          )}
                        </div>

                        {/* Dual variation prices */}
                        {dish.price && dish.price.includes('|') && (
                          <div className="flex flex-wrap items-center gap-1 pt-0.5">
                            <span className="text-xs sm:text-[13px] font-serif-heading font-medium text-[#F5C369] bg-[#240C11] px-2.5 py-0.5 rounded-md border border-[#C9A45C]/40 shadow-xs whitespace-normal">
                              {dish.price}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {dish.desc && (
                        <p className="text-xs text-[#D8C5B8]/80 font-light leading-relaxed line-clamp-3">
                          {dish.desc}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Row: Heat Note & Quick Add Button */}
                    <div className="pt-3 border-t border-[#381017] flex items-center justify-between gap-3">
                      <span className="text-[11px] text-[#D8C5B8] font-light truncate">
                        {dish.heat}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleAddDish(dish, e)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                          isAdded
                            ? 'bg-[#381017] text-[#F5C369] border border-[#F5C369]/60'
                            : 'bg-gradient-to-r from-[#8A1826]/70 to-[#C02636]/70 hover:from-[#8A1826] hover:to-[#C02636] text-[#F8F3E8] border border-[#C9A45C]/40 active:scale-95 shadow-sm hover:shadow-[0_4px_12px_rgba(186,37,53,0.35)]'
                        }`}
                        aria-label={`Add ${dish.name} to order tray`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* Action Buttons Centered at Bottom: View Full Menu & Download Menu */}
        <div className="text-center pt-8 border-t border-[#381017]/80 flex flex-col items-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={onNavigateToFullMenu}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-9 py-4 text-xs sm:text-sm font-semibold tracking-wider text-[#F8F3E8] bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:from-[#9B1C28] hover:to-[#D12B3D] hover:brightness-110 rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(186,37,53,0.45)] hover:shadow-[0_12px_40px_rgba(186,37,53,0.65)] hover:scale-105 active:scale-95 cursor-pointer group"
            >
              <span>View the Full Menu</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={menuPdf}
              download="Pearl-Oasis-Menu.pdf"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 py-4 text-xs sm:text-sm font-semibold tracking-wider text-[#F5C369] hover:text-[#F8F3E8] bg-[#18080B]/90 hover:bg-[#280D12] border border-[#C9A45C]/50 hover:border-[#F5C369] rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.45)] hover:shadow-[0_12px_40px_rgba(186,37,53,0.3)] hover:scale-105 active:scale-95 cursor-pointer group"
              aria-label="Download Pearl Oasis Menu PDF"
            >
              <Download className="w-4 h-4 text-[#F5C369] group-hover:text-[#F8F3E8] transition-colors" />
              <span>Download Menu (PDF)</span>
            </a>
          </div>
          <p className="text-xs text-[#D8C5B8] mt-3.5 font-light">
            Browse our complete categorized dining catalogue online or download our official full menu PDF.
          </p>
        </div>

      </div>
    </section>
  );
}
