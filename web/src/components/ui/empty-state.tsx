// components/ui/empty-state.tsx
'use client';

import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}
    >
      {/* Icon */}
      <motion.span
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="text-5xl mb-4"
      >
        {icon}
      </motion.span>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-500 max-w-xs mb-6">{description}</p>

      {/* Action Button */}
      {action && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}