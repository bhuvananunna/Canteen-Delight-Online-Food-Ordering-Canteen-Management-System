import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { X, Sparkles, ShieldCheck, Mail, Lock, ArrowLeft, AlertCircle, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    loginWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    simulateLogin, 
    currentUser, 
    promoteToAdmin 
  } = useCanteen();
  
  const [view, setView] = useState<'options' | 'password' | 'email-login' | 'email-register'>('options');
  const [password, setPassword] = useState('');
  
  // Email sign in state
  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  
  // Email register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setView(currentUser ? 'password' : 'options');
      setPassword('');
      setEmail('');
      setEmailPassword('');
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setError('');
      setAuthLoading(false);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const handleEmailLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthLoading(true);
    try {
      await signInWithEmail(email, emailPassword);
      handleClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    setError('');
    setAuthLoading(true);
    try {
      await signUpWithEmail(regEmail, regPassword, regName);
      handleClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create account. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
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
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 rounded-full text-stone-500 hover:text-stone-300 hover:bg-stone-900 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Title / Description */}
            <div className="text-center space-y-2 mt-4 sm:mt-6 font-sans">
              <div className="bg-amber-500/10 text-amber-500 p-3 rounded-2xl w-max mx-auto border border-amber-500/20">
                {view === 'password' ? (
                  <ShieldCheck className="h-6 w-6 text-amber-500" />
                ) : view === 'email-login' || view === 'email-register' ? (
                  <Mail className="h-6 w-6 text-amber-500" />
                ) : (
                  <Sparkles className="h-6 w-6 text-amber-500" />
                )}
              </div>
              <h3 className="text-xl font-bold text-stone-200 tracking-tight font-sans">
                {view === 'password' 
                  ? 'Manager Verification' 
                  : view === 'email-login' 
                  ? 'Sign In with Email' 
                  : view === 'email-register' 
                  ? 'Create Canteen Account' 
                  : 'Sign In to CanteenDelight'}
              </h3>
              <p className="text-stone-400 text-xs max-w-xs mx-auto">
                {view === 'password'
                  ? 'This area is restricted to canteen managers. Enter the secret passcode to unlock admin access.'
                  : view === 'email-login'
                  ? 'Sign in to access your digital wallet, view orders, and checkout seamlessly.'
                  : view === 'email-register'
                  ? 'Sign up today and get an automatic $20.00 welcome gift added to your digital wallet!'
                  : 'Access your campus digital balance, track live cooking orders, and order delicious hot meals.'}
              </p>
            </div>

            {/* Authentication Content */}
            <div className="mt-8">
              {view === 'password' && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (password === 'canteen@1324') {
                      if (currentUser) {
                        await promoteToAdmin();
                      } else {
                        localStorage.setItem("foodcanteen_pending_admin", "true");
                        await loginWithGoogle();
                      }
                      handleClose();
                    } else {
                      setError('Incorrect passcode. Please check and try again.');
                    }
                  }}
                  className="space-y-5 font-sans text-left"
                >
                  <div className="flex items-center space-x-2 text-amber-500 mb-1">
                    <button
                      type="button"
                      onClick={() => {
                        setView('options');
                        setError('');
                        setPassword('');
                      }}
                      className="p-1.5 hover:bg-stone-900 rounded-lg text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-semibold uppercase tracking-wider font-mono">Back to Options</span>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider font-mono">
                      Manager Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-500">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="Enter password to access"
                        autoFocus
                        className="block w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 placeholder-stone-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-rose-500 bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl text-xs font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm"
                  >
                    <span>Unlock Dashboard</span>
                  </button>
                </form>
              )}

              {view === 'email-login' && (
                <form onSubmit={handleEmailLoginSubmit} className="space-y-5 font-sans text-left">
                  <div className="flex items-center space-x-2 text-amber-500 mb-1">
                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={() => {
                        setView('options');
                        setError('');
                      }}
                      className="p-1.5 hover:bg-stone-900 rounded-lg text-stone-400 hover:text-stone-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-semibold uppercase tracking-wider font-mono">Back to Options</span>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider font-mono">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-500">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        required
                        disabled={authLoading}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="yourname@domain.com"
                        className="block w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 placeholder-stone-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider font-mono">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-500">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        required
                        disabled={authLoading}
                        value={emailPassword}
                        onChange={(e) => {
                          setEmailPassword(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="••••••••"
                        className="block w-full pl-10 pr-4 py-3 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 placeholder-stone-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-rose-500 bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl text-xs font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-[#0a0a0a] font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm"
                  >
                    {authLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
                    <span>{authLoading ? 'Signing In...' : 'Sign In'}</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={() => {
                        setView('email-register');
                        setError('');
                      }}
                      className="text-amber-500 hover:text-amber-400 text-xs font-semibold cursor-pointer disabled:opacity-50"
                    >
                      New to CanteenDelight? Create an Account
                    </button>
                  </div>
                </form>
              )}

              {view === 'email-register' && (
                <form onSubmit={handleEmailRegisterSubmit} className="space-y-4 font-sans text-left">
                  <div className="flex items-center space-x-2 text-amber-500 mb-1">
                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={() => {
                        setView('email-login');
                        setError('');
                      }}
                      className="p-1.5 hover:bg-stone-900 rounded-lg text-stone-400 hover:text-stone-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-semibold uppercase tracking-wider font-mono">Back to Sign In</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider font-mono">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-500">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        required
                        disabled={authLoading}
                        value={regName}
                        onChange={(e) => {
                          setRegName(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="John Doe"
                        className="block w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 placeholder-stone-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider font-mono">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-500">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        required
                        disabled={authLoading}
                        value={regEmail}
                        onChange={(e) => {
                          setRegEmail(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="yourname@domain.com"
                        className="block w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 placeholder-stone-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider font-mono">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-500">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type="password"
                        required
                        disabled={authLoading}
                        value={regPassword}
                        onChange={(e) => {
                          setRegPassword(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="At least 6 characters"
                        className="block w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-200 placeholder-stone-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-rose-500 bg-rose-950/20 border border-rose-900/30 p-3 rounded-xl text-xs font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-[#0a0a0a] font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm mt-2"
                  >
                    {authLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
                    <span>{authLoading ? 'Creating Account...' : 'Register & Get $20 Welcome Gift'}</span>
                  </button>

                  <div className="text-center pt-1.5">
                    <button
                      type="button"
                      disabled={authLoading}
                      onClick={() => {
                        setView('email-login');
                        setError('');
                      }}
                      className="text-stone-400 hover:text-stone-300 text-xs cursor-pointer disabled:opacity-50"
                    >
                      Already have an account? <span className="text-amber-500 font-semibold">Sign In</span>
                    </button>
                  </div>
                </form>
              )}

              {view === 'options' && (
                <div className="space-y-4 font-sans">
                  {/* Option A: Real Google OAuth Account */}
                  <button
                    onClick={async () => {
                      await loginWithGoogle();
                      handleClose();
                    }}
                    className="w-full flex items-center justify-center space-x-2.5 bg-[#1a1a1a] hover:bg-stone-900 text-stone-200 border border-stone-800 font-semibold py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer text-sm"
                  >
                    <span className="font-bold text-base text-red-500">G</span>
                    <span>Sign in with Google Account</span>
                  </button>

                  {/* Option B: Real Email/Password Sign In */}
                  <button
                    onClick={() => {
                      setView('email-login');
                      setError('');
                    }}
                    className="w-full flex items-center justify-center space-x-2.5 bg-[#1a1a1a] hover:bg-stone-900 text-stone-200 border border-stone-800 font-semibold py-3 px-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer text-sm"
                  >
                    <Mail className="h-4 w-4 text-amber-500" />
                    <span>Sign in with Email & Password</span>
                  </button>

                  {/* Separator line */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-stone-850"></div>
                    <span className="flex-shrink mx-4 text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      Or Instant Simulator
                    </span>
                    <div className="flex-grow border-t border-stone-850"></div>
                  </div>

                  {/* Option C: Simulated Canteen Manager (Admin) */}
                  <button
                    onClick={() => {
                      setView('password');
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

                  <div className="pt-4 border-t border-stone-900">
                    <p className="text-[10px] text-stone-500 text-center leading-normal font-sans">
                      Note: Email sign-in requires the <strong className="text-stone-400">Email/Password</strong> provider to be enabled in Firebase console under Authentication &gt; Sign-in method.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
