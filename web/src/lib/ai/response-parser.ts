// lib/ai/response-parser.ts

import type { MessageIntent } from '@/types/architecture';

export interface ParsedMessage {
  intent: MessageIntent;
  isSystemDesign: boolean;
  systemName?: string;
  componentType?: string;
  action?: 'create' | 'add' | 'remove' | 'analyze' | 'explain';
  rawMessage: string;
}

// Parse user message to determine intent
export function parseUserMessage(message: string): ParsedMessage {
  const lower = message.toLowerCase().trim();
  
  // Check for greetings first
  if (isGreeting(lower)) {
    return {
      intent: 'greeting',
      isSystemDesign: false,
      rawMessage: message,
    };
  }
  
  // Check for system design request
  const designMatch = extractDesignRequest(lower);
  if (designMatch) {
    return {
      intent: 'design',
      isSystemDesign: true,
      systemName: designMatch,
      action: 'create',
      rawMessage: message,
    };
  }
  
  // Check for add/modify request
  const addMatch = extractAddRequest(lower);
  if (addMatch) {
    return {
      intent: 'add',
      isSystemDesign: true,
      componentType: addMatch,
      action: 'add',
      rawMessage: message,
    };
  }
  
  // Check for analysis request
  if (isAnalysisRequest(lower)) {
    return {
      intent: 'analyze',
      isSystemDesign: true,
      action: 'analyze',
      rawMessage: message,
    };
  }
  
  // Check for questions
  if (isQuestion(lower)) {
    return {
      intent: 'question',
      isSystemDesign: lower.includes('system') || lower.includes('architecture') || lower.includes('design'),
      rawMessage: message,
    };
  }
  
  // Default: try to interpret as design request
  return {
    intent: 'design',
    isSystemDesign: true,
    systemName: message,
    action: 'create',
    rawMessage: message,
  };
}

// Check if message is a greeting
function isGreeting(message: string): boolean {
  const greetings = ['hello', 'hi', 'hey', 'greetings', 'howdy', 'good morning', 'good afternoon', 'good evening'];
  return greetings.some(g => message === g || message.startsWith(g + ' ') || message.startsWith(g + '!') || message.startsWith(g + ','));
}

// Extract system name from design request
function extractDesignRequest(message: string): string | null {
  // Patterns like "design twitter", "build a url shortener", "create netflix architecture"
  const patterns = [
    /(?:design|build|create|architect|make)\s+(?:a\s+)?(?:the\s+)?(.+?)(?:\s+architecture|\s+system)?$/i,
    /(.+?)\s+(?:architecture|system|design)$/i,
  ];
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  // Check for direct mentions of known system types
  const systems = ['twitter', 'instagram', 'whatsapp', 'uber', 'netflix', 'youtube', 'amazon', 'facebook', 'slack', 'discord', 'spotify', 'airbnb', 'linkedin', 'pinterest', 'reddit', 'tiktok', 'zoom', 'stripe', 'paypal'];
  
  for (const system of systems) {
    if (message.includes(system)) {
      return system.charAt(0).toUpperCase() + system.slice(1);
    }
  }
  
  // Check for generic design keywords
  if (message.includes('design') || message.includes('build') || message.includes('create') || message.includes('architect')) {
    return message.replace(/^(design|build|create|architect)\s+/i, '').trim();
  }
  
  return null;
}

// Extract component type from add request
function extractAddRequest(message: string): string | null {
  if (!message.includes('add') && !message.includes('include') && !message.includes('connect')) {
    return null;
  }
  
  const componentTypes = [
    'cache', 'redis', 'memcached',
    'database', 'db', 'postgres', 'postgresql', 'mysql', 'mongodb', 'dynamodb',
    'queue', 'kafka', 'rabbitmq', 'sqs',
    'gateway', 'api gateway',
    'load balancer', 'loadbalancer', 'lb', 'nginx',
    'service', 'microservice',
    'authentication', 'auth',
    'cdn',
    'storage', 's3',
    'worker', 'workers',
    'notification', 'notifications',
    'search', 'elasticsearch',
  ];
  
  for (const component of componentTypes) {
    if (message.includes(component)) {
      return component;
    }
  }
  
  return message.replace(/^(add|include|connect)\s+/i, '').trim();
}

// Check if message is an analysis request
function isAnalysisRequest(message: string): boolean {
  const analysisKeywords = [
    'bottleneck', 'bottlenecks',
    'analyze', 'analysis',
    'issue', 'issues', 'problem', 'problems',
    'scale', 'scaling',
    'optimize', 'optimization',
    'improve', 'improvement',
    'failure', 'failures', 'fail',
    'risk', 'risks',
    'performance',
  ];
  
  return analysisKeywords.some(keyword => message.includes(keyword));
}

// Check if message is a question
function isQuestion(message: string): boolean {
  return message.endsWith('?') || 
    message.startsWith('what') ||
    message.startsWith('how') ||
    message.startsWith('why') ||
    message.startsWith('when') ||
    message.startsWith('where') ||
    message.startsWith('explain') ||
    message.startsWith('tell me');
}

// Get friendly response for greetings
export function getGreetingResponse(): string {
  const greetings = [
    "👋 Hello! I'm SystemSketch, your AI system design assistant.\n\nI can help you design any system architecture. Just tell me what you want to build!\n\nTry: \"Design WhatsApp\" or \"Design a URL Shortener\"",
    "👋 Hi there! Ready to architect some systems?\n\nJust describe what you want to build and I'll create the architecture for you.\n\nExamples: \"Design Netflix\", \"Design Uber\", \"Design a Payment System\"",
    "👋 Hey! I'm here to help you design system architectures.\n\nWhat would you like to build today?\n\nYou can say things like: \"Design Twitter\" or \"Build a notification system\"",
  ];
  
  return greetings[Math.floor(Math.random() * greetings.length)];
}

// Get guidance for off-topic messages
export function getGuidanceResponse(): string {
  return `🤔 I specialize in system design and architecture.

Try asking me to:
• **Design a system**: "Design WhatsApp", "Build Netflix"
• **Add components**: "Add a caching layer", "Include message queue"
• **Analyze architecture**: "Show bottlenecks", "How to scale this?"

What would you like to design?`;
}