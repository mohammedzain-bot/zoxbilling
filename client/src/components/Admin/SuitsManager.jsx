import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Sparkles, Package } from 'lucide-react';
import SuitFormModal from './SuitFormModal';

export default function SuitsManager({ suits = [], settings, onCreateSuit, onUpdateSuit, onDeleteSuit }) {
  const [selectedSuitToEdit, setSelectedSuitToEdit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredSuits = suits.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.sku.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const currency = settings?.currency || '$';

  return (
    <div className="space-y-4">
      
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wardrobe by title, SKU, or category..."
            className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 text-xs px-3 py-2 rounded focus:outline-none focus:border-gold-500"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* Wardrobe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuits.map(suit => {
          const totalInventory = (suit.sizes || []).reduce((sum, s) => sum + (s.totalStock || 0), 0);
          const availableInventory = (suit.sizes || []).reduce((sum, s) => sum + (s.availableStock || 0), 0);

          return (
            <div
              key={suit.id}
              className="bg-obsidian-950 border border-charcoal-border hover:border-gold-500/40 p-4 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-gold-400 text-xs font-bold">{suit.sku}</span>
                    <span className="text-[10px] uppercase text-ivory-400 bg-obsidian-900 px-1.5 py-0.5 border border-charcoal-border">
                      {suit.category}
                    </span>
                  </div>
                  {suit.isFeatured && (
                    <span className="text-[9px] uppercase tracking-wider bg-gold-500/20 text-gold-400 px-2 py-0.5 border border-gold-500/30">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex gap-3 my-2">
                  <img
                    src={suit.images?.[0]}
                    alt={suit.title}
                    className="w-20 h-28 object-cover border border-charcoal-border shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h4 className="font-serif text-base text-ivory-100 font-bold truncate">
                      {suit.title}
                    </h4>
                    <p className="text-[11px] text-ivory-400 line-clamp-2 mt-0.5 font-light">
                      {suit.fabric}
                    </p>
                    <div className="mt-2 text-xs font-serif text-gold-400 font-medium">
                      Rental: {currency}{suit.rentalPricing?.["3days"] || 190} <span className="text-[10px] font-sans text-ivory-400">/ 3 days</span>
                    </div>
                  </div>
                </div>

                {/* Sizing & Stock status pill */}
                <div className="mt-3 pt-3 border-t border-charcoal-border/60 text-xs">
                  <div className="flex justify-between items-center mb-1 text-[11px]">
                    <span className="text-ivory-400">Available Stock:</span>
                    <span className={`font-mono font-bold ${availableInventory > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {availableInventory} of {totalInventory} available
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(suit.sizes || []).map(sz => (
                      <span
                        key={sz.size}
                        className={`px-1.5 py-0.5 text-[10px] font-mono border ${
                          sz.availableStock > 0
                            ? 'border-charcoal-border bg-obsidian-900 text-ivory-300'
                            : 'border-red-900/50 bg-red-950/20 text-red-400/80 line-through'
                        }`}
                      >
                        {sz.size} ({sz.availableStock})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-charcoal-border flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${suit.title}?`)) {
                      onDeleteSuit(suit.id);
                    }
                  }}
                  className="text-red-400 hover:text-red-300 p-1.5 rounded transition-colors"
                  title="Delete Suit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedSuitToEdit(suit)}
                  className="px-3 py-1.5 bg-obsidian-900 border border-charcoal-border hover:border-gold-500/60 text-ivory-200 hover:text-gold-300 text-xs tracking-wider uppercase flex items-center space-x-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Suit Specs</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add New Suit Modal */}
      {isAddModalOpen && (
        <SuitFormModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={onCreateSuit}
          settings={settings}
        />
      )}

      {/* Edit Existing Suit Modal */}
      {selectedSuitToEdit && (
        <SuitFormModal
          suit={selectedSuitToEdit}
          onClose={() => setSelectedSuitToEdit(null)}
          onSave={(data) => onUpdateSuit(selectedSuitToEdit.id, data)}
          settings={settings}
        />
      )}

    </div>
  );
}
