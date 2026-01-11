import { motion } from 'framer-motion';

const MoneyInput = ({ value, onChange, className = '', disabled = false }) => {
    return (
        <div className={`relative flex flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-white/10 ${className}`}>
            <label className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                Enter Amount
            </label>
            <div className="relative flex items-center justify-center">
                <span className="text-4xl md:text-5xl text-gray-400 font-light mr-2">₹</span>
                <input
                    type="number"
                    min="1"
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    placeholder="0"
                    className="w-full max-w-[200px] bg-transparent text-center text-5xl md:text-6xl font-bold text-white placeholder-gray-600 focus:outline-none disabled:opacity-50"
                    style={{ minWidth: '100px' }}
                />
            </div>
            <div className="h-px w-32 bg-white/10 mt-4 rounded-full" />
        </div>
    );
};

export default MoneyInput;
