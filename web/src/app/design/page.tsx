'use client';

import { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ReactFlowProvider } from '@xyflow/react';
import { nanoid } from 'nanoid';
import { ArchitectureCanvas } from '@/components/canvas';
import { ChatContainer, type Message } from '@/components/chat';
import { WelcomeCard } from '@/components/guidance';
import { ExportModal } from '@/components/export';
import { HistorySidebar } from '@/components/history';
import { DetailPanel, MetricsPanel, BottleneckPanel } from '@/components/panels';
import { BottleneckOverlay } from '@/components/canvas/bottleneck-overlay';
import { Navbar } from '@/components/layout';
import { useExport } from '@/lib/hooks';
import { useHistoryStore, type HistoryItem } from '@/lib/stores';
import { generateArchitecture, detectIntent, getSuggestedPrompts } from '@/lib/ai/architecture-generator';
import { getGreetingResponse } from '@/lib/ai/response-parser';
import type { ArchitectureNodeData, ArchitectureConnection } from '@/types';

// ============================================
// TEMPLATES (kept for fast offline fallback)
// ============================================
const architectureTemplates: Record<string, {
  nodes: ArchitectureNodeData[];
  connections: ArchitectureConnection[];
  name: string;
}> = {
  twitter: {
    name: 'Twitter Architecture',
    nodes: [
      { id: 'client-1', type: 'client', name: 'Mobile App', status: 'healthy' },
      { id: 'gateway-1', type: 'gateway', name: 'API Gateway', status: 'healthy' },
      { id: 'lb-1', type: 'loadbalancer', name: 'Load Balancer', status: 'healthy' },
      { id: 'service-1', type: 'service', name: 'Tweet Service', status: 'healthy' },
      { id: 'service-2', type: 'service', name: 'User Service', status: 'healthy' },
      { id: 'service-3', type: 'service', name: 'Feed Service', status: 'healthy' },
      { id: 'db-1', type: 'database', name: 'PostgreSQL', status: 'healthy' },
      { id: 'cache-1', type: 'cache', name: 'Redis', status: 'healthy' },
      { id: 'queue-1', type: 'queue', name: 'Kafka', status: 'healthy' },
    ],
    connections: [
      { id: 'e1', source: 'client-1', target: 'gateway-1', label: 'HTTPS', animated: true },
      { id: 'e2', source: 'gateway-1', target: 'lb-1', animated: true },
      { id: 'e3', source: 'lb-1', target: 'service-1', animated: true },
      { id: 'e4', source: 'lb-1', target: 'service-2', animated: true },
      { id: 'e5', source: 'lb-1', target: 'service-3', animated: true },
      { id: 'e6', source: 'service-1', target: 'db-1', animated: true },
      { id: 'e7', source: 'service-2', target: 'db-1', animated: true },
      { id: 'e8', source: 'service-1', target: 'cache-1', animated: true },
      { id: 'e9', source: 'service-3', target: 'cache-1', animated: true },
      { id: 'e10', source: 'service-1', target: 'queue-1', animated: true },
    ],
  },
  netflix: {
    name: 'Netflix Architecture',
    nodes: [
      { id: 'client-1', type: 'client', name: 'Web/Mobile', status: 'healthy' },
      { id: 'gateway-1', type: 'gateway', name: 'API Gateway', status: 'healthy' },
      { id: 'lb-1', type: 'loadbalancer', name: 'Load Balancer', status: 'healthy' },
      { id: 'service-1', type: 'service', name: 'User Service', status: 'healthy' },
      { id: 'service-2', type: 'service', name: 'Video Service', status: 'healthy' },
      { id: 'service-3', type: 'service', name: 'Recommendation', status: 'healthy' },
      { id: 'service-4', type: 'service', name: 'Transcoding', status: 'healthy' },
      { id: 'db-1', type: 'database', name: 'PostgreSQL', status: 'healthy' },
      { id: 'cache-1', type: 'cache', name: 'Redis', status: 'healthy' },
      { id: 'queue-1', type: 'queue', name: 'Kafka', status: 'healthy' },
    ],
    connections: [
      { id: 'e1', source: 'client-1', target: 'gateway-1', animated: true },
      { id: 'e2', source: 'gateway-1', target: 'lb-1', animated: true },
      { id: 'e3', source: 'lb-1', target: 'service-1', animated: true },
      { id: 'e4', source: 'lb-1', target: 'service-2', animated: true },
      { id: 'e5', source: 'lb-1', target: 'service-3', animated: true },
      { id: 'e6', source: 'service-2', target: 'service-4', animated: true },
      { id: 'e7', source: 'service-1', target: 'db-1', animated: true },
      { id: 'e8', source: 'service-2', target: 'cache-1', animated: true },
      { id: 'e9', source: 'service-3', target: 'queue-1', animated: true },
    ],
  },
  whatsapp: {
    name: 'WhatsApp Architecture',
    nodes: [
      { id: 'client-1', type: 'client', name: 'Mobile App', status: 'healthy' },
      { id: 'gateway-1', type: 'gateway', name: 'WebSocket Gateway', status: 'healthy' },
      { id: 'lb-1', type: 'loadbalancer', name: 'Load Balancer', status: 'healthy' },
      { id: 'service-1', type: 'service', name: 'Message Service', status: 'healthy' },
      { id: 'service-2', type: 'service', name: 'User Service', status: 'healthy' },
      { id: 'service-3', type: 'service', name: 'Presence Service', status: 'healthy' },
      { id: 'db-1', type: 'database', name: 'Cassandra', status: 'healthy' },
      { id: 'cache-1', type: 'cache', name: 'Redis', status: 'healthy' },
      { id: 'queue-1', type: 'queue', name: 'Kafka', status: 'healthy' },
    ],
    connections: [
      { id: 'e1', source: 'client-1', target: 'gateway-1', label: 'WebSocket', animated: true },
      { id: 'e2', source: 'gateway-1', target: 'lb-1', animated: true },
      { id: 'e3', source: 'lb-1', target: 'service-1', animated: true },
      { id: 'e4', source: 'lb-1', target: 'service-2', animated: true },
      { id: 'e5', source: 'lb-1', target: 'service-3', animated: true },
      { id: 'e6', source: 'service-1', target: 'db-1', animated: true },
      { id: 'e7', source: 'service-3', target: 'cache-1', animated: true },
      { id: 'e8', source: 'service-1', target: 'queue-1', animated: true },
    ],
  },
  uber: {
    name: 'Uber Architecture',
    nodes: [
      { id: 'client-1', type: 'client', name: 'Rider App', status: 'healthy' },
      { id: 'client-2', type: 'client', name: 'Driver App', status: 'healthy' },
      { id: 'gateway-1', type: 'gateway', name: 'API Gateway', status: 'healthy' },
      { id: 'lb-1', type: 'loadbalancer', name: 'Load Balancer', status: 'healthy' },
      { id: 'service-1', type: 'service', name: 'Ride Service', status: 'healthy' },
      { id: 'service-2', type: 'service', name: 'Location Service', status: 'healthy' },
      { id: 'service-3', type: 'service', name: 'Payment Service', status: 'healthy' },
      { id: 'db-1', type: 'database', name: 'PostgreSQL', status: 'healthy' },
      { id: 'cache-1', type: 'cache', name: 'Redis', status: 'healthy' },
    ],
    connections: [
      { id: 'e1', source: 'client-1', target: 'gateway-1', animated: true },
      { id: 'e2', source: 'client-2', target: 'gateway-1', animated: true },
      { id: 'e3', source: 'gateway-1', target: 'lb-1', animated: true },
      { id: 'e4', source: 'lb-1', target: 'service-1', animated: true },
      { id: 'e5', source: 'lb-1', target: 'service-2', animated: true },
      { id: 'e6', source: 'service-1', target: 'service-3', animated: true },
      { id: 'e7', source: 'service-1', target: 'db-1', animated: true },
      { id: 'e8', source: 'service-2', target: 'cache-1', animated: true },
    ],
  },
  url: {
    name: 'URL Shortener',
    nodes: [
      { id: 'client-1', type: 'client', name: 'Web Client', status: 'healthy' },
      { id: 'lb-1', type: 'loadbalancer', name: 'Load Balancer', status: 'healthy' },
      { id: 'service-1', type: 'service', name: 'URL Service', status: 'healthy' },
      { id: 'db-1', type: 'database', name: 'PostgreSQL', status: 'healthy' },
      { id: 'cache-1', type: 'cache', name: 'Redis', status: 'healthy' },
    ],
    connections: [
      { id: 'e1', source: 'client-1', target: 'lb-1', animated: true },
      { id: 'e2', source: 'lb-1', target: 'service-1', animated: true },
      { id: 'e3', source: 'service-1', target: 'cache-1', label: 'Cache', animated: true },
      { id: 'e4', source: 'service-1', target: 'db-1', label: 'Store', animated: true },
    ],
  },
  payment: {
    name: 'Payment System',
    nodes: [
      { id: 'client-1', type: 'client', name: 'Web/Mobile', status: 'healthy' },
      { id: 'gateway-1', type: 'gateway', name: 'API Gateway', status: 'healthy' },
      { id: 'service-1', type: 'service', name: 'Payment Service', status: 'healthy' },
      { id: 'service-2', type: 'service', name: 'Order Service', status: 'healthy' },
      { id: 'service-3', type: 'service', name: 'Notification', status: 'healthy' },
      { id: 'db-1', type: 'database', name: 'PostgreSQL', status: 'healthy' },
      { id: 'queue-1', type: 'queue', name: 'Message Queue', status: 'healthy' },
    ],
    connections: [
      { id: 'e1', source: 'client-1', target: 'gateway-1', animated: true },
      { id: 'e2', source: 'gateway-1', target: 'service-1', animated: true },
      { id: 'e3', source: 'gateway-1', target: 'service-2', animated: true },
      { id: 'e4', source: 'service-1', target: 'db-1', animated: true },
      { id: 'e5', source: 'service-1', target: 'queue-1', animated: true },
      { id: 'e6', source: 'queue-1', target: 'service-3', animated: true },
    ],
  },
};

