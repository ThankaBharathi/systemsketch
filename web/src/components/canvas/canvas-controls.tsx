// components/canvas/canvas-controls.tsx
'use client';

import { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Plus, Trash2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import type { Node } from '@xyflow/react';
import { NODE_TEMPLATES, type ArchitectureFlowData, NODE_ICONS } from '@/types';

interface CanvasControlsProps {
  onAddNode?: (node: Node<ArchitectureFlowData>) => void;
  onClear?: () => void;
  nodeCount?: number;
  isDirty?: boolean;
}

export function CanvasControls({
  onAddNode,
  onClear,
  nodeCount = 0,
  isDirty = false,
}: CanvasControlsProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const reactFlowInstance = useReactFlow();

  const handleAddNode = (type: string, label: string, icon: string) => {
    if (!onAddNode) return;

    const id = `${type}-${Date.now()}`;
    
    // Calculate position based on existing nodes
    const x = 100 + (nodeCount % 4) * 220;
    const y = 100 + Math.floor(nodeCount / 4) * 160;

    const newNode: Node<ArchitectureFlowData> = {
      id,
      type: 'architectureNode',
      position: { x, y },
      data: {
        name: label,
        type: type as ArchitectureFlowData['type'],
        icon,
      },
    };

    onAddNode(newNode);
    setShowAddMenu(false);
  };

  const handleZoomIn = () => {
    reactFlowInstance.zoomIn();
  };

  const handleZoomOut = () => {
    reactFlowInstance.zoomOut();
  };

  const handleFitView = () => {
    reactFlowInstance.fitView({ padding: 0.2 });
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
      {/* Add Node Button */}
      <div className="relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors shadow-lg"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Add Node</span>
        </button>

        {/* Dropdown Menu */}
        {showAddMenu && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowAddMenu(false)} 
            />
            
            {/* Menu */}
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-2 min-w-[180px] z-20">
              {NODE_TEMPLATES.map((template) => (
                <button
                  key={template.type}
                  onClick={() =>
                    handleAddNode(
                      template.type,
                      template.label,
                      template.icon
                    )
                  }
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  <span className="text-xl">{template.icon}</span>
                  <span className="text-sm font-medium">{template.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Zoom Controls */}
      <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="p-2.5 hover:bg-gray-100 transition-colors border-b border-gray-100"
          title="Zoom In"
        >
          <ZoomIn size={18} className="text-gray-600" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 hover:bg-gray-100 transition-colors border-b border-gray-100"
          title="Zoom Out"
        >
          <ZoomOut size={18} className="text-gray-600" />
        </button>
        <button
          onClick={handleFitView}
          className="p-2.5 hover:bg-gray-100 transition-colors"
          title="Fit View"
        >
          <Maximize2 size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Clear Canvas */}
      {nodeCount > 0 && (
        <button
          onClick={onClear}
          className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-300 text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg transition-colors shadow-lg"
        >
          <Trash2 size={18} />
          <span className="text-sm font-medium">Clear</span>
        </button>
      )}

      {/* Unsaved Changes Indicator */}
      {isDirty && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
          <span>Unsaved</span>
        </div>
      )}
    </div>
  );
}