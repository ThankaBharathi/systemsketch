'use client';

import { memo, useMemo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { NODE_COLORS, NODE_ICONS } from '@/types/architecture';
import { isArchitectureFlowData } from '@/lib/type-guards/architecture';

function BaseNodeComponent({ id, data, selected }: NodeProps) {
  if (!isArchitectureFlowData(data)) {
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
        Invalid node data
      </div>
    );
  }

  const { name, type, description, status } = data;
  const colors = NODE_COLORS[type];
  const icon = NODE_ICONS[type];

  // Stable random values based on node id
  const metrics = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
    }
    return {
      cpu: Math.abs(hash % 60) + 10,
      rps: Math.abs((hash >> 8) % 3000) + 100,
    };
  }, [id]);

  const statusColor = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div
      className={cn(
        'relative min-w-[160px] rounded-2xl border p-4',
        'bg-white/70 backdrop-blur-xl',
        'shadow-[0_10px_30px_rgba(0,0,0,0.08)]',
        'hover:shadow-[0_20px_40px_rgba(99,102,241,0.25)]',
        'hover:-translate-y-0.5 transition-all duration-200',
        colors.border,
        selected && 'ring-2 ring-indigo-500 ring-offset-2'
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-white !border-2 !border-indigo-400"
      />

      <div className="flex gap-3 items-start">
        <div className="text-2xl drop-shadow">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={cn('font-semibold truncate', colors.text)}>{name}</h3>
            {status && (
              <span className={cn('h-2 w-2 rounded-full shadow-sm', statusColor[status])} />
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs text-gray-500 truncate">{description}</p>
          )}
          <p className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">{type}</p>
          <div className="text-[10px] text-gray-400 mt-1">
            CPU: {metrics.cpu}% • RPS: {metrics.rps}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-white !border-2 !border-indigo-400"
      />
    </div>
  );
}

export const BaseNode = memo(BaseNodeComponent);