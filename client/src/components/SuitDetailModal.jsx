import React, { useState } from 'react';
import { 
  X, Check, Calendar, ShieldCheck, Sparkles, MessageSquare, 
  Ruler, Clock, AlertCircle, ShoppingBag, ArrowRight, Info 
} from 'lucide-react';
import { createWhatsAppUrl, generateCustomerInquiryMessage } from '../utils/whatsapp';

export default function SuitDetailModal({ 
  suit, 
  accessories = [], 
  onClose, 
  onBookOnline, 
  onOpenFitFinder, 
  settings 
}) {
  if (!suit) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState('3days');
  const [selectedSize, setSelectedSize] = useState(() => {
    const firstAvail = suit.sizes?.find(s => s.availableStock > 0);
    return firstAvail ? firstAvail.size : (suit.sizes?.[0]?.size || '40R');
  });

  // Calculate default dates: tomorrow as pickup, duration added as return
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [collectionDate, setCollectionDate] = useState(tomorrow);
  
  const getReturnDate = (startDate, durationKey) => {
    const days = durationKey === '7days' ? 7 : durationKey === '5days' ? 5 : 3;
    const d = new Date(startDate);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const [returnDate, setReturnDate] = useState(() => getReturnDate(tomorrow, '3days'));
  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [damageWaiver, setDamageWaiver] = useState(false);

  // Customer contact state for online booking
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle duration change
  const handleDurationChange = (dur) => {
    setSelectedDuration(dur);
    setReturnDate(getReturnDate(collectionDate, dur));
  };

  const handleCollectionDateChange = (e) => {
    const newStart = e.target.value;
    setCollectionDate(newStart);
    setReturnDate(getReturnDate(newStart, selectedDuration));
  };

  const toggleAccessory = (accName) => {
    setSelectedAccessories(prev => 
      prev.includes(accName) ? prev.filter(a => a !== accName) : [...prev, accName]
    );
  };

  // Pricing calculations
  const rentalFee = suit.rentalPricing?.[selectedDuration] || 190;
  const accessoriesFee = selectedAccessories.reduce((sum, accName) => {
    const item = accessories.find(a => a.name === accName);
    return sum + (item ? item.rentalPrice : 25);
  }, 0);
  const securityDeposit = suit.securityDeposit || 100;
  const damageWaiverFee = damageWaiver ? 15 : 0;
  const totalDue = rentalFee + accessoriesFee + securityDeposit + damageWaiverFee;

  // WhatsApp Inquiry URL
  const waInquiryMsg = generateCustomerInquiryMessage({
    suit,
    size: selectedSize,
    startDate: collectionDate,
    returnDate: returnDate,
    accessories: selectedAccessories,
    customerName: customerName || ''
  });

  const waUrl = createWhatsAppUrl(
    settings?.whatsappNumber || '15558907629',
    waInquiryMsg
  );

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please provide your name and phone number for the atelier fitting record.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onBookOnline({
        suitId: suit.id,
        suitTitle: suit.title,
        suitSku: suit.sku,
        size: selectedSize,
        startDate: collectionDate,
        returnDate: returnDate,
        rentalFee,
        accessoriesFee,
        securityDeposit,
        damageWaiver: damageWaiverFee,
        total: totalDue,
        accessories: selectedAccessories,
        customerName,
        customerPhone,
        customerEmail,
        notes: bookingNotes || `Reserved online for ${selectedDuration} duration.`
      });
    } catch (err) {
      console.error(err);
      alert('Unable to submit reservation at this moment. Please reach out via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-obsidian-900 border border-charcoal-border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-border bg-obsidian-950/80">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs uppercase tracking-widest text-gold-500">
              {suit.sku}
            </span>
            <span className="text-charcoal-border">•</span>
            <span className="text-xs uppercase tracking-widest text-ivory-300">
              {suit.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-ivory-400 hover:text-ivory-100 hover:bg-obsidian-800 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visuals & Specifications (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Main Featured Photo */}
            <div className="relative aspect-[3/4] w-full bg-obsidian-950 border border-charcoal-border overflow-hidden">
              <img
                src={suit.images?.[activeImageIndex] || suit.images?.[0]}
                alt={suit.title}
                className="w-full h-full object-cover object-center filter brightness-95"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest bg-obsidian-950/90 text-gold-400 border border-gold-500/40">
                  {suit.fit}
                </span>
              </div>
            </div>

            {/* Thumbnail selector */}
            {suit.images && suit.images.length > 1 && (
              <div className="flex gap-2">
                {suit.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 border transition-all overflow-hidden ${
                      activeImageIndex === idx 
                        ? 'border-gold-500 ring-1 ring-gold-500/50' 
                        : 'border-charcoal-border opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Editorial Quote */}
            {suit.editorialQuote && (
              <div className="p-4 bg-obsidian-800/60 border-l-2 border-gold-500 text-xs italic text-ivory-300 font-serif leading-relaxed">
                "{suit.editorialQuote}"
              </div>
            )}

            {/* Garment Construction Specs */}
            <div className="p-4 bg-obsidian-950 border border-charcoal-border space-y-2.5">
              <h4 className="text-[11px] uppercase tracking-widest text-gold-400 font-medium">
                Atelier Craftsmanship Specs
              </h4>
              <div className="text-xs space-y-1.5 text-ivory-300">
                <div className="flex justify-between py-1 border-b border-charcoal-border/50">
                  <span className="text-ivory-400">Fabric Composition</span>
                  <span className="text-right font-light">{suit.fabric}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-charcoal-border/50">
                  <span className="text-ivory-400">Lapel Construction</span>
                  <span>{suit.lapel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-charcoal-border/50">
                  <span className="text-ivory-400">Ensemble Pieces</span>
                  <span>{suit.pieces}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-ivory-400">Tailoring Standard</span>
                  <span>Full Floating Canvas & Hand Basting</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Customization, Sizing & Rental Checkout (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            <div>
              {/* Title & Description */}
              <div className="border-b border-charcoal-border pb-4">
                <span className="text-xs uppercase tracking-widest text-gold-500/90 font-mono">
                  {suit.occasion}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-ivory-100 mt-1">
                  {suit.title}
                </h2>
                <p className="text-xs text-ivory-400 mt-2 font-light leading-relaxed">
                  {suit.description}
                </p>
              </div>

              {/* Rental Duration Options */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-ivory-300 mb-2">
                  <span>Select Rental Duration</span>
                  <span className="text-[11px] text-ivory-400 lowercase">eco-dry clean included</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: '3days', label: '3 Days', sub: 'Weekend Soirée' },
                    { key: '5days', label: '5 Days', sub: 'Extended Gala' },
                    { key: '7days', label: '7 Days', sub: 'Destination Wedding' }
                  ].map((dur) => (
                    <button
                      key={dur.key}
                      onClick={() => handleDurationChange(dur.key)}
                      className={`p-3 text-left border transition-all ${
                        selectedDuration === dur.key
                          ? 'border-gold-500 bg-gold-500/10 text-ivory-100'
                          : 'border-charcoal-border bg-obsidian-950 text-ivory-400 hover:border-ivory-300/30'
                      }`}
                    >
                      <div className="font-serif text-lg font-medium text-gold-400">
                        {settings?.currency || '$'}{suit.rentalPricing?.[dur.key] || 190}
                      </div>
                      <div className="text-xs font-medium uppercase tracking-wider mt-0.5">
                        {dur.label}
                      </div>
                      <div className="text-[10px] text-ivory-400 font-light truncate">
                        {dur.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates Selection */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-obsidian-950 border border-charcoal-border">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-ivory-300 mb-1.5 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold-500" />
                    <span>Collection Date</span>
                  </label>
                  <input
                    type="date"
                    value={collectionDate}
                    onChange={handleCollectionDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 text-xs px-3 py-2 rounded focus:outline-none focus:border-gold-500"
                  />
                  <p className="text-[10px] text-ivory-400 mt-1">
                    Pick up pristine in garment bag
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-ivory-300 mb-1.5 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold-500" />
                    <span>Return Date ({selectedDuration})</span>
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={collectionDate}
                    className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 text-xs px-3 py-2 rounded focus:outline-none focus:border-gold-500"
                  />
                  <p className="text-[10px] text-ivory-400 mt-1">
                    Return to atelier; we handle dry clean
                  </p>
                </div>
              </div>

              {/* Sizing Selection & Fit Finder Prompt */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-ivory-300 mb-2">
                  <span>Jacket & Trouser Sizing</span>
                  <button
                    onClick={onOpenFitFinder}
                    className="text-gold-400 hover:text-gold-300 text-[11px] flex items-center space-x-1 lowercase tracking-normal"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Don't know your size? Open Fit Finder</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(suit.sizes || []).map((szObj) => {
                    const isAvailable = szObj.availableStock > 0;
                    const isSelected = selectedSize === szObj.size;
                    return (
                      <button
                        key={szObj.size}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(szObj.size)}
                        className={`px-3.5 py-2 text-xs font-mono border transition-all ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500 text-obsidian-950 font-bold'
                            : isAvailable
                            ? 'border-charcoal-border bg-obsidian-950 text-ivory-200 hover:border-gold-500/50'
                            : 'border-charcoal-border/40 bg-obsidian-950/40 text-ivory-400/40 cursor-not-allowed line-through'
                        }`}
                      >
                        {szObj.size}
                        {isAvailable && (
                          <span className="block text-[8px] font-sans font-normal opacity-80">
                            {szObj.availableStock} in atelier
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Curated Luxury Accessories Checklist */}
              {accessories.length > 0 && (
                <div className="mt-5 pt-4 border-t border-charcoal-border">
                  <span className="text-xs uppercase tracking-wider text-ivory-300 block mb-2">
                    Pair with Atelier Accessories
                  </span>
                  <div className="space-y-2">
                    {accessories.slice(0, 3).map((acc) => {
                      const isChecked = selectedAccessories.includes(acc.name);
                      return (
                        <div
                          key={acc.id}
                          onClick={() => toggleAccessory(acc.name)}
                          className={`flex items-center justify-between p-2.5 border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? 'border-gold-500/80 bg-gold-500/10'
                              : 'border-charcoal-border bg-obsidian-950 hover:border-charcoal-border/80'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <div className={`w-4 h-4 border flex items-center justify-center ${
                              isChecked ? 'border-gold-500 bg-gold-500 text-obsidian-950' : 'border-ivory-400'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-ivory-200">{acc.name}</span>
                          </div>
                          <span className="font-mono text-gold-400">
                            +{settings?.currency || '$'}{acc.rentalPrice}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Damage Waiver Checkbox */}
              <div 
                onClick={() => setDamageWaiver(!damageWaiver)}
                className="mt-4 p-3 bg-obsidian-950 border border-charcoal-border flex items-start space-x-3 cursor-pointer text-xs"
              >
                <div className={`mt-0.5 w-4 h-4 border flex items-center justify-center shrink-0 ${
                  damageWaiver ? 'border-gold-500 bg-gold-500 text-obsidian-950' : 'border-ivory-400'
                }`}>
                  {damageWaiver && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-ivory-200 font-medium">Atelier Peace of Mind Waiver</span>
                    <span className="text-gold-400 font-mono">+{settings?.currency || '$'}15</span>
                  </div>
                  <p className="text-[11px] text-ivory-400 font-light mt-0.5">
                    Covers accidental wine spills, minor food stains, and loose button repairs with zero penalty.
                  </p>
                </div>
              </div>

            </div>

            {/* Price Breakdown & Actions */}
            <div className="pt-4 border-t border-charcoal-border space-y-4">
              
              {/* Cost Summary Table */}
              <div className="bg-obsidian-950 p-3.5 border border-charcoal-border space-y-1.5 text-xs text-ivory-300">
                <div className="flex justify-between">
                  <span>Suit Rental ({selectedDuration})</span>
                  <span className="font-mono">{settings?.currency || '$'}{rentalFee}</span>
                </div>
                {accessoriesFee > 0 && (
                  <div className="flex justify-between text-gold-400">
                    <span>Accessories Rental</span>
                    <span className="font-mono">+{settings?.currency || '$'}{accessoriesFee}</span>
                  </div>
                )}
                {damageWaiver && (
                  <div className="flex justify-between text-gold-400">
                    <span>Damage Waiver</span>
                    <span className="font-mono">+{settings?.currency || '$'}15</span>
                  </div>
                )}
                <div className="flex justify-between text-ivory-400 pt-1 border-t border-charcoal-border/60">
                  <span className="flex items-center space-x-1">
                    <span>Refundable Security Deposit</span>
                    <ShieldCheck className="w-3 h-3 text-gold-500" />
                  </span>
                  <span className="font-mono">{settings?.currency || '$'}{securityDeposit}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-charcoal-border text-sm font-medium text-ivory-100">
                  <span>Total Estimated At Pickup</span>
                  <span className="font-serif text-xl text-gold-400 font-bold">
                    {settings?.currency || '$'}{totalDue}
                  </span>
                </div>
                <p className="text-[10px] text-ivory-400 italic text-right">
                  *Deposit of {settings?.currency || '$'}{securityDeposit} is 100% refunded upon garment return.
                </p>
              </div>

              {/* Checkout Form toggle or CTA buttons */}
              {!showCheckoutForm ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* WhatsApp Direct Inquiry Button */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 py-3 px-4 border border-gold-500/60 bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 font-medium text-xs tracking-wider uppercase transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Inquire via WhatsApp</span>
                  </a>

                  {/* Reserve & Book Online Trigger */}
                  <button
                    onClick={() => setShowCheckoutForm(true)}
                    className="flex items-center justify-center space-x-2 py-3 px-4 bg-ivory-100 hover:bg-gold-500 text-obsidian-950 font-medium text-xs tracking-wider uppercase transition-colors shadow-lg"
                  >
                    <span>Reserve in Atelier</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>
              ) : (
                /* Interactive Direct Booking Form */
                <form onSubmit={handleSubmitBooking} className="p-4 bg-obsidian-950 border border-gold-500/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-gold-400 font-medium">
                      Confirm Atelier Fitting & Reservation
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCheckoutForm(false)}
                      className="text-[11px] text-ivory-400 hover:text-ivory-200 underline"
                    >
                      Back to options
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-ivory-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Lorde Sterling"
                        className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 text-xs px-3 py-2 rounded focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-ivory-300 mb-1">
                        Phone (WhatsApp preferred) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 text-xs px-3 py-2 rounded focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase text-ivory-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="client@prestigemail.com"
                        className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 text-xs px-3 py-2 rounded focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-ivory-300 mb-1">
                        Tailoring Notes / Event Details
                      </label>
                      <input
                        type="text"
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder="e.g. Black-tie Gala on Oct 28"
                        className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 text-xs px-3 py-2 rounded focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-widest uppercase transition-colors flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <span>Reserving in Atelier...</span>
                    ) : (
                      <>
                        <span>Submit Reservation & Reserve Garment</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-ivory-400 text-center">
                    No immediate online credit card required. Our master tailor confirms the reservation and prepares the suit for your fitting.
                  </p>
                </form>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
