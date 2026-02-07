// lib/hooks/use-designs.ts
'use client';

import { useState, useCallback } from 'react';
import type { ArchitectureNodeData, ArchitectureConnection } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

export interface Design {
  id: string;
  name: string;
  description?: string;
  nodes: string;
  edges: string;
  thumbnail?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DesignListResponse {
  designs: Design[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UseDesignsReturn {
  designs: Design[];
  isLoading: boolean;
  error: string | null;
  fetchDesigns: () => Promise<void>;
  saveDesign: (data: SaveDesignData) => Promise<Design | null>;
  updateDesign: (id: string, data: Partial<SaveDesignData>) => Promise<Design | null>;
  deleteDesign: (id: string) => Promise<boolean>;
  loadDesign: (id: string) => Promise<LoadedDesign | null>;
}

export interface SaveDesignData {
  name: string;
  description?: string;
  nodes: ArchitectureNodeData[];
  connections: ArchitectureConnection[];
  thumbnail?: string;
  isPublic?: boolean;
}

export interface LoadedDesign {
  id: string;
  name: string;
  description?: string;
  nodes: ArchitectureNodeData[];
  connections: ArchitectureConnection[];
}

// =============================================================================
// HOOK
// =============================================================================

export function useDesigns(): UseDesignsReturn {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all designs
  const fetchDesigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/designs');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to fetch designs');
      }

      setDesigns(data.designs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error fetching designs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save new design
  const saveDesign = useCallback(async (data: SaveDesignData): Promise<Design | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          nodes: JSON.stringify(data.nodes),
          edges: JSON.stringify(data.connections),
          thumbnail: data.thumbnail,
          isPublic: data.isPublic ?? false,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Failed to save design');
      }

      // Add to local state
      setDesigns((prev) => [result.design, ...prev]);
      return result.design;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error saving design:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update existing design
  const updateDesign = useCallback(async (
    id: string,
    data: Partial<SaveDesignData>
  ): Promise<Design | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const updateData: Record<string, unknown> = {};
      if (data.name) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.nodes) updateData.nodes = JSON.stringify(data.nodes);
      if (data.connections) updateData.edges = JSON.stringify(data.connections);
      if (data.thumbnail) updateData.thumbnail = data.thumbnail;
      if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;

      const response = await fetch(`/api/designs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Failed to update design');
      }

      // Update local state
      setDesigns((prev) =>
        prev.map((d) => (d.id === id ? result.design : d))
      );
      return result.design;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error updating design:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete design
  const deleteDesign = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/designs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error ?? 'Failed to delete design');
      }

      // Remove from local state
      setDesigns((prev) => prev.filter((d) => d.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error deleting design:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load single design
  const loadDesign = useCallback(async (id: string): Promise<LoadedDesign | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/designs/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Failed to load design');
      }

      const design = result.design;
      return {
        id: design.id,
        name: design.name,
        description: design.description,
        nodes: JSON.parse(design.nodes),
        connections: JSON.parse(design.edges),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      console.error('Error loading design:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    designs,
    isLoading,
    error,
    fetchDesigns,
    saveDesign,
    updateDesign,
    deleteDesign,
    loadDesign,
  };
}