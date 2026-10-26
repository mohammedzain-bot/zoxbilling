import React, { useState } from 'react';
import { Settings, Save, Shield, MessageSquare, DollarSign, Store } from 'lucide-react';

export default function SettingsView({ settings, onUpdateSettings }) {
  const [storeName, setStoreName] = useState(settings?.storeName || 'ZOX Men\'s Atelier & Suit Rentals');
  const [phone, setPhone] = useState(settings?.phone || '+1 (555) 890-7629');
  const [whatsappNumber, setWhatsappNumber] = useState(settings?.whatsappNumber || '15558907629');
  const [email, setEmail] = useState(settings?.email || 'concierge@zoxrentals.com');
  const [currency, setCurrency] = useState(settings?.currency || '$');
  const [address, setAddress] = useState(settings?.address || '442 Madison Avenue, 8th Floor Atelier, New York, NY 10022');
  const [openingHours, setOpeningHours] = useState(settings?.openingHours || 'Mon - Sat: 10:00 AM - 7:30 PM | Sun: By Appointment Only');
  const [lateFeePerDay, setLateFeePerDay] = useState(settings?.lateFeePerDay || 45);
  const [adminPin, setAdminPin] = useState(settings?.adminPin || '8888');
  
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateSettings({
        storeName,
        phone,
        whatsappNumber,
        email,
        currency,
        address,
        openingHours,
        lateFeePerDay: Number(lateFeePerDay),
        adminPin
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-charcoal-border">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gold-500" />
          <h3 className="font-serif text-xl text-ivory-100">
            Atelier Configuration & WhatsApp Integration
          </h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-ivory-300">
        
        {/* Store Identity */}
        <div className="p-4 bg-obsidian-950 border border-charcoal-border space-y-4">
          <div className="flex items-center space-x-2 text-gold-400 font-mono text-[11px] uppercase font-bold">
            <Store className="w-4 h-4" />
            <span>Store Brand & Atelier Location</span>
          </div>

          <div>
            <label className="text-[10px] text-ivory-400 uppercase block mb-1">Store / Atelier Name</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500 font-medium"
            />
          </div>

          <div>
            <label className="text-[10px] text-ivory-400 uppercase block mb-1">Physical Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-ivory-400 uppercase block mb-1">Operating Hours</label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* WhatsApp & Concierge Communication */}
        <div className="p-4 bg-obsidian-950 border border-charcoal-border space-y-4">
          <div className="flex items-center space-x-2 text-gold-400 font-mono text-[11px] uppercase font-bold">
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp & Customer Communication Gateway</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">
                WhatsApp Business Phone (Digits only, including country code) *
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 15558907629"
                className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500 font-mono"
              />
              <p className="text-[10px] text-ivory-400 mt-1">
                Used to generate direct WhatsApp chat links and inquiry templates for clients.
              </p>
            </div>

            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Display Hotline Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-ivory-400 uppercase block mb-1">Concierge Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
            />
          </div>
        </div>

        {/* Financial Policies & Access Security */}
        <div className="p-4 bg-obsidian-950 border border-charcoal-border space-y-4">
          <div className="flex items-center space-x-2 text-gold-400 font-mono text-[11px] uppercase font-bold">
            <DollarSign className="w-4 h-4" />
            <span>Rental Policies & Atelier Portal Security</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Currency Symbol</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500 font-mono text-center font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Late Return Fee / Day ({currency})</label>
              <input
                type="number"
                value={lateFeePerDay}
                onChange={(e) => setLateFeePerDay(Number(e.target.value))}
                className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Atelier Staff PIN *</label>
              <input
                type="password"
                maxLength={6}
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="8888"
                className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500 font-mono text-center"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs text-green-400 font-mono">
              ✓ Atelier settings updated successfully!
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="ml-auto px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-widest uppercase flex items-center space-x-2 transition-colors shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Updating...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
