'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from './auth-provider';
import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}

export { AuthProvider } from './auth-provider';
export { ThemeProvider, useTheme } from './theme-provider';