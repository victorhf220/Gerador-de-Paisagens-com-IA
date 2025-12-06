import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Toast as ToastType } from '@/lib/types';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const handleRemove = () => {
    onRemove(toast.id);
  };

  const getToastClasses = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-600/90 border-green-500';
      case 'error':
        return 'bg-red-600/90 border-red-500';
      case 'warning':
        return 'bg-yellow-600/90 border-yellow-500';
      case 'info':
      default:
        return 'bg-blue-600/90 border-blue-500';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative rounded-lg border text-white p-4 shadow-lg backdrop-blur-sm ${getToastClasses()} min-w-[300px] max-w-[500px]`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 p-1 -mr-1 -mt-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};
