import { notFound, redirect } from 'next/navigation';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

import { DesignEditor } from './design-editor';

interface DesignPageProps {
  params: Promise<{ id: string }>;
}

export default async function DesignPage({ params }: DesignPageProps) {
  // ✅ UNWRAP params
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const design = await prisma.design.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!design || design.userId !== session.user.id) {
    notFound();
  }

  return (
    <DesignEditor
      design={{
        id: design.id,
        name: design.name,
        nodes: design.nodes as unknown[],
        connections: design.connections as unknown[],
      }}
      initialMessages={design.messages.map((m) => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))}
    />
  );
}
