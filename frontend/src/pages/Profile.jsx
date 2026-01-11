import { motion } from 'framer-motion';
import { pageVariants } from '../lib/animations';
import { useAuth } from '../context/AuthContext';
import { User, Mail, QrCode, Shield, Bell, Download, ChevronRight, LogOut, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, logout } = useAuth();

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
        >
            {/* Left Col: ID Card */}
            <div className="md:col-span-1 space-y-6">
                <div className="glass-card p-6 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-4xl font-bold text-white mb-4 shadow-xl shadow-accent/20">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                    <p className="text-gray-400 text-sm mb-4">{user?.email}</p>

                    <div
                        className="bg-white/5 border border-white/10 rounded-lg p-3 w-full flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => copyToClipboard(user?.username || user?.email)}
                    >
                        <div className="flex items-center gap-2 text-xs text-gray-300 overflow-hidden">
                            <span className="font-medium text-accent">UPI:</span>
                            <span className="truncate">{user?.username || user?.email}</span>
                        </div>
                        <Copy size={14} className="text-gray-500" />
                    </div>
                </div>

                <div className="glass-card p-6 flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-white rounded-xl">
                        <QrCode size={120} className="text-black" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium">Scan to Pay</h3>
                        <p className="text-xs text-gray-500">Show this QR to receive money</p>
                    </div>
                </div>
            </div>

            {/* Right Col: Settings */}
            <div className="md:col-span-2 space-y-6">
                <div className="glass-card overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <h3 className="font-bold text-white">General Settings</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Shield size={18} /></div>
                                <div>
                                    <p className="text-white text-sm font-medium">Biometric Login</p>
                                    <p className="text-gray-500 text-xs">Secure your account with Fingerprint</p>
                                </div>
                            </div>
                            <div className="w-10 h-6 bg-accent rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>

                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg"><Bell size={18} /></div>
                                <div>
                                    <p className="text-white text-sm font-medium">Notifications</p>
                                    <p className="text-gray-500 text-xs">Get alerts for transactions</p>
                                </div>
                            </div>
                            <div className="w-10 h-6 bg-accent rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>

                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 text-green-400 rounded-lg"><Download size={18} /></div>
                                <div>
                                    <p className="text-white text-sm font-medium">Export Data</p>
                                    <p className="text-gray-500 text-xs">Download statement as PDF</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-gray-500" />
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full glass-card p-4 flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10 transition-colors border-red-500/20"
                >
                    <LogOut size={18} />
                    <span className="font-medium">Logout from all devices</span>
                </button>
            </div>
        </motion.div>
    );
};

export default Profile;
