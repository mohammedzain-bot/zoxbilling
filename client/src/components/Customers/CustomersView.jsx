import React, { useState } from 'react';
import { Search, Plus, User, Phone, MapPin, MessageSquare, Eye, X } from 'lucide-react';
import { createWhatsAppUrl } from '../../utils/whatsapp';
import CustomerDetailModal from './CustomerDetailModal';
import { api } from '../../services/api';

export default function CustomersView({ 
  customers = [], 
  settings, 
  onRefresh, 
  onViewInvoice 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  // New customer form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currency = settings?.currency || '₹';

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    (c.address && c.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenDetail = async (id) => {
    setSelectedCustomerId(id);
    const detail = await api.getCustomer(id);
    setCustomerDetail(detail);
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      alert('Please enter customer name and mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createCustomer({
        name: newName,
        phone: newPhone,
        address: newAddress
      });
      setIsAddCustomerOpen(false);
      setNewName('');
      setNewPhone('');
      setNewAddress('');
      onRefresh();
    } catch (err) {
      alert(err.message || 'Error creating customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-offwhite-border">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-obsidian tracking-wide">
            Customer Directory
          </h1>
          <p className="text-xs text-muted-light mt-0.5">
            Client records across offline clothing rentals and sales.
          </p>
        </div>

        <button
          onClick={() => setIsAddCustomerOpen(true)}
          className="w-full sm:w-auto px-4 py-3 sm:py-2.5 bg-charcoal hover:bg-obsidian text-offwhite text-xs font-bold tracking-wider uppercase flex items-center justify-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-champagne" />
          <span>+ Add Customer</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-3 sm:top-2.5 w-3.5 h-3.5 text-muted-light" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by customer name, mobile, address..."
          className="w-full bg-white border border-offwhite-border text-obsidian text-xs pl-8 pr-3 py-2.5 sm:py-2 focus:outline-none focus:border-champagne"
        />
      </div>

      {/* MOBILE VIEW: Customer Cards (Hidden on desktop) */}
      <div className="block lg:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-light italic bg-white border border-offwhite-border">
            No customers found matching search.
          </div>
        ) : (
          filtered.map(cust => {
            const waUrl = createWhatsAppUrl(
              cust.phone,
              `Hello ${cust.name}, this is ZOX clothing atelier.`
            );

            return (
              <div key={cust.id} className="bg-white border border-offwhite-border p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-offwhite-border">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-obsidian">{cust.name}</h3>
                    <span className="font-mono text-xs text-muted-light">{cust.phone}</span>
                  </div>

                  {(cust.active_rentals_count || 0) > 0 ? (
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-100 text-blue-800 font-bold rounded">
                      {cust.active_rentals_count} Active Rental
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-light">No active rental</span>
                  )}
                </div>

                {cust.address && (
                  <p className="text-xs text-muted-light">
                    {cust.address}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2 text-xs bg-offwhite-surface p-2 border border-offwhite-border font-mono text-center">
                  <div>
                    <span className="text-[9px] uppercase text-muted-light block">Rentals</span>
                    <span className="font-bold text-obsidian">{cust.total_rentals_count || 0}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-muted-light block">Purchases</span>
                    <span className="font-bold text-obsidian">{cust.total_sales_count || 0}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-muted-light block">Balance</span>
                    <span className={`font-bold ${(cust.pending_balance || 0) > 0 ? 'text-red-600' : 'text-green-700'}`}>
                      {currency}{cust.pending_balance || 0}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-offwhite-border">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => handleOpenDetail(cust.id)}
                    className="py-2.5 px-3 bg-offwhite border border-offwhite-border text-obsidian text-xs font-semibold rounded flex items-center justify-center space-x-1.5 hover:bg-offwhite-surface transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-champagne-dark" />
                    <span>Profile</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP VIEW: Full Table (Hidden on mobile) */}
      <div className="hidden lg:block bg-white border border-offwhite-border overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-offwhite-border text-muted-light font-mono text-[10px] uppercase bg-offwhite-surface">
              <th className="py-3 px-3.5">Customer Name</th>
              <th className="py-3 px-3.5">Mobile Number</th>
              <th className="py-3 px-3.5">Location / Address</th>
              <th className="py-3 px-3.5">Rentals Taken</th>
              <th className="py-3 px-3.5">Purchases Made</th>
              <th className="py-3 px-3.5">Active Rentals</th>
              <th className="py-3 px-3.5">Pending Balance</th>
              <th className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-offwhite-border/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-muted-light italic">
                  No customers found matching search.
                </td>
              </tr>
            ) : (
              filtered.map(cust => {
                const waUrl = createWhatsAppUrl(
                  cust.phone,
                  `Hello ${cust.name}, this is ZOX store concierge.`
                );

                return (
                  <tr key={cust.id} className="hover:bg-offwhite-surface transition-colors">
                    <td className="py-3 px-3.5 font-medium text-obsidian">
                      {cust.name}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-muted-light">
                      {cust.phone}
                    </td>
                    <td className="py-3 px-3.5 text-muted-light max-w-xs truncate">
                      {cust.address || '—'}
                    </td>
                    <td className="py-3 px-3.5 font-mono">
                      {cust.total_rentals_count || 0}
                    </td>
                    <td className="py-3 px-3.5 font-mono">
                      {cust.total_sales_count || 0}
                    </td>
                    <td className="py-3 px-3.5">
                      {(cust.active_rentals_count || 0) > 0 ? (
                        <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-50 text-blue-800 font-bold rounded">
                          {cust.active_rentals_count} Active
                        </span>
                      ) : (
                        <span className="text-muted-light font-mono">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 font-mono">
                      {(cust.pending_balance || 0) > 0 ? (
                        <span className="text-red-600 font-bold">
                          {currency}{cust.pending_balance}
                        </span>
                      ) : (
                        <span className="text-green-700">Clear</span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 border border-offwhite-border hover:border-champagne text-muted-light hover:text-obsidian bg-offwhite-surface rounded transition-colors"
                          title="Message on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleOpenDetail(cust.id)}
                          className="px-2.5 py-1 bg-offwhite border border-offwhite-border hover:border-champagne text-[11px] font-medium text-obsidian transition-colors"
                        >
                          View Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border border-offwhite-border p-5 sm:p-6 w-full sm:max-w-md shadow-2xl space-y-4 rounded-t-2xl sm:rounded-none">
            <div className="flex items-center justify-between pb-2 border-b border-offwhite-border">
              <h3 className="font-serif text-lg font-bold text-obsidian">Add New Customer</h3>
              <button onClick={() => setIsAddCustomerOpen(false)} className="p-1 text-muted-light hover:text-obsidian">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-obsidian mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full bg-offwhite-surface border border-offwhite-border px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-obsidian mb-1">Mobile Number (with country code) *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. 919820112233"
                  className="w-full bg-offwhite-surface border border-offwhite-border px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs font-mono focus:outline-none focus:border-champagne rounded-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-obsidian mb-1">Address (Optional)</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="e.g. Bandra West, Mumbai"
                  className="w-full bg-offwhite-surface border border-offwhite-border px-3.5 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none focus:border-champagne rounded-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 border border-offwhite-border text-muted-light text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2.5 bg-charcoal hover:bg-obsidian text-offwhite text-xs font-bold uppercase tracking-wider"
                >
                  {isSubmitting ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Profile Modal */}
      {customerDetail && (
        <CustomerDetailModal
          customerDetail={customerDetail}
          settings={settings}
          onClose={() => setCustomerDetail(null)}
          onViewInvoice={onViewInvoice}
        />
      )}

    </div>
  );
}
