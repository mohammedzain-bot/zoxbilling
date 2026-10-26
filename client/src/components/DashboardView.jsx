import React from 'react';
import { 
  ShoppingBag, Tag, Clock, AlertTriangle, ArrowUpRight, 
  Plus, MessageSquare, FileText, CheckCircle, User, Phone 
} from 'lucide-react';
import { createWhatsAppUrl, generateReturnReminderMessage } from '../utils/whatsapp';

export default function DashboardView({ 
  dashboardData, 
  settings, 
  onNewRental, 
  onNewSale, 
  onViewInvoice, 
  onNavigateTab 
}) {
  const stats = dashboardData?.stats || {};
  const activities = dashboardData?.activities || {};
  const currency = settings?.currency || '₹';

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-offwhite-border">
        <div>
          <h1 className="font-serif text-xl sm:text-3xl font-bold text-obsidian tracking-wide">
            Welcome to {settings?.store_name || 'ZOX'}
          </h1>
          <p className="text-xs text-muted-light mt-0.5">
            Manage your sales, rentals, invoices, and customer returns.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onNewRental}
            className="flex-1 sm:flex-none px-3.5 py-2.5 sm:py-2 bg-charcoal hover:bg-obsidian text-offwhite text-xs font-medium tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-champagne" />
            <span>+ Rental</span>
          </button>

          <button
            onClick={onNewSale}
            className="flex-1 sm:flex-none px-3.5 py-2.5 sm:py-2 bg-champagne hover:bg-champagne-dark text-obsidian text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Sale</span>
          </button>
        </div>
      </div>

      {/* 4 Compact Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* 1. Today's Sales */}
        <div className="p-3.5 sm:p-4 bg-white border border-offwhite-border rounded-none shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-light">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold">Today's Sales</span>
            <Tag className="w-4 h-4 text-champagne-dark" />
          </div>
          <div className="mt-2">
            <div className="font-serif text-xl sm:text-3xl font-bold text-obsidian">
              {currency}{(stats.todaySales || 0).toLocaleString()}
            </div>
            <span className="text-[10px] sm:text-[11px] text-muted-light">
              Received: {currency}{(stats.todaySalesReceived || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* 2. Active Rentals */}
        <div 
          onClick={() => onNavigateTab('rentals')}
          className="p-3.5 sm:p-4 bg-white border border-offwhite-border rounded-none shadow-xs flex flex-col justify-between cursor-pointer hover:border-champagne transition-colors"
        >
          <div className="flex items-center justify-between text-muted-light">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold">Active Rentals</span>
            <ShoppingBag className="w-4 h-4 text-champagne-dark" />
          </div>
          <div className="mt-2">
            <div className="font-serif text-xl sm:text-3xl font-bold text-obsidian">
              {stats.activeRentals || 0}
            </div>
            <span className="text-[10px] sm:text-[11px] text-muted-light">Items with clients</span>
          </div>
        </div>

        {/* 3. Returns Due Today */}
        <div 
          onClick={() => onNavigateTab('reminders')}
          className={`p-3.5 sm:p-4 border rounded-none shadow-xs flex flex-col justify-between cursor-pointer transition-colors ${
            stats.returnsDueToday > 0 ? 'bg-amber-50/50 border-amber-300' : 'bg-white border-offwhite-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold text-amber-900">
              Due Today
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <div className="font-serif text-xl sm:text-3xl font-bold text-amber-950">
              {stats.returnsDueToday || 0}
            </div>
            <span className="text-[10px] sm:text-[11px] text-amber-800">Return due today</span>
          </div>
        </div>

        {/* 4. Pending Rental Returns (Overdue) */}
        <div 
          onClick={() => onNavigateTab('reminders')}
          className={`p-3.5 sm:p-4 border rounded-none shadow-xs flex flex-col justify-between cursor-pointer transition-colors ${
            stats.pendingRentalReturns > 0 ? 'bg-red-50/60 border-red-300' : 'bg-white border-offwhite-border'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold text-red-900 flex items-center space-x-1">
              <span>Overdue</span>
              {stats.pendingRentalReturns > 0 && <AlertTriangle className="w-3 h-3 text-red-600" />}
            </span>
            <Clock className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2">
            <div className="font-serif text-xl sm:text-3xl font-bold text-red-950">
              {stats.pendingRentalReturns || 0}
            </div>
            <span className="text-[10px] sm:text-[11px] text-red-800">Past due date</span>
          </div>
        </div>

      </div>

      {/* Priority Action Banners: Overdue & Due Today */}
      {(activities.overdueReturns?.length > 0 || activities.dueTodayCustomers?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Overdue Alert Box */}
          {activities.overdueReturns?.length > 0 && (
            <div className="p-3.5 sm:p-4 bg-red-50 border border-red-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Overdue Returns ({activities.overdueReturns.length})</span>
                </span>
                <button
                  onClick={() => onNavigateTab('reminders')}
                  className="text-[11px] text-red-700 hover:text-red-900 underline font-medium"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                {activities.overdueReturns.slice(0, 3).map(r => {
                  const waUrl = createWhatsAppUrl(
                    r.customer_phone,
                    generateReturnReminderMessage(r, true, settings)
                  );

                  return (
                    <div key={r.id} className="p-2.5 bg-white border border-red-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-obsidian block">{r.customer_name}</span>
                        <span className="text-[11px] text-muted-light">{r.item_name} • Due: {r.rental_end}</span>
                      </div>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-[11px] font-semibold rounded flex items-center space-x-1 transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Remind</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Due Today Box */}
          {activities.dueTodayCustomers?.length > 0 && (
            <div className="p-3.5 sm:p-4 bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Returns Due Today ({activities.dueTodayCustomers.length})</span>
                </span>
                <button
                  onClick={() => onNavigateTab('reminders')}
                  className="text-[11px] text-amber-800 hover:text-amber-950 underline font-medium"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                {activities.dueTodayCustomers.slice(0, 3).map(r => {
                  const waUrl = createWhatsAppUrl(
                    r.customer_phone,
                    generateReturnReminderMessage(r, false, settings)
                  );

                  return (
                    <div key={r.id} className="p-2.5 bg-white border border-amber-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-obsidian block">{r.customer_name}</span>
                        <span className="text-[11px] text-muted-light">{r.item_name} • Due Today</span>
                      </div>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-semibold rounded flex items-center space-x-1 transition-colors"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Remind</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Main Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Left Column: Recent Rentals */}
        <div className="bg-white border border-offwhite-border p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-offwhite-border">
            <span className="font-serif text-sm sm:text-base font-bold text-obsidian">
              Recent Offline Rentals
            </span>
            <button
              onClick={() => onNavigateTab('rentals')}
              className="text-xs text-champagne-dark hover:text-obsidian font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-2">
            {(!activities.recentRentals || activities.recentRentals.length === 0) ? (
              <p className="text-xs text-muted-light italic py-4 text-center">No rentals recorded yet.</p>
            ) : (
              activities.recentRentals.map(r => (
                <div key={r.id} className="p-3 bg-offwhite-surface border border-offwhite-border flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-champagne-dark font-bold text-[11px]">{r.invoice_number}</span>
                      <span className="text-obsidian font-medium">{r.customer_name}</span>
                    </div>
                    <div className="text-[11px] text-muted-light mt-0.5">
                      {r.item_name} • {r.rental_start} to {r.rental_end}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-obsidian block">
                      {currency}{r.total_amount}
                    </span>
                    <span className={`text-[10px] uppercase font-mono ${r.status === 'returned' ? 'text-green-600' : 'text-blue-600'}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Sales */}
        <div className="bg-white border border-offwhite-border p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-offwhite-border">
            <span className="font-serif text-sm sm:text-base font-bold text-obsidian">
              Recent In-Store Sales (Buyers)
            </span>
            <button
              onClick={() => onNavigateTab('buyers')}
              className="text-xs text-champagne-dark hover:text-obsidian font-medium"
            >
              View All →
            </button>
          </div>

          <div className="space-y-2">
            {(!activities.recentSales || activities.recentSales.length === 0) ? (
              <p className="text-xs text-muted-light italic py-4 text-center">No sales recorded yet.</p>
            ) : (
              activities.recentSales.map(s => (
                <div key={s.id} className="p-3 bg-offwhite-surface border border-offwhite-border flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-champagne-dark font-bold text-[11px]">{s.invoice_number}</span>
                      <span className="text-obsidian font-medium">{s.customer_name}</span>
                    </div>
                    <div className="text-[11px] text-muted-light mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                      {s.items?.map(i => `${i.item_name} (x${i.quantity})`).join(', ')}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-obsidian block">
                      {currency}{s.total_amount}
                    </span>
                    <span className={`text-[10px] uppercase font-mono ${s.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                      {s.payment_status?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Recent Invoices */}
      <div className="bg-white border border-offwhite-border p-4 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-offwhite-border">
          <span className="font-serif text-sm sm:text-base font-bold text-obsidian">
            Recent Invoices
          </span>
          <button
            onClick={() => onNavigateTab('invoices')}
            className="text-xs text-champagne-dark hover:text-obsidian font-medium"
          >
            View All Invoices →
          </button>
        </div>

        {/* Mobile View for Recent Invoices */}
        <div className="block sm:hidden space-y-2">
          {activities.recentInvoices?.map(inv => (
            <div key={inv.invoice_number} className="p-3 bg-offwhite-surface border border-offwhite-border flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-mono font-bold text-champagne-dark">{inv.invoice_number}</span>
                  <span className="text-obsidian font-medium">• {inv.customer_name}</span>
                </div>
                <div className="text-[11px] text-muted-light mt-0.5">
                  {inv.type} • {inv.date}
                </div>
              </div>
              <div className="text-right flex items-center space-x-2">
                <div>
                  <div className="font-mono font-bold text-obsidian">{currency}{inv.amount}</div>
                  <div className={`text-[10px] uppercase font-mono ${inv.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                    {inv.payment_status}
                  </div>
                </div>
                <button
                  onClick={() => onViewInvoice(inv.invoice_number)}
                  className="px-2.5 py-1.5 bg-white border border-offwhite-border text-[11px] font-semibold text-obsidian"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-offwhite-border text-muted-light font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-offwhite-border/60">
              {activities.recentInvoices?.map(inv => (
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
                  <td className="py-2.5 px-3 font-medium text-obsidian">
                    {inv.customer_name}
                  </td>
                  <td className="py-2.5 px-3 text-muted-light">
                    {inv.date}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-obsidian">
                    {currency}{inv.amount}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] font-mono uppercase ${
                      inv.payment_status === 'paid' ? 'text-green-600 font-bold' : 'text-amber-600'
                    }`}>
                      {inv.payment_status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onViewInvoice(inv.invoice_number)}
                      className="px-2 py-1 bg-offwhite border border-offwhite-border hover:border-champagne text-[11px] text-obsidian font-medium transition-colors"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
