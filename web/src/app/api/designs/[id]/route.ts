import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateDesignSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  nodes: z.string().optional(),
  edges: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    const design = await prisma.design.findUnique({ where: { id } });

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    const isOwner = session?.user?.id === design.userId;
    if (!design.isPublic && !isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ design, isOwner });
  } catch (error) {
    console.error('Error fetching design:', error);
    return NextResponse.json({ error: 'Failed to fetch design' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const existing = await prisma.design.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    if (existing.userId !== session.user.id) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    const body = await request.json();
    const result = updateDesignSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data', details: result.error.flatten() }, { status: 400 });
    }

    const design = await prisma.design.update({ where: { id }, data: result.data });
    return NextResponse.json({ design });
  } catch (error) {
    console.error('Error updating design:', error);
    return NextResponse.json({ error: 'Failed to update design' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const existing = await prisma.design.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    if (existing.userId !== session.user.id) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    await prisma.design.delete({ where: { id } });
    return NextResponse.json({ message: 'Design deleted successfully' });
  } catch (error) {
    console.error('Error deleting design:', error);
    return NextResponse.json({ error: 'Failed to delete design' }, { status: 500 });
  }
}