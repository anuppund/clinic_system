interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  Booked: { bg: 'bg-accent-50', text: 'text-accent-700', label: 'Booked' },
  Cancelled: { bg: 'bg-danger-50', text: 'text-danger-700', label: 'Cancelled' },
  Completed: { bg: 'bg-primary-50', text: 'text-primary-700', label: 'Completed' },
  Pending: { bg: 'bg-warning-50', text: 'text-warning-700', label: 'Pending' },
  Active: { bg: 'bg-accent-50', text: 'text-accent-700', label: 'Active' },
  Inactive: { bg: 'bg-secondary-100', text: 'text-secondary-600', label: 'Inactive' },
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] || { bg: 'bg-secondary-100', text: 'text-secondary-600', label: status };
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${sizeClasses} ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
