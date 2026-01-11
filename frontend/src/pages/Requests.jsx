import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pageVariants, listContainer } from '../lib/animations';
import api from '../api/client';
import { showToast } from '../utils/toast';
import { Button } from '../components/ui/Button';
import { RequestSkeleton } from '../components/skeletons/LoadingSkeletons';
import { ArrowLeftRight, Plus, User } from 'lucide-react';

const Requests = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('incoming');
  const [newRequest, setNewRequest] = useState({ toUpiId: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [creatingRequest, setCreatingRequest] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Fetch all requests
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching requests...');

      // Fetch incoming requests
      const incomingRes = await api.get('/request/incoming');
      console.log('📥 Incoming:', incomingRes.data);
      setIncomingRequests(incomingRes.data.requests || []);

      // Fetch outgoing requests
      const outgoingRes = await api.get('/request/outgoing');
      console.log('📤 Outgoing:', outgoingRes.data);
      setOutgoingRequests(outgoingRes.data.requests || []);

    } catch (error) {
      console.error('❌ Failed to fetch requests:', error);
      showToast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();

    if (!newRequest.toUpiId.trim() || !newRequest.amount || Number(newRequest.amount) <= 0) {
      showToast.error('Please enter valid UPI ID and amount');
      return;
    }

    try {
      setCreatingRequest(true);
      console.log('🎯 Creating request with:', newRequest);

      const response = await api.post('/request', {
        toUpiId: newRequest.toUpiId.trim(),
        amount: Number(newRequest.amount)
      });

      console.log('✅ Request created:', response.data);
      showToast.success('Money request sent successfully!');

      // Clear form
      setNewRequest({ toUpiId: '', amount: '' });

      // Refresh requests
      await fetchRequests();

      // Switch to outgoing tab to see the new request
      setActiveTab('outgoing');

    } catch (error) {
      console.error('❌ Create request error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to send request';
      showToast.error(errorMsg);
    } finally {
      setCreatingRequest(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      setProcessingId(requestId);
      console.log('✅ Accepting request:', requestId);

      const response = await api.post(`/request/${requestId}/accept`);
      console.log('✅ Response:', response.data);

      showToast.success('Request accepted and payment sent!');
      await fetchRequests(); // Refresh list

    } catch (error) {
      console.error('❌ Accept error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to accept request';
      showToast.error(errorMsg);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setProcessingId(requestId);
      console.log('❌ Rejecting request:', requestId);

      const response = await api.post(`/request/${requestId}/reject`);
      console.log('✅ Response:', response.data);

      showToast.success('Request rejected');
      await fetchRequests(); // Refresh list

    } catch (error) {
      console.error('❌ Reject error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to reject request';
      showToast.error(errorMsg);
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
            <ArrowLeftRight size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Money Requests</h1>
            <p className="text-gray-400">Manage incoming and outgoing requests</p>
          </div>
        </div>
      </div>

      {/* Create New Request Form */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={20} className="text-accent" />
          <h2 className="text-xl font-semibold text-white">Create New Request</h2>
        </div>
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Recipient UPI ID
              </label>
              <input
                type="text"
                placeholder="username@cxpay"
                value={newRequest.toUpiId}
                onChange={(e) => setNewRequest({ ...newRequest, toUpiId: e.target.value })}
                className="input-field"
                required
                disabled={creatingRequest}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                placeholder="1000"
                min="1"
                value={newRequest.amount}
                onChange={(e) => setNewRequest({ ...newRequest, amount: e.target.value })}
                className="input-field"
                required
                disabled={creatingRequest}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                loading={creatingRequest}
                className="w-full"
              >
                {creatingRequest ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800 mb-6">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-6 py-3 font-medium transition-all relative ${activeTab === 'incoming'
              ? 'text-white border-b-2 border-accent'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Incoming
          {incomingRequests.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">
              {incomingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`px-6 py-3 font-medium transition-all relative ${activeTab === 'outgoing'
              ? 'text-white border-b-2 border-accent'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Sent Requests
          {outgoingRequests.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
              {outgoingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Requests List */}
      <div className="min-h-[300px]">
        {loading ? (
          <RequestSkeleton />
        ) : activeTab === 'incoming' ? (
          <motion.div
            variants={listContainer}
            initial="hidden"
            animate="show"
          >
            {incomingRequests.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <ArrowLeftRight className="w-16 h-16 mx-auto mb-4 opacity-20 text-gray-400" />
                <h3 className="text-xl font-medium text-white mb-2">No incoming requests</h3>
                <p className="text-gray-400">Requests sent to you will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="glass-card p-5 hover:bg-white/5 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                            <User size={24} />
                          </div>
                          <div>
                            <h4 className="font-medium text-white text-lg">
                              {request.fromUser?.name || request.fromUser?.email || 'Unknown'}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {request.fromUpi} • {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">
                            ₹{request.amount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-sm text-gray-400">
                            Requested
                          </div>
                        </div>

                        {request.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <Button
                              variant="success"
                              onClick={() => handleAccept(request._id)}
                              disabled={processingId === request._id}
                              loading={processingId === request._id}
                              className="px-4 py-2"
                            >
                              Accept
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleReject(request._id)}
                              disabled={processingId === request._id}
                              className="px-4 py-2"
                            >
                              Reject
                            </Button>
                          </div>
                        )}

                        {request.status !== 'PENDING' && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === 'ACCEPTED'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                            }`}>
                            {request.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={listContainer}
            initial="hidden"
            animate="show"
          >
            {outgoingRequests.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <ArrowLeftRight className="w-16 h-16 mx-auto mb-4 opacity-20 text-gray-400" />
                <h3 className="text-xl font-medium text-white mb-2">No sent requests</h3>
                <p className="text-gray-400">Create a request using the form above</p>
              </div>
            ) : (
              <div className="space-y-4">
                {outgoingRequests.map((request) => (
                  <div
                    key={request._id}
                    className="glass-card p-5 hover:bg-white/5 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <User size={24} />
                          </div>
                          <div>
                            <h4 className="font-medium text-white text-lg">
                              To: {request.toUser?.name || request.toUser?.email || 'Unknown'}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {request.toUpi} • {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">
                            ₹{request.amount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-sm text-gray-400">
                            Sent {formatDate(request.createdAt)}
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === 'PENDING'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : request.status === 'ACCEPTED'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Requests;
