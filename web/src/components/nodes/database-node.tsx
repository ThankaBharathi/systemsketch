// components/nodes/database-node.tsx
'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Database, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface DatabaseData extends Record<string, unknown> {
  name: string;
  description?: string;
  status?: 'healthy' | 'warning' | 'error';
}

function DatabaseNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as DatabaseData;
  const name = nodeData.name ?? 'Database';
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
        relative min-w-[140px] max-w-[180px]
        transition-all duration-200
        ${selected ? 'scale-105' : ''}
      `}
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-white !-top-1"
      />

      {/* Cylinder Shape */}
      <div className="relative">
        {/* Top Ellipse */}
        <div 
          className={`
            w-full h-5 bg-green-500 rounded-[50%] border-2 border-green-600
            ${selected ? 'ring-2 ring-green-400 ring-offset-1' : ''}
          `}
        />
        
        {/* Body */}
        <div 
          className="w-full h-16 bg-gradient-to-b from-green-400 to-green-500 border-x-2 border-green-600 -mt-2.5 flex flex-col items-center justify-center"
        >
          <Database size={20} className="text-white mb-1" />
          <span className="text-white font-semibold text-xs truncate max-w-[90%]">
            {name}
          </span>
        </div>
        
        {/* Bottom Ellipse */}
        <div className="w-full h-5 bg-green-600 rounded-[50%] border-2 border-green-700 -mt-2.5" />
      </div>

      {/* Description */}
      {description && (
        <p className="text-[10px] text-gray-500 text-center mt-2 truncate">
          {description}
        </p>
      )}

      {/* Status Badge */}
      <div className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-sm border">
        <StatusIcon size={12} className={statusColors[status]} />
      </div>

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-white"
      />

      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-white !top-1/2"
      />

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-white !top-1/2"
      />
    </div>
  );
}

export const DatabaseNode = memo(DatabaseNodeComponent);