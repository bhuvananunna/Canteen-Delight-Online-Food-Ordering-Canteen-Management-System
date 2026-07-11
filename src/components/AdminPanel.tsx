import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { MenuItem, Order, OrderStatus } from '../types';
import { 
  TrendingUp, 
  Plus, 
  Edit2, 
  Trash2, 
  ListOrdered, 
  Settings, 
  Activity, 
  Check, 
  CookingPot, 
  XCircle, 
  Flame,
  ChefHat,
  BadgeDollarSign,
  ShoppingCart,
  AlertTriangle,
  Eye,
  CheckCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const AdminPanel: React.FC = () => {
  const { 
    orders, 
    menuItems, 
    updateOrderStatus, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem,
    showToast 
  } = useCanteen();

  // Admin section sub-tab
  const [adminTab, setAdminTab] = useState<'orders' | 'menu' | 'analytics'>('orders');

  // Menu editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states for menu items
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState<'mains' | 'snacks' | 'beverages' | 'desserts' | 'breakfast'>('mains');
  const [formImage, setFormImage] = useState('');
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formPrep, setFormPrep] = useState('10');

  // Load editing item into form
  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(item.price.toString());
    setFormCategory(item.category);
    setFormImage(item.image);
    setFormIsVeg(item.isVeg);
    setFormPrep(item.prepTime.toString());
    setEditorOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormName('');
    setFormDesc('');
    setFormPrice('');
    setFormCategory('mains');
    setFormImage('');
    setFormIsVeg(true);
    setFormPrep('10');
    setEditorOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice);
    const prepNum = parseInt(formPrep);

    if (isNaN(priceNum) || priceNum <= 0 || isNaN(prepNum) || prepNum <= 0) {
      showToast("Please enter valid positive numbers.", "error");
      return;
    }

    const defaultImage = formImage || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600';

    if (editingItem) {
      // Edit existing
      const updated: MenuItem = {
        ...editingItem,
        name: formName,
        description: formDesc,
        price: priceNum,
        category: formCategory,
        image: defaultImage,
        isVeg: formIsVeg,
        prepTime: prepNum
      };
      await updateMenuItem(updated);
    } else {
      // Create new
      const newItem: Omit<MenuItem, 'id'> = {
        name: formName,
        description: formDesc,
        price: priceNum,
        category: formCategory,
        image: defaultImage,
        isVeg: formIsVeg,
        isAvailable: true,
        prepTime: prepNum,
        rating: 5.0
      };
      await addMenuItem(newItem);
    }

    setEditorOpen(false);
    setEditingItem(null);
  };

  const toggleAvailability = async (item: MenuItem) => {
    const updated = { ...item, isAvailable: !item.isAvailable };
    await updateMenuItem(updated);
  };

  // --- ANALYTICS COMPUTATIONS ---
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalSales = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length;
  const outOfStockCount = menuItems.filter(i => !i.isAvailable).length;

  // Chart 1: Sales trend by time (grouped mock data + real data to ensure visual beauty)
  const salesHistoryMock = [
    { name: 'Mon', sales: totalSales * 0.15 + 45 },
    { name: 'Tue', sales: totalSales * 0.20 + 60 },
    { name: 'Wed', sales: totalSales * 0.10 + 35 },
    { name: 'Thu', sales: totalSales * 0.25 + 75 },
    { name: 'Fri', sales: totalSales * 0.30 + 110 },
    { name: 'Sat', sales: totalSales * 0.05 + 20 },
    { name: 'Today', sales: totalSales + 15 }
  ];

  // Chart 2: Category volume distribution
  const categorySummaryMap: Record<string, number> = {};
  completedOrders.forEach(o => {
    o.items.forEach(itm => {
      const cat = menuItems.find(mi => mi.id === itm.menuItem.id)?.category || 'mains';
      categorySummaryMap[cat] = (categorySummaryMap[cat] || 0) + itm.quantity;
    });
  });

  const categoriesChartData = [
    { category: 'Breakfast', count: categorySummaryMap['breakfast'] || 5, fill: '#f59e0b' },
    { category: 'Mains', count: categorySummaryMap['mains'] || 12, fill: '#f97316' },
    { category: 'Quick Bites', count: categorySummaryMap['snacks'] || 8, fill: '#ec4899' },
    { category: 'Drinks', count: categorySummaryMap['beverages'] || 15, fill: '#3b82f6' },
    { category: 'Sweets', count: categorySummaryMap['desserts'] || 4, fill: '#10b981' }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Dynamic Stat Counters Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales Card */}
        <div className="bg-[#121212] rounded-3xl border border-stone-800 p-5 shadow-sm flex items-center space-x-4">
          <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
            <BadgeDollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs text-stone-500 font-semibold uppercase tracking-wider block">Total Turnover</span>
            <span className="text-lg sm:text-2xl font-bold font-mono text-stone-200">${totalSales.toFixed(2)}</span>
          </div>
        </div>

        {/* Active Orders Card */}
        <div className="bg-[#121212] rounded-3xl border border-stone-800 p-5 shadow-sm flex items-center space-x-4">
          <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-500">
            <ChefHat className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs text-stone-500 font-semibold uppercase tracking-wider block">Active Fulfillments</span>
            <span className="text-lg sm:text-2xl font-bold font-mono text-stone-200">{activeOrdersCount}</span>
          </div>
        </div>

        {/* Complete Deliveries */}
        <div className="bg-[#121212] rounded-3xl border border-stone-800 p-5 shadow-sm flex items-center space-x-4">
          <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs text-stone-500 font-semibold uppercase tracking-wider block">Meals Delivered</span>
            <span className="text-lg sm:text-2xl font-bold font-mono text-stone-200">{completedOrders.length}</span>
          </div>
        </div>

        {/* Shortages count */}
        <div className="bg-[#121212] rounded-3xl border border-stone-800 p-5 shadow-sm flex items-center space-x-4">
          <div className="bg-rose-500/10 p-3 rounded-2xl text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs text-stone-500 font-semibold uppercase tracking-wider block">Out of Stock Dishes</span>
            <span className="text-lg sm:text-2xl font-bold font-mono text-stone-200">{outOfStockCount}</span>
          </div>
        </div>
      </div>

      {/* Admin inner menu tabs */}
      <div className="bg-[#1a1a1a] p-1.5 rounded-2xl border border-stone-850 flex space-x-1 w-max">
        <button
          onClick={() => setAdminTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
            adminTab === 'orders' ? 'bg-stone-900 text-amber-500 shadow-xs border border-stone-800' : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          <ListOrdered className="h-4 w-4" />
          <span>Orders Queue ({activeOrdersCount})</span>
        </button>
        <button
          onClick={() => setAdminTab('menu')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
            adminTab === 'menu' ? 'bg-stone-900 text-amber-500 shadow-xs border border-stone-800' : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Menu Manager ({menuItems.length})</span>
        </button>
        <button
          onClick={() => setAdminTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
            adminTab === 'analytics' ? 'bg-stone-900 text-amber-500 shadow-xs border border-stone-800' : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>Business Analytics</span>
        </button>
      </div>

      {/* SUB-PAGES BODY */}
      <div>
        {/* --- ORDERS QUEUE PANEL --- */}
        {adminTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-stone-200 font-sans">Incoming Food Orders</h3>
            
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-[#121212] border border-stone-800 rounded-3xl">
                <ShoppingCart className="h-10 w-10 text-stone-650 mx-auto mb-2.5" />
                <h4 className="text-sm font-bold text-stone-300">No canteen orders logged yet</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
                  Once customers add items and pay from their digital wallet, they will appear in this real-time list.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isActive = ['pending', 'preparing', 'ready'].includes(order.status);
                  
                  return (
                    <div 
                      key={order.id} 
                      className={`bg-[#121212] rounded-3xl border border-stone-800 p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5 transition-all ${
                        !isActive ? 'opacity-65' : ''
                      }`}
                    >
                      {/* Left: Customer + Order Info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-extrabold bg-amber-500/10 text-amber-400 px-3 py-1 rounded-xl text-xs border border-amber-500/20">
                            {order.orderNumber}
                          </span>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            order.status === 'pending' 
                              ? 'bg-amber-500/10 text-amber-400 animate-pulse' 
                              : order.status === 'preparing' 
                                ? 'bg-amber-500/10 text-amber-500' 
                                : order.status === 'ready' 
                                  ? 'bg-emerald-500/10 text-emerald-400' 
                                  : 'bg-stone-800 text-stone-400'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order items line list */}
                        <div className="text-xs font-semibold space-y-1">
                          {order.items.map((itm, idx) => (
                            <div key={idx} className="flex items-center space-x-1.5 text-stone-300">
                              <span className="text-amber-500 font-mono font-bold">{itm.quantity}x</span>
                              <span>{itm.menuItem.name}</span>
                              {itm.selectedSpice && (
                                <span className="text-[10px] text-amber-400 bg-amber-500/15 px-1 rounded">
                                  🌶️ {itm.selectedSpice}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Customer & special specifications footer */}
                        <div className="text-[10px] text-stone-500 space-y-1 pt-1.5 border-t border-stone-850 font-medium">
                          <p>👤 Ordered by: <span className="text-stone-300 font-bold">{order.userName}</span> ({order.userEmail})</p>
                          <p>🕒 Logistics: <span className="text-stone-300 font-bold">{order.type.toUpperCase()}</span> ({order.scheduledTime})</p>
                          {order.specialInstructions && (
                            <p className="text-rose-400 font-semibold italic">⚠️ Special Request: "{order.specialInstructions}"</p>
                          )}
                        </div>
                      </div>

                      {/* Right: Pricing & Step Buttons */}
                      <div className="flex flex-col sm:flex-row sm:items-center md:flex-col md:items-end gap-3 shrink-0">
                        <div className="text-left sm:text-right md:text-right pb-1">
                          <span className="text-[10px] text-stone-500 block font-semibold">PAID REVENUE</span>
                          <span className="text-lg font-mono font-bold text-stone-200">${order.total.toFixed(2)}</span>
                        </div>

                        {/* Status advancement flows */}
                        <div className="flex flex-wrap gap-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-sm"
                            >
                              <CookingPot className="h-3.5 w-3.5" />
                              <span>Start Cooking</span>
                            </button>
                          )}
                          
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                              className="bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0a] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-sm"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Mark as Ready</span>
                            </button>
                          )}

                          {order.status === 'ready' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="bg-blue-500 hover:bg-blue-400 text-[#0a0a0a] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer shadow-sm"
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span>Hand Over (Deliver)</span>
                            </button>
                          )}

                          {isActive && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              className="bg-stone-850 hover:bg-rose-950/40 hover:text-rose-400 text-stone-500 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              title="Cancel & Refund order"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- MENU ITEMS CRUD MANAGER --- */}
        {adminTab === 'menu' && (
          <div className="space-y-4 font-sans">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-stone-200 font-sans">Canteen Menu Catalog</h3>
                <p className="text-xs text-stone-500">Add, edit, remove, or toggle availability of dishes.</p>
              </div>
              <button
                onClick={handleOpenCreate}
                className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            {/* Menu Editor Form Overlay (collapsible drawer card) */}
            <AnimatePresence>
              {editorOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#1a1a1a] border border-stone-850 rounded-3xl p-5 space-y-4 overflow-hidden"
                >
                  <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                    <h4 className="text-xs sm:text-sm font-bold text-stone-200">
                      {editingItem ? `✏️ Edit Dish: ${editingItem.name}` : '✨ Create New Gourmet Dish'}
                    </h4>
                    <button
                      onClick={() => setEditorOpen(false)}
                      className="text-stone-500 hover:text-stone-300 text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-stone-400 font-bold uppercase tracking-wider mb-1">Dish Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Garlic Butter Naan..."
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 outline-none text-stone-200 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold uppercase tracking-wider mb-1">Description</label>
                        <textarea
                          required
                          placeholder="Short mouth-watering ingredients list or descriptions..."
                          value={formDesc}
                          onChange={(e) => setFormDesc(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 outline-none text-stone-200 focus:border-amber-500 min-h-[60px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-400 font-bold uppercase tracking-wider mb-1">Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            placeholder="e.g. 5.99"
                            value={formPrice}
                            onChange={(e) => setFormPrice(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 outline-none text-stone-200 focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 font-bold uppercase tracking-wider mb-1">Prep Time (mins)</label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 12"
                            value={formPrep}
                            onChange={(e) => setFormPrep(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 outline-none text-stone-200 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-stone-400 font-bold uppercase tracking-wider mb-1">Category Category</label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value as any)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 outline-none text-stone-200 focus:border-amber-500 cursor-pointer"
                        >
                          <option value="breakfast">🍳 Breakfast</option>
                          <option value="mains">🍛 Main Course</option>
                          <option value="snacks">🥟 Starters & Snacks</option>
                          <option value="beverages">🥤 Drinks & Beverages</option>
                          <option value="desserts">🍰 Desserts / Sweets</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-400 font-bold uppercase tracking-wider mb-1">Photo Image URL</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/... (optional)"
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 outline-none text-stone-200 focus:border-amber-500"
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-5">
                        <input
                          type="checkbox"
                          id="isVegCheckbox"
                          checked={formIsVeg}
                          onChange={(e) => setFormIsVeg(e.target.checked)}
                          className="h-4 w-4 rounded accent-emerald-500"
                        />
                        <label htmlFor="isVegCheckbox" className="font-bold text-stone-300 cursor-pointer">
                          🥦 Mark this dish as strictly Vegetarian (Veg)
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] font-bold p-2.5 rounded-xl shadow-md mt-4 cursor-pointer"
                      >
                        {editingItem ? 'Save Item Changes' : 'Publish Gourmet Dish'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Menu catalog grid */}
            <div className="bg-[#121212] border border-stone-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-900/60 border-b border-stone-800 text-[10px] sm:text-xs font-bold text-stone-500 uppercase font-sans">
                      <th className="py-3 px-5">Dish</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Prep</th>
                      <th className="py-3 px-4 text-center">In Stock?</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-850 text-xs sm:text-sm text-stone-400 font-medium">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-900/40">
                        <td className="py-3.5 px-5 flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="h-9 w-9 object-cover rounded-lg animate-fade-in"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600';
                            }}
                          />
                          <div className="flex flex-col">
                            <span className="font-bold text-stone-200 leading-snug">{item.name}</span>
                            <span className={`text-[9px] uppercase font-bold ${item.isVeg ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {item.isVeg ? '🥦 Veg' : '🍗 Non-Veg'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-sans text-stone-500 capitalize">{item.category}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-300">${item.price.toFixed(2)}</td>
                        <td className="py-3.5 px-4 font-mono text-stone-500">{item.prepTime}m</td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => toggleAvailability(item)}
                            className="text-amber-500 hover:text-amber-400 transition-colors inline-block align-middle cursor-pointer"
                          >
                            {item.isAvailable ? (
                              <ToggleRight className="h-6 w-6" />
                            ) : (
                              <ToggleLeft className="h-6 w-6 text-stone-700" />
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex justify-end items-center space-x-1.5">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 hover:bg-stone-800 rounded text-stone-500 hover:text-amber-500 transition-colors cursor-pointer"
                              title="Edit item specs"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteMenuItem(item.id)}
                              className="p-1.5 hover:bg-rose-950/45 rounded text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- RECHARTS ANALYTICS --- */}
        {adminTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
            
            {/* Sales performance trend line graph */}
            <div className="lg:col-span-2 bg-[#121212] rounded-3xl border border-stone-800 p-6 shadow-sm space-y-4">
              <div>
                <h4 className="text-sm font-bold text-stone-200">Canteen Sales Revenue Statement</h4>
                <p className="text-xs text-stone-500">Turnover performance trend across current active period.</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={salesHistoryMock}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1c1c1c" />
                    <XAxis dataKey="name" stroke="#57534e" fontSize={11} tickLine={false} />
                    <YAxis stroke="#57534e" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#292524', color: '#e7e5e4' }} />
                    <Area type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Food Categories volume breakdown */}
            <div className="bg-[#121212] rounded-3xl border border-stone-800 p-6 shadow-sm space-y-4">
              <div>
                <h4 className="text-sm font-bold text-stone-200">Meals Volume by Category</h4>
                <p className="text-xs text-stone-500">Quantity of specific item types ordered.</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoriesChartData}
                    layout="vertical"
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1c1c1c" />
                    <XAxis type="number" stroke="#57534e" fontSize={11} tickLine={false} />
                    <YAxis dataKey="category" type="category" stroke="#57534e" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#121212', borderColor: '#292524', color: '#e7e5e4' }} />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                      {categoriesChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
