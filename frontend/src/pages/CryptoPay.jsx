import { useState, useEffect } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { motion } from 'framer-motion';
import api from '../api/client';
import { showToast } from '../utils/toast';
import {
    Send,
    Wallet,
    CheckCircle,
    CreditCard,
    Coins,
    User,
    AlertCircle,
    RefreshCw,
    ArrowRightLeft
} from 'lucide-react';

const CryptoPay = () => {
    const {
        convergeXWallet,
        convergeXBalances,
        metamaskWallet,
        activeWallet,
        loading,
        isConnectingMetaMask,
        connectMetaMask,
        transferConvergeXCrypto,
        findConvergeXWallet,
        getActiveBalances,
        getActiveWalletAddress,
        setActiveWallet,
        convertFunds
    } = useCrypto();

    const [activeTab, setActiveTab] = useState('send'); // 'send' or 'convert'

    // Send Form State
    const [form, setForm] = useState({
        recipient: '',
        amount: '',
        token: 'USDC',
        note: ''
    });

    // Convert Form State
    const [convertForm, setConvertForm] = useState({
        from: 'upi', // 'upi' or 'crypto'
        amount: '',
        token: 'USDC'
    });

    const [sending, setSending] = useState(false);
    const [step, setStep] = useState(1);
    const [recipientInfo, setRecipientInfo] = useState(null);
    const [walletType, setWalletType] = useState('convergex');

    // Validate Address
    const validateConvergeXAddress = (address) => {
        return address && address.startsWith('cx_') && address.length >= 20;
    };

    // Lookup recipient
    useEffect(() => {
        const lookupRecipient = async () => {
            if (!form.recipient || !validateConvergeXAddress(form.recipient)) {
                setRecipientInfo(null);
                return;
            }

            try {
                const response = await findConvergeXWallet(form.recipient);

                if (response.found) {
                    setRecipientInfo({
                        type: 'user',
                        user: response.user
                    });
                } else {
                    setRecipientInfo({
                        type: 'invalid',
                        message: 'Invalid ConvergeX Wallet address'
                    });
                }
            } catch (error) {
                setRecipientInfo(null);
            }
        };

        const delayDebounce = setTimeout(lookupRecipient, 500);
        return () => clearTimeout(delayDebounce);
    }, [form.recipient]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateConvergeXAddress(form.recipient)) {
            showToast.error('Invalid ConvergeX Wallet address format (should start with cx_)');
            return;
        }
        const amount = parseFloat(form.amount);
        if (!amount || amount <= 0) {
            showToast.error('Please enter a valid amount');
            return;
        }
        const balance = getActiveBalances()[form.token.toLowerCase()] || 0;
        if (amount > balance) {
            showToast.error(`Insufficient ${form.token} balance. Available: ${balance}`);
            return;
        }
        if (!recipientInfo || recipientInfo.type !== 'user') {
            showToast.error('Please enter a valid ConvergeX Wallet address');
            return;
        }
        setStep(2);
    };

    const handleConfirm = async () => {
        setSending(true);
        try {
            await transferConvergeXCrypto(form.recipient, form.amount, form.token);
            showToast.success(`Successfully sent ${form.amount} ${form.token} to ${recipientInfo.user.name}`);
            setStep(3);
            setTimeout(() => {
                setForm({ recipient: '', amount: '', token: 'USDC', note: '' });
                setRecipientInfo(null);
                setStep(1);
            }, 3000);
        } catch (error) {
            showToast.error(error.message || 'Transfer failed');
            setStep(1);
        } finally {
            setSending(false);
        }
    };

    const handleConvert = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            // Pass 'upi' if activeTab is converting from UPI to Crypto
            // Pass 'crypto' if converting from Crypto to UPI
            // The form state tracks this in `convertForm.from`
            await convertFunds(convertForm.from, convertForm.amount, convertForm.token);
            setConvertForm(prev => ({ ...prev, amount: '' }));
        } catch (error) {
            showToast.error(error.response?.data?.message || 'Conversion failed');
        } finally {
            setSending(false);
        }
    };

    const formatAddress = (address) => {
        if (!address) return 'Not connected';
        return `${address.substring(0, 10)}...${address.substring(address.length - 4)}`;
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading wallet...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('send')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'send'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    <Send size={18} />
                    Send Crypto
                </button>
                <button
                    onClick={() => setActiveTab('convert')}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'convert'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    <RefreshCw size={18} />
                    Convert (UPI ⇄ Crypto)
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8"
            >
                {activeTab === 'send' ? (
                    <>
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
                                <Send className="text-purple-400" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Send Crypto</h1>
                                <p className="text-gray-400">Transfer between ConvergeX Wallets</p>
                            </div>
                        </div>

                        {/* Wallet Type Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                onClick={() => {
                                    setActiveWallet('convergex');
                                    setWalletType('convergex');
                                }}
                                className={`p-4 rounded-xl border-2 transition-all ${walletType === 'convergex'
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-gray-700 hover:border-gray-600'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <CreditCard className="text-purple-400" size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-white">ConvergeX Wallet</div>
                                        <div className="text-sm text-gray-400">
                                            {convergeXWallet ? formatAddress(convergeXWallet.address) : 'Not available'}
                                        </div>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    setWalletType('metamask');
                                    setActiveWallet('metamask');
                                    if (!metamaskWallet) connectMetaMask();
                                }}
                                disabled={isConnectingMetaMask}
                                className={`p-4 rounded-xl border-2 transition-all ${walletType === 'metamask'
                                        ? 'border-orange-500 bg-orange-500/10'
                                        : 'border-gray-700 hover:border-gray-600'
                                    } ${isConnectingMetaMask ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                                        <Wallet className="text-orange-400" size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-white">MetaMask</div>
                                        <div className="text-sm text-gray-400">
                                            {metamaskWallet ? formatAddress(metamaskWallet) : 'Not connected'}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Step 1: Input Form */}
                        {step === 1 && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Recipient ConvergeX Wallet Address
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="cx_xxxxxxxxxxxxxxxxxxxx"
                                        value={form.recipient}
                                        onChange={(e) => setForm({ ...form, recipient: e.target.value })}
                                        className="input-field font-mono"
                                        required
                                    />
                                    {recipientInfo && (
                                        <div className={`mt-2 p-3 rounded-lg ${recipientInfo.type === 'user'
                                                ? 'bg-green-500/10 border border-green-500/20'
                                                : 'bg-red-500/10 border border-red-500/20'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                {recipientInfo.type === 'user' ? (
                                                    <>
                                                        <User size={16} className="text-green-400" />
                                                        <span className="text-green-400">
                                                            ConvergeX user: {recipientInfo.user.name}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle size={16} className="text-red-400" />
                                                        <span className="text-red-400">
                                                            {recipientInfo.message}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
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

                                <div className="bg-white/5 rounded-lg p-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">Your {walletType === 'convergex' ? 'ConvergeX' : 'MetaMask'} Balance:</span>
                                        <span className="text-white font-medium">
                                            {getActiveBalances()[form.token.toLowerCase()]?.toFixed(4) || '0'} {form.token}
                                        </span>
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
                                    <h3 className="text-lg font-semibold text-white mb-4">Review Transfer</h3>

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">To Wallet</span>
                                            <span className="font-mono text-white text-sm">
                                                {form.recipient.substring(0, 10)}...
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Amount</span>
                                            <span className="text-2xl font-bold text-white">
                                                {form.amount} {form.token}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Fee</span>
                                            <span className="text-green-400">Free (Internal)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all"
                                        disabled={sending}
                                    >
                                        Back
                                    </button>

                                    <button
                                        onClick={handleConfirm}
                                        disabled={sending}
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2"
                                    >
                                        {sending ? 'Processing...' : 'Confirm Transfer'}
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
                                <h3 className="text-2xl font-bold text-white mb-2">Transfer Successful!</h3>
                                <button
                                    onClick={() => {
                                        setForm({ recipient: '', amount: '', token: 'USDC', note: '' });
                                        setStep(1);
                                    }}
                                    className="px-6 py-2 bg-gray-800 rounded-lg mt-4"
                                >
                                    Send Another
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    // CONVERT TAB
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                                <ArrowRightLeft className="text-blue-400" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Convert Funds</h1>
                                <p className="text-gray-400">Instantly swap between UPI and Crypto</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center bg-white/5 p-1 rounded-xl mb-6">
                            <button
                                onClick={() => setConvertForm(p => ({ ...p, from: 'upi' }))}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${convertForm.from === 'upi' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                UPI Bank → Crypto
                            </button>
                            <button
                                onClick={() => setConvertForm(p => ({ ...p, from: 'crypto' }))}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${convertForm.from === 'crypto' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Crypto → UPI Bank
                            </button>
                        </div>

                        <form onSubmit={handleConvert} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    {convertForm.from === 'upi' ? 'Amount in INR (₹)' : `Amount in ${convertForm.token}`}
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={convertForm.amount}
                                    onChange={(e) => setConvertForm({ ...convertForm, amount: e.target.value })}
                                    className="input-field text-xl font-bold"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Token</label>
                                <select
                                    value={convertForm.token}
                                    onChange={(e) => setConvertForm({ ...convertForm, token: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="USDC">USDC (Stablecoin)</option>
                                    <option value="DAI">DAI (Stablecoin)</option>
                                    <option value="ETH">Ethereum</option>
                                </select>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-300">Estimated Rate:</span>
                                    <span className="text-blue-400 font-mono">
                                        1 {convertForm.token} ≈ ₹83.50
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:opacity-90 transition-all font-bold text-lg flex items-center justify-center gap-2"
                            >
                                {sending ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <RefreshCw size={20} />}
                                {convertForm.from === 'upi' ? 'Buy Crypto' : 'Sell for INR'}
                            </button>
                        </form>
                    </div>
                )}

            </motion.div>
        </div>
    );
};

export default CryptoPay;
