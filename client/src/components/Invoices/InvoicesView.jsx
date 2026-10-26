import React, { useState } from 'react';
import { Search, Filter, Printer, MessageSquare, Eye, FileText, Download } from 'lucide-react';
import { createWhatsAppUrl, generateRentalInvoiceMessage, generateSaleInvoiceMessage } from '../../utils/whatsapp';

export default function InvoicesView({ 
  invoices = [], 
  settings, 
  onViewInvoice, 
  onOpenWhatsAppShare 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const currency = settings?.currency || '₹';

  const filtered = invoices.filter(inv => {
    const matchesSearch =
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customer_phone.includes(searchTerm) ||
      (inv.item_summary && inv.item_summary.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (typeFilter !== 'all' && inv.transaction_type.toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }

    if (paymentFilter !== 'all' && inv.payment_status !== paymentFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-offwhite-border">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-obsidian tracking-wide">
            Invoice History & Receipts
          </h1>
          <p className="text-xs text-muted-light mt-0.5">
            Audit history of all issued rental agreements and sales receipts.
          </p>
        </div>

        <div className="text-xs font-mono text-muted-light">
          Total Invoices: <strong className="text-obsidian">{invoices.length}</strong>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-offwhite-border text-obsidian px-2.5 py-2 sm:py-1.5 focus:outline-none focus:border-champagne"
          >
            <option value="all">All Types</option>
            <option value="Rental">Rentals</option>
            <option value="Sale">Sales</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-white border border-offwhite-border text-obsidian px-2.5 py-2 sm:py-1.5 focus:outline-none focus:border-champagne"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Fully Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="pending">Pending Payment</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-auto sm:min-w-[260px]">
          <Search className="absolute left-3 top-3 sm:top-2.5 w-3.5 h-3.5 text-muted-light" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice #, customer..."
            className="w-full bg-white border border-offwhite-border text-obsidian text-xs pl-8 pr-3 py-2.5 sm:py-2 focus:outline-none focus:border-champagne"
          />
        </div>

      </div>

      {/* MOBILE VIEW: Invoices Touch Cards (Hidden on desktop) */}
      <div className="block lg:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-light italic bg-white border border-offwhite-border">
            No invoices found matching criteria.
          </div>
        ) : (
          filtered.map(inv => (
            <div key={inv.invoice_number} className="bg-white border border-offwhite-border p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-offwhite-border">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-champagne-dark">
                    {inv.invoice_number}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded ${
                    inv.transaction_type === 'Rental' ? 'bg-blue-50 text-blue-800' : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    {inv.transaction_type}
                  </span>
                </div>

                <span className={`text-[10px] font-mono uppercase font-bold ${
                  inv.payment_status === 'paid' ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {inv.payment_status?.replace('_', ' ')}
                </span>
              </div>

              <div className="text-xs">
                <div className="font-medium text-obsidian text-sm">
                  {inv.customer_name}
                </div>
                <div className="text-muted-light font-mono text-[11px] mt-0.5">
                  {inv.customer_phone} • {inv.invoice_date}
                </div>
                <div className="text-muted-light text-xs mt-1">
                  {inv.item_summary}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-offwhite-border">
                <div className="font-mono text-base font-bold text-obsidian">
                  {currency}{inv.total_amount}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenWhatsAppShare(inv.invoice_number)}
                    className="p-2 bg-green-50 text-green-700 hover:bg-green-100 rounded"
                    title="WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onViewInvoice(inv.invoice_number)}
                    className="px-3 py-2 bg-charcoal text-offwhite hover:bg-obsidian text-xs font-medium rounded flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-champagne" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP VIEW: Full Table (Hidden on mobile) */}
      <div className="hidden lg:block bg-white border border-offwhite-border overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-offwhite-border text-muted-light font-mono text-[10px] uppercase bg-offwhite-surface">
              <th className="py-3 px-3.5">Invoice #</th>
              <th className="py-3 px-3.5">Type</th>
              <th className="py-3 px-3.5">Customer</th>
              <th className="py-3 px-3.5">Mobile</th>
              <th className="py-3 px-3.5">Invoice Date</th>
              <th className="py-3 px-3.5">Items Summary</th>
              <th className="py-3 px-3.5">Amount</th>
              <th className="py-3 px-3.5">Payment</th>
              <th className="py-3 px-3.5">WhatsApp</th>
              <th className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-offwhite-border/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-muted-light italic">
                  No invoices found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map(inv => (
                <tr key={inv.invoice_number} className="hover:bg-offwhite-surface transition-colors">
                  <td className="py-3 px-3.5 font-mono font-bold text-champagne-dark">
                    {inv.invoice_number}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded ${
                      inv.transaction_type === 'Rental' ? 'bg-blue-50 text-blue-800' : 'bg-emerald-50 text-emerald-800'
                    }`}>
                      {inv.transaction_type}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-medium text-obsidian">
                    {inv.customer_name}
                  </td>
                  <td className="py-3 px-3.5 font-mono text-muted-light">
                    {inv.customer_phone}
                  </td>
                  <td className="py-3 px-3.5 text-muted-light font-mono">
                    {inv.invoice_date}
                  </td>
                  <td className="py-3 px-3.5 text-obsidian max-w-xs truncate">
                    {inv.item_summary}
                  </td>
                  <td className="py-3 px-3.5 font-mono font-bold text-obsidian">
                    {currency}{inv.total_amount}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`text-[10px] font-mono uppercase font-bold ${
                      inv.payment_status === 'paid' ? 'text-green-700' : 'text-amber-700'
                    }`}>
                      {inv.payment_status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className={`text-[10px] font-mono uppercase ${
                      inv.whatsapp_status === 'shared_confirmed' ? 'text-green-700 font-bold' :
                      inv.whatsapp_status === 'whatsapp_opened' ? 'text-blue-700' : 'text-muted-light'
                    }`}>
                      {inv.whatsapp_status === 'shared_confirmed' ? 'Sent ✓' :
                       inv.whatsapp_status === 'whatsapp_opened' ? 'Opened' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => onOpenWhatsAppShare(inv.invoice_number)}
                      className="p-1.5 text-muted-light hover:text-green-700 transition-colors"
                      title="Open in WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onViewInvoice(inv.invoice_number)}
                      className="p-1.5 text-muted-light hover:text-obsidian transition-colors"
                      title="View & Print Invoice"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
