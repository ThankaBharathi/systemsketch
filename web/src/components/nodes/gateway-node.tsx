// components/nodes/gateway-node.tsx
'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Shield, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface GatewayData extends Record<string, unknown> {
  name: string;
  description?: string;
  status?: 'healthy' | 'warning' | 'error';
}

function GatewayNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as GatewayData;
  const name = nodeData.name ?? 'Gateway';
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
        relative px-4 py-3 min-w-[160px] max-w-[200px]
        bg-white border-2 border-purple-400 rounded-xl shadow-md
        transition-all duration-200
        hover:shadow-lg hover:border-purple-500
        ${selected ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
      `}
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white"
      />

      {/* Content */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-purple-100 rounded-lg shrink-0">
          <Shield size={20} className="text-purple-600" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-sm truncate">
            {name}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm border">
        <StatusIcon size={12} className={statusColors[status]} />
      </div>

      {/* Type Label */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-purple-500 text-white text-[10px] font-medium rounded-full">
        Gateway
      </div>

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white !bottom-[-6px]"
      />

      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white"
      />

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white"
      />
    </div>
  );
}

export const GatewayNode = memo(GatewayNodeComponent);