// app/(dashboard)/settings/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ArrowLeft, User, Palette, Trash2 } from 'lucide-react';
import { useHistoryStore } from '@/lib/stores';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { clearAll } = useHistoryStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearData = () => {
    clearAll();
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  defaultValue={session?.user?.name || ''}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={session?.user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
                
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
          </div>

          <div className="space-y-3 text-sm text-gray-600">
            <p>• Designs are saved automatically in your session.</p>
            <p>• Optimized light theme for interviews & clarity.</p>
            <p>• Export architecture diagrams anytime.</p>
          </div>
        </div>


          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border border-red-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
            </div>
            {showConfirm ? (
              <div className="space-y-3">
                <p className="text-red-600">Are you sure? This will delete all your saved designs.</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleClearData}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Yes, Delete All
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                Clear All Data
              </button>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}