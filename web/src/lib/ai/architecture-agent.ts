import { generateArchitecture } from './architecture-generator';
import type { ArchitectureNodeData, ArchitectureConnection } from '@/types';

export async function architectureAgent(
  userInput: string,
  currentNodes: ArchitectureNodeData[] = [],
  currentConnections: ArchitectureConnection[] = []  // 🔥 ADD THIS PARAMETER
) {
  const text = userInput.toLowerCase();

  // ======================================
  // 🧹 DELETE ENGINE — HANDLE BEFORE AI CALL
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

    const cleanedConnections = currentConnections.filter(
      c => c.source !== removedNodeId && c.target !== removedNodeId
    );

    return {
      name: 'Updated Architecture',
      nodes: updatedNodes,
      connections: cleanedConnections,
      message: removedNodeId 
        ? `Removed ${currentNodes.find(n => n.id === removedNodeId)?.name || 'component'}` 
        : 'No matching component found to remove',
    };
  }

  // ======================================
  // 🧠 CALL AI FOR DESIGN/ADD
  // ======================================
  const result = await generateArchitecture(userInput, currentNodes);

  // ======================================
  // 1️⃣ MERGE NODES (NO DUPLICATES)
  // ======================================
  const nodeMap = new Map<string, ArchitectureNodeData>();

  // Add existing nodes first
  currentNodes.forEach(n => nodeMap.set(n.id, n));

  // Add new nodes from AI (only if not duplicate)
  result.nodes.forEach(n => {
    if (!nodeMap.has(n.id)) {
      nodeMap.set(n.id, n);
    }
  });

  const mergedNodes = Array.from(nodeMap.values());

  // ======================================
  // 2️⃣ MERGE CONNECTIONS (FIXED!)
  // ======================================
  const connectionMap = new Map<string, ArchitectureConnection>();

  // 🔥 FIX: Keep EXISTING connections first
  currentConnections.forEach(conn => {
    const key = `${conn.source}-${conn.target}`;
    connectionMap.set(key, conn);
  });

  // Add NEW connections from AI
  (result.connections || []).forEach(conn => {
    const key = `${conn.source}-${conn.target}`;
    if (!connectionMap.has(key)) {
      connectionMap.set(key, conn);
    }
  });

  let mergedConnections = Array.from(connectionMap.values());
// ======================================
// 4️⃣ AUTO BUILD BASE CONNECTIONS (FIRST DESIGN FIX)
// ======================================
if (mergedConnections.length <= 1 && mergedNodes.length > 0) {
  const clients = mergedNodes.filter(n => n.type === 'client');
  const gateways = mergedNodes.filter(n => n.type === 'gateway');
  const lbs = mergedNodes.filter(n => n.type === 'loadbalancer');
  const services = mergedNodes.filter(n => n.type === 'service');
  const databases = mergedNodes.filter(n => n.type === 'database');

  const autoEdges: ArchitectureConnection[] = [];

  // Client → Gateway
  clients.forEach(c => {
    gateways.forEach(g => {
      autoEdges.push({
        id: `auto-${c.id}-${g.id}`,
        source: c.id,
        target: g.id,
        animated: true,
        label: 'HTTPS',
      });
    });
  });

  // Gateway → LB
  gateways.forEach(g => {
    lbs.forEach(lb => {
      autoEdges.push({
        id: `auto-${g.id}-${lb.id}`,
        source: g.id,
        target: lb.id,
        animated: true,
        label: 'HTTP',
      });
    });
  });

  // LB → Services
  lbs.forEach(lb => {
    services.forEach(s => {
      autoEdges.push({
        id: `auto-${lb.id}-${s.id}`,
        source: lb.id,
        target: s.id,
        animated: true,
        label: 'REST',
      });
    });
  });

  // Services → DB
  services.forEach(s => {
    databases.forEach(db => {
      autoEdges.push({
        id: `auto-${s.id}-${db.id}`,
        source: s.id,
        target: db.id,
        animated: true,
        label: 'SQL',
      });
    });
  });

  mergedConnections.push(...autoEdges);
}

  // ======================================
  // 3️⃣ AUTO CONNECT IF AI FORGOT
  // ======================================
  const newNodes = result.nodes.filter(n => !currentNodes.find(c => c.id === n.id));
  
  if (newNodes.length > 0) {
    const services = currentNodes.filter(n => n.type === 'service');
    
    newNodes.forEach(newNode => {
      const hasConnection = mergedConnections.some(
        c => c.source === newNode.id || c.target === newNode.id
      );

      if (!hasConnection) {
        // Auto-connect based on type
        if (newNode.type === 'database' || newNode.type === 'cache' || newNode.type === 'queue') {
          services.forEach(svc => {
            const connId = `auto-${svc.id}-${newNode.id}`;
            if (!connectionMap.has(`${svc.id}-${newNode.id}`)) {
              mergedConnections.push({
                id: connId,
                source: svc.id,
                target: newNode.id,
                animated: true,
                label: newNode.type === 'database' ? 'SQL' : 
                       newNode.type === 'cache' ? 'Redis' : 'Kafka',
              });
            }
          });
        }
      }
    });
  }

  return {
    name: result.name || 'Updated Architecture',
    nodes: mergedNodes,
    connections: mergedConnections,
    message: result.message || `Architecture updated with ${mergedNodes.length} components`,
  };
}