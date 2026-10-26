import React from 'react';
import { X, User, Phone, MapPin, ShoppingBag, Tag, FileText, MessageSquare, Clock } from 'lucide-react';
import { createWhatsAppUrl } from '../../utils/whatsapp';

export default function CustomerDetailModal({ customerDetail, onClose, onViewInvoice, settings }) {
  if (!customerDetail) return null;

  const { customer, rentals = [], sales = [], invoices = [], stats = {} } = customerDetail;
  const currency = settings?.currency || '₹';

  const waUrl = createWhatsAppUrl(
    customer.phone,
    `Hello ${customer.name}, this is ZOX store concierge. We are pleased to assist you with any purchases or rental inquiries.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative w-full sm:max-w-3xl bg-white border border-offwhite-border shadow-2xl overflow-hidden h-[95vh] sm:h-auto sm:max-h-[92vh] flex flex-col rounded-t-2xl sm:rounded-none">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-offwhite-border bg-offwhite-surface shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-champagne/20 border border-champagne/40 flex items-center justify-center text-champagne-dark font-bold text-sm">
              {customer.name?.charAt(0) || 'C'}
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-obsidian">{customer.name}</h2>
              <span className="text-[11px] font-mono text-muted-light block">
                Customer ID: #{customer.id} • Registered: {new Date(customer.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 sm:px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors rounded"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <button onClick={onClose} className="p-1.5 text-muted-light hover:text-obsidian rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5 text-xs">
          
          {/* Contact Details & Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 sm:p-4 bg-offwhite-surface border border-offwhite-border">
            <div>
              <span className="text-[10px] uppercase text-muted-light block">Mobile Number</span>
              <span className="font-mono text-obsidian font-bold block">{customer.phone}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-light block">Address</span>
              <span className="text-obsidian block truncate">{customer.address || '—'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-light block">Total Spent</span>
              <span className="font-mono text-obsidian font-bold block">{currency}{stats.total_spent || 0}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-muted-light block">Balance Due</span>
              <span className={`font-mono font-bold block ${(stats.total_pending_balance || 0) > 0 ? 'text-red-600' : 'text-green-700'}`}>
                {currency}{stats.total_pending_balance || 0}
              </span>
            </div>
          </div>

          {/* Transaction History Section */}
          <div className="space-y-3">
            <div className="border-b border-offwhite-border pb-2 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-obsidian">
                Transaction & Invoice History ({invoices.length})
              </span>
            </div>

            {invoices.length === 0 ? (
              <p className="text-xs text-muted-light italic text-center py-6">No previous transactions on file.</p>
            ) : (
              <div className="space-y-2.5">
                {/* Mobile list */}
                <div className="block sm:hidden space-y-2">
                  {invoices.map(inv => (
                    <div key={inv.invoice_number} className="p-3 bg-offwhite-surface border border-offwhite-border space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-champagne-dark">{inv.invoice_number}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded ${
                          inv.type === 'Rental' ? 'bg-blue-50 text-blue-800' : 'bg-emerald-50 text-emerald-800'
                        }`}>
                          {inv.type}
                        </span>
                      </div>
                      <div className="text-xs text-obsidian">{inv.item_summary}</div>
                      <div className="flex justify-between items-center pt-1 border-t border-offwhite-border">
                        <span className="font-mono font-bold text-obsidian">{currency}{inv.amount}</span>
                        <button
                          onClick={() => {
                            onClose();
                            onViewInvoice(inv.invoice_number);
                          }}
                          className="px-2 py-1 bg-white border border-offwhite-border text-[11px] font-semibold text-obsidian"
                        >
                          View Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto border border-offwhite-border">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-offwhite-border bg-offwhite-surface text-muted-light font-mono text-[10px] uppercase">
                        <th className="py-2.5 px-3">Invoice #</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Item Summary</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-offwhite-border/60">
                      {invoices.map(inv => (
                        <tr key={inv.invoice_number} className="hover:bg-offwhite-surface transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-champagne-dark">
                            {inv.invoice_number}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded ${
                              inv.type === 'Rental' ? 'bg-blue-50 text-blue-800' : 'bg-emerald-50 text-emerald-800'
                            }`}>
                              {inv.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-muted-light">{inv.date}</td>
                          <td className="py-2.5 px-3 text-obsidian font-medium max-w-xs truncate">{inv.item_summary}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-obsidian">{currency}{inv.amount}</td>
                          <td className="py-2.5 px-3">
                            <span className={`text-[10px] font-mono uppercase ${
                              inv.pending === 0 ? 'text-green-700 font-bold' : 'text-amber-700'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                onClose();
                                onViewInvoice(inv.invoice_number);
                              }}
                              className="px-2 py-1 bg-offwhite border border-offwhite-border hover:border-champagne text-[11px] font-medium"
                            >
                              Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
