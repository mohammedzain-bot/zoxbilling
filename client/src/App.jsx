import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import RentalsView from './components/Rentals/RentalsView';
import RentalFormModal from './components/Rentals/RentalFormModal';
import BuyersView from './components/Buyers/BuyersView';
import SaleFormModal from './components/Buyers/SaleFormModal';
import ReturnRemindersView from './components/ReturnReminders/ReturnRemindersView';
import CustomersView from './components/Customers/CustomersView';
import InvoicesView from './components/Invoices/InvoicesView';
import InvoiceModal from './components/Invoices/InvoiceModal';
import SettingsView from './components/Settings/SettingsView';
import LoginModal from './components/Auth/LoginModal';
import { api } from './services/api';
import { 
  Menu, Plus, RefreshCw, ShoppingBag, Tag, 
  LayoutDashboard, Clock, MoreHorizontal, FileText, Users 
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(() => api.getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Core Data State
  const [settings, setSettings] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [returnSummary, setReturnSummary] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  // Global Modals State
  const [isNewRentalOpen, setIsNewRentalOpen] = useState(false);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const loadAllData = async () => {
    try {
      const [dash, rent, sls, cust, invs, retSum, setts, cat] = await Promise.all([
        api.getDashboard().catch(() => null),
        api.getRentals().catch(() => []),
        api.getSales().catch(() => []),
        api.getCustomers().catch(() => []),
        api.getInvoices().catch(() => []),
        api.getReturnReminders().catch(() => null),
        api.getSettings().catch(() => null),
        api.getCatalog().catch(() => [])
      ]);

      if (dash) setDashboardData(dash);
      if (rent) setRentals(rent);
      if (sls) setSales(sls);
      if (cust) setCustomers(cust);
      if (invs) setInvoices(invs);
      if (retSum) setReturnSummary(retSum);
      if (setts) setSettings(setts);
      if (cat) setCatalog(cat);
    } catch (err) {
      console.error('Error loading store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const handleOpenInvoice = async (invoiceNumber) => {
    try {
      const inv = await api.getInvoice(invoiceNumber);
      setSelectedInvoice(inv);
    } catch (err) {
      alert('Could not retrieve invoice details.');
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  // If not logged in, show clean staff login gate
  if (!user) {
    return <LoginModal onLoginSuccess={(u) => setUser(u)} settings={settings} />;
  }

  const counts = {
    active_rentals: returnSummary?.counts?.total_outstanding || rentals.filter(r => r.status === 'active').length,
    overdue_returns: returnSummary?.counts?.overdue || 0,
    due_today_returns: returnSummary?.counts?.due_today || 0,
  };

  return (
    <div className="flex h-screen bg-offwhite-surface font-sans text-obsidian overflow-hidden selection:bg-champagne selection:text-obsidian">
      
      {/* Navigation Sidebar (Desktop drawer and Mobile sliding panel) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
        settings={settings}
        user={user}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-offwhite-surface">
        
        {/* Top Header (Optimized for Mobile and Desktop) */}
        <header className="h-14 sm:h-16 px-3 sm:px-8 border-b border-offwhite-border bg-white flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 text-muted-light hover:text-obsidian rounded focus:outline-none"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Name */}
            <div className="lg:hidden font-serif text-lg font-bold tracking-wider text-obsidian uppercase">
              {settings?.store_name || 'ZOX'}
            </div>

            {/* Desktop Breadcrumbs */}
            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono uppercase text-muted-light">
              <span>ZOX Store Management</span>
              <span>/</span>
              <span className="font-bold text-obsidian capitalize">{activeTab.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            <button
              onClick={loadAllData}
              className="p-1.5 sm:p-2 border border-offwhite-border text-muted-light hover:text-obsidian hover:bg-offwhite-surface rounded transition-colors"
              title="Refresh Store Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Quick Rental button (Available on both Mobile & Desktop) */}
            <button
              onClick={() => setIsNewRentalOpen(true)}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-charcoal hover:bg-obsidian text-offwhite text-[11px] sm:text-xs font-medium tracking-wider uppercase transition-colors shadow-xs"
            >
              <Plus className="w-3 h-3 text-champagne" />
              <span>+ Rental</span>
            </button>

            {/* Quick Sale button (Available on both Mobile & Desktop) */}
            <button
              onClick={() => setIsNewSaleOpen(true)}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-champagne hover:bg-champagne-dark text-obsidian text-[11px] sm:text-xs font-bold tracking-wider uppercase transition-colors shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>+ Sale</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Workspace with bottom padding for mobile navigation */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-8 pb-24 sm:pb-8 bg-offwhite-surface">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                dashboardData={dashboardData}
                settings={settings}
                onNewRental={() => setIsNewRentalOpen(true)}
                onNewSale={() => setIsNewSaleOpen(true)}
                onViewInvoice={handleOpenInvoice}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'rentals' && (
              <RentalsView
                rentals={rentals}
                settings={settings}
                catalog={catalog}
                customers={customers}
                onRefresh={loadAllData}
                onViewInvoice={handleOpenInvoice}
                onOpenWhatsAppShare={handleOpenInvoice}
              />
            )}

            {activeTab === 'buyers' && (
              <BuyersView
                sales={sales}
                settings={settings}
                catalog={catalog}
                customers={customers}
                onRefresh={loadAllData}
                onViewInvoice={handleOpenInvoice}
                onOpenWhatsAppShare={handleOpenInvoice}
              />
            )}

            {activeTab === 'customers' && (
              <CustomersView
                customers={customers}
                settings={settings}
                onRefresh={loadAllData}
                onViewInvoice={handleOpenInvoice}
              />
            )}

            {activeTab === 'invoices' && (
              <InvoicesView
                invoices={invoices}
                settings={settings}
                onViewInvoice={handleOpenInvoice}
                onOpenWhatsAppShare={handleOpenInvoice}
              />
            )}

            {activeTab === 'reminders' && (
              <ReturnRemindersView
                returnSummary={returnSummary}
                settings={settings}
                onRefresh={loadAllData}
                onViewInvoice={handleOpenInvoice}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={async (data) => {
                  const updated = await api.updateSettings(data);
                  setSettings(updated);
                  loadAllData();
                }}
              />
            )}
          </div>
        </main>

        {/* FIXED MOBILE BOTTOM NAVIGATION BAR */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-charcoal border-t border-charcoal-border flex items-center justify-around py-2 px-1 text-[10px] text-muted shadow-lg">
          {/* 1. Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'dashboard' ? 'text-champagne font-bold' : 'hover:text-offwhite'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </button>

          {/* 2. Rentals */}
          <button
            onClick={() => setActiveTab('rentals')}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'rentals' ? 'text-champagne font-bold' : 'hover:text-offwhite'
            }`}
          >
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            <span>Rentals</span>
            {counts.active_rentals > 0 && (
              <span className="absolute top-0 right-3 bg-champagne text-obsidian text-[9px] font-mono font-bold px-1 rounded-full">
                {counts.active_rentals}
              </span>
            )}
          </button>

          {/* 3. Buyers */}
          <button
            onClick={() => setActiveTab('buyers')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'buyers' ? 'text-champagne font-bold' : 'hover:text-offwhite'
            }`}
          >
            <Tag className="w-5 h-5 mb-0.5" />
            <span>Sales</span>
          </button>

          {/* 4. Return Reminders */}
          <button
            onClick={() => setActiveTab('reminders')}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'reminders' ? 'text-champagne font-bold' : 'hover:text-offwhite'
            }`}
          >
            <Clock className="w-5 h-5 mb-0.5" />
            <span>Returns</span>
            {(counts.overdue_returns > 0 || counts.due_today_returns > 0) && (
              <span className={`absolute top-0 right-3 text-[9px] font-mono font-bold px-1 rounded-full ${
                counts.overdue_returns > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-500 text-obsidian'
              }`}>
                {counts.overdue_returns || counts.due_today_returns}
              </span>
            )}
          </button>

          {/* 5. More / Menu Drawer */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 hover:text-offwhite transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            <span>Menu</span>
          </button>
        </nav>

      </div>

      {/* Global New Rental Modal */}
      {isNewRentalOpen && (
        <RentalFormModal
          settings={settings}
          catalog={catalog}
          customers={customers}
          onClose={() => setIsNewRentalOpen(false)}
          onSaved={(newRental, actionType) => {
            loadAllData();
            if (actionType === 'invoice' || actionType === 'whatsapp') {
              handleOpenInvoice(newRental.invoice_number);
            }
          }}
        />
      )}

      {/* Global New Sale Modal */}
      {isNewSaleOpen && (
        <SaleFormModal
          settings={settings}
          catalog={catalog}
          customers={customers}
          onClose={() => setIsNewSaleOpen(false)}
          onSaved={(newSale, actionType) => {
            loadAllData();
            if (actionType === 'invoice' || actionType === 'whatsapp') {
              handleOpenInvoice(newSale.invoice_number);
            }
          }}
        />
      )}

      {/* Global Invoice View Modal */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          settings={settings}
          onClose={() => setSelectedInvoice(null)}
          onRefresh={loadAllData}
        />
      )}

    </div>
  );
}
