import React, { useState } from 'react';
import { X, Ruler, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

export default function FitFinderModal({ onClose, onApplySizeFilter }) {
  const [heightFeet, setHeightFeet] = useState(6);
  const [heightInches, setHeightInches] = useState(0);
  const [weightLbs, setWeightLbs] = useState(175);
  const [chestInches, setChestInches] = useState(40);
  const [waistInches, setWaistInches] = useState(32);
  const [fitPreference, setFitPreference] = useState('modern'); // 'slim', 'modern', 'classic'

  // Fit calculation logic
  const calculateSize = () => {
    let jacketNum = Math.round(chestInches);
    // Even numbers only (36, 38, 40, 42, 44, 46, 48)
    if (jacketNum % 2 !== 0) jacketNum += 1;
    jacketNum = Math.max(36, Math.min(50, jacketNum));

    const totalHeightInches = (heightFeet * 12) + heightInches;
    let lengthLetter = 'R';
    if (totalHeightInches < 68) {
      lengthLetter = 'S'; // Short (under 5'8")
    } else if (totalHeightInches >= 73) {
      lengthLetter = 'L'; // Long (6'1" and over)
    }

    const calculatedWaist = jacketNum - 6; // Standard 6" drop
    return {
      jacketSize: `${jacketNum}${lengthLetter}`,
      drop: 6,
      suggestedWaist: Math.max(waistInches, calculatedWaist),
      lengthLetter: lengthLetter === 'S' ? 'Short' : lengthLetter === 'L' ? 'Long' : 'Regular'
    };
  };

  const recommendation = calculateSize();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-obsidian-900 border border-charcoal-border shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-ivory-400 hover:text-ivory-100 hover:bg-obsidian-800 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2 text-gold-400 mb-2">
          <Ruler className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest font-mono">
            Atelier Precision Tailoring
          </span>
        </div>
        <h3 className="font-serif text-2xl text-ivory-100">
          The ZOX Bespoke Fit Finder
        </h3>
        <p className="text-xs text-ivory-400 mt-1 font-light leading-relaxed">
          Input your proportions to determine your ideal jacket sizing and trouser contour before reserving your garment.
        </p>

        {/* Input Controls */}
        <div className="mt-6 space-y-4">
          
          {/* Height */}
          <div>
            <div className="flex justify-between text-xs text-ivory-300 mb-1">
              <span>Height</span>
              <span className="font-mono text-gold-400 font-medium">
                {heightFeet}' {heightInches}"
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-ivory-400 uppercase">Feet</label>
                <select
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(Number(e.target.value))}
                  className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 text-xs px-3 py-2 rounded focus:outline-none focus:border-gold-500"
                >
                  <option value={5}>5 ft</option>
                  <option value={6}>6 ft</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-ivory-400 uppercase">Inches</label>
                <select
                  value={heightInches}
                  onChange={(e) => setHeightInches(Number(e.target.value))}
                  className="w-full bg-obsidian-950 border border-charcoal-border text-ivory-100 text-xs px-3 py-2 rounded focus:outline-none focus:border-gold-500"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>{i} inches</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Chest Slider */}
          <div>
            <div className="flex justify-between text-xs text-ivory-300 mb-1">
              <span>Chest Circumference</span>
              <span className="font-mono text-gold-400 font-medium">{chestInches} inches</span>
            </div>
            <input
              type="range"
              min={34}
              max={50}
              step={1}
              value={chestInches}
              onChange={(e) => setChestInches(Number(e.target.value))}
              className="w-full accent-gold-500 bg-obsidian-950 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ivory-400">
              <span>34" (Extra Slim)</span>
              <span>42" (Athletic)</span>
              <span>50" (Portly / Broad)</span>
            </div>
          </div>

          {/* Waist Slider */}
          <div>
            <div className="flex justify-between text-xs text-ivory-300 mb-1">
              <span>Trouser Waist Measurement</span>
              <span className="font-mono text-gold-400 font-medium">{waistInches} inches</span>
            </div>
            <input
              type="range"
              min={28}
              max={46}
              step={1}
              value={waistInches}
              onChange={(e) => setWaistInches(Number(e.target.value))}
              className="w-full accent-gold-500 bg-obsidian-950 cursor-pointer"
            />
          </div>

          {/* Fit Silhouette Preference */}
          <div>
            <label className="block text-xs text-ivory-300 mb-2">
              Silhouette Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'slim', label: 'Slim Cut', sub: 'Tapered & Trim' },
                { id: 'modern', label: 'Modern Fit', sub: 'Balanced Elegance' },
                { id: 'classic', label: 'Classic Drape', sub: 'Roomier Traditional' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFitPreference(f.id)}
                  className={`p-2.5 text-center border text-xs transition-colors ${
                    fitPreference === f.id
                      ? 'border-gold-500 bg-gold-500/10 text-ivory-100 font-medium'
                      : 'border-charcoal-border bg-obsidian-950 text-ivory-400'
                  }`}
                >
                  <div className="font-medium">{f.label}</div>
                  <div className="text-[10px] text-ivory-400 font-light">{f.sub}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Calculated Result Card */}
        <div className="mt-6 p-4 bg-obsidian-950 border border-gold-500/50 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-gold-400 text-xs uppercase tracking-wider font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended Size</span>
            </div>
            <div className="font-serif text-3xl text-ivory-100 font-bold mt-1">
              {recommendation.jacketSize}
            </div>
            <div className="text-[11px] text-ivory-400 mt-0.5">
              Jacket Length: {recommendation.lengthLetter} • Trouser Waist: {recommendation.suggestedWaist}W
            </div>
          </div>

          <button
            onClick={() => {
              onApplySizeFilter(recommendation.jacketSize);
              onClose();
            }}
            className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-medium text-xs tracking-wider uppercase transition-colors flex items-center space-x-1.5"
          >
            <span>View Suits in {recommendation.jacketSize}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
