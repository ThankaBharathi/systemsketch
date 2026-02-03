import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui';

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏗️</span>
            <span className="text-xl font-bold">SystemSketch</span>
          </div>

          <nav className="flex items-center space-x-4">
            {session ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
    </main>
  );
}
