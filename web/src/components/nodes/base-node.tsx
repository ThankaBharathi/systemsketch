'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

import { cn } from '@/lib/utils';
import { NODE_COLORS, NODE_ICONS } from '@/types/architecture';
import { isArchitectureFlowData } from '@/lib/type-guards/architecture';

function BaseNodeComponent({ data, selected }: NodeProps) {
  if (!isArchitectureFlowData(data)) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
        Invalid node data
      </div>
    );
  }

  const { name, type, description, status } = data;
  const colors = NODE_COLORS[type];
  const icon = NODE_ICONS[type];

  const statusColor = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  return (
    <div
      className={cn(
        'min-w-[150px] rounded-lg border-2 p-3 shadow-md transition-all relative',
        colors.bg,
        colors.border,
        selected && 'ring-2 ring-blue-500 ring-offset-2'
      )}
    >
      {/* 🔵 INPUT HANDLE */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !bg-white !border-2 !border-gray-400"
      />

      {/* CONTENT */}
      <div className="flex items-start gap-2">
        <span className="text-2xl">{icon}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={cn('font-semibold truncate', colors.text)}>
              {name}
            </h3>

            {status && (
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  statusColor[status]
                )}
              />
            )}
          </div>

          {description && (
            <p className="mt-1 text-xs text-gray-500 truncate">
              {description}
            </p>
          )}

          <p className="mt-1 text-xs text-gray-400 capitalize">
            {type}
          </p>
        </div>
      </div>

      {/* 🟢 OUTPUT HANDLE */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !bg-white !border-2 !border-gray-400"
      />
    </div>
  );
}

export const BaseNode = memo(BaseNodeComponent);
