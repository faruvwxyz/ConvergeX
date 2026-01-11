import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wallet, Zap, Shield, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

const Landing = () => {
    const features = [
        {
            icon: Zap,
            title: "Instant Transfers",
            description: "Send money in seconds with UPI technology"
        },
        {
            icon: Shield,
            title: "Bank-Level Security",
            description: "Your transactions are encrypted and protected"
        },
        {
            icon: TrendingUp,
            title: "Smart Analytics",
            description: "Track spending with beautiful visualizations"
        }
    ];

    const benefits = [
        "Zero transaction fees",
        "24/7 instant transfers",
        "Real-time notifications",
        "Multi-platform support"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#1a1f2e] to-[#0a0f1a] overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 glass border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/50">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-white">ConvergeX Pay</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="text-gray-300 hover:text-white transition-colors font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)] py-20">
                    {/* Left Column - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="inline-block">
                            <span className="bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium border border-accent/20">
                                🚀 Next-Gen Payment Platform
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                            Pay Anyone,
                            <br />
                            <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
                                Anywhere
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                            Experience the future of digital payments. Send money instantly, track your spending, and manage your finances with the power of modern technology.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/register"
                                className="group bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-2xl shadow-accent/30 hover:shadow-accent/50 hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Create Free Account
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                            <Link
                                to="/login"
                                className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-white/10 hover:border-white/20 flex items-center justify-center"
                            >
                                Sign In
                            </Link>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-2 gap-4 pt-8">
                            {benefits.map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex items-center gap-2 text-gray-300"
                                >
                                    <CheckCircle className="text-green-400 shrink-0" size={18} />
                                    <span className="text-sm">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column - Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hidden lg:block"
                    >
                        <div className="relative">
                            {/* Mock App Preview */}
                            <div className="glass p-8 rounded-3xl border border-white/20 shadow-2xl">
                                <div className="space-y-6">
                                    {/* Balance Card */}
                                    <div className="bg-gradient-to-br from-accent to-purple-600 p-6 rounded-2xl shadow-xl">
                                        <p className="text-white/80 text-sm mb-2">Available Balance</p>
                                        <h3 className="text-4xl font-bold text-white mb-4">₹ 24,580</h3>
                                        <div className="flex items-center gap-2 text-white/90 text-sm">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            user@cxpay
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-white/5 p-4 rounded-xl text-center border border-white/10">
                                            <div className="w-10 h-10 bg-accent/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                                                <Zap size={20} className="text-accent" />
                                            </div>
                                            <p className="text-xs text-gray-400">Send</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-xl text-center border border-white/10">
                                            <div className="w-10 h-10 bg-purple-500/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                                                <TrendingUp size={20} className="text-purple-400" />
                                            </div>
                                            <p className="text-xs text-gray-400">Request</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-xl text-center border border-white/10">
                                            <div className="w-10 h-10 bg-green-500/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                                                <Shield size={20} className="text-green-400" />
                                            </div>
                                            <p className="text-xs text-gray-400">Secure</p>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/10">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-green-500/20 rounded-full" />
                                                    <div>
                                                        <div className="w-20 h-2 bg-white/20 rounded mb-1" />
                                                        <div className="w-16 h-1.5 bg-white/10 rounded" />
                                                    </div>
                                                </div>
                                                <div className="w-12 h-3 bg-white/10 rounded" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -top-6 -right-6 bg-green-500/20 backdrop-blur-xl p-4 rounded-2xl border border-green-500/30 shadow-xl"
                            >
                                <p className="text-xs text-green-400 mb-1">Success Rate</p>
                                <p className="text-2xl font-bold text-white">99.9%</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid md:grid-cols-3 gap-8 pb-20"
                >
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="glass p-8 rounded-2xl border border-white/10 hover:border-accent/30 transition-all group hover:scale-105"
                        >
                            <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                                <feature.icon className="text-accent" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Landing;
