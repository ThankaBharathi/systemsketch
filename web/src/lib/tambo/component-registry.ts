// lib/tambo/component-registry.ts
// Register all components that Tambo can render

import type { ComponentType } from 'react';

// Import node components
import { BaseNode } from '@/components/nodes/base-node';

// =============================================================================
// COMPONENT DEFINITIONS
// =============================================================================

export interface TamboComponentDefinition {
  name: string;
  description: string;
  component: ComponentType<any>;
  propsDefinition: Record<string, {
    type: string;
    description: string;
    required?: boolean;
    default?: unknown;
    enum?: string[];
  }>;
}

// =============================================================================
// ARCHITECTURE NODE COMPONENTS
// =============================================================================

export const architectureComponents: TamboComponentDefinition[] = [
  {
    name: 'ServiceBox',
    description: `
      A service or microservice component.
      Use for: User Service, Auth Service, Payment Service, Order Service, 
      Notification Service, Search Service, etc.
      Renders as a blue rounded box with icon.
    `,
    component: BaseNode,
    propsDefinition: {
      id: {
        type: 'string',
        description: 'Unique identifier for the node',
        required: true,
      },
      name: {
        type: 'string',
        description: 'Display name, e.g., "User Service"',
        required: true,
      },
      type: {
        type: 'string',
        description: 'Must be "service"',
        required: true,
        default: 'service',
      },
      description: {
        type: 'string',
        description: 'Brief description of what this service does',
      },
      status: {
        type: 'string',
        description: 'Health status of the service',
        enum: ['healthy', 'warning', 'error'],
        default: 'healthy',
      },
    },
  },

  {
    name: 'DatabaseNode',
    description: `
      A database component.
      Use for: PostgreSQL, MySQL, MongoDB, DynamoDB, Cassandra, etc.
      Renders as a green cylinder shape.
    `,
    component: BaseNode,
    propsDefinition: {
      id: {
        type: 'string',
        description: 'Unique identifier',
        required: true,
      },
      name: {
        type: 'string',
        description: 'Database name, e.g., "PostgreSQL", "MongoDB"',
        required: true,
      },
      type: {
        type: 'string',
        description: 'Must be "database"',
        required: true,
        default: 'database',
      },
      description: {
        type: 'string',
        description: 'What data is stored here',
      },
      status: {
        type: 'string',
        description: 'Health status of the database',
        enum: ['healthy', 'warning', 'error'],
        default: 'healthy',
      },
    },
  },

  {
    name: 'CacheNode',
    description: `
      A caching layer component.
      Use for: Redis, Memcached, CDN, Varnish.
      Use when user mentions: caching, performance, speed, reduce load.
      Renders as a red hexagon.
    `,
    component: BaseNode,
    propsDefinition: {
      id: {
        type: 'string',
        description: 'Unique identifier',
        required: true,
      },
      name: {
        type: 'string',
        description: 'Cache name, e.g., "Redis", "Memcached"',
        required: true,
      },
      type: {
        type: 'string',
        description: 'Must be "cache"',
        required: true,
        default: 'cache',
      },
      description: {
        type: 'string',
        description: 'What is being cached',
      },
      status: {
        type: 'string',
        description: 'Health status of the cache',
        enum: ['healthy', 'warning', 'error'],
        default: 'healthy',
      },
    },
  },

  {
    name: 'QueueNode',
    description: `
      A message queue component.
      Use for: Kafka, RabbitMQ, SQS, Redis Pub/Sub.
      Use when user mentions: async, events, decoupling, background jobs.
      Renders as a yellow parallelogram.
    `,
    component: BaseNode,
    propsDefinition: {
      id: {
        type: 'string',
        description: 'Unique identifier',
        required: true,
      },
      name: {
        type: 'string',
        description: 'Queue name, e.g., "Kafka", "RabbitMQ"',
        required: true,
      },
      type: {
        type: 'string',
        description: 'Must be "queue"',
        required: true,
        default: 'queue',
      },
      description: {
        type: 'string',
        description: 'What events/messages flow through',
      },
      status: {
        type: 'string',
        description: 'Health status of the queue',
        enum: ['healthy', 'warning', 'error'],
        default: 'healthy',
      },
    },
  },

  {
    name: 'LoadBalancerNode',
    description: `
      A load balancer component.
      Use for: NGINX, HAProxy, AWS ALB, Cloudflare.
      Use when user mentions: scaling, high availability, distribute traffic.
      Renders as a purple diamond.
    `,
    component: BaseNode,
    propsDefinition: {
      id: {
        type: 'string',
        description: 'Unique identifier',
        required: true,
      },
      name: {
        type: 'string',
        description: 'Load balancer name, e.g., "NGINX", "ALB"',
        required: true,
      },
      type: {
        type: 'string',
        description: 'Must be "loadbalancer"',
        required: true,
        default: 'loadbalancer',
      },
      description: {
        type: 'string',
        description: 'Load balancing strategy',
      },
      status: {
        type: 'string',
        description: 'Health status of the load balancer',
        enum: ['healthy', 'warning', 'error'],
        default: 'healthy',
      },
    },
  },

  {
    name: 'GatewayNode',
    description: `
      An API Gateway component.
      Use for: Kong, AWS API Gateway, Apigee, NGINX.
      Entry point for all API requests. Handles routing, auth, rate limiting.
      Renders as a purple box.
    `,
    component: BaseNode,
    propsDefinition: {
      id: {
        type: 'string',
        description: 'Unique identifier',
        required: true,
      },
      name: {
        type: 'string',
        description: 'Gateway name, e.g., "API Gateway", "Kong"',
        required: true,
      },
      type: {
        type: 'string',
        description: 'Must be "gateway"',
        required: true,
        default: 'gateway',
      },
      description: {
        type: 'string',
        description: 'Gateway features (auth, rate limit, etc.)',
      },
      status: {
        type: 'string',
        description: 'Health status of the gateway',
        enum: ['healthy', 'warning', 'error'],
        default: 'healthy',
      },
    },
  },

  {
    name: 'ClientNode',
    description: `
      A client application component.
      Use for: Web App, Mobile App, IoT Device, Desktop App.
      Renders as a cyan device icon.
    `,
    component: BaseNode,
    propsDefinition: {
      id: {
        type: 'string',
        description: 'Unique identifier',
        required: true,
      },
      name: {
        type: 'string',
        description: 'Client name, e.g., "Web App", "iOS App"',
        required: true,
      },
      type: {
        type: 'string',
        description: 'Must be "client"',
        required: true,
        default: 'client',
      },
      description: {
        type: 'string',
        description: 'Client details',
      },
      status: {
        type: 'string',
        description: 'Health status of the client',
        enum: ['healthy', 'warning', 'error'],
        default: 'healthy',
      },
    },
  },
];

// =============================================================================
// PANEL COMPONENTS
// =============================================================================

export const panelComponents: TamboComponentDefinition[] = [
  // Will be added when panel components are created
];

// =============================================================================
// GUIDANCE COMPONENTS (for edge cases)
// =============================================================================

export const guidanceComponents: TamboComponentDefinition[] = [
  // Will be added after guidance components are created
];

// =============================================================================
// COMBINED REGISTRY
// =============================================================================

export const componentRegistry = [
  ...architectureComponents,
  ...panelComponents,
  ...guidanceComponents,
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getComponentByName(name: string): TamboComponentDefinition | undefined {
  return componentRegistry.find((c) => c.name === name);
}

export function getComponentsByType(type: 'architecture' | 'panel' | 'guidance'): TamboComponentDefinition[] {
  switch (type) {
    case 'architecture':
      return architectureComponents;
    case 'panel':
      return panelComponents;
    case 'guidance':
      return guidanceComponents;
    default:
      return [];
  }
}