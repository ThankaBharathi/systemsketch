// Node types for architecture diagram
export type NodeType =
  | 'service'
  | 'database'
  | 'cache'
  | 'queue'
  | 'gateway'
  | 'loadbalancer'
  | 'client';

// Position on canvas
export interface Position {
  x: number;
  y: number;
}

// Architecture node data
export interface ArchitectureNodeData {
  id: string;
  type: NodeType;
  name: string;
  description?: string;
  status?: 'healthy' | 'warning' | 'error';
  metadata?: Record<string, unknown>;
}

// Connection between nodes
export interface ArchitectureConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}
export interface ArchitectureFlowData {
  name: string;
  type: NodeType;
  description?: string;
  status?: 'healthy' | 'warning' | 'error';
}

// Complete architecture state
export interface ArchitectureState {
  nodes: ArchitectureNodeData[];
  connections: ArchitectureConnection[];
}

// Node colors mapping
export const NODE_COLORS: Record<NodeType, { bg: string; border: string; text: string }> = {
  service: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700' },
  database: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700' },
  cache: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700' },
  queue: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700' },
  gateway: { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-700' },
  loadbalancer: { bg: 'bg-indigo-50', border: 'border-indigo-500', text: 'text-indigo-700' },
  client: { bg: 'bg-cyan-50', border: 'border-cyan-500', text: 'text-cyan-700' },
};

// Node icons mapping
export const NODE_ICONS: Record<NodeType, string> = {
  service: '📦',
  database: '🗄️',
  cache: '⚡',
  queue: '📨',
  gateway: '🚪',
  loadbalancer: '⚖️',
  client: '📱',
};