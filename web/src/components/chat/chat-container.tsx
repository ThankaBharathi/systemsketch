'use client';

import { useRef, useEffect } from 'react';
import { ChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (content: string) => void | Promise<void>;
  isLoading?: boolean;
  suggestions?: string[];
  className?: string;
}

export function ChatContainer({
  messages,
  onSendMessage,
  isLoading = false,
  suggestions,
  className = '',
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  return (
    <div className={`flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">💬 Design Assistant</h2>
        <p className="text-sm text-gray-500">Describe what you want to build</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-4xl mb-4">🏗️</p>
            <p className="font-medium">Start designing!</p>
            <p className="text-sm mt-2">Try: &quot;Design WhatsApp&quot; or &quot;Design Netflix&quot;</p>
            {suggestions && suggestions.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSendMessage(suggestion)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded-full text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ChatMessages messages={messages} isLoading={isLoading} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <ChatInput onSend={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}