/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Lock, ShieldCheck, CheckCircle2, Sparkles, X, QrCode } from 'lucide-react';
import { SUPPORTED_CURRENCIES, CurrencyConfig } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (currencyCode: string, fee: number) => void;
  requestTitle: string;
}

export default function PaymentModal({ isOpen, onClose, onSuccess, requestTitle }: PaymentModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyConfig>(SUPPORTED_CURRENCIES[0]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Form Fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);

      // Complete in success state
      setTimeout(() => {
        onSuccess(selectedCurrency.code, selectedCurrency.boostFee);
        setIsCompleted(false);
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200"
            id="payment-modal-container"
          >
            {/* Header */}
            <div className="bg-[#003466] text-white p-5 relative">
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 text-slate-300 hover:text-white transition"
              >
                <X size={18} />
              </button>
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Sparkles size={14} className="fill-amber-400" />
                Priority Booster Gateway
              </div>
              <h3 className="text-lg font-bold tracking-tight">Boost Your Request</h3>
              <p className="text-xs text-slate-200 mt-1 line-clamp-1">
                Pin: "{requestTitle}" to top of all search results
              </p>
            </div>

            <form onSubmit={handlePay} className="p-5 space-y-4">
              {/* Currency Selector */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Currency (Dynamic Convert)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => setSelectedCurrency(curr)}
                      className={`py-1.5 rounded text-xs font-bold border transition ${
                        selectedCurrency.code === curr.code
                          ? 'bg-[#003466] border-[#003466] text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {curr.symbol} {curr.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price summary */}
              <div className="bg-amber-50/50 border border-[#ffa825]/20 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 font-medium block">Elevate listing instantly</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Fee Tier 1 Booster</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#0b1c30]">
                    {selectedCurrency.symbol}{selectedCurrency.boostFee}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">{selectedCurrency.code}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                  Choose Payment Option
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 rounded border text-xs font-bold flex flex-col items-center gap-1 transition ${
                      paymentMethod === 'card'
                        ? 'border-[#003466] bg-slate-50/80 text-[#003466]'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 rounded border text-xs font-bold flex flex-col items-center gap-1 transition ${
                      paymentMethod === 'upi'
                        ? 'border-[#003466] bg-slate-50/80 text-[#003466]'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode size={14} />
                    <span>UPI / Scan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`py-2 rounded border text-xs font-bold flex flex-col items-center gap-1 transition ${
                      paymentMethod === 'paypal'
                        ? 'border-[#003466] bg-slate-50/80 text-[#003466]'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span className="italic font-extrabold text-[#003466] text-xs leading-none">Pay<span className="text-sky-500">Pal</span></span>
                    <span className="text-[10px]">PayPal</span>
                  </button>
                </div>
              </div>

              {/* Method Forms */}
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg min-h-[100px] flex flex-col justify-center">
                {paymentMethod === 'card' && (
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5 uppercase">Card Number</label>
                      <input
                        type="text"
                        required
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        maxLength={19}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded outline-none bg-white focus:border-[#003466]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5 uppercase">Expiry Date</label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          maxLength={5}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded outline-none bg-white focus:border-[#003466]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5 uppercase">CVV</label>
                        <input
                          type="password"
                          required
                          placeholder="***"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={3}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded outline-none bg-white focus:border-[#003466]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5 uppercase">UPI Virtual ID</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. kabeer@okaxis"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded outline-none bg-white focus:border-[#003466]"
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium">
                      Enter your Google Pay, PhonePe, or Paytm UPI ID to approve the request on your mobile device.
                    </p>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="text-center py-3">
                    <p className="text-xs font-semibold text-slate-600">
                      You will be redirected to PayPal sandbox checkout.
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Acceptable currency routes: {selectedCurrency.code}
                    </p>
                  </div>
                )}
              </div>

              {/* Secure footer */}
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <Lock size={11} className="text-slate-400" />
                <span>Secure 256-bit Encrypted Transaction</span>
                <span>•</span>
                <ShieldCheck size={11} className="text-[#006a61]" />
                <span>PCI-DSS Verified</span>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#006a61] hover:bg-[#005149] disabled:bg-[#006a61]/60 text-white font-bold py-2.5 rounded shadow transition-all duration-200 text-sm flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Secure Gateway...</span>
                  </>
                ) : (
                  <span>
                    Pay {selectedCurrency.symbol}{selectedCurrency.boostFee} & Boost Request
                  </span>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-sm p-8 text-center border border-slate-200 flex flex-col items-center justify-center"
            id="payment-success-container"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 shadow-sm"
            >
              <CheckCircle2 size={36} />
            </motion.div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Payment Successful</h3>
            <p className="text-xs text-[#006a61] font-bold uppercase tracking-wider mt-1">
              {selectedCurrency.symbol}{selectedCurrency.boostFee} {selectedCurrency.code} received
            </p>
            <p className="text-xs text-slate-500 mt-3 max-w-xs leading-relaxed">
              Your request for <strong>"{requestTitle}"</strong> has been elevated to a Priority Request and pinned to the top of the board!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
