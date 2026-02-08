// components/panels/detail-panel.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Trash2, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import type { ArchitectureNodeData } from '@/types';
import { NODE_ICONS, NODE_COLORS } from '@/types';
import { useEffect } from 'react';

interface DetailPanelProps {
  node: ArchitectureNodeData | null;
  onClose: () => void;
  onDelete?: (nodeId: string) => void;
  onUpdate?: (nodeId: string, data: Partial<ArchitectureNodeData>) => void;
}

export function DetailPanel({ node, onClose, onDelete, onUpdate }: DetailPanelProps) {
  useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  window.addEventListener('keydown', handleEsc);
  return () => window.removeEventListener('keydown', handleEsc);
}, [onClose]);
  if (!node) return null;

  const colors = NODE_COLORS[node.type];
  const icon = NODE_ICONS[node.type];

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={16} />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <AnimatePresence>
        <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-[320px] top-16 w-80 bg-white border-l border-gray-200 flex flex-col h-[calc(100vh-64px)] shadow-xl z-50"
    >

        {/* Header */}
        <div className={`p-4 ${colors.bg} border-b ${colors.border}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <h3 className={`font-semibold ${colors.text}`}>{node.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{node.type}</p>
              </div>
            </div>
             <button
            onClick={onClose}
            className="p-2 bg-white shadow-sm hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-700" />
          </button>

          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Status</span>
            <div className="flex items-center gap-1.5">
              {getStatusIcon(node.status)}
              <span className="text-sm font-medium">{getStatusLabel(node.status)}</span>
            </div>
          </div>

          {/* Description */}
          {node.description && (
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">
                Description
              </label>
              <p className="mt-1 text-sm text-gray-700">{node.description}</p>
            </div>
          )}

          {/* Node Type Info */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">
              Component Type
            </label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 capitalize font-medium">
                {node.type}
              </p>
              <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">
                {getTypeDescription(node.type)}
              </p>
            </div>
          </div>

          {/* ID */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">
              Node ID
            </label>
            <code className="block mt-1 text-xs bg-gray-100 text-gray-600 p-2 rounded font-mono">
              {node.id}
            </code>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          {onUpdate && (
            <button
              onClick={() => {
                const newName = prompt('Enter new name:', node.name);
                if (newName && newName !== node.name) {
                  onUpdate(node.id, { name: newName });
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
            >
              <Edit2 size={14} />
              Edit Name
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => {
                if (confirm(`Delete "${node.name}"?`)) {
                  onDelete(node.id);
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
            >
              <Trash2 size={14} />
              Delete Node
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function getTypeDescription(type: string): string {
  const descriptions: Record<string, string> = {
    service: `• Handles core business logic  
• Processes API requests  
• Communicates with DB/cache  
• Can scale horizontally`,

    database: `• Stores persistent application data  
• Supports read/write operations  
• Ensures durability & consistency  
• Central source of truth`,

    cache: `• Stores frequently accessed data  
• Reduces DB load  
• Improves response time  
• Typically uses Redis/Memcached`,

    queue: `• Enables async processing  
• Buffers high traffic spikes  
• Decouples services  
• Used for events & background jobs`,

    gateway: `• Entry point for all client requests  
• Handles routing & authentication  
• Rate limiting & monitoring  
• Security layer`,

    loadbalancer: `• Distributes traffic across services  
• Improves reliability & uptime  
• Prevents server overload  
• Enables horizontal scaling`,

    client: `• User-facing interface  
• Sends API requests  
• Displays processed data  
• Web or mobile application`,
  };

  return descriptions[type] ?? 'System component';
}
