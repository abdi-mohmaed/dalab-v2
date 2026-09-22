import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PUT /api/admin/tags/[id] - Update tag
export async function PUT(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await props.params;
        const body = await request.json();
        const { displayName, color, icon } = body;

        const tag = await prisma.tag.update({
            where: { id },
            data: {
                ...(displayName && { displayName }),
                ...(color && { color }),
                ...(icon !== undefined && { icon })
            }
        });

        return NextResponse.json(tag);
    } catch (error: any) {
        console.error('Error updating tag:', error);
        if (error.code === 'P2025') return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
        return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
    }
}

// DELETE /api/admin/tags/[id] - Delete tag
export async function DELETE(
    request: Request,
    { params }: { params: Promise<Record<string, string | string[] | undefined>> }
) {
    try {
        const { id } = await params as { id: string };
        await prisma.tag.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Tag deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting tag:', error);
        if (error.code === 'P2025') return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
        return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
    }
}
