'use client';

import { TamboProvider as TamboSDKProvider } from '@tambo-ai/react';
import type { ReactNode } from 'react';

import { components } from './components';

interface TamboProviderProps {
  children: ReactNode;
}

export function TamboProvider({ children }: TamboProviderProps) {
  return (
    <TamboSDKProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
    >
      {children}
    </TamboSDKProvider>
  );
}
