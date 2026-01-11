import { motion } from 'framer-motion';

export const DashboardSkeleton = () => (
    <div className="animate-pulse space-y-6">
        {/* Balance Card Skeleton */}
        <div className="h-40 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl"></div>

        {/* Quick Actions Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-gray-800 rounded-xl"></div>
            <div className="h-24 bg-gray-800 rounded-xl"></div>
        </div>

        {/* Recent Transactions Skeleton */}
        <div className="bg-gray-800 rounded-2xl p-6">
            <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center p-3">
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-700 rounded w-32"></div>
                            <div className="h-3 bg-gray-700 rounded w-24"></div>
                        </div>
                        <div className="h-6 bg-gray-700 rounded w-20"></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export const TransactionSkeleton = () => (
    <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-800 rounded-xl p-4"
            >
                <div className="flex justify-between items-center">
                    <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-700 rounded w-40"></div>
                        <div className="h-3 bg-gray-700 rounded w-32"></div>
                    </div>
                    <div className="h-6 bg-gray-700 rounded w-24"></div>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                    <div className="h-3 bg-gray-700 rounded w-36"></div>
                    <div className="h-5 bg-gray-700 rounded w-16"></div>
                </div>
            </motion.div>
        ))}
    </div>
);

export const RequestSkeleton = () => (
    <div className="space-y-3">
        {[1, 2, 3].map((i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-gray-800 rounded-xl p-4"
            >
                <div className="flex justify-between items-center mb-3">
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-32"></div>
                        <div className="h-3 bg-gray-700 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-gray-700 rounded w-20"></div>
                </div>
                <div className="flex gap-2">
                    <div className="h-9 bg-gray-700 rounded flex-1"></div>
                    <div className="h-9 bg-gray-700 rounded flex-1"></div>
                </div>
            </motion.div>
        ))}
    </div>
);
