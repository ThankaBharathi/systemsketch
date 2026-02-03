'use client';

import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';


interface UserMenuProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100"
      >
        {/* Avatar */}
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name || 'User'}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
            {user?.name?.[0] || user?.email?.[0] || '?'}
          </div>
        )}
        <span className="hidden text-sm font-medium sm:block">
          {user?.name || user?.email}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
            {/* User info */}
            <div className="border-b px-4 py-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            {/* Menu items */}
            <div className="py-2">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}