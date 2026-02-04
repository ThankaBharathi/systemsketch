import type { ArchitectureFlowData } from '@/types/architecture';

export function isArchitectureFlowData(
  data: unknown
): data is ArchitectureFlowData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const record = data as Record<string, unknown>;

  return (
    typeof record.name === 'string' &&
    typeof record.type === 'string'
  );
}
