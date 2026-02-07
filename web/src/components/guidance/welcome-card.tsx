// components/guidance/welcome-card.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WelcomeCardProps {
  onExampleClick: (example: string) => void;
}

const defaultSuggestions = [
  'Design WhatsApp',
  'Design Netflix',
  'Design a URL Shortener',
  'Design Uber',
  'Design Twitter',
  'Design a Payment System',
];

export function WelcomeCard({ onExampleClick }: WelcomeCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-lg text-center p-8">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-full mx-auto animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-lg text-center p-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="text-6xl mb-4"
      >
        🏗️
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-gray-800 mb-2"
      >
        Welcome to SystemSketch
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 mb-6"
      >
        Design any system architecture by just describing it.
        AI generates interactive diagrams for you.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        <p className="text-sm font-medium text-gray-500">Try one of these:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {defaultSuggestions.map((example, index) => (
            <motion.button
              key={example}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => onExampleClick(example)}
              type="button"
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all shadow-sm"
            >
              {example}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-xs text-gray-400"
      >
        Or type anything in the chat on the right →
      </motion.p>
    </div>
  );
}