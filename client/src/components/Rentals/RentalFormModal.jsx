import React, { useState, useEffect } from 'react';
import { X, Calendar, User, ShoppingBag, MessageSquare, Save, FileText } from 'lucide-react';
import { api } from '../../services/api';

const CATEGORIES = ['Suit', 'Pants', 'Shirt', 'T-Shirt'];

export default function RentalFormModal({ 
  onClose, 
  onSaved, 
  settings, 
  catalog = [], 
  customers = [] 
}) {
  const currency = settings?.currency || '₹';

  // Customer state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Clothing state
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('Suit');
  const [quantity, setQuantity] = useState(1);
  const [rentalPrice, setRentalPrice] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState(0);

  // Rental Period state
  const todayStr = new Date().toISOString().split('T')[0];
  const in3Days = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];

  const [rentalStart, setRentalStart] = useState(todayStr);
  const [rentalEnd, setRentalEnd] = useState(in3Days);
  const [dateError, setDateError] = useState('');

  // Payment state
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill from customer list if phone matches
  const handlePhoneChange = (val) => {
    setCustomerPhone(val);
    const clean = val.replace(/\D/g, '');
    if (clean.length >= 10) {
      const match = customers.find(c => c.phone.replace(/\D/g, '').endsWith(clean.slice(-10)));
      if (match) {
        if (!customerName) setCustomerName(match.name);
        if (!customerAddress && match.address) setCustomerAddress(match.address);
      }
    }
  };

  // Auto-fill from catalog
  const handleSelectFromCatalog = (item) => {
    if (!item) return;
    setItemName(item.name);
    setItemCategory(CATEGORIES.includes(item.category) ? item.category : 'Suit');
    setRentalPrice(item.rental_price || 2500);
    setAmountPaid((item.rental_price || 2500) * quantity + Number(additionalCharges));
  };

  // Automatic duration calculation
  const calculateDuration = () => {
    if (!rentalStart || !rentalEnd) return 1;
    const start = new Date(rentalStart);
    const end = new Date(rentalEnd);
    const diff = end - start;
    if (diff < 0) return 0;
    return Math.round(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const durationDays = calculateDuration();

  // Validate dates
  useEffect(() => {
    if (rentalEnd < rentalStart) {
      setDateError('Return date cannot be earlier than rental start date');
    } else {
      setDateError('');
    }
  }, [rentalStart, rentalEnd]);

  // Financial calculations
  const totalAmount = (Number(rentalPrice) || 0) * (Number(quantity) || 1) + (Number(additionalCharges) || 0);
  const pendingAmount = Math.max(0, totalAmount - (Number(amountPaid) || 0));

  const handleAction = async (actionType) => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter customer name and mobile number.');
      return;
    }
    if (!itemName.trim()) {
      alert('Please enter the clothing item name.');
      return;
    }
    if (rentalEnd < rentalStart) {
      alert('Expected return date cannot be earlier than rental start date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        item_name: itemName,
        item_category: itemCategory,
        quantity: Number(quantity) || 1,
        rental_price: Number(rentalPrice) || 0,
        additional_charges: Number(additionalCharges) || 0,
        amount_paid: Number(amountPaid) || 0,
        payment_method: paymentMethod,
        rental_start: rentalStart,
        rental_end: rentalEnd,
        notes
      };

      const created = await api.createRental(payload);
      onSaved(created, actionType);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error saving rental record');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full sm:max-w-3xl bg-white border border-offwhite-border shadow-2xl overflow-hidden h-[95vh] sm:h-auto sm:max-h-[92vh] flex flex-col rounded-t-2xl sm:rounded-none">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-offwhite-border bg-offwhite-surface shrink-0">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="w-5 h-5 text-champagne-dark" />
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-obsidian">
                New Rental Record
              </h2>
              <span className="text-[11px] text-muted-light block">
                Suit, Pants, Shirt & T-Shirt rentals with return tracking
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-muted-light hover:text-obsidian rounded-full sm:rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5 text-xs">
          
          {/* Section 1: Customer Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-offwhite-border">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-light font-bold">
                1. Customer Information
              </span>
              <span className="text-[10px] text-muted-light">
                Required for WhatsApp invoice
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-obsidian mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-obsidian mb-1">
                  Mobile Number (with Country Code) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="e.g. 919820112233"
                  className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian font-mono px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-obsidian mb-1">
                  Address (Optional)
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="e.g. Bandra West, Mumbai"
                  className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clothing Item Details */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1.5 border-b border-offwhite-border gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-light font-bold">
                2. Clothing Item Details
              </span>
              {catalog.length > 0 && (
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] text-muted-light">Catalog pick:</span>
                  <select
                    onChange={(e) => {
                      const item = catalog.find(c => String(c.id) === e.target.value);
                      handleSelectFromCatalog(item);
                    }}
                    className="bg-white border border-offwhite-border text-[11px] text-obsidian px-2 py-1 focus:outline-none focus:border-champagne"
                  >
                    <option value="">-- Choose From Catalog --</option>
                    {catalog.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({currency}{c.rental_price})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-obsidian mb-1">
                  Clothing Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Obsidian Black Tuxedo"
                  className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-obsidian mb-1">
                  Category *
                </label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne font-medium rounded-none"
                >
                  <option value="Suit">Suit</option>
                  <option value="Pants">Pants</option>
                  <option value="Shirt">Shirt</option>
                  <option value="T-Shirt">T-Shirt</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-obsidian mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian font-mono px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-obsidian mb-1">
                  Rental Price ({currency}) *
                </label>
                <input
                  type="number"
                  required
                  value={rentalPrice}
                  onChange={(e) => setRentalPrice(e.target.value)}
                  className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian font-mono px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-obsidian mb-1">
                  Additional Charges ({currency})
                </label>
                <input
                  type="number"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(e.target.value)}
                  placeholder="Alterations / Accessories"
                  className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian font-mono px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Rental Period */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-offwhite-border">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-light font-bold">
                3. Rental Period & Return Tracking
              </span>
              <span className="text-[11px] font-mono text-champagne-dark font-bold">
                Duration: {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[11px] font-medium text-obsidian mb-1 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-champagne-dark" />
                  <span>Rental Start Date / Taken Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={rentalStart}
                  onChange={(e) => setRentalStart(e.target.value)}
                  className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-obsidian mb-1 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-champagne-dark" />
                  <span>Expected Return Date / Due Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={rentalEnd}
                  onChange={(e) => setRentalEnd(e.target.value)}
                  min={rentalStart}
                  className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
                />
                {dateError && (
                  <span className="text-[10px] text-red-600 block mt-1">{dateError}</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Payment Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-offwhite-border">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-light font-bold">
                4. Payment & Financial Summary
              </span>
            </div>

            <div className="p-3.5 sm:p-4 bg-offwhite-surface border border-offwhite-border grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] uppercase text-muted-light block">Total Rental Fee</span>
                <span className="font-mono text-base font-bold text-obsidian">
                  {currency}{totalAmount}
                </span>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-muted-light mb-1">Amount Paid Now ({currency})</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full bg-white border border-offwhite-border text-obsidian font-mono px-2.5 py-1.5 text-xs focus:outline-none focus:border-champagne"
                />
              </div>

              <div>
                <span className="text-[10px] uppercase text-muted-light block">Pending Amount</span>
                <span className={`font-mono text-base font-bold ${pendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {currency}{pendingAmount}
                </span>
                <span className="text-[10px] text-muted-light block">
                  {pendingAmount === 0 ? 'Fully Paid' : 'Balance Due'}
                </span>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-muted-light mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-white border border-offwhite-border text-obsidian text-xs px-2.5 py-1.5 focus:outline-none focus:border-champagne"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="NetBanking">Net Banking</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Notes */}
          <div>
            <label className="block text-[11px] font-medium text-obsidian mb-1">
              Internal Notes / Event Details
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Wedding reception, customer will collect shoes as well"
              className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
            />
          </div>

        </div>

        {/* Footer Actions (Optimized for Mobile Touch) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-offwhite-border bg-offwhite-surface shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="hidden sm:block px-4 py-2 border border-offwhite-border text-muted-light hover:text-obsidian text-xs tracking-wider uppercase transition-colors"
          >
            Cancel
          </button>

          <div className="grid grid-cols-1 sm:flex items-center gap-2 w-full sm:w-auto">
            {/* 3. Save & Send Invoice on WhatsApp - prominent on mobile */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleAction('whatsapp')}
              className="w-full sm:w-auto px-4 py-3 sm:py-2.5 bg-champagne hover:bg-champagne-dark text-obsidian text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Save & WhatsApp Invoice</span>
            </button>

            {/* 2. Save & Generate Invoice */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleAction('invoice')}
              className="w-full sm:w-auto px-4 py-2.5 bg-charcoal hover:bg-obsidian text-offwhite text-xs font-semibold tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-champagne" />
              <span>Save & Generate Invoice</span>
            </button>

            {/* 1. Save Rental */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleAction('save')}
              className="w-full sm:w-auto px-3.5 py-2 bg-offwhite border border-offwhite-border hover:border-obsidian text-obsidian text-xs font-semibold tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-muted-light" />
              <span>Save Only</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="sm:hidden text-center py-2 text-muted-light text-xs tracking-wider uppercase"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
