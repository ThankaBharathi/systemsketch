// components/layout/mobile-nav.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold">Menu</span>
                <button onClick={onClose} className="text-2xl">✕</button>
              </div>
              
              <nav className="space-y-2">
                {[
                  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
                  { name: 'My Designs', href: '/designs', icon: '📁' },
                  { name: 'Templates', href: '/templates', icon: '📋' },
                  { name: 'Interview Mode', href: '/interview', icon: '🎯' },
                  { name: 'Settings', href: '/settings', icon: '⚙️' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}