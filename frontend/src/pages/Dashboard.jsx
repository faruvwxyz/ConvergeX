import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { pageVariants, listContainer } from "../lib/animations";
import BalanceCard from "../components/ui/BalanceCard";
import Skeleton from "../components/ui/Skeleton";
import TransactionItem from "../components/ui/TransactionItem";
import CryptoConnect from "../components/crypto/CryptoConnect";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCrypto } from "../context/CryptoContext";
import { ArrowRight, Send, ArrowLeftRight } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { exchangeRates } = useCrypto();
  const [balance, setBalance] = useState(0);
  const [upiId, setUpiId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('📊 Fetching dashboard data...');

      // Fetch balance
      const balanceRes = await api.get("/bank/balance");
      console.log('✅ Balance loaded:', balanceRes.data);
      setBalance(balanceRes.data.balance);
      setUpiId(balanceRes.data.upiId);

      // Fetch recent transactions (API returns { transactions: [] })
      const txRes = await api.get("/transactions", { params: { limit: 5 } });
      console.log('✅ Recent transactions loaded:', txRes.data);
      setTransactions((txRes.data.transactions || []).slice(0, 5));
    } catch (error) {
      console.error('❌ Dashboard fetch error:', error);
      // Handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          <BalanceCard
            balance={balance}
            upiId={upiId}
            onRefresh={fetchData}
            loading={loading}
          />

          {/* Quick Actions */}
          {/* Stats & Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly Spend Stat (Now Dynamic) */}
            <div className="glass-card p-5 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-gray-400 text-sm font-medium mb-1">Total Sent</h4>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-white">
                    ₹{transactions
                      .filter(tx => tx.isSent)
                      .reduce((sum, tx) => sum + (tx.amount || 0), 0)
                      .toLocaleString('en-IN')}
                  </span>
                </div>
                {/* Tiny Bar Chart Simulation */}
                <div className="flex items-end gap-1 mt-3 h-8 opacity-50">
                  <div className="w-1/6 bg-red-500 h-[40%] rounded-t-sm"></div>
                  <div className="w-1/6 bg-red-500 h-[70%] rounded-t-sm"></div>
                  <div className="w-1/6 bg-red-500 h-[30%] rounded-t-sm"></div>
                  <div className="w-1/6 bg-red-500 h-[100%] rounded-t-sm"></div>
                  <div className="w-1/6 bg-red-500 h-[60%] rounded-t-sm"></div>
                  <div className="w-1/6 bg-red-500 h-[80%] rounded-t-sm"></div>
                </div>
              </div>
            </div>

            <Link
              to="/send"
              className="glass-card p-5 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all group border-accent/20 hover:border-accent/50"
            >
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-lg shadow-accent/20">
                <Send size={20} />
              </div>
              <span className="font-medium text-white">Send Money</span>
            </Link>

            <Link
              to="/requests"
              className="glass-card p-5 flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all group border-purple-500/20 hover:border-purple-500/50"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                <ArrowLeftRight size={20} />
              </div>
              <span className="font-medium text-white">Requests</span>
            </Link>

            {/* Income stat (Now Dynamic) */}
            <div className="glass-card p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-gray-400 text-sm font-medium">Total Received</h4>
                <span className="text-2xl font-bold text-green-400">
                  +₹{transactions
                    .filter(tx => !tx.isSent)
                    .reduce((sum, tx) => sum + (tx.amount || 0), 0)
                    .toLocaleString('en-IN')}
                </span>
              </div>
              <div className="w-full bg-white/10 h-1 rounded-full mt-2">
                <div className="bg-green-500 h-1 rounded-full w-[75%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-1 space-y-6">
          {/* Crypto Wallet Section */}
          <CryptoConnect />

          {/* Exchange Rates */}
          <div className="glass-card p-5">
            <h3 className="text-lg font-bold text-white mb-4">Crypto Exchange Rates</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5">
                <span className="text-gray-400">1 USDC</span>
                <span className="text-white">≈ ₹{(exchangeRates.usdcToUsd * exchangeRates.usdToInr).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5">
                <span className="text-gray-400">1 DAI</span>
                <span className="text-white">≈ ₹{(exchangeRates.daiToUsd * exchangeRates.usdToInr).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5">
                <span className="text-gray-400">1 ETH</span>
                <span className="text-white">≈ ₹{(exchangeRates.ethToUsd * exchangeRates.usdToInr).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-white">
                Recent Activity
              </h3>
              <Link
                to="/transactions"
                className="text-xs text-accent hover:text-white transition-colors flex items-center gap-1"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <motion.div
              variants={listContainer}
              initial="hidden"
              animate="show"
              className="space-y-2"
            >
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div>
                        <Skeleton className="w-24 h-4 mb-2" />
                        <Skeleton className="w-16 h-3" />
                      </div>
                    </div>
                    <Skeleton className="w-16 h-5" />
                  </div>
                ))
              ) : transactions.length > 0 ? (
                transactions.map((tx) => {
                  const isIncoming =
                    tx.toUser === user?.id ||
                    tx.toUser?._id === user?.id;

                  return (
                    <TransactionItem
                      key={tx._id}
                      transaction={{ ...tx, isIncoming }}
                      currentUserId={user?.id}
                    />
                  );
                })
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No recent transactions
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
