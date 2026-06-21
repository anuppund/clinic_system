import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className="rounded-full border-4 border-primary-200 border-t-primary-600"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
