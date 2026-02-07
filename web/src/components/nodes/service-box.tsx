'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Settings, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface ServiceData extends Record<string, unknown> {
  name: string;
  description?: string;
  status?: 'healthy' | 'warning' | 'error';
}

function ServiceBoxComponent({ data, selected }: NodeProps) {
  const nodeData = data as ServiceData;
  const name = nodeData.name ?? 'Service';
  const description = nodeData.description;
  const status = nodeData.status ?? 'healthy';

  const statusConfig = {
    healthy: { icon: CheckCircle, color: 'text-green-500' },
    warning: { icon: AlertTriangle, color: 'text-yellow-500' },
    error: { icon: AlertCircle, color: 'text-red-500' },
  };

  const StatusIcon = statusConfig[status].icon;

  return (
    <div
      className={`
        relative min-w-[180px] px-4 py-3 rounded-2xl
        bg-white/70 backdrop-blur-xl
        border border-blue-300
        shadow-[0_12px_30px_rgba(0,0,0,0.1)]
        transition-all duration-300
        hover:shadow-[0_20px_45px_rgba(59,130,246,0.35)]
        hover:-translate-y-0.5
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white"
      />

      <div className="flex gap-3 items-start">
        <div className="p-2 rounded-xl bg-blue-100">
          <Settings size={18} className="text-blue-600" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-sm truncate">
            {name}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow">
        <StatusIcon size={12} className={statusConfig[status].color} />
      </div>

      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] rounded-full bg-blue-500 text-white">
        Service
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !bottom-[-6px]"
      />
    </div>
  );
}

export const ServiceBox = memo(ServiceBoxComponent);
