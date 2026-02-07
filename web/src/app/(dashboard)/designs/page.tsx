// app/(dashboard)/designs/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Trash2, ExternalLink, ArrowLeft } from 'lucide-react';
import { useHistoryStore } from '@/lib/stores';

export default function DesignsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { items, removeItem } = useHistoryStore();

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Designs</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl"
              />
            </div>
            <Link
              href="/design"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Design
            </Link>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-5xl mb-4">📁</div>
            <p className="text-gray-600 mb-4">No designs found</p>
            <Link
              href="/design"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Create your first design
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((design) => (
              <div key={design.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl">
                    🏗️
                  </div>
                  <button
                    onClick={() => removeItem(design.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{design.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {design.nodes.length} nodes • {formatDate(design.createdAt)}
                </p>
                <Link
                  href={`/design?load=${design.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-lg transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}