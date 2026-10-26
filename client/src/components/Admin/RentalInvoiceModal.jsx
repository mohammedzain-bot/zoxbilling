import React from 'react';
import { X, Printer, ShieldCheck, Sparkles } from 'lucide-react';

export default function RentalInvoiceModal({ rental, settings, onClose }) {
  if (!rental) return null;

  const handlePrint = () => {
    window.print();
  };

  const currency = settings?.currency || '$';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-white text-zinc-900 shadow-2xl p-8 sm:p-12 overflow-hidden my-auto printable-invoice">
        
        {/* Screen Controls (Hidden during print) */}
        <div className="no-print flex items-center justify-between pb-6 mb-6 border-b border-zinc-200">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">
            Official ZOX Rental Agreement & Tax Receipt
          </span>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs tracking-wider uppercase flex items-center space-x-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-zinc-900 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b-2 border-zinc-900">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-widest uppercase text-zinc-900">
              ZOX
            </h1>
            <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-sans mt-0.5">
              Haute Atelier & Men's Suit Rentals
            </p>
            <p className="text-xs text-zinc-600 mt-2 max-w-xs font-light">
              {settings?.address || '442 Madison Avenue, 8th Floor, New York, NY 10022'}
            </p>
            <p className="text-xs text-zinc-600 font-light">
              Concierge: {settings?.phone || '+1 (555) 890-7629'} • {settings?.email || 'concierge@zoxrentals.com'}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 text-left sm:text-right">
            <span className="inline-block px-2.5 py-1 bg-zinc-100 border border-zinc-300 font-mono text-xs uppercase font-bold text-zinc-800">
              {rental.rentalCode}
            </span>
            <div className="text-xs text-zinc-500 mt-2">
              Issue Date: <span className="font-medium text-zinc-800">{new Date(rental.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="text-xs text-zinc-500">
              Payment Status: <span className="uppercase font-bold text-zinc-900">{rental.paymentStatus?.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Client & Rental Schedule Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-zinc-200 text-xs">
          <div>
            <h3 className="font-mono uppercase tracking-wider text-zinc-400 text-[10px] mb-2 font-bold">
              Client Information
            </h3>
            <p className="font-serif text-lg font-bold text-zinc-900">{rental.customerName}</p>
            <p className="text-zinc-600 mt-1">Phone: {rental.customerPhone || 'N/A'}</p>
            <p className="text-zinc-600">Email: {rental.customerEmail || 'N/A'}</p>
          </div>

          <div>
            <h3 className="font-mono uppercase tracking-wider text-zinc-400 text-[10px] mb-2 font-bold">
              Rental Schedule & Return Date
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-500">Collection Date:</span>
                <span className="font-medium text-zinc-900">{rental.startDate}</span>
              </div>
              {rental.eventDate && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Event Date:</span>
                  <span className="font-medium text-zinc-900">{rental.eventDate}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-zinc-900 pt-1 border-t border-zinc-200">
                <span>Must Return By:</span>
                <span className="text-red-700">{rental.returnDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Garment Details & Financial Line Items */}
        <div className="py-6 border-b border-zinc-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-200 text-zinc-400 uppercase font-mono text-[10px]">
                <th className="py-2">Item Description</th>
                <th className="py-2">Size / SKU</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr>
                <td className="py-3">
                  <span className="font-bold text-zinc-900">{rental.suitTitle}</span>
                  <p className="text-zinc-500 text-[11px]">Bespoke tailored luxury rental with complimentary sleeve/hem basting</p>
                </td>
                <td className="py-3 font-mono text-zinc-700">{rental.size} ({rental.suitSku})</td>
                <td className="py-3 text-right font-mono font-medium">{currency}{rental.pricing?.rentalFee || 190}.00</td>
              </tr>
              {rental.accessories && rental.accessories.length > 0 && (
                <tr>
                  <td className="py-3">
                    <span className="font-bold text-zinc-900">Curated Accessories</span>
                    <p className="text-zinc-500 text-[11px]">{rental.accessories.join(', ')}</p>
                  </td>
                  <td className="py-3 font-mono text-zinc-700">Set</td>
                  <td className="py-3 text-right font-mono font-medium">{currency}{rental.pricing?.accessoriesFee || 0}.00</td>
                </tr>
              )}
              {rental.pricing?.damageWaiver > 0 && (
                <tr>
                  <td className="py-3">
                    <span className="font-bold text-zinc-900">Atelier Damage Protection Waiver</span>
                    <p className="text-zinc-500 text-[11px]">Accidental stain and loose button protection</p>
                  </td>
                  <td className="py-3 font-mono text-zinc-700">Standard</td>
                  <td className="py-3 text-right font-mono font-medium">{currency}{rental.pricing.damageWaiver}.00</td>
                </tr>
              )}
              <tr>
                <td className="py-3">
                  <span className="font-bold text-zinc-900">Refundable Security Deposit</span>
                  <p className="text-zinc-500 text-[11px]">Processed back to client upon undamaged garment inspection</p>
                </td>
                <td className="py-3 font-mono text-zinc-700">Deposit</td>
                <td className="py-3 text-right font-mono font-medium">{currency}{rental.pricing?.securityDeposit || 100}.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Totals */}
        <div className="py-6 flex justify-end text-xs">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal:</span>
              <span className="font-mono">{currency}{rental.pricing?.total || 0}.00</span>
            </div>
            <div className="flex justify-between text-zinc-900 font-medium">
              <span>Amount Paid:</span>
              <span className="font-mono text-green-700">{currency}{rental.pricing?.paidAmount || 0}.00</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-zinc-900 pt-2 border-t-2 border-zinc-900">
              <span>Pending Balance:</span>
              <span className="font-mono text-red-700">{currency}{rental.pricing?.pendingBalance || 0}.00</span>
            </div>
          </div>
        </div>

        {/* Terms & Signature */}
        <div className="pt-6 border-t border-zinc-200 text-[10px] text-zinc-500 space-y-4">
          <div className="space-y-1">
            <p className="font-bold text-zinc-700 uppercase">Atelier Rental Terms & Return Policy:</p>
            <p>1. Garments must be returned by the Return Date listed above in the provided ZOX garment bag and hanger.</p>
            <p>2. Do NOT attempt home laundering or commercial dry cleaning. ZOX conducts all specialized wet cleaning.</p>
            <p>3. Overdue returns are subject to a detention fee of {currency}{settings?.lateFeePerDay || 45}/day.</p>
          </div>

          <div className="pt-8 grid grid-cols-2 gap-12 text-center text-zinc-600">
            <div className="border-t border-zinc-400 pt-2">
              <span className="uppercase text-[9px] tracking-wider block">Client Signature</span>
            </div>
            <div className="border-t border-zinc-400 pt-2">
              <span className="uppercase text-[9px] tracking-wider block">Authorized Atelier Master Tailor</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
