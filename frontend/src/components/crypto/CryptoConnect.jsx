import { useCrypto } from '../../context/CryptoContext';
import { Wallet, Copy, ExternalLink, LogOut, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { showToast } from '../../utils/toast';

const CryptoConnect = () => {
    const {
        userWallet,
        walletInfo,
        isConnecting,
        cryptoBalances,
        connectWallet,
        disconnectWallet,
        checkMetaMask,
        loading,
        userWalletId // Added from context
    } = useCrypto();

    const [copySuccess, setCopySuccess] = useState('');

    const handleCopyAddress = () => {
        if (!userWallet) return;
        navigator.clipboard.writeText(userWallet);
        setCopySuccess('Copied!');
        showToast.success('Wallet address copied');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleCopyId = () => {
        if (!userWalletId) return;
        navigator.clipboard.writeText(userWalletId);
        setCopySuccess('Copied ID!');
        showToast.success('Wallet ID copied: ' + userWalletId);
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const formatAddress = (address) => {
        if (!address) return 'Not connected';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const openInEtherscan = () => {
        if (!userWallet) return;
        window.open(`https://sepolia.etherscan.io/address/${userWallet}`, '_blank');
    };

    // If loading and we don't have wallet info yet, show skeleton
    if (loading && !walletInfo) {
        return (
            <div className="glass-card p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-10 bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!checkMetaMask()) {
        return (
            <div className="glass-card p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="text-yellow-400 mt-1" size={20} />
                    <div>
                        <h3 className="font-medium text-white mb-2">MetaMask Required</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Install MetaMask browser extension to use crypto features.
                        </p>
                        <a
                            href="https://metamask.io/download/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300"
                        >
                            Install MetaMask →
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    if (!userWallet) {
        return (
            <div className="glass-card p-6">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                        <Wallet size={28} className="text-purple-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Connect Your Wallet</h3>
                    <p className="text-gray-400 text-sm mb-6">
                        Link your MetaMask wallet to secure your unique Wallet ID
                    </p>
                    <button
                        onClick={connectWallet}
                        disabled={isConnecting}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:opacity-90 transition-all font-medium disabled:opacity-50"
                    >
                        {isConnecting ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Connecting...
                            </span>
                        ) : (
                            'Connect MetaMask Wallet'
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card p-6">
            {/* Wallet Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                        <Wallet size={20} className="text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Your Wallet</p>
                        <div className="flex flex-col">
                            <span className="font-mono text-white text-sm">{formatAddress(userWallet)}</span>
                            {userWalletId && (
                                <span className="text-xs text-blue-400 font-mono mt-1">
                                    ID: {userWalletId}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={disconnectWallet}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"
                    title="Disconnect wallet from account"
                >
                    <LogOut size={18} />
                </button>
            </div>

            {/* Wallet Actions */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={handleCopyId}
                    className="flex-1 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                    disabled={!userWalletId}
                    title={userWalletId ? "Copy Wallet ID" : "ID not generated"}
                >
                    <Copy size={14} />
                    {copySuccess === 'Copied ID!' ? 'Copied ID' : 'Copy ID'}
                </button>
                <button
                    onClick={handleCopyAddress}
                    className="flex-1 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2 text-xs"
                    title="Copy Wallet Address"
                >
                    <Copy size={14} />
                    {copySuccess === 'Copied!' ? 'Copied Adr' : 'Copy Adr'}
                </button>
            </div>

            {/* Balances */}
            <div className="space-y-4">
                <h4 className="font-medium text-white">Your Balances</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <span className="text-blue-400 text-sm">$</span>
                            </div>
                            <span className="text-gray-300">USDC</span>
                        </div>
                        <span className="text-white font-medium">
                            {cryptoBalances.usdc.toFixed(2)} USDC
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <span className="text-yellow-400 text-sm">D</span>
                            </div>
                            <span className="text-gray-300">DAI</span>
                        </div>
                        <span className="text-white font-medium">
                            {cryptoBalances.dai.toFixed(2)} DAI
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <span className="text-purple-400 text-sm">Ξ</span>
                            </div>
                            <span className="text-gray-300">ETH</span>
                        </div>
                        <span className="text-white font-medium">
                            {cryptoBalances.eth.toFixed(4)} ETH
                        </span>
                    </div>
                </div>
            </div>

            {/* Connection Info */}
            {walletInfo && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                    <p className="text-xs text-gray-500">
                        Connected on {new Date(walletInfo.connectedAt).toLocaleDateString()}
                        <br />
                        Type: {walletInfo.type}
                    </p>
                </div>
            )}
        </div>
    );
};

export default CryptoConnect;
