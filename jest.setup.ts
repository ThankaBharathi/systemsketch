// Import Jest DOM matchers
import '@testing-library/jest-dom';

// ========================================
// MOCK: Next.js Router
// ========================================
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// ========================================
// MOCK: Next.js Image
// ========================================
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// ========================================
// MOCK: Tambo SDK
// ========================================
jest.mock('@tambo-ai/react', () => ({
  useTambo: () => ({
    sendMessage: jest.fn(),
    messages: [],
    isLoading: false,
    error: null,
  }),
  TamboProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// ========================================
// GLOBAL: Suppress console errors in tests
// ========================================
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Ignore React act() warnings
    if (typeof args[0] === 'string' && args[0].includes('act(')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// ========================================
// GLOBAL: Clean up after each test
// ========================================
afterEach(() => {
  jest.clearAllMocks();
});