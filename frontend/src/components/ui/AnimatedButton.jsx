import { motion } from 'framer-motion';
import { buttonTap } from '../../lib/animations';
import { Loader2 } from 'lucide-react';

const AnimatedButton = ({
    children,
    onClick,
    className = '',
    type = 'button',
    disabled = false,
    loading = false,
    variant = 'primary'
}) => {
    const baseStyles = "relative font-medium rounded-lg transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/25 py-3 px-6",
        secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10 py-3 px-6",
        danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-2 px-4 text-sm",
        ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white py-2 px-4"
    };

    return (
        <motion.button
            whileTap={!disabled && !loading ? buttonTap : {}}
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {children}
        </motion.button>
    );
};

export default AnimatedButton;
