import React from 'react';
import ceoImg from '../assets/images/opt/ceo-portrait.webp';
import CircularOrbitImage from './CircularOrbitImage.jsx';
import { Quote } from 'lucide-react';

export default function CeoVisionSection() {
  const ceoOrbitText = `PEARL OASIS\u00A0\u00A0\u00A0·\u00A0\u00A0\u00A0OUR VISION\u00A0\u00A0\u00A0·\u00A0\u00A0\u00A0QUALITY & HOSPITALITY\u00A0\u00A0\u00A0·\u00A0\u00A0\u00A0A PASSION FOR FLAVOUR\u00A0\u00A0\u00A0·\u00A0\u00A0\u00A0`;

  return (
    <section 
      id="vision" 
      className="relative py-16 sm:py-24 lg:py-32 bg-[#0B0708] overflow-hidden border-b border-[#C9A45C]/20"
      aria-label="The Person Behind It and Our Vision"
    >
      {/* Background ambient lighting and subtle burgundy radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,18,25,0.45)_0%,rgba(11,7,8,1)_70%)] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#8A1826]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Centered Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 flex flex-col items-center relative z-10">
          <div className="mb-3">
            <span className="text-xs uppercase tracking-[0.28em] text-[#F5C369] font-semibold">
              The Person Behind It / Our Vision
            </span>
          </div>

          <h2 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl text-[#F8F3E8] leading-[1.15] font-normal tracking-wide">
            Ibrar Sikandar
          </h2>
          {/* Role badge with gold accent */}
          <p className="font-serif-heading italic text-base sm:text-lg text-[#F5C369] mt-1.5 tracking-wider">
            Founder & Chief Executive Officer
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 sm:gap-y-7 lg:gap-x-12 xl:gap-x-16 items-start">
          
          {/* Circular Orbit CEO Portrait (First below role on Mobile/Tablet, Right Top-Aligned on Desktop) */}
          <div className="order-1 lg:order-2 flex justify-center items-start relative py-2 sm:py-3 lg:py-0 z-10">
            {/* Subtle radial glow under orbit */}
            <div className="absolute w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] lg:w-[420px] lg:h-[420px] xl:w-[460px] xl:h-[460px] rounded-full bg-[#8A1826]/15 blur-2xl pointer-events-none -z-10" />

            <CircularOrbitImage
              imageSrc={ceoImg}
              altText="Ibrar Sikandar, Founder and CEO of Pearl Oasis Restaurant in Kohat"
              orbitText={ceoOrbitText}
              imagePosition="object-[center_20%]"
            />
          </div>

          {/* Our Vision & Commitment Heading & Message Block (Left Top-Aligned on Desktop) */}
          <div className="order-2 lg:order-1 flex flex-col gap-6 sm:gap-7 z-10">
            <div className="pt-1 border-t border-[#381017]">
              <h3 className="font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-[#F8F3E8] font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rotate-45 bg-[#F5C369] inline-block" />
                <span>Our Vision & Commitment</span>
              </h3>
            </div>

            <div className="relative bg-[#18080B]/80 rounded-2xl p-6 sm:p-7 border border-[#C9A45C]/30 shadow-xl space-y-4">
              <Quote className="w-8 h-8 text-[#C9A45C]/35 rotate-180 shrink-0" aria-hidden="true" />
              <p className="text-base sm:text-lg text-[#D8C5B8] font-light leading-relaxed italic">
                “Pearl Oasis was born out of a passion to redefine the food flavors and dining experience in Kohat. Located near KDA Gate, our vision has always been to create a space where families and friends can gather to enjoy exceptional multi-cuisine flavors—from authentic traditional karahis and sizzling BBQ platters to artisan pizzas—all served with uncompromising quality, warmth, and genuine local hospitality.”
              </p>
              
              <div className="pt-3 border-t border-[#381017] flex items-center justify-between text-xs text-[#D8C5B8]/80">
                <span className="font-serif-heading text-sm text-[#F5C369] tracking-wider font-medium">
                  Ibrar Sikandar
                </span>
                <span className="uppercase tracking-widest text-[10px] text-[#C9A45C]">
                  Pearl Oasis · Kohat
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
