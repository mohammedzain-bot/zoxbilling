import React, { useState } from 'react';
import { X, Plus, Trash2, Tag, DollarSign, MessageSquare, Save, FileText, Check } from 'lucide-react';
import { api } from '../../services/api';

const CATEGORIES = ['Suit', 'Pants', 'Shirt', 'T-Shirt'];

export default function SaleFormModal({ 
  onClose, 
  onSaved, 
  settings, 
  catalog = [], 
  customers = [] 
}) {
  const currency = settings?.currency || '₹';

  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  // Multi-item Line Items
  const [items, setItems] = useState([
    {
      item_name: '',
      category: 'Suit',
      quantity: 1,
      original_price: '',
      offer_price: ''
    }
  ]);

  // Payment Details
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill from existing customer if phone matches
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

  // Add line item
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        item_name: '',
        category: 'Suit',
        quantity: 1,
        original_price: '',
        offer_price: ''
      }
    ]);
  };

  // Remove line item
  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    recalcTotal(updated);
  };

  const recalcTotal = (itemsList) => {
    const newTotal = itemsList.reduce((sum, item) => {
      const off = Number(item.offer_price) || 0;
      const qty = Math.max(1, Number(item.quantity) || 1);
      return sum + (off * qty);
    }, 0);
    setAmountPaid(newTotal);
  };

  // Update line item
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === 'original_price' && (!updated[index].offer_price || updated[index].offer_price === 0)) {
      updated[index].offer_price = value;
    }

    setItems(updated);
    recalcTotal(updated);
  };

  // Quick pick from catalog for a line item
  const handlePickFromCatalog = (index, catalogItem) => {
    if (!catalogItem) return;
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      item_name: catalogItem.name,
      category: CATEGORIES.includes(catalogItem.category) ? catalogItem.category : 'Suit',
      original_price: catalogItem.sale_original || 10000,
      offer_price: catalogItem.sale_offer || 8500
    };
    setItems(updated);
    recalcTotal(updated);
  };

  // Computations
  let totalOriginal = 0;
  let totalOffer = 0;
  let totalDiscount = 0;

  items.forEach(item => {
    const orig = Number(item.original_price) || 0;
    const off = Number(item.offer_price) !== undefined ? Number(item.offer_price) : orig;
    const qty = Math.max(1, Number(item.quantity) || 1);
    const discPerItem = Math.max(0, orig - off);

    totalOriginal += orig * qty;
    totalOffer += off * qty;
    totalDiscount += discPerItem * qty;
  });

  const finalInvoiceAmount = totalOffer;
  const pendingBalance = Math.max(0, finalInvoiceAmount - (Number(amountPaid) || 0));

  const handleAction = async (actionType) => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter customer name and mobile number.');
      return;
    }

    const hasEmptyItem = items.some(i => !i.item_name.trim());
    if (hasEmptyItem) {
      alert('Please provide a name for each clothing item in the sale.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        items: items.map(i => ({
          item_name: i.item_name,
          category: i.category,
          quantity: Number(i.quantity) || 1,
          original_price: Number(i.original_price) || 0,
          offer_price: Number(i.offer_price) || 0
        })),
        amount_paid: Number(amountPaid) || 0,
        payment_method: paymentMethod,
        notes
      };

      const created = await api.createSale(payload);
      onSaved(created, actionType);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error recording sale');
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
            <Tag className="w-5 h-5 text-champagne-dark" />
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-obsidian">
                New In-Store Sale Record
              </h2>
              <span className="text-[11px] text-muted-light block">
                Record buyer purchases for suits, pants, shirts and t-shirts.
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

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5 text-xs">
          
          {/* Customer Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-offwhite-border">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-light font-bold">
                1. Buyer / Customer Information
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
                  placeholder="e.g. Siddharth Rao"
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
                  placeholder="e.g. 919876543210"
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
                  placeholder="e.g. Juhu, Mumbai"
                  className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Purchased Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-offwhite-border">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-light font-bold">
                2. Clothing Items Sold ({items.length})
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 bg-champagne hover:bg-champagne-dark text-obsidian text-[11px] font-bold tracking-wider uppercase flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-offwhite-surface border border-offwhite-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-champagne-dark font-bold">
                      Item #{idx + 1}
                    </span>
                    <div className="flex items-center space-x-2">
                      {catalog.length > 0 && (
                        <select
                          onChange={(e) => {
                            const cItem = catalog.find(c => String(c.id) === e.target.value);
                            handlePickFromCatalog(idx, cItem);
                          }}
                          className="bg-white border border-offwhite-border text-[11px] text-obsidian px-2 py-1 focus:outline-none focus:border-champagne"
                        >
                          <option value="">Quick Fill from Catalog</option>
                          {catalog.map(c => (
                            <option key={c.id} value={c.id}>{c.name} ({currency}{c.sale_offer})</option>
                          ))}
                        </select>
                      )}

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase text-muted-light mb-1">
                        Clothing Item Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={item.item_name}
                        onChange={(e) => handleItemChange(idx, 'item_name', e.target.value)}
                        placeholder="e.g. Classic Charcoal Wool Suit"
                        className="w-full bg-white border border-offwhite-border text-obsidian px-3 py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-muted-light mb-1">
                        Category *
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                        className="w-full bg-white border border-offwhite-border text-obsidian px-3 py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne"
                      >
                        <option value="Suit">Suit</option>
                        <option value="Pants">Pants</option>
                        <option value="Shirt">Shirt</option>
                        <option value="T-Shirt">T-Shirt</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] uppercase text-muted-light mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="w-full bg-white border border-offwhite-border text-obsidian font-mono px-2.5 py-1.5 text-xs focus:outline-none focus:border-champagne"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-muted-light mb-1">
                        Original Price ({currency})
                      </label>
                      <input
                        type="number"
                        value={item.original_price}
                        onChange={(e) => handleItemChange(idx, 'original_price', e.target.value)}
                        className="w-full bg-white border border-offwhite-border text-obsidian font-mono px-2.5 py-1.5 text-xs focus:outline-none focus:border-champagne"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase text-muted-light mb-1">
                        Offer Price ({currency}) *
                      </label>
                      <input
                        type="number"
                        required
                        value={item.offer_price}
                        onChange={(e) => handleItemChange(idx, 'offer_price', e.target.value)}
                        className="w-full bg-white border border-offwhite-border text-obsidian font-mono font-bold px-2.5 py-1.5 text-xs focus:outline-none focus:border-champagne"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Financial Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-offwhite-border">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-light font-bold">
                3. Payment Details
              </span>
            </div>

            <div className="p-3.5 sm:p-4 bg-offwhite-surface border border-offwhite-border grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] uppercase text-muted-light block">Original Total</span>
                <span className="font-mono text-sm text-muted-light line-through">
                  {currency}{totalOriginal}
                </span>
                {totalDiscount > 0 && (
                  <span className="block text-[10px] text-green-700 font-bold">
                    Save {currency}{totalDiscount}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase text-muted-light block">Final Amount</span>
                <span className="font-mono text-base font-bold text-obsidian">
                  {currency}{finalInvoiceAmount}
                </span>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-muted-light mb-1">Amount Paid ({currency})</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full bg-white border border-offwhite-border text-obsidian font-mono px-2.5 py-1.5 text-xs focus:outline-none focus:border-champagne"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-muted-light mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-white border border-offwhite-border text-obsidian text-xs px-2.5 py-1.5 focus:outline-none focus:border-champagne"
                >
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="NetBanking">Net Banking</option>
                </select>
              </div>
            </div>

            {pendingBalance > 0 && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex justify-between">
                <span>Pending Balance to Collect Later:</span>
                <strong className="font-mono font-bold text-red-600">{currency}{pendingBalance}</strong>
              </div>
            )}
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-[11px] font-medium text-obsidian mb-1">
              Internal Sale Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Regular buyer, festive discount offered."
              className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-offwhite-border bg-offwhite-surface shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="hidden sm:block px-4 py-2 border border-offwhite-border text-muted-light hover:text-obsidian text-xs tracking-wider uppercase transition-colors"
          >
            Cancel
          </button>

          <div className="grid grid-cols-1 sm:flex items-center gap-2 w-full sm:w-auto">
            {/* 3. Save & Send on WhatsApp */}
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

            {/* 1. Save Sale */}
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
