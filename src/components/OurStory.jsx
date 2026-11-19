import React from 'react';
import entranceImg from '../assets/images/opt/pearl-oasis-entrance.webp';

export default function OurStory() {
  return (
    <section id="our-story" className="relative py-16 sm:py-24 lg:py-32 bg-[#0B0708] overflow-hidden border-b border-[#C9A45C]/20">
      {/* Subtle background ambient glow & dark burgundy radiance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,18,25,0.45)_0%,rgba(11,7,8,1)_70%)] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#8A1826]/12 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Section Image with Overlapping Malai Boti Plate at Bottom-Right */}
          <div className="lg:col-span-5 flex justify-center items-center relative z-10">
            
            {/* Reduced width wrapper allowing the dish to overlap naturally without crowding */}
            <div className="relative w-full max-w-[420px] sm:max-w-[450px]">
              
              {/* Ambient crimson/burgundy back-glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#8A1826]/40 via-[#A81E2E]/25 to-transparent rounded-[3.5rem] blur-2xl pointer-events-none -z-10" />

              {/* Main Restaurant Entrance Image Container with Organic Wave Border */}
              <div className="relative w-full rounded-tl-[2.75rem] rounded-br-[2.75rem] rounded-tr-2xl rounded-bl-2xl overflow-hidden border-2 border-[#C9A45C]/50 hover:border-[#F5C369] shadow-[0_16px_50px_rgba(186,37,53,0.35)] bg-[#18080B] transition-all duration-500 group">
                
                {/* Inner Glowing Accent Edge */}
                <div className="absolute inset-0 rounded-tl-[2.75rem] rounded-br-[2.75rem] rounded-tr-2xl rounded-bl-2xl ring-1 ring-inset ring-[#F5C369]/30 pointer-events-none z-10" />

                <img
                  src={entranceImg}
                  alt="Pearl Oasis Restaurant illuminated entrance in Kohat with warm wooden architecture and glowing marquee"
                  width={920}
                  height={690}
                  className="w-full h-[320px] sm:h-[380px] md:h-[420px] object-cover object-[4%_30%] transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />

                {/* Gentle bottom gradient fade for depth, leaving marquee fully illuminated and clear */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0708]/65 via-transparent to-black/10 pointer-events-none" />
              </div>

              {/* Source Anchor for Malai Boti Scroll Flight */}
              <div 
                id="malai-boti-source-slot"
                className="absolute -bottom-6 right-0 sm:-bottom-10 sm:-right-6 md:-bottom-12 md:-right-10 z-20 w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 select-none pointer-events-none"
                aria-hidden="true"
              />

            </div>

          </div>

          {/* Right Column: Heading & Narrative Text (No Buttons) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10 lg:pl-4">
            {/* Eyebrow */}
            <div className="flex items-center">
              <span className="text-xs uppercase tracking-[0.3em] text-[#F5C369] font-semibold">
                OUR STORY
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl text-[#F8F3E8] leading-[1.15] font-normal tracking-wide">
              About Pearl Oasis
            </h2>

            {/* Narrative Prose */}
            <div className="space-y-4 text-base sm:text-lg text-[#D8C5B8] font-light leading-relaxed max-w-xl">
              <p>
                At Pearl Oasis, we believe great food is more than just a meal. It is an experience that brings people together. From carefully prepared dishes to a welcoming atmosphere, every detail is designed to make your dining experience memorable.
              </p>
              <p>
                Whether you are savoring our slow-cooked royal biryanis, sharing a sizzling charcoal BBQ platter with family, or enjoying a comfortable evening with friends, we invite you to immerse yourself in the true essence of authentic hospitality.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
