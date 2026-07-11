import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { Coins, Plus, Wallet, ShieldAlert, CreditCard, Receipt, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const WalletPanel: React.FC = () => {
  const { currentUser, transactions, addFunds } = useCanteen();
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  
  // Card mock states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 bg-[#121212] border border-stone-800 rounded-3xl font-sans">
        <Wallet className="h-10 w-10 text-stone-650 mb-3" />
        <h4 className="text-base font-bold text-stone-300">Canteen Campus Wallet</h4>
        <p className="text-xs text-stone-500 max-w-xs mt-1">
          Please sign in to view your balance, top up credits, and access digital canteen transactions.
        </p>
      </div>
    );
  }

  const handlePresetSelect = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedPreset(null);
  };

  const handleSubmitTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    const topupAmt = parseFloat(customAmount);
    
    if (isNaN(topupAmt) || topupAmt <= 0) {
      return;
    }

    setIsProcessing(true);
    // Simulate API delay
    setTimeout(async () => {
      await addFunds(topupAmt);
      setIsProcessing(false);
      
      // Reset card form
      setCustomAmount('');
      setSelectedPreset(null);
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setCardName('');
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
      {/* Wallet balance and Add Credits Form */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Holographic Virtual Credit Card Display */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-stone-900 via-stone-850 to-[#221c15] p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between h-48 sm:h-52 border border-stone-800/80">
          {/* Card background shapes */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-8 h-44 w-44 rounded-full bg-amber-500/10 blur-2xl" />
          <div className="absolute top-0 right-1/4 -translate-y-8 h-24 w-24 rounded-full bg-white/5 blur-lg" />

          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500 font-bold">
                Student Canteen Pass
              </span>
              <span className="text-sm font-semibold mt-1 font-sans text-stone-200">
                {currentUser.name}
              </span>
            </div>
            <div className="bg-stone-900/60 p-2 rounded-xl border border-stone-800 backdrop-blur-md">
              <Coins className="h-5 w-5 text-amber-400 fill-amber-400" />
            </div>
          </div>

          <div>
            <span className="text-[10px] text-stone-500 block font-mono">AVAILABLE COINS BALANCE</span>
            <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight mt-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
              ${currentUser.walletBalance.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-stone-500">
            <span>ID: {currentUser.uid.slice(0, 10).toUpperCase()}</span>
            <span>CAMPUS MEAL PRIVILEGES</span>
          </div>
        </div>

        {/* Add Balance segment */}
        <div className="bg-[#121212] rounded-3xl border border-stone-800 p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-stone-200 font-sans">Top Up Digital Balance</h3>
            <p className="text-stone-500 text-xs mt-0.5">Instant secure deposit with credit or debit card.</p>
          </div>

          <form onSubmit={handleSubmitTopup} className="space-y-4 font-sans">
            {/* Presets Grid */}
            <div className="grid grid-cols-4 gap-2.5">
              {[5, 10, 20, 50].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handlePresetSelect(amt)}
                  className={`py-2 px-1 rounded-xl border text-xs sm:text-sm font-mono font-bold transition-all text-center cursor-pointer ${
                    selectedPreset === amt
                      ? 'bg-amber-500 text-[#0a0a0a] border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-stone-900 border-stone-850 text-stone-400 hover:bg-stone-800'
                  }`}
                >
                  +${amt}
                </button>
              ))}
            </div>

            {/* Custom amount entry */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-sans font-bold text-stone-500">$</span>
              <input
                type="number"
                step="0.01"
                min="1"
                max="500"
                placeholder="Enter custom amount (e.g. 15.00)..."
                value={customAmount}
                onChange={handleCustomChange}
                required
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-stone-850 bg-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 text-xs sm:text-sm font-mono text-stone-300 transition-all placeholder-stone-650"
              />
            </div>

            {/* Credit Card info */}
            <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-stone-850 space-y-3">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                💳 Mock Payment Credentials
              </span>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                <input
                  type="text"
                  placeholder="Card Number (4000 1234 5678 9010)"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-stone-850 bg-stone-900 rounded-xl text-xs outline-none text-stone-350 focus:border-amber-500 transition-colors placeholder-stone-650"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Expiry Date (MM/YY)"
                  maxLength={5}
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-stone-850 bg-stone-900 rounded-xl text-xs outline-none text-stone-350 focus:border-amber-500 transition-colors placeholder-stone-650"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  maxLength={3}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-stone-850 bg-stone-900 rounded-xl text-xs outline-none text-stone-350 focus:border-amber-500 transition-colors placeholder-stone-650"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] font-sans font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/10 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>{isProcessing ? 'Processing Gateway Securely...' : `Deposit Credit`}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Transaction statement sidebar */}
      <div>
        <div className="bg-[#121212] rounded-3xl border border-stone-800 p-6 shadow-sm h-full flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-stone-850 pb-3">
              <Receipt className="h-5 w-5 text-stone-500" />
              <h3 className="text-sm font-bold text-stone-200 font-sans">Statement Logs</h3>
            </div>

            {transactions.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No transactions recorded yet.</p>
            ) : (
              <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                {transactions.map((tx) => {
                  const isCredit = tx.type === 'credit';
                  return (
                    <div key={tx.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1.5 rounded-lg ${isCredit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>
                          {isCredit ? <ArrowDownLeft className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <span className="font-semibold text-stone-300 block max-w-[130px] truncate">{tx.description}</span>
                          <span className="text-[9px] text-stone-500 block">{new Date(tx.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <span className={`font-mono font-bold ${isCredit ? 'text-emerald-400' : 'text-stone-300'}`}>
                        {isCredit ? '+' : '-'}${tx.amount.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-[#1a1a1a] p-3 rounded-2xl border border-stone-850 text-[10px] text-stone-500 flex items-center space-x-2 mt-4 font-sans">
            <ShieldAlert className="h-4 w-4 text-stone-500 shrink-0" />
            <span>Digital balances are simulation-backed and secure. Real cards are not charged.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
