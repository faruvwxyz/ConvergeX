import { createContext, useContext, useState, useEffect } from 'react';

const CryptoContext = createContext();

export const useCrypto = () => {
    const context = useContext(CryptoContext);
    if (!context) {
        throw new Error('useCrypto must be used within CryptoProvider');
    }
    return context;
};

export const CryptoProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [cryptoBalances, setCryptoBalances] = useState({
        usdc: 0,
        dai: 0,
        eth: 0
    });
    const [exchangeRates, setExchangeRates] = useState({
        usdToInr: 83,
        ethToUsd: 2500,
        usdcToUsd: 1,
        daiToUsd: 1
    });

    // Testnet addresses (Sepolia)
    const CONTRACT_ADDRESSES = {
        USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        DAI: '0xFF34B3d4Aee8ddCd6F9AFFFFB6Fe49bD371b8a357'
    };

    // Check if MetaMask is installed
    const checkMetaMask = () => {
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
            return true;
        }
        return false;
    };

    // Connect wallet (non-breaking - separate from auth)
    const connectWallet = async () => {
        if (!checkMetaMask()) {
            alert('Please install MetaMask to use crypto features');
            return false;
        }

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
                setIsWalletConnected(true);
                localStorage.setItem('crypto_wallet', accounts[0]);

                // Fetch balances after connecting
                await fetchCryptoBalances(accounts[0]);
                return true;
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            return false;
        }
    };

    // Disconnect wallet (safe - doesn't affect auth)
    const disconnectWallet = () => {
        setWalletAddress(null);
        setIsWalletConnected(false);
        localStorage.removeItem('crypto_wallet');
        setCryptoBalances({ usdc: 0, dai: 0, eth: 0 });
    };

    // Fetch crypto balances (runs separately)
    const fetchCryptoBalances = async (address) => {
        if (!address) return;

        try {
            // For demo, we'll simulate balances
            // In production, you'd use ethers.js to fetch from blockchain
            const simulatedBalances = {
                usdc: 150.75,
                dai: 89.50,
                eth: 0.5
            };

            setCryptoBalances(simulatedBalances);
        } catch (error) {
            console.error('Error fetching balances:', error);
        }
    };

    // Fetch exchange rates (safe API call)
    const fetchExchangeRates = async () => {
        try {
            // Using CoinGecko API (free)
            const response = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin,dai&vs_currencies=usd,inr'
            );

            const data = await response.json();

            setExchangeRates({
                ethToUsd: data.ethereum?.usd || 2500,
                usdcToUsd: data['usd-coin']?.usd || 1,
                daiToUsd: data.dai?.usd || 1,
                usdToInr: data.ethereum?.inr / data.ethereum?.usd || 83
            });
        } catch (error) {
            console.log('Using fallback exchange rates');
            // Fallback rates if API fails - already set in state
        }
    };

    // Initialize wallet if previously connected
    useEffect(() => {
        const savedWallet = localStorage.getItem('crypto_wallet');
        if (savedWallet && checkMetaMask()) {
            setWalletAddress(savedWallet);
            setIsWalletConnected(true);
            fetchCryptoBalances(savedWallet);
        }

        fetchExchangeRates();

        // Refresh rates every 60 seconds
        const interval = setInterval(fetchExchangeRates, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <CryptoContext.Provider value={{
            walletAddress,
            isWalletConnected,
            cryptoBalances,
            exchangeRates,
            connectWallet,
            disconnectWallet,
            checkMetaMask,
            CONTRACT_ADDRESSES,
            fetchCryptoBalances
        }}>
            {children}
        </CryptoContext.Provider>
    );
};
