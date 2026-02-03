import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserMenu } from "./user-menu";

export default async function DashboardPage() {
  const session = await auth();

  const designs = await prisma.design.findMany({
    where: { userId: session?.user?.id },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏗️</span>
            <span className="text-xl font-bold">SystemSketch</span>
          </div>
          <UserMenu user={session?.user} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        {designs.length === 0 ? (
          <p className="text-gray-500">No designs yet.</p>
        ) : (
          <ul className="space-y-2">
            {designs.map((design) => (
              <li
                key={design.id}
                className="rounded border bg-white p-4"
              >
                <h3 className="font-semibold">{design.name}</h3>
                {design.description && (
                  <p className="text-sm text-gray-600">
                    {design.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
