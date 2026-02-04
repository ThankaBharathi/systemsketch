'use client';

import type { TamboComponent } from '@tambo-ai/react';

// Component registry - AI will choose from these
export const components: TamboComponent[] = [
  {
    name: 'WelcomeMessage',
    description: 'Shows a welcome message when user says hello or starts a conversation',
    component: ({ message }: { message: string }) => (
      <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
        <p className="font-medium">👋 {message}</p>
      </div>
    ),
    propsSchema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'The welcome message to display',
        },
      },
      required: ['message'],
    },
  },

  {
    name: 'GuidanceCard',
    description: 'Shows helpful guidance when user asks non-architecture questions',
    component: ({ title, suggestions }: { title: string; suggestions: string[] }) => (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="font-semibold text-blue-900">{title}</h3>
        <p className="mt-2 text-sm text-blue-700">
          I can help you design system architectures. Try:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 hover:bg-blue-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    ),
    propsSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The guidance title',
        },
        suggestions: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of suggested prompts',
        },
      },
      required: ['title', 'suggestions'],
    },
  },

  {
    name: 'ArchitectureOverview',
    description: 'Shows an overview of the architecture being designed',
    component: ({
      title,
      description,
      components: archComponents,
    }: {
      title: string;
      description: string;
      components: string[];
    }) => (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
        {archComponents.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Components:</p>
            <ul className="mt-2 space-y-1">
              {archComponents.map((comp, i) => (
                <li key={i} className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">•</span>
                  {comp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ),
    propsSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Architecture title',
        },
        description: {
          type: 'string',
          description: 'Architecture description',
        },
        components: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of architecture components',
        },
      },
      required: ['title', 'description', 'components'],
    },
  },
];
