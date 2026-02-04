'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface DesignEditorProps {
  design: {
    id: string;
    name: string;
    nodes: unknown[];
    connections: unknown[];
  };
  initialMessages: Message[];
}

export function DesignEditor({ design, initialMessages }: DesignEditorProps) {
  const [designName, setDesignName] = useState(design.name);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call our API route that handles AI
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          designId: design.id,
          context: {
            designName: design.name,
            nodes: design.nodes,
          },
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'I understand. Let me help you with that architecture.',
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save messages to database
      await fetch(`/api/designs/${design.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userMessage.content,
          assistantMessage: assistantMessage.content,
        }),
      });
    } catch (error) {
      console.error('Error:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSimpleResponse(inputValue),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b bg-white px-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
            ← Back
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-xl">🏗️</span>
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="border-none bg-transparent text-lg font-semibold focus:outline-none"
              placeholder="Design name..."
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">💾 Save</Button>
          <Button variant="outline" size="sm">📤 Export</Button>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 bg-gray-100 p-4">
          <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
            <div className="text-center text-gray-500">
              <p className="text-4xl">🏗️</p>
              <p className="mt-4 text-lg font-medium">Start designing</p>
              <p className="mt-2 text-sm">Type in the chat to add components</p>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex w-96 flex-col border-l bg-white">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                <p className="text-3xl">💬</p>
                <p className="mt-4 font-medium">Start a conversation</p>
                <p className="mt-2 text-sm">Try: &quot;Design Twitter&quot;</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg bg-gray-100 px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.1s' }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your architecture..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple response generator (fallback when AI not working)
function getSimpleResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('hello') || lower.includes('hi')) {
    return "👋 Hello! I'm SystemSketch. I can help you design system architectures.\n\nTry saying:\n• \"Design Twitter\"\n• \"Design a URL shortener\"\n• \"Design an e-commerce backend\"";
  }

  if (lower.includes('twitter')) {
    return "🐦 **Twitter Architecture**\n\nCore components needed:\n\n• **API Gateway** - Handle incoming requests\n• **User Service** - Authentication & profiles\n• **Tweet Service** - Create, read tweets\n• **Timeline Service** - Generate user feeds\n• **Database** - PostgreSQL for users, tweets\n• **Cache** - Redis for hot data\n• **Message Queue** - Kafka for async processing\n\nWould you like me to add any of these to the canvas?";
  }

  if (lower.includes('url') || lower.includes('shortener')) {
    return "🔗 **URL Shortener Architecture**\n\nComponents:\n\n• **API Gateway** - Handle requests\n• **URL Service** - Generate short codes\n• **Database** - Store URL mappings\n• **Cache** - Redis for fast lookups\n• **Analytics** - Track clicks\n\nShall I add these to your design?";
  }

  if (lower.includes('database') || lower.includes('db')) {
    return "🗄️ **Database Options**\n\n• **PostgreSQL** - Relational, ACID compliant\n• **MongoDB** - Document store, flexible schema\n• **Redis** - In-memory cache\n• **Cassandra** - Wide column, high scale\n\nWhich type do you need?";
  }

  if (lower.includes('add') || lower.includes('create')) {
    return "✅ I'll add that component to your architecture.\n\n(Note: Visual canvas rendering coming soon!)";
  }

  return `🤔 I understand you want to work on: "${input}"\n\nI can help you design system architectures. Try:\n• "Design [system name]"\n• "Add [component type]"\n• "What about caching?"`;
}