import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { X, Trash2, ShoppingBag, Clock, Coins, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthOpen: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onAuthOpen }) => {
  const { 
    cart, 
    currentUser, 
    updateCartQuantity, 
    removeFromCart, 
    getCartTotal, 
    placeOrder, 
    setActiveView 
  } = useCanteen();

  const [orderType, setOrderType] = useState<'takeaway' | 'dinein'>('takeaway');
  const [pickupTime, setPickupTime] = useState<string>('Immediate (10-15m)');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const total = getCartTotal();
  const tax = Number((total * 0.05).toFixed(2)); // 5% service charge
  const finalTotal = Number((total + tax).toFixed(2));

  const pickupSlots = [
    'Immediate (10-15m)',
    '11:45 AM (Lunch Start)',
    '12:00 PM',
    '12:15 PM',
    '12:30 PM',
    '12:45 PM',
    '1:00 PM',
    '1:15 PM',
    '1:30 PM',
    '4:00 PM (Tea Break)',
    '4:30 PM'
  ];

  const handleCheckout = async () => {
    if (!currentUser) {
      onClose();
      onAuthOpen();
      return;
    }

    setIsSubmitting(true);
    const success = await placeOrder(orderType, pickupTime, specialNotes);
    setIsSubmitting(false);
    
    if (success) {
      onClose();
    }
  };

  const isWalletShort = currentUser ? currentUser.walletBalance < finalTotal : false;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-xs"
        />

        {/* Drawer panel */}
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="w-screen max-w-md bg-[#121212] shadow-2xl border-l border-stone-800 flex flex-col h-full"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-stone-850 bg-stone-900/40 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-stone-200 font-sans">Your Food Basket</h3>
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {cart.length} items
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-stone-800 rounded-full text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <ShoppingBag className="h-12 w-12 text-stone-700 mb-3" />
                  <h4 className="text-sm font-bold text-stone-400 font-sans">Your basket is empty</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Browse our gourmet campus menu and customize your delicious meal to get started!
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 bg-stone-900 text-amber-500 border border-stone-800 px-4 py-2 rounded-xl text-xs font-bold font-sans hover:bg-stone-800/80 transition-all cursor-pointer"
                  >
                    Browse Canteen Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-4">
                    {cart.map((ci) => {
                      const basePrice = ci.menuItem.price;
                      const addonsPrice = ci.selectedAddons.reduce((sum, a) => sum + a.price, 0);
                      const unitPrice = basePrice + addonsPrice;
                      const rowTotal = unitPrice * ci.quantity;

                      return (
                        <div key={ci.id} className="flex items-start space-x-3 p-3 bg-[#1a1a1a] border border-stone-850 rounded-2xl">
                          <img
                            src={ci.menuItem.image}
                            alt={ci.menuItem.name}
                            referrerPolicy="no-referrer"
                            className="h-14 w-14 object-cover rounded-xl bg-stone-900"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h5 className="text-xs sm:text-sm font-bold text-stone-200 font-sans truncate pr-2">
                                {ci.menuItem.name}
                              </h5>
                              <button
                                onClick={() => removeFromCart(ci.id)}
                                className="text-stone-500 hover:text-rose-400 transition-colors p-1 rounded-md hover:bg-stone-800 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            
                            {/* Custom options indicators */}
                            {(ci.selectedSpice || ci.selectedAddons.length > 0) && (
                              <div className="flex flex-wrap items-center gap-1 mt-1 text-[10px] text-stone-400 font-sans">
                                {ci.selectedSpice && (
                                  <span className="bg-amber-950/40 text-amber-500 px-1.5 py-0.5 rounded font-semibold">
                                    🌶️ {ci.selectedSpice}
                                  </span>
                                )}
                                {ci.selectedAddons.map(add => (
                                  <span key={add.name} className="bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded">
                                    +{add.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            {ci.specialInstructions && (
                              <p className="text-[10px] italic text-stone-500 mt-1 truncate">
                                "{ci.specialInstructions}"
                              </p>
                            )}

                            {/* Qty and row price */}
                            <div className="flex items-center justify-between mt-3">
                              {/* Quantity selectors */}
                              <div className="flex items-center space-x-1 bg-stone-900 border border-stone-800 px-1 py-0.5 rounded-lg shadow-xxs">
                                <button
                                  onClick={() => updateCartQuantity(ci.id, ci.quantity - 1)}
                                  className="h-5 w-5 rounded hover:bg-stone-800 flex items-center justify-center text-stone-400 text-xs font-bold cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center font-mono font-semibold text-stone-200 text-xs">{ci.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(ci.id, ci.quantity + 1)}
                                  className="h-5 w-5 rounded hover:bg-stone-800 flex items-center justify-center text-stone-400 text-xs font-bold cursor-pointer"
                                >
                                  +
                                </button>
                              </div>

                              <span className="text-xs font-mono font-bold text-stone-300">
                                ${rowTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order logistics */}
                  <div className="border-t border-stone-850 pt-5 space-y-4 font-sans">
                    {/* Dine-in vs Takeaway toggle */}
                    <div className="space-y-2">
                      <span className="block text-xs font-bold text-stone-400 uppercase tracking-wider">
                        Dining Preference
                      </span>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-[#1a1a1a] rounded-xl border border-stone-850">
                        <button
                          type="button"
                          onClick={() => setOrderType('takeaway')}
                          className={`py-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                            orderType === 'takeaway'
                              ? 'bg-stone-800 text-amber-500 shadow-sm'
                              : 'text-stone-500 hover:text-stone-300'
                          }`}
                        >
                          🎒 Takeaway Box
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderType('dinein')}
                          className={`py-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                            orderType === 'dinein'
                              ? 'bg-stone-800 text-amber-500 shadow-sm'
                              : 'text-stone-500 hover:text-stone-300'
                          }`}
                        >
                          🍽️ Dine-in Table
                        </button>
                      </div>
                    </div>

                    {/* Pickup scheduling */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-1 text-xs font-bold text-stone-400 uppercase tracking-wider">
                        <Clock className="h-3.5 w-3.5 text-stone-500" />
                        <span>Schedule Pickup Time</span>
                      </div>
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-stone-850 rounded-xl p-2.5 text-xs font-semibold text-stone-300 outline-none cursor-pointer focus:border-amber-500 transition-colors"
                      >
                        {pickupSlots.map((slot) => (
                          <option className="bg-[#121212] text-stone-300" key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>

                    {/* Order instructions */}
                    <div className="space-y-1.5">
                      <span className="block text-xs font-bold text-stone-400 uppercase tracking-wider">
                        Canteen Chef Notes
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. Bring food directly to table 4..."
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-stone-850 rounded-xl px-3 py-2 text-xs font-sans outline-none text-stone-200 placeholder-stone-600 focus:ring-2 focus:ring-amber-500/15 focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Checkout details drawer */}
            {cart.length > 0 && (
              <div className="p-6 bg-[#1a1a1a] border-t border-stone-850 space-y-4">
                {/* Financial overview */}
                <div className="space-y-2 font-sans">
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>Items Subtotal</span>
                    <span className="font-mono">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>Canteen Service Fee (5%)</span>
                    <span className="font-mono">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-stone-200 pt-1.5 border-t border-stone-800">
                    <span>Final Amount Due</span>
                    <span className="font-mono text-amber-500 text-base">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Authentication / Wallet condition banner */}
                {currentUser ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-900 border border-stone-850 text-xs font-sans shadow-xxs">
                    <div className="flex items-center space-x-1.5 text-stone-400">
                      <Coins className="h-4 w-4 text-amber-500" />
                      <span>Wallet Balance:</span>
                    </div>
                    <span className={`font-mono font-bold ${isWalletShort ? 'text-rose-400 animate-pulse' : 'text-stone-200'}`}>
                      ${currentUser.walletBalance.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-2xl text-xs text-amber-400 text-center font-sans font-medium">
                    You must sign in to pay using your canteen digital balance.
                  </div>
                )}

                {/* Submit Action */}
                {currentUser && isWalletShort ? (
                  <button
                    onClick={() => {
                      onClose();
                      setActiveView('wallet');
                    }}
                    className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Add Wallet Balance</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/10 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <span>Pay & Place Order</span>
                        <CheckCircle2 className="h-4 w-4 text-[#0a0a0a]/50" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
