import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, MessageSquare, Menu, X, Compass, Ruler, PhoneCall } from 'lucide-react';
import { createWhatsAppUrl } from '../utils/whatsapp';

export default function Navbar({ onOpenAdmin, onOpenFitFinder, onOpenStyleQuiz, settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const waUrl = createWhatsAppUrl(
    settings?.whatsappNumber || '15558907629',
    'Hello ZOX Atelier Concierge, I would like to inquire about suit rentals and bespoke fittings.'
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-obsidian-950/95 backdrop-blur-md border-b border-charcoal-border py-3 shadow-2xl' 
        : 'bg-gradient-to-b from-obsidian-950/90 via-obsidian-900/60 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Identity */}
          <a href="#" className="flex flex-col group cursor-pointer">
            <span className="font-serif text-2xl sm:text-3xl tracking-ultra-luxury font-medium text-ivory-100 group-hover:text-gold-400 transition-colors uppercase">
              ZOX
            </span>
            <span className="text-[9px] tracking-widest-luxury uppercase text-gold-500/80 -mt-1 font-sans">
              Haute Atelier & Rentals
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 text-xs tracking-widest uppercase font-medium text-ivory-200/90">
            <a href="#wardrobe" className="hover:text-gold-400 transition-colors py-1 relative group">
              The Wardrobe
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gold-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#experience" className="hover:text-gold-400 transition-colors py-1 relative group">
              Atelier Craft
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gold-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#occasions" className="hover:text-gold-400 transition-colors py-1 relative group">
              Occasions
              <span className="absolute bottom-0 left-0 w-0 h-px bg-gold-400 transition-all group-hover:w-full"></span>
            </a>
            
            {/* Interactive Sizing Guide Button */}
            <button
              onClick={onOpenFitFinder}
              className="flex items-center space-x-1.5 text-gold-400 hover:text-gold-300 transition-colors py-1 group"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Fit Finder</span>
            </button>

            {/* Interactive Style Quiz */}
            <button
              onClick={onOpenStyleQuiz}
              className="flex items-center space-x-1.5 text-ivory-200 hover:text-gold-400 transition-colors py-1 group"
            >
              <Compass className="w-3.5 h-3.5 text-gold-500 group-hover:rotate-45 transition-transform" />
              <span>Style Quiz</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* WhatsApp VIP Concierge */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 hover:text-gold-300 text-xs tracking-wider transition-all duration-300"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Atelier</span>
            </a>

            {/* Admin Portal Gateway */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded border border-ivory-200/20 text-ivory-300 hover:text-ivory-100 hover:border-gold-500/50 hover:bg-obsidian-800 text-xs tracking-wider transition-all"
              title="Management Dashboard for Inventory, Orders & Returns"
            >
              <Shield className="w-3.5 h-3.5 text-gold-500" />
              <span className="text-[11px] uppercase tracking-widest font-mono">Staff Atelier</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-gold-400 hover:text-ivory-100 border border-gold-500/30 rounded"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-ivory-200 hover:text-ivory-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-obsidian-950 border-b border-charcoal-border px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-3 text-sm uppercase tracking-widest text-ivory-200">
            <a
              href="#wardrobe"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-gold-400 py-1"
            >
              The Wardrobe
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-gold-400 py-1"
            >
              Atelier Craft & Rental Process
            </a>
            <a
              href="#occasions"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-gold-400 py-1"
            >
              Curated Occasions
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFitFinder();
              }}
              className="flex items-center space-x-2 text-gold-400 py-1 text-left"
            >
              <Ruler className="w-4 h-4" />
              <span>Interactive Fit Calculator</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStyleQuiz();
              }}
              className="flex items-center space-x-2 text-ivory-100 py-1 text-left"
            >
              <Compass className="w-4 h-4 text-gold-500" />
              <span>Style Concierge Quiz</span>
            </button>
          </div>

          <div className="pt-4 border-t border-charcoal-border flex flex-col gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full py-2.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs tracking-widest uppercase font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact via WhatsApp</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-center space-x-2 w-full py-2 rounded border border-charcoal-border bg-obsidian-800 text-ivory-300 text-xs tracking-widest uppercase"
            >
              <Shield className="w-4 h-4 text-gold-500" />
              <span>Enter Atelier Management</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
