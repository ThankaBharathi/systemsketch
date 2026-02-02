/** @type {import('eslint').Linter.Config} */
module.exports = {
  // Where this config applies
  root: true,

  // Environment settings
  env: {
    browser: true,      // Browser globals (window, document)
    es2022: true,       // Modern JavaScript
    node: true,         // Node.js globals
    jest: true,         // Jest testing globals
  },

  // Extend recommended configs
  extends: [
    'eslint:recommended',                      // Basic ESLint rules
    'plugin:@typescript-eslint/recommended',   // TypeScript rules
    'plugin:react/recommended',                // React rules
    'plugin:react-hooks/recommended',          // React Hooks rules
    'plugin:jsx-a11y/recommended',             // Accessibility rules
    'plugin:import/recommended',               // Import/export rules
    'plugin:import/typescript',                // TypeScript imports
    'next/core-web-vitals',                    // Next.js rules
    'prettier',                                // Disable formatting rules (Prettier handles it)
  ],

  // TypeScript parser
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  // Plugins
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
  ],

  // Custom rules
  rules: {
    // ===== ERRORS (will fail CI) =====
    
    // No unused variables (but allow _unused pattern)
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],

    // No any type (enforce proper typing)
    '@typescript-eslint/no-explicit-any': 'error',

    // No console.log in production (use proper logging)
    'no-console': ['error', { allow: ['warn', 'error'] }],

    // Require === instead of ==
    'eqeqeq': ['error', 'always'],

    // No var, use let/const
    'no-var': 'error',

    // Prefer const when variable is never reassigned
    'prefer-const': 'error',


    // ===== WARNINGS (should fix but won't fail CI) =====

    // React Hooks dependencies
    'react-hooks/exhaustive-deps': 'warn',


    // ===== OFF (disabled rules) =====

    // React 17+ doesn't need React import
    'react/react-in-jsx-scope': 'off',

    // Next.js handles this
    'react/prop-types': 'off',

    // Allow empty interfaces for extending
    '@typescript-eslint/no-empty-interface': 'off',


    // ===== IMPORT ORDERING =====
    'import/order': ['error', {
      groups: [
        'builtin',      // Node.js built-in modules
        'external',     // npm packages
        'internal',     // Our aliases (@/...)
        'parent',       // Parent imports (../)
        'sibling',      // Same folder imports (./)
        'index',        // Index imports
        'type',         // Type imports
      ],
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    }],
  },

  // Settings
  settings: {
    react: {
      version: 'detect',  // Auto-detect React version
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },

  // Ignore patterns
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'coverage/',
    '*.config.js',
    '*.config.ts',
  ],
};