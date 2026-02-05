import type { NodeType } from '@/types/architecture';

interface ParsedAction {
  type: 'add_node' | 'add_connection' | 'remove_node' | 'info' | 'unknown';
  nodeType?: NodeType;
  nodeName?: string;
  nodeDescription?: string;
  sourceNode?: string;
  targetNode?: string;
  connectionLabel?: string;
  message: string;
}

// Parse user message and determine what action to take
export function parseUserMessage(message: string): ParsedAction {
  const lower = message.toLowerCase().trim();

  // Add node patterns
  if (lower.includes('add') || lower.includes('create')) {
    // Service
    if (lower.includes('service') || lower.includes('api') || lower.includes('microservice')) {
      const name = extractName(message) || 'New Service';
      return {
        type: 'add_node',
        nodeType: 'service',
        nodeName: name,
        nodeDescription: 'API Service',
        message: `Adding service: ${name}`,
      };
    }

    // Database
    if (lower.includes('database') || lower.includes('db') || lower.includes('postgres') || lower.includes('mysql') || lower.includes('mongo')) {
      const name = extractName(message) || 'Database';
      return {
        type: 'add_node',
        nodeType: 'database',
        nodeName: name,
        nodeDescription: 'Data store',
        message: `Adding database: ${name}`,
      };
    }

    // Cache
    if (lower.includes('cache') || lower.includes('redis') || lower.includes('memcache')) {
      const name = extractName(message) || 'Redis Cache';
      return {
        type: 'add_node',
        nodeType: 'cache',
        nodeName: name,
        nodeDescription: 'In-memory cache',
        message: `Adding cache: ${name}`,
      };
    }

    // Queue
    if (lower.includes('queue') || lower.includes('kafka') || lower.includes('rabbitmq') || lower.includes('sqs')) {
      const name = extractName(message) || 'Message Queue';
      return {
        type: 'add_node',
        nodeType: 'queue',
        nodeName: name,
        nodeDescription: 'Message broker',
        message: `Adding queue: ${name}`,
      };
    }

    // Gateway
    if (lower.includes('gateway') || lower.includes('api gateway')) {
      const name = extractName(message) || 'API Gateway';
      return {
        type: 'add_node',
        nodeType: 'gateway',
        nodeName: name,
        nodeDescription: 'API Gateway',
        message: `Adding gateway: ${name}`,
      };
    }

    // Load balancer
    if (lower.includes('load balancer') || lower.includes('lb') || lower.includes('nginx')) {
      const name = extractName(message) || 'Load Balancer';
      return {
        type: 'add_node',
        nodeType: 'loadbalancer',
        nodeName: name,
        nodeDescription: 'Traffic distributor',
        message: `Adding load balancer: ${name}`,
      };
    }
  }

  // Design system patterns
  if (lower.includes('design twitter') || lower.includes('twitter')) {
    return {
      type: 'info',
      message: 'twitter',
    };
  }

  if (lower.includes('design url') || lower.includes('url shortener')) {
    return {
      type: 'info',
      message: 'url_shortener',
    };
  }

  if (lower.includes('design instagram') || lower.includes('instagram')) {
    return {
      type: 'info',
      message: 'instagram',
    };
  }

  if (lower.includes('design uber') || lower.includes('uber') || lower.includes('ride')) {
    return {
      type: 'info',
      message: 'uber',
    };
  }

  // Connection patterns
  if (lower.includes('connect')) {
    return {
      type: 'add_connection',
      message: 'I can help you connect components. Which nodes would you like to connect?',
    };
  }

  // Hello / greeting
  if (lower.includes('hello') || lower.includes('hi') || lower === 'hey') {
    return {
      type: 'info',
      message: 'greeting',
    };
  }

  // Unknown
  return {
    type: 'unknown',
    message: lower,
  };
}

// Extract name from message
function extractName(message: string): string | null {
  // Try to extract quoted name
  const quoted = message.match(/["']([^"']+)["']/);
  if (quoted) return quoted[1];

  // Try to extract name after "called" or "named"
  const named = message.match(/(?:called|named)\s+(\w+)/i);
  if (named) return named[1];

  return null;
}

