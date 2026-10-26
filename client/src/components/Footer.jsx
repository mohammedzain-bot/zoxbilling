import React from 'react';
import { MessageSquare, Shield, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { createWhatsAppUrl } from '../utils/whatsapp';

export default function Footer({ onOpenAdmin, settings }) {
  const waUrl = createWhatsAppUrl(
    settings?.whatsappNumber || '15558907629',
    'Hello ZOX Atelier, I would like to inquire about appointments and formalwear rentals.'
  );

  return (
    <footer className="bg-obsidian-950 border-t border-charcoal-border pt-16 pb-12 text-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-charcoal-border/70">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-3xl tracking-ultra-luxury font-medium text-ivory-100 uppercase">
                ZOX
              </span>
              <span className="text-[10px] tracking-widest-luxury uppercase text-gold-500 font-sans mt-0.5">
                Haute Atelier & Bespoke Suit Rentals
              </span>
            </div>
            <p className="text-xs text-ivory-400 font-light leading-relaxed max-w-sm">
              Crafting commanding masculine elegance for the world’s most memorable galas, weddings, and milestones. Super 150s fabrics, Savile Row discipline, and effortless white-glove rental management.
            </p>
            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gold-500/40 bg-gold-500/10 text-gold-300 hover:bg-gold-500 hover:text-obsidian-950 text-xs tracking-wider uppercase transition-all duration-300"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Atelier Concierge</span>
              </a>
            </div>
          </div>

          {/* Wardrobe Curations */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-gold-400 mb-4">
              The Wardrobe
            </h4>
            <ul className="space-y-2 text-xs text-ivory-400 font-light">
              <li><a href="#wardrobe" className="hover:text-ivory-100 transition-colors">Obsidian Peak Tuxedos</a></li>
              <li><a href="#wardrobe" className="hover:text-ivory-100 transition-colors">Windsor 3-Piece Ensembles</a></li>
              <li><a href="#wardrobe" className="hover:text-ivory-100 transition-colors">Italian Velvet Dinner Jackets</a></li>
              <li><a href="#wardrobe" className="hover:text-ivory-100 transition-colors">Riviera Ivory Shawl Formalwear</a></li>
              <li><a href="#wardrobe" className="hover:text-ivory-100 transition-colors">Double-Breasted Power Suiting</a></li>
              <li><a href="#wardrobe" className="hover:text-ivory-100 transition-colors">Handcrafted Bowties & Cufflinks</a></li>
            </ul>
          </div>

          {/* Atelier & Etiquette */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-gold-400 mb-4">
              Atelier Etiquette
            </h4>
            <ul className="space-y-2 text-xs text-ivory-400 font-light">
              <li><a href="#experience" className="hover:text-ivory-100 transition-colors">How Rental Works</a></li>
              <li><a href="#experience" className="hover:text-ivory-100 transition-colors">Complimentary Master Basting</a></li>
              <li><a href="#experience" className="hover:text-ivory-100 transition-colors">Security Deposit & Refund Policy</a></li>
              <li><a href="#experience" className="hover:text-ivory-100 transition-colors">Eco-Dry Cleaning Standard</a></li>
              <li><a href="#experience" className="hover:text-ivory-100 transition-colors">Destination Wedding Shipping</a></li>
            </ul>
          </div>

          {/* Concierge & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-gold-400 mb-4">
              Private Atelier
            </h4>
            <div className="flex items-start space-x-2 text-xs text-ivory-400 font-light">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span>{settings?.address || '442 Madison Ave, 8th Floor, New York, NY'}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-ivory-400 font-light">
              <Phone className="w-4 h-4 text-gold-500 shrink-0" />
              <span>{settings?.phone || '+1 (555) 890-7629'}</span>
            </div>
            <div className="flex items-start space-x-2 text-xs text-ivory-400 font-light">
              <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span>{settings?.openingHours || 'Mon - Sat: 10am - 7:30pm | Sun: Private Fitting'}</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory-400/80 gap-4">
          <p>© {new Date().getFullYear()} ZOX Haute Couture & Suit Rentals. All rights reserved.</p>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1.5 text-ivory-400 hover:text-gold-400 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-gold-500" />
              <span>Atelier Management Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
