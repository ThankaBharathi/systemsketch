// First, check what Tambo actually exports
// This might need to change based on actual Tambo SDK version

// Option A: If Tambo uses createTamboClient
export function createTamboClient() {
  return {
    apiKey: process.env.NEXT_PUBLIC_TAMBO_API_KEY!,
  };
}

// Option B: Direct configuration
export const tamboConfig = {
  apiKey: process.env.NEXT_PUBLIC_TAMBO_API_KEY!,
};