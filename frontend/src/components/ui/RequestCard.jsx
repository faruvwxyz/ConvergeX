import { motion } from 'framer-motion';
import { listItem } from '../../lib/animations';
import AnimatedButton from './AnimatedButton';
import { Check, X, User } from 'lucide-react';

const RequestCard = ({ request, onAccept, onReject, processing }) => {
    return (
        <motion.div
            variants={listItem}
            className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <User size={24} />
                </div>
                <div>
                    <h4 className="font-semibold text-lg text-white">Request from {request.requester.username || request.requester.email}</h4>
                    <p className="text-gray-400 text-sm">{new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <span className="text-2xl font-bold text-white">₹{request.amount.toLocaleString('en-IN')}</span>

                <div className="flex gap-2">
                    <AnimatedButton
                        onClick={() => onReject(request._id)}
                        disabled={processing}
                        variant="danger"
                        className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full"
                    >
                        <X size={20} />
                    </AnimatedButton>
                    <AnimatedButton
                        onClick={() => onAccept(request._id)}
                        disabled={processing}
                        variant="primary"
                        className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-500/30"
                    >
                        <Check size={20} />
                    </AnimatedButton>
                </div>
            </div>
        </motion.div>
    );
};

export default RequestCard;
