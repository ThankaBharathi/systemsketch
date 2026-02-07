// app/(dashboard)/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import { 
  Plus, 
  Search, 
  FolderOpen, 
  Trash2,
  ExternalLink,
  Settings,
  Target,
  LayoutDashboard,
  FileText,
  LogOut
} from 'lucide-react';
import { useHistoryStore } from '@/lib/stores';

const templates = [
  { id: 't1', name: 'Twitter', icon: '🐦', color: 'bg-blue-500' },
  { id: 't2', name: 'Netflix', icon: '🎬', color: 'bg-red-500' },
  { id: 't3', name: 'Uber', icon: '🚗', color: 'bg-gray-900' },
  { id: 't4', name: 'WhatsApp', icon: '💬', color: 'bg-green-500' },
  { id: 't5', name: 'URL', icon: '🔗', color: 'bg-indigo-500' },
  { id: 't6', name: 'Payment', icon: '💳', color: 'bg-purple-500' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const { items, removeItem } = useHistoryStore();

  const userName = session?.user?.name?.split(' ')[0] || 'Designer';

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleDeleteDesign = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeItem(id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏗️</span>
            <span className="text-xl font-bold text-gray-900">SystemSketch</span>
          </Link>
        </div>

        <nav className="px-4 space-y-1 flex-1">
          {[
            { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', active: true },
            { name: 'My Designs', icon: FolderOpen, href: '/designs' },
            { name: 'Templates', icon: FileText, href: '/templates' },
            { name: 'Interview Mode', icon: Target, href: '/interview' },
            { name: 'Settings', icon: Settings, href: '/settings' },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                item.active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-3 px-4 py-3
            bg-red-50 text-red-600
            hover:bg-red-600 hover:text-white
            rounded-xl transition-all duration-200
            font-medium shadow-sm">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userName} 👋
            </h1>
            <p className="text-gray-600">What will you design today?</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <Link
              href="/design"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Design</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Designs', value: items.length.toString(), icon: '📁', color: 'bg-blue-50' },
            { label: 'Components', value: items.reduce((acc, item) => acc + item.nodes.length, 0).toString(), icon: '🧩', color: 'bg-green-50' },
            { label: 'Templates Used', value: '6', icon: '📋', color: 'bg-purple-50' },
            { label: 'This Week', value: items.filter(i => new Date(i.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length.toString(), icon: '📈', color: 'bg-orange-50' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 ${stat.color} rounded-2xl`}
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Start Templates */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Start Templates</h2>
            <Link href="/templates" className="text-indigo-600 text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {templates.map((template) => (
              <Link
                key={template.id}
                href={`/design?template=${template.name.toLowerCase()}`}
                className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all text-center"
              >
                <div className={`w-12 h-12 ${template.color} rounded-xl flex items-center justify-center text-2xl mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                  {template.icon}
                </div>
                <p className="font-medium text-gray-900 text-sm">{template.name}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Designs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Designs</h2>
            <Link href="/designs" className="text-indigo-600 text-sm font-medium hover:underline">
              View all →
            </Link>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <div className="text-4xl mb-4">📁</div>
              <p className="text-gray-600 mb-4">No designs yet</p>
              <Link
                href="/design"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="w-4 h-4" />
                Create your first design
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Name</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden sm:table-cell">Components</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 hidden md:table-cell">Last Updated</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.slice(0, 5).map((design) => (
                    <tr key={design.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <Link href={`/design?load=${design.id}`} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">🏗️</div>
                          <span className="font-medium text-gray-900">{design.name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-600 hidden sm:table-cell">{design.nodes.length} nodes</td>
                      <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{formatDate(design.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/design?load=${design.id}`}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                            title="Open"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-600" />
                          </Link>
                          <button
                            onClick={(e) => handleDeleteDesign(design.id, e)}
                            className="p-2 hover:bg-red-100 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}