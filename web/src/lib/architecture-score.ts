import type { ArchitectureNodeData } from '@/types';

export function calculateArchitectureScore(nodes: ArchitectureNodeData[]) {
  let scalability = 40;
  let reliability = 40;
  let cost = 60;
  let latency = 60;

  nodes.forEach(node => {
    switch (node.type) {
      case 'loadbalancer':
        scalability += 15;
        reliability += 10;
        break;

      case 'cache':
        latency += 15;
        scalability += 10;
        break;

      case 'queue':
        reliability += 15;
        scalability += 10;
        break;

      case 'database':
        reliability += 10;
        cost -= 10;
        break;

      case 'gateway':
        reliability += 10;
        break;

      case 'service':
        scalability += 5;
        break;
    }
  });

  return {
    scalability: Math.min(scalability, 100),
    reliability: Math.min(reliability, 100),
    cost: Math.max(cost, 10),
    latency: Math.min(latency, 100),
  };
}
