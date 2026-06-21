import { motion, AnimatePresence } from 'framer-motion';
import { TriangleAlert as AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-elevated w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-danger-50' : 'bg-warning-50'}`}>
                <AlertTriangle size={28} className={variant === 'danger' ? 'text-danger-500' : 'text-warning-500'} />
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">{title}</h3>
              <p className="text-secondary-500 text-sm">{message}</p>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button onClick={onClose} className="flex-1 btn-secondary">
                {cancelText}
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className={`flex-1 ${variant === 'danger' ? 'btn-danger' : 'px-6 py-3 bg-warning-50 text-warning-700 font-semibold rounded-xl hover:bg-warning-100 active:scale-[0.98] transition-all'}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
