import React from 'react';
import { 
  LayoutDashboard, ShoppingBag, Tag, Users, FileText, 
  Clock, Settings, LogOut, ShieldCheck, Menu, X, AlertTriangle 
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  counts = {}, 
  settings, 
  user, 
  onLogout, 
  mobileOpen, 
  setMobileOpen 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rentals', label: 'Rentals', icon: ShoppingBag, badge: counts.active_rentals ? `${counts.active_rentals} active` : null },
    { id: 'buyers', label: 'Buyers', icon: Tag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { 
      id: 'reminders', 
      label: 'Return Reminders', 
      icon: Clock, 
      alertBadge: (counts.overdue_returns || counts.due_today_returns) ? (counts.overdue_returns ? `${counts.overdue_returns} overdue` : `${counts.due_today_returns} due`) : null,
      isAlert: Boolean(counts.overdue_returns)
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-64 bg-charcoal border-r border-charcoal-border flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Brand Header */}
        <div>
          <div className="h-16 px-6 border-b border-charcoal-border flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-widest text-offwhite uppercase">
                {settings?.store_name || 'ZOX'}
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-champagne -mt-0.5">
                Sales & Rental Atelier
              </span>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-muted hover:text-offwhite rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-medium transition-all
                    ${isActive 
                      ? 'bg-obsidian text-champagne border border-champagne/30 font-semibold shadow-sm' 
                      : 'text-muted hover:text-offwhite hover:bg-charcoal-card'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-champagne' : 'text-muted'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.alertBadge && (
                    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded ${
                      item.isAlert 
                        ? 'bg-red-950 text-red-300 border border-red-500/40' 
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}>
                      {item.alertBadge}
                    </span>
                  )}

                  {!item.alertBadge && item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono text-muted bg-charcoal-card border border-charcoal-border rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer User Info */}
        <div className="p-4 border-t border-charcoal-border bg-charcoal-dark space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-champagne/15 border border-champagne/40 flex items-center justify-center text-champagne text-xs font-bold">
                Z
              </div>
              <div className="overflow-hidden">
                <span className="text-xs text-offwhite font-medium block truncate">
                  {user?.name || 'Store Staff'}
                </span>
                <span className="text-[10px] text-muted font-mono block">
                  {settings?.timezone || 'Asia/Kolkata'}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-muted hover:text-red-400 rounded transition-colors"
              title="Lock / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}
