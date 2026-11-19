import React, { useId, useEffect, useRef, useState } from 'react';

export default function CircularOrbitImage({
  imageSrc,
  altText,
  orbitText,
  id,
  imagePosition = 'object-center',
  width = 640,
  height = 857,
}) {
  const generatedId = useId().replace(/:/g, '');
  const pathId = id || `circlePath-${generatedId}`;
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const defaultText = `PEARL OASIS\u00A0\u00A0\u00A0·\u00A0\u00A0\u00A0FRESH FLAVOURS\u00A0\u00A0\u00A0·\u00A0\u00A0\u00A0FINE DINING\u00A0\u00A0\u00A0·\u00A0\u00A0\u00A0UNFORGETTABLE MOMENTS\u00A0\u00A0\u00A0·\u00A0\u00A0\u00A0`;
  const displayText = orbitText || defaultText;

  // Pause rotating SVG text ring when off-screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '150px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center w-[264px] h-[264px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] lg:w-[420px] lg:h-[420px] xl:w-[460px] xl:h-[460px] max-w-full aspect-square select-none group ${
        isVisible ? '' : 'marquee-paused'
      }`}
    >
      {/* 1. Outer Rotating Ring */}
      <div
        className="absolute inset-0 flex items-center justify-center animate-spin-slow motion-reduce:animate-none group-hover:[animation-play-state:paused]"
        style={{ animationDuration: '22s', willChange: 'transform' }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full fill-none overflow-visible">
          <defs>
            <path id={pathId} d="M 200, 200 m -170, 0 a 170,170 0 1,1 340,0 a 170,170 0 1,1 -340,0" />
          </defs>

          <circle
            cx="200"
            cy="200"
            r="192"
            stroke="#C9A45C"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.8"
          />

          <text
            xmlSpace="preserve"
            fill="#F5C369"
            fontSize="13"
            fontWeight="700"
            letterSpacing="3.5"
            className="font-sans font-bold uppercase tracking-widest fill-[#F5C369]"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            <textPath href={`#${pathId}`} startOffset="0%">
              {displayText}
            </textPath>
          </text>

          <circle cx="200" cy="8" r="3.5" fill="#F5C369" />
          <circle cx="200" cy="392" r="3.5" fill="#F5C369" />
          <circle cx="8" cy="200" r="3.5" fill="#F5C369" />
          <circle cx="392" cy="200" r="3.5" fill="#F5C369" />
        </svg>
      </div>

      {/* 2. Stationary Central Image */}
      <div className="relative w-[77.5%] h-[77.5%] rounded-full overflow-hidden border-2 sm:border-[3px] border-[#C9A45C]/60 shadow-[0_12px_40px_rgba(0,0,0,0.85)] bg-[#18080B] z-10 transition-transform duration-700 group-hover:scale-[1.02]">
        <img
          src={imageSrc}
          alt={altText}
          width={width}
          height={height}
          className={`w-full h-full object-cover ${imagePosition}`}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#18080B]/50 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
