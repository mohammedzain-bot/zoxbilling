import React, { useState } from 'react';
import { X, Ruler, UserCheck, MessageSquare, Plus, Save } from 'lucide-react';
import { createWhatsAppUrl } from '../../utils/whatsapp';

export default function CustomerModal({ customer, onClose, onSave, onNewRentalForCustomer, settings }) {
  const isEditing = Boolean(customer && customer.id);

  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [address, setAddress] = useState(customer?.address || '');
  const [vipStatus, setVipStatus] = useState(Boolean(customer?.vipStatus));
  const [notes, setNotes] = useState(customer?.notes || '');

  // Tailoring Measurements
  const [measurements, setMeasurements] = useState(customer?.measurements || {
    chest: '40',
    shoulder: '18.5',
    sleeveLength: '33.5',
    jacketLength: '30',
    waist: '32',
    hip: '38',
    inseam: '31.5',
    outseam: '41',
    neck: '16',
    height: "6'0\"",
    weight: '175 lbs'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleMeasurementChange = (key, val) => {
    setMeasurements(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please provide client name and phone number.');
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        name,
        phone,
        email,
        address,
        vipStatus,
        notes,
        measurements
      };

      await onSave(data);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save customer.');
    } finally {
      setIsSaving(false);
    }
  };

  const waUrl = createWhatsAppUrl(
    phone,
    `Hello ${name}, this is ZOX Atelier Concierge. We are pleased to assist you with your upcoming formalwear requirements.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-obsidian-900 border border-charcoal-border shadow-2xl p-6 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-border">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-gold-500" />
            <h3 className="font-serif text-xl text-ivory-100">
              {isEditing ? `Client Profile & Tailoring Vault: ${name}` : 'Register New Client Profile'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-ivory-400 hover:text-ivory-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4 text-xs text-ivory-300">
          
          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Julian Moreau"
                className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Phone Number (WhatsApp) *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 782-9901"
                className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@atelier-lux.com"
                className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Delivery / Residence Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 740 Park Avenue, Apt 11B, New York"
                className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="vipCheck"
              checked={vipStatus}
              onChange={(e) => setVipStatus(e.target.checked)}
              className="accent-gold-500"
            />
            <label htmlFor="vipCheck" className="text-xs text-gold-400 font-medium">
              Grant VIP Atelier Client Status (Priority booking & concierge perks)
            </label>
          </div>

          {/* Master Tailor Measurements Book */}
          <div className="p-4 bg-obsidian-950 border border-charcoal-border space-y-3">
            <div className="flex items-center space-x-2 text-gold-400">
              <Ruler className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-widest font-mono font-medium">
                Master Tailor Measurements Book (Inches)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[9px] text-ivory-400 uppercase block">Chest</label>
                <input
                  type="text"
                  value={measurements.chest || ''}
                  onChange={(e) => handleMeasurementChange('chest', e.target.value)}
                  placeholder="e.g. 40"
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2 py-1 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[9px] text-ivory-400 uppercase block">Shoulder Width</label>
                <input
                  type="text"
                  value={measurements.shoulder || ''}
                  onChange={(e) => handleMeasurementChange('shoulder', e.target.value)}
                  placeholder="e.g. 18.5"
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2 py-1 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[9px] text-ivory-400 uppercase block">Sleeve Length</label>
                <input
                  type="text"
                  value={measurements.sleeveLength || ''}
                  onChange={(e) => handleMeasurementChange('sleeveLength', e.target.value)}
                  placeholder="e.g. 33.5"
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2 py-1 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[9px] text-ivory-400 uppercase block">Jacket Length</label>
                <input
                  type="text"
                  value={measurements.jacketLength || ''}
                  onChange={(e) => handleMeasurementChange('jacketLength', e.target.value)}
                  placeholder="e.g. 30"
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2 py-1 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[9px] text-ivory-400 uppercase block">Trouser Waist</label>
                <input
                  type="text"
                  value={measurements.waist || ''}
                  onChange={(e) => handleMeasurementChange('waist', e.target.value)}
                  placeholder="e.g. 32"
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2 py-1 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[9px] text-ivory-400 uppercase block">Inseam</label>
                <input
                  type="text"
                  value={measurements.inseam || ''}
                  onChange={(e) => handleMeasurementChange('inseam', e.target.value)}
                  placeholder="e.g. 31.5"
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2 py-1 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[9px] text-ivory-400 uppercase block">Neck</label>
                <input
                  type="text"
                  value={measurements.neck || ''}
                  onChange={(e) => handleMeasurementChange('neck', e.target.value)}
                  placeholder="e.g. 16"
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2 py-1 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[9px] text-ivory-400 uppercase block">Height & Weight</label>
                <input
                  type="text"
                  value={measurements.height || ''}
                  onChange={(e) => handleMeasurementChange('height', e.target.value)}
                  placeholder="e.g. 6'0, 175 lbs"
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2 py-1 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-ivory-400 uppercase block mb-1">
              Private Atelier Notes / Preferences
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prefers slight trouser break, 1/2 inch shirt cuff show..."
              className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            {phone && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 border border-gold-500/40 bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 text-xs tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Client on WhatsApp</span>
              </a>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto ml-auto px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-widest uppercase transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Customer Profile'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
