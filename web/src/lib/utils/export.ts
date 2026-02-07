// lib/utils/export.ts
// Export utilities for architecture diagrams

import type { ArchitectureNodeData, ArchitectureConnection } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

export type ExportFormat = 'png' | 'svg' | 'json' | 'mermaid';

export interface ExportOptions {
  filename?: string;
  scale?: number;
  backgroundColor?: string;
}

// =============================================================================
// PNG EXPORT (using html2canvas)
// =============================================================================

export async function exportToPNG(
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<Blob> {
  const { scale = 2, backgroundColor = '#f8fafc' } = options;

  // Dynamically import html2canvas
  const { default: html2canvas } = await import('html2canvas');

  const canvas = await html2canvas(element, {
    scale,
    backgroundColor,
    logging: false,
    useCORS: true,
    allowTaint: true,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      'image/png',
      1.0
    );
  });
}

// =============================================================================
// SVG EXPORT
// =============================================================================

export function exportToSVG(
  nodes: ArchitectureNodeData[],
  connections: ArchitectureConnection[],
  options: ExportOptions = {}
): string {
  const { backgroundColor = '#f8fafc' } = options;

  // Calculate bounds
  const padding = 60;
  const nodeWidth = 160;
  const nodeHeight = 80;

  // Simple grid layout for export
  const cols = 4;
  const positions = nodes.map((_, index) => ({
    x: padding + (index % cols) * (nodeWidth + 40),
    y: padding + Math.floor(index / cols) * (nodeHeight + 60),
  }));

  const width = Math.max(...positions.map((p) => p.x)) + nodeWidth + padding;
  const height = Math.max(...positions.map((p) => p.y)) + nodeHeight + padding;

  // Node colors
  const nodeColors: Record<string, { fill: string; stroke: string }> = {
    service: { fill: '#dbeafe', stroke: '#3b82f6' },
    database: { fill: '#dcfce7', stroke: '#22c55e' },
    cache: { fill: '#fee2e2', stroke: '#ef4444' },
    queue: { fill: '#fef3c7', stroke: '#f59e0b' },
    gateway: { fill: '#ede9fe', stroke: '#8b5cf6' },
    loadbalancer: { fill: '#e0e7ff', stroke: '#6366f1' },
    client: { fill: '#cffafe', stroke: '#06b6d4' },
  };

  // Build SVG
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="${backgroundColor}"/>
  
  <!-- Connections -->
  <g id="connections">`;

  // Add connections
  const nodePositionMap = new Map(nodes.map((n, i) => [n.id, positions[i]]));

  connections.forEach((conn) => {
    const sourcePos = nodePositionMap.get(conn.source);
    const targetPos = nodePositionMap.get(conn.target);

    if (sourcePos && targetPos) {
      const x1 = sourcePos.x + nodeWidth / 2;
      const y1 = sourcePos.y + nodeHeight;
      const x2 = targetPos.x + nodeWidth / 2;
      const y2 = targetPos.y;

      svg += `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
          stroke="#6366f1" stroke-width="2" marker-end="url(#arrowhead)" />`;

      if (conn.label) {
        const labelX = (x1 + x2) / 2;
        const labelY = (y1 + y2) / 2;
        svg += `
    <rect x="${labelX - 25}" y="${labelY - 10}" width="50" height="20" rx="4" fill="white" stroke="#e5e7eb" />
    <text x="${labelX}" y="${labelY + 4}" text-anchor="middle" font-size="10" fill="#374151">${conn.label}</text>`;
      }
    }
  });

  svg += `
  </g>
  
  <!-- Nodes -->
  <g id="nodes">`;

  // Add nodes
  nodes.forEach((node, index) => {
    const pos = positions[index];
    const colors = nodeColors[node.type] ?? { fill: '#f3f4f6', stroke: '#9ca3af' };

    svg += `
    <g transform="translate(${pos.x}, ${pos.y})">
      <rect width="${nodeWidth}" height="${nodeHeight}" rx="8" 
            fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="2" />
      <text x="${nodeWidth / 2}" y="30" text-anchor="middle" font-size="14" font-weight="600" fill="#1f2937">
        ${node.name}
      </text>
      <text x="${nodeWidth / 2}" y="50" text-anchor="middle" font-size="11" fill="#6b7280">
        ${node.type}
      </text>
    </g>`;
  });

  svg += `
  </g>
</svg>`;

  return svg;
}

// =============================================================================
// JSON EXPORT
// =============================================================================

export function exportToJSON(
  nodes: ArchitectureNodeData[],
  connections: ArchitectureConnection[],
  metadata?: { name?: string; description?: string }
): string {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    metadata: {
      name: metadata?.name ?? 'Untitled Design',
      description: metadata?.description ?? '',
      nodeCount: nodes.length,
      connectionCount: connections.length,
    },
    nodes,
    connections,
  };

  return JSON.stringify(data, null, 2);
}

// =============================================================================
// MERMAID EXPORT
// =============================================================================

export function exportToMermaid(
  nodes: ArchitectureNodeData[],
  connections: ArchitectureConnection[]
): string {
  let mermaid = 'graph TD\n';

  // Node shape mapping
  const getNodeShape = (type: string): [string, string] => {
    switch (type) {
      case 'database':
        return ['[(', ')]'];
      case 'cache':
        return ['{{', '}}'];
      case 'queue':
        return ['[/', '/]'];
      case 'loadbalancer':
        return ['{', '}'];
      case 'gateway':
        return ['([', '])'];
      case 'client':
        return ['((', '))'];
      default:
        return ['[', ']'];
    }
  };

  // Node style mapping
  const getNodeStyle = (type: string): string => {
    const styles: Record<string, string> = {
      service: 'fill:#dbeafe,stroke:#3b82f6',
      database: 'fill:#dcfce7,stroke:#22c55e',
      cache: 'fill:#fee2e2,stroke:#ef4444',
      queue: 'fill:#fef3c7,stroke:#f59e0b',
      gateway: 'fill:#ede9fe,stroke:#8b5cf6',
      loadbalancer: 'fill:#e0e7ff,stroke:#6366f1',
      client: 'fill:#cffafe,stroke:#06b6d4',
    };
    return styles[type] ?? 'fill:#f3f4f6,stroke:#9ca3af';
  };

  // Add nodes
  nodes.forEach((node) => {
    const [open, close] = getNodeShape(node.type);
    const safeId = node.id.replace(/-/g, '_');
    const safeName = node.name.replace(/"/g, "'");
    mermaid += `    ${safeId}${open}"${safeName}"${close}\n`;
  });

  mermaid += '\n';

  // Add connections
  connections.forEach((conn) => {
    const sourceId = conn.source.replace(/-/g, '_');
    const targetId = conn.target.replace(/-/g, '_');

    if (conn.label) {
      mermaid += `    ${sourceId} -->|${conn.label}| ${targetId}\n`;
    } else {
      mermaid += `    ${sourceId} --> ${targetId}\n`;
    }
  });

  mermaid += '\n';

  // Add styles
  mermaid += '    %% Styles\n';
  nodes.forEach((node) => {
    const safeId = node.id.replace(/-/g, '_');
    mermaid += `    style ${safeId} ${getNodeStyle(node.type)}\n`;
  });

  return mermaid;
}

// =============================================================================
// DOWNLOAD HELPER
// =============================================================================

export function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType: string
): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// =============================================================================
// COPY TO CLIPBOARD
// =============================================================================

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}