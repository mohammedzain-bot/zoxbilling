import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function ReturnConfirmationModal({ rental, onClose, onConfirm, settings }) {
  if (!rental) return null;

  const currency = settings?.currency || '₹';
  const todayStr = new Date().toISOString().split('T')[0];

  const [actualReturnDate, setActualReturnDate] = useState(todayStr);
  const [condition, setCondition] = useState('Good');
  const [notes, setNotes] = useState('');
  const [approvedExtraCharges, setApprovedExtraCharges] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirm(rental.id, {
        actual_return_date: actualReturnDate,
        condition,
        notes,
        approved_extra_charges: Number(approvedExtraCharges) || 0
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to mark rental as returned.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full sm:max-w-lg bg-white border border-offwhite-border shadow-2xl p-5 sm:p-6 overflow-hidden rounded-t-2xl sm:rounded-none">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-offwhite-border">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-obsidian">
              Confirm Clothing Return
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted-light hover:text-obsidian rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item & Customer Summary */}
        <div className="my-4 p-3 bg-offwhite-surface border border-offwhite-border text-xs space-y-1">
          <div className="flex justify-between font-medium text-obsidian">
            <span className="font-bold">{rental.item_name} ({rental.item_category})</span>
            <span className="font-mono text-champagne-dark font-bold">{rental.invoice_number}</span>
          </div>
          <div className="text-muted-light">
            Customer: <strong className="text-obsidian">{rental.customer_name}</strong> ({rental.customer_phone})
          </div>
          <div className="text-muted-light">
            Scheduled Return: <span className="font-mono text-obsidian">{rental.rental_end}</span>
          </div>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-[11px] font-medium text-obsidian mb-1">
              Actual Return Date
            </label>
            <input
              type="date"
              required
              value={actualReturnDate}
              onChange={(e) => setActualReturnDate(e.target.value)}
              className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-obsidian mb-1">
              Clothing Condition Inspection
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
            >
              <option value="Good">Good / Flawless (Standard Dry Clean)</option>
              <option value="Minor Cleaning Needed">Minor Spills / Standard Pressing</option>
              <option value="Alteration Required">Minor Seam / Loose Button Repair</option>
              <option value="Damaged">Damaged / Stained (Requires Repair Fee)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-obsidian mb-1">
              Any Approved Additional Charges ({currency})
            </label>
            <input
              type="number"
              value={approvedExtraCharges}
              onChange={(e) => setApprovedExtraCharges(e.target.value)}
              placeholder="0"
              className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian font-mono px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-obsidian mb-1">
              Return & Condition Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Returned on time, garment in pristine shape."
              className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-offwhite-border flex flex-col sm:flex-row items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 border border-offwhite-border text-muted-light hover:text-obsidian uppercase tracking-wider text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-3 sm:py-2.5 bg-obsidian text-offwhite hover:bg-black font-semibold uppercase tracking-wider text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Mark as Returned</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
