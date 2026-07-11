import React from 'react';
import { useCanteen } from '../context/CanteenContext';
import { Clock, Check, ChefHat, CheckCircle2, ShoppingBag, BellRing, ChevronDown, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const OrderTracker: React.FC = () => {
  const { orders, currentUser, setActiveView } = useCanteen();

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 bg-[#121212] border border-stone-800 rounded-3xl font-sans">
        <ChefHat className="h-10 w-10 text-stone-650 mb-3" />
        <h4 className="text-base font-bold text-stone-300">Track Your Cooking Live</h4>
        <p className="text-xs text-stone-500 max-w-xs mt-1">
          Please sign in to order food and monitor your delicious meal's real-time preparation status!
        </p>
      </div>
    );
  }

  // Filter orders into active and past
  const activeStatuses = ['pending', 'preparing', 'ready'];
  const activeOrders = orders.filter(o => activeStatuses.includes(o.status));
  const pastOrders = orders.filter(o => !activeStatuses.includes(o.status));

  const steps = [
    { status: 'pending', label: 'Received', desc: 'Order received', icon: ShoppingBag, color: 'orange' },
    { status: 'preparing', label: 'Cooking', desc: 'Sautéing & plating', icon: ChefHat, color: 'amber' },
    { status: 'ready', label: 'Ready', desc: 'Pick up at Counter', icon: BellRing, color: 'emerald' },
    { status: 'completed', label: 'Picked Up', desc: 'Enjoy your food!', icon: CheckCircle2, color: 'blue' }
  ];

  const getStatusIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    return steps.findIndex(s => s.status === status);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Active orders queue section */}
      <div>
        <h2 className="text-xl font-bold text-stone-100 tracking-tight font-sans">
          Active Live Kitchen Orders
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
          See live progression of your hot food as our chefs prepare it.
        </p>

        {activeOrders.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center text-center p-12 bg-[#121212] border border-stone-800 rounded-3xl">
            <ChefHat className="h-10 w-10 text-stone-650 mb-2.5 animate-bounce" />
            <h4 className="text-sm font-bold text-stone-300">No active kitchen orders</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-xs">
              Looks like there are no active dishes cooking. Head over to our menu and order something appetizing!
            </p>
            <button
              onClick={() => setActiveView('menu')}
              className="mt-4 bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] font-bold px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              Order Hot Food
            </button>
          </div>
        ) : (
          <div className="mt-5 space-y-6">
            {activeOrders.map((order) => {
              const currentStepIdx = getStatusIndex(order.status);
              
              return (
                <div 
                  key={order.id} 
                  className="bg-[#121212] rounded-3xl border border-stone-800 shadow-sm p-6 space-y-6 relative overflow-hidden"
                >
                  {/* Decorative glowing edge depending on status */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                    order.status === 'ready' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse' 
                      : order.status === 'preparing' 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600' 
                        : 'bg-amber-600'
                  }`} />

                  {/* Order header specs */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-stone-850 pb-4">
                    <div className="flex items-center space-x-3">
                      <span className="bg-amber-500/10 text-amber-400 text-sm font-extrabold font-mono px-3 py-1.5 rounded-xl border border-amber-550/30">
                        {order.orderNumber}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-stone-200 leading-none">
                          {order.type === 'dinein' ? '🍽️ Dine-in Table Meal' : '🎒 Takeaway Bento Box'}
                        </h4>
                        <span className="text-[10px] text-stone-500 font-mono font-medium block mt-1 uppercase">
                          Scheduled Pickup: {order.scheduledTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-right">
                      <span className="text-xs text-stone-500 block font-mono font-bold">
                        Total Paid: <span className="text-stone-200 text-sm">${order.total.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>

                  {/* STEP-PROGRESS VISUAL GRAPHICS (Interactive Progress Bar) */}
                  <div className="py-2">
                    <div className="relative">
                      {/* Connecting Line */}
                      <div className="absolute top-5 left-6 right-6 h-1 bg-stone-850 -z-10" />
                      <div 
                        className="absolute top-5 left-6 h-1 bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500 -z-10" 
                        style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                      />

                      {/* Steps Deck */}
                      <div className="grid grid-cols-4 gap-2">
                        {steps.map((step, idx) => {
                          const StepIcon = step.icon;
                          const isCompleted = idx < currentStepIdx;
                          const isActive = idx === currentStepIdx;
                          
                          let iconBg = 'bg-stone-900 text-stone-600 border-stone-800';
                          if (isCompleted) {
                            iconBg = 'bg-gradient-to-tr from-amber-600 to-amber-500 text-[#0a0a0a] border-amber-500';
                          } else if (isActive) {
                            if (step.status === 'ready') {
                              iconBg = 'bg-emerald-500 text-[#0a0a0a] border-emerald-400 animate-bounce shadow-md shadow-emerald-500/20';
                            } else {
                              iconBg = 'bg-amber-500 text-[#0a0a0a] border-amber-400 shadow-md shadow-amber-500/20';
                            }
                          }

                          return (
                            <div key={idx} className="flex flex-col items-center text-center">
                              <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all ${iconBg}`}>
                                {isCompleted ? <Check className="h-4.5 w-4.5 stroke-[3px]" /> : <StepIcon className="h-4 w-4" />}
                              </div>
                              <span className={`text-[11px] font-bold mt-2 font-sans ${
                                isActive ? 'text-amber-500 font-extrabold' : isCompleted ? 'text-stone-300' : 'text-stone-500'
                              }`}>
                                {step.label}
                              </span>
                              <span className="text-[9px] text-stone-500 font-sans hidden sm:block mt-0.5">
                                {step.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Active items detailed inventory breakdown */}
                  <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-stone-850 space-y-2">
                    <span className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                      Ordered Food List:
                    </span>
                    <div className="divide-y divide-stone-850 font-sans">
                      {order.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="py-2 flex justify-between items-center text-xs font-semibold">
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-1.5 text-stone-300">
                              <span className="text-amber-500 font-mono font-bold">{item.quantity}x</span>
                              <span>{item.menuItem.name}</span>
                            </div>
                            
                            {/* addon subtext detail */}
                            {(item.selectedSpice || item.selectedAddons.length > 0) && (
                              <div className="flex items-center gap-1.5 text-[9px] text-stone-500 mt-0.5">
                                {item.selectedSpice && <span>Spice: {item.selectedSpice}</span>}
                                {item.selectedAddons.map(a => <span key={a.name}>+ {a.name}</span>)}
                              </div>
                            )}

                            {item.specialInstructions && (
                              <span className="text-[9px] text-stone-500 italic">Chef note: "{item.specialInstructions}"</span>
                            )}
                          </div>
                          <span className="font-mono text-stone-400">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Collapsible history of completed/cancelled orders */}
      <div className="border-t border-stone-850 pt-6">
        <h3 className="text-base font-bold text-stone-400 font-sans mb-3">
          Order History & Receipts
        </h3>

        {pastOrders.length === 0 ? (
          <p className="text-xs text-stone-500 italic font-sans">
            No past completed meals recorded.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-[#121212] p-4 rounded-2xl border border-stone-850 flex justify-between items-center text-xs font-sans"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold bg-stone-800 px-2 py-0.5 rounded text-stone-300">
                      {order.orderNumber}
                    </span>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      order.status === 'completed' 
                        ? 'bg-blue-500/10 text-blue-400' 
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-stone-500 text-[10px] mt-1">
                    {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-stone-300 block">${order.total.toFixed(2)}</span>
                  <span className="text-[9px] text-stone-500">Paid with wallet</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
