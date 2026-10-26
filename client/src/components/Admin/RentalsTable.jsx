import React, { useState } from 'react';
import { 
  Search, Filter, Plus, Eye, Printer, MessageSquare, 
  Calendar, AlertCircle, Clock, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { createWhatsAppUrl, generateReturnReminderMessage, generateOverdueAlertMessage } from '../../utils/whatsapp';

export default function RentalsTable({ 
  rentals = [], 
  settings, 
  onSelectRental, 
  onAddNewRental, 
  onPrintInvoice 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter rentals
  const filteredRentals = rentals.filter(r => {
    const matchesSearch = 
      r.rentalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.customerPhone && r.customerPhone.includes(searchTerm)) ||
      r.suitTitle.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return r.status === 'collected';
    if (statusFilter === 'confirmed') return r.status === 'confirmed';
    if (statusFilter === 'inquiry') return r.status === 'inquiry' || r.status === 'fitting_scheduled';
    if (statusFilter === 'overdue') {
      return (r.status === 'collected' || r.status === 'overdue') && r.returnDate < todayStr;
    }
    if (statusFilter === 'returned') return r.status === 'returned' || r.status === 'completed';

    return r.status === statusFilter;
  });

  const currency = settings?.currency || '$';

  return (
    <div className="space-y-4">
      
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-ivory-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client, phone, rental code, or suit..."
            className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 text-xs pl-9 pr-3 py-2 rounded focus:outline-none focus:border-gold-500"
          />
        </div>

        {/* Add Rental Button */}
        <button
          onClick={onAddNewRental}
          className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Rental Order</span>
        </button>

      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: 'all', label: 'All Orders', count: rentals.length },
          { id: 'active', label: 'Active with Clients', count: rentals.filter(r => r.status === 'collected').length },
          { id: 'confirmed', label: 'Confirmed / Pickups Due', count: rentals.filter(r => r.status === 'confirmed').length },
          { id: 'overdue', label: 'Overdue Returns', count: rentals.filter(r => (r.status === 'collected' || r.status === 'overdue') && r.returnDate < todayStr).length, alert: true },
          { id: 'inquiry', label: 'Inquiries & Fittings', count: rentals.filter(r => r.status === 'inquiry' || r.status === 'fitting_scheduled').length },
          { id: 'returned', label: 'Returned & Completed', count: rentals.filter(r => r.status === 'returned' || r.status === 'completed').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 border text-xs font-medium transition-colors flex items-center space-x-1.5 ${
              statusFilter === tab.id
                ? 'border-gold-500 bg-gold-500/15 text-gold-400'
                : 'border-charcoal-border bg-obsidian-950 text-ivory-400 hover:text-ivory-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
              tab.alert && tab.count > 0 ? 'bg-red-950 text-red-300 font-bold border border-red-500/40' : 'bg-charcoal text-ivory-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Rentals Table */}
      <div className="bg-obsidian-950 border border-charcoal-border overflow-x-auto">
        <table className="w-full text-left text-xs text-ivory-300">
          <thead>
            <tr className="border-b border-charcoal-border text-ivory-400 font-mono text-[10px] uppercase bg-obsidian-900/60">
              <th className="py-3 px-4">Order Code</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Suit & Size</th>
              <th className="py-3 px-4">Collection Date</th>
              <th className="py-3 px-4">Return Date</th>
              <th className="py-3 px-4">Financials</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-border/50">
            {filteredRentals.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-ivory-400 italic">
                  No rental orders found matching criteria.
                </td>
              </tr>
            ) : (
              filteredRentals.map(rental => {
                const isOverdue = (rental.status === 'collected' || rental.status === 'overdue') && rental.returnDate < todayStr;
                const isPickupToday = rental.startDate === todayStr && rental.status === 'confirmed';
                const isReturnToday = rental.returnDate === todayStr && rental.status === 'collected';

                return (
                  <tr 
                    key={rental.id}
                    onClick={() => onSelectRental(rental)}
                    className="hover:bg-obsidian-900/80 cursor-pointer transition-colors"
                  >
                    {/* Order Code */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-gold-400 font-medium">
                        {rental.rentalCode}
                      </span>
                      <span className="block text-[10px] text-ivory-400">
                        {new Date(rental.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <span className="font-serif text-sm font-bold text-ivory-100 block">
                        {rental.customerName}
                      </span>
                      <span className="text-[11px] text-ivory-400 font-mono">
                        {rental.customerPhone || '—'}
                      </span>
                    </td>

                    {/* Suit & Size */}
                    <td className="py-3.5 px-4">
                      <span className="text-ivory-200 font-medium block truncate max-w-[180px]">
                        {rental.suitTitle}
                      </span>
                      <span className="font-mono text-gold-400/90 text-[11px]">
                        Size: {rental.size} ({rental.suitSku})
                      </span>
                    </td>

                    {/* Collection Date */}
                    <td className="py-3.5 px-4">
                      <span className="text-ivory-200">{rental.startDate}</span>
                      {isPickupToday && (
                        <span className="block text-[9px] uppercase font-bold text-amber-400">
                          Pickup Today
                        </span>
                      )}
                    </td>

                    {/* Return Date */}
                    <td className="py-3.5 px-4">
                      <span className={`${isOverdue ? 'text-red-400 font-bold' : 'text-ivory-200'}`}>
                        {rental.returnDate}
                      </span>
                      {isOverdue && (
                        <span className="block text-[9px] uppercase font-bold text-red-400">
                          Overdue
                        </span>
                      )}
                      {isReturnToday && (
                        <span className="block text-[9px] uppercase font-bold text-amber-400">
                          Return Due Today
                        </span>
                      )}
                    </td>

                    {/* Financials */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-ivory-200">
                        Total: {currency}{rental.pricing?.total || 0}
                      </div>
                      {rental.pricing?.pendingBalance > 0 ? (
                        <span className="text-[10px] font-mono text-red-400 block">
                          Due: {currency}{rental.pricing.pendingBalance}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-green-400 block">
                          Fully Settled
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border rounded ${
                        isOverdue
                          ? 'bg-red-950/80 text-red-300 border-red-500/60 font-bold'
                          : rental.status === 'collected'
                          ? 'bg-blue-950/50 text-blue-300 border-blue-500/40'
                          : rental.status === 'confirmed'
                          ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40'
                          : rental.status === 'inquiry'
                          ? 'bg-amber-950/50 text-amber-300 border-amber-500/40'
                          : rental.status === 'returned' || rental.status === 'completed'
                          ? 'bg-zinc-800 text-zinc-300 border-zinc-600'
                          : 'bg-charcoal text-ivory-400 border-charcoal-border'
                      }`}>
                        {rental.status?.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* WhatsApp Quick Link */}
                        {rental.customerPhone && (
                          <a
                            href={createWhatsAppUrl(
                              rental.customerPhone,
                              isOverdue
                                ? generateOverdueAlertMessage(rental, settings)
                                : generateReturnReminderMessage(rental, settings)
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 border border-charcoal-border hover:border-gold-500/60 bg-charcoal hover:bg-gold-500/10 text-ivory-300 hover:text-gold-400 rounded transition-colors"
                            title="Open WhatsApp with Client"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {/* Print Invoice */}
                        <button
                          onClick={() => onPrintInvoice(rental)}
                          className="p-1.5 border border-charcoal-border hover:border-gold-500/60 bg-charcoal hover:bg-gold-500/10 text-ivory-300 hover:text-gold-400 rounded transition-colors"
                          title="Print Luxury Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* View Details */}
                        <button
                          onClick={() => onSelectRental(rental)}
                          className="p-1.5 border border-charcoal-border hover:border-gold-500/60 bg-charcoal hover:bg-gold-500/10 text-ivory-300 hover:text-gold-400 rounded transition-colors"
                          title="Open Order Inspector"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
