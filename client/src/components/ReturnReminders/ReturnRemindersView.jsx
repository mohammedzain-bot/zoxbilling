import React, { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, MessageSquare, Search, Filter, Calendar, FileText } from 'lucide-react';
import { createWhatsAppUrl, generateReturnReminderMessage } from '../../utils/whatsapp';
import ReturnConfirmationModal from '../Rentals/ReturnConfirmationModal';
import { api } from '../../services/api';

export default function ReturnRemindersView({ 
  returnSummary, 
  settings, 
  onRefresh, 
  onViewInvoice 
}) {
  const [activeSection, setActiveSection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [returnRentalTarget, setReturnRentalTarget] = useState(null);

  const currency = settings?.currency || '₹';
  const counts = returnSummary?.counts || {};
  const sections = returnSummary?.sections || {};

  const handleReturnConfirm = async (id, returnData) => {
    await api.markRentalReturned(id, returnData);
    onRefresh();
  };

  // Helper to render records (Both Mobile Cards and Desktop Table)
  const renderRentalList = (list = [], sectionType = 'neutral') => {
    const filtered = list.filter(r =>
      r.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer_phone.includes(searchTerm) ||
      r.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filtered.length === 0) {
      return (
        <div className="py-6 text-center text-xs text-muted-light italic bg-white border border-offwhite-border">
          No records in this category matching search.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {/* MOBILE CARDS (Hidden on desktop) */}
        <div className="block lg:hidden space-y-3">
          {filtered.map(rental => {
            const isOverdue = sectionType === 'overdue' || rental.days_diff < 0;
            const isDueToday = sectionType === 'dueToday' || rental.days_diff === 0;

            const waReminderUrl = createWhatsAppUrl(
              rental.customer_phone,
              generateReturnReminderMessage(rental, isOverdue, settings)
            );

            return (
              <div 
                key={rental.id}
                className="bg-white border border-offwhite-border p-4 space-y-3 shadow-xs"
              >
                {/* Header Row: Due status & Invoice */}
                <div className="flex items-center justify-between pb-2 border-b border-offwhite-border">
                  <span className="font-mono text-xs font-bold text-champagne-dark">
                    {rental.invoice_number}
                  </span>

                  <div>
                    {rental.status === 'returned' ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-green-100 text-green-800 font-bold rounded">
                        Returned
                      </span>
                    ) : isOverdue ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-red-100 text-red-800 font-bold rounded flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{rental.days_overdue} {rental.days_overdue === 1 ? 'Day' : 'Days'} Overdue</span>
                      </span>
                    ) : isDueToday ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-amber-100 text-amber-900 font-bold rounded flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Due Today</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-100 text-blue-800 font-bold rounded">
                        In {rental.days_remaining} {rental.days_remaining === 1 ? 'day' : 'days'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Clothing & Customer */}
                <div>
                  <h3 className="font-serif text-sm font-bold text-obsidian">
                    {rental.item_name}
                  </h3>
                  <div className="text-xs text-muted-light mt-0.5">
                    Category: <span className="font-medium text-obsidian">{rental.item_category}</span>
                  </div>
                  <div className="text-xs text-muted-light mt-1 flex items-center space-x-1.5">
                    <span className="font-medium text-obsidian">{rental.customer_name}</span>
                    <span>•</span>
                    <span className="font-mono">{rental.customer_phone}</span>
                  </div>
                </div>

                {/* Dates & Financials */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-offwhite-surface p-2.5 border border-offwhite-border font-mono">
                  <div>
                    <span className="text-[10px] text-muted-light uppercase block">Rental Start</span>
                    <span className="text-obsidian">{rental.rental_start}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-light uppercase block">Expected Return</span>
                    <span className={`font-bold ${isOverdue ? 'text-red-700' : isDueToday ? 'text-amber-700' : 'text-obsidian'}`}>
                      {rental.rental_end}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-light uppercase block">Total Fee</span>
                    <span className="text-obsidian font-bold">{currency}{rental.total_amount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-light uppercase block">Pending</span>
                    <span className={`font-bold ${rental.pending_amount > 0 ? 'text-red-600' : 'text-green-700'}`}>
                      {currency}{rental.pending_amount}
                    </span>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-offwhite-border">
                  <a
                    href={waReminderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send WhatsApp Reminder</span>
                  </a>

                  {rental.status !== 'returned' && (
                    <button
                      onClick={() => setReturnRentalTarget(rental)}
                      className="py-2.5 px-3 bg-obsidian hover:bg-black text-offwhite text-xs font-semibold rounded flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      <span>Mark as Returned</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP TABLE (Hidden on mobile) */}
        <div className="hidden lg:block bg-white border border-offwhite-border overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-offwhite-border text-muted-light font-mono text-[10px] uppercase bg-offwhite-surface">
                <th className="py-3 px-3.5">Customer</th>
                <th className="py-3 px-3.5">Clothing Item</th>
                <th className="py-3 px-3.5">Start Date</th>
                <th className="py-3 px-3.5">Expected Return</th>
                <th className="py-3 px-3.5">Time Status</th>
                <th className="py-3 px-3.5">Rental Fee</th>
                <th className="py-3 px-3.5">Pending Payment</th>
                <th className="py-3 px-3.5">Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-offwhite-border/60">
              {filtered.map(rental => {
                const isOverdue = sectionType === 'overdue' || rental.days_diff < 0;
                const isDueToday = sectionType === 'dueToday' || rental.days_diff === 0;

                const waReminderUrl = createWhatsAppUrl(
                  rental.customer_phone,
                  generateReturnReminderMessage(rental, isOverdue, settings)
                );

                return (
                  <tr key={rental.id} className="hover:bg-offwhite-surface transition-colors">
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
                        {rental.item_category} ({rental.invoice_number})
                      </span>
                    </td>

                    {/* Start Date */}
                    <td className="py-3 px-3.5 text-muted-light">
                      {rental.rental_start}
                    </td>

                    {/* Expected Return */}
                    <td className="py-3 px-3.5 font-mono font-medium text-obsidian">
                      {rental.rental_end}
                    </td>

                    {/* Time Remaining / Overdue */}
                    <td className="py-3 px-3.5">
                      {rental.status === 'returned' ? (
                        <span className="text-green-700 font-mono text-[11px]">
                          Returned {rental.return_date_actual || ''}
                        </span>
                      ) : isOverdue ? (
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-red-100 text-red-800 font-bold rounded flex items-center space-x-1 w-max">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{rental.days_overdue} {rental.days_overdue === 1 ? 'Day' : 'Days'} Overdue</span>
                        </span>
                      ) : isDueToday ? (
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-amber-100 text-amber-900 font-bold rounded flex items-center space-x-1 w-max">
                          <Clock className="w-3 h-3" />
                          <span>Due Today</span>
                        </span>
                      ) : (
                        <span className="font-mono text-muted-light text-[11px]">
                          In {rental.days_remaining} {rental.days_remaining === 1 ? 'day' : 'days'}
                        </span>
                      )}
                    </td>

                    {/* Rental Amount */}
                    <td className="py-3 px-3.5 font-mono font-bold text-obsidian">
                      {currency}{rental.total_amount}
                    </td>

                    {/* Pending Payment */}
                    <td className="py-3 px-3.5 font-mono">
                      {rental.pending_amount > 0 ? (
                        <span className="text-red-600 font-bold">
                          {currency}{rental.pending_amount}
                        </span>
                      ) : (
                        <span className="text-green-700">Paid in Full</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3.5">
                      <span className={`text-[10px] font-mono uppercase ${
                        rental.status === 'returned' ? 'text-green-700 font-bold' : 'text-blue-700'
                      }`}>
                        {rental.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-3.5 text-right space-x-2 whitespace-nowrap">
                      {/* WhatsApp Reminder Button */}
                      <a
                        href={waReminderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-green-50 hover:bg-green-100 border border-green-300 text-green-900 text-xs font-semibold rounded inline-flex items-center space-x-1.5 transition-colors"
                        title="Send Return Reminder on WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3 text-green-700" />
                        <span>Remind</span>
                      </a>

                      {/* Mark as Returned Button */}
                      {rental.status !== 'returned' && (
                        <button
                          onClick={() => setReturnRentalTarget(rental)}
                          className="px-2.5 py-1 bg-charcoal hover:bg-obsidian text-offwhite text-xs font-medium uppercase tracking-wider transition-colors inline-flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3 h-3 text-champagne" />
                          <span>Return</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-offwhite-border">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-obsidian tracking-wide">
            Return Reminders & Tracking
          </h1>
          <p className="text-xs text-muted-light mt-0.5">
            Automatic due-date detection based on Asia/Kolkata timezone with WhatsApp reminders.
          </p>
        </div>

        <div className="text-xs font-mono text-muted-light">
          Active with Clients: <strong className="text-obsidian">{counts.total_outstanding || 0}</strong>
        </div>
      </div>

      {/* 5 Filter Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-1.5 text-xs no-scrollbar">
          {[
            { id: 'all', label: 'All Due Dates', count: (counts.total_outstanding || 0) + (counts.returned || 0) },
            { id: 'dueToday', label: 'Due Today', count: counts.due_today || 0, isAmber: true },
            { id: 'dueTomorrow', label: 'Due Tomorrow', count: counts.due_tomorrow || 0 },
            { id: 'upcoming', label: 'Upcoming Returns', count: counts.upcoming || 0 },
            { id: 'overdue', label: 'Overdue Returns', count: counts.overdue || 0, isRed: true },
            { id: 'returned', label: 'Returned', count: counts.returned || 0 },
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`whitespace-nowrap px-3 py-2 sm:py-1.5 border text-xs font-medium transition-colors flex items-center space-x-1.5 shrink-0 ${
                activeSection === sec.id
                  ? 'border-obsidian bg-obsidian text-offwhite font-semibold'
                  : 'border-offwhite-border bg-white text-muted-light hover:text-obsidian'
              }`}
            >
              <span>{sec.label}</span>
              <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
                sec.isRed && sec.count > 0 ? 'bg-red-700 text-white font-bold' :
                sec.isAmber && sec.count > 0 ? 'bg-amber-600 text-white font-bold' :
                activeSection === sec.id ? 'bg-charcoal text-champagne' : 'bg-offwhite text-muted-light'
              }`}>
                {sec.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-auto sm:min-w-[240px]">
          <Search className="absolute left-3 top-3 sm:top-2.5 w-3.5 h-3.5 text-muted-light" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer, item, mobile..."
            className="w-full bg-white border border-offwhite-border text-obsidian text-xs pl-8 pr-3 py-2.5 sm:py-2 focus:outline-none focus:border-champagne"
          />
        </div>
      </div>

      {/* Selected Section List */}
      <div className="space-y-6">
        {activeSection === 'all' && (
          <div className="space-y-6">
            {/* Overdue Section (If any) */}
            {(sections.overdue || []).length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-red-800 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Overdue Returns ({sections.overdue.length})</span>
                </div>
                {renderRentalList(sections.overdue, 'overdue')}
              </div>
            )}

            {/* Due Today */}
            {(sections.dueToday || []).length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Due Today ({sections.dueToday.length})</span>
                </div>
                {renderRentalList(sections.dueToday, 'dueToday')}
              </div>
            )}

            {/* Due Tomorrow */}
            {(sections.dueTomorrow || []).length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-obsidian uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-champagne-dark" />
                  <span>Due Tomorrow ({sections.dueTomorrow.length})</span>
                </div>
                {renderRentalList(sections.dueTomorrow, 'dueTomorrow')}
              </div>
            )}

            {/* Upcoming */}
            {(sections.upcoming || []).length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-muted-light uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span>Upcoming Returns ({sections.upcoming.length})</span>
                </div>
                {renderRentalList(sections.upcoming, 'upcoming')}
              </div>
            )}
          </div>
        )}

        {activeSection === 'dueToday' && renderRentalList(sections.dueToday || [], 'dueToday')}
        {activeSection === 'overdue' && renderRentalList(sections.overdue || [], 'overdue')}
        {activeSection === 'dueTomorrow' && renderRentalList(sections.dueTomorrow || [], 'dueTomorrow')}
        {activeSection === 'upcoming' && renderRentalList(sections.upcoming || [], 'upcoming')}
        {activeSection === 'returned' && renderRentalList(sections.returned || [], 'returned')}
      </div>

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
