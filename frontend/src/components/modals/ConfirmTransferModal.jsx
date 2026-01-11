import { motion, AnimatePresence } from 'framer-motion';
import { scaleIn } from '../../utils/animations';

export const ConfirmTransferModal = ({
    isOpen,
    onClose,
    onConfirm,
    amount,
    recipient,
    note,
    loading = false
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    variants={scaleIn}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                >
                    <h2 className="text-2xl font-bold mb-6 text-white">Confirm Transfer</h2>

                    <div className="space-y-4 mb-6 bg-white/5 rounded-xl p-5 border border-white/10">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Amount:</span>
                            <span className="text-3xl font-bold text-white">₹{Number(amount).toLocaleString('en-IN')}</span>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400 text-sm">To:</span>
                                <span className="font-mono text-white text-right">{recipient}</span>
                            </div>

                            {note && (
                                <div className="flex justify-between items-start mt-3">
                                    <span className="text-gray-400 text-sm">Note:</span>
                                    <span className="text-white text-right text-sm max-w-[60%]">{note}</span>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Processing Fee:</span>
                                <span className="text-green-400 font-semibold text-sm">FREE</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6">
                        <p className="text-yellow-200 text-xs text-center">
                            ⚠️ This action cannot be undone. Please verify all details before confirming.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-[2] px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                'Confirm & Send'
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
