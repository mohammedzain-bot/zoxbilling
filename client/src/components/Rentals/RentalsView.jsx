import React, { useState } from 'react';
import { Search, Plus, MessageSquare, FileText, CheckCircle, Clock, AlertTriangle, Eye, Phone, Calendar } from 'lucide-react';
import { createWhatsAppUrl, generateReturnReminderMessage, generateRentalInvoiceMessage } from '../../utils/whatsapp';
import RentalFormModal from './RentalFormModal';
import ReturnConfirmationModal from './ReturnConfirmationModal';
import { api } from '../../services/api';

export default function RentalsView({ 
  rentals = [], 
  settings, 
  catalog = [], 
  customers = [], 
  onRefresh, 
  onViewInvoice, 
  onOpenWhatsAppShare 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewRentalOpen, setIsNewRentalOpen] = useState(false);
  const [returnRentalTarget, setReturnRentalTarget] = useState(null);

  const currency = settings?.currency || '₹';
  const todayStr = new Date().toISOString().split('T')[0];

  // Filter rentals
  const filteredRentals = rentals.filter(r => {
    const matchesSearch = 
      r.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer_phone.includes(searchTerm) ||
      r.item_name.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return r.status === 'active';
    if (statusFilter === 'due_today') return r.status === 'active' && r.rental_end === todayStr;
    if (statusFilter === 'overdue') return r.status === 'active' && r.rental_end < todayStr;
    if (statusFilter === 'returned') return r.status === 'returned';

    return true;
  });

  const handleSaved = (newRental, actionType) => {
    onRefresh();
    if (actionType === 'invoice') {
      onViewInvoice(newRental.invoice_number);
    } else if (actionType === 'whatsapp') {
      onOpenWhatsAppShare(newRental.invoice_number);
    }
  };

  const handleReturnConfirm = async (rentalId, data) => {
    await api.markRentalReturned(rentalId, data);
    onRefresh();
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-offwhite-border">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-obsidian tracking-wide">
            Rentals Management
          </h1>
          <p className="text-xs text-muted-light mt-0.5">
            Suit, pants, shirt and t-shirt rentals with automatic return tracking.
          </p>
        </div>

        <button
          onClick={() => setIsNewRentalOpen(true)}
          className="w-full sm:w-auto px-4 py-3 sm:py-2.5 bg-charcoal hover:bg-obsidian text-offwhite text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-champagne" />
          <span>+ New Rental</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Filter Pills - scrollable on mobile */}
        <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-1.5 text-xs no-scrollbar">
          {[
            { id: 'all', label: 'All', count: rentals.length },
            { id: 'active', label: 'Active', count: rentals.filter(r => r.status === 'active').length },
            { id: 'due_today', label: 'Due Today', count: rentals.filter(r => r.status === 'active' && r.rental_end === todayStr).length, alert: true },
            { id: 'overdue', label: 'Overdue', count: rentals.filter(r => r.status === 'active' && r.rental_end < todayStr).length, alertDanger: true },
            { id: 'returned', label: 'Returned', count: rentals.filter(r => r.status === 'returned').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`whitespace-nowrap px-3 py-2 sm:py-1.5 border text-xs font-medium transition-colors flex items-center space-x-1.5 shrink-0 ${
                statusFilter === tab.id
                  ? 'border-obsidian bg-obsidian text-offwhite font-semibold'
                  : 'border-offwhite-border bg-white text-muted-light hover:text-obsidian'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
                tab.alertDanger && tab.count > 0 ? 'bg-red-700 text-white font-bold' :
                tab.alert && tab.count > 0 ? 'bg-amber-600 text-white font-bold' :
                statusFilter === tab.id ? 'bg-charcoal text-champagne' : 'bg-offwhite text-muted-light'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-auto sm:min-w-[260px]">
          <Search className="absolute left-3 top-3 sm:top-2.5 w-3.5 h-3.5 text-muted-light" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice, customer, item..."
            className="w-full bg-white border border-offwhite-border text-obsidian text-xs pl-8 pr-3 py-2.5 sm:py-2 focus:outline-none focus:border-champagne"
          />
        </div>

      </div>

      {/* MOBILE VIEW: Touch-friendly Card List (Hidden on desktop) */}
      <div className="block lg:hidden space-y-3">
        {filteredRentals.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-light italic bg-white border border-offwhite-border">
            No rentals recorded matching criteria.
          </div>
        ) : (
          filteredRentals.map(rental => {
            const isDueToday = rental.status === 'active' && rental.rental_end === todayStr;
            const isOverdue = rental.status === 'active' && rental.rental_end < todayStr;

            const waUrl = createWhatsAppUrl(
              rental.customer_phone,
              generateReturnReminderMessage(rental, isOverdue, settings)
            );

            return (
              <div 
                key={rental.id}
                className="bg-white border border-offwhite-border p-4 space-y-3 shadow-xs"
              >
                {/* Top Card Row: Invoice # & Status */}
                <div className="flex items-center justify-between pb-2 border-b border-offwhite-border">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-champagne-dark">
                      {rental.invoice_number}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-offwhite text-obsidian font-medium border border-offwhite-border">
                      {rental.item_category}
                    </span>
                  </div>

                  <div>
                    {rental.status === 'returned' ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-green-100 text-green-800 font-bold rounded">
                        Returned
                      </span>
                    ) : isOverdue ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-red-100 text-red-800 font-bold rounded flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Overdue</span>
                      </span>
                    ) : isDueToday ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-amber-100 text-amber-900 font-bold rounded flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Due Today</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-100 text-blue-800 font-bold rounded">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Garment Details & Customer */}
                <div>
                  <h3 className="font-serif text-sm font-bold text-obsidian">
                    {rental.item_name}
                  </h3>
                  <div className="text-xs text-muted-light mt-1 flex items-center space-x-1.5">
                    <span className="font-medium text-obsidian">{rental.customer_name}</span>
                    <span>•</span>
                    <span className="font-mono">{rental.customer_phone}</span>
                  </div>
                </div>

                {/* Rental Period */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-offwhite-surface p-2.5 border border-offwhite-border font-mono">
                  <div>
                    <span className="text-[10px] text-muted-light uppercase block">Start Date</span>
                    <span className="text-obsidian font-medium">{rental.rental_start}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-light uppercase block">Due Return</span>
                    <span className={`font-bold ${isOverdue ? 'text-red-600' : isDueToday ? 'text-amber-700' : 'text-obsidian'}`}>
                      {rental.rental_end}
                    </span>
                  </div>
                </div>

                {/* Amount and Pending */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-[10px] text-muted-light uppercase block">Total Fee</span>
                    <span className="font-mono font-bold text-obsidian">{currency}{rental.total_amount}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-muted-light uppercase block">Paid</span>
                    <span className="font-mono font-bold text-green-700">{currency}{rental.amount_paid}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-light uppercase block">Pending</span>
                    <span className={`font-mono font-bold ${rental.pending_amount > 0 ? 'text-red-600' : 'text-green-700'}`}>
                      {currency}{rental.pending_amount}
                    </span>
                  </div>
                </div>

                {/* Actions Grid on Mobile */}
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
                    onClick={() => onViewInvoice(rental.invoice_number)}
                    className="py-2.5 px-3 bg-offwhite border border-offwhite-border text-obsidian text-xs font-semibold rounded flex items-center justify-center space-x-1.5 hover:bg-offwhite-surface transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-champagne-dark" />
                    <span>Invoice</span>
                  </button>

                  {rental.status === 'active' && (
                    <button
                      onClick={() => setReturnRentalTarget(rental)}
                      className="col-span-2 py-2.5 px-3 bg-obsidian hover:bg-black text-offwhite text-xs font-semibold rounded flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      <span>Mark as Returned</span>
                    </button>
                  )}
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
              <th className="py-3 px-3.5">Customer</th>
              <th className="py-3 px-3.5">Clothing Item</th>
              <th className="py-3 px-3.5">Rental Start</th>
              <th className="py-3 px-3.5">Expected Return</th>
              <th className="py-3 px-3.5">Amount & Paid</th>
              <th className="py-3 px-3.5">Status</th>
              <th className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-offwhite-border/60">
            {filteredRentals.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-light italic">
                  No rentals recorded matching criteria.
                </td>
              </tr>
            ) : (
              filteredRentals.map(rental => {
                const isDueToday = rental.status === 'active' && rental.rental_end === todayStr;
                const isOverdue = rental.status === 'active' && rental.rental_end < todayStr;

                const waReminderUrl = createWhatsAppUrl(
                  rental.customer_phone,
                  generateReturnReminderMessage(rental, isOverdue, settings)
                );

                return (
                  <tr key={rental.id} className="hover:bg-offwhite-surface transition-colors">
                    {/* Invoice # */}
                    <td className="py-3 px-3.5 font-mono font-bold text-champagne-dark">
                      {rental.invoice_number}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-3.5">
                      <span className="font-medium text-obsidian block">
                        {rental.customer_name}
                      </span>
                      <span className="font-mono text-[11px] text-muted-light">
                        {rental.customer_phone}
                      </span>
                    </td>

                    {/* Item */}
                    <td className="py-3 px-3.5">
                      <span className="text-obsidian font-medium block">
                        {rental.item_name}
                      </span>
                      <span className="text-[10px] text-muted-light font-mono">
                        {rental.item_category} (Qty: {rental.quantity})
                      </span>
                    </td>

                    {/* Start Date */}
                    <td className="py-3 px-3.5 text-muted-light">
                      {rental.rental_start}
                    </td>

                    {/* Return Date */}
                    <td className="py-3 px-3.5 font-mono">
                      <span className={`block font-medium ${isOverdue ? 'text-red-700 font-bold' : isDueToday ? 'text-amber-700 font-bold' : 'text-obsidian'}`}>
                        {rental.rental_end}
                      </span>
                      <span className="text-[10px] text-muted-light">
                        {rental.duration_days} Days
                      </span>
                    </td>

                    {/* Financial Summary */}
                    <td className="py-3 px-3.5 font-mono">
                      <div className="font-bold text-obsidian">
                        {currency}{rental.total_amount}
                      </div>
                      <div className="text-[10px]">
                        <span className="text-muted-light">Paid: {currency}{rental.amount_paid}</span>
                        {rental.pending_amount > 0 && (
                          <span className="text-red-600 font-bold ml-1">
                            (Due: {currency}{rental.pending_amount})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3 px-3.5">
                      {rental.status === 'returned' ? (
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-green-100 text-green-800 font-bold rounded">
                          Returned
                        </span>
                      ) : isOverdue ? (
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-red-100 text-red-800 font-bold rounded flex items-center space-x-1 w-max">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Overdue</span>
                        </span>
                      ) : isDueToday ? (
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-amber-100 text-amber-900 font-bold rounded flex items-center space-x-1 w-max">
                          <Clock className="w-3 h-3" />
                          <span>Due Today</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-100 text-blue-800 font-bold rounded">
                          Active
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {/* WhatsApp Reminder */}
                      <a
                        href={waReminderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-muted-light hover:text-green-700 inline-block transition-colors"
                        title="Send WhatsApp Reminder"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>

                      {/* View Invoice */}
                      <button
                        onClick={() => onViewInvoice(rental.invoice_number)}
                        className="p-1.5 text-muted-light hover:text-obsidian transition-colors"
                        title="View & Print Invoice"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      {/* Mark Returned Button */}
                      {rental.status === 'active' && (
                        <button
                          onClick={() => setReturnRentalTarget(rental)}
                          className="px-2 py-1 bg-obsidian text-offwhite hover:bg-black text-[11px] font-medium tracking-wider uppercase transition-colors"
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Global New Rental Modal */}
      {isNewRentalOpen && (
        <RentalFormModal
          settings={settings}
          catalog={catalog}
          customers={customers}
          onClose={() => setIsNewRentalOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {/* Return Confirmation Dialog */}
      {returnRentalTarget && (
        <ReturnConfirmationModal
          rental={returnRentalTarget}
          settings={settings}
          onClose={() => setReturnRentalTarget(null)}
          onConfirm={handleReturnConfirm}
        />
      )}

    </div>
  );
}
