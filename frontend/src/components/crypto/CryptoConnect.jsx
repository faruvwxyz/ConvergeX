import { useCrypto } from '../../context/CryptoContext';
import { Wallet, Copy, LogOut } from 'lucide-react';
import { useState } from 'react';

const CryptoConnect = () => {
    const {
        walletAddress,
        isWalletConnected,
        cryptoBalances,
        connectWallet,
        disconnectWallet,
        checkMetaMask
    } = useCrypto();

    const [copySuccess, setCopySuccess] = useState('');

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(walletAddress);
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    if (!checkMetaMask()) {
        return (
            <div className="glass-card p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <Wallet size={20} className="text-yellow-400" />
                    </div>
                    <h3 className="font-semibold text-white">Crypto Wallet</h3>
                </div>
                <p className="text-yellow-400 text-sm">
                    MetaMask not detected. Install the extension to use crypto features.
                </p>
                <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-hover text-sm mt-2 inline-block"
                >
                    Download MetaMask →
                </a>
            </div>
        );
    }

    if (!isWalletConnected) {
        return (
            <div className="glass-card p-6">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                        <Wallet size={32} className="text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Connect Crypto Wallet</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Connect MetaMask to send and receive digital assets
                    </p>
                    <button
                        onClick={connectWallet}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2"
                    >
                        <Wallet size={18} />
                        <span>Connect Wallet</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card p-4 space-y-4">
            {/* Wallet Address */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Wallet size={16} className="text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Connected Wallet</p>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-white text-sm">{formatAddress(walletAddress)}</span>
                            <button
                                onClick={handleCopyAddress}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                                title="Copy address"
                            >
                                <Copy size={14} className="text-gray-400 hover:text-white" />
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    onClick={disconnectWallet}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"
                    title="Disconnect"
                >
                    <LogOut size={16} />
                </button>
            </div>

            {/* Balances */}
            <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Crypto Balances</h4>
                <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5">
                        <span className="text-gray-400">USDC</span>
                        <span className="text-white font-medium">{cryptoBalances.usdc.toFixed(2)} USDC</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5">
                        <span className="text-gray-400">DAI</span>
                        <span className="text-white font-medium">{cryptoBalances.dai.toFixed(2)} DAI</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5">
                        <span className="text-gray-400">ETH</span>
                        <span className="text-white font-medium">{cryptoBalances.eth.toFixed(4)} ETH</span>
                    </div>
                </div>
            </div>

            {copySuccess && (
                <div className="text-green-400 text-sm text-center animate-pulse">
                    {copySuccess}
                </div>
            )}
        </div>
    );
};

export default CryptoConnect;
