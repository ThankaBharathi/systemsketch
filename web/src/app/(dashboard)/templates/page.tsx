// app/(dashboard)/templates/page.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const templates = [
  { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'bg-blue-500', description: 'Social media with feed, tweets, follows' },
  { id: 'netflix', name: 'Netflix', icon: '🎬', color: 'bg-red-500', description: 'Video streaming with recommendations' },
  { id: 'uber', name: 'Uber', icon: '🚗', color: 'bg-gray-900', description: 'Ride-sharing with real-time location' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: 'bg-green-500', description: 'Real-time messaging with presence' },
  { id: 'url', name: 'URL Shortener', icon: '🔗', color: 'bg-indigo-500', description: 'Simple URL shortening service' },
  { id: 'payment', name: 'Payment System', icon: '💳', color: 'bg-purple-500', description: 'Payment processing with orders' },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Templates</h1>
        <p className="text-gray-600 mb-8">Start with a pre-built architecture</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/design?template=${template.id}`}
              className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-indigo-300 transition-all"
            >
              <div className={`w-16 h-16 ${template.color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                {template.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-gray-600 text-sm">{template.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}