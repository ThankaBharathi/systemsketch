import { generateArchitecture } from './architecture-generator';
import type { ArchitectureNodeData } from '@/types';

type Connection = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
};

export async function architectureAgent(
  userInput: string,
  currentNodes: ArchitectureNodeData[] = []
) {
  const text = userInput.toLowerCase();
  const result = await generateArchitecture(userInput, currentNodes);

  // ======================================
  // 🧹 DELETE ENGINE — REMOVE ONLY ONE NODE
  // ======================================
  if (text.includes('remove') || text.includes('delete')) {
    let updatedNodes = [...currentNodes];
    let removedNodeId: string | null = null;

    for (const node of currentNodes) {
      const nameMatch = text.includes(node.name.toLowerCase());
      const typeMatch = text.includes(node.type.toLowerCase());

      if (nameMatch || typeMatch) {
        removedNodeId = node.id;
        updatedNodes = currentNodes.filter(n => n.id !== node.id);
        break;
      }
    }

    // remove connections linked to removed node
    const cleanedConnections: Connection[] =
      (result.connections || []).filter(
        c => c.source !== removedNodeId && c.target !== removedNodeId
      );

    return {
      name: result.name || 'Updated Architecture',
      nodes: updatedNodes,
      connections: cleanedConnections,
      message: 'Removed one component safely.',
    };
  }

  // ======================================
  // 1️⃣ MERGE NODES (NO DUPLICATES)
  // ======================================
  const nodeMap = new Map<string, ArchitectureNodeData>();

  currentNodes.forEach(n => nodeMap.set(n.id, n));
  result.nodes.forEach((n, index) => {
  const safeId = `${n.id}-${index}-${Date.now()}`;
  nodeMap.set(safeId, { ...n, id: safeId });
});


  const mergedNodes = Array.from(nodeMap.values());

  // ======================================
  // 2️⃣ FIX MISSING CONNECTIONS
  // ======================================
  let mergedConnections: Connection[] = result.connections || [];

  if (!mergedConnections || mergedConnections.length === 0) {
    const services = mergedNodes.filter(n => n.type === 'service');
    const databases = mergedNodes.filter(n => n.type === 'database');
    const caches = mergedNodes.filter(n => n.type === 'cache');
    const gateways = mergedNodes.filter(n => n.type === 'gateway');

    const auto: Connection[] = [];

    services.forEach(svc => {
      databases.forEach(db => {
        auto.push({
          id: `edge-${svc.id}-${db.id}-${Date.now()}-${Math.random()}`,
          source: svc.id,
          target: db.id,
          animated: true,
        });
      });

      caches.forEach(cache => {
        auto.push({
          id: `${svc.id}-${cache.id}-${Math.random()}`,
          source: svc.id,
          target: cache.id,
          animated: true,
        });
      });
    });

    gateways.forEach(gw => {
      services.forEach(svc => {
        auto.push({
          id: `${gw.id}-${svc.id}-${Math.random()}`,
          source: gw.id,
          target: svc.id,
          animated: true,
        });
      });
    });

    mergedConnections = auto;
  }

  return {
    ...result,
    nodes: mergedNodes,
    connections: mergedConnections,
  };
}
