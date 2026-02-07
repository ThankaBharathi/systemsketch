// components/providers/tambo-provider.tsx
'use client';

import { ReactNode, createContext, useContext, useState, useCallback } from 'react';
import { isTamboConfigured } from '@/lib/tambo';

// =============================================================================
// CONTEXT FOR TAMBO STATE
// =============================================================================

interface TamboContextValue {
  isConfigured: boolean;
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearError: () => void;
}

const TamboContext = createContext<TamboContextValue | null>(null);

export function useTamboContext() {
  const context = useContext(TamboContext);
  if (!context) {
    throw new Error('useTamboContext must be used within TamboProvider');
  }
  return context;
}

// =============================================================================
// TAMBO PROVIDER WRAPPER
// =============================================================================

interface TamboProviderProps {
  children: ReactNode;
}

export function TamboProvider({ children }: TamboProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isConfigured = isTamboConfigured();

  const clearError = useCallback(() => setError(null), []);

  const sendMessage = useCallback(async (message: string) => {
    if (!isConfigured) {
      setError('Tambo API key is not configured. Set NEXT_PUBLIC_TAMBO_API_KEY in .env.local');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Placeholder for actual Tambo integration
      // When Tambo is properly set up, this will be replaced
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured]);

  const contextValue: TamboContextValue = {
    isConfigured,
    isLoading,
    error,
    sendMessage,
    clearError,
  };

  // For now, we just provide context without actual Tambo integration
  // This prevents errors when Tambo package isn't properly configured
  return (
    <TamboContext.Provider value={contextValue}>
      {children}
    </TamboContext.Provider>
  );
}

// =============================================================================
// HOOK FOR USING TAMBO
// =============================================================================

export function useTambo() {
  return useTamboContext();
}