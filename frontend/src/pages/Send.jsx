import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '../lib/animations';
import api from '../api/client';
import { showToast } from '../utils/toast';
import AnimatedButton from '../components/ui/AnimatedButton';
import MoneyInput from '../components/ui/MoneyInput';
import { Send as SendIcon, CheckCircle, AlertCircle } from 'lucide-react';

const Send = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('idle'); // idle | review | processing | success | error
  const [message, setMessage] = useState('');

  const initiateSend = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showToast.error('Please enter a valid amount');
      return;
    }
    if (!recipient) {
      showToast.error('Please enter a recipient UPI ID');
      return;
    }
    setStatus('review');
  }

  const handleConfirmSend = async () => {
    setStatus('processing');
    setMessage('');

    try {
      const response = await api.post('/pay/upi', {
        toUpiId: recipient,
        amount: Number(amount),
      });

      setStatus('success');
      setMessage('Payment successful!');
      showToast.success(`₹${Number(amount).toLocaleString('en-IN')} sent successfully to ${recipient}`);
      setRecipient('');
      setAmount('');
    } catch (error) {
      setStatus('error');
      const errorMessage = error.response?.data?.message || 'Payment failed. Please check UPI ID and balance.';
      setMessage(errorMessage);
      // Error toast is already shown by the API interceptor
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto"
    >
      <div className="glass-card p-8 shadow-2xl overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute top-0 right-0 p-32 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-accent/20 rounded-xl text-accent">
              <SendIcon size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Send Money</h2>
              <p className="text-gray-400">
                Instant UPI transfers to anyone
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/10">
                  <CheckCircle size={56} className="drop-shadow-lg" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  Payment Sent!
                </h3>
                <p className="text-gray-400 mb-8 max-w-xs mx-auto">{message}</p>
                <AnimatedButton
                  onClick={() => setStatus('idle')}
                  className="w-full max-w-xs mx-auto"
                >
                  Send Another Payment
                </AnimatedButton>
              </motion.div>
            ) : status === 'review' ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-medium text-white mb-4 border-b border-white/5 pb-4">Confirm Payment</h3>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Sending to</span>
                    <span className="font-mono text-white text-right">{recipient}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Amount</span>
                    <span className="font-bold text-white text-xl">₹ {Number(amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Processing Fee</span>
                    <span className="text-green-400 font-medium">FREE</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <AnimatedButton
                    variant="secondary"
                    onClick={() => setStatus('idle')}
                    className="flex-1"
                  >
                    Back
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={handleConfirmSend}
                    className="flex-[2]"
                  >
                    Confirm & Pay
                  </AnimatedButton>
                </div>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={initiateSend}
                className="space-y-8"
              >
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200"
                  >
                    <AlertCircle size={20} className="shrink-0" />
                    {message}
                  </motion.div>
                )}

                <div>
                  <MoneyInput
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={status === 'processing'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-mono uppercase tracking-wide">
                    To UPI ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="friend@cxpay"
                    className="input-field font-mono text-lg h-14"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    disabled={status === 'processing'}
                  />
                </div>

                <AnimatedButton
                  type="submit"
                  loading={status === 'processing'}
                  className="w-full justify-center text-lg h-14 shadow-xl shadow-accent/20"
                >
                  Review Payment
                </AnimatedButton>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Send;
