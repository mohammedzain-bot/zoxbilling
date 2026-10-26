import React, { useState } from 'react';
import { X, Sparkles, Compass, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export default function StyleConciergeModal({ suits = [], onClose, onSelectSuit }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    occasion: '',
    vibe: '',
    color: ''
  });

  const handleSelectOption = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (step < 3) {
      setStep(step + 1);
    }
  };

  // Find best matching suit based on answers
  const findMatch = () => {
    let matched = suits.find(s => {
      if (answers.color === 'emerald' && s.color.toLowerCase().includes('emerald')) return true;
      if (answers.color === 'ivory' && s.color.toLowerCase().includes('ivory')) return true;
      if (answers.color === 'navy' && s.color.toLowerCase().includes('navy')) return true;
      if (answers.color === 'burgundy' && s.color.toLowerCase().includes('burgundy')) return true;
      if (answers.occasion === 'wedding' && s.occasion.toLowerCase().includes('wedding')) return true;
      if (answers.occasion === 'blacktie' && s.category === 'Tuxedo') return true;
      return false;
    });

    return matched || suits[0];
  };

  const matchedSuit = step === 4 ? findMatch() : null;

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

        {/* Progress header */}
        <div className="flex items-center space-x-2 text-gold-400 mb-2">
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span className="text-xs uppercase tracking-widest font-mono">
            ZOX Private Style Concierge
          </span>
        </div>

        {step <= 3 && (
          <div className="flex items-center space-x-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 transition-colors ${
                  s <= step ? 'bg-gold-500' : 'bg-charcoal-border'
                }`}
              />
            ))}
          </div>
        )}

        {/* Step 1: Occasion */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-serif text-2xl text-ivory-100">
              What prestigious occasion will you be attending?
            </h3>
            <p className="text-xs text-ivory-400">
              Our master stylist curates tailoring options according to etiquette and lighting environments.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'blacktie', title: 'Black-Tie Charity Gala / Opera', desc: 'Strict formal evening attire' },
                { id: 'wedding', title: 'Royal Wedding (Groom / VIP Guest)', desc: 'Photogenic elegance with vest or tuxedo' },
                { id: 'redcarpet', title: 'Red Carpet, Premiere or Awards', desc: 'Commanding high-fashion statement' },
                { id: 'corporate', title: 'Executive Summit / Private Dinner', desc: 'Sharp authority and prestige cut' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption('occasion', opt.id)}
                  className="p-4 text-left border border-charcoal-border bg-obsidian-950 hover:border-gold-500/80 hover:bg-gold-500/5 transition-all group"
                >
                  <div className="font-serif text-base text-ivory-200 group-hover:text-gold-400 font-medium">
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-ivory-400 mt-1 font-light">
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Aesthetic / Cut Preference */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center space-x-2 text-xs text-ivory-400">
              <button 
                onClick={() => setStep(1)} 
                className="flex items-center space-x-1 hover:text-gold-400"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>
            <h3 className="font-serif text-2xl text-ivory-100">
              Which silhouette aesthetic aligns with your presence?
            </h3>
            <p className="text-xs text-ivory-400">
              Select the tailored personality you wish to project.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { id: 'timeless', title: 'Architectural Black Tie', desc: 'Silk peak lapels, statuesque posture' },
                { id: 'regal', title: 'Regal 3-Piece Waistcoat', desc: 'Horseshoe vest, layered aristocratic depth' },
                { id: 'velvet', title: 'Textured Velvet Indulgence', desc: 'Tactile dinner jacket under evening lights' },
                { id: 'riviera', title: 'Resort Casablanca Ivory', desc: 'Tropical wool warm ivory contrasting black' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption('vibe', opt.id)}
                  className="p-4 text-left border border-charcoal-border bg-obsidian-950 hover:border-gold-500/80 hover:bg-gold-500/5 transition-all group"
                >
                  <div className="font-serif text-base text-ivory-200 group-hover:text-gold-400 font-medium">
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-ivory-400 mt-1 font-light">
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Color Palette */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center space-x-2 text-xs text-ivory-400">
              <button 
                onClick={() => setStep(2)} 
                className="flex items-center space-x-1 hover:text-gold-400"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>
            <h3 className="font-serif text-2xl text-ivory-100">
              Select your preferred color narrative
            </h3>
            <p className="text-xs text-ivory-400">
              The color that will define your photograph and entrance.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { id: 'black', title: 'Obsidian Black', hex: '#090909', desc: 'Definitive Black Tie' },
                { id: 'navy', title: 'Imperial Navy', hex: '#0b1528', desc: 'Rich Deep Worsted' },
                { id: 'emerald', title: 'Forest Emerald', hex: '#08281a', desc: 'Plush Italian Velvet' },
                { id: 'ivory', title: 'Warm Ivory', hex: '#f7f4ea', desc: 'Riviera Formalwear' },
                { id: 'burgundy', title: 'Bordeaux Burgundy', hex: '#3b0c17', desc: 'Daring Red Carpet' },
                { id: 'charcoal', title: 'Milano Charcoal', hex: '#222222', desc: 'Power Chalkstripe' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    handleSelectOption('color', opt.id);
                    setStep(4);
                  }}
                  className="p-3 text-left border border-charcoal-border bg-obsidian-950 hover:border-gold-500/80 transition-all flex items-center space-x-3 group"
                >
                  <span
                    className="w-5 h-5 rounded-full border border-charcoal-border shrink-0 shadow-inner"
                    style={{ backgroundColor: opt.hex }}
                  />
                  <div>
                    <div className="text-xs font-serif font-medium text-ivory-200 group-hover:text-gold-400">
                      {opt.title}
                    </div>
                    <div className="text-[10px] text-ivory-400 font-light truncate">
                      {opt.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Stylist Recommendation Result */}
        {step === 4 && matchedSuit && (
          <div className="space-y-5 animate-in zoom-in-95 duration-300">
            <div className="flex items-center space-x-2 text-gold-400 text-xs uppercase tracking-wider font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Your Bespoke Curated Match</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-obsidian-950 border border-gold-500/40">
              <img
                src={matchedSuit.images?.[0]}
                alt={matchedSuit.title}
                className="w-full sm:w-32 h-44 object-cover border border-charcoal-border"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-500">
                    {matchedSuit.sku}
                  </span>
                  <h4 className="font-serif text-xl text-ivory-100 mt-0.5">
                    {matchedSuit.title}
                  </h4>
                  <p className="text-xs text-ivory-400 mt-1 line-clamp-2">
                    {matchedSuit.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-charcoal-border flex items-baseline justify-between">
                  <div className="text-xs text-ivory-400">
                    Rental Tier: <span className="font-serif text-gold-400 text-base font-bold">${matchedSuit.rentalPricing?.["3days"]}</span>
                  </div>
                  <span className="text-[10px] uppercase text-ivory-400 bg-obsidian-900 px-2 py-0.5 border border-charcoal-border">
                    {matchedSuit.fit}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 border border-charcoal-border text-ivory-400 hover:text-ivory-100 text-xs tracking-wider uppercase transition-colors"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => {
                  onSelectSuit(matchedSuit);
                  onClose();
                }}
                className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-medium text-xs tracking-wider uppercase transition-colors flex items-center justify-center space-x-2"
              >
                <span>Examine & Reserve This Garment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