// ============================================
// LOCAL COMMAND PROCESSOR (fast fallback)
// ============================================
function processLocalCommand(
  input: string,
  currentNodes: ArchitectureNodeData[],
  currentConnections: ArchitectureConnection[]
): { nodes: ArchitectureNodeData[]; connections: ArchitectureConnection[]; message: string } | null {
  const lower = input.toLowerCase().trim();

  const concepts: Record<string, { type: ArchitectureNodeData['type']; keywords: string[] }> = {
    cache: { type: 'cache', keywords: ['cache', 'redis', 'caching', 'memcached'] },
    database: { type: 'database', keywords: ['database', 'db', 'postgres', 'mysql', 'mongo'] },
    queue: { type: 'queue', keywords: ['queue', 'kafka', 'rabbitmq', 'events'] },
    auth: { type: 'service', keywords: ['auth', 'authentication', 'login', 'jwt'] },
    search: { type: 'service', keywords: ['search', 'elasticsearch'] },
    gateway: { type: 'gateway', keywords: ['gateway', 'api gateway'] },
    loadbalancer: { type: 'loadbalancer', keywords: ['load balancer', 'loadbalancer', 'lb', 'nginx'] },
  };

  // Detect add
  if (lower.startsWith('add') || lower.startsWith('include')) {
    for (const [key, config] of Object.entries(concepts)) {
      if (config.keywords.some((w) => lower.includes(w))) {
        const id = `${key}-${Date.now()}`;
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        const newNode: ArchitectureNodeData = { id, type: config.type, name, status: 'healthy' };
        const newNodes = [...currentNodes, newNode];
        const newConns = [...currentConnections];

        // Auto-connect to services
        const services = currentNodes.filter((n) => n.type === 'service');
        if (config.type === 'database' || config.type === 'cache') {
          services.forEach((svc, i) => {
            newConns.push({ id: `conn-${id}-${i}`, source: svc.id, target: id, animated: true });
          });
        }

        return { nodes: newNodes, connections: newConns, message: `✅ Added ${name} to the architecture` };
      }
    }
  }

  // Detect remove
  if (lower.startsWith('remove') || lower.startsWith('delete')) {
    for (const [, config] of Object.entries(concepts)) {
      if (config.keywords.some((w) => lower.includes(w))) {
        const target = currentNodes.find((n) => n.type === config.type);
        if (target) {
          return {
            nodes: currentNodes.filter((n) => n.id !== target.id),
            connections: currentConnections.filter((c) => c.source !== target.id && c.target !== target.id),
            message: `🗑️ Removed ${target.name}`,
          };
        }
      }
    }
  }

  return null;
}

