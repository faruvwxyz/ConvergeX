import { motion } from 'framer-motion';
import { listItem } from '../../lib/animations';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const TransactionItem = ({ transaction, onClick }) => {
    // Styling fallbacks
    const isIncoming = transaction.isIncoming;
    const name = isIncoming
        ? (transaction.fromUser?.name || transaction.fromUser?.email || "Unknown")
        : (transaction.toUser?.name || transaction.toUser?.email || "Unknown");

    return (
        <motion.div
            variants={listItem}
            layoutId={transaction._id}
            onClick={onClick}
            className="flex items-center justify-between p-4 my-1 rounded-xl cursor-pointer transition-all hover:bg-white/10 group active:scale-[0.99] border border-transparent hover:border-white/5"
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isIncoming
                        ? "bg-green-500/10 text-green-400 group-hover:bg-green-500/20"
                        : "bg-red-500/10 text-red-400 group-hover:bg-red-500/20"
                    }`}>
                    {isIncoming ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                    <h4 className="font-medium text-white group-hover:text-accent transition-colors">
                        {isIncoming ? `Received from ${name}` : `Sent to ${name}`}
                    </h4>
                    <p className="text-xs text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString()} • {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
            <div className={`font-bold text-lg ${isIncoming ? "text-green-400" : "text-white"
                }`}>
                {isIncoming ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
            </div>
        </motion.div>
    );
};

export default TransactionItem;
