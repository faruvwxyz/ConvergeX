import { motion } from 'framer-motion';
import { cardVariants } from '../../lib/animations';
import { RefreshCw, CreditCard, Wallet } from 'lucide-react';
import Skeleton from './Skeleton';

const BalanceCard = ({ balance, upiId, onRefresh, loading }) => {
    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="glass-card p-6 md:p-8 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-accent/20 transition-colors duration-500"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-gray-300 font-medium tracking-wide">Total Balance</span>
                    </div>
                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className={`p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all ${loading ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>

                <div className="mb-8">
                    {loading ? (
                        <Skeleton className="h-12 w-48 mb-2" />
                    ) : (
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            ₹ {balance?.toLocaleString('en-IN') || '0.00'}
                        </h1>
                    )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">Your UPI ID</span>
                        {loading ? (
                            <Skeleton className="h-8 w-40" />
                        ) : (
                            <span className="font-mono text-white/90 bg-white/5 px-3 py-1 rounded-md border border-white/5 backdrop-blur-sm select-all">
                                {upiId || 'Not set'}
                            </span>
                        )}
                    </div>
                    <CreditCard className="w-8 h-8 text-white/20" />
                </div>
            </div>
        </motion.div>
    );
};

export default BalanceCard;
