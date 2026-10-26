import React from 'react';
import { Eye, MessageSquare, ArrowUpRight, Sparkles } from 'lucide-react';
import { createWhatsAppUrl, generateCustomerInquiryMessage } from '../utils/whatsapp';

export default function SuitCard({ suit, onSelect, settings }) {
  const defaultImage = suit.images && suit.images[0]
    ? suit.images[0]
    : 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80';

  const lowestPrice = suit.rentalPricing?.["3days"] || 180;
  const availableSizes = (suit.sizes || [])
    .filter(s => s.availableStock > 0)
    .map(s => s.size);

  const quickWaMessage = generateCustomerInquiryMessage({
    suit,
    size: availableSizes[0] || 'Standard Fit',
    customerName: ''
  });

  const waLink = createWhatsAppUrl(
    settings?.whatsappNumber || '15558907629',
    quickWaMessage
  );

  return (
    <div className="group relative flex flex-col bg-obsidian-800 border border-charcoal-border hover:border-gold-500/40 rounded-none transition-all duration-500 overflow-hidden">
      
      {/* Editorial Image Container */}
      <div 
        className="relative aspect-[3/4] w-full overflow-hidden bg-obsidian-950 cursor-pointer"
        onClick={() => onSelect(suit)}
      >
        <img
          src={defaultImage}
          alt={suit.title}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 contrast-105"
          loading="lazy"
        />

        {/* Dark Luxury Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {suit.isFeatured && (
            <span className="flex items-center space-x-1 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest bg-gold-500/90 text-obsidian-950 font-sans shadow-md">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Signature Piece</span>
            </span>
          )}
          <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-obsidian-900/90 text-ivory-300 border border-charcoal-border backdrop-blur-sm">
            {suit.category}
          </span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <span className="px-4 py-2 bg-obsidian-950/90 text-gold-300 border border-gold-500/50 text-xs tracking-widest uppercase flex items-center space-x-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>Examine Garment</span>
          </span>
        </div>

        {/* Color / Fabric Swatch bar at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-ivory-300">
          <span className="font-mono text-gold-400/90 tracking-wider text-[10px] uppercase">
            {suit.sku}
          </span>
          <span className="text-ivory-400 text-[10px] uppercase tracking-wider truncate max-w-[65%] text-right">
            {suit.fit}
          </span>
        </div>
      </div>

      {/* Garment Details & Editorial Information */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-obsidian-900">
        <div>
          {/* Occasion & Lapel */}
          <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-ivory-400 mb-1">
            <span>{suit.occasion}</span>
            <span className="text-gold-500/80">{suit.lapel?.split(' ')[0]}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(suit)}
            className="font-serif text-lg text-ivory-100 group-hover:text-gold-400 transition-colors cursor-pointer tracking-wide line-clamp-1"
          >
            {suit.title}
          </h3>

          {/* Subtitle / Fabric brief */}
          <p className="text-xs text-ivory-400 line-clamp-1 mt-0.5 font-light">
            {suit.fabric}
          </p>

          {/* Available Sizes preview */}
          <div className="mt-3 pt-3 border-t border-charcoal-border/60 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-wider text-ivory-400">
              Sizes:
            </div>
            <div className="flex flex-wrap gap-1 justify-end">
              {availableSizes.slice(0, 4).map(size => (
                <span 
                  key={size}
                  className="px-1.5 py-0.5 text-[9px] font-mono bg-charcoal border border-charcoal-border text-ivory-200"
                >
                  {size}
                </span>
              ))}
              {availableSizes.length > 4 && (
                <span className="text-[9px] font-mono text-ivory-400 self-center">
                  +{availableSizes.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & CTA Actions */}
        <div className="mt-4 pt-3 border-t border-charcoal-border flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-ivory-400">
              Rental From
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-serif text-xl font-medium text-gold-400">
                {settings?.currency || '$'}{lowestPrice}
              </span>
              <span className="text-[10px] text-ivory-400 font-sans">
                / 3 Days
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick WhatsApp Inquiry */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-charcoal-border hover:border-gold-500/60 bg-charcoal hover:bg-gold-500/10 text-ivory-300 hover:text-gold-400 rounded transition-colors"
              title="Quick WhatsApp Inquiry for this Suit"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>

            {/* View & Reserve */}
            <button
              onClick={() => onSelect(suit)}
              className="px-3 py-1.5 bg-ivory-100 hover:bg-gold-500 text-obsidian-950 font-medium text-xs tracking-wider uppercase transition-colors flex items-center space-x-1"
            >
              <span>Reserve</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
