// components/nodes/queue-node.tsx
'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Mail, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface QueueData extends Record<string, unknown> {
  name: string;
  description?: string;
  status?: 'healthy' | 'warning' | 'error';
}

function QueueNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as QueueData;
  const name = nodeData.name ?? 'Queue';
  const description = nodeData.description;
  const status = nodeData.status ?? 'healthy';

  const statusColors = {
    healthy: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
  };

  const StatusIcon = status === 'healthy' ? CheckCircle : status === 'warning' ? AlertTriangle : AlertCircle;

  return (
    <div
      className={`
        relative min-w-[140px]
        transition-all duration-200
        ${selected ? 'scale-105' : ''}
      `}
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-white !-top-1"
      />

      {/* Parallelogram Shape */}
      <div className={`relative w-[150px] h-[70px] mx-auto ${selected ? 'drop-shadow-lg' : 'drop-shadow-md'}`}>
        <div
          className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 flex flex-col items-center justify-center border-2 border-amber-600"
          style={{
            clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)',
          }}
        >
          <Mail size={20} className="text-white mb-1" />
          <span className="text-white font-bold text-xs">{name}</span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-[10px] text-gray-500 text-center mt-2">
          {description}
        </p>
      )}

      {/* Status Badge */}
      <div className="absolute top-0 right-2 p-1 bg-white rounded-full shadow-sm border">
        <StatusIcon size={12} className={statusColors[status]} />
      </div>

      {/* Type Label */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-medium rounded-full">
        Queue
      </div>

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-white"
      />

      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-white !top-1/2"
      />

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-white !top-1/2"
      />
    </div>
  );
}

export const QueueNode = memo(QueueNodeComponent);