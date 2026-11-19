import React, { useState } from 'react';
import { Plus, Check, Download, ArrowRight } from 'lucide-react';

import friedRiceImg from '../assets/images/opt/chicken-fried-rice.webp';
import chowMeinImg from '../assets/images/opt/chowmen.webp';
import pastaImg from '../assets/images/opt/pasta.webp';
import malaiBotiImg from '../assets/images/opt/malai-boti.webp';
import wrapImg from '../assets/images/opt/wrap.webp';
import soupImg from '../assets/images/opt/chicken-soup.webp';
import menuPdf from '../assets/images/Pearl-Oasis-Menu.pdf';

export default function SignatureDishes({ onAddToTray, onNavigateToFullMenu }) {
  const [addedMap, setAddedMap] = useState({});

  const specialties = [
    {
      id: "specialty-fried-rice",
      name: "Chicken Fried Rice",
      menuMatchName: "Chicken Fried Rice",
      category: "Chinese Rice",
      portion: "Platter (Serves 2)",
      prepTime: "12 mins",
      description: "Wok-tossed fragrant jasmine rice with shredded chicken, scrambled eggs, and spring scallions.",
      image: friedRiceImg,
      alt: "Pearl Oasis Chicken Fried Rice specialty dish",
    },
    {
      id: "specialty-chow-mein",
      name: "Chicken Chow Mein",
      menuMatchName: "Chicken Chow Mein",
      category: "Chinese Wok",
      portion: "Wok Skillet Portion",
      prepTime: "14 mins",
      description: "Stir-fried noodles with chicken strips, crisp cabbage, julienned peppers, and savory dark soy.",
      image: chowMeinImg,
      alt: "Pearl Oasis Chicken Chow Mein specialty",
    },
    {
      id: "specialty-alfredo-pasta",
      name: "Alfredo Pasta",
      menuMatchName: "Alfredo Pasta",
      category: "Pasta & Wraps",
      portion: "Rich Skillet Bowl",
      prepTime: "15 mins",
      description: "Fettuccine smothered in a rich velvety garlic parmesan cream with seasoned chicken strips.",
      image: pastaImg,
      alt: "Pearl Oasis creamy Alfredo Pasta specialty",
    },
    {
      id: "specialty-malai-boti",
      name: "Chicken Malai Boti",
      menuMatchName: "Chicken Malai Boti",
      category: "Charcoal BBQ",
      portion: "10 Skewered Pieces",
      prepTime: "18 mins",
      description: "Melt-in-your-mouth chicken cubes marinated in fresh cream, cardamom, and gentle spices.",
      image: malaiBotiImg,
      alt: "Pearl Oasis Chicken Malai Boti specialty",
    },
    {
      id: "specialty-lebanese-wrap",
      name: "Lebanese Wrap",
      menuMatchName: "Lebanese Wrap",
      category: "Pasta & Wraps",
      portion: "Single Roll with Dip",
      prepTime: "10 mins",
      description: "Toasted pita roll loaded with spiced grilled chicken, house garlic toum sauce, and crisp pickles.",
      image: wrapImg,
      alt: "Pearl Oasis artisan Lebanese Wrap specialty",
    },
    {
      id: "specialty-corn-soup",
      name: "Chicken Corn Soup",
      menuMatchName: "Chicken Corn Soup",
      category: "Soups",
      portion: "Serves 2 Persons",
      prepTime: "10 mins",
      description: "Velvety simmered chicken broth infused with sweet sweetcorn, delicate egg ribbons, and white pepper.",
      image: soupImg,
      alt: "Pearl Oasis Chicken Corn Soup specialty",
    },
  ];

  const handleAddDish = (dish, e) => {
    if (e) e.stopPropagation();
    if (onAddToTray) {
      onAddToTray({
        id: dish.id,
        name: dish.menuMatchName || dish.name,
        category: dish.category,
        portion: dish.portion,
        prepTime: dish.prepTime,
      });
    }
    setAddedMap((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [dish.id]: false }));
    }, 1800);
  };

  return (
    <section id="signatures" className="relative py-16 sm:py-24 lg:py-28 bg-[#0B0708] overflow-hidden border-b border-[#C9A45C]/20">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(59,18,25,0.5)_0%,rgba(11,7,8,1)_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-64 bg-[#8A1826]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Ornate Filigree Flourish (restored as requested) */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 flex flex-col items-center">
          
          {/* Centered Ornate Filigree Flourish SVG */}
          <div className="w-48 sm:w-64 h-8 flex items-center justify-center text-[#C9A45C] opacity-90 mb-3" aria-hidden="true">
            <svg viewBox="0 0 200 30" className="w-full h-full fill-none stroke-current" strokeWidth="1.2">
              <path d="M10 15 Q50 15 80 5 Q95 0 100 15 Q105 0 120 5 Q150 15 190 15" strokeLinecap="round" />
              <path d="M40 15 Q70 24 95 18 L100 24 L105 18 Q130 24 160 15" strokeLinecap="round" />
              <circle cx="100" cy="15" r="2.5" fill="#F5C369" />
              <circle cx="85" cy="15" r="1.5" fill="#C9A45C" />
              <circle cx="115" cy="15" r="1.5" fill="#C9A45C" />
            </svg>
          </div>

          {/* Eyebrow */}
          <p className="text-xs uppercase tracking-[0.28em] text-[#F5C369] font-semibold mb-2">
            SIGNATURE DISHES
          </p>

          {/* Main Headline */}
          <h2 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl text-[#F8F3E8] font-normal leading-tight">
            Our Most Popular Dishes
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#D8C5B8] font-light mt-3 max-w-xl">
            Tap on any dish to add it directly to your order. Fresh, delicious, and made for everyone to enjoy!
          </p>
        </div>

        {/* 6 Circular Dishes Container (matching requested dishes and circular presentation) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-4 xl:gap-6 max-w-7xl mx-auto">
          {specialties.map((dish) => {
            const isAdded = !!addedMap[dish.id];
            const isFourthCard = dish.id === 'specialty-malai-boti';

            return (
              <div
                key={dish.id}
                role="button"
                tabIndex={0}
                aria-label={`Add ${dish.name} to order tray`}
                data-specialty-card={dish.id}
                onClick={(e) => handleAddDish(dish, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleAddDish(dish, e);
                  }
                }}
                className="group flex flex-col items-center cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C369] rounded-2xl"
              >
                {/* 1. Circular Dish Image with Glowing Gold Border */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full p-[3px] bg-gradient-to-tr from-[#C9A45C] via-[#F5C369] to-[#E8CC8B] shadow-[0_0_20px_rgba(245,195,105,0.4),0_10px_25px_rgba(0,0,0,0.85)] group-hover:shadow-[0_0_28px_rgba(245,195,105,0.7),0_14px_30px_rgba(186,37,53,0.4)] group-hover:scale-105 transition-transform duration-500 ease-out">
                  
                  {/* Inner Dark Rim */}
                  <div 
                    id={isFourthCard ? "malai-boti-target-slot" : undefined}
                    className="w-full h-full rounded-full overflow-hidden bg-[#18080B] ring-2 ring-black/80 relative flex items-center justify-center"
                  >
                    {!isFourthCard ? (
                      <img
                        src={dish.image}
                        alt={dish.alt}
                        width={436}
                        height={573}
                        className="w-full h-full object-cover object-center scale-110 group-hover:scale-115 transition-transform duration-700 ease-out"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      /* Image removed from the 4th circle card; target slot waiting for animated Malai Boti dish */
                      <div className="w-full h-full bg-[#18080B] flex items-center justify-center">
                        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(138,24,38,0.2)_0%,transparent_70%)] pointer-events-none" />
                      </div>
                    )}
                  </div>

                  {/* Gentle Inner Radial Vignette */}
                  <div className="absolute inset-[3px] rounded-full pointer-events-none bg-[radial-gradient(circle_at_50%_50%,transparent_65%,rgba(0,0,0,0.45)_100%)]" />

                  {/* Subtle Quick-Add Floating Indicator on Hover */}
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="p-2.5 rounded-full bg-[#8A1826] text-[#F8F3E8] border border-[#F5C369] shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      {isAdded ? (
                        <Check className="w-5 h-5 text-[#F5C369]" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </div>

                {/* 2. Dark Burgundy Pill Card with Subtle Crimson Outline */}
                <div className="mt-3 sm:mt-4 w-full max-w-[165px]">
                  <div
                    className={`py-2 px-2 sm:px-3 rounded-2xl text-center border transition-all duration-300 backdrop-blur-sm shadow-[0_6px_20px_rgba(0,0,0,0.6)] ${
                      isAdded
                        ? 'border-[#F5C369] bg-[#381017] shadow-[0_0_15px_rgba(245,195,105,0.35)]'
                        : 'border-[#8A1826]/75 bg-gradient-to-b from-[#1C070B]/95 to-[#120508]/95 group-hover:border-[#F5C369]/60 group-hover:from-[#2A0C11] group-hover:to-[#18080B]'
                    }`}
                  >
                    <span className="font-serif-heading text-xs sm:text-sm xl:text-base text-[#F8F3E8] group-hover:text-[#F5C369] font-medium tracking-wide transition-colors leading-tight line-clamp-1">
                      {dish.name}
                    </span>
                  </div>
                </div>

                {/* Mobile Order Feedback Badge */}
                {isAdded && (
                  <div className="mt-1 text-[11px] text-[#F5C369] font-medium tracking-wider flex items-center gap-1 animate-fade-in">
                    <Check className="w-3 h-3" /> Added to Tray
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons Centered at Bottom: View Full Menu & Download Menu */}
        <div className="text-center mt-12 sm:mt-14 pt-8 border-t border-[#381017]/80 flex flex-col items-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            <button
              type="button"
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
