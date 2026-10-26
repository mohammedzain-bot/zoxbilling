import React, { useState } from 'react';
import { Plus, User, Phone, Mail, MapPin, Ruler, MessageSquare, Star, Edit3 } from 'lucide-react';
import CustomerModal from './CustomerModal';
import { createWhatsAppUrl } from '../../utils/whatsapp';

export default function CustomersManager({ customers = [], settings, onCreateCustomer, onUpdateCustomer, onNewRental }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients by name, phone, or email..."
            className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 text-xs px-3 py-2 rounded focus:outline-none focus:border-gold-500"
          />
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client Profile</span>
        </button>
      </div>

      {/* Customers List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cust => {
          const waUrl = createWhatsAppUrl(
            cust.phone,
            `Hello ${cust.name}, this is ZOX Atelier Concierge. We are pleased to assist you.`
          );

          return (
            <div
              key={cust.id}
              className="bg-obsidian-950 border border-charcoal-border hover:border-gold-500/40 p-4 flex flex-col justify-between transition-colors space-y-3"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-serif text-lg text-ivory-100 font-bold">
                        {cust.name}
                      </h4>
                      {cust.vipStatus && (
                        <span className="flex items-center space-x-0.5 px-2 py-0.5 text-[9px] font-mono uppercase bg-gold-500/20 text-gold-400 border border-gold-500/40">
                          <Star className="w-2.5 h-2.5 fill-gold-400" />
                          <span>VIP</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-ivory-400">
                      {cust.rentalCount || 0} Total Rentals
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedCustomer(cust)}
                    className="p-1.5 text-ivory-400 hover:text-gold-400 rounded transition-colors"
                    title="Edit Client & Measurements"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Contact info */}
                <div className="mt-2 space-y-1 text-xs text-ivory-300">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span className="font-mono">{cust.phone || 'No phone recorded'}</span>
                  </div>
                  {cust.email && (
                    <div className="flex items-center space-x-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                      <span className="truncate">{cust.email}</span>
                    </div>
                  )}
                  {cust.address && (
                    <div className="flex items-start space-x-2 text-[11px] text-ivory-400 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                      <span>{cust.address}</span>
                    </div>
                  )}
                </div>

                {/* Tailoring Vault Preview */}
                <div className="mt-3 p-2.5 bg-obsidian-900 border border-charcoal-border/70 text-[11px] space-y-1">
                  <div className="flex items-center space-x-1.5 text-gold-400 font-mono text-[10px] uppercase font-bold">
                    <Ruler className="w-3 h-3" />
                    <span>Measurements Vault</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 font-mono text-ivory-300 text-[10px]">
                    <div>Chest: <span className="text-ivory-100">{cust.measurements?.chest || '—'}"</span></div>
                    <div>Waist: <span className="text-ivory-100">{cust.measurements?.waist || '—'}"</span></div>
                    <div>Inseam: <span className="text-ivory-100">{cust.measurements?.inseam || '—'}"</span></div>
                    <div>Sleeve: <span className="text-ivory-100">{cust.measurements?.sleeveLength || '—'}"</span></div>
                    <div>Shoulder: <span className="text-ivory-100">{cust.measurements?.shoulder || '—'}"</span></div>
                    <div>Height: <span className="text-ivory-100">{cust.measurements?.height || '—'}</span></div>
                  </div>
                </div>

                {cust.notes && (
                  <p className="mt-2 text-[11px] text-ivory-400 italic line-clamp-2">
                    "{cust.notes}"
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-charcoal-border flex items-center justify-between gap-2">
                {cust.phone ? (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 bg-obsidian-900 border border-charcoal-border hover:border-gold-500/50 text-gold-300 text-[11px] uppercase tracking-wider flex items-center justify-center space-x-1 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <div />
                )}

                <button
                  onClick={() => setSelectedCustomer(cust)}
                  className="py-1.5 px-3 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-medium text-[11px] uppercase tracking-wider transition-colors"
                >
                  View Profile
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Client Modal */}
      {isAddOpen && (
        <CustomerModal
          onClose={() => setIsAddOpen(false)}
          onSave={onCreateCustomer}
          settings={settings}
        />
      )}

      {/* Edit Client Modal */}
      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onSave={(data) => onUpdateCustomer(selectedCustomer.id, data)}
          settings={settings}
        />
      )}

    </div>
  );
}
