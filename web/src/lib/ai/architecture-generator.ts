// lib/ai/architecture-generator.ts

import type { ArchitectureNodeData, ArchitectureConnection, NodeType } from '@/types/architecture';
import { ARCHITECTURE_SYSTEM_PROMPT, MODIFICATION_PROMPT } from './prompts';

// Types for AI response
export interface GeneratedArchitecture {
  name: string;
  description: string;
  nodes: GeneratedNode[];
  connections: GeneratedConnection[];
  insights?: {
    bottlenecks?: string[];
    tradeoffs?: string[];
    scalingTips?: string[];
  };
  isAddition?: boolean;
  message?: string;
}

interface GeneratedNode {
  id: string;
  type: NodeType;
  name: string;
  description?: string;
  position: { x: number; y: number };
  status?: 'healthy' | 'warning' | 'error';
  metadata?: Record<string, unknown>;
}

interface GeneratedConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

// Main generation function
export async function generateArchitecture(
  userPrompt: string,
  existingNodes?: ArchitectureNodeData[]
): Promise<{
  nodes: ArchitectureNodeData[];
  connections: ArchitectureConnection[];
  name: string;
  description: string;
  insights?: GeneratedArchitecture['insights'];
  message: string;
}> {
  // Determine if this is a modification or new design
  const isModification = existingNodes && existingNodes.length > 0 && 
    (userPrompt.toLowerCase().includes('add') || 
     userPrompt.toLowerCase().includes('include') ||
     userPrompt.toLowerCase().includes('connect'));

  const systemPrompt = isModification 
    ? MODIFICATION_PROMPT.replace('{existingNodeIds}', existingNodes!.map(n => n.id).join(', '))
    : ARCHITECTURE_SYSTEM_PROMPT;

  try {
    const response = await fetch('/api/generate-architecture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
        isModification,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    // Parse the AI response
    const architecture = parseAIResponse(data.content);
    
    // Convert to our types
    const nodes = architecture.nodes.map(convertToNodeData);
    const connections = architecture.connections.map(conn =>
  convertToConnection(conn, architecture.nodes)
);


    // If modification, merge with existing
    if (isModification && existingNodes) {
      return {
        nodes: [...existingNodes, ...nodes],
        connections: connections,
        name: architecture.name || 'Updated Architecture',
        description: architecture.description || '',
        insights: architecture.insights,
        message: architecture.message || `Added ${nodes.length} new component(s)`,
      };
    }

    return {
      nodes,
      connections,
      name: architecture.name,
      description: architecture.description,
      insights: architecture.insights,
      message: `Created ${architecture.name} with ${nodes.length} components`,
    };

  } catch (error) {
    console.error('Architecture generation error:', error);
    throw error;
  }
}

// Parse AI response (handle various formats)
function parseAIResponse(content: string): GeneratedArchitecture {
  // Clean the content
  let cleaned = content.trim();
  
  // Remove markdown code blocks if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  // Try to find JSON object
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  try {
    const parsed = JSON.parse(cleaned);
    
    // Validate required fields
    if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
      throw new Error('Invalid response: missing nodes array');
    }
    if (!parsed.connections || !Array.isArray(parsed.connections)) {
      parsed.connections = [];
    }
    
    return parsed as GeneratedArchitecture;
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.error('Content was:', cleaned.slice(0, 500));
    throw new Error('Failed to parse AI response as JSON');
  }
}

// Convert generated node to our type
function convertToNodeData(node: GeneratedNode): ArchitectureNodeData {
  // Validate node type
  const validTypes: NodeType[] = ['client', 'gateway', 'loadbalancer', 'service', 'database', 'cache', 'queue'];
  const type = validTypes.includes(node.type) ? node.type : 'service';
  
  return {
    id: node.id || `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    name: node.name,
    description: node.description,
    status: node.status || 'healthy',
    metadata: {
      ...node.metadata,
      position: node.position, // Store position in metadata for canvas
    },
  };
}

// Convert generated connection to our type
function convertToConnection(
  conn: GeneratedConnection,
  nodes?: GeneratedNode[]
): ArchitectureConnection {
  const sourceNode = nodes?.find(n => n.id === conn.source);
  const targetNode = nodes?.find(n => n.id === conn.target);

  let protocol = 'HTTP';

  if (sourceNode && targetNode) {
    const s = sourceNode.type;
    const t = targetNode.type;

    if (s === 'client') protocol = 'HTTPS';
    else if (s === 'gateway' && t === 'service') protocol = 'REST';
    else if (s === 'service' && t === 'service') protocol = 'gRPC';
    else if (t === 'database') protocol = 'SQL';
    else if (t === 'cache') protocol = 'Redis';
    else if (t === 'queue') protocol = 'Kafka';
  }

  return {
    id: conn.id || `conn-${Date.now()}-${Math.random()}`,
    source: conn.source,
    target: conn.target,
    label: protocol,
    animated: true,
  };
}



// Helper to detect intent from user message
export function detectIntent(message: string): 'design' | 'add' | 'analyze' | 'question' | 'greeting' | 'unknown' {
  const lower = message.toLowerCase().trim();
  
  // Greetings
  if (/^(hi|hello|hey|greetings|howdy)[\s!.,?]*$/i.test(lower)) {
    return 'greeting';
  }
  
  // Design intent
  if (lower.includes('design') || lower.includes('build') || lower.includes('create') || lower.includes('architect')) {
    return 'design';
  }
  
  // Add/modify intent
  if (lower.includes('add') || lower.includes('include') || lower.includes('connect') || lower.includes('attach')) {
    return 'add';
  }
  
  // Analysis intent
  if (lower.includes('bottleneck') || lower.includes('analyze') || lower.includes('issue') || lower.includes('problem') || lower.includes('scale')) {
    return 'analyze';
  }
  
  // Question
  if (lower.includes('what') || lower.includes('how') || lower.includes('why') || lower.includes('explain') || lower.endsWith('?')) {
    return 'question';
  }
  
  return 'unknown';
}

// Get suggested prompts based on context
export function getSuggestedPrompts(hasNodes: boolean): string[] {
  if (!hasNodes) {
    return [
      'Design WhatsApp',
      'Design Netflix',
      'Design a URL Shortener',
      'Design an E-commerce Platform',
      'Design a Notification System',
      'Design Uber',
    ];
  }
  
  return [
    'Add caching layer',
    'Add message queue',
    'Add authentication service',
    'Show bottlenecks',
    'Add load balancer',
    'Scale this for 1M users',
  ];
}