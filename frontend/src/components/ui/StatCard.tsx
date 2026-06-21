import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  trend?: number;
  trendLabel?: string;
  color?: 'primary' | 'accent' | 'warning' | 'danger';
  delay?: number;
}

const colorMap = {
  primary: 'bg-primary-50 text-primary-600',
  accent: 'bg-accent-50 text-accent-600',
  warning: 'bg-warning-50 text-warning-600',
  danger: 'bg-danger-50 text-danger-600',
};

const bgMap = {
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
};

export default function StatCard({ icon, title, value, trend, trendLabel, color = 'primary', delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card p-6 group hover:shadow-elevated transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-accent-600' : 'text-danger-600'}`}>
            {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-secondary-500 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-3xl font-bold text-secondary-900">{value ?? 0}</p>
      {trendLabel && <p className="text-xs text-secondary-400 mt-2">{trendLabel}</p>}
      <div className={`h-1 w-0 group-hover:w-full ${bgMap[color]} rounded-full mt-4 transition-all duration-500`} />
    </motion.div>
  );
}
