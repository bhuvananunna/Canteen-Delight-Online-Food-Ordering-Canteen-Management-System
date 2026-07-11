import React from 'react';
import { useCanteen } from '../context/CanteenContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationToast: React.FC = () => {
  const { toast, hideToast } = useCanteen();

  if (!toast) return null;

  const config = {
    success: { bg: 'bg-[#121212]', border: 'border-emerald-500/30', text: 'text-stone-200', iconColor: 'text-emerald-400', icon: CheckCircle2 },
    error: { bg: 'bg-[#121212]', border: 'border-rose-500/30', text: 'text-stone-200', iconColor: 'text-rose-400', icon: AlertCircle },
    info: { bg: 'bg-[#121212]', border: 'border-amber-500/30', text: 'text-stone-200', iconColor: 'text-amber-400', icon: Info }
  };

  const selected = config[toast.type] || config.info;
  const ToastIcon = selected.icon;

  return (
    <AnimatePresence>
      <div className="fixed bottom-5 right-5 z-50 pointer-events-none max-w-sm w-full font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl ${selected.text} ${selected.bg} shadow-xl shadow-black/40 border ${selected.border}`}
        >
          <div className="flex items-center space-x-3 pr-4">
            <ToastIcon className={`h-5 w-5 shrink-0 ${selected.iconColor}`} />
            <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
          </div>
          <button
            onClick={hideToast}
            className="p-1 hover:bg-stone-800 rounded-lg text-stone-500 hover:text-stone-300 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
