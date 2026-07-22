import React from 'react';
import { Search, SlidersHorizontal, Layers, Check, X } from 'lucide-react';

interface CategoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: any) => void;
  dietFilter: 'all' | 'veg' | 'non-veg';
  setDietFilter: (diet: 'all' | 'veg' | 'non-veg') => void;
  sortBy: 'rating' | 'price-asc' | 'price-desc';
  setSortBy: (sort: 'rating' | 'price-asc' | 'price-desc') => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  dietFilter,
  setDietFilter,
  sortBy,
  setSortBy,
}) => {
  const categories = [
    { id: 'all', label: 'All Items', icon: '🍽️' },
    { id: 'specials', label: 'Chef Specials', icon: '✨' },
    { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { id: 'mains', label: 'Main Course', icon: '🍛' },
    { id: 'snacks', label: 'Starters & Snacks', icon: '🥟' },
    { id: 'beverages', label: 'Drinks & Beverages', icon: '🥤' },
    { id: 'desserts', label: 'Desserts', icon: '🍰' },
  ];

  return (
    <div id="menu-filters-section" className="bg-[#121212] rounded-3xl border border-stone-800 p-5 shadow-lg space-y-4">
      {/* Search and Sort row */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
          <input
            type="text"
            placeholder="Search our canteen menu (e.g. Dosa, Burger, Coffee)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-800 bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 text-sm font-sans text-stone-200 placeholder-stone-500 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-800 rounded-full text-stone-500 hover:text-stone-300 transition-all"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Sort and Diet */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Diet filter pills */}
          <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setDietFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer ${
                dietFilter === 'all' 
                  ? 'bg-stone-800 text-stone-200 shadow-sm' 
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              All Diet
            </button>
            <button
              onClick={() => setDietFilter('veg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all flex items-center space-x-1 cursor-pointer ${
                dietFilter === 'veg' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-emerald-500/70 hover:bg-emerald-950/20'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white block" />
              <span>Veg</span>
            </button>
            <button
              onClick={() => setDietFilter('non-veg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all flex items-center space-x-1 cursor-pointer ${
                dietFilter === 'non-veg' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'text-rose-500/70 hover:bg-rose-950/20'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white block" />
              <span>Non-Veg</span>
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center space-x-1.5 bg-[#1a1a1a] border border-stone-800 p-1 rounded-xl">
            <span className="text-xs text-stone-500 pl-2 pr-1 flex items-center gap-1 font-medium font-sans">
              <SlidersHorizontal className="h-3 w-3" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-semibold font-sans text-stone-300 outline-none pr-2 py-1 cursor-pointer"
            >
              <option className="bg-[#121212] text-stone-300" value="rating">Top Rated ⭐</option>
              <option className="bg-[#121212] text-stone-300" value="price-asc">Price: Low to High 💸</option>
              <option className="bg-[#121212] text-stone-300" value="price-desc">Price: High to Low 📈</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories scrollable deck */}
      <div className="border-t border-stone-800/80 pt-3 flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1">
        <span className="text-xs text-stone-500 font-bold tracking-wider font-sans uppercase whitespace-nowrap mr-2">
          Categories:
        </span>
        <div className="flex space-x-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold font-sans transition-all whitespace-nowrap border cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-[#0a0a0a] border-amber-400 shadow-md shadow-amber-500/10'
                    : 'bg-[#1a1a1a] hover:bg-stone-800 text-stone-400 border-stone-800/60 hover:text-stone-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
