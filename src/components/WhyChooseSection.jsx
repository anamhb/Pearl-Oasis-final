import React, { useEffect, useRef } from 'react';

const PHRASES = [
  "DELICIOUS FOOD",
  "ELEGANT AMBIANCE",
  "PROFESSIONAL SERVICE",
  "AFFORDABLE PRICES"
];

function ArrowIcon() {
  return (
    <span className="tape-arrow inline-flex items-center justify-center shrink-0" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
        <path d="M4 11h12.17l-5.58-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z" />
      </svg>
    </span>
  );
}

export default function WhyChooseSection() {
  const sectionRef = useRef(null);
  const tape1Ref = useRef(null); // Dark tape
  const tape2Ref = useRef(null); // Light/gold tape
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion: don't animate if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let isVisible = false;
    let rafId = null;

    let x1 = 0;
    let x2 = 0;
    let lastTime = performance.now();
    let lastScrollY = window.scrollY || window.pageYOffset;
    let smoothedScrollSpeed = 0;
    let scrollDirection = 1; // 1 = down, -1 = up

    const onScroll = () => {
      const currentY = window.scrollY || window.pageYOffset;
      const delta = currentY - lastScrollY;
      if (Math.abs(delta) > 0.5) {
        scrollDirection = delta > 0 ? 1 : -1;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let groupWidth1 = 0;
    let groupWidth2 = 0;
    let tape1MovingLeft = true;
    let tape2MovingLeft = false;

    const measureWidths = () => {
      if (track1Ref.current) groupWidth1 = track1Ref.current.offsetWidth / 3;
      if (track2Ref.current) groupWidth2 = track2Ref.current.offsetWidth / 3;
    };
    const onResize = () => {
      if (isVisible) measureWidths();
    };
    window.addEventListener('resize', onResize, { passive: true });

    const animate = (now) => {
      if (!isVisible) {
        rafId = null;
        return;
      }

      // Delta time in seconds (clamped to avoid background tab jump)
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Calculate instant scroll speed in px/s
      const currentY = window.scrollY || window.pageYOffset;
      const scrollDelta = Math.abs(currentY - lastScrollY);
      lastScrollY = currentY;

      const instantScrollSpeed = dt > 0 ? scrollDelta / dt : 0;

      // Smoothed scroll speed uses an easing factor of 0.12 per frame
      smoothedScrollSpeed += (instantScrollSpeed - smoothedScrollSpeed) * 0.12;
      if (smoothedScrollSpeed < 0.5) {
        smoothedScrollSpeed = 0;
      }

      // Speed formula: speed = 70 + min(smoothed scroll speed * 0.6, 1600) px/s
      const speed = 70 + Math.min(smoothedScrollSpeed * 0.6, 1600);

      // Scrolling changes direction: scroll down vs up
      const activeDir = smoothedScrollSpeed > 5 ? scrollDirection : 1;

      const tape1Velocity = -1 * activeDir * speed;
      const tape2Velocity = 1 * activeDir * speed;

      // Only mutate classList when arrow direction actually flips
      const nextTape1Left = tape1Velocity < 0;
      if (tape1Ref.current && nextTape1Left !== tape1MovingLeft) {
        tape1MovingLeft = nextTape1Left;
        tape1Ref.current.classList.toggle('moving-left', tape1MovingLeft);
      }

      const nextTape2Left = tape2Velocity < 0;
      if (tape2Ref.current && nextTape2Left !== tape2MovingLeft) {
        tape2MovingLeft = nextTape2Left;
        tape2Ref.current.classList.toggle('moving-left', tape2MovingLeft);
      }

      // Move tracks with translate3d and loop seamlessly by wrapping x at one group width
      if (track1Ref.current && groupWidth1 > 0) {
        x1 += tape1Velocity * dt;
        x1 = x1 % groupWidth1;
        if (x1 > 0) x1 -= groupWidth1;
        track1Ref.current.style.transform = `translate3d(${x1}px, 0, 0)`;
      }

      if (track2Ref.current && groupWidth2 > 0) {
        x2 += tape2Velocity * dt;
        x2 = x2 % groupWidth2;
        if (x2 > 0) x2 -= groupWidth2;
        track2Ref.current.style.transform = `translate3d(${x2}px, 0, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    // Run the loop with requestAnimationFrame only while the section is on screen (IntersectionObserver)
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastTime = performance.now();
          lastScrollY = window.scrollY || window.pageYOffset;
          measureWidths();
          if (!rafId) {
            rafId = requestAnimationFrame(animate);
          }
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { rootMargin: '100px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section
      id="why-choose"
      ref={sectionRef}
      className="why-choose-tapes-section"
      style={{
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
        height: 'clamp(200px, 40vw, 460px)',
        margin: 0,
        padding: 0,
        background: '#0B0708',
      }}
      aria-label="Why Choose Pearl Oasis"
    >

      {/* ============================================================
          LIGHT / GOLD TAPE:
          transform: rotate(8deg); z-index: 1;
          Gold tape with dark text
          ============================================================ */}
      <div
        ref={tape2Ref}
        className="tape-container gold-tape"
        style={{
          position: 'absolute',
          left: '-12%',
          width: '124%',
          top: '50%',
          height: 'var(--th)',
          marginTop: 'calc(var(--th) / -2)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          transform: 'rotate(8deg)',
          zIndex: 1,
          backgroundColor: '#E5B558',
          color: '#240C11',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 'var(--fs)',
          lineHeight: 1,
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          fontWeight: 500,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          userSelect: 'none',
        }}
      >
        <div
          ref={track2Ref}
          className="flex flex-nowrap items-center will-change-transform"
          style={{ transform: 'translate3d(0, 0, 0)' }}
        >
          {/* Group 1 */}
          <div className="flex flex-nowrap items-center shrink-0">
            {PHRASES.map((phrase, i) => (
              <span key={`gold-g1-${i}`} className="inline-flex items-center shrink-0 whitespace-nowrap">
                <span>{phrase}</span>
                <ArrowIcon />
              </span>
            ))}
          </div>

          {/* Group 2 (aria-hidden) */}
          <div className="flex flex-nowrap items-center shrink-0" aria-hidden="true">
            {PHRASES.map((phrase, i) => (
              <span key={`gold-g2-${i}`} className="inline-flex items-center shrink-0 whitespace-nowrap">
                <span>{phrase}</span>
                <ArrowIcon />
              </span>
            ))}
          </div>

          {/* Group 3 (aria-hidden) */}
          <div className="flex flex-nowrap items-center shrink-0" aria-hidden="true">
            {PHRASES.map((phrase, i) => (
              <span key={`gold-g3-${i}`} className="inline-flex items-center shrink-0 whitespace-nowrap">
                <span>{phrase}</span>
                <ArrowIcon />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          DARK TAPE:
          transform: rotate(-7deg); z-index: 2; soft shadow (0 0 50px rgba(0,0,0,.45))
          Dark maroon tape with light text
          ============================================================ */}
      <div
        ref={tape1Ref}
        className="tape-container dark-tape moving-left"
        style={{
          position: 'absolute',
          left: '-12%',
          width: '124%',
          top: '50%',
          height: 'var(--th)',
          marginTop: 'calc(var(--th) / -2)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          transform: 'rotate(-7deg)',
          zIndex: 2,
          backgroundColor: '#1E070B',
          color: '#F8F3E8',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 'var(--fs)',
          lineHeight: 1,
          letterSpacing: '.08em',
          textTransform: 'uppercase',
          fontWeight: 500,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          userSelect: 'none',
        }}
      >
        <div
          ref={track1Ref}
          className="flex flex-nowrap items-center will-change-transform"
          style={{ transform: 'translate3d(0, 0, 0)' }}
        >
          {/* Group 1 */}
          <div className="flex flex-nowrap items-center shrink-0">
            {PHRASES.map((phrase, i) => (
              <span key={`dark-g1-${i}`} className="inline-flex items-center shrink-0 whitespace-nowrap">
                <span>{phrase}</span>
                <ArrowIcon />
              </span>
            ))}
          </div>

          {/* Group 2 (aria-hidden) */}
          <div className="flex flex-nowrap items-center shrink-0" aria-hidden="true">
            {PHRASES.map((phrase, i) => (
              <span key={`dark-g2-${i}`} className="inline-flex items-center shrink-0 whitespace-nowrap">
                <span>{phrase}</span>
                <ArrowIcon />
              </span>
            ))}
          </div>

          {/* Group 3 (aria-hidden) */}
          <div className="flex flex-nowrap items-center shrink-0" aria-hidden="true">
            {PHRASES.map((phrase, i) => (
              <span key={`dark-g3-${i}`} className="inline-flex items-center shrink-0 whitespace-nowrap">
                <span>{phrase}</span>
                <ArrowIcon />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
