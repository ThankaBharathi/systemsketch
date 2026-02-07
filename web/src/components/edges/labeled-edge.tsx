// components/edges/labeled-edge.tsx
'use client';

import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';
import { X } from 'lucide-react';

// Edge data interface (only for the data property)
export interface LabeledEdgeData extends Record<string, unknown> {
  label?: string;
  description?: string;
  protocol?: string;
  deletable?: boolean;
  onDelete?: () => void;
}

export function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 10,
  });

  // Safely access data properties
  const edgeData = data as LabeledEdgeData | undefined;
  const label = edgeData?.label;
  const description = edgeData?.description;
  const protocol = edgeData?.protocol;
  const deletable = edgeData?.deletable;
  const onDelete = edgeData?.onDelete;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <>
      {/* Edge Path */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: '#6366f1',
          strokeWidth: 2,
          ...(typeof style === 'object' ? style : {}),
        }}
      />

      {/* Enhanced Label */}
      {(label || protocol) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="group"
          >
            <div className="relative bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 hover:shadow-lg transition-shadow">
              {/* Protocol badge */}
              {protocol && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  {protocol}
                </span>
              )}

              {/* Label */}
              {label && (
                <p className="text-sm font-medium text-gray-800">{label}</p>
              )}

              {/* Description */}
              {description && (
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
              )}

              {/* Delete button */}
              {deletable && (
                <button
                  onClick={handleDelete}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}