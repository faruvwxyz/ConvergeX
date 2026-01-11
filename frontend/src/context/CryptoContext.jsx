import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { showToast } from '../utils/toast';

const CryptoContext = createContext();

export const useCrypto = () => {
    const context = useContext(CryptoContext);
    if (!context) {
        throw new Error('useCrypto must be used within CryptoProvider');
    }
    return context;
};

export const CryptoProvider = ({ children }) => {
    // ConvergeX Wallet State
    const [convergeXWallet, setConvergeXWallet] = useState(null);
    const [convergeXBalances, setConvergeXBalances] = useState({});

    // MetaMask Wallet State
    const [metamaskWallet, setMetamaskWallet] = useState(null);
    const [metamaskBalances, setMetamaskBalances] = useState({});
    const [isConnectingMetaMask, setIsConnectingMetaMask] = useState(false);

    const [activeWallet, setActiveWallet] = useState('convergex'); // 'convergex' or 'metamask'
    const [loading, setLoading] = useState(true);

    // Fetch ConvergeX Wallet on mount
    const fetchConvergeXWallet = async () => {
        try {
            setLoading(true);
            const response = await api.get('/wallet/convergex');

            if (response.data.success) {
                setConvergeXWallet(response.data.wallet);
                setConvergeXBalances(response.data.wallet.balance);
            }
        } catch (error) {
            console.error('Failed to fetch ConvergeX Wallet:', error);
        } finally {
            setLoading(false);
        }
    };

    // Connect MetaMask Wallet
    const connectMetaMask = async () => {
        if (typeof window.ethereum === 'undefined') {
            showToast.error('Please install MetaMask extension');
            return false;
        }

        try {
            setIsConnectingMetaMask(true);

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length === 0) {
                throw new Error('No accounts found');
            }

            const walletAddress = accounts[0];

            // Save to backend
            await api.post('/wallet/metamask/connect', {
                walletAddress
            });

            setMetamaskWallet(walletAddress);
            showToast.success('MetaMask wallet connected');

            // Fetch fake balances for MetaMask (for demo)
            setMetamaskBalances({
                usdc: Math.random() * 500,
                dai: Math.random() * 300,
                eth: Math.random() * 2
            });

            return true;

        } catch (error) {
            console.error('MetaMask connection error:', error);
            showToast.error(error.message || 'Failed to connect MetaMask');
            return false;
        } finally {
            setIsConnectingMetaMask(false);
        }
    };

    // Transfer between ConvergeX Wallets
    const transferConvergeXCrypto = async (toAddress, amount, token) => {
        try {
            const response = await api.post('/wallet/convergex/transfer', {
                toWalletAddress: toAddress,
                amount: parseFloat(amount),
                token: token.toUpperCase()
            });

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            // Update local balances
            setConvergeXBalances(prev => ({
                ...prev,
                [token.toLowerCase()]: prev[token.toLowerCase()] - amount
            }));

            showToast.success(`Transferred ${amount} ${token} to ${response.data.recipientName}`);
            return response.data;

        } catch (error) {
            console.error('Transfer error:', error);
            throw error;
        }
    };

    // Find ConvergeX Wallet by address
    const findConvergeXWallet = async (walletAddress) => {
        try {
            const response = await api.get(`/wallet/find-by-address/${walletAddress}`);
            return response.data;
        } catch (error) {
            return { success: false, found: false };
        }
    };

    // Get current active wallet balances
    const getActiveBalances = () => {
        return activeWallet === 'convergex' ? convergeXBalances : metamaskBalances;
    };

    // Get current active wallet address
    const getActiveWalletAddress = () => {
        return activeWallet === 'convergex'
            ? convergeXWallet?.address
            : metamaskWallet;
    };

    const [exchangeRates, setExchangeRates] = useState({
        usdcToUsd: 1.0,
        daiToUsd: 1.0,
        ethToUsd: 3000.0,
        usdToInr: 83.5
    });

    // Fetch Exchange Rates (Mock for now, can be real API later)
    const fetchExchangeRates = async () => {
        try {
            // In a real app, fetch from CoinGecko or similar
            // const res = await axios.get('...');
            // For now, we use static fallback or could fetch from backend if we had an endpoint
            // Simulating a small variation
            setExchangeRates({
                usdcToUsd: 1.0,
                daiToUsd: 1.0,
                ethToUsd: 3000.0 + (Math.random() * 100 - 50),
                usdToInr: 83.5 + (Math.random() * 0.5 - 0.25)
            });
        } catch (error) {
            console.error('Failed to fetch exchange rates:', error);
        }
    };

    // Convert Funds (UPI <-> Crypto)
    const convertFunds = async (fromType, amount, token) => {
        try {
            const endpoint = fromType === 'upi'
                ? '/wallet/convert/upi-to-crypto'
                : '/wallet/convert/crypto-to-upi';

            const response = await api.post(endpoint, {
                amount: parseFloat(amount),
                token: token.toUpperCase()
            });

            if (response.data.success) {
                // Update local wallet balance
                setConvergeXBalances(response.data.newCryptoBalance);
                showToast.success(response.data.message);
                return response.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Conversion error:', error);
            throw error;
        }
    };

    // Initialize
    useEffect(() => {
        fetchConvergeXWallet();
        fetchExchangeRates();
    }, []);

    return (
        <CryptoContext.Provider value={{
            // State
            convergeXWallet,
            convergeXBalances,
            metamaskWallet,
            metamaskBalances,
            activeWallet,
            loading,
            isConnectingMetaMask,
            exchangeRates,

            // Methods
            fetchConvergeXWallet,
            connectMetaMask,
            transferConvergeXCrypto,
            convertFunds,
            findConvergeXWallet,
            getActiveBalances,
            getActiveWalletAddress,

            // Setters
            setActiveWallet
        }}>
            {children}
        </CryptoContext.Provider>
    );
};
