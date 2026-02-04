import { redirect } from 'next/navigation';

import { auth } from '@/auth';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // v5: Use auth() instead of getServerSession()
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <>{children}</>;
}