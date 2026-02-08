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
import { DetailPanel } from '@/components/panels';
import { BottleneckOverlay } from '@/components/canvas/bottleneck-overlay';
import { Navbar } from '@/components/layout';
import { useExport } from '@/lib/hooks';
import { useHistoryStore, type HistoryItem } from '@/lib/stores';
import { getSuggestedPrompts } from '@/lib/ai/architecture-generator';
import { getGreetingResponse } from '@/lib/ai/response-parser';
import type { ArchitectureNodeData, ArchitectureConnection } from '@/types';
import { calculateArchitectureScore } from '@/lib/architecture-score';
import { architectureAgent } from '@/lib/ai/architecture-agent';

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
// SCORE BAR COMPONENT
// ============================================
function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
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
  const score = calculateArchitectureScore(nodes);
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

  // ============================================
  // LOAD TEMPLATE OR SAVED DESIGN
  // ============================================
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

  // ============================================
  // ADD MESSAGE HELPER
  // ============================================
  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [...prev, { id: nanoid(), role, content, timestamp: new Date() }]);
  }, []);

  // ============================================
  // 🔥 MAIN MESSAGE HANDLER (FIXED)
  // ============================================
  const handleSendMessage = useCallback(
    async (content: string) => {
      addMessage('user', content);
      setIsLoading(true);
      setError(null);

      const lower = content.toLowerCase().trim();

      try {
        // ─────────────────────────────────────
        // 1️⃣ GREETING
        // ─────────────────────────────────────
        if (/^(hi|hello|hey)[\s!.,?]*$/i.test(lower)) {
          addMessage('assistant', getGreetingResponse());
          return;
        }

        // ─────────────────────────────────────
        // 2️⃣ CLEAR CANVAS
        // ─────────────────────────────────────
        if (lower === 'clear' || lower === 'reset') {
          setNodes([]);
          setConnections([]);
          setDesignName('Untitled Design');
          addMessage('assistant', '🗑️ Canvas cleared. Ready for a new design!');
          return;
        }

        // ─────────────────────────────────────
        // 3️⃣ BOTTLENECK ANALYSIS
        // ─────────────────────────────────────
        if (lower.includes('bottleneck') || lower.includes('analyze')) {
          if (nodes.length === 0) {
            addMessage('assistant', '⚠️ No architecture to analyze. Design something first!');
            return;
          }
          setShowBottlenecks(true);
          addMessage('assistant', '🔍 Analyzing architecture for bottlenecks...');
          return;
        }

        // ─────────────────────────────────────
        // 4️⃣ TEMPLATE LOAD (quick demo)
        // ─────────────────────────────────────
        // 4️⃣ TEMPLATE LOAD (ONLY for first design when canvas is empty)
        const templateKey = lower.replace(/^(design|build|create)\s+/i, '').trim();

        if (nodes.length === 0 && architectureTemplates[templateKey]) {
          const template = architectureTemplates[templateKey];
          setNodes(template.nodes);
          setConnections(template.connections);
          setDesignName(template.name);
          addMessage(
            'assistant',
            `🎉 **${template.name}** loaded with ${template.nodes.length} components!\n\nTry: "Add cache" or "Remove database"`
          );
          return;
        }


        // ─────────────────────────────────────
        // 5️⃣ 🧠 AI AGENT (FIXED - pass connections!)
        // ─────────────────────────────────────

        const result = await architectureAgent(
          content,
          nodes,        // ✅ existing nodes
          connections   // ✅ existing connections (FIXED!)
        );

        // ✅ SIMPLIFIED: Agent handles all merging, just set directly
        setNodes(result.nodes);
        setConnections(result.connections);

        // Update design name only for new designs
        if (result.name && result.name !== 'Updated Architecture' && nodes.length === 0) {
          setDesignName(result.name);
        }

        addMessage(
          'assistant',
          `✨ ${result.message}\n\n📐 ${result.nodes.length} components | ${result.connections.length} connections`
        );

      } catch (err) {
        console.error('AI Error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        addMessage(
          'assistant',
          '⚠️ Something went wrong. Try rephrasing your request.\n\nExamples:\n• "Design Twitter"\n• "Add a cache"\n• "Remove the database"'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage, nodes, connections] // ✅ Added connections to deps
  );

  // ============================================
  // SAVE DESIGN
  // ============================================
  const handleSave = useCallback(() => {
    if (nodes.length === 0) {
      addMessage('assistant', '⚠️ Nothing to save. Design something first!');
      return;
    }
    setIsSaving(true);
    addItem({ name: designName, nodes, edges: connections });
    addMessage('assistant', `💾 Saved **${designName}**!`);
    setTimeout(() => setIsSaving(false), 500);
  }, [nodes, connections, designName, addItem, addMessage]);

  // ============================================
  // LOAD DESIGN FROM HISTORY
  // ============================================
  const handleLoadDesign = useCallback(
    (item: HistoryItem) => {
      setNodes(item.nodes);
      setConnections(item.edges);
      setDesignName(item.name);
      setMessages([]);
      addMessage('assistant', `📂 Loaded **${item.name}** with ${item.nodes.length} components.`);
    },
    [addMessage]
  );

  // ============================================
  // NEW DESIGN
  // ============================================
  const handleNewDesign = useCallback(() => {
    setNodes([]);
    setConnections([]);
    setDesignName('Untitled Design');
    setMessages([]);
    setSelectedNode(null);
    setError(null);
  }, []);

  // ============================================
  // DELETE NODE
  // ============================================
  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((c) => c.source !== nodeId && c.target !== nodeId));
    setSelectedNode(null);
  }, []);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* NAVBAR */}
      <Navbar
        designName={designName}
        onDesignNameChange={setDesignName}
        onExport={() => setShowExport(true)}
        onSave={handleSave}
        isSaving={isSaving}
        nodeCount={nodes.length}
      />

      {/* METRICS BAR */}
      {nodes.length > 0 && (
        <div className="w-full border-b bg-gray-50 px-6 py-2 flex items-center justify-between text-sm">
          {/* LEFT SIDE — METRICS */}
          <div className="flex items-center gap-6">
            <div className="font-medium">{nodes.length} Components</div>
            <div className="font-medium">{connections.length} Connections</div>
            <div className="font-medium">~10K QPS</div>
            <div className="font-medium">&lt;100ms Latency</div>
          </div>

          {/* RIGHT SIDE — SCORE */}
          <div className="flex items-center gap-5">
            <span className="font-semibold">🏆 Score:</span>
            <span>Scal {score.scalability}%</span>
            <span>Rel {score.reliability}%</span>
            <span>Lat {score.latency}%</span>
            <span>Cost {score.cost}%</span>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex h-[calc(100vh-64px)] overflow-hidden">
        {/* HISTORY SIDEBAR */}
        <div className="hidden lg:block">
          <HistorySidebar
            onLoadDesign={handleLoadDesign}
            onNewDesign={handleNewDesign}
            currentNodes={nodes}
            currentEdges={connections}
            designName={designName}
          />
        </div>

        {/* CANVAS AREA */}
        <div
          ref={canvasRef}
          className="flex-1 relative h-full min-h-0"
          id="architecture-canvas"
        >
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

          {/* BOTTLENECK OVERLAY */}
          <BottleneckOverlay
            nodes={nodes}
            isVisible={showBottlenecks}
            onClose={() => setShowBottlenecks(false)}
          />

          {/* ERROR TOAST */}
          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
              <div className="flex justify-between items-center">
                <span className="text-sm">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-4 text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DETAIL PANEL (when node selected) */}
        {selectedNode && (
          <DetailPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onDelete={handleDeleteNode}
          />
        )}

        {/* CHAT PANEL */}
        <div className="w-full lg:w-[420px] border-l border-gray-200 bg-white flex flex-col h-full">
          <div className="flex-1 min-h-0 flex flex-col">
            <ChatContainer
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              suggestions={getSuggestedPrompts(nodes.length > 0)}
              className="flex-1 min-h-0 border-0 shadow-none rounded-none"
            />
          </div>
        </div>
      </div>

      {/* EXPORT MODAL */}
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

// ============================================
// PAGE EXPORT WITH SUSPENSE
// ============================================
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