import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, User, Package } from 'lucide-react';

export default function RentalCalendar({ rentals = [], onSelectRental, settings }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate 14 days starting from current date offset
  const days = [];
  const startDay = new Date(currentDate);
  startDay.setDate(startDay.getDate() - 2); // Show 2 days in past for overdue context

  for (let i = 0; i < 14; i++) {
    const d = new Date(startDay);
    d.setDate(d.getDate() + i);
    days.push(d.toISOString().split('T')[0]);
  }

  const shiftDays = (offset) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + offset);
    setCurrentDate(next);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 bg-obsidian-950 border border-charcoal-border">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-gold-500" />
          <h3 className="font-serif text-lg text-ivory-100">
            Atelier Rental Schedule & Timeline (14-Day View)
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => shiftDays(-7)}
            className="p-1.5 border border-charcoal-border hover:border-gold-500/50 rounded text-ivory-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 border border-charcoal-border hover:border-gold-500/50 text-xs font-mono uppercase text-gold-400"
          >
            Today
          </button>
          <button
            onClick={() => shiftDays(7)}
            className="p-1.5 border border-charcoal-border hover:border-gold-500/50 rounded text-ivory-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {days.map(dateStr => {
          const dateObj = new Date(dateStr + 'T00:00:00');
          const isToday = dateStr === todayStr;
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          const pickups = rentals.filter(r => r.startDate === dateStr);
          const returns = rentals.filter(r => r.returnDate === dateStr);

          return (
            <div
              key={dateStr}
              className={`p-3 border flex flex-col justify-between min-h-[190px] transition-colors ${
                isToday
                  ? 'border-gold-500 bg-gold-500/5 ring-1 ring-gold-500/30'
                  : 'border-charcoal-border bg-obsidian-950'
              }`}
            >
              <div>
                <div className="flex items-baseline justify-between border-b border-charcoal-border/60 pb-1.5 mb-2">
                  <span className={`text-xs font-mono uppercase font-bold ${isToday ? 'text-gold-400' : 'text-ivory-300'}`}>
                    {dayName}
                  </span>
                  <span className="text-[11px] text-ivory-400 font-mono">
                    {dayNum}
                  </span>
                </div>

                {/* Pickups */}
                {pickups.length > 0 && (
                  <div className="mb-2 space-y-1">
                    <span className="text-[9px] font-mono uppercase text-amber-400 block font-bold">
                      Pickups ({pickups.length})
                    </span>
                    {pickups.map(p => (
                      <div
                        key={p.id}
                        onClick={() => onSelectRental(p)}
                        className="p-1.5 bg-amber-950/30 border border-amber-500/40 rounded cursor-pointer hover:border-amber-400 transition-colors text-[10px]"
                      >
                        <div className="font-bold text-ivory-100 truncate">{p.customerName}</div>
                        <div className="text-ivory-400 truncate">{p.suitTitle} ({p.size})</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Returns */}
                {returns.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase text-blue-400 block font-bold">
                      Returns Due ({returns.length})
                    </span>
                    {returns.map(r => {
                      const isPastDue = dateStr < todayStr && (r.status === 'collected' || r.status === 'overdue');
                      return (
                        <div
                          key={r.id}
                          onClick={() => onSelectRental(r)}
                          className={`p-1.5 border rounded cursor-pointer transition-colors text-[10px] ${
                            isPastDue
                              ? 'bg-red-950/40 border-red-500/60 hover:border-red-400'
                              : 'bg-blue-950/30 border-blue-500/40 hover:border-blue-400'
                          }`}
                        >
                          <div className={`font-bold truncate ${isPastDue ? 'text-red-300' : 'text-ivory-100'}`}>
                            {r.customerName}
                          </div>
                          <div className="text-ivory-400 truncate">{r.suitTitle}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {pickups.length === 0 && returns.length === 0 && (
                  <div className="text-[11px] text-ivory-400/50 italic pt-6 text-center">
                    No scheduled activity
                  </div>
                )}
              </div>

              {isToday && (
                <div className="pt-2 text-center text-[10px] font-mono uppercase text-gold-400 tracking-wider">
                  • Today •
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
