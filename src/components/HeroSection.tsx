import React from 'react';
import { Sparkles, Clock, ShieldCheck, Heart, Award, ArrowRight, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { useCanteen } from '../context/CanteenContext';

interface HeroSectionProps {
  onCartOpen: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onCartOpen }) => {
  const { setActiveView, currentUser } = useCanteen();

  const promotions = [
    {
      badge: 'YOUR FOOD BASKET',
      title: 'Ready to Feast? View Your Cart',
      desc: 'Inspect your chosen meals, add custom chef instructions, configure spice levels, and place your order with your preloaded digital wallet.',
      bg: 'from-amber-500 to-amber-600 shadow-amber-500/5',
      textClass: 'text-[#0a0a0a]',
      descClass: 'text-[#0a0a0a]/80',
      badgeClass: 'bg-[#0a0a0a]/10 text-[#0a0a0a] border-[#0a0a0a]/10',
      btnClass: 'bg-stone-950 text-amber-400 hover:bg-stone-900',
      iconBgClass: 'bg-[#0a0a0a]/10 border-[#0a0a0a]/5 text-[#0a0a0a]',
      icon: ShoppingCart,
      action: onCartOpen,
      btnText: 'View Cart'
    }
  ];

  return (
    <div className="py-6 sm:py-8">
      {/* Dynamic Welcome Greeting */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-100 tracking-tight font-sans">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">CanteenDelight</span>
          </h1>
          <p className="text-stone-400 text-sm sm:text-base mt-1">
            {currentUser 
              ? `Hello, ${currentUser.name}! What delicious meal would you like to order today?`
              : "Discover chef-crafted meals, pre-order for pick-up, and dine at your convenience!"
            }
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex items-center space-x-2 bg-emerald-950/30 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-900/50 text-xs font-semibold w-max font-sans">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Canteen Kitchen is OPEN • Ready in 10-15m</span>
        </div>
      </div>

      {/* Hero promo cards grid */}
      <div className="grid grid-cols-1 max-w-3xl mx-auto w-full gap-4">
        {promotions.map((promo, idx) => {
          const Icon = promo.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${promo.bg} p-6 sm:p-8 shadow-lg flex flex-col justify-between min-h-[180px] sm:min-h-[220px]`}
            >
              {/* Background abstract decoration shapes */}
              <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 h-44 w-44 rounded-full bg-white/5 blur-xl" />
              <div className="absolute top-0 right-1/4 -translate-y-8 h-24 w-24 rounded-full bg-white/5 blur-lg" />

              <div>
                <span className={`inline-flex px-2.5 py-0.5 border rounded-full text-[10px] font-bold font-mono uppercase tracking-wider mb-3 ${promo.badgeClass}`}>
                  {promo.badge}
                </span>
                <h3 className={`text-lg sm:text-2xl font-bold font-sans tracking-tight mb-2 sm:max-w-md ${promo.textClass}`}>
                  {promo.title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed sm:max-w-md ${promo.descClass}`}>
                  {promo.desc}
                </p>
              </div>

              <div className="mt-4 sm:mt-6 flex items-center justify-between">
                <button
                  onClick={promo.action}
                  className={`${promo.btnClass} px-5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer`}
                >
                  <span>{promo.btnText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <div className={`p-3 rounded-2xl border backdrop-blur-sm ${promo.iconBgClass}`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trust badges */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#121212] p-4 rounded-2xl border border-stone-800">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-950/30 p-1.5 rounded-lg text-amber-500 border border-amber-900/20">
            <Award className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-stone-300">Premium Ingredients</span>
            <span className="text-[9px] text-stone-500">100% fresh, locally sourced</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-amber-950/30 p-1.5 rounded-lg text-amber-500 border border-amber-900/20">
            <Clock className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-stone-300">Swift Service</span>
            <span className="text-[9px] text-stone-500">Average prep time under 15m</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-rose-950/30 p-1.5 rounded-lg text-rose-400 border border-rose-900/20">
            <Heart className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-stone-300">Prepared with Care</span>
            <span className="text-[9px] text-stone-500">Hygienic kitchen, safe prep</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-blue-950/30 p-1.5 rounded-lg text-blue-400 border border-blue-900/20">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-stone-300">Guaranteed Hygiene</span>
            <span className="text-[9px] text-stone-500">Highest compliance checks</span>
          </div>
        </div>
      </div>
    </div>
  );
};
