import React, { useState } from 'react';
import { X, Printer, MessageSquare, Download, Check, Tag, ShoppingBag } from 'lucide-react';
import { createWhatsAppUrl, generateRentalInvoiceMessage, generateSaleInvoiceMessage } from '../../utils/whatsapp';
import { api } from '../../services/api';

export default function InvoiceModal({ invoice, onClose, onRefresh, settings }) {
  if (!invoice) return null;

  const [whatsappStatus, setWhatsappStatus] = useState(invoice.whatsapp_status || 'not_sent');
  const currency = settings?.currency || '₹';
  const isRental = invoice.type === 'Rental';

  // WhatsApp click-to-chat URL
  const waMessage = isRental
    ? generateRentalInvoiceMessage(
        {
          customer_name: invoice.customer?.name,
          invoice_number: invoice.invoice_number,
          total_amount: invoice.payment?.total_amount,
          item_name: invoice.rental_details?.item_name,
          rental_start: invoice.rental_details?.rental_start,
          rental_end: invoice.rental_details?.rental_end,
          duration_days: invoice.rental_details?.duration_days,
          amount_paid: invoice.payment?.amount_paid,
          pending_amount: invoice.payment?.pending_amount
        },
        settings
      )
    : generateSaleInvoiceMessage(
        {
          customer_name: invoice.customer?.name,
          invoice_number: invoice.invoice_number,
          total_amount: invoice.payment?.total_amount,
          items: invoice.items,
          total_discount: invoice.totals?.total_discount,
          amount_paid: invoice.payment?.amount_paid,
          pending_amount: invoice.payment?.pending_amount
        },
        settings
      );

  const waUrl = createWhatsAppUrl(invoice.customer?.phone, waMessage);

  const handlePrint = () => {
    window.print();
  };

  const handleOpenWhatsApp = () => {
    setWhatsappStatus('whatsapp_opened');
    window.open(waUrl, '_blank');
  };

  const handleConfirmShared = () => {
    setWhatsappStatus('shared_confirmed');
    const id = invoice.transaction_id;
    if (isRental) {
      api.updateRentalWhatsApp(id, 'shared_confirmed');
    } else {
      api.updateSaleWhatsApp(id, 'shared_confirmed');
    }
    if (onRefresh) onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full sm:max-w-3xl bg-white border border-offwhite-border shadow-2xl overflow-hidden h-[95vh] sm:h-auto sm:max-h-[95vh] flex flex-col rounded-t-2xl sm:rounded-none">
        
        {/* Screen Controls Header (Hidden in Print) */}
        <div className="no-print flex items-center justify-between px-4 sm:px-6 py-3 border-b border-offwhite-border bg-charcoal text-offwhite shrink-0">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-champagne">
              {invoice.invoice_number}
            </span>
            <span className="text-muted-light text-xs">•</span>
            <span className="text-xs uppercase font-mono tracking-wider text-offwhite">
              {invoice.type} Invoice
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-2.5 sm:px-3 py-1.5 bg-charcoal-card hover:bg-obsidian border border-charcoal-border text-xs text-offwhite font-medium flex items-center space-x-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-champagne" />
              <span className="hidden sm:inline">Print / Save PDF</span>
              <span className="sm:hidden">Print</span>
            </button>

            <button onClick={onClose} className="p-1 text-muted-light hover:text-offwhite rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WhatsApp Sharing Status Bar (Hidden in Print) */}
        <div className="no-print px-4 sm:px-6 py-2.5 bg-offwhite-surface border-b border-offwhite-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-muted-light">WhatsApp:</span>
            <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded ${
              whatsappStatus === 'shared_confirmed' ? 'bg-green-100 text-green-800' :
              whatsappStatus === 'whatsapp_opened' ? 'bg-blue-100 text-blue-800' : 'bg-offwhite text-muted-light border border-offwhite-border'
            }`}>
              {whatsappStatus === 'shared_confirmed' ? '✓ Shared Confirmed' :
               whatsappStatus === 'whatsapp_opened' ? 'WhatsApp Opened' : 'Not Sent'}
            </span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Open in WhatsApp</span>
            </button>

            {whatsappStatus === 'whatsapp_opened' && (
              <button
                onClick={handleConfirmShared}
                className="px-2.5 py-1.5 bg-offwhite border border-offwhite-border hover:border-obsidian text-obsidian text-xs font-medium"
              >
                Confirm Sent
              </button>
            )}
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-10 print-invoice-sheet text-zinc-900 bg-white space-y-6">
          
          {/* Invoice Header: Store Details */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-zinc-900 pb-5 gap-3">
            <div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-widest uppercase text-zinc-950">
                {settings?.store_name || 'ZOX'}
              </h1>
              <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-sans mt-0.5">
                Men's Clothing & Suit Rentals Atelier
              </p>
              <p className="text-xs text-zinc-600 mt-1 max-w-sm font-light leading-relaxed">
                {settings?.store_address || '123 Luxury Fashion Boulevard, Fort, Mumbai 400001'}
              </p>
              <p className="text-xs text-zinc-600 font-mono mt-0.5">
                Phone: {settings?.store_phone || '+91 98765 43210'}
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 bg-zinc-100 border border-zinc-300 font-mono text-sm uppercase font-bold text-zinc-900">
                {invoice.invoice_number}
              </span>
              <div className="text-xs text-zinc-600">
                Date: <span className="font-bold text-zinc-900">{invoice.invoice_date}</span>
              </div>
              <div className="text-xs text-zinc-600">
                Type: <span className="uppercase font-bold text-zinc-900">{invoice.type}</span>
              </div>
              <div className="text-xs text-zinc-600">
                Payment: <span className="uppercase font-bold text-zinc-900">{invoice.payment?.payment_status?.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Customer & Transaction Schedule Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs border-b border-zinc-200 pb-5">
            <div>
              <span className="font-mono uppercase text-zinc-400 text-[10px] font-bold block mb-1">
                Billed To (Customer)
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-zinc-900">{invoice.customer?.name}</h3>
              <p className="text-zinc-600 mt-0.5 font-mono">Mobile: {invoice.customer?.phone || 'N/A'}</p>
              {invoice.customer?.address && (
                <p className="text-zinc-600 mt-0.5">{invoice.customer.address}</p>
              )}
            </div>

            {isRental ? (
              <div className="space-y-1 bg-zinc-50 p-3 border border-zinc-200 text-xs">
                <span className="font-mono uppercase text-zinc-500 text-[10px] font-bold block mb-1">
                  Rental Return Schedule
                </span>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Taken Date (Start):</span>
                  <span className="font-medium font-mono text-zinc-900">{invoice.rental_details?.rental_start}</span>
                </div>
                <div className="flex justify-between font-bold text-zinc-900">
                  <span>Due Return Date:</span>
                  <span className="font-mono text-red-700">{invoice.rental_details?.rental_end}</span>
                </div>
                <div className="flex justify-between text-zinc-600 pt-1 border-t border-zinc-200">
                  <span>Rental Duration:</span>
                  <span className="font-mono">{invoice.rental_details?.duration_days} Days</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1 bg-zinc-50 p-3 border border-zinc-200 text-xs">
                <span className="font-mono uppercase text-zinc-500 text-[10px] font-bold block mb-1">
                  Payment Details
                </span>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Payment Method:</span>
                  <span className="font-medium text-zinc-900">{invoice.payment?.payment_method || 'UPI'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">Payment Status:</span>
                  <span className="font-bold uppercase text-zinc-900">{invoice.payment?.payment_status?.replace('_', ' ')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            {isRental ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-zinc-900 text-zinc-500 font-mono text-[10px] uppercase">
                    <th className="py-2.5">Item Description</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5 text-center">Duration</th>
                    <th className="py-2.5 text-right">Rental Charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="py-3">
                      <span className="font-bold text-zinc-900 text-sm block">
                        {invoice.rental_details?.item_name}
                      </span>
                      <span className="text-zinc-500 text-[11px]">
                        Professional dry-cleaned garment
                      </span>
                    </td>
                    <td className="py-3 font-mono text-zinc-700">
                      {invoice.rental_details?.category} (Qty: {invoice.rental_details?.quantity || 1})
                    </td>
                    <td className="py-3 text-center font-mono text-zinc-700">
                      {invoice.rental_details?.duration_days} Days
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-zinc-900">
                      {currency}{invoice.rental_details?.rental_price * (invoice.rental_details?.quantity || 1)}
                    </td>
                  </tr>

                  {invoice.rental_details?.additional_charges > 0 && (
                    <tr>
                      <td className="py-2.5 text-zinc-700">Additional Atelier Services / Accessories</td>
                      <td className="py-2.5 text-zinc-500">—</td>
                      <td className="py-2.5 text-center text-zinc-500">—</td>
                      <td className="py-2.5 text-right font-mono text-zinc-900">
                        {currency}{invoice.rental_details?.additional_charges}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-zinc-900 text-zinc-500 font-mono text-[10px] uppercase">
                    <th className="py-2.5">Item Description</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5 text-center">Qty</th>
                    <th className="py-2.5 text-right">Price</th>
                    <th className="py-2.5 text-right">Offer</th>
                    <th className="py-2.5 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {invoice.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 font-bold text-zinc-900">
                        {item.item_name}
                      </td>
                      <td className="py-3 font-mono text-zinc-700">
                        {item.category}
                      </td>
                      <td className="py-3 text-center font-mono text-zinc-700">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right font-mono text-zinc-500 line-through">
                        {currency}{item.original_price}
                      </td>
                      <td className="py-3 text-right font-mono text-zinc-900 font-bold">
                        {currency}{item.offer_price}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-zinc-950">
                        {currency}{item.line_total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Financial Totals Summary */}
          <div className="flex justify-end pt-4 border-t-2 border-zinc-900 text-xs">
            <div className="w-64 sm:w-72 space-y-1.5">
              {!isRental && invoice.totals?.total_discount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Total Discount:</span>
                  <span className="font-mono font-bold">-{currency}{invoice.totals.total_discount}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-600">
                <span>Final Total:</span>
                <span className="font-mono font-bold text-zinc-900">{currency}{invoice.payment?.total_amount}</span>
              </div>

              <div className="flex justify-between text-zinc-800">
                <span>Amount Paid:</span>
                <span className="font-mono font-bold text-green-700">{currency}{invoice.payment?.amount_paid}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t-2 border-zinc-900">
                <span>Pending Balance:</span>
                <span className={`font-mono ${(invoice.payment?.pending_amount || 0) > 0 ? 'text-red-700' : 'text-green-700'}`}>
                  {currency}{invoice.payment?.pending_amount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="pt-6 border-t border-zinc-200 text-[10px] text-zinc-500 space-y-4">
            <p className="italic text-center text-zinc-600 text-xs">
              "{invoice.footer || settings?.invoice_footer || 'Thank you for choosing ZOX.'}"
            </p>

            <div className="pt-4 grid grid-cols-2 gap-8 text-center text-zinc-600">
              <div className="border-t border-zinc-400 pt-1.5">
                <span className="uppercase text-[9px] font-mono tracking-wider block">Customer Signature</span>
              </div>
              <div className="border-t border-zinc-400 pt-1.5">
                <span className="uppercase text-[9px] font-mono tracking-wider block">ZOX Representative</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
