// components/history/history-sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  Clock, 
  Trash2,
  FolderOpen 
} from 'lucide-react';
import { useHistoryStore, type HistoryItem } from '@/lib/stores';
import type { ArchitectureNodeData, ArchitectureConnection } from '@/types';

interface HistorySidebarProps {
  onLoadDesign: (item: HistoryItem) => void;
  onNewDesign: () => void;
  currentNodes: ArchitectureNodeData[];
  currentEdges: ArchitectureConnection[];
  designName: string;
}

export function HistorySidebar({
  onLoadDesign,
  onNewDesign,
  currentNodes,
  currentEdges,
  designName,
}: HistorySidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const { items, removeItem } = useHistoryStore();

  // Fix hydration - only render after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="h-8 bg-gray-100 rounded animate-pulse" />
        </div>
      </aside>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 48 }}
      transition={{ duration: 0.2 }}
      className="bg-white border-r border-gray-200 flex flex-col relative"
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <FolderOpen className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800">History</span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* New Design Button */}
            <div className="p-3 space-y-3">
              <button
                type="button"
                onClick={onNewDesign}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Design
              </button>
            </div>

            {/* Search */}
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search designs..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No designs yet</p>
                  <p className="text-xs mt-1">Create your first design!</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="group p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                    onClick={() => onLoadDesign(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onLoadDesign(item)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.nodes.length} nodes • {formatDate(item.createdAt)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-all"
                        aria-label="Delete design"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}