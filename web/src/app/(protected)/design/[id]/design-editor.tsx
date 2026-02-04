'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';

import { Button } from '@/components/ui';
import { ArchitectureCanvas } from '@/components/canvas/architecture-canvas';
import { useArchitectureStore } from '@/stores/architecture-store';
import { parseUserMessage, getSystemArchitecture } from '@/lib/ai/response-parser';
import type { ArchitectureNodeData } from '@/types/architecture';
import type { ArchitectureConnection } from '@/types/architecture';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface DesignEditorProps {
  design: {
    id: string;
    name: string;
    nodes: unknown[];
    connections: unknown[];
  };
  initialMessages: Message[];
}

export function DesignEditor({ design, initialMessages }: DesignEditorProps) {
  const [designName, setDesignName] = useState(design.name);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<ArchitectureNodeData | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    nodes,
    connections,
    addNode,
    addConnection,
    setNodes,
    setConnections,
  } = useArchitectureStore();

  /**
   * Initialize design data
   */
  useEffect(() => {
    if (Array.isArray(design.nodes)) {
      setNodes(design.nodes as ArchitectureNodeData[]);
    }
    if (Array.isArray(design.connections)) {
      setConnections(design.connections as ArchitectureConnection[]);
    }
  }, [design.nodes, design.connections, setNodes, setConnections]);

  /**
   * Auto scroll chat
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNodeSelect = useCallback((node: ArchitectureNodeData | null) => {
    setSelectedNode(node);
  }, []);

  /**
   * Send chat message
   */
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const parsed = parseUserMessage(userMessage.content);
      let responseContent = '';

      if (parsed.type === 'add_node' && parsed.nodeType && parsed.nodeName) {
        addNode(parsed.nodeType, parsed.nodeName, parsed.nodeDescription);
        responseContent = `✅ Added ${parsed.nodeType}: **${parsed.nodeName}**`;
      } else if (parsed.type === 'info') {
        const system = getSystemArchitecture(parsed.message);

        if (system) {
          const idMap: Record<string, string> = {};

          system.nodes.forEach((n) => {
            const id = addNode(n.type, n.name, n.description);
            idMap[n.name] = id;
          });

          setTimeout(() => {
            system.connections.forEach((c) => {
              const source = idMap[c.source];
              const target = idMap[c.target];
              if (source && target) {
                addConnection(source, target, c.label);
              }
            });
          }, 100);

          responseContent = `${system.description}\n\nComponents added successfully.`;
        } else if (parsed.message === 'greeting') {
          responseContent = `👋 Hello! I'm SystemSketch.\n\nTry:\n• Design Twitter\n• Add a database\n• Add Redis cache`;
        } else {
          responseContent = 'I can help design that. Try: Design Twitter';
        }
      } else {
        responseContent = 'I understand. How can I help you design your system?';
      }

      setMessages((prev) => [
        ...prev,
        { id: nanoid(), role: 'assistant', content: responseContent },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { id: nanoid(), role: 'assistant', content: 'Something went wrong.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save design
   */
  const handleSave = async () => {
    await fetch(`/api/designs/${design.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: designName,
        nodes,
        connections,
      }),
    });

    alert('Design saved!');
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b bg-white px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
            ← Back
          </Link>
          <input
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            className="bg-transparent text-lg font-semibold focus:outline-none"
          />
        </div>

        <Button size="sm" variant="outline" onClick={handleSave}>
          💾 Save
        </Button>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1">
          {nodes.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-gray-500">
              <div>
                <p className="text-5xl">🏗️</p>
                <p className="mt-4 font-medium">Start designing</p>
                <p className="mt-2 text-sm">
                  {'Try typing "Design Twitter" in the chat'}
                </p>
              </div>
            </div>
          ) : (
            <ArchitectureCanvas
              initialNodes={nodes}
              initialConnections={connections}
              onNodeSelect={handleNodeSelect}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="flex w-96 flex-col border-l bg-white">
          {selectedNode && (
            <div className="border-b bg-blue-50 p-4">
              <h3 className="font-semibold">{selectedNode.name}</h3>
              <p className="text-sm capitalize text-blue-700">
                {selectedNode.type}
              </p>
              {selectedNode.description && (
                <p className="mt-1 text-sm">{selectedNode.description}</p>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 rounded border px-3 py-2"
                placeholder="Describe your architecture..."
              />
              <Button onClick={handleSend} disabled={isLoading}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
