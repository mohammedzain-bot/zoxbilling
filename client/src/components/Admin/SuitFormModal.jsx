import React, { useState } from 'react';
import { X, Plus, Trash2, Image, Sparkles } from 'lucide-react';

export default function SuitFormModal({ suit, onClose, onSave, settings }) {
  const isEditing = Boolean(suit && suit.id);

  const [title, setTitle] = useState(suit?.title || '');
  const [subtitle, setSubtitle] = useState(suit?.subtitle || 'Bespoke Atelier Collection');
  const [sku, setSku] = useState(suit?.sku || `ZOX-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState(suit?.category || 'Tuxedo');
  const [occasion, setOccasion] = useState(suit?.occasion || 'Black Tie & Gala');
  const [fit, setFit] = useState(suit?.fit || 'Tailored Slim');
  const [color, setColor] = useState(suit?.color || 'Obsidian Black');
  const [fabric, setFabric] = useState(suit?.fabric || 'Super 150s Merino Wool');
  const [lapel, setLapel] = useState(suit?.lapel || 'Peak Lapel (Silk Satin)');
  const [pieces, setPieces] = useState(suit?.pieces || '2-Piece (Jacket & Trouser)');
  const [description, setDescription] = useState(suit?.description || '');
  const [editorialQuote, setEditorialQuote] = useState(suit?.editorialQuote || '');

  // Rental Pricing
  const [price3Days, setPrice3Days] = useState(suit?.rentalPricing?.["3days"] || 190);
  const [price5Days, setPrice5Days] = useState(suit?.rentalPricing?.["5days"] || 250);
  const [price7Days, setPrice7Days] = useState(suit?.rentalPricing?.["7days"] || 310);
  const [securityDeposit, setSecurityDeposit] = useState(suit?.securityDeposit || 100);

  // Sizing stock
  const [sizes, setSizes] = useState(suit?.sizes || [
    { size: "38R", totalStock: 2, availableStock: 2 },
    { size: "40R", totalStock: 4, availableStock: 3 },
    { size: "42R", totalStock: 3, availableStock: 2 },
    { size: "44R", totalStock: 2, availableStock: 2 }
  ]);

  // Images
  const [imageUrl, setImageUrl] = useState(suit?.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85');
  const [isFeatured, setIsFeatured] = useState(Boolean(suit?.isFeatured));
  const [isSaving, setIsSaving] = useState(false);

  const handleSizeStockChange = (idx, field, val) => {
    const updated = [...sizes];
    updated[idx][field] = Number(val);
    setSizes(updated);
  };

  const handleAddSizeRow = () => {
    setSizes([...sizes, { size: "40L", totalStock: 2, availableStock: 2 }]);
  };

  const handleRemoveSizeRow = (idx) => {
    setSizes(sizes.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      alert('Please specify suit title.');
      return;
    }

    setIsSaving(true);
    try {
      const data = {
        title,
        subtitle,
        sku,
        category,
        occasion,
        fit,
        color,
        fabric,
        lapel,
        pieces,
        description,
        editorialQuote,
        rentalPricing: {
          "3days": Number(price3Days),
          "5days": Number(price5Days),
          "7days": Number(price7Days)
        },
        securityDeposit: Number(securityDeposit),
        sizes,
        images: [imageUrl],
        isFeatured
      };

      await onSave(data);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving suit.');
    } finally {
      setIsSaving(false);
    }
  };

  const currency = settings?.currency || '$';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-obsidian-900 border border-charcoal-border shadow-2xl p-6 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-border">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <h3 className="font-serif text-xl text-ivory-100">
              {isEditing ? `Edit Garment: ${suit.title}` : 'Add New Luxury Garment to Wardrobe'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-ivory-400 hover:text-ivory-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4 text-xs text-ivory-300">
          
          {/* Identity & Classification */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Suit Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Midnight Sovereign Tuxedo"
                className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">SKU / Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
              >
                <option value="Tuxedo">Tuxedo</option>
                <option value="3-Piece">3-Piece Ensemble</option>
                <option value="Double-Breasted">Double-Breasted</option>
                <option value="Dinner Jacket">Velvet Dinner Jacket</option>
                <option value="Modern Editorial">Modern Editorial</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Curated Occasion</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
              >
                <option value="Black Tie & Gala">Black Tie & Gala</option>
                <option value="Royal Wedding & Groom">Royal Wedding & Groom</option>
                <option value="Red Carpet & Gala">Red Carpet & Gala</option>
                <option value="Corporate Executive">Corporate Executive</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Fit Silhouette</label>
              <input
                type="text"
                value={fit}
                onChange={(e) => setFit(e.target.value)}
                placeholder="e.g. Tailored Slim"
                className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Fabric & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Obsidian Black"
                className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Fabric Composition</label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g. Super 150s Merino Wool & Silk"
                className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-ivory-400 uppercase block mb-1">Lapel Type</label>
              <input
                type="text"
                value={lapel}
                onChange={(e) => setLapel(e.target.value)}
                placeholder="e.g. Peak Lapel (Silk Satin)"
                className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Rental Pricing Tiers & Deposit */}
          <div className="p-3 bg-obsidian-950 border border-charcoal-border space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-gold-400 font-mono block">
              Rental Pricing Tiers ({currency})
            </span>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">3 Days</label>
                <input
                  type="number"
                  value={price3Days}
                  onChange={(e) => setPrice3Days(Number(e.target.value))}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2.5 py-1.5 rounded focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">5 Days</label>
                <input
                  type="number"
                  value={price5Days}
                  onChange={(e) => setPrice5Days(Number(e.target.value))}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2.5 py-1.5 rounded focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">7 Days</label>
                <input
                  type="number"
                  value={price7Days}
                  onChange={(e) => setPrice7Days(Number(e.target.value))}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2.5 py-1.5 rounded focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-ivory-400 uppercase block mb-1">Deposit</label>
                <input
                  type="number"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  className="w-full bg-obsidian-900 border border-charcoal-border text-ivory-100 px-2.5 py-1.5 rounded focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Sizing & Inventory Allocation */}
          <div className="p-3 bg-obsidian-950 border border-charcoal-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-mono">
                Wardrobe Sizes & Real-time Stock Allocation
              </span>
              <button
                type="button"
                onClick={handleAddSizeRow}
                className="text-gold-400 hover:text-gold-300 text-[11px] flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Size</span>
              </button>
            </div>

            <div className="space-y-2">
              {sizes.map((sz, idx) => (
                <div key={idx} className="flex items-center space-x-3 bg-obsidian-900 p-2 border border-charcoal-border">
                  <div className="w-24">
                    <label className="text-[9px] text-ivory-400 block uppercase">Size</label>
                    <input
                      type="text"
                      value={sz.size}
                      onChange={(e) => {
                        const copy = [...sizes];
                        copy[idx].size = e.target.value;
                        setSizes(copy);
                      }}
                      className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-2 py-1 text-xs font-mono"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] text-ivory-400 block uppercase">Total In Atelier</label>
                    <input
                      type="number"
                      value={sz.totalStock}
                      onChange={(e) => handleSizeStockChange(idx, 'totalStock', e.target.value)}
                      className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-2 py-1 text-xs font-mono"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] text-ivory-400 block uppercase">Currently Available</label>
                    <input
                      type="number"
                      value={sz.availableStock}
                      onChange={(e) => handleSizeStockChange(idx, 'availableStock', e.target.value)}
                      className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-2 py-1 text-xs font-mono text-gold-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSizeRow(idx)}
                    className="p-1.5 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Image & Featured */}
          <div>
            <label className="text-[10px] text-ivory-400 uppercase block mb-1">
              Editorial Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-ivory-400 uppercase block mb-1">
              Garment Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of craftsmanship..."
              className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 px-3 py-2 rounded focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-gold-500"
            />
            <label htmlFor="isFeatured" className="text-xs text-ivory-200">
              Highlight as Featured Signature Campaign Piece on Homepage
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs tracking-widest uppercase transition-colors"
          >
            {isSaving ? 'Saving Garment...' : isEditing ? 'Update Suit in Wardrobe' : 'Publish Suit to Wardrobe'}
          </button>
        </form>

      </div>
    </div>
  );
}