// ============================================
// MAIN DESIGN EDITOR
// ============================================
function DesignEditorContent() {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template');
  const loadId = searchParams.get('load');
  const mode = searchParams.get('mode');


  const [messages, setMessages] = useState<Message[]>([]);
  const [nodes, setNodes] = useState<ArchitectureNodeData[]>([]);
  const [connections, setConnections] = useState<ArchitectureConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [designName, setDesignName] = useState('Untitled Design');
  const [selectedNode, setSelectedNode] = useState<ArchitectureNodeData | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [showBottlenecks, setShowBottlenecks] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const { addItem, getItem } = useHistoryStore();

  const { isExporting, exportToPNG, exportToSVG, exportToJSON, exportToMermaid, copyMermaid, copyJSON } = useExport({
    nodes,
    connections,
    designName,
    canvasElement: canvasRef.current,
  });

  // Load template or saved design
  useEffect(() => {
    if (initialized) return;

    if (loadId) {
      const saved = getItem(loadId);
      if (saved) {
        setNodes(saved.nodes);
        setConnections(saved.edges);
        setDesignName(saved.name);
        addMessage('assistant', `📂 Loaded **${saved.name}** with ${saved.nodes.length} components.`);
      }
    } else if (
  templateParam &&
  architectureTemplates[templateParam.toLowerCase()] &&
  mode !== 'interview'
) {
      const template = architectureTemplates[templateParam.toLowerCase()];
      setNodes(template.nodes);
      setConnections(template.connections);
      setDesignName(template.name);
      addMessage('assistant', `🎉 **${template.name}** loaded!\n\n${template.nodes.length} components ready.\n\nTry: "Add caching" or "Show bottlenecks"`);
    }

    setInitialized(true);
  }, [templateParam, loadId, initialized, getItem]);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [...prev, { id: nanoid(), role, content, timestamp: new Date() }]);
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      addMessage('user', content);
      setIsLoading(true);

      const lower = content.toLowerCase().trim();

      try {
        // 1. Greetings
        if (/^(hi|hello|hey)[\s!.,?]*$/i.test(lower)) {
          addMessage('assistant', getGreetingResponse());
          return;
        }

        // 2. Clear/Reset
        if (lower === 'clear' || lower === 'reset') {
          setNodes([]);
          setConnections([]);
          setDesignName('Untitled Design');
          addMessage('assistant', '🗑️ Canvas cleared!\n\nTry: "Design Twitter" or "Design Netflix"');
          return;
        }

        // 3. Show bottlenecks
        if (lower.includes('bottleneck') || lower.includes('analyze')) {
          setShowBottlenecks(true);
          addMessage('assistant', '🔍 Analyzing architecture for bottlenecks...');
          return;
        }

        // 4. Check templates first (instant)
        const templateKey = lower.replace(/^(design|build|create)\s+/i, '').trim();
        if (architectureTemplates[templateKey]) {
          const template = architectureTemplates[templateKey];
          setNodes(template.nodes);
          setConnections(template.connections);
          setDesignName(template.name);
          addMessage('assistant', `🎉 **${template.name}** created!\n\n${template.nodes.length} components ready.\n\nTry: "Add caching" or "Show bottlenecks"`);
          return;
        }

        // 5. Try local command processing (add/remove)
        const localResult = processLocalCommand(content, nodes, connections);
        if (localResult) {
          setNodes(localResult.nodes);
          setConnections(localResult.connections);
          addMessage('assistant', localResult.message);
          return;
        }

        // 6. Fall back to AI (Groq) for anything else
        const intent = detectIntent(content);
        if (intent === 'design' || intent === 'add' || intent === 'question') {
          addMessage('assistant', '🏗️ Generating with AI...');

          try {
            const result = await generateArchitecture(content, nodes.length > 0 ? nodes : undefined);
            setNodes(result.nodes);
            setConnections(result.connections);
            setDesignName(result.name);
            addMessage('assistant', `✅ ${result.message}\n\n${result.nodes.length} components generated.`);
          } catch (aiError) {
            addMessage('assistant', '⚠️ AI generation failed. Try a simpler command like "Add cache" or "Design Twitter".');
          }
        } else {
          addMessage(
            'assistant',
            '🤔 I specialize in system design.\n\nTry:\n• "Design Twitter"\n• "Add caching"\n• "Show bottlenecks"\n• "Add database"'
          );
        }
      } catch {
        addMessage('assistant', '❌ Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage, nodes, connections]
  );

  const handleSave = useCallback(() => {
    if (nodes.length === 0) return;
    setIsSaving(true);
    addItem({ name: designName, nodes, edges: connections });
    addMessage('assistant', `💾 Saved **${designName}**!`);
    setTimeout(() => setIsSaving(false), 500);
  }, [nodes, connections, designName, addItem, addMessage]);

  const handleLoadDesign = useCallback(
    (item: HistoryItem) => {
      setNodes(item.nodes);
      setConnections(item.edges);
      setDesignName(item.name);
      setMessages([]);
      addMessage('assistant', `📂 Loaded **${item.name}**`);
    },
    [addMessage]
  );

  const handleNewDesign = useCallback(() => {
    setNodes([]);
    setConnections([]);
    setDesignName('Untitled Design');
    setMessages([]);
    setSelectedNode(null);
  }, []);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((c) => c.source !== nodeId && c.target !== nodeId));
    setSelectedNode(null);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">
      <Navbar
        designName={designName}
        onDesignNameChange={setDesignName}
        onExport={() => setShowExport(true)}
        onSave={handleSave}
        isSaving={isSaving}
        nodeCount={nodes.length}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden lg:block">
          <HistorySidebar
            onLoadDesign={handleLoadDesign}
            onNewDesign={handleNewDesign}
            currentNodes={nodes}
            currentEdges={connections}
            designName={designName}
          />
        </div>

        <div ref={canvasRef} className="flex-1 relative h-full" id="architecture-canvas">
          {nodes.length > 0 ? (
            <ReactFlowProvider>
              <ArchitectureCanvas
                initialNodes={nodes}
                initialConnections={connections}
                onNodeSelect={setSelectedNode}
              />
            </ReactFlowProvider>
          ) : (
            <div className="h-full flex items-center justify-center bg-white">
              <WelcomeCard onExampleClick={handleSendMessage} />
            </div>
          )}

          <BottleneckOverlay
            nodes={nodes}
            isVisible={showBottlenecks}
            onClose={() => setShowBottlenecks(false)}
          />

          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
              <div className="flex justify-between">
                <span>{error}</span>
                <button onClick={() => setError(null)}>✕</button>
              </div>
            </div>
          )}
        </div>

        {selectedNode && (
          <DetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} onDelete={handleDeleteNode} />
        )}

        <div className="w-full lg:w-[380px] border-l border-gray-200 bg-white flex flex-col">
          <ChatContainer
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            suggestions={getSuggestedPrompts(nodes.length > 0)}
            className="flex-1 border-0 shadow-none rounded-none"
          />
          {nodes.length > 0 && (
            <div className="border-t border-gray-200">
              <MetricsPanel
                nodeCount={nodes.length}
                connectionCount={connections.length}
              />
            </div>
          )}
        </div>
      </div>

      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        designName={designName}
        onExportPNG={exportToPNG}
        onExportSVG={exportToSVG}
        onExportJSON={exportToJSON}
        onExportMermaid={exportToMermaid}
        onCopyMermaid={copyMermaid}
        onCopyJSON={copyJSON}
        isExporting={isExporting}
      />
    </div>
  );
}

export default function DesignPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DesignEditorContent />
    </Suspense>
  );
}