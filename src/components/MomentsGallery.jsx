import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

// Optimized WebP Pearl Oasis photography assets (unused large imports removed)
import diningHallImg from '../assets/images/opt/second-section.webp';
import interiorImg from '../assets/images/opt/warm-modern-interior.webp';
import card1Img from '../assets/images/opt/newcard1.webp';
import card2Img from '../assets/images/opt/card2.webp';
import card3Img from '../assets/images/opt/card3.webp';
import card4Img from '../assets/images/opt/card4.webp';
import card5Img from '../assets/images/opt/card5.webp';
import card6Img from '../assets/images/opt/card6.webp';
import card7Img from '../assets/images/opt/card7.webp';

// Flat catalog of all moments with 100% accurate photo descriptions matching image contents
export const MOMENTS_ITEMS = [
  {
    id: 'moment-guest-dining',
    title: 'Guest Dining Experience',
    category: 'Dining Atmosphere',
    caption: 'Patrons enjoying comfortable indoor dining surrounded by artistic wall calligraphy.',
    image: card1Img,
    width: 920,
    height: 518,
  },
  {
    id: 'moment-family-gathering',
    title: 'Family & Friends Gathering',
    category: 'Hospitality',
    caption: 'Warm gatherings of families and friends sharing freshly prepared meals.',
    image: card2Img,
    width: 640,
    height: 862,
  },
  {
    id: 'moment-hall',
    title: 'Main Dining Hall',
    category: 'Restaurant Interior',
    caption: 'Spacious main dining hall with golden chandeliers and plush booth seating.',
    image: diningHallImg,
    width: 640,
    height: 854,
  },
  {
    id: 'moment-interior',
    title: 'Warm Ambient Lighting',
    category: 'Atmosphere',
    caption: 'Glowing ambient lighting and elegant modern wood paneling throughout the hall.',
    image: interiorImg,
    width: 780,
    height: 1040,
  },
  {
    id: 'moment-hospitality-team',
    title: 'Signature Platter Service',
    category: 'Hospitality Team',
    caption: 'Attentive Pearl Oasis hosts presenting freshly prepared BBQ skewers and aromatic rice platters.',
    image: card3Img,
    width: 640,
    height: 635,
  },
  {
    id: 'moment-patio',
    title: 'Rooftop Outdoor Patio',
    category: 'Outdoor Seating',
    caption: 'Open-air rooftop seating area with green turf and comfortable wicker tables.',
    image: card4Img,
    width: 640,
    height: 640,
  },
  {
    id: 'moment-service',
    title: 'Dedicated Table Service',
    category: 'Friendly Staff',
    caption: 'Attentive service staff serving piping hot naans and freshly cooked Karahi to guests.',
    image: card5Img,
    width: 640,
    height: 862,
  },
  {
    id: 'moment-building-night',
    title: 'Illuminated Restaurant Facade',
    category: 'Night View',
    caption: 'Pearl Oasis Restaurant glowing brightly along the Kohat City Centre road at night.',
    image: card6Img,
    width: 382,
    height: 510,
  },
  {
    id: 'moment-fresh-karahi',
    title: 'Special Fresh Karahi',
    category: 'Pakistani Cuisine',
    caption: 'A sizzling hot Karahi prepared with tender meat, fresh ginger juliennes, and coriander.',
    image: card7Img,
    width: 382,
    height: 510,
  },
];

// Curated sequence of columns: Balanced standalone and stacked pairs with refined proportions
export const GALLERY_COLUMNS = [
  {
    id: 'col-1',
    type: 'standalone',
    itemIndex: 0,
    widthClass: 'w-[320px] xl:w-[350px]',
  },
  {
    id: 'col-2',
    type: 'stacked',
    topIndex: 1,
    bottomIndex: 2,
    widthClass: 'w-[280px] xl:w-[305px]',
  },
  {
    id: 'col-3',
    type: 'standalone',
    itemIndex: 3,
    widthClass: 'w-[440px] xl:w-[480px]',
  },
  {
    id: 'col-4',
    type: 'stacked',
    topIndex: 4,
    bottomIndex: 5,
    widthClass: 'w-[280px] xl:w-[305px]',
  },
  {
    id: 'col-5',
    type: 'standalone',
    itemIndex: 6,
    widthClass: 'w-[320px] xl:w-[350px]',
  },
  {
    id: 'col-6',
    type: 'stacked',
    topIndex: 7,
    bottomIndex: 8,
    widthClass: 'w-[280px] xl:w-[305px]',
  },
];

