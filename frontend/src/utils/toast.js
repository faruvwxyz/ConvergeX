import { toast } from 'react-hot-toast';

export const showToast = {
    success: (message) => toast.success(message, {
        duration: 4000,
        position: 'top-right',
        style: {
            background: '#10b981',
            color: 'white',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
        },
    }),

    error: (message) => toast.error(message, {
        duration: 6000,
        position: 'top-right',
        style: {
            background: '#ef4444',
            color: 'white',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
        },
    }),

    loading: (message) => toast.loading(message, {
        position: 'top-right',
        style: {
            background: '#374151',
            color: 'white',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
        },
    }),

    promise: (promise, messages) => {
        return toast.promise(promise, messages, {
            position: 'top-right',
            style: {
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
            },
            success: {
                style: {
                    background: '#10b981',
                    color: 'white',
                },
            },
            error: {
                style: {
                    background: '#ef4444',
                    color: 'white',
                },
            },
            loading: {
                style: {
                    background: '#374151',
                    color: 'white',
                },
            },
        });
    }
};
