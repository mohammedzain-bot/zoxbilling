import React from 'react';
import { CheckCircle2, MessageSquare, Calendar, ShieldCheck, X, Sparkles, Copy, Check } from 'lucide-react';
import { createWhatsAppUrl } from '../utils/whatsapp';

export default function BookingSuccessModal({ booking, onClose, settings }) {
  const [copied, setCopied] = React.useState(false);

  if (!booking) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.rentalCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const confirmMsg = `⚜️ *ZOX ATELIER RESERVATION CONFIRMATION* ⚜️\n\n` +
    `Hello Concierge, I just submitted an online reservation:\n` +
    `• *Rental Code:* ${booking.rentalCode}\n` +
    `• *Garment:* ${booking.suitTitle} (${booking.size})\n` +
    `• *Collection Date:* ${booking.startDate}\n` +
    `• *Client Name:* ${booking.customerName}\n\n` +
    `Looking forward to confirming my fitting schedule!`;

  const waUrl = createWhatsAppUrl(
    settings?.whatsappNumber || '15558907629',
    confirmMsg
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-obsidian-900 border border-gold-500/50 shadow-2xl p-6 sm:p-8 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-ivory-400 hover:text-ivory-100 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gold Seal Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-500/10 border border-gold-500/40 flex items-center justify-center text-gold-400 gold-glow">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[10px] font-mono tracking-ultra-luxury uppercase text-gold-500 block mb-1">
          Reservation Logged in Atelier
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-ivory-100">
          Your Ensemble is Held
        </h3>
        <p className="text-xs text-ivory-300 font-light mt-2 max-w-sm mx-auto leading-relaxed">
          Thank you, <span className="font-medium text-ivory-100">{booking.customerName}</span>. Your reservation has been recorded in the ZOX atelier system.
        </p>

        {/* Order Reference Box */}
        <div className="my-6 p-4 bg-obsidian-950 border border-charcoal-border flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-wider text-ivory-400 block">
              Reservation Reference Code
            </span>
            <span className="font-mono text-base text-gold-400 font-bold tracking-wider">
              {booking.rentalCode}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1 px-3 py-1.5 bg-obsidian-900 border border-charcoal-border hover:border-gold-500/50 text-xs text-ivory-300 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Rental Summary Details */}
        <div className="text-left p-4 bg-obsidian-950/60 border border-charcoal-border/80 space-y-2 text-xs text-ivory-300 mb-6">
          <div className="flex justify-between">
            <span className="text-ivory-400">Garment</span>
            <span className="text-ivory-100 font-medium">{booking.suitTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ivory-400">Bespoke Size</span>
            <span className="font-mono text-gold-400">{booking.size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ivory-400">Collection Date</span>
            <span>{booking.startDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ivory-400">Return Date</span>
            <span>{booking.returnDate}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-charcoal-border text-ivory-100 font-medium">
            <span>Total Estimated Fee</span>
            <span className="font-mono text-gold-400">{settings?.currency || '$'}{booking.pricing?.total || booking.total}</span>
          </div>
        </div>

        {/* Dual Actions */}
        <div className="space-y-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-widest uppercase transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open in WhatsApp Concierge</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-2.5 border border-charcoal-border text-ivory-400 hover:text-ivory-100 text-xs tracking-wider uppercase transition-colors"
          >
            Return to Wardrobe Catalog
          </button>
        </div>

      </div>
    </div>
  );
}