export default function MomentsGallery() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const trackContainerRef = useRef(null);
  const mobileCarouselRef = useRef(null);

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return window.matchMedia('(min-width: 1024px)').matches;
  });
  const [canMobileScrollLeft, setCanMobileScrollLeft] = useState(false);
  const [canMobileScrollRight, setCanMobileScrollRight] = useState(true);

  const maxTranslateRef = useRef(0);
  const rafIdRef = useRef(null);

  // Render ONLY the active desktop or mobile gallery DOM to eliminate duplicate off-screen image nodes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const updateMobileCarouselState = useCallback(() => {
    const el = mobileCarouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanMobileScrollLeft(scrollLeft > 8);
    setCanMobileScrollRight(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    if (isDesktop) return undefined;
    const el = mobileCarouselRef.current;
    if (!el) return undefined;
    updateMobileCarouselState();
    el.addEventListener('scroll', updateMobileCarouselState, { passive: true });
    window.addEventListener('resize', updateMobileCarouselState, { passive: true });
    return () => {
      el.removeEventListener('scroll', updateMobileCarouselState);
      window.removeEventListener('resize', updateMobileCarouselState);
    };
  }, [isDesktop, updateMobileCarouselState]);

  const handleMobileCarouselScroll = (direction) => {
    const el = mobileCarouselRef.current;
    if (!el) return;
    const step = Math.max(260, el.clientWidth * 0.8);
    el.scrollBy({
      left: direction === 'next' ? step : -step,
      behavior: 'smooth',
    });
  };

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const listener = (e) => setIsReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
    return undefined;
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedPhotoIndex === null) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev === 0 ? MOMENTS_ITEMS.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev === MOMENTS_ITEMS.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex]);

  // Exact mathematical scroll-to-horizontal pinning engine.
  // Batches ALL layout reads BEFORE ANY style writes to prevent forced synchronous reflows.
  const updateLayoutAndScroll = useCallback(() => {
    if (!containerRef.current || !trackRef.current || !trackContainerRef.current) return;

    // 1. READ phase (all geometry queries together before mutating styles)
    const trackWidth = trackRef.current.scrollWidth;
    const containerWidth = trackContainerRef.current.clientWidth;
    const viewportHeight = window.innerHeight;
    const rect = containerRef.current.getBoundingClientRect();

    // 2. COMPUTE phase
    const maxTravel = Math.max(0, trackWidth - containerWidth);
    maxTranslateRef.current = maxTravel;
    const scrolled = -rect.top;
    const currentX = Math.max(0, Math.min(maxTravel, scrolled));

    // 3. WRITE phase (no layout reads after style mutation)
    containerRef.current.style.height = `${viewportHeight + maxTravel}px`;
    trackRef.current.style.transform = `translate3d(-${currentX.toFixed(2)}px, 0, 0)`;
  }, []);

  useEffect(() => {
    if (!isDesktop || isReducedMotion) return undefined;

    const handleScroll = () => {
      if (rafIdRef.current) return;
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (!containerRef.current || !trackRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const scrolled = -rect.top;
        const maxTravel = maxTranslateRef.current;
        const currentX = Math.max(0, Math.min(maxTravel, scrolled));

        trackRef.current.style.transform = `translate3d(-${currentX.toFixed(2)}px, 0, 0)`;
      });
    };

    const initRaf = requestAnimationFrame(updateLayoutAndScroll);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateLayoutAndScroll, { passive: true });

    return () => {
      cancelAnimationFrame(initRaf);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateLayoutAndScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isDesktop, isReducedMotion, updateLayoutAndScroll]);

  const handleOpenLightbox = (index) => {
    setSelectedPhotoIndex(index);
  };

  const handleCardKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedPhotoIndex(index);
    }
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev === 0 ? MOMENTS_ITEMS.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev === MOMENTS_ITEMS.length - 1 ? 0 : prev + 1));
  };

  return (
    <div id="moments" className="relative w-full">
      {/* =========================================================================
          DESKTOP VIEW: CLEAN PINNED HORIZONTAL GALLERY
          ========================================================================= */}
      {isDesktop ? (
        !isReducedMotion ? (
          <div
            ref={containerRef}
            className="relative bg-[#0B0708]"
          >
            {/* Sticky Full-Screen Viewport Frame */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-[#0B0708]">
              {/* Subtle atmospheric burgundy vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,18,25,0.4)_0%,rgba(11,7,8,0.98)_80%)] pointer-events-none" />

              {/* Left Vignette Fade Gradient */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[460px] xl:w-[500px] z-10 pointer-events-none bg-gradient-to-r from-[#0B0708] via-[#0B0708]/85 to-transparent"
                aria-hidden="true"
              />

              {/* Left Text Area */}
              <div className="absolute left-8 lg:left-14 xl:left-20 top-1/2 -translate-y-1/2 w-[300px] lg:w-[350px] xl:w-[380px] z-20 pointer-events-none select-none">
                <h3 className="font-serif-heading text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-[#F8F3E8] font-normal leading-[1.08] tracking-tight pointer-events-auto">
                  Moments at <br />
                  Pearl Oasis
                </h3>

                <p className="text-sm xl:text-base text-[#D8C5B8] mt-5 leading-relaxed font-light max-w-xs pointer-events-auto">
                  Explore our beautiful dining halls, warm lighting, and delicious food freshly prepared daily in Kohat.
                </p>
              </div>

              {/* Horizontal Track Viewport */}
              <div
                ref={trackContainerRef}
                className="w-full h-full flex items-center relative overflow-hidden"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0px, transparent 160px, rgba(0,0,0,0.15) 280px, rgba(0,0,0,0.85) 420px, black 480px, black 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0px, transparent 160px, rgba(0,0,0,0.15) 280px, rgba(0,0,0,0.85) 420px, black 480px, black 100%)',
                }}
              >
                <div
                  ref={trackRef}
                  className="flex items-center gap-5 xl:gap-6 will-change-transform"
                  style={{
                    paddingLeft: '480px',
                    paddingRight: '64px',
                  }}
                >
                  {GALLERY_COLUMNS.map((col) => {
                    if (col.type === 'standalone') {
                      const item = MOMENTS_ITEMS[col.itemIndex];
                      return (
                        <div
                          key={col.id}
                          role="button"
                          tabIndex={0}
                          aria-label={`View ${item.title} photograph`}
                          onClick={() => handleOpenLightbox(col.itemIndex)}
                          onKeyDown={(e) => handleCardKeyDown(e, col.itemIndex)}
                          className={`group relative rounded-[26px] xl:rounded-[28px] overflow-hidden border border-[#C9A45C]/25 bg-[#18080B]/95 shadow-[0_12px_32px_rgba(0,0,0,0.65)] cursor-pointer hover:border-[#F5C369]/60 hover:shadow-[0_16px_40px_rgba(138,24,38,0.25)] transition-[border-color,box-shadow] duration-500 shrink-0 h-[400px] xl:h-[420px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C369] ${col.widthClass}`}
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            width={item.width}
                            height={item.height}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106 rounded-[26px] xl:rounded-[28px]"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0708]/90 via-[#0B0708]/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity pointer-events-none rounded-[26px] xl:rounded-[28px]" />

                          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#18080B]/85 text-[#F5C369] border border-[#C9A45C]/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md" aria-hidden="true">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </div>

                          <div className="absolute bottom-4 left-5 right-5">
                            <span className="text-[10px] uppercase tracking-wider text-[#F5C369] font-medium block">
                              {item.category}
                            </span>
                            <h4 className="font-serif-heading text-base xl:text-lg text-[#F8F3E8] leading-snug mt-0.5 truncate">
                              {item.title}
                            </h4>
                          </div>
                        </div>
                      );
                    }

                    const topItem = MOMENTS_ITEMS[col.topIndex];
                    const bottomItem = MOMENTS_ITEMS[col.bottomIndex];

                    return (
                      <div
                        key={col.id}
                        className={`flex flex-col gap-4 xl:gap-5 shrink-0 ${col.widthClass}`}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          aria-label={`View ${topItem.title} photograph`}
                          onClick={() => handleOpenLightbox(col.topIndex)}
                          onKeyDown={(e) => handleCardKeyDown(e, col.topIndex)}
                          className="group relative rounded-[24px] xl:rounded-[26px] overflow-hidden border border-[#C9A45C]/25 bg-[#18080B]/95 shadow-[0_10px_28px_rgba(0,0,0,0.6)] cursor-pointer hover:border-[#F5C369]/60 hover:shadow-[0_14px_35px_rgba(138,24,38,0.22)] transition-[border-color,box-shadow] duration-500 h-[192px] xl:h-[200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C369]"
                        >
                          <img
                            src={topItem.image}
                            alt={topItem.title}
                            width={topItem.width}
                            height={topItem.height}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106 rounded-[24px] xl:rounded-[26px]"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0708]/90 via-[#0B0708]/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity pointer-events-none rounded-[24px] xl:rounded-[26px]" />

                          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#18080B]/85 text-[#F5C369] border border-[#C9A45C]/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
                            <Maximize2 className="w-3 h-3" />
                          </div>

                          <div className="absolute bottom-3 left-4 right-4">
                            <span className="text-[10px] uppercase tracking-wider text-[#F5C369] font-medium block">
                              {topItem.category}
                            </span>
                            <h4 className="font-serif-heading text-sm xl:text-base text-[#F8F3E8] leading-tight mt-0.5 truncate">
                              {topItem.title}
                            </h4>
                          </div>
                        </div>

                        <div
                          role="button"
                          tabIndex={0}
                          aria-label={`View ${bottomItem.title} photograph`}
                          onClick={() => handleOpenLightbox(col.bottomIndex)}
                          onKeyDown={(e) => handleCardKeyDown(e, col.bottomIndex)}
                          className="group relative rounded-[24px] xl:rounded-[26px] overflow-hidden border border-[#C9A45C]/25 bg-[#18080B]/95 shadow-[0_10px_28px_rgba(0,0,0,0.6)] cursor-pointer hover:border-[#F5C369]/60 hover:shadow-[0_14px_35px_rgba(138,24,38,0.22)] transition-[border-color,box-shadow] duration-500 h-[192px] xl:h-[200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C369]"
                        >
                          <img
                            src={bottomItem.image}
                            alt={bottomItem.title}
                            width={bottomItem.width}
                            height={bottomItem.height}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106 rounded-[24px] xl:rounded-[26px]"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0708]/90 via-[#0B0708]/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity pointer-events-none rounded-[24px] xl:rounded-[26px]" />

                          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#18080B]/85 text-[#F5C369] border border-[#C9A45C]/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
                            <Maximize2 className="w-3 h-3" />
                          </div>

                          <div className="absolute bottom-3 left-4 right-4">
                            <span className="text-[10px] uppercase tracking-wider text-[#F5C369] font-medium block">
                              {bottomItem.category}
                            </span>
                            <h4 className="font-serif-heading text-sm xl:text-base text-[#F8F3E8] leading-tight mt-0.5 truncate">
                              {bottomItem.title}
                            </h4>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Reduced Motion Alternative: Standard Scrollable Gallery */
          <div className="bg-[#0B0708] py-20 px-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-10 max-w-xl">
                <h3 className="font-serif-heading text-4xl text-[#F8F3E8] font-normal leading-tight">
                  Moments at Pearl Oasis
                </h3>
                <p className="text-sm text-[#D8C5B8] mt-3 font-light">
                  An editorial journey through our dining halls, glowing chandeliers, and the culinary craft simmered daily in Kohat.
                </p>
              </div>

              <div className="flex overflow-x-auto gap-5 pb-6 no-scrollbar">
                {MOMENTS_ITEMS.map((item, idx) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${item.title} photograph`}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    onKeyDown={(e) => handleCardKeyDown(e, idx)}
                    className="shrink-0 w-[330px] aspect-[4/3] rounded-[24px] overflow-hidden relative border border-[#C9A45C]/25 bg-[#18080B] cursor-pointer hover:border-[#F5C369] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C369]"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover rounded-[24px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0708]/90 to-transparent rounded-[24px]" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase tracking-wider text-[#F5C369] block">
                        {item.category}
                      </span>
                      <h4 className="font-serif-heading text-base text-[#F8F3E8]">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      ) : (
        /* =========================================================================
           MOBILE VIEW: TOUCH-FRIENDLY HORIZONTALLY SWIPEABLE GALLERY
           ========================================================================= */
        <div className="bg-[#0B0708] py-14 sm:py-16 px-5 sm:px-8">
          <div className="max-w-xl mx-auto text-center mb-6 sm:mb-8">
            <h3 className="font-serif-heading text-3xl sm:text-4xl text-[#F8F3E8] font-normal leading-tight">
              Moments at Pearl Oasis
            </h3>

            <p className="text-xs sm:text-sm text-[#D8C5B8] mt-3 font-light leading-relaxed">
              Swipe through our dining atmosphere, artisanal karahis, and chandeliers in Kohat.
            </p>

            {/* Left & Right Carousel Navigation Arrows */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleMobileCarouselScroll('prev')}
                disabled={!canMobileScrollLeft}
                aria-label="Scroll moments left"
                className={`w-10 h-10 rounded-full bg-[#18080B] border border-[#C9A45C]/50 text-[#F5C369] flex items-center justify-center transition-all duration-200 shadow-md ${
                  !canMobileScrollLeft
                    ? 'opacity-35 cursor-not-allowed'
                    : 'hover:bg-[#F5C369] hover:text-[#18080B] hover:border-[#F5C369] active:scale-95 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleMobileCarouselScroll('next')}
                disabled={!canMobileScrollRight}
                aria-label="Scroll moments right"
                className={`w-10 h-10 rounded-full bg-[#18080B] border border-[#C9A45C]/50 text-[#F5C369] flex items-center justify-center transition-all duration-200 shadow-md ${
                  !canMobileScrollRight
                    ? 'opacity-35 cursor-not-allowed'
                    : 'hover:bg-[#F5C369] hover:text-[#18080B] hover:border-[#F5C369] active:scale-95 cursor-pointer'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontally swipeable snap carousel */}
          <div
            ref={mobileCarouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-5 px-5 sm:-mx-8 sm:px-8 no-scrollbar scroll-smooth"
          >
            {MOMENTS_ITEMS.map((item, idx) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                aria-label={`View ${item.title} photograph`}
                onClick={() => setSelectedPhotoIndex(idx)}
                onKeyDown={(e) => handleCardKeyDown(e, idx)}
                className="snap-center shrink-0 w-[80vw] sm:w-[320px] aspect-[4/3] rounded-[24px] overflow-hidden relative border border-[#C9A45C]/25 bg-[#18080B] shadow-xl group cursor-pointer active:scale-[0.98] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C369]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  width={item.width}
                  height={item.height}
                  className="w-full h-full object-cover rounded-[24px]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0708]/90 via-[#0B0708]/25 to-transparent rounded-[24px]" />

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase tracking-wider text-[#F5C369] font-medium block">
                    {item.category}
                  </span>
                  <h4 className="font-serif-heading text-base text-[#F8F3E8] leading-tight mt-0.5 truncate">
                    {item.title}
                  </h4>
                </div>

                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#18080B]/85 text-[#F5C369] border border-[#C9A45C]/35 flex items-center justify-center" aria-hidden="true">
                  <Maximize2 className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          HIGH-RESOLUTION FULLSCREEN LIGHTBOX MODAL
          ========================================================================= */}
      {selectedPhotoIndex !== null && (
        <div
          onClick={() => setSelectedPhotoIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="High resolution photograph viewer"
        >
          <button
            type="button"
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-5 right-5 sm:top-6 sm:right-6 z-50 w-11 h-11 rounded-full border border-[#C9A45C]/60 bg-[#18080B]/90 text-[#F5C369] hover:text-white hover:border-[#F5C369] flex items-center justify-center cursor-pointer transition-colors shadow-lg"
            aria-label="Close photo viewer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={handlePrevPhoto}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-11 sm:w-12 h-11 sm:h-12 rounded-full border border-[#C9A45C]/50 bg-[#18080B]/90 text-[#F5C369] hover:text-white hover:border-[#F5C369] flex items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-xl"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-6 sm:w-7 h-6 sm:h-7" />
          </button>

          <button
            type="button"
            onClick={handleNextPhoto}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-11 sm:w-12 h-11 sm:h-12 rounded-full border border-[#C9A45C]/50 bg-[#18080B]/90 text-[#F5C369] hover:text-white hover:border-[#F5C369] flex items-center justify-center cursor-pointer transition-all hover:scale-105 shadow-xl"
            aria-label="Next photograph"
          >
            <ChevronRight className="w-6 sm:w-7 h-6 sm:h-7" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center px-8 sm:px-14"
          >
            <img
              src={MOMENTS_ITEMS[selectedPhotoIndex].image}
              alt={MOMENTS_ITEMS[selectedPhotoIndex].title}
              width={MOMENTS_ITEMS[selectedPhotoIndex].width}
              height={MOMENTS_ITEMS[selectedPhotoIndex].height}
              className="max-h-[62vh] sm:max-h-[72vh] max-w-full w-auto object-contain rounded-2xl border border-[#C9A45C]/40 shadow-2xl"
            />

            <div className="mt-4 text-center max-w-lg">
              <span className="text-[10px] uppercase tracking-widest text-[#F5C369] font-mono">
                {MOMENTS_ITEMS[selectedPhotoIndex].category} · {selectedPhotoIndex + 1} of {MOMENTS_ITEMS.length}
              </span>
              <h4 className="font-serif-heading text-xl sm:text-2xl text-[#F8F3E8] mt-1">
                {MOMENTS_ITEMS[selectedPhotoIndex].title}
              </h4>
              <p className="text-xs sm:text-sm text-[#D8C5B8] mt-1 font-light leading-relaxed">
                {MOMENTS_ITEMS[selectedPhotoIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
