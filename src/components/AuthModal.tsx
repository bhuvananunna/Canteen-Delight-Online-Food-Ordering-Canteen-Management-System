import React from 'react';
import { useCanteen } from '../context/CanteenContext';
import { X, Sparkles, User, ShieldCheck, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, simulateLogin, currentUser } = useCanteen();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal dialog */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#121212] shadow-2xl border border-stone-800 flex flex-col p-6 sm:p-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full text-stone-500 hover:text-stone-300 hover:bg-stone-900 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Title / Description */}
            <div className="text-center space-y-2 mt-4 sm:mt-6 font-sans">
              <div className="bg-amber-500/10 text-amber-500 p-3 rounded-2xl w-max mx-auto border border-amber-500/20">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-stone-200 tracking-tight font-sans">
                Sign In to CanteenDelight
              </h3>
              <p className="text-stone-400 text-xs max-w-xs mx-auto">
                Access your campus digital balance, track live cooking orders, and order delicious hot meals.
              </p>
            </div>

            {/* Authentication Triggers */}
            <div className="mt-8 space-y-4 font-sans">
              {/* Option A: Real Google OAuth Account */}
              <button
                onClick={async () => {
                  await loginWithGoogle();
                  onClose();
                }}
                className="w-full flex items-center justify-center space-x-2.5 bg-[#1a1a1a] hover:bg-stone-900 text-stone-200 border border-stone-800 font-semibold py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer text-sm"
              >
                <span className="font-bold text-base text-red-500">G</span>
                <span>Sign in with Google Account</span>
              </button>

              {/* Separator line */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-stone-850"></div>
                <span className="flex-shrink mx-4 text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                  Or Instant Simulator
                </span>
                <div className="flex-grow border-t border-stone-850"></div>
              </div>

              {/* Option B: Simulated Student Customer */}
              <button
                onClick={() => {
                  simulateLogin('customer');
                  onClose();
                }}
                className="w-full flex items-center justify-between bg-gradient-to-r from-stone-900 to-[#221c15] hover:from-stone-850 hover:to-[#2e261d] border border-amber-500/10 p-4 rounded-2xl transition-all cursor-pointer text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-500 text-[#0a0a0a] p-2 rounded-xl">
                    <User className="h-4 w-4 animate-fade-in" />
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-stone-200">Student Account</span>
                    <span className="text-[10px] text-stone-400">Pre-loaded with $25.00 mock balance</span>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-500/15 text-amber-400 font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                  TRY IT
                </span>
              </button>

              {/* Option C: Simulated Canteen Manager (Admin) */}
              <button
                onClick={() => {
                  simulateLogin('admin');
                  onClose();
                }}
                className="w-full flex items-center justify-between bg-stone-900/60 hover:bg-stone-900 border border-stone-850 p-4 rounded-2xl transition-all cursor-pointer text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-stone-800 text-stone-300 p-2 rounded-xl">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-stone-200">Canteen Manager</span>
                    <span className="text-[10px] text-stone-400">Control incoming orders, edit menu, view charts</span>
                  </div>
                </div>
                <span className="text-[10px] bg-stone-850 text-stone-400 font-bold px-2 py-0.5 rounded-full font-mono uppercase">
                  MANAGE
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
