import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import EmptyState from './EmptyState';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyState?: React.ReactNode;
  pageSize?: number;
}

export default function DataTable<T>({ columns, data, keyExtractor, emptyState, pageSize = 10 }: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil((data?.length || 0) / pageSize);
  const paginated = data?.slice(page * pageSize, (page + 1) * pageSize) || [];

  if (!data?.length) {
    return emptyState || <EmptyState />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-secondary-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-3 px-4 text-xs font-semibold text-secondary-500 uppercase tracking-wider"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((row, idx) => (
            <motion.tr
              key={keyExtractor(row)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className="border-b border-secondary-50 hover:bg-secondary-50/50 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="py-4 px-4">
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 border-t border-secondary-100">
          <p className="text-sm text-secondary-500">
            Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, data.length)} of {data.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 rounded-lg border border-secondary-200 hover:bg-secondary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-lg border border-secondary-200 hover:bg-secondary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
