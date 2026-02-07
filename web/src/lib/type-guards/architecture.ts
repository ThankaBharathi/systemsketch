import type { ArchitectureFlowData, NodeType } from '@/types/architecture';

const VALID_NODE_TYPES: NodeType[] = [
  'service', 'database', 'cache', 'queue', 'gateway', 'loadbalancer', 'client',
];

export function isArchitectureFlowData(data: unknown): data is ArchitectureFlowData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.name === 'string' &&
    typeof d.type === 'string' &&
    VALID_NODE_TYPES.includes(d.type as NodeType)
  );
}