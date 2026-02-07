import { SmoothStepEdge } from '@xyflow/react';
import { AnimatedEdge } from './animated-edge';
import { CustomEdge } from './custom-edge';
import { LabeledEdge } from './labeled-edge';

export { AnimatedEdge } from './animated-edge';
export { CustomEdge } from './custom-edge';
export { LabeledEdge } from './labeled-edge';

export const edgeTypes = {
  default: SmoothStepEdge,
  smoothstep: SmoothStepEdge,
  animated: AnimatedEdge,
  custom: CustomEdge,
  labeled: LabeledEdge,
};