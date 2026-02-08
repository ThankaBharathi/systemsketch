'use client';

import { motion } from 'framer-motion';
import { MessageBubble } from './message-bubble';
import type { Message } from './chat-container';

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  onSendMessage?: (message: string) => void;
}

const QUICK_START_EXAMPLES = [
  { label: 'Design Twitter', icon: '🐦' },
  { label: 'Design URL Shortener', icon: '🔗' },
  { label: 'Design WhatsApp', icon: '💬' },
  { label: 'Design Netflix', icon: '🎬' },
];

export function ChatMessages({ messages, isLoading, onSendMessage }: ChatMessagesProps) {
  return (
    <div className="p-4 space-y-4">
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <span className="text-5xl mb-4 block">🏗️</span>
          <h4 className="text-gray-800 font-semibold text-lg mb-2">
            Welcome to SystemSketch!
          </h4>
          <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
            I can help you design system architectures. Describe what you want to build!
          </p>
          <div className="space-y-2">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Quick Start</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_START_EXAMPLES.map((example, index) => (
                <motion.button
                  key={example.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onSendMessage?.(example.label)}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  <span>{example.icon}</span>
                  <span>{example.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {messages.map((message, index) => (
        <MessageBubble key={message.id} message={message} index={index} />
      ))}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
            <div className="flex items-center gap-1.5">
              {[0, 0.2, 0.4].map((delay) => (
                <motion.span
                  key={delay}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay }}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}