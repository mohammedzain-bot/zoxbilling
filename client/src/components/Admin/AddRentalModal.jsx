import React, { useState } from 'react';
import { X, Plus, Calendar, DollarSign, Check } from 'lucide-react';

export default function AddRentalModal({ 
  suits = [], 
  customers = [], 
  accessories = [], 
  settings, 
  onClose, 
  onCreateRental 
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');

  const [selectedSuitId, setSelectedSuitId] = useState(suits[0]?.id || '');
  const selectedSuit = suits.find(s => s.id === selectedSuitId) || suits[0];

  const [selectedSize, setSelectedSize] = useState(() => {
    return selectedSuit?.sizes?.[0]?.size || '40R';
  });

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const in3Days = new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(tomorrow);
  const [returnDate, setReturnDate] = useState(in3Days);
  const [eventDate, setEventDate] = useState('');

  const [selectedAccessories, setSelectedAccessories] = useState([]);
  const [rentalFee, setRentalFee] = useState(selectedSuit?.rentalPricing?.["3days"] || 190);
  const [securityDeposit, setSecurityDeposit] = useState(selectedSuit?.securityDeposit || 100);
  const [paidAmount, setPaidAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update suit change
  const handleSuitChange = (id) => {
    setSelectedSuitId(id);
    const suit = suits.find(s => s.id === id);
    if (suit) {
      setSelectedSize(suit.sizes?.[0]?.size || '40R');
      setRentalFee(suit.rentalPricing?.["3days"] || 190);
      setSecurityDeposit(suit.securityDeposit || 100);
    }
  };

  const toggleAccessory = (accName) => {
    setSelectedAccessories(prev =>
      prev.includes(accName) ? prev.filter(a => a !== accName) : [...prev, accName]
    );
  };

  const accessoriesFee = selectedAccessories.reduce((sum, accName) => {
    const item = accessories.find(a => a.name === accName);
    return sum + (item ? item.rentalPrice : 25);
  }, 0);

  const total = Number(rentalFee) + accessoriesFee + Number(securityDeposit);
  const pendingBalance = Math.max(0, total - Number(paidAmount));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const existingCust = customers.find(c => c.id === selectedCustomerId);
    const custName = existingCust ? existingCust.name : newCustomerName;
    const custPhone = existingCust ? existingCust.phone : newCustomerPhone;
    const custEmail = existingCust ? existingCust.email : newCustomerEmail;

    if (!custName || !custPhone) {
      alert('Please provide customer name and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateRental({
        customerId: existingCust ? existingCust.id : null,
        customerName: custName,
        customerPhone: custPhone,
        customerEmail: custEmail,
        suitId: selectedSuit?.id,
        suitTitle: selectedSuit?.title,
        suitSku: selectedSuit?.sku,
        size: selectedSize,
        startDate,
        returnDate,
        eventDate,
        accessories: selectedAccessories,
        rentalFee: Number(rentalFee),
        accessoriesFee,
        securityDeposit: Number(securityDeposit),
        paidAmount: Number(paidAmount),
        status: 'confirmed',
        notes: notes || 'Booked by staff in atelier.'
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to create rental.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currency = settings?.currency || '$';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-obsidian-900 border border-charcoal-border shadow-2xl p-6 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-border">
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4 text-gold-500" />
            <h3 className="font-serif text-xl text-ivory-100">Create New Rental Booking</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-ivory-400 hover:text-ivory-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4 text-xs text-ivory-300">
          
          {/* Customer Selection or Create New */}
          <div className="p-3 bg-obsidian-950 border border-charcoal-border space-y-3">
            <span className="text-[10px] uppercase tracking-wider text-gold-400 font-mono block">
              1. Customer Profile
            </span>
            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">
                Select Existing Client (or create new below)
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
              >
                <option value="">-- Create New Client Below --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>

            {!selectedCustomerId && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="text-[10px] text-ivory-400 uppercase block mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="Lord Vance"
                    className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2.5 py-1.5 rounded focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-ivory-400 uppercase block mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2.5 py-1.5 rounded focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-ivory-400 uppercase block mb-1">Email</label>
                  <input
                    type="email"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="client@mail.com"
                    className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2.5 py-1.5 rounded focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Garment & Sizing */}
          <div className="p-3 bg-obsidian-950 border border-charcoal-border space-y-3">
            <span className="text-[10px] uppercase tracking-wider text-gold-400 font-mono block">
              2. Garment & Size
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">Select Suit</label>
                <select
                  value={selectedSuitId}
                  onChange={(e) => handleSuitChange(e.target.value)}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
                >
                  {suits.map(s => (
                    <option key={s.id} value={s.id}>{s.title} ({s.sku})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">Size</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500 font-mono"
                >
                  {selectedSuit?.sizes?.map(sz => (
                    <option key={sz.size} value={sz.size}>
                      {sz.size} ({sz.availableStock} available)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="p-3 bg-obsidian-950 border border-charcoal-border space-y-3">
            <span className="text-[10px] uppercase tracking-wider text-gold-400 font-mono block">
              3. Rental Schedule
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">Collection Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2.5 py-1.5 rounded focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2.5 py-1.5 rounded focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">Return Date</label>
                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2.5 py-1.5 rounded focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>
          </div>

          {/* Accessories Checklist */}
          {accessories.length > 0 && (
            <div className="p-3 bg-obsidian-950 border border-charcoal-border">
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-mono block mb-2">
                Curated Accessories (Optional)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {accessories.map(acc => {
                  const isChecked = selectedAccessories.includes(acc.name);
                  return (
                    <div
                      key={acc.id}
                      onClick={() => toggleAccessory(acc.name)}
                      className={`p-2 border cursor-pointer flex items-center justify-between transition-colors ${
                        isChecked ? 'border-gold-500 bg-gold-500/10 text-ivory-100' : 'border-charcoal-border bg-obsidian-900 text-ivory-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-3.5 h-3.5 border flex items-center justify-center ${
                          isChecked ? 'border-gold-500 bg-gold-500 text-obsidian-950' : 'border-ivory-400'
                        }`}>
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="truncate">{acc.name}</span>
                      </div>
                      <span className="font-mono text-gold-400 shrink-0">+{currency}{acc.rentalPrice}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Financial Breakdown */}
          <div className="p-3 bg-obsidian-950 border border-charcoal-border space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-gold-400 font-mono block">
              4. Payment & Security Deposit
            </span>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">Rental Fee ({currency})</label>
                <input
                  type="number"
                  value={rentalFee}
                  onChange={(e) => setRentalFee(Number(e.target.value))}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2.5 py-1.5 rounded focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">Deposit ({currency})</label>
                <input
                  type="number"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2.5 py-1.5 rounded focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">Paid Now ({currency})</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2.5 py-1.5 rounded focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between items-baseline border-t border-charcoal-border/70 text-xs">
              <span className="text-ivory-400">Total: <span className="text-gold-400 font-bold">{currency}{total}</span></span>
              <span className="text-ivory-400">Pending Balance: <span className={`font-bold font-mono ${pendingBalance > 0 ? 'text-red-400' : 'text-green-400'}`}>{currency}{pendingBalance}</span></span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-widest uppercase transition-colors"
          >
            {isSubmitting ? 'Creating Order...' : 'Confirm & Reserve Rental'}
          </button>
        </form>

      </div>
    </div>
  );
}
