// components/layout/navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Download, Save } from 'lucide-react';

interface NavbarProps {
  designName: string;
  onDesignNameChange: (name: string) => void;
  onExport: () => void;
  onSave: () => void;
  isSaving: boolean;
  nodeCount: number;
}

export function Navbar({
  designName,
  onDesignNameChange,
  onExport,
  onSave,
  isSaving,
  nodeCount,
}: NavbarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme or system preference
    setTheme('light')
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🏗️</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">SystemSketch</span>
        </Link>
        
        <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-700" />
        
        {/* Editable Design Name */}
        {isEditing ? (
          <input
            type="text"
            value={designName}
            onChange={(e) => onDesignNameChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-900 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-lg transition text-sm truncate max-w-[150px]"
          >
            {designName}
          </button>
        )}
        
        {nodeCount > 0 && (
          <span className="hidden sm:inline-flex px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
            {nodeCount} nodes
          </span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        {mounted && (
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </button>
        )}

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaving || nodeCount === 0}
          className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onExport}
          disabled={nodeCount === 0}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </header>
  );
}