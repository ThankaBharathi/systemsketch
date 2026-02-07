// components/guidance/guidance-card.tsx
'use client';

import { Lightbulb, ArrowRight } from 'lucide-react';

interface GuidanceCardProps {
  title: string;
  message: string;
  suggestions: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export function GuidanceCard({
  title,
  message,
  suggestions,
  onSuggestionClick,
}: GuidanceCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 max-w-md shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Lightbulb className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm mt-1">{message}</p>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Try these instead:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
                className="
                  group flex items-center gap-1.5
                  bg-white hover:bg-blue-600
                  text-gray-700 hover:text-white
                  text-sm font-medium
                  px-3 py-2 rounded-lg
                  border border-gray-200 hover:border-blue-600
                  transition-all duration-200
                  shadow-sm hover:shadow-md
                "
              >
                <span>{suggestion}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}