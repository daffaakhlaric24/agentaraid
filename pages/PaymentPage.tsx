import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ChevronLeft, CreditCard, Check, Home, Zap, Users, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Plan {
  id: string;
  name: string;
  price: string;
  listings: number;
  tokens: number;
  tokenDiscount: boolean;
  socialAccounts: number;
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlan = location.state?.plan as Plan | undefined;

  if (!selectedPlan) {
    // If no plan selected, redirect back
    navigate(-1);
    return null;
  }

  const handlePayment = () => {
    // Mock payment processing
    alert(`Payment processing for ${selectedPlan.name}...\n\nIn a real app, this would integrate with a payment gateway.`);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-300">
      <Header />
      
      <div className="px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 mb-4"
        >
          <ChevronLeft size={24} className="text-slate-800 dark:text-slate-100" />
        </button>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Complete Payment</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Review your plan selection and proceed to payment
        </p>

        {/* Selected Plan Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Selected Plan</h2>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              selectedPlan.id === 'basic' ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' :
              selectedPlan.id === 'pro' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
              'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
            }`}>
              {selectedPlan.name}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Home size={16} className="text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Listings</span>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedPlan.listings}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Tokens</span>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedPlan.tokens}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Social Accounts</span>
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedPlan.socialAccounts}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Token Discount</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {selectedPlan.tokenDiscount ? 'Yes' : 'N/A'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">Total</span>
              <span className="text-2xl font-bold text-primary">{selectedPlan.price}</span>
            </div>
            {selectedPlan.price === 'Rp 0' && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Free plan - no payment required</p>
            )}
          </div>
        </motion.div>

        {/* Payment Method Selection */}
        {selectedPlan.price !== 'Rp 0' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 mb-6"
          >
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Payment Method</h2>
            <div className="space-y-3">
              <button className="w-full p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 bg-slate-100 rounded flex items-center justify-center">
                    <div className="flex -space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Mastercard **** 4242</p>
                    <p className="text-xs text-slate-500">Expires 10/28</p>
                  </div>
                </div>
                <Check size={20} className="text-primary" />
              </button>
              <button className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-slate-400" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Add New Card</span>
                </div>
                <ChevronLeft size={16} className="text-slate-400 rotate-180" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Payment Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handlePayment}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform ${
            selectedPlan.price === 'Rp 0'
              ? 'bg-slate-600 dark:bg-slate-700'
              : 'bg-primary shadow-primary/30'
          }`}
        >
          {selectedPlan.price === 'Rp 0' ? 'Activate Free Plan' : `Pay ${selectedPlan.price}`}
        </motion.button>

        <p className="text-xs text-slate-400 text-center mt-4">
          By proceeding, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;

