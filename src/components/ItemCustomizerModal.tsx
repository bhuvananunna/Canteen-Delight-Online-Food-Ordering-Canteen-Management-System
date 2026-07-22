import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { X, Flame, Plus, Minus, FileText, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onConfirm: (item: MenuItem, quantity: number, spice?: string, addons?: { name: string; price: number }[], notes?: string) => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({ item, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState<string | undefined>(undefined);
  const [selectedAddons, setSelectedAddons] = useState<{ name: string; price: number }[]>([]);
  const [notes, setNotes] = useState('');

  // Reset states when item changes
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSelectedSpice(item.spiceLevels && item.spiceLevels.length > 0 ? item.spiceLevels[0] : undefined);
      setSelectedAddons([]);
      setNotes('');
    }
  }, [item]);

  if (!item) {
    return (
      <AnimatePresence />
    );
  }

  const handleAddonToggle = (addon: { name: string; price: number }) => {
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.name === addon.name);
      if (exists) {
        return prev.filter(a => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  const getSingleItemTotal = () => {
    const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    return item.price + addonsTotal;
  };

  const getFinalTotal = () => {
    return getSingleItemTotal() * quantity;
  };

  return (
    <AnimatePresence>
      {item && (
        <div key={`customizer-${item.id}`} className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            key="customizer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Modal body */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              key="customizer-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#121212] shadow-2xl border border-stone-800 flex flex-col"
          >
            {/* Header close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 p-2 rounded-full bg-black/60 backdrop-blur-xs text-white hover:bg-black transition-colors shadow-md cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Top high-res visual banner */}
            <div className="relative h-48 w-full bg-stone-900">
              <img
                src={item.image}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-5 left-5 text-white pr-10">
                <div className="flex items-center space-x-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">{item.category}</span>
                </div>
                <h3 className="text-xl font-bold font-sans tracking-tight mt-1">{item.name}</h3>
                <p className="text-white/80 text-xs mt-1 leading-snug line-clamp-2">{item.description}</p>
              </div>
            </div>

            {/* Scrollable Customization parameters */}
            <div className="p-6 overflow-y-auto max-h-[350px] space-y-5">
              {/* Spice levels choice */}
              {item.spiceLevels && item.spiceLevels.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5 text-stone-300 font-sans font-bold text-sm">
                    <Flame className="h-4 w-4 text-amber-500 fill-amber-950/40" />
                    <span>Select Spice Preference</span>
                    <span className="text-[10px] font-normal text-stone-500 font-sans">(Required)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {item.spiceLevels.map((spice) => {
                      const isSelected = selectedSpice === spice;
                      return (
                        <button
                          key={spice}
                          type="button"
                          onClick={() => setSelectedSpice(spice)}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold font-sans transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-[#0a0a0a] border-amber-500 shadow-md shadow-amber-500/10'
                              : 'bg-[#1a1a1a] border-stone-850 text-stone-400 hover:bg-stone-800'
                          }`}
                        >
                          {spice}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Addons choice */}
              {item.addons && item.addons.length > 0 && (
                <div className="space-y-2">
                  <div className="text-stone-300 font-sans font-bold text-sm">
                    Customize Extras
                  </div>
                  <div className="space-y-1.5">
                    {item.addons.map((addon) => {
                      const isSelected = selectedAddons.some(a => a.name === addon.name);
                      return (
                        <div
                          key={addon.name}
                          onClick={() => handleAddonToggle(addon)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                              : 'bg-[#1a1a1a] border-stone-850 text-stone-400 hover:bg-stone-800/60'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="accent-amber-500 h-4 w-4 rounded"
                            />
                            <span className="font-sans text-stone-300">{addon.name}</span>
                          </div>
                          <span className="font-mono text-amber-500 font-bold">+${addon.price.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special instruction notes */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5 text-stone-300 font-sans font-bold text-sm">
                  <FileText className="h-4 w-4 text-stone-500" />
                  <span>Special Request Details</span>
                </div>
                <textarea
                  placeholder="e.g. Extra spicy / No ice / Cut in half / Dressings on the side..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={150}
                  className="w-full border border-stone-800 bg-[#1a1a1a] rounded-xl p-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 font-sans min-h-[60px] text-stone-200 placeholder-stone-600"
                />
              </div>
            </div>

            {/* Quantity select & bottom checkout action drawer */}
            <div className="p-6 bg-stone-900/40 border-t border-stone-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Quantity Select Counter */}
              <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                <span className="text-xs text-stone-400 font-semibold font-sans">Set Quantity</span>
                <div className="flex items-center space-x-1 bg-[#1a1a1a] border border-stone-850 p-1.5 rounded-xl shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 transition-colors cursor-pointer"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-stone-200 text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(20, q + 1))}
                    className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Basket Action */}
              <button
                type="button"
                onClick={() => {
                  onConfirm(item, quantity, selectedSpice, selectedAddons, notes);
                  onClose();
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] font-bold font-sans text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Basket</span>
                <span className="font-semibold text-[#0a0a0a]/50 px-1">|</span>
                <span className="font-mono font-bold">${getFinalTotal().toFixed(2)}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      )}
    </AnimatePresence>
  );
};
