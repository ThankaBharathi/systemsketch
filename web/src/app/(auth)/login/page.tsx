'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const errorParam = searchParams.get('error');

  // ✅ Login-specific error messaging
  const getErrorMessage = () => {
    if (error) return error;

    if (errorParam === 'OAuthAccountNotLinked') {
      return (
        'You previously signed in using a different provider. ' +
        'Please continue with the same provider to access your account.'
      );
    }

    if (errorParam) {
      return 'Unable to sign in. Please try again.';
    }

    return null;
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(provider);
      setError(null);

      await signIn(provider, {
        callbackUrl: '/dashboard',
      });
    } catch {
      setError('Something went wrong. Please try again.');
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
              Welcome back!
            </h1>
            <p className="mt-2 text-gray-600">
              Sign in to continue building architectures
            </p>
          </div>

          {/* Error */}
          {getErrorMessage() && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {getErrorMessage()}
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
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => handleOAuthSignIn('github')}
              disabled={isLoading !== null}
              isLoading={isLoading === 'github'}
            >
              Continue with GitHub
            </Button>
          </div>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t" />
            <span className="px-4 text-sm text-gray-500">
              Quick & secure login
            </span>
            <div className="flex-1 border-t" />
          </div>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:underline">
              Sign up
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
