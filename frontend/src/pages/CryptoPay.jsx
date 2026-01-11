import { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { motion } from 'framer-motion';
import {
    Send,
    Wallet,
    CheckCircle
} from 'lucide-react';
import { showToast } from '../utils/toast';

const CryptoPay = () => {
    const {
        isWalletConnected,
        walletAddress,
        cryptoBalances,
        exchangeRates,
        connectWallet
    } = useCrypto();

    const [form, setForm] = useState({
        recipient: '',
        amount: '',
        token: 'USDC',
        note: ''
    });
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Input, 2: Review, 3: Success

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isWalletConnected) {
            showToast.error('Please connect your crypto wallet first');
            return;
        }

        if (!form.recipient || !form.amount) {
            showToast.error('Please fill in all required fields');
            return;
        }

        if (parseFloat(form.amount) <= 0) {
            showToast.error('Please enter a valid amount');
            return;
        }

        // Check balance
        const balance = form.token === 'USDC' ? cryptoBalances.usdc :
            form.token === 'DAI' ? cryptoBalances.dai :
                cryptoBalances.eth;

        if (parseFloat(form.amount) > balance) {
            showToast.error(`Insufficient ${form.token} balance`);
            return;
        }

        setStep(2);
    };

    const handleConfirm = async () => {
        setLoading(true);

        try {
            // Simulate blockchain transaction
            await new Promise(resolve => setTimeout(resolve, 2000));

            // In real app, you would:
            // 1. Create ethers transaction
            // 2. Sign with wallet
            // 3. Send to blockchain
            // 4. Get transaction hash

            const txHash = '0x' + Math.random().toString(16).substr(2, 64);
            console.log('Transaction hash:', txHash);

            showToast.success(`Successfully sent ${form.amount} ${form.token}`);
            setStep(3);

            // Reset form after delay
            setTimeout(() => {
                setForm({ recipient: '', amount: '', token: 'USDC', note: '' });
                setStep(1);
            }, 3000);

        } catch (error) {
            console.error('Crypto payment error:', error);
            showToast.error('Transaction failed. Please try again.');
            setStep(1);
        } finally {
            setLoading(false);
        }
    };

    const calculateInr = () => {
        const amount = parseFloat(form.amount) || 0;
        const rate = exchangeRates.usdToInr;

        if (form.token === 'ETH') {
            return (amount * exchangeRates.ethToUsd * exchangeRates.usdToInr).toFixed(2);
        }

        return (amount * rate).toFixed(2);
    };

    if (!isWalletConnected) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-md mx-auto text-center py-12"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wallet size={48} className="text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                <p className="text-gray-400 mb-8">
                    Connect your crypto wallet to send and receive digital assets
                </p>
                <button
                    onClick={connectWallet}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-all font-medium"
                >
                    Connect MetaMask Wallet
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
                        <Send className="text-purple-400" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Send Crypto</h1>
                        <p className="text-gray-400">Transfer digital assets instantly</p>
                    </div>
                </div>

                {/* Steps Indicator */}
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -translate-y-1/2 -z-10"></div>

                    {[1, 2, 3].map((stepNumber) => (
                        <div key={stepNumber} className="flex flex-col items-center">
                            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                ${step >= stepNumber
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-400'
                                }
              `}>
                                {stepNumber === 3 && step === 3 ? <CheckCircle size={20} /> : stepNumber}
                            </div>
                            <span className="text-sm mt-2 text-gray-400">
                                {stepNumber === 1 && 'Details'}
                                {stepNumber === 2 && 'Review'}
                                {stepNumber === 3 && 'Complete'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Step 1: Input Form */}
                {step === 1 && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Recipient Wallet Address
                            </label>
                            <input
                                type="text"
                                placeholder="0x..."
                                value={form.recipient}
                                onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                                className="input-field font-mono"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Token
                                </label>
                                <select
                                    value={form.token}
                                    onChange={(e) => setForm({ ...form, token: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="USDC">USDC</option>
                                    <option value="DAI">DAI</option>
                                    <option value="ETH">ETH</option>
                                </select>
                            </div>
                        </div>

                        {/* Balance Display */}
                        <div className="bg-white/5 rounded-lg p-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Your Balance:</span>
                                <span className="text-white">
                                    {form.token === 'USDC' && `${cryptoBalances.usdc.toFixed(2)} USDC`}
                                    {form.token === 'DAI' && `${cryptoBalances.dai.toFixed(2)} DAI`}
                                    {form.token === 'ETH' && `${cryptoBalances.eth.toFixed(4)} ETH`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-gray-400">≈ In INR:</span>
                                <span className="text-white">₹{calculateInr()}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-all font-medium"
                        >
                            Continue to Review
                        </button>
                    </form>
                )}

                {/* Step 2: Review */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-6 space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">Review Transaction</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">To Address</span>
                                    <span className="font-mono text-white text-sm">
                                        {form.recipient.substring(0, 10)}...{form.recipient.substring(form.recipient.length - 8)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-400">Amount</span>
                                    <span className="text-2xl font-bold text-white">
                                        {form.amount} {form.token}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-400">≈ In INR</span>
                                    <span className="text-white">₹{calculateInr()}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-400">Network Fee</span>
                                    <span className="text-green-400">~ ₹15 (0.0005 ETH)</span>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Total</span>
                                        <span className="text-xl font-bold text-white">
                                            {form.amount} {form.token}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
                                disabled={loading}
                            >
                                Back
                            </button>

                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Confirm & Send
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="text-center py-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} className="text-green-400" />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Transaction Successful!</h3>
                        <p className="text-gray-400 mb-6">
                            {form.amount} {form.token} has been sent successfully
                        </p>

                        <div className="bg-white/5 rounded-lg p-4 mb-6">
                            <div className="text-sm text-gray-400 mb-2">Transaction Hash</div>
                            <div className="font-mono text-white text-sm break-all">
                                0x{Math.random().toString(16).substr(2, 64)}
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm">
                            Transaction confirmed on Ethereum Sepolia testnet
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CryptoPay;
