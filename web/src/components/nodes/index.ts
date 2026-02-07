import { BaseNode } from './base-node';
import { ServiceBox } from './service-box';
import { DatabaseNode } from './database-node';
import { CacheNode } from './cache-node';
import { QueueNode } from './queue-node';
import { GatewayNode } from './gateway-node';
import { LoadBalancerNode } from './loadbalancer-node';
import { ClientNode } from './client-node';

export { BaseNode } from './base-node';
export { ServiceBox } from './service-box';
export { DatabaseNode } from './database-node';
export { CacheNode } from './cache-node';
export { QueueNode } from './queue-node';
export { GatewayNode } from './gateway-node';
export { LoadBalancerNode } from './loadbalancer-node';
export { ClientNode } from './client-node';

export const nodeTypes = {
  service: ServiceBox,
  database: DatabaseNode,
  cache: CacheNode,
  queue: QueueNode,
  gateway: GatewayNode,
  loadbalancer: LoadBalancerNode,
  client: ClientNode,
  architectureNode: BaseNode,
};