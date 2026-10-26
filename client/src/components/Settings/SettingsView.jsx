import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Store, MessageSquare, FileText, Check } from 'lucide-react';
import { api } from '../../services/api';

export default function SettingsView({ settings, onUpdateSettings }) {
  const [storeName, setStoreName] = useState(settings?.store_name || 'ZOX');
  const [storeAddress, setStoreAddress] = useState(settings?.store_address || '123 Luxury Fashion Boulevard, Fort, Mumbai 400001');
  const [storePhone, setStorePhone] = useState(settings?.store_phone || '+91 98765 43210');
  const [whatsappNumber, setWhatsappNumber] = useState(settings?.whatsapp_number || '919876543210');
  const [storeEmail, setStoreEmail] = useState(settings?.store_email || 'hello@zoxclothing.com');
  const [currency, setCurrency] = useState(settings?.currency || '₹');
  const [timezone, setTimezone] = useState(settings?.timezone || 'Asia/Kolkata');
  const [rentalPrefix, setRentalPrefix] = useState(settings?.invoice_prefix_rental || 'ZOX-RENT');
  const [salePrefix, setSalePrefix] = useState(settings?.invoice_prefix_sale || 'ZOX-SALE');
  const [invoiceFooter, setInvoiceFooter] = useState(settings?.invoice_footer || 'Thank you for choosing ZOX. We look forward to serving you again.');

  const [reminderTemplate, setReminderTemplate] = useState(
    settings?.rental_reminder_template ||
    'Hello {name}, this is ZOX. This is a friendly reminder that your rented {item} is due to be returned on {date}. Please contact us if you need any assistance. Thank you for choosing ZOX.'
  );

  const [overdueTemplate, setOverdueTemplate] = useState(
    settings?.rental_overdue_template ||
    'Hello {name}, this is ZOX. Our records show that your rented {item} was due for return on {date}. Please contact us to arrange its return. Thank you.'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        store_name: storeName,
        store_address: storeAddress,
        store_phone: storePhone,
        whatsapp_number: whatsappNumber,
        store_email: storeEmail,
        currency,
        timezone,
        invoice_prefix_rental: rentalPrefix,
        invoice_prefix_sale: salePrefix,
        invoice_footer: invoiceFooter,
        rental_reminder_template: reminderTemplate,
        rental_overdue_template: overdueTemplate
      };

      await onUpdateSettings(payload);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-offwhite-border">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian tracking-wide">
            Store & System Settings
          </h1>
          <p className="text-xs text-muted-light mt-0.5">
            Configure store branding, currency, invoice numbering, and WhatsApp templates.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Section 1: Store Details */}
        <div className="p-5 bg-white border border-offwhite-border space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-obsidian font-mono text-[11px] uppercase font-bold border-b border-offwhite-border pb-2">
            <Store className="w-4 h-4 text-champagne-dark" />
            <span>Store Profile & Physical Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-obsidian mb-1">
                Store Name *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3 py-2 text-xs focus:outline-none focus:border-champagne font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-obsidian mb-1">
                Store Phone (Customer Facing)
              </label>
              <input
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3 py-2 text-xs focus:outline-none focus:border-champagne"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-obsidian mb-1">
              Physical Store Address
            </label>
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3 py-2 text-xs focus:outline-none focus:border-champagne"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-obsidian mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3 py-2 text-xs focus:outline-none focus:border-champagne"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-obsidian mb-1">
                Default Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3 py-2 text-xs font-mono focus:outline-none focus:border-champagne"
              />
            </div>
          </div>
        </div>

        {/* Section 2: WhatsApp Settings & Templates */}
        <div className="p-5 bg-white border border-offwhite-border space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-obsidian font-mono text-[11px] uppercase font-bold border-b border-offwhite-border pb-2">
            <MessageSquare className="w-4 h-4 text-champagne-dark" />
            <span>WhatsApp Number & Return Reminder Message Templates</span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-obsidian mb-1">
              Store WhatsApp Number (digits only, e.g. 919876543210)
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian font-mono px-3 py-2 text-xs focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-obsidian mb-1">
              Friendly Return Reminder Template (Due Today / Upcoming)
            </label>
            <textarea
              rows={3}
              value={reminderTemplate}
              onChange={(e) => setReminderTemplate(e.target.value)}
              className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3 py-2 text-xs focus:outline-none focus:border-champagne leading-relaxed"
            />
            <span className="text-[10px] text-muted-light">Placeholders: &#123;name&#125;, &#123;item&#125;, &#123;date&#125;</span>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-obsidian mb-1">
              Overdue Return Reminder Template
            </label>
            <textarea
              rows={3}
              value={overdueTemplate}
              onChange={(e) => setOverdueTemplate(e.target.value)}
              className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3 py-2 text-xs focus:outline-none focus:border-champagne leading-relaxed"
            />
            <span className="text-[10px] text-muted-light">Placeholders: &#123;name&#125;, &#123;item&#125;, &#123;date&#125;</span>
          </div>
        </div>

        {/* Section 3: Currency & Invoice Formats */}
        <div className="p-5 bg-white border border-offwhite-border space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-obsidian font-mono text-[11px] uppercase font-bold border-b border-offwhite-border pb-2">
            <FileText className="w-4 h-4 text-champagne-dark" />
            <span>Currency & Invoice Numbering Formats</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-obsidian mb-1">
                Currency Symbol *
              </label>
              <input
                type="text"
                required
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3 py-2 text-xs font-mono font-bold text-center focus:outline-none focus:border-champagne"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-obsidian mb-1">
                Rental Invoice Prefix
              </label>
              <input
                type="text"
                value={rentalPrefix}
                onChange={(e) => setRentalPrefix(e.target.value)}
                className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3 py-2 text-xs font-mono focus:outline-none focus:border-champagne"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-obsidian mb-1">
                Buyer Sale Invoice Prefix
              </label>
              <input
                type="text"
                value={salePrefix}
                onChange={(e) => setSalePrefix(e.target.value)}
                className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3 py-2 text-xs font-mono focus:outline-none focus:border-champagne"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-obsidian mb-1">
              Invoice Footer Policy / Thank-you Text
            </label>
            <input
              type="text"
              value={invoiceFooter}
              onChange={(e) => setInvoiceFooter(e.target.value)}
              className="w-full bg-offwhite-surface border border-offwhite-border text-obsidian px-3 py-2 text-xs focus:outline-none focus:border-champagne"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs text-green-700 font-mono flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Settings updated successfully!</span>
            </span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="ml-auto px-6 py-2.5 bg-champagne hover:bg-champagne-dark text-obsidian font-bold text-xs uppercase tracking-widest flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
