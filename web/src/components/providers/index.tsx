'use client';

import type { ReactNode } from 'react';

import { AuthProvider } from './auth-provider';
import { TamboProvider } from '@/lib/tambo';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <TamboProvider>
        {children}
      </TamboProvider>
    </AuthProvider>
  );
}
