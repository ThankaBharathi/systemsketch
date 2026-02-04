import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export default async function NewDesignPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Create a new design in database
  const design = await prisma.design.create({
    data: {
      name: 'Untitled Design',
      userId: session.user.id,
      nodes: [],
      connections: [],
    },
  });

  // Redirect to the design editor with the new ID
  redirect(`/design/${design.id}`);
}
