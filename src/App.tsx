import React, { useState } from 'react';
import { CanteenProvider, useCanteen } from './context/CanteenContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilters } from './components/CategoryFilters';
import { MenuGrid } from './components/MenuGrid';
import { ItemCustomizerModal } from './components/ItemCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTracker } from './components/OrderTracker';
import { WalletPanel } from './components/WalletPanel';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { NotificationToast } from './components/NotificationToast';
import { MenuItem } from './types';
import { Sparkles, ShoppingBag, LogIn, ChefHat, User } from 'lucide-react';
import { motion } from 'motion/react';

function AppContent() {
  const { 
    activeView, 
    menuItems, 
    addToCart, 
    currentUser, 
    isLoading 
  } = useCanteen();

  // Drawer & modal controls
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Menu filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');

  // Filter items logic
  const getFilteredItems = () => {
    let items = [...menuItems];

    // Category
    if (selectedCategory !== 'all') {
      items = items.filter(i => i.category === selectedCategory);
    }

    // Diet
    if (dietFilter === 'veg') {
      items = items.filter(i => i.isVeg);
    } else if (dietFilter === 'non-veg') {
      items = items.filter(i => !i.isVeg);
    }

    // Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter(i => 
        i.name.toLowerCase().includes(query) || 
        i.description.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (sortBy === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  };

  const handleSelectItem = (item: MenuItem) => {
    setCustomizingItem(item);
  };

  const handleQuickAdd = (item: MenuItem) => {
    addToCart(item, 1, item.spiceLevels?.[0], []);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-sans">
        <div className="bg-[#121212] p-8 rounded-3xl border border-stone-800 shadow-xl flex flex-col items-center space-y-4">
          <div className="h-10 w-10 rounded-xl bg-amber-500 animate-spin flex items-center justify-center">
            <ChefHat className="h-5 w-5 text-[#0a0a0a]" />
          </div>
          <span className="text-sm font-medium text-stone-300 tracking-tight">
            Preparing Canteen Kitchen...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-200 pb-16">
      {/* Primary Top Header */}
      <Navbar 
        onCartOpen={() => setCartOpen(true)} 
        onAuthOpen={() => setAuthOpen(true)} 
      />

      {/* Main Core Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* VIEW 1: FOOD MENU EXPLORER */}
        {activeView === 'menu' && (
          <div className="space-y-6">
            <HeroSection onCartOpen={() => setCartOpen(true)} />
            
            <CategoryFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              dietFilter={dietFilter}
              setDietFilter={setDietFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            <MenuGrid 
              items={getFilteredItems()} 
              onSelectItem={handleSelectItem}
              onQuickAdd={handleQuickAdd}
            />
          </div>
        )}

        {/* VIEW 2: ORDER KITCHEN TRACKER */}
        {activeView === 'tracker' && (
          <div className="max-w-4xl mx-auto py-4">
            <OrderTracker />
          </div>
        )}

        {/* VIEW 3: USER DIGITAL WALLET */}
        {activeView === 'wallet' && (
          <div className="py-4">
            <WalletPanel />
          </div>
        )}

        {/* VIEW 4: ADMIN STAFF MANAGEMENT */}
        {activeView === 'admin' && currentUser?.role === 'admin' && (
          <div className="py-4">
            <AdminPanel />
          </div>
        )}
      </main>

      {/* MODALS & PORTALS DRAWER */}
      <ItemCustomizerModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onConfirm={addToCart}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onAuthOpen={() => setAuthOpen(true)}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />

      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <CanteenProvider>
      <AppContent />
    </CanteenProvider>
  );
}
export { App };
