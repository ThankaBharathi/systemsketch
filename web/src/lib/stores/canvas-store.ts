// lib/stores/canvas-store.ts
// Canvas state management with Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Node, Edge, Connection } from '@xyflow/react';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';
import type { ArchitectureFlowData } from '@/types';

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface CanvasStore {
  // State
  nodes: Node<ArchitectureFlowData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  designName: string;
  designId: string | null;
  isDirty: boolean;

  // Node actions
  setNodes: (nodes: Node<ArchitectureFlowData>[]) => void;
  addNode: (node: Node<ArchitectureFlowData>) => void;
  removeNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Partial<ArchitectureFlowData>) => void;
  onNodesChange: (changes: NodeChange<Node<ArchitectureFlowData>>[]) => void;

  // Edge actions
  setEdges: (edges: Edge[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Selection
  selectNode: (nodeId: string | null) => void;
  getSelectedNode: () => Node<ArchitectureFlowData> | null;

  // Design actions
  setDesignName: (name: string) => void;
  setDesignId: (id: string | null) => void;
  clearCanvas: () => void;
  loadDesign: (design: {
    nodes: Node<ArchitectureFlowData>[];
    edges: Edge[];
    name: string;
    id: string;
  }) => void;
  markClean: () => void;
}

// =============================================================================
// STORE IMPLEMENTATION
// =============================================================================

export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set, get) => ({
      // Initial state
      nodes: [],
      edges: [],
      selectedNodeId: null,
      designName: 'Untitled Design',
      designId: null,
      isDirty: false,

      // ===== Node Actions =====
      setNodes: (nodes) => set({ nodes, isDirty: true }),

      addNode: (node) => {
        set((state) => ({
          nodes: [...state.nodes, node],
          isDirty: true,
        }));
      },

      removeNode: (nodeId) => {
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== nodeId),
          edges: state.edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          ),
          selectedNodeId:
            state.selectedNodeId === nodeId ? null : state.selectedNodeId,
          isDirty: true,
        }));
      },

      updateNodeData: (nodeId, data) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, ...data } }
              : node
          ),
          isDirty: true,
        }));
      },

      onNodesChange: (changes) => {
        set((state) => {
          const updatedNodes = applyNodeChanges(changes, state.nodes);
          return {
            nodes: updatedNodes as Node<ArchitectureFlowData>[],
            isDirty: true,
          };
        });
      },

      // ===== Edge Actions =====
      setEdges: (edges) => set({ edges, isDirty: true }),

      onEdgesChange: (changes) => {
        set((state) => ({
          edges: applyEdgeChanges(changes, state.edges),
          isDirty: true,
        }));
      },

      onConnect: (connection) => {
        set((state) => ({
          edges: addEdge(
            {
              ...connection,
              animated: true,
              style: { stroke: '#6366f1', strokeWidth: 2 },
            },
            state.edges
          ),
          isDirty: true,
        }));
      },

      // ===== Selection =====
      selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

      getSelectedNode: () => {
        const state = get();
        if (!state.selectedNodeId) return null;
        return state.nodes.find((n) => n.id === state.selectedNodeId) ?? null;
      },

      // ===== Design Actions =====
      setDesignName: (name) => set({ designName: name, isDirty: true }),

      setDesignId: (id) => set({ designId: id }),

      clearCanvas: () =>
        set({
          nodes: [],
          edges: [],
          selectedNodeId: null,
          designName: 'Untitled Design',
          designId: null,
          isDirty: false,
        }),

      loadDesign: (design) =>
        set({
          nodes: design.nodes,
          edges: design.edges,
          designName: design.name,
          designId: design.id,
          isDirty: false,
          selectedNodeId: null,
        }),

      markClean: () => set({ isDirty: false }),
    }),
    {
      name: 'systemsketch-canvas',
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        designName: state.designName,
        designId: state.designId,
      }),
    }
  )
);