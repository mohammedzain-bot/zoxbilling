import React, { useState } from 'react';
import { Search, Plus, Tag, FileText, MessageSquare, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { createWhatsAppUrl, generateSaleInvoiceMessage } from '../../utils/whatsapp';
import SaleFormModal from './SaleFormModal';

export default function BuyersView({ 
  sales = [], 
  settings, 
  catalog = [], 
  customers = [], 
  onRefresh, 
  onViewInvoice, 
  onOpenWhatsAppShare 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);

  const currency = settings?.currency || '₹';

  // Filter sales
  const filteredSales = sales.filter(s => {
    const matchesSearch = 
      s.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customer_phone.includes(searchTerm) ||
      (s.items && s.items.some(i => i.item_name.toLowerCase().includes(searchTerm.toLowerCase())));

    if (!matchesSearch) return false;

    if (paymentFilter === 'all') return true;
    return s.payment_status === paymentFilter;
  });

  const handleSaved = (newSale, actionType) => {
    onRefresh();
    if (actionType === 'invoice') {
      onViewInvoice(newSale.invoice_number);
    } else if (actionType === 'whatsapp') {
      onOpenWhatsAppShare(newSale.invoice_number);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header & New Sale Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-offwhite-border">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-obsidian tracking-wide">
            Buyers & Clothing Sales
          </h1>
          <p className="text-xs text-muted-light mt-0.5">
            In-store purchases for suits, pants, shirts, and t-shirts with invoices.
          </p>
        </div>

        <button
          onClick={() => setIsNewSaleOpen(true)}
          className="w-full sm:w-auto px-4 py-3 sm:py-2.5 bg-champagne hover:bg-champagne-dark text-obsidian text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Sale</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Payment Status Filter Pills */}
        <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-1.5 text-xs no-scrollbar">
          {[
            { id: 'all', label: 'All Sales', count: sales.length },
            { id: 'paid', label: 'Paid', count: sales.filter(s => s.payment_status === 'paid').length },
            { id: 'partially_paid', label: 'Partial', count: sales.filter(s => s.payment_status === 'partially_paid').length, alert: true },
            { id: 'pending', label: 'Pending', count: sales.filter(s => s.payment_status === 'pending').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setPaymentFilter(tab.id)}
              className={`whitespace-nowrap px-3 py-2 sm:py-1.5 border text-xs font-medium transition-colors flex items-center space-x-1.5 shrink-0 ${
                paymentFilter === tab.id
                  ? 'border-obsidian bg-obsidian text-offwhite font-semibold'
                  : 'border-offwhite-border bg-white text-muted-light hover:text-obsidian'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
                tab.alert && tab.count > 0 ? 'bg-amber-100 text-amber-900 font-bold' :
                paymentFilter === tab.id ? 'bg-charcoal text-champagne' : 'bg-offwhite text-muted-light'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-auto sm:min-w-[260px]">
          <Search className="absolute left-3 top-3 sm:top-2.5 w-3.5 h-3.5 text-muted-light" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice #, customer, item..."
            className="w-full bg-white border border-offwhite-border text-obsidian text-xs pl-8 pr-3 py-2.5 sm:py-2 focus:outline-none focus:border-champagne"
          />
        </div>

      </div>

      {/* MOBILE VIEW: Mobile Touch Cards (Hidden on desktop) */}
      <div className="block lg:hidden space-y-3">
        {filteredSales.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-light italic bg-white border border-offwhite-border">
            No sales recorded matching criteria.
          </div>
        ) : (
          filteredSales.map(sale => {
            const waUrl = createWhatsAppUrl(
              sale.customer_phone,
              generateSaleInvoiceMessage(sale, settings)
            );

            return (
              <div
                key={sale.id}
                className="bg-white border border-offwhite-border p-4 space-y-3 shadow-xs"
              >
                {/* Header Row: Invoice # and Payment Status */}
                <div className="flex items-center justify-between pb-2 border-b border-offwhite-border">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-champagne-dark">
                      {sale.invoice_number}
                    </span>
                    <span className="text-[10px] text-muted-light font-mono">
                      {sale.sale_date}
                    </span>
                  </div>

                  <div>
                    {sale.payment_status === 'paid' ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-green-100 text-green-800 font-bold rounded">
                        Paid
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-amber-100 text-amber-900 font-bold rounded">
                        {sale.payment_status?.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="text-xs">
                  <div className="font-medium text-obsidian text-sm">
                    {sale.customer_name}
                  </div>
                  <div className="text-muted-light font-mono text-[11px] mt-0.5">
                    {sale.customer_phone}
                  </div>
                </div>

                {/* Purchased Items List */}
                <div className="bg-offwhite-surface p-2.5 border border-offwhite-border text-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase text-muted-light block mb-1">
                    Purchased Items ({sale.items?.length || 0})
                  </span>
                  {sale.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-obsidian font-medium">
                        {it.item_name} <span className="text-muted-light font-mono">({it.category} x{it.quantity})</span>
                      </span>
                      <span className="font-mono font-bold text-obsidian">
                        {currency}{it.line_total}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Amount and Pending */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-muted-light uppercase block">Total</span>
                    <span className="font-mono font-bold text-obsidian">{currency}{sale.total_amount}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-muted-light uppercase block">Paid</span>
                    <span className="font-mono font-bold text-green-700">{currency}{sale.amount_paid}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-light uppercase block">Pending</span>
                    <span className={`font-mono font-bold ${sale.pending_amount > 0 ? 'text-red-600' : 'text-green-700'}`}>
                      {currency}{sale.pending_amount}
                    </span>
                  </div>
                </div>

                {/* Action Buttons on Mobile */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-offwhite-border">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => onViewInvoice(sale.invoice_number)}
                    className="py-2.5 px-3 bg-offwhite border border-offwhite-border text-obsidian text-xs font-semibold rounded flex items-center justify-center space-x-1.5 hover:bg-offwhite-surface transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-champagne-dark" />
                    <span>Invoice</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP VIEW: Full Table (Hidden on Mobile) */}
      <div className="hidden lg:block bg-white border border-offwhite-border overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-offwhite-border text-muted-light font-mono text-[10px] uppercase bg-offwhite-surface">
              <th className="py-3 px-3.5">Invoice #</th>
              <th className="py-3 px-3.5">Date</th>
              <th className="py-3 px-3.5">Customer</th>
              <th className="py-3 px-3.5">Purchased Items</th>
              <th className="py-3 px-3.5">Original / Disc.</th>
              <th className="py-3 px-3.5">Final Amount</th>
              <th className="py-3 px-3.5">Paid / Pending</th>
              <th className="py-3 px-3.5">Status</th>
              <th className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-offwhite-border/60">
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-muted-light italic">
                  No sales recorded matching criteria.
                </td>
              </tr>
            ) : (
              filteredSales.map(sale => {
                const waUrl = createWhatsAppUrl(
                  sale.customer_phone,
                  generateSaleInvoiceMessage(sale, settings)
                );

                return (
                  <tr key={sale.id} className="hover:bg-offwhite-surface transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-champagne-dark">
                      {sale.invoice_number}
                    </td>

                    <td className="py-3 px-3.5 text-muted-light font-mono">
                      {sale.sale_date}
                    </td>

                    <td className="py-3 px-3.5">
                      <span className="font-medium text-obsidian block">
                        {sale.customer_name}
                      </span>
                      <span className="font-mono text-[11px] text-muted-light">
                        {sale.customer_phone}
                      </span>
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="space-y-0.5">
                        {sale.items?.map((it, idx) => (
                          <div key={idx} className="text-obsidian">
                            {it.item_name} <span className="text-muted-light font-mono text-[10px]">({it.category} x{it.quantity})</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3.5 font-mono text-muted-light">
                      <div>Orig: {currency}{sale.original_total}</div>
                      {sale.total_discount > 0 && (
                        <div className="text-green-700 font-medium">-{currency}{sale.total_discount}</div>
                      )}
                    </td>

                    <td className="py-3 px-3.5 font-mono font-bold text-obsidian">
                      {currency}{sale.total_amount}
                    </td>

                    <td className="py-3 px-3.5 font-mono">
                      <div className="text-green-700 font-medium">Paid: {currency}{sale.amount_paid}</div>
                      {sale.pending_amount > 0 && (
                        <div className="text-red-600 font-bold">Due: {currency}{sale.pending_amount}</div>
                      )}
                    </td>

                    <td className="py-3 px-3.5">
                      {sale.payment_status === 'paid' ? (
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-green-100 text-green-800 font-bold rounded">
                          Paid
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-amber-100 text-amber-900 font-bold rounded">
                          {sale.payment_status?.replace('_', ' ')}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-muted-light hover:text-green-700 inline-block transition-colors"
                        title="Send WhatsApp Invoice"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => onViewInvoice(sale.invoice_number)}
                        className="p-1.5 text-muted-light hover:text-obsidian transition-colors"
                        title="View & Print Invoice"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Global New Sale Modal */}
      {isNewSaleOpen && (
        <SaleFormModal
          settings={settings}
          catalog={catalog}
          customers={customers}
          onClose={() => setIsNewSaleOpen(false)}
          onSaved={handleSaved}
        />
      )}

    </div>
  );
}
