import React, { useState, useEffect } from 'react';
import { 
  Shield, KeyRound, ArrowLeft, LogOut, Package, 
  Calendar, Users, Settings, Plus, AlertTriangle, 
  CheckCircle, DollarSign, Clock, RefreshCw 
} from 'lucide-react';
import RentalsTable from './RentalsTable';
import RentalDetailModal from './RentalDetailModal';
import AddRentalModal from './AddRentalModal';
import RentalInvoiceModal from './RentalInvoiceModal';
import SuitsManager from './SuitsManager';
import CustomersManager from './CustomersManager';
import RentalCalendar from './RentalCalendar';
import SettingsView from './SettingsView';
import { api } from '../../services/api';

export default function AdminDashboard({ onExitAdmin, initialSettings }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState('rentals'); // 'rentals', 'wardrobe', 'customers', 'calendar', 'settings'
  const [settings, setSettings] = useState(initialSettings || {});
  const [rentals, setRentals] = useState([]);
  const [suits, setSuits] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedRental, setSelectedRental] = useState(null);
  const [isAddRentalOpen, setIsAddRentalOpen] = useState(false);
  const [invoiceRental, setInvoiceRental] = useState(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [r, s, c, a, set, an] = await Promise.all([
        api.getRentals(),
        api.getSuits(),
        api.getCustomers(),
        api.getAccessories(),
        api.getSettings(),
        api.getAnalytics()
      ]);
      setRentals(r);
      setSuits(s);
      setCustomers(c);
      setAccessories(a);
      setSettings(set);
      setAnalytics(an);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const correctPin = settings?.adminPin || initialSettings?.adminPin || '8888';
    if (pinInput === correctPin || pinInput === '8888') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
  };

  // CRUD handlers
  const handleUpdateRental = async (id, data) => {
    await api.updateRental(id, data);
    await loadAllData();
  };

  const handleDeleteRental = async (id) => {
    await api.deleteRental(id);
    await loadAllData();
  };

  const handleCreateRental = async (data) => {
    await api.createRental(data);
    await loadAllData();
  };

  const handleCreateSuit = async (data) => {
    await api.createSuit(data);
    await loadAllData();
  };

  const handleUpdateSuit = async (id, data) => {
    await api.updateSuit(id, data);
    await loadAllData();
  };

  const handleDeleteSuit = async (id) => {
    await api.deleteSuit(id);
    await loadAllData();
  };

  const handleCreateCustomer = async (data) => {
    await api.createCustomer(data);
    await loadAllData();
  };

  const handleUpdateCustomer = async (id, data) => {
    await api.updateCustomer(id, data);
    await loadAllData();
  };

  const handleUpdateSettings = async (data) => {
    const updated = await api.updateSettings(data);
    setSettings(updated);
  };

  const currency = settings?.currency || '$';

  // PIN Gate screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-obsidian-900 border border-charcoal-border p-8 shadow-2xl text-center space-y-6">
          
          <div className="w-14 h-14 mx-auto rounded-full bg-gold-500/10 border border-gold-500/40 flex items-center justify-center text-gold-400">
            <Shield className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-ultra-luxury text-gold-500 block mb-1">
              ZOX Atelier Security Gateway
            </span>
            <h2 className="font-serif text-2xl text-ivory-100">
              Staff Portal Access
            </h2>
            <p className="text-xs text-ivory-400 font-light mt-1">
              Enter authorized atelier PIN to manage wardrobe, customer measurements & bookings.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter PIN (Default: 8888)"
                autoFocus
                className="w-full text-center bg-obsidian-950 border border-charcoal-border focus:border-gold-500 text-ivory-100 text-lg tracking-widest font-mono py-2.5 rounded focus:outline-none"
              />
              {pinError && (
                <span className="text-[11px] text-red-400 block mt-1.5 font-mono">
                  Incorrect PIN. Please re-enter.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-widest uppercase transition-colors"
            >
              Authenticate & Enter
            </button>
          </form>

          {/* Quick Demo Unlock Button */}
          <div className="pt-2 border-t border-charcoal-border/70 flex flex-col gap-2">
            <button
              onClick={handleQuickUnlock}
              className="text-xs text-gold-400 hover:text-gold-300 font-mono underline"
            >
              [One-Click Demo Staff Unlock (PIN: 8888)]
            </button>
            <button
              onClick={onExitAdmin}
              className="text-xs text-ivory-400 hover:text-ivory-200 flex items-center justify-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Customer Website</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Active Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-obsidian-950 text-ivory-100 flex flex-col">
      
      {/* Top Staff Navigation Header */}
      <header className="bg-obsidian-900 border-b border-charcoal-border px-4 sm:px-8 py-3.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-widest uppercase font-bold text-ivory-100">
                ZOX
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-gold-500">
                Atelier Executive Management
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-charcoal-border text-xs text-ivory-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live System Connected</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadAllData}
              className="p-2 border border-charcoal-border hover:border-gold-500/50 text-ivory-300 hover:text-gold-400 rounded transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onExitAdmin}
              className="px-3 py-1.5 border border-charcoal-border hover:border-gold-500 text-xs text-ivory-200 tracking-wider uppercase flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-gold-500" />
              <span>Customer Website</span>
            </button>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 text-ivory-400 hover:text-red-400 border border-charcoal-border rounded transition-colors"
              title="Lock Admin Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        
        {/* KPI Executive Summary Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          
          {/* Active Rentals */}
          <div className="p-3.5 bg-obsidian-900 border border-charcoal-border">
            <span className="text-[10px] uppercase font-mono tracking-wider text-ivory-400 block mb-1">
              Active Out
            </span>
            <div className="font-serif text-2xl text-blue-400 font-bold">
              {analytics?.activeRentals ?? rentals.filter(r => r.status === 'collected').length}
            </div>
            <span className="text-[10px] text-ivory-400 font-light">With clients currently</span>
          </div>

          {/* Today's Pickups */}
          <div className="p-3.5 bg-obsidian-900 border border-charcoal-border">
            <span className="text-[10px] uppercase font-mono tracking-wider text-ivory-400 block mb-1">
              Pickups Today
            </span>
            <div className="font-serif text-2xl text-amber-400 font-bold">
              {analytics?.pickupsToday ?? 0}
            </div>
            <span className="text-[10px] text-ivory-400 font-light">Fittings / Collections</span>
          </div>

          {/* Today's Returns */}
          <div className="p-3.5 bg-obsidian-900 border border-charcoal-border">
            <span className="text-[10px] uppercase font-mono tracking-wider text-ivory-400 block mb-1">
              Returns Today
            </span>
            <div className="font-serif text-2xl text-emerald-400 font-bold">
              {analytics?.returnsToday ?? 0}
            </div>
            <span className="text-[10px] text-ivory-400 font-light">Due for wet clean</span>
          </div>

          {/* Overdue Returns (Urgent) */}
          <div className={`p-3.5 border ${
            (analytics?.overdueRentals ?? 0) > 0 
              ? 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-950/30' 
              : 'bg-obsidian-900 border-charcoal-border'
          }`}>
            <span className="text-[10px] uppercase font-mono tracking-wider text-red-300 block mb-1 flex items-center justify-between">
              <span>Overdue</span>
              {(analytics?.overdueRentals ?? 0) > 0 && <AlertTriangle className="w-3 h-3 text-red-400" />}
            </span>
            <div className="font-serif text-2xl text-red-400 font-bold">
              {analytics?.overdueRentals ?? 0}
            </div>
            <span className="text-[10px] text-ivory-400 font-light">Urgent returns needed</span>
          </div>

          {/* Total Revenue */}
          <div className="p-3.5 bg-obsidian-900 border border-charcoal-border">
            <span className="text-[10px] uppercase font-mono tracking-wider text-ivory-400 block mb-1">
              Total Revenue
            </span>
            <div className="font-serif text-2xl text-gold-400 font-bold truncate">
              {currency}{analytics?.totalRevenue ?? 0}
            </div>
            <span className="text-[10px] text-ivory-400 font-light">Settled payments</span>
          </div>

          {/* Security Deposits Held */}
          <div className="p-3.5 bg-obsidian-900 border border-charcoal-border">
            <span className="text-[10px] uppercase font-mono tracking-wider text-ivory-400 block mb-1">
              Deposits Held
            </span>
            <div className="font-serif text-2xl text-ivory-100 font-bold truncate">
              {currency}{analytics?.totalSecurityDepositsHeld ?? 0}
            </div>
            <span className="text-[10px] text-ivory-400 font-light">To refund on return</span>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-charcoal-border pb-2">
          {[
            { id: 'rentals', label: 'Rentals & Orders Pipeline', icon: Package },
            { id: 'wardrobe', label: 'Wardrobe & Sizing Catalog', icon: CheckCircle },
            { id: 'customers', label: 'Clients & Measurements Vault', icon: Users },
            { id: 'calendar', label: 'Rental Schedule Timeline', icon: Calendar },
            { id: 'settings', label: 'Store & WhatsApp Settings', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors ${
                  isActive
                    ? 'border-b-2 border-gold-500 text-gold-400 bg-gold-500/10'
                    : 'text-ivory-400 hover:text-ivory-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab View */}
        {activeTab === 'rentals' && (
          <RentalsTable
            rentals={rentals}
            settings={settings}
            onSelectRental={setSelectedRental}
            onAddNewRental={() => setIsAddRentalOpen(true)}
            onPrintInvoice={setInvoiceRental}
          />
        )}

        {activeTab === 'wardrobe' && (
          <SuitsManager
            suits={suits}
            settings={settings}
            onCreateSuit={handleCreateSuit}
            onUpdateSuit={handleUpdateSuit}
            onDeleteSuit={handleDeleteSuit}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersManager
            customers={customers}
            settings={settings}
            onCreateCustomer={handleCreateCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onNewRental={() => setIsAddRentalOpen(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <RentalCalendar
            rentals={rentals}
            onSelectRental={setSelectedRental}
            settings={settings}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

      </main>

      {/* Order Detail Modal */}
      {selectedRental && (
        <RentalDetailModal
          rental={selectedRental}
          settings={settings}
          onClose={() => setSelectedRental(null)}
          onUpdateRental={handleUpdateRental}
          onDeleteRental={handleDeleteRental}
          onPrintInvoice={(r) => {
            setSelectedRental(null);
            setInvoiceRental(r);
          }}
        />
      )}

      {/* Add New Rental Modal */}
      {isAddRentalOpen && (
        <AddRentalModal
          suits={suits}
          customers={customers}
          accessories={accessories}
          settings={settings}
          onClose={() => setIsAddRentalOpen(false)}
          onCreateRental={handleCreateRental}
        />
      )}

      {/* Printable Invoice Modal */}
      {invoiceRental && (
        <RentalInvoiceModal
          rental={invoiceRental}
          settings={settings}
          onClose={() => setInvoiceRental(null)}
        />
      )}

    </div>
  );
}
