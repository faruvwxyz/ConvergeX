import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';

export const EmptyState = ({
    icon = '📊',
    title = 'Nothing here yet',
    description = 'Get started by creating your first item',
    action,
    actionLabel,
    className = ''
}) => (
    <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className={`text-center py-12 ${className}`}
    >
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
        {action && (
            <button
                onClick={action}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-medium"
            >
                {actionLabel}
            </button>
        )}
    </motion.div>
);

// Specific empty states for common use cases

export const EmptyTransactions = () => (
    <EmptyState
        icon="💸"
        title="No transactions yet"
        description="Your transaction history will appear here once you start sending or receiving money"
        action={() => window.location.href = '/send'}
        actionLabel="Send Money"
    />
);

export const EmptyRequests = () => (
    <EmptyState
        icon="📨"
        title="No payment requests"
        description="Money requests from your contacts will appear here"
    />
);

export const EmptyBalance = () => (
    <EmptyState
        icon="💰"
        title="Connect your bank"
        description="Link your bank account to start making transactions"
        action={() => window.location.href = '/profile'}
        actionLabel="Go to Profile"
    />
);
