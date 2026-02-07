// types/canvas.ts
// Canvas-specific types for React Flow integration

import type { Node, Edge } from '@xyflow/react';
import type { NodeType, ArchitectureFlowData } from './architecture';

// =============================================================================
// REACT FLOW TYPES
// =============================================================================

// React Flow node with our data
export type FlowNode = Node<ArchitectureFlowData>;

// React Flow edge
export type FlowEdge = Edge;

// =============================================================================
// CANVAS STATE
// =============================================================================

export interface CanvasState {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string | null;
  designName: string;
  designId: string | null;
  isDirty: boolean;
}

// =============================================================================
// NODE TEMPLATES
// =============================================================================

export interface NodeTemplate {
  type: NodeType;
  label: string;
  icon: string;
}

export const NODE_TEMPLATES: NodeTemplate[] = [
  { type: 'service', label: 'Service', icon: '📦' },
  { type: 'database', label: 'Database', icon: '🗄️' },
  { type: 'cache', label: 'Cache', icon: '⚡' },
  { type: 'queue', label: 'Queue', icon: '📨' },
  { type: 'gateway', label: 'API Gateway', icon: '🚪' },
  { type: 'loadbalancer', label: 'Load Balancer', icon: '⚖️' },
  { type: 'client', label: 'Client', icon: '📱' },
];

// =============================================================================
// MINIMAP COLORS
// =============================================================================

export const MINIMAP_COLORS: Record<string, string> = {
  service: '#3b82f6',
  database: '#22c55e',
  cache: '#ef4444',
  queue: '#f59e0b',
  gateway: '#8b5cf6',
  loadbalancer: '#6366f1',
  client: '#06b6d4',
};