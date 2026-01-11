import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '../lib/animations';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, PieChart, Activity, DollarSign } from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';

const Analytics = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTx = async () => {
            try {
                const res = await api.get('/transactions');
                setTransactions(res.data.transactions || []);
            } catch (error) {
                console.error("Failed to fetch transactions");
            } finally {
                setLoading(false);
            }
        };
        fetchTx();
    }, []);

    const stats = useMemo(() => {
        let income = 0;
        let expense = 0;

        transactions.forEach(tx => {
            const isIncoming = tx.toUser === user?.id || tx.toUser?._id === user?.id;
            if (isIncoming) {
                income += Number(tx.amount);
            } else {
                expense += Number(tx.amount);
            }
        });

        return { income, expense, net: income - expense };
    }, [transactions, user]);

    // Mock Weekly Data for visual flair (CSS Bar Chart)
    const weeklyData = [65, 40, 75, 50, 90, 30, 80];
    const maxVal = Math.max(...weeklyData);

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-4xl mx-auto space-y-8"
        >
            <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                    <Activity size={24} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">Analytics</h2>
                    <p className="text-gray-400">Financial overview & trends</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            ) : (
                <>
                    {/* Main Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card p-6 border-l-4 border-green-500">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="text-gray-400 font-medium text-sm uppercase tracking-wide">Total Income</span>
                            </div>
                            <p className="text-3xl font-bold text-white">₹ {stats.income.toLocaleString()}</p>
                        </div>

                        <div className="glass-card p-6 border-l-4 border-red-500">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                                    <TrendingDown size={20} />
                                </div>
                                <span className="text-gray-400 font-medium text-sm uppercase tracking-wide">Total Spent</span>
                            </div>
                            <p className="text-3xl font-bold text-white">₹ {stats.expense.toLocaleString()}</p>
                        </div>

                        <div className="glass-card p-6 border-l-4 border-accent">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-accent/20 rounded-lg text-accent">
                                    <DollarSign size={20} />
                                </div>
                                <span className="text-gray-400 font-medium text-sm uppercase tracking-wide">Net Savings</span>
                            </div>
                            <p className={`text-3xl font-bold ${stats.net >= 0 ? 'text-white' : 'text-red-400'}`}>
                                {stats.net >= 0 ? '' : '-'}₹ {Math.abs(stats.net).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Weekly Activity (CSS Bar Chart) */}
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-lg text-white">Weekly Spending</h3>
                                <span className="text-xs text-gray-400 bg-white/5 py-1 px-3 rounded-full">Last 7 Days</span>
                            </div>
                            <div className="flex items-end justify-between h-48 gap-3">
                                {weeklyData.map((val, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div
                                            className="w-full bg-accent/20 rounded-t-sm relative transition-all duration-500 group-hover:bg-accent/40"
                                            style={{ height: `${(val / maxVal) * 100}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">
                                                {val}%
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 font-mono">
                                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Categories (CSS Donut) */}
                        <div className="glass-card p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg text-white">Categories</h3>
                                <PieChart size={20} className="text-gray-400" />
                            </div>

                            <div className="flex-1 flex items-center justify-center gap-8">
                                {/* CSS Conic Gradient Pie */}
                                <div className="relative w-40 h-40 rounded-full" style={{
                                    background: 'conic-gradient(#6366f1 0% 35%, #8b5cf6 35% 60%, #10b981 60% 85%, #f43f5e 85% 100%)'
                                }}>
                                    <div className="absolute inset-4 bg-[#1a1f2e] rounded-full flex items-center justify-center">
                                        <span className="text-xs text-gray-400">Expense<br />Split</span>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#6366f1]" />
                                        <span className="text-gray-300">Food (35%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
                                        <span className="text-gray-300">Travel (25%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                                        <span className="text-gray-300">Shopping (25%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#f43f5e]" />
                                        <span className="text-gray-300">Others (15%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default Analytics;
