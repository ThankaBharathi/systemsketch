'use client';

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
   useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  BackgroundVariant,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/base.css';
import { useCallback, useMemo, useEffect, useRef} from 'react';

import { nodeTypes } from '@/components/nodes';
import { edgeTypes } from '@/components/edges';
import type { ArchitectureNodeData, ArchitectureConnection } from '@/types/architecture';
import { ConnectionLineType, ConnectionMode} from '@xyflow/react';

interface ArchitectureCanvasProps {
  initialNodes?: ArchitectureNodeData[];
  initialConnections?: ArchitectureConnection[];
  onNodeSelect?: (node: ArchitectureNodeData | null) => void;
}

function calculateNodePositions(nodes: ArchitectureNodeData[]): Node[] {
  const typeOrder: Record<string, number> = {
    client: 0,
    loadbalancer: 1,
    gateway: 1,
    service: 2,
    cache: 3,
    queue: 3,
    database: 3,
  };

  const tiers: Record<number, ArchitectureNodeData[]> = {};
  nodes.forEach((node) => {
    const tier = typeOrder[node.type] ?? 2;
    if (!tiers[tier]) tiers[tier] = [];
    tiers[tier].push(node);
  });

  const result: Node[] = [];
  const tierKeys = Object.keys(tiers).map(Number).sort();

  tierKeys.forEach((tier, tierIndex) => {
    const tierNodes = tiers[tier];
    const tierWidth = tierNodes.length * 220;
    const startX = (900 - tierWidth) / 2 + 100;

    tierNodes.forEach((node, nodeIndex) => {
      result.push({
        id: node.id,
        type: node.type,
        position: { x: startX + nodeIndex * 220, y: 80 + tierIndex * 160 },
        data: {
          name: node.name,
          type: node.type,
          description: node.description,
          status: node.status,
        },
      });
    });
  });

  return result;
}

// Stable latency based on connection id
function getStableLatency(connId: string): number {
  let hash = 0;
  for (let i = 0; i < connId.length; i++) {
    hash = ((hash << 5) - hash + connId.charCodeAt(i)) | 0;
  }
  return (Math.abs(hash) % 55) + 5;
}

export function ArchitectureCanvas({
  initialNodes = [],
  initialConnections = [],
  onNodeSelect,
}: ArchitectureCanvasProps) {
  const { fitView } = useReactFlow();
  const hasCenteredRef = useRef(false);

  const flowNodes = useMemo(() => calculateNodePositions(initialNodes), [initialNodes]);

  const flowEdges = useMemo<Edge[]>(() => {
    if (!Array.isArray(initialConnections)) return [];

    return initialConnections
      .filter((conn) => conn && conn.source && conn.target)
      .map((conn) => {
        const latency = getStableLatency(conn.id || `${conn.source}-${conn.target}`);
        const isHot = latency > 50;

        return {
          id: conn.id || `edge-${conn.source}-${conn.target}-${Math.random()}`,
          source: conn.source,
          target: conn.target,
          type: 'smoothstep',
          animated: true,
          label: `${conn.label || 'HTTP'} • ${latency}ms`,
          labelStyle: { fill: '#111827', fontWeight: 600, fontSize: 12 },
          labelBgStyle: { fill: '#ffffff', fillOpacity: 0.95 },
          labelBgPadding: [6, 3] as [number, number],
          labelBgBorderRadius: 6,
          style: {
            stroke: isHot ? '#ef4444' : '#6366f1',
            strokeWidth: isHot ? 3 : 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isHot ? '#ef4444' : '#6366f1',
          },
        };
      });
  }, [initialConnections]);

  const [nodes, setNodes, onNodesChangeHandler] = useNodesState<Node>(flowNodes);
  const [edges, setEdges, onEdgesChangeHandler] = useEdgesState<Edge>(flowEdges);

  useEffect(() => {
  setNodes(flowNodes);
}, [flowNodes]);


  useEffect(() => {
  setEdges(flowEdges);
}, [flowEdges]);


  // Auto center ONLY first time a design loads
useEffect(() => {
  if (nodes.length === 0) return;

  if (!hasCenteredRef.current) {
    hasCenteredRef.current = true;

    setTimeout(() => {
      fitView({
        padding: 0.25,
        duration: 500,
      });
    }, 150);
  }
}, [nodes, fitView]);

  // Reset centering when a new architecture is loaded
useEffect(() => {
  hasCenteredRef.current = false;
}, [initialNodes]);


  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => onNodesChangeHandler(changes),
    [onNodesChangeHandler]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => onEdgesChangeHandler(changes),
    [onEdgesChangeHandler]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        source: params.source ?? '',
        target: params.target ?? '',
        type: 'smoothstep',
        animated: true,
        label: '',
        style: { stroke: '#6366f1', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!onNodeSelect) return;
      const d = node.data as Record<string, unknown>;
      onNodeSelect({
        id: node.id,
        name: (d.name as string) ?? node.id,
        type: (d.type as ArchitectureNodeData['type']) ?? 'service',
        description: d.description as string | undefined,
        status: d.status as ArchitectureNodeData['status'],
      });
    },
    [onNodeSelect]
  );

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionMode={ConnectionMode.Loose}  // ⭐ ADD THIS
        connectOnClick={false}
        onNodeClick={onNodeClick}
        onPaneClick={() => onNodeSelect?.(null)}
        defaultViewport={{ x: 0, y: 0, zoom: 0.85 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={26} size={1.6} color="#cbd5e1" />
        <Controls className="!bg-slate-900 !border !border-slate-700 !shadow-xl !rounded-xl" />
        <MiniMap
          className="!bg-white !border !border-gray-200 !shadow-lg !rounded-xl"
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
            const type = (node.data as { type?: string })?.type;
            return type ? colors[type] ?? '#9ca3af' : '#9ca3af';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}