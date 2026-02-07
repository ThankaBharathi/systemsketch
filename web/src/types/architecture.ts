export type NodeType =
  | 'service'
  | 'database'
  | 'cache'
  | 'queue'
  | 'gateway'
  | 'loadbalancer'
  | 'client';

export type NodeStatus = 'healthy' | 'warning' | 'error';
export type BottleneckSeverity = 'high' | 'medium' | 'low';
export type MessageIntent = 'design' | 'add' | 'analyze' | 'question' | 'greeting' | 'unknown';

export interface Position {
  x: number;
  y: number;
}

export interface ArchitectureNodeData {
  id: string;
  type: NodeType;
  name: string;
  description?: string;
  status?: NodeStatus;
  metadata?: Record<string, unknown>;
}

export interface ArchitectureNodeWithPosition extends ArchitectureNodeData {
  position: Position;
}

export interface ArchitectureConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface ArchitectureState {
  nodes: ArchitectureNodeData[];
  connections: ArchitectureConnection[];
}

export interface ArchitectureFlowData {
  name: string;
  type: NodeType;
  description?: string;
  status?: NodeStatus;
  icon?: string;
  [key: string]: unknown;
}

export interface AIArchitectureResponse {
  name: string;
  description: string;
  nodes: ArchitectureNodeData[];
  connections: ArchitectureConnection[];
  insights?: ArchitectureInsights;
  isAddition?: boolean;
  message?: string;
}

export interface ArchitectureInsights {
  bottlenecks?: string[];
  tradeoffs?: string[];
  scalingTips?: string[];
}

export interface BottleneckInfo {
  nodeId: string;
  issue: string;
  severity: BottleneckSeverity;
  solution: string;
}

export const NODE_COLORS: Record<NodeType, { bg: string; border: string; text: string }> = {
  service: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700' },
  database: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700' },
  cache: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700' },
  queue: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700' },
  gateway: { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-700' },
  loadbalancer: { bg: 'bg-indigo-50', border: 'border-indigo-500', text: 'text-indigo-700' },
  client: { bg: 'bg-cyan-50', border: 'border-cyan-500', text: 'text-cyan-700' },
};

export const NODE_ICONS: Record<NodeType, string> = {
  service: '📦',
  database: '🗄️',
  cache: '⚡',
  queue: '📨',
  gateway: '🚪',
  loadbalancer: '⚖️',
  client: '📱',
};