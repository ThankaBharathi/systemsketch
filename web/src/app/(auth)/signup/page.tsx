'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(provider);
      setError(null);

      await signIn(provider, {
        callbackUrl: '/dashboard',
      });
    } catch {
      setError('This email is already registered. Please log in instead.');
      setIsLoading(null);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <Link href="/" className="mb-4 inline-flex items-center space-x-2">
              <span className="text-3xl">🏗️</span>
              <span className="text-2xl font-bold">SystemSketch</span>
            </Link>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="mt-2 text-gray-600">
              Start building system architectures today
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* OAuth */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading !== null}
              isLoading={isLoading === 'google'}
            >
              Sign up with Google
            </Button>

            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => handleOAuthSignIn('github')}
              disabled={isLoading !== null}
              isLoading={isLoading === 'github'}
            >
              Sign up with GitHub
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="underline">
              Terms
            </Link>{' '}
            &{' '}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </p>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t" />
            <span className="px-4 text-sm text-gray-500">
              Quick & secure signup
            </span>
            <div className="flex-1 border-t" />
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          <Link href="/" className="hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
