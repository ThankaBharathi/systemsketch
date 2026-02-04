import { create } from 'zustand';
import { nanoid } from 'nanoid';

import type {
  ArchitectureNodeData,
  ArchitectureConnection,
  NodeType,
} from '@/types/architecture';

interface ArchitectureStore {
  // State
  nodes: ArchitectureNodeData[];
  connections: ArchitectureConnection[];
  selectedNodeId: string | null;

  // Actions
  addNode: (type: NodeType, name: string, description?: string) => string;
  removeNode: (id: string) => void;
  updateNode: (id: string, data: Partial<ArchitectureNodeData>) => void;
  selectNode: (id: string | null) => void;

  addConnection: (source: string, target: string, label?: string) => string;
  removeConnection: (id: string) => void;

  // Bulk operations
  setNodes: (nodes: ArchitectureNodeData[]) => void;
  setConnections: (connections: ArchitectureConnection[]) => void;
  clearAll: () => void;

  // Get selected node
  getSelectedNode: () => ArchitectureNodeData | null;
}

export const useArchitectureStore = create<ArchitectureStore>((set, get) => ({
  // Initial state
  nodes: [],
  connections: [],
  selectedNodeId: null,

  // Add a new node
  addNode: (type, name, description) => {
    const id = nanoid();
    const newNode: ArchitectureNodeData = {
      id,
      type,
      name,
      description,
      status: 'healthy',
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));

    return id;
  },

  // Remove a node
  removeNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      connections: state.connections.filter(
        (c) => c.source !== id && c.target !== id
      ),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  // Update a node
  updateNode: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, ...data } : n
      ),
    }));
  },

  // Select a node
  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  // Add a connection
  addConnection: (source, target, label) => {
    const id = nanoid();
    const newConnection: ArchitectureConnection = {
      id,
      source,
      target,
      label,
      animated: true,
    };

    set((state) => ({
      connections: [...state.connections, newConnection],
    }));

    return id;
  },

  // Remove a connection
  removeConnection: (id) => {
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id),
    }));
  },

  // Set all nodes
  setNodes: (nodes) => {
    set({ nodes });
  },

  // Set all connections
  setConnections: (connections) => {
    set({ connections });
  },

  // Clear all
  clearAll: () => {
    set({ nodes: [], connections: [], selectedNodeId: null });
  },

  // Get selected node
  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get();
    return nodes.find((n) => n.id === selectedNodeId) || null;
  },
}));