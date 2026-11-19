import React, { useState, useEffect, useRef } from 'react';
import { ROW_ONE_TESTIMONIALS, ROW_TWO_TESTIMONIALS } from '../data/restaurantData.js';
import { Star, Quote, X } from 'lucide-react';

function getInitials(name) {
  const cleanName = name.replace(/^(Engr\.|Dr\.|Major\s+\(R\)|Mr\.|Mrs\.|Ms\.)\s+/i, '');
  const parts = cleanName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return cleanName.slice(0, 2).toUpperCase();
}

function TestimonialCard({ item, onOpenModal }) {
  const initials = getInitials(item.name);
  const isLongText = item.quote.length > 115;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenModal(item);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Read full review by ${item.name}`}
      onClick={() => onOpenModal(item)}
      onKeyDown={handleKeyDown}
      className="w-[275px] sm:w-[340px] md:w-[390px] h-[185px] sm:h-[200px] shrink-0 bg-[#18080B]/95 rounded-xl p-4 sm:p-5 border border-[#C9A45C]/35 hover:border-[#F5C369] transition-colors duration-300 flex flex-col justify-between select-none shadow-xl hover:shadow-[0_8px_30px_rgba(138,24,38,0.25)] cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C369]"
    >
      {/* Top Header: Avatar, Name & Tag, 5 Gold Stars */}
      <div className="flex items-center justify-between gap-3">
        {/* Left: Avatar Initials & Name Details */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            aria-hidden="true"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#240C11] to-[#381017] border-2 border-[#C9A45C] text-[#F5C369] flex items-center justify-center font-serif-heading text-xs sm:text-sm font-bold shadow-md shrink-0"
          >
            {initials}
          </div>

          <div className="min-w-0 flex flex-col">
            <h3 className="text-xs sm:text-sm font-semibold text-[#F8F3E8] truncate leading-tight group-hover:text-[#F5C369] transition-colors">
              {item.name}
            </h3>
            <span className="text-[11px] text-[#D8C5B8] truncate leading-tight font-light mt-0.5">
              {item.tag || 'Local Guide'}
            </span>
          </div>
        </div>

        {/* Right: 5 Gold Stars */}
        <div
          className="flex items-center gap-0.5 text-[#F5C369] shrink-0"
          aria-label={`${item.rating || 5} out of 5 stars`}
        >
          {[...Array(item.rating || 5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-current stroke-none" aria-hidden="true" />
          ))}
        </div>
      </div>

      {/* Horizontal Line Separator */}
      <hr className="border-t border-[#C9A45C]/25 my-2" />

      {/* Customer Review / Comment */}
      <div className="flex-1 flex items-start gap-2 overflow-hidden min-h-0 relative">
        <Quote className="w-3.5 h-3.5 text-[#C9A45C]/40 rotate-180 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs sm:text-sm text-[#F8F3E8]/90 leading-relaxed font-light italic">
          {isLongText ? (
            <>
              <span>"{item.quote.slice(0, 105)}... </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(item);
                }}
                className="inline-flex items-center gap-0.5 text-[#F5C369] font-medium hover:underline not-italic cursor-pointer ml-0.5"
              >
                More
              </button>
              <span>"</span>
            </>
          ) : (
            <span>"{item.quote}"</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const rowOneItems = [...ROW_ONE_TESTIMONIALS, ...ROW_ONE_TESTIMONIALS, ...ROW_ONE_TESTIMONIALS];
  const rowTwoItems = [...ROW_TWO_TESTIMONIALS, ...ROW_TWO_TESTIMONIALS, ...ROW_TWO_TESTIMONIALS];

  // Pause CSS marquee animation while off-screen to minimize idle compositor/GPU work
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '150px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close review dialog on Escape key
  useEffect(() => {
    if (!selectedTestimonial) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedTestimonial(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTestimonial]);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className={`py-16 sm:py-20 bg-[#0B0708] border-b border-[#C9A45C]/20 overflow-hidden relative ${
        isVisible ? '' : 'marquee-paused'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,18,25,0.45)_0%,rgba(11,7,8,1)_80%)] pointer-events-none" />

      {/* Section Header */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-10 text-center flex flex-col items-center">
        {/* Ornate Gold Accent */}
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent mb-3" />

        <div className="text-xs uppercase tracking-[0.28em] text-[#F5C369] font-semibold mb-2">
          GUEST TESTIMONIALS
        </div>
        <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl text-[#F8F3E8] font-normal leading-tight">
          Words from Our Guests
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#D8C5B8] font-light max-w-xl mt-2">
          Authentic Google reviews and guest experiences shared by patrons at Pearl Oasis in Kohat.
        </p>
      </div>

      {/* Smooth Marquee Container */}
      <div className="relative w-full overflow-hidden space-y-5">
        {/* Left & Right Edge Gradient Fade Masks */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-24 md:w-44 bg-gradient-to-r from-[#0B0708] to-transparent z-10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-24 md:w-44 bg-gradient-to-l from-[#0B0708] to-transparent z-10"
          aria-hidden="true"
        />

        {/* Row 1: Scrolling Left (Reviews 1-5) */}
        <div className="marquee-row overflow-hidden py-1">
          <div className="animate-marquee-left flex items-center gap-4 sm:gap-5">
            {rowOneItems.map((story, idx) => (
              <TestimonialCard
                key={`row1-${idx}-${story.name}`}
                item={story}
                onOpenModal={setSelectedTestimonial}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right (Reviews 6-10) */}
        <div className="marquee-row overflow-hidden py-1">
          <div className="animate-marquee-right flex items-center gap-4 sm:gap-5">
            {rowTwoItems.map((story, idx) => (
              <TestimonialCard
                key={`row2-${idx}-${story.name}`}
                item={story}
                onOpenModal={setSelectedTestimonial}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Full Review Modal Dialog */}
      {selectedTestimonial && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Review by ${selectedTestimonial.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedTestimonial(null)}
        >
          <div
            className="max-w-lg w-full bg-[#18080B] border border-[#C9A45C]/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-4 right-4 text-[#D8C5B8] hover:text-[#F5C369] bg-[#240C11] p-1.5 rounded-full border border-[#C9A45C]/30 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 pr-8">
              <div
                aria-hidden="true"
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#240C11] to-[#381017] border-2 border-[#C9A45C] text-[#F5C369] font-serif-heading font-bold text-base sm:text-lg flex items-center justify-center shadow-md shrink-0"
              >
                {getInitials(selectedTestimonial.name)}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#F8F3E8] font-serif-heading">
                  {selectedTestimonial.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[#F5C369] px-2.5 py-0.5 rounded-full bg-[#381017] border border-[#C9A45C]/30 font-medium">
                    {selectedTestimonial.tag || 'Local Guide'}
                  </span>
                  <div
                    className="flex items-center gap-0.5 text-[#F5C369]"
                    aria-label={`${selectedTestimonial.rating || 5} out of 5 stars`}
                  >
                    {[...Array(selectedTestimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current stroke-none" aria-hidden="true" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-t border-[#C9A45C]/30 my-4" />

            {/* Full Review Text */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
              <div className="flex items-start gap-3">
                <Quote className="w-5 h-5 text-[#C9A45C] rotate-180 shrink-0 mt-1" aria-hidden="true" />
                <p className="text-sm sm:text-base text-[#F8F3E8] leading-relaxed font-light italic">
                  "{selectedTestimonial.quote}"
                </p>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="mt-6 pt-4 border-t border-[#381017] flex justify-between items-center text-xs text-[#D8C5B8]">
              <span className="flex items-center gap-1.5 text-[#F5C369]">
                <span className="w-2 h-2 rounded-full bg-[#F5C369]" aria-hidden="true" />
                Verified Google Review
              </span>
              <button
                type="button"
                onClick={() => setSelectedTestimonial(null)}
                className="px-4 py-1.5 rounded-lg bg-[#240C11] hover:bg-[#381017] border border-[#C9A45C]/40 text-[#F8F3E8] font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
