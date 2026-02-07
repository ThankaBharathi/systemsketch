// components/nodes/client-node.tsx
'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Smartphone, Monitor, Tablet, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface ClientData extends Record<string, unknown> {
  name: string;
  description?: string;
  status?: 'healthy' | 'warning' | 'error';
}

function ClientNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as ClientData;
  const name = nodeData.name ?? 'Client';
  const description = nodeData.description;
  const status = nodeData.status ?? 'healthy';

  const statusColors = {
    healthy: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
  };

  const StatusIcon = status === 'healthy' ? CheckCircle : status === 'warning' ? AlertTriangle : AlertCircle;

  // Determine client icon based on name
  const getClientIcon = () => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('mobile') || lowerName.includes('ios') || lowerName.includes('android')) {
      return Smartphone;
    }
    if (lowerName.includes('tablet') || lowerName.includes('ipad')) {
      return Tablet;
    }
    return Monitor;
  };

  const ClientIcon = getClientIcon();

  return (
    <div
      className={`
        relative px-4 py-3 min-w-[140px] max-w-[180px]
        bg-white border-2 border-cyan-400 rounded-xl shadow-md
        transition-all duration-200
        hover:shadow-lg hover:border-cyan-500
        ${selected ? 'ring-2 ring-cyan-500 ring-offset-2' : ''}
      `}
    >
      {/* Content */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-cyan-100 rounded-lg shrink-0">
          <ClientIcon size={24} className="text-cyan-600" />
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
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-cyan-500 text-white text-[10px] font-medium rounded-full">
        Client
      </div>

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-white !bottom-[-6px]"
      />

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-white"
      />
    </div>
  );
}

export const ClientNode = memo(ClientNodeComponent);