// Get predefined architecture for known systems
export function getSystemArchitecture(system: string): {
  nodes: { type: NodeType; name: string; description: string }[];
  connections: { source: string; target: string; label?: string }[];
  description: string;
} | null {
  const systems: Record<string, ReturnType<typeof getSystemArchitecture>> = {
    twitter: {
      description: `🐦 **Twitter Architecture**

I'll add the core components for Twitter:`,
      nodes: [
        { type: 'client', name: 'Mobile/Web App', description: 'User interface' },
        { type: 'gateway', name: 'API Gateway', description: 'Request routing' },
        { type: 'service', name: 'User Service', description: 'Auth & profiles' },
        { type: 'service', name: 'Tweet Service', description: 'Create/read tweets' },
        { type: 'service', name: 'Timeline Service', description: 'Feed generation' },
        { type: 'database', name: 'PostgreSQL', description: 'User data' },
        { type: 'cache', name: 'Redis', description: 'Feed cache' },
        { type: 'queue', name: 'Kafka', description: 'Event streaming' },
      ],
      connections: [
        { source: 'Mobile/Web App', target: 'API Gateway' },
        { source: 'API Gateway', target: 'User Service' },
        { source: 'API Gateway', target: 'Tweet Service' },
        { source: 'API Gateway', target: 'Timeline Service' },
        { source: 'User Service', target: 'PostgreSQL' },
        { source: 'Tweet Service', target: 'PostgreSQL' },
        { source: 'Tweet Service', target: 'Kafka' },
        { source: 'Timeline Service', target: 'Redis' },
        { source: 'Kafka', target: 'Timeline Service' },
      ],
    },

    url_shortener: {
      description: `🔗 **URL Shortener Architecture**

Simple but scalable design:`,
      nodes: [
        { type: 'client', name: 'Web Client', description: 'User interface' },
        { type: 'loadbalancer', name: 'Load Balancer', description: 'Nginx' },
        { type: 'service', name: 'URL Service', description: 'Shorten & redirect' },
        { type: 'database', name: 'MySQL', description: 'URL mappings' },
        { type: 'cache', name: 'Redis', description: 'Hot URLs cache' },
      ],
      connections: [
        { source: 'Web Client', target: 'Load Balancer' },
        { source: 'Load Balancer', target: 'URL Service' },
        { source: 'URL Service', target: 'Redis', label: 'cache lookup' },
        { source: 'URL Service', target: 'MySQL', label: 'store/retrieve' },
      ],
    },

    instagram: {
      description: `📸 **Instagram Architecture**

Photo-focused social platform:`,
      nodes: [
        { type: 'client', name: 'Mobile App', description: 'iOS/Android' },
        { type: 'gateway', name: 'API Gateway', description: 'Request handler' },
        { type: 'service', name: 'User Service', description: 'Profiles & auth' },
        { type: 'service', name: 'Photo Service', description: 'Upload & process' },
        { type: 'service', name: 'Feed Service', description: 'Home feed' },
        { type: 'database', name: 'PostgreSQL', description: 'Metadata' },
        { type: 'database', name: 'S3 Storage', description: 'Photo storage' },
        { type: 'cache', name: 'Redis', description: 'Feed cache' },
        { type: 'queue', name: 'RabbitMQ', description: 'Async processing' },
      ],
      connections: [
        { source: 'Mobile App', target: 'API Gateway' },
        { source: 'API Gateway', target: 'User Service' },
        { source: 'API Gateway', target: 'Photo Service' },
        { source: 'API Gateway', target: 'Feed Service' },
        { source: 'Photo Service', target: 'S3 Storage' },
        { source: 'Photo Service', target: 'RabbitMQ' },
        { source: 'Feed Service', target: 'Redis' },
      ],
    },

    uber: {
      description: `🚗 **Uber Architecture**

Real-time ride-sharing platform:`,
      nodes: [
        { type: 'client', name: 'Rider App', description: 'Request rides' },
        { type: 'client', name: 'Driver App', description: 'Accept rides' },
        { type: 'gateway', name: 'API Gateway', description: 'Route requests' },
        { type: 'service', name: 'User Service', description: 'Rider/driver profiles' },
        { type: 'service', name: 'Ride Service', description: 'Match & manage' },
        { type: 'service', name: 'Location Service', description: 'Real-time GPS' },
        { type: 'service', name: 'Payment Service', description: 'Transactions' },
        { type: 'database', name: 'PostgreSQL', description: 'User data' },
        { type: 'cache', name: 'Redis', description: 'Location cache' },
        { type: 'queue', name: 'Kafka', description: 'Events' },
      ],
      connections: [
        { source: 'Rider App', target: 'API Gateway' },
        { source: 'Driver App', target: 'API Gateway' },
        { source: 'API Gateway', target: 'User Service' },
        { source: 'API Gateway', target: 'Ride Service' },
        { source: 'Ride Service', target: 'Location Service' },
        { source: 'Ride Service', target: 'Payment Service' },
        { source: 'Location Service', target: 'Redis' },
        { source: 'Ride Service', target: 'Kafka' },
      ],
    },

    greeting: null,
  };

  return systems[system] || null;
}