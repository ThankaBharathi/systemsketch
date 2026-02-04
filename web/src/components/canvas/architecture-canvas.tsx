'use client';

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useMemo, useEffect } from 'react';

import { BaseNode } from '@/components/nodes/base-node';
import type {
  ArchitectureNodeData,
  ArchitectureConnection,
} from '@/types/architecture';

const nodeTypes: NodeTypes = {
  architectureNode: BaseNode,
};

interface ArchitectureCanvasProps {
  initialNodes?: ArchitectureNodeData[];
  initialConnections?: ArchitectureConnection[];
  onNodeSelect?: (node: ArchitectureNodeData | null) => void;
}

type CanvasNodeData = {
  type?: string;
};

export function ArchitectureCanvas({
  initialNodes = [],
  initialConnections = [],
  onNodeSelect,
}: ArchitectureCanvasProps) {
  /**
   * Convert architecture nodes → React Flow nodes
   */
  const flowNodes = useMemo<Node[]>(() => {
    return initialNodes.map((node, index) => ({
      id: node.id,
      type: 'architectureNode',
      position: {
        x: 120 + (index % 3) * 260,
        y: 120 + Math.floor(index / 3) * 160,
      },
      data: {
        name: node.name,
        type: node.type,
        description: node.description,
        status: node.status,
      },
    }));
  }, [initialNodes]);

  /**
   * Convert architecture connections → React Flow edges
   */
  const flowEdges = useMemo<Edge[]>(() => {
    return initialConnections.map((conn) => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      label: conn.label,
      animated: conn.animated ?? true,
      style: { stroke: '#6366f1', strokeWidth: 2 },
      labelStyle: { fill: '#374151', fontWeight: 500 },
      labelBgStyle: { fill: '#ffffff', fillOpacity: 0.85 },
    }));
  }, [initialConnections]);

  /**
   * 🚨 IMPORTANT: initialize EMPTY
   */
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    useEffect(() => {
      setNodes(flowNodes);
    }, [flowNodes, setNodes]);

    useEffect(() => {
      setEdges(flowEdges);
    }, [flowEdges, setEdges]);

    const onConnect = useCallback(
      (params: Connection) => {
        setEdges((eds) =>
          addEdge(
            {
              ...params,
              animated: true,
              style: { stroke: '#6366f1', strokeWidth: 2 },
            } as Edge,
            eds
          )
        );
      },
      [setEdges]
  );


  /**
   * Node click → sidebar info
   */
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!onNodeSelect) return;

      onNodeSelect({
        id: node.id,
        ...(node.data as Omit<ArchitectureNodeData, 'id'>),
      });
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect?.(null);
  }, [onNodeSelect]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls className="!bg-white !border !border-gray-200 !shadow-lg" />
        <MiniMap
          className="!bg-white !border !border-gray-200 !shadow-lg"
          nodeColor={(node) => {
          const colors: Record<string, string> = {
            service: '#3b82f6',
            database: '#22c55e',
            cache: '#ef4444',
            queue: '#f59e0b',
            gateway: '#8b5cf6',
            loadbalancer: '#6366f1',
            client: '#06b6d4',
          };

          const type = (node.data as CanvasNodeData)?.type;
          return type ? colors[type] : '#9ca3af';
        }}
        />
      </ReactFlow>
    </div>
  );
}
