// components/chat/message-bubble.tsx
'use client';

import { motion } from 'framer-motion';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { Message } from './chat-container';

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: isUser ? 10 : -10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar - Assistant */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}

      {/* Message Content */}
      <div className={`group max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`
            relative px-4 py-2.5 rounded-2xl
            ${isUser
              ? 'bg-indigo-600 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
            }
          `}
        >
          {/* Message Text */}
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>

          {/* Copy Button (Assistant only) */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="
                absolute -right-8 top-1/2 -translate-y-1/2
                p-1.5 rounded-lg
                opacity-0 group-hover:opacity-100
                bg-white border border-gray-200 shadow-sm
                hover:bg-gray-50
                transition-all duration-200
              "
              title="Copy message"
            >
              {copied ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <Copy size={14} className="text-gray-400" />
              )}
            </button>
          )}
        </div>

        {/* Timestamp */}
        <p
          className={`
            text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity
            ${isUser ? 'text-right text-gray-400' : 'text-left text-gray-400'}
          `}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>

      {/* Avatar - User */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={16} className="text-gray-600" />
        </div>
      )}
    </motion.div>
  );
}