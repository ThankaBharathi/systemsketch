// components/canvas/bottleneck-overlay.tsx
'use client';

import { motion } from 'framer-motion';
import type { ArchitectureNodeData } from '@/types/architecture';

interface BottleneckOverlayProps {
  nodes: ArchitectureNodeData[];
  isVisible: boolean;
  onClose: () => void;
}

export function BottleneckOverlay({ nodes, isVisible, onClose }: BottleneckOverlayProps) {
  if (!isVisible) return null;

  // Simulate bottleneck analysis
  const analyzedNodes = nodes.map((node) => {
    let risk: 'low' | 'medium' | 'high' = 'low';
    let reason = '';

    if (node.type === 'database') {
      risk = 'high';
      reason = 'Single point of failure - consider read replicas';
    } else if (node.type === 'service' && node.name.toLowerCase().includes('api')) {
      risk = 'medium';
      reason = 'May need horizontal scaling under load';
    } else if (node.type === 'cache') {
      risk = 'low';
      reason = 'Good for reducing database load';
    }

    return { ...node, risk, reason };
  });

  const highRiskCount = analyzedNodes.filter((n) => n.risk === 'high').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-8"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              🔥 Bottleneck Analysis
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {highRiskCount} high-risk component{highRiskCount !== 1 ? 's' : ''} found
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {analyzedNodes.map((node) => (
              <div
                key={node.id}
                className={`p-4 rounded-xl border-2 ${
                  node.risk === 'high'
                    ? 'border-red-300 bg-red-50'
                    : node.risk === 'medium'
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-green-300 bg-green-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {node.type === 'database' ? '🗄️' :
                       node.type === 'cache' ? '⚡' :
                       node.type === 'service' ? '⚙️' :
                       node.type === 'queue' ? '📨' :
                       node.type === 'gateway' ? '🚪' :
                       node.type === 'loadbalancer' ? '⚖️' : '📱'}
                    </span>
                    <span className="font-semibold text-gray-900">{node.name}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    node.risk === 'high'
                      ? 'bg-red-200 text-red-800'
                      : node.risk === 'medium'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-green-200 text-green-800'
                  }`}>
                    {node.risk.toUpperCase()} RISK
                  </span>
                </div>
                <p className="text-sm text-gray-600">{node.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition"
          >
            Got it, thanks!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}