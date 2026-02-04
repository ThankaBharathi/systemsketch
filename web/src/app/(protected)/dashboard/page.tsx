import Link from 'next/link';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui';

import { UserMenu } from './user-menu';

export default async function DashboardPage() {
  // v5: Use auth() instead of getServerSession()
  const session = await auth();

  const designs = await prisma.design.findMany({
    where: { userId: session?.user?.id },
    orderBy: { updatedAt: 'desc' },
    take: 10,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏗️</span>
            <span className="text-xl font-bold">SystemSketch</span>
          </div>
          <UserMenu user={session?.user} />
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Create and manage your system architecture designs
          </p>
        </div>

        <div className="mb-8">
          <Link href="/design/new">
            <Button size="lg">
              <span className="mr-2">+</span>
              Create New Design
            </Button>
          </Link>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Your Designs ({designs.length})
          </h2>

          {designs.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
              <div className="text-5xl">🏗️</div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No designs yet
              </h3>
              <p className="mt-2 text-gray-500">
                Create your first system architecture design
              </p>
              <Link href="/design/new" className="mt-4 inline-block">
                <Button>Create Your First Design</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {designs.map((design) => (
                <Link
                  key={design.id}
                  href={`/design/${design.id}`}
                  className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-gray-100 text-4xl">
                    🏗️
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                    {design.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {design.description || 'No description'}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    Updated {new Date(design.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}