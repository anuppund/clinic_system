import { motion, AnimatePresence } from 'framer-motion';
import { CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: (id: string) => void;
  duration?: number;
}

const iconMap = {
  success: <CheckCircle size={20} className="text-accent-500" />,
  error: <XCircle size={20} className="text-danger-500" />,
  info: <AlertCircle size={20} className="text-primary-500" />,
};

const borderMap = {
  success: 'border-accent-200',
  error: 'border-danger-200',
  info: 'border-primary-200',
};

export default function Toast({ id, message, type = 'info', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={`flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-elevated border ${borderMap[type]} min-w-[320px]`}
    >
      {iconMap[type]}
      <p className="flex-1 text-sm font-medium text-secondary-800">{message}</p>
      <button onClick={() => onClose(id)} className="text-secondary-400 hover:text-secondary-600 transition-colors">
        <X size={16} />
      </button>
    </motion.div>
  );
}
