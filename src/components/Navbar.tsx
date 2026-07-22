import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { 
  Utensils, 
  ShoppingCart, 
  Wallet, 
  Clock, 
  User, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  Menu as MenuIcon, 
  X, 
  DollarSign, 
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartOpen, onAuthOpen }) => {
  const { 
    currentUser, 
    activeView, 
    setActiveView, 
    cart, 
    logout, 
    toggleUserRole,
    isFirebaseMode 
  } = useCanteen();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  const navItems = [
    { id: 'menu', label: 'Browse Menu', icon: Utensils },
    { id: 'tracker', label: 'Order Status', icon: Clock },
    { id: 'wallet', label: 'My Wallet', icon: Wallet },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Canteen Dashboard', icon: ShieldCheck });
  }

  return (
    <nav className="sticky top-0 z-40 bg-[#0a0a0a]/85 backdrop-blur-md border-b border-stone-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LOGO */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveView('menu')}>
            <div className="bg-gradient-to-tr from-amber-500 to-orange-600 p-2.5 rounded-xl text-[#0a0a0a] shadow-md shadow-amber-500/10">
              <Utensils className="h-6 w-6 text-[#0a0a0a]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-stone-100 font-sans">
                Canteen<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Delight</span>
              </span>
              <span className="text-[9px] font-mono text-stone-500 -mt-1 font-bold tracking-wider">
                CAMPUS CULINARY HUB
              </span>
            </div>
          </div>

          {/* DESKTOP NAV ITEMS */}
          <div className="hidden md:flex items-center space-x-1.5" id="desktop-nav-items-container">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-btn-${item.id}`}
                  onClick={() => setActiveView(item.id as any)}
                  className="relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 group cursor-pointer"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      id="active-nav-bg-indicator"
                      className="absolute inset-0 bg-stone-900 border border-stone-800/80 rounded-xl shadow-inner z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center space-x-2">
                    <Icon className={`h-4 w-4 transition-colors duration-200 ${isActive ? 'text-amber-500' : 'text-stone-500 group-hover:text-stone-300'}`} />
                    <span className={isActive ? 'text-amber-500 font-semibold' : 'text-stone-400 group-hover:text-stone-200'}>
                      {item.label}
                    </span>
                    {item.id === 'tracker' && currentUser && (
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT SIDE OPTIONS */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Quick Wallet View */}
            {currentUser && currentUser.role === 'customer' && (
              <div 
                onClick={() => setActiveView('wallet')}
                className="flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-850 px-3 py-1.5 rounded-xl border border-stone-800 cursor-pointer transition-all shadow-sm"
              >
                <Wallet className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-mono font-bold text-amber-500">
                  ${currentUser.walletBalance.toFixed(2)}
                </span>
              </div>
            )}

            {/* Cart Button */}
            {(!currentUser || currentUser.role === 'customer') && (
              <button
                onClick={onCartOpen}
                className="relative bg-stone-900 hover:bg-stone-850 px-4 py-2.5 rounded-xl border border-stone-800 text-stone-300 hover:text-amber-500 transition-all cursor-pointer shadow-sm flex items-center space-x-2"
                title="View Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="text-xs font-bold text-stone-300 hover:text-amber-500">View Cart</span>
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 bg-amber-500 text-[#0a0a0a] font-mono text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0a] shadow-md"
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}

            {/* User Account / Profile dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 px-3.5 py-1.5 rounded-xl text-stone-200 text-sm font-medium transition-all shadow-sm cursor-pointer"
                >
                  <div className="bg-amber-500 h-7 w-7 rounded-lg flex items-center justify-center text-[#0a0a0a] font-bold text-xs uppercase shadow-inner">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="flex flex-col text-left max-w-[120px]">
                    <span className="truncate leading-none text-xs text-stone-200 font-semibold">{currentUser.name}</span>
                    <span className="text-[9px] text-stone-500 mt-0.5 uppercase font-mono tracking-wider font-bold">{currentUser.role}</span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-stone-500" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      {/* overlay screen guard */}
                      <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#121212] border border-stone-800 shadow-xl z-50 overflow-hidden py-1"
                      >
                        <div className="px-4 py-3 border-b border-stone-800/80 bg-stone-900/40">
                          <span className="block text-xs text-stone-500">Signed in as</span>
                          <span className="block text-sm font-semibold text-stone-200 truncate">{currentUser.email}</span>
                          <span className="inline-flex mt-1 items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-stone-800 text-stone-300 font-mono">
                            {isFirebaseMode ? '🔥 Firebase Account' : '💻 Local Account'}
                          </span>
                        </div>



                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left flex items-center space-x-2 px-4 py-3 text-sm text-rose-400 hover:bg-rose-950/25 font-medium transition-all"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={onAuthOpen}
                className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] px-5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-amber-500/10 hover:shadow-lg transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex md:hidden items-center space-x-2">
            {currentUser && currentUser.role === 'customer' && (
              <div 
                onClick={() => setActiveView('wallet')}
                className="flex items-center space-x-1 bg-stone-900 px-2 py-1 rounded-lg border border-stone-800"
              >
                <Wallet className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-[11px] font-mono font-bold text-amber-500">${currentUser.walletBalance.toFixed(2)}</span>
              </div>
            )}

            {(!currentUser || currentUser.role === 'customer') && (
              <button
                onClick={onCartOpen}
                className="relative bg-stone-900 p-2 rounded-lg text-stone-300 border border-stone-800"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-[#0a0a0a] font-mono text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-[#0a0a0a]">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-stone-900 p-2 rounded-lg text-stone-300 border border-stone-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a] border-b border-stone-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-stone-950 text-amber-500 border border-stone-800' 
                        : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-4 border-t border-stone-800 space-y-2">
                {currentUser ? (
                  <>
                    <div className="px-4 py-2 flex items-center space-x-3">
                      <div className="bg-amber-500 h-8 w-8 rounded-lg flex items-center justify-center text-[#0a0a0a] font-bold text-sm uppercase shadow-sm">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-stone-200 leading-none">{currentUser.name}</span>
                        <span className="text-[10px] text-stone-500 mt-1 uppercase font-mono tracking-wider font-bold">{currentUser.role}</span>
                      </div>
                    </div>


                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-950/20 font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onAuthOpen();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] text-center py-2.5 rounded-xl text-sm font-bold shadow-md"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
