import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, X, ShoppingBag, ShoppingCart } from 'lucide-react';
import BrandLogo from './BrandLogo.jsx';

export default function Navbar({ 
  trayCount = 0, 
  cartTotal = 0,
  onOpenTray, 
  onOpenReservation, 
  onNavigateToBookTable,
  onNavigateToFullMenu, 
  onNavigateHome,
  currentView = 'landing'
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookTableClick = (e) => {
    if (e) e.preventDefault();
    if (onNavigateToBookTable) {
      onNavigateToBookTable();
    } else if (onOpenReservation) {
      onOpenReservation();
    }
  };

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Our Story", href: "#our-story" },
    { label: "Menu", href: "#signatures" },
    { label: "Book A Table", href: "/book-a-table", onClick: handleBookTableClick },
    { label: "Contact", href: "#contact" },
  ];

  const handleLinkClick = (e, link) => {
    if (link.onClick) {
      link.onClick(e);
      return;
    }
    if (link.href.startsWith('#')) {
      e.preventDefault();
      const targetId = link.href.slice(1);
      if (currentView !== 'landing' && onNavigateHome) {
        onNavigateHome();
        setTimeout(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBrandClick = (e) => {
    if (onNavigateHome) {
      e.preventDefault();
      onNavigateHome();
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0B0708]/95 backdrop-blur-md shadow-2xl py-2 sm:py-2.5 border-b-0'
          : 'bg-gradient-to-b from-[#0B0708]/95 via-[#18080B]/70 to-transparent py-2.5 sm:py-3.5 border-b-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Left: Brand Identity with 3D Golden Logo Directly Above the Letter 'l' */}
        <a 
          href="#hero" 
          onClick={handleBrandClick}
          className="flex items-center group focus:outline-none shrink-0"
          aria-label="Pearl Oasis Home"
        >
          <BrandLogo variant="navbar" />
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-8 lg:absolute lg:left-1/2 lg:-translate-x-1/2 text-xs sm:text-[13px] font-medium tracking-wide text-[#F8F3E8]/90">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link)}
              className="relative py-1 whitespace-nowrap hover:text-[#F5C369] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#F5C369] hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Far Right: Cart Button & Crimson Gradient "Order Now" Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Cart Button */}
          <button
            type="button"
            onClick={onOpenTray}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F5C369] hover:text-[#18080B] bg-[#18080B]/90 hover:bg-[#F5C369] border border-[#C9A45C]/50 hover:border-[#F5C369] rounded-full transition-all duration-300 shadow-md active:scale-95 cursor-pointer group"
            aria-label={`View Cart with ${trayCount} items`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#F5C369] group-hover:text-[#18080B] transition-colors" />
            <span className="font-bold">Cart</span>
            {trayCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#F5C369] text-[#18080B] group-hover:bg-[#18080B] group-hover:text-[#F5C369] text-[10px] font-black flex items-center justify-center transition-colors">
                {trayCount}
              </span>
            )}
          </button>

          {/* Crimson Gradient Order Now Button Matching Reference */}
          <button
            type="button"
            onClick={() => {
              if (onNavigateToFullMenu) {
                onNavigateToFullMenu();
              } else {
                onOpenTray();
              }
            }}
            className="hidden sm:inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F8F3E8] bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:from-[#9B1C28] hover:to-[#D12B3D] hover:brightness-110 rounded-full transition-all duration-300 shadow-[0_4px_18px_rgba(186,37,53,0.45)] hover:shadow-[0_6px_24px_rgba(186,37,53,0.65)] active:scale-95 cursor-pointer"
            aria-label="Order Now - Browse Full Menu"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#F8F3E8]" />
            <span className="font-bold">Order Now</span>
            <span className="text-sm">→</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#F5C369] hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#140608]/98 backdrop-blur-xl border-b border-[#C9A45C]/30 px-5 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-5 max-h-[calc(100vh-64px)] overflow-y-auto animate-in fade-in duration-300">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#C9A45C] border-b border-[#C9A45C]/20 pb-2">
            Fine Dining Sanctuary · Kohat, Pakistan
          </div>

          <div className="space-y-3 pt-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleLinkClick(e, link);
                }}
                className="block text-lg font-serif-heading text-[#F8F3E8] hover:text-[#F5C369] transition-colors py-1.5 border-b border-[#381017]/50"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTray();
              }}
              className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-[#F5C369] bg-[#18080B] border border-[#C9A45C]/40 hover:border-[#F5C369] rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>View Cart ({trayCount} items{cartTotal > 0 ? ` · Rs. ${cartTotal.toLocaleString()}` : ''})</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigateToFullMenu) onNavigateToFullMenu();
              }}
              className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-[#F8F3E8] bg-gradient-to-r from-[#8A1826] via-[#A81E2E] to-[#C02636] hover:brightness-110 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Online (Full Menu)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleBookTableClick();
              }}
              className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-[#F8F3E8] bg-[#240C11] hover:bg-[#381017] border border-[#C9A45C]/40 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              Book A Table
            </button>
            <div className="text-center text-[11px] text-[#D8C5B8]">
              Kohat City Centre, near KDA Gate No. 1
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
