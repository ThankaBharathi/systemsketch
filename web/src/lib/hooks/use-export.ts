// lib/hooks/use-export.ts
'use client';

import { useState, useCallback } from 'react';
import { toPng, toSvg } from 'html-to-image';
import type { ArchitectureNodeData, ArchitectureConnection } from '@/types';

interface UseExportOptions {
  nodes: ArchitectureNodeData[];
  connections: ArchitectureConnection[];
  designName: string;
  canvasElement: HTMLElement | null;
}

export function useExport({ nodes, connections, designName, canvasElement }: UseExportOptions) {
  const [isExporting, setIsExporting] = useState(false);

  const getCanvasElement = useCallback(() => {
    const selectors = [
      '.react-flow',
      '[data-testid="rf__wrapper"]',
      '#architecture-canvas .react-flow',
      '.react-flow__viewport',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) return element;
    }

    return canvasElement;
  }, [canvasElement]);

  const exportToPNG = useCallback(async (): Promise<boolean> => {
    const element = getCanvasElement();
    if (!element) {
      console.error('Canvas element not found');
      return false;
    }

    setIsExporting(true);
    try {
      const viewport = element.querySelector('.react-flow__viewport') as HTMLElement || element;
      
      const dataUrl = await toPng(viewport, {
        backgroundColor: '#f9fafb',
        quality: 1,
        pixelRatio: 2,
        filter: (node) => {
          if (node.classList?.contains('react-flow__controls')) return false;
          if (node.classList?.contains('react-flow__minimap')) return false;
          if (node.classList?.contains('react-flow__attribution')) return false;
          return true;
        },
      });

      const link = document.createElement('a');
      link.download = `${designName.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      return true;
    } catch (error) {
      console.error('Export PNG error:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  }, [designName, getCanvasElement]);

  const exportToSVG = useCallback(async (): Promise<boolean> => {
    const element = getCanvasElement();
    if (!element) return false;

    setIsExporting(true);
    try {
      const viewport = element.querySelector('.react-flow__viewport') as HTMLElement || element;
      
      const dataUrl = await toSvg(viewport, {
        backgroundColor: '#f9fafb',
        filter: (node) => {
          if (node.classList?.contains('react-flow__controls')) return false;
          if (node.classList?.contains('react-flow__minimap')) return false;
          if (node.classList?.contains('react-flow__attribution')) return false;
          return true;
        },
      });

      const link = document.createElement('a');
      link.download = `${designName.replace(/\s+/g, '-').toLowerCase()}.svg`;
      link.href = dataUrl;
      link.click();
      return true;
    } catch (error) {
      console.error('Export SVG error:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  }, [designName, getCanvasElement]);

  const exportToJSON = useCallback((): boolean => {
    try {
      const data = {
        name: designName,
        nodes,
        connections,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${designName.replace(/\s+/g, '-').toLowerCase()}.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Export JSON error:', error);
      return false;
    }
  }, [nodes, connections, designName]);

  const exportToMermaid = useCallback((): boolean => {
    try {
      let mermaid = 'graph TD\n';
      
      nodes.forEach((node) => {
        const shape = node.type === 'database' ? `[(${node.name})]` :
                     node.type === 'cache' ? `{{${node.name}}}` :
                     node.type === 'queue' ? `>/${node.name}/]` :
                     `[${node.name}]`;
        mermaid += `    ${node.id}${shape}\n`;
      });

      connections.forEach((conn) => {
        const label = conn.label ? `|${conn.label}|` : '';
        mermaid += `    ${conn.source} -->${label} ${conn.target}\n`;
      });

      const blob = new Blob([mermaid], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${designName.replace(/\s+/g, '-').toLowerCase()}.mmd`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Export Mermaid error:', error);
      return false;
    }
  }, [nodes, connections, designName]);

  const copyMermaid = useCallback(async (): Promise<boolean> => {
    try {
      let mermaid = 'graph TD\n';
      nodes.forEach((node) => {
        mermaid += `    ${node.id}[${node.name}]\n`;
      });
      connections.forEach((conn) => {
        mermaid += `    ${conn.source} --> ${conn.target}\n`;
      });
      await navigator.clipboard.writeText(mermaid);
      return true;
    } catch (error) {
      console.error('Copy Mermaid error:', error);
      return false;
    }
  }, [nodes, connections]);

  const copyJSON = useCallback(async (): Promise<boolean> => {
    try {
      const data = { name: designName, nodes, connections };
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Copy JSON error:', error);
      return false;
    }
  }, [nodes, connections, designName]);

  return {
    isExporting,
    exportToPNG,
    exportToSVG,
    exportToJSON,
    exportToMermaid,
    copyMermaid,
    copyJSON,
  };
}