import React from 'react';
import { MenuItem } from '../types';
import { Star, Clock, AlertCircle, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

interface MenuGridProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ items, onSelectItem, onQuickAdd }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 bg-[#121212] border border-stone-800 rounded-3xl">
        <AlertCircle className="h-10 w-10 text-stone-500 mb-3" />
        <h4 className="text-base font-bold text-stone-300 font-sans">No dishes match your filters</h4>
        <p className="text-xs text-stone-500 max-w-xs mt-1">
          Try typing something else, changing categories, or clearing your diet selections.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6" id="menu-items-grid">
      {items.map((item, index) => {
        const hasOptions = (item.spiceLevels && item.spiceLevels.length > 0) || (item.addons && item.addons.length > 0);
        
        return (
          <motion.div
            key={item.id}
            id={`menu-item-card-${item.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
            whileHover={{ y: -6, transition: { duration: 0.15 } }}
            className="group bg-[#121212] rounded-3xl border border-stone-800/80 hover:border-stone-700/90 shadow-lg hover:shadow-black/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Image Section */}
            <div className="relative h-44 w-full bg-stone-950 overflow-hidden" id={`menu-item-image-container-${item.id}`}>
              <img
                src={item.image}
                alt={item.name}
                id={`menu-item-image-${item.id}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                onError={(e) => {
                  // Fallback food picture if Unsplash is slow or fails
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600';
                }}
              />
              {/* Premium seamless gradient vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30 opacity-90 z-10 pointer-events-none transition-opacity duration-350" />

              {/* Diet Tag Overlay */}
              <div className="absolute top-3 left-3 bg-[#0a0a0a]/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-sm z-20">
                <span className={`h-2.5 w-2.5 rounded-full flex items-center justify-center border ${
                  item.isVeg 
                    ? 'border-emerald-500 text-emerald-500' 
                    : 'border-rose-500 text-rose-500'
                }`}>
                  <span className={`h-1 w-1 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider font-sans ${
                  item.isVeg ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {item.isVeg ? 'VEG' : 'NON-VEG'}
                </span>
              </div>

              {/* Availability tag */}
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center text-center z-20">
                  <span className="bg-red-650 text-white font-sans text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md border border-red-500/25">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Rating overlay */}
              {item.isAvailable && (
                <div className="absolute bottom-3 right-3 bg-[#0a0a0a]/80 backdrop-blur-xs px-2 py-1 rounded-lg flex items-center space-x-1 shadow-md text-white border border-stone-850 z-20">
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-bold font-mono">{item.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between" id={`menu-item-details-${item.id}`}>
              <div>
                <div className="flex items-start justify-between">
                  <h4 id={`menu-item-title-${item.id}`} className="text-base font-bold text-stone-100 group-hover:text-amber-400 transition-colors duration-200 tracking-tight font-sans line-clamp-1">
                    {item.name}
                  </h4>
                  <span className="text-amber-500 font-mono font-bold text-base whitespace-nowrap pl-2">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-stone-400 text-xs mt-1.5 leading-relaxed font-sans line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Footer specs & order trigger */}
              <div className="mt-4 pt-4 border-t border-stone-850 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-stone-500 font-mono text-[10px] font-semibold">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-stone-600" />
                    <span>{item.prepTime}m prep</span>
                  </span>
                </div>

                {item.isAvailable && (
                  <button
                    onClick={() => onSelectItem(item)}
                    id={`menu-item-btn-${item.id}`}
                    className="bg-stone-900 hover:bg-stone-850 text-amber-500 hover:text-amber-400 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs border border-stone-800 hover:border-stone-700/80"
                  >
                    {hasOptions ? (
                      <>
                        <span>Customize</span>
                        <span className="text-[10px] bg-stone-800 text-amber-400 px-1.5 py-0.5 rounded-md font-normal">
                          +Options
                        </span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-3 w-3" />
                        <span>Quick Add</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
