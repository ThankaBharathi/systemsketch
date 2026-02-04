import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userMessage, assistantMessage } = await req.json();

    // Verify design belongs to user
    const design = await prisma.design.findUnique({
      where: { id: params.id },
    });

    if (!design || design.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Create both messages
    await prisma.message.createMany({
      data: [
        {
          designId: params.id,
          role: 'user',
          content: userMessage,
        },
        {
          designId: params.id,
          role: 'assistant',
          content: assistantMessage,
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving messages:', error);
    return NextResponse.json(
      { error: 'Failed to save messages' },
      { status: 500 }
    );
  }
}
