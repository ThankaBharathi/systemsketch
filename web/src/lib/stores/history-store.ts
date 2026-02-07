// lib/stores/history-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { ArchitectureNodeData, ArchitectureConnection } from '@/types';

export interface HistoryItem {
  id: string;
  name: string;
  nodes: ArchitectureNodeData[];
  edges: ArchitectureConnection[];
  createdAt: string;
  updatedAt: string;
}

interface HistoryStore {
  items: HistoryItem[];
  addItem: (item: Omit<HistoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<HistoryItem>) => void;
  removeItem: (id: string) => void;
  getItem: (id: string) => HistoryItem | undefined;
  clearAll: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const now = new Date().toISOString();
        const newItem: HistoryItem = {
          id: nanoid(),
          ...item,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          items: [newItem, ...state.items].slice(0, 50),
        }));
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, ...updates, updatedAt: new Date().toISOString() }
              : item
          ),
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      getItem: (id) => {
        return get().items.find((item) => item.id === id);
      },

      clearAll: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'systemsketch-history',
    }
  )
);