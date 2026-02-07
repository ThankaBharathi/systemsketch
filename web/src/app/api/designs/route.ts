import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createDesignSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  nodes: z.string(),
  edges: z.string(),
  thumbnailUrl: z.string().optional(),
  isPublic: z.boolean().optional().default(false),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ designs: [], total: 0 });
    }

    const designs = await prisma.design.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ designs, total: designs.length });
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json({ error: 'Failed to fetch designs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const result = createDesignSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data', details: result.error.flatten() }, { status: 400 });
    }

    const design = await prisma.design.create({
      data: { ...result.data, userId: session.user.id },
    });

    return NextResponse.json({ design }, { status: 201 });
  } catch (error) {
    console.error('Error creating design:', error);
    return NextResponse.json({ error: 'Failed to create design' }, { status: 500 });
  }
}