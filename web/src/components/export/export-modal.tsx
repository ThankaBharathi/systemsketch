// components/export/export-modal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Copy, Check, Image, FileJson, FileCode } from 'lucide-react';

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  designName: string;
  onExportPNG: () => Promise<boolean>;
  onExportSVG: () => Promise<boolean>;
  onExportJSON: () => boolean;
  onExportMermaid: () => boolean;
  onCopyMermaid: () => Promise<boolean>;
  onCopyJSON: () => Promise<boolean>;
  isExporting: boolean;
}

export function ExportModal({
  isOpen,
  onClose,
  designName,
  onExportPNG,
  onExportSVG,
  onExportJSON,
  onExportMermaid,
  onCopyMermaid,
  onCopyJSON,
  isExporting,
}: ExportModalProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = async (type: 'mermaid' | 'json') => {
    const success = type === 'mermaid' ? await onCopyMermaid() : await onCopyJSON();
    if (success) {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Export Design</h2>
              <p className="text-sm text-gray-500 mt-1">{designName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Export Options */}
          <div className="p-6 space-y-4">
            {/* Image Exports */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Images</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onExportPNG}
                  disabled={isExporting}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition disabled:opacity-50"
                >
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Image className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">PNG</p>
                    <p className="text-xs text-gray-500">High quality</p>
                  </div>
                </button>
                <button
                  onClick={onExportSVG}
                  disabled={isExporting}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition disabled:opacity-50"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Image className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">SVG</p>
                    <p className="text-xs text-gray-500">Vector</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Data Exports */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Data</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onExportJSON}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileJson className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">JSON</p>
                    <p className="text-xs text-gray-500">Full data</p>
                  </div>
                </button>
                <button
                  onClick={onExportMermaid}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileCode className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Mermaid</p>
                    <p className="text-xs text-gray-500">For docs</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Copy Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Copy to Clipboard</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleCopy('json')}
                  className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition"
                >
                  {copiedType === 'json' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                  <span className="text-sm font-medium">
                    {copiedType === 'json' ? 'Copied!' : 'Copy JSON'}
                  </span>
                </button>
                <button
                  onClick={() => handleCopy('mermaid')}
                  className="flex-1 flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition"
                >
                  {copiedType === 'mermaid' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                  <span className="text-sm font-medium">
                    {copiedType === 'mermaid' ? 'Copied!' : 'Copy Mermaid'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}