import React, { useState } from 'react';
import { 
  X, CheckCircle, AlertTriangle, Calendar, DollarSign, 
  MessageSquare, Printer, Shield, Check, Clock, Trash2 
} from 'lucide-react';
import { 
  createWhatsAppUrl, 
  generateFittingReminderMessage, 
  generatePickupReadyMessage, 
  generateReturnReminderMessage, 
  generateOverdueAlertMessage, 
  generateDepositRefundMessage 
} from '../../utils/whatsapp';

export default function RentalDetailModal({ 
  rental, 
  settings, 
  onClose, 
  onUpdateRental, 
  onDeleteRental, 
  onPrintInvoice 
}) {
  if (!rental) return null;

  const [status, setStatus] = useState(rental.status || 'inquiry');
  const [startDate, setStartDate] = useState(rental.startDate || '');
  const [returnDate, setReturnDate] = useState(rental.returnDate || '');
  const [eventDate, setEventDate] = useState(rental.eventDate || '');
  const [paidAmount, setPaidAmount] = useState(rental.pricing?.paidAmount || 0);
  const [notes, setNotes] = useState(rental.notes || '');

  // Inspection Checklist
  const [seamsIntact, setSeamsIntact] = useState(rental.inspectionNotes?.seamsIntact ?? true);
  const [noStains, setNoStains] = useState(rental.inspectionNotes?.noStains ?? true);
  const [accessoriesReturned, setAccessoriesReturned] = useState(rental.inspectionNotes?.accessoriesReturned ?? false);
  const [inspectionComments, setInspectionComments] = useState(rental.inspectionNotes?.notes || '');

  const [isSaving, setIsSaving] = useState(false);

  const currency = settings?.currency || '$';
  const total = rental.pricing?.total || 0;
  const pendingBalance = Math.max(0, total - Number(paidAmount));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedData = {
        status,
        startDate,
        returnDate,
        eventDate,
        notes,
        pricing: {
          ...rental.pricing,
          paidAmount: Number(paidAmount),
          pendingBalance
        },
        paymentStatus: Number(paidAmount) >= total ? 'fully_paid' : Number(paidAmount) > 0 ? 'deposit_paid' : 'unpaid',
        inspectionNotes: {
          seamsIntact,
          noStains,
          accessoriesReturned,
          notes: inspectionComments
        }
      };

      await onUpdateRental(rental.id, updatedData);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update rental details.');
    } finally {
      setIsSaving(false);
    }
  };

  // WhatsApp link generator helpers
  const sendWhatsApp = (msg) => {
    const url = createWhatsAppUrl(rental.customerPhone, msg);
    window.open(url, '_blank');
  };

  const isOverdue = (status === 'collected' || status === 'overdue') && returnDate < new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-obsidian-900 border border-charcoal-border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-border bg-obsidian-950">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-sm font-bold text-gold-400">
              {rental.rentalCode}
            </span>
            <span className="text-charcoal-border">•</span>
            <span className="text-xs uppercase tracking-widest text-ivory-300">
              {rental.suitTitle} ({rental.size})
            </span>
            {isOverdue && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-red-900/60 text-red-200 border border-red-500/50 uppercase">
                Overdue Return
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPrintInvoice(rental)}
              className="p-1.5 text-ivory-300 hover:text-gold-400 border border-charcoal-border rounded hover:bg-obsidian-800 transition-colors"
              title="Print Luxury Invoice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-ivory-400 hover:text-ivory-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6 text-xs text-ivory-300">
          
          {/* Top Info Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-obsidian-950 border border-charcoal-border">
            <div>
              <span className="text-[10px] uppercase text-ivory-400 block mb-0.5">Customer</span>
              <span className="font-serif text-base text-ivory-100 font-bold block">{rental.customerName}</span>
              <span className="font-mono text-gold-400">{rental.customerPhone || 'No phone'}</span>
              <span className="block text-[11px] text-ivory-400 truncate">{rental.customerEmail}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-ivory-400 block mb-0.5">Garment & Fit</span>
              <span className="font-medium text-ivory-100 block">{rental.suitTitle}</span>
              <span className="text-gold-400 font-mono">Size: {rental.size} ({rental.suitSku})</span>
              {rental.accessories?.length > 0 && (
                <div className="text-[11px] text-ivory-400 mt-1">
                  Accessories: {rental.accessories.join(', ')}
                </div>
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase text-ivory-400 block mb-0.5">Rental Stage Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-obsidian-900 border border-gold-500/50 text-gold-300 text-xs px-2.5 py-1.5 rounded focus:outline-none uppercase font-mono tracking-wider"
              >
                <option value="inquiry">Inquiry Received</option>
                <option value="fitting_scheduled">Fitting Scheduled</option>
                <option value="confirmed">Confirmed & Reserved</option>
                <option value="collected">Collected / With Client</option>
                <option value="overdue">Overdue Notice</option>
                <option value="returned">Returned / Clean Check</option>
                <option value="completed">Completed & Closed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* WhatsApp Direct Customer Engagement Actions */}
          <div className="p-4 bg-obsidian-950 border border-charcoal-border space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-gold-400 font-mono block">
              Direct Customer WhatsApp Actions
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => sendWhatsApp(generateFittingReminderMessage(rental, settings))}
                className="px-3 py-1.5 bg-obsidian-900 border border-charcoal-border hover:border-gold-500/60 text-ivory-200 hover:text-gold-300 transition-colors flex items-center space-x-1.5 text-[11px]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-gold-500" />
                <span>Send Fitting Invite</span>
              </button>

              <button
                type="button"
                onClick={() => sendWhatsApp(generatePickupReadyMessage(rental, settings))}
                className="px-3 py-1.5 bg-obsidian-900 border border-charcoal-border hover:border-gold-500/60 text-ivory-200 hover:text-gold-300 transition-colors flex items-center space-x-1.5 text-[11px]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-gold-500" />
                <span>Notify Suit Ready for Pickup</span>
              </button>

              <button
                type="button"
                onClick={() => sendWhatsApp(generateReturnReminderMessage(rental, settings))}
                className="px-3 py-1.5 bg-obsidian-900 border border-charcoal-border hover:border-gold-500/60 text-ivory-200 hover:text-gold-300 transition-colors flex items-center space-x-1.5 text-[11px]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-gold-500" />
                <span>Send Friendly Return Reminder</span>
              </button>

              <button
                type="button"
                onClick={() => sendWhatsApp(generateOverdueAlertMessage(rental, settings))}
                className="px-3 py-1.5 bg-red-950/40 border border-red-500/50 hover:bg-red-900/40 text-red-300 transition-colors flex items-center space-x-1.5 text-[11px]"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Send Urgent Overdue Notice</span>
              </button>

              <button
                type="button"
                onClick={() => sendWhatsApp(generateDepositRefundMessage(rental, settings))}
                className="px-3 py-1.5 bg-obsidian-900 border border-charcoal-border hover:border-gold-500/60 text-ivory-200 hover:text-gold-300 transition-colors flex items-center space-x-1.5 text-[11px]"
              >
                <Shield className="w-3.5 h-3.5 text-gold-500" />
                <span>Confirm Deposit Release</span>
              </button>
            </div>
          </div>

          {/* Schedule & Financials Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Rental Schedule Dates */}
            <div className="p-4 bg-obsidian-950 border border-charcoal-border space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-gold-400 font-mono block">
                Rental Schedule Dates
              </span>
              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">Collection Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-1.5 rounded focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">Event Date (Optional)</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-1.5 rounded focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">Return Due Date</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-1.5 rounded focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Financials & Balance Tracker */}
            <div className="p-4 bg-obsidian-950 border border-charcoal-border space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-gold-400 font-mono block">
                Financials & Payments
              </span>
              <div className="space-y-1.5 text-xs text-ivory-300">
                <div className="flex justify-between">
                  <span>Suit Rental Fee:</span>
                  <span className="font-mono">{currency}{rental.pricing?.rentalFee || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Accessories Fee:</span>
                  <span className="font-mono">{currency}{rental.pricing?.accessoriesFee || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Refundable Deposit:</span>
                  <span className="font-mono">{currency}{rental.pricing?.securityDeposit || 100}</span>
                </div>
                <div className="flex justify-between font-bold text-ivory-100 pt-1 border-t border-charcoal-border">
                  <span>Total Order Due:</span>
                  <span className="font-mono text-gold-400">{currency}{total}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-charcoal-border/70">
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">
                  Amount Paid So Far ({currency})
                </label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-1.5 rounded focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs uppercase text-ivory-400">Pending Balance:</span>
                <span className={`font-mono text-sm font-bold ${pendingBalance > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {currency}{pendingBalance}
                </span>
              </div>
            </div>

          </div>

          {/* Garment Return Inspection Checklist */}
          <div className="p-4 bg-obsidian-950 border border-charcoal-border space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-gold-400 font-mono block">
              Garment Return & Inspection Checklist (Atelier Protocol)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label 
                onClick={() => setSeamsIntact(!seamsIntact)}
                className={`flex items-center space-x-2 p-2.5 border cursor-pointer ${
                  seamsIntact ? 'border-green-500/50 bg-green-950/20 text-ivory-200' : 'border-charcoal-border bg-obsidian-900 text-ivory-400'
                }`}
              >
                <div className={`w-4 h-4 border flex items-center justify-center ${seamsIntact ? 'border-green-500 bg-green-500 text-black' : 'border-ivory-400'}`}>
                  {seamsIntact && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>Seams & Canvas Intact</span>
              </label>

              <label 
                onClick={() => setNoStains(!noStains)}
                className={`flex items-center space-x-2 p-2.5 border cursor-pointer ${
                  noStains ? 'border-green-500/50 bg-green-950/20 text-ivory-200' : 'border-charcoal-border bg-obsidian-900 text-ivory-400'
                }`}
              >
                <div className={`w-4 h-4 border flex items-center justify-center ${noStains ? 'border-green-500 bg-green-500 text-black' : 'border-ivory-400'}`}>
                  {noStains && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>No Major Stains / Burns</span>
              </label>

              <label 
                onClick={() => setAccessoriesReturned(!accessoriesReturned)}
                className={`flex items-center space-x-2 p-2.5 border cursor-pointer ${
                  accessoriesReturned ? 'border-green-500/50 bg-green-950/20 text-ivory-200' : 'border-charcoal-border bg-obsidian-900 text-ivory-400'
                }`}
              >
                <div className={`w-4 h-4 border flex items-center justify-center ${accessoriesReturned ? 'border-green-500 bg-green-500 text-black' : 'border-ivory-400'}`}>
                  {accessoriesReturned && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span>Accessories Returned</span>
              </label>
            </div>

            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Inspection Notes</label>
              <input
                type="text"
                value={inspectionComments}
                onChange={(e) => setInspectionComments(e.target.value)}
                placeholder="e.g. Returned in flawless shape. Ready for luxury wet clean."
                className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-1.5 rounded focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Internal Atelier Notes */}
          <div>
            <label className="text-[10px] text-ivory-400 uppercase block mb-1">
              Internal Atelier Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Private notes about alterations, client requests, etc."
              className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-charcoal-border bg-obsidian-950">
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to delete this rental order?')) {
                onDeleteRental(rental.id);
                onClose();
              }
            }}
            className="flex items-center space-x-1.5 text-xs text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Rental</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-charcoal-border text-ivory-400 hover:text-ivory-100 text-xs tracking-wider uppercase"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-widest uppercase transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save & Update Rental'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
