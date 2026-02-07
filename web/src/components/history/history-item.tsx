'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Trash2, FolderOpen, Clock, Box } from 'lucide-react';
import type { HistoryItem } from '@/lib/stores';

interface HistoryItemCardProps {
  item: HistoryItem;
  onLoad: () => void;
  onDelete: () => void;
}

export function HistoryItemCard({ item, onLoad, onDelete }: HistoryItemCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative group">
      <button onClick={onLoad} className="w-full text-left p-3 bg-gray-50 hover:bg-indigo-50 rounded-xl transition-colors">
        <div className="w-full h-16 bg-white rounded-lg mb-2 flex items-center justify-center border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-1 text-gray-300">
            <Box size={20} />
            <span className="text-xs">{item.nodes.length} nodes</span>
          </div>
        </div>
        <h4 className="font-medium text-gray-800 text-sm truncate pr-6">{item.name}</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <Clock size={12} />
          <span>{formatDate(item.updatedAt)}</span>
          <span>•</span>
          <span>{item.nodes.length} nodes</span>
        </div>
      </button>

      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1.5 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
        >
          <MoreVertical size={14} className="text-gray-400" />
        </button>
        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[120px]">
              <button onClick={(e) => { e.stopPropagation(); onLoad(); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 text-sm">
                <FolderOpen size={14} /> Open
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 text-sm">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}