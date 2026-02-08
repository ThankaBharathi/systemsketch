'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void | Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
}

const quickActions = [
  'Design Twitter',
  'Add caching',
  'Show bottlenecks',
  'Add authentication',
];

export function ChatInput({
  onSend,
  isLoading = false,
  placeholder = 'Type a command... (e.g., "Design Twitter")',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setMounted(true), []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim() || isLoading) return;
      onSend(message.trim());
      setMessage('');
      setShowQuickActions(false);
    },
    [message, isLoading, onSend]
  );

  const handleQuickAction = useCallback(
    (action: string) => {
      onSend(action);
      setShowQuickActions(false);
    },
    [onSend]
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  if (!mounted) {
    return (
      <div className="p-4 border-t border-gray-200">
        <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-3 flex flex-wrap gap-2"
          >
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => handleQuickAction(action)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-700 rounded-full text-sm transition-all shadow-sm hover:shadow"
              >
                {action}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className="w-full px-4 py-3 pr-16 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm"
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="p-1.5 rounded-lg transition-colors hover:bg-gray-200 text-gray-500 hover:text-indigo-600"
              title="Quick actions"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}