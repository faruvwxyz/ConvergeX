import { motion } from 'framer-motion';

export const Button = ({
    children,
    onClick,
    disabled = false,
    loading = false,
    variant = 'primary',
    className = '',
    type = 'button',
    ...props
}) => {
    const baseClasses = 'px-6 py-3 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl',
        secondary: 'bg-white/5 hover:bg-white/10 text-white focus:ring-gray-500 border border-white/10',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
        ghost: 'bg-transparent hover:bg-white/5 text-white focus:ring-gray-500'
    };

    return (
        <motion.button
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            whileHover={disabled || loading ? {} : { scale: 1.02 }}
            onClick={onClick}
            disabled={disabled || loading}
            type={type}
            className={`${baseClasses} ${variants[variant]} ${disabled || loading ? 'opacity-50' : 'cursor-pointer'} ${className}`}
            {...props}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                </span>
            ) : (
                children
            )}
        </motion.button>
    );
};
