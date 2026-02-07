// components/export/export-button.tsx
'use client';

import { useState } from 'react';
import { Download, Image, FileCode, FileJson, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportButtonProps {
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportJSON: () => void;
  onExportMermaid?: () => void;
  isExporting?: boolean;
  disabled?: boolean;
}

export function ExportButton({
  onExportPNG,
  onExportSVG,
  onExportJSON,
  onExportMermaid,
  isExporting = false,
  disabled = false,
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportOptions = [
    {
      label: 'PNG Image',
      description: 'High quality image',
      icon: Image,
      action: onExportPNG,
    },
    {
      label: 'SVG Vector',
      description: 'Scalable graphics',
      icon: FileCode,
      action: onExportSVG,
    },
    {
      label: 'JSON Data',
      description: 'For import/export',
      icon: FileJson,
      action: onExportJSON,
    },
    ...(onExportMermaid
      ? [
          {
            label: 'Mermaid',
            description: 'For docs & GitHub',
            icon: FileCode,
            action: onExportMermaid,
          },
        ]
      : []),
  ];

  const handleExport = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isExporting}
        className={`
          flex items-center gap-2 px-4 py-2
          bg-indigo-600 hover:bg-indigo-700
          disabled:bg-gray-400 disabled:cursor-not-allowed
          text-white text-sm font-medium
          rounded-lg shadow-sm
          transition-colors duration-200
        `}
      >
        <Download size={16} className={isExporting ? 'animate-bounce' : ''} />
        <span>{isExporting ? 'Exporting...' : 'Export'}</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden"
            >
              <div className="p-1">
                {exportOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleExport(option.action)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className="p-1.5 bg-gray-100 rounded-lg">
                      <option.icon size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {option.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {option.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}