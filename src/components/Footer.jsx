import React from 'react';
import { RESTAURANT_INFO } from '../data/restaurantData.js';
import { ArrowUp, Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import BrandLogo from './BrandLogo.jsx';

export default function Footer({ onOpenReservation, onNavigateHome, currentView = 'landing' }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSectionLink = (e, targetId) => {
    e.preventDefault();
    if (currentView !== 'landing' && onNavigateHome) {
      onNavigateHome();
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0B0708] text-[#F8F3E8] pt-10 sm:pt-20 pb-7 sm:pb-12 border-t border-[#C9A45C]/30 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,18,25,0.45)_0%,rgba(11,7,8,0.98)_85%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-10 pb-8 sm:pb-14 border-b border-[#381017]">
          
          {/* Column 1: Brand Crest & Identity */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-5">
            <div className="flex flex-col items-start">
              <BrandLogo variant="footer" />
            </div>

            <p className="text-xs text-[#D8C5B8] leading-relaxed max-w-[250px] font-light">
              Fresh Pakistani & Chinese specialties crafted daily in Kohat.
            </p>

            <div className="pt-1 sm:pt-2 flex items-center gap-3">
              <div className="flex items-center gap-2.5 text-[#F5C369]">
                <a
                  href="https://www.instagram.com/pearloasis_restaurant/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-[#C9A45C]/40 flex items-center justify-center hover:text-white hover:border-[#F5C369] hover:bg-[#8A1826]/40 transition-all cursor-pointer"
                  aria-label="Follow Pearl Oasis on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/Pearloasisrestaurant/photos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-[#C9A45C]/40 flex items-center justify-center hover:text-white hover:border-[#F5C369] hover:bg-[#8A1826]/40 transition-all cursor-pointer"
                  aria-label="Visit Pearl Oasis Facebook Photos"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-2.5 sm:space-y-4">
            <div className="text-[11px] uppercase tracking-[0.25em] text-[#F5C369] font-semibold">
              NAVIGATION
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2 sm:gap-0 sm:space-y-2.5 text-xs text-[#D8C5B8] font-light">
              <li>
                <a href="#hero" onClick={(e) => handleSectionLink(e, 'hero')} className="hover:text-[#F5C369] transition-colors">Home</a>
              </li>
              <li>
                <a href="#our-story" onClick={(e) => handleSectionLink(e, 'our-story')} className="hover:text-[#F5C369] transition-colors">Our Story</a>
              </li>
              <li>
                <a href="#signatures" onClick={(e) => handleSectionLink(e, 'signatures')} className="hover:text-[#F5C369] transition-colors">Explore Menu</a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenReservation}
                  className="hover:text-[#F5C369] transition-colors cursor-pointer text-left"
                >
                  Book A Table
                </button>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleSectionLink(e, 'contact')} className="hover:text-[#F5C369] transition-colors">Visit & Contact</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours (Tablet & Desktop only) */}
          <div className="hidden md:block lg:col-span-2 space-y-2.5 sm:space-y-4">
            <div className="text-[11px] uppercase tracking-[0.25em] text-[#F5C369] font-semibold">
              HOURS
            </div>
            <div className="space-y-2 text-xs text-[#D8C5B8] font-light">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F5C369] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[#F8F3E8] font-medium">Open Daily</div>
                  <div>11:00 AM – 11:00 PM</div>
                </div>
              </div>
              <div className="pl-5.5 text-xs text-[#D8C5B8]">
                <span className="text-[#F5C369] font-medium">Friday Break:</span> 1:00 PM – 2:30 PM
              </div>
            </div>
          </div>

          {/* Column 4: Two Pearl Oasis Branches in Kohat */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4">
            <div className="text-[11px] uppercase tracking-[0.25em] text-[#F5C369] font-semibold">
              OUR LOCATIONS & BRANCHES
            </div>
            
            <div className="space-y-2.5 sm:space-y-4">
              {/* Branch 1 */}
              <div className="space-y-1.5 text-xs text-[#D8C5B8] font-light border-b border-[#381017] pb-3">
                <div className="text-[11px] font-semibold text-[#F5C369] uppercase tracking-wider">
                  Branch 1 (KDA Branch)
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#F5C369] shrink-0 mt-0.5" />
                  <span>{RESTAURANT_INFO.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#F5C369] shrink-0" />
                  <a href="tel:+923327515538" className="hover:text-[#F5C369] transition-colors font-medium">
                    +92 332 7515538
                  </a>
                </div>
              </div>

              {/* Branch 2 */}
              <div className="space-y-1.5 text-xs text-[#D8C5B8] font-light pb-1">
                <div className="text-[11px] font-semibold text-[#F5C369] uppercase tracking-wider">
                  Branch 2 (Al-Falah Plaza)
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#F5C369] shrink-0 mt-0.5" />
                  <span>Al-Falah Plaza Extension (near Broadway Bakery / CSD), Kohat, Pakistan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#F5C369] shrink-0" />
                  <a href="tel:+923325230006" className="hover:text-[#F5C369] transition-colors font-medium">
                    +92 332 5230006
                  </a>
                </div>
              </div>

              {/* Mobile-only Hours separated by horizontal line */}
              <div className="md:hidden border-t border-[#381017] pt-3 text-xs text-[#D8C5B8] font-light">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#F5C369] shrink-0" />
                  <span>Open Daily 11:00 AM - 11:00 PM</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-5 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-xs text-[#D8C5B8]/80 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Pearl Oasis Restaurant. All rights reserved. Fine Dining in Kohat.
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs text-[#F5C369] hover:text-[#F8F3E8] transition-colors cursor-pointer uppercase tracking-wider"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
