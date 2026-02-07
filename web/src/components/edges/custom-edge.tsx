// components/edges/custom-edge.tsx
'use client';

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type Edge,
  type EdgeProps,
} from '@xyflow/react';

// Edge data interface (only for the data property)
export interface CustomEdgeData extends Record<string, unknown> {
  label?: string;
  type?: 'sync' | 'async' | 'bidirectional';
  color?: string;
}

const EDGE_STYLES: Record<string, { stroke: string; strokeWidth: number; strokeDasharray: string }> = {
  sync: {
    stroke: '#6366f1',
    strokeWidth: 2,
    strokeDasharray: 'none',
  },
  async: {
    stroke: '#f59e0b',
    strokeWidth: 2,
    strokeDasharray: '8,4',
  },
  bidirectional: {
    stroke: '#8b5cf6',
    strokeWidth: 2,
    strokeDasharray: 'none',
  },
};

export function CustomEdge({
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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Safely access data properties
  const edgeData = data as CustomEdgeData | undefined;
  const edgeType = edgeData?.type ?? 'sync';
  const edgeStyle = EDGE_STYLES[edgeType] ?? EDGE_STYLES.sync;
  const customColor = edgeData?.color;
  const label = edgeData?.label;

  return (
    <>
      {/* Edge Path */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...edgeStyle,
          stroke: customColor ?? edgeStyle.stroke,
          ...(typeof style === 'object' ? style : {}),
        }}
      />

      {/* Edge Label */}
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700 font-medium shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}