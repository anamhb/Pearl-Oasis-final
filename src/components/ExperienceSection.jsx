import React from 'react';
import feastImg from '../assets/images/opt/hero-oasis-feast.webp';
import { Calendar } from 'lucide-react';
import MomentsGallery from './MomentsGallery.jsx';

export default function ExperienceSection({ onOpenReservation, onNavigateToBookTable }) {
  return (
    <div id="experience" className="relative">
      
      {/* 
        Pure CSS Pinned Background Section
        No JavaScript scroll listeners, RAF, or translate transforms
      */}
      <section className="fav flex items-center justify-center px-6 sm:px-8">
        <img
          className="fav__bg"
          src={feastImg}
          alt="An Unforgettable Dining Experience at Pearl Oasis"
          width={1279}
          height={714}
          loading="lazy"
          decoding="async"
        />
        <div className="fav__overlay" />
        <div className="fav__content max-w-3xl mx-auto text-center flex flex-col items-center justify-center w-full">
          
          {/* LOVELY DINING ATMOSPHERE Badge (Stars removed as requested) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18080B]/90 border border-[#C9A45C]/50 text-[#F5C369] text-xs uppercase tracking-[0.25em] mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <span>LOVELY DINING ATMOSPHERE</span>
          </div>

          {/* Heading Typography */}
          <h2 className="font-serif-heading text-4xl sm:text-6xl lg:text-7xl text-[#F8F3E8] font-normal leading-tight drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]">
            An Unforgettable <br className="hidden sm:inline" />
            Dining Experience
          </h2>

          {/* High-Readability Warm Ivory Paragraph with Easy Wording */}
          <p className="font-sans text-sm sm:text-base md:text-lg text-[#F5EBE1] font-normal max-w-2xl mt-4 leading-relaxed drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
            Enjoy delicious food and friendly service in a warm, beautiful environment right here in Kohat.
          </p>

          {/* Table Reservation CTA */}
          {(onNavigateToBookTable || onOpenReservation) && (
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={onNavigateToBookTable || onOpenReservation}
                className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold tracking-wider text-[#F8F3E8] bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:from-[#9B1C28] hover:to-[#D12B3D] hover:brightness-110 rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(186,37,53,0.45)] hover:shadow-[0_12px_40px_rgba(186,37,53,0.65)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>Book A Table</span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 
        Section below keeps a solid background with position: relative and z-index: 2
        so it slides smoothly over the pinned image
      */}
      <div className="relative z-[2] bg-[#0B0708] border-b border-[#C9A45C]/20">
        <MomentsGallery />
      </div>

    </div>
  );
}
