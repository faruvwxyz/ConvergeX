import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, ArrowDownLeft, Copy, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionModal = ({ transaction, onClose }) => {
    if (!transaction) return null;

    const isIncoming = transaction.isIncoming;
    const statusColor = transaction.status === 'SUCCESS' ? 'text-green-400'
        : transaction.status === 'FAILED' ? 'text-red-400'
            : 'text-yellow-400';

    const StatusIcon = transaction.status === 'SUCCESS' ? CheckCircle
        : transaction.status === 'FAILED' ? AlertCircle
            : Clock;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-[#1a1f2e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20"
                >
                    {/* Header / Amount */}
                    <div className={`p-8 flex flex-col items-center justify-center ${isIncoming ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isIncoming ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {isIncoming ? <ArrowDownLeft size={32} /> : <ArrowUpRight size={32} />}
                        </div>
                        <h2 className={`text-4xl font-bold tracking-tight mb-2 ${isIncoming ? 'text-green-400' : 'text-white'}`}>
                            {isIncoming ? '+' : '-'}₹{Math.abs(transaction.amount || 0).toLocaleString('en-IN')}
                        </h2>
                        <span className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-white/5 ${statusColor}`}>
                            <StatusIcon size={14} />
                            {transaction.status || 'SUCCESS'}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Details Body */}
                    <div className="p-6 space-y-6">

                        {/* From / To */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                <span className="text-gray-400 text-sm">Transfer to</span>
                                <span className="text-white font-medium">
                                    {isIncoming
                                        ? 'You'
                                        : (transaction.toUser?.name || transaction.toUser?.email || 'Unknown')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                <span className="text-gray-400 text-sm">Transfer from</span>
                                <span className="text-white font-medium">
                                    {isIncoming
                                        ? (transaction.fromUser?.name || transaction.fromUser?.email || 'Unknown')
                                        : 'You'}
                                </span>
                            </div>
                        </div>

                        <div className="h-px bg-white/10" />

                        {/* Meta details */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Date</span>
                                <span className="text-gray-200 text-sm font-medium">
                                    {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                                        weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Time</span>
                                <span className="text-gray-200 text-sm font-medium">
                                    {new Date(transaction.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-gray-400 text-sm">Transaction ID</span>
                                <button
                                    onClick={() => copyToClipboard(transaction._id)}
                                    className="flex items-center gap-2 text-xs text-accent hover:text-accent-hover transition-colors"
                                >
                                    <span className="font-mono">{transaction._id.slice(-8).toUpperCase()}</span>
                                    <Copy size={12} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                        <span className="text-xs text-gray-500">
                            ConvergeX Pay Secured Transaction
                        </span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TransactionModal;
