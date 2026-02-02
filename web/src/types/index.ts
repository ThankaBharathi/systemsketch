export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: Date;
}

export type NodeType = 
  | 'service' 
  | 'database' 
  | 'cache' 
  | 'queue' 
  | 'gateway' 
  | 'client'
  | 'loadbalancer';

export interface Position {
  x: number;
  y: number;
}

export interface ArchitectureNode {
  id: string;
  type: NodeType;
  name: string;
  description?: string;
  position: Position;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}