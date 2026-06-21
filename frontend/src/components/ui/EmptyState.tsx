import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  icon,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="p-4 bg-secondary-50 rounded-full mb-4">
        {icon || <Inbox size={32} className="text-secondary-400" />}
      </div>
      <h3 className="text-lg font-semibold text-secondary-800 mb-1">{title}</h3>
      <p className="text-sm text-secondary-500 max-w-xs">{description}</p>
    </motion.div>
  );
}
