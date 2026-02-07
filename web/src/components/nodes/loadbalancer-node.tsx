// components/nodes/loadbalancer-node.tsx
'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Scale, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface LoadBalancerData extends Record<string, unknown> {
  name: string;
  description?: string;
  status?: 'healthy' | 'warning' | 'error';
}

function LoadBalancerNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as LoadBalancerData;
  const name = nodeData.name ?? 'Load Balancer';
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
        relative min-w-[120px]
        transition-all duration-200
        ${selected ? 'scale-105' : ''}
      `}
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white !-top-1"
      />

      {/* Diamond Shape */}
      <div className={`relative w-[100px] h-[100px] mx-auto ${selected ? 'drop-shadow-lg' : 'drop-shadow-md'}`}>
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-indigo-600 flex flex-col items-center justify-center border-2 border-indigo-700"
          style={{
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          }}
        >
          <Scale size={24} className="text-white mb-1" />
          <span className="text-white font-bold text-[10px] text-center px-2">
            {name}
          </span>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-[10px] text-gray-500 text-center mt-2 truncate">
          {description}
        </p>
      )}

      {/* Status Badge */}
      <div className="absolute top-2 right-0 p-1 bg-white rounded-full shadow-sm border">
        <StatusIcon size={12} className={statusColors[status]} />
      </div>

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white"
      />

      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white !top-1/2"
      />

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white !top-1/2"
      />
    </div>
  );
}

export const LoadBalancerNode = memo(LoadBalancerNodeComponent);