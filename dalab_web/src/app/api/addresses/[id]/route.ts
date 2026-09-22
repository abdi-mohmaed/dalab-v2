import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

/**
 * GET /api/addresses/[id]
 * PUT /api/addresses/[id]
 * DELETE /api/addresses/[id]
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const address = await prisma.address.findFirst({
            where: { id, userId: session.id },
        });

        if (!address) {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 });
        }

        return NextResponse.json(address);
    } catch (error) {
        console.error('Error fetching address:', error);
        return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Check ownership
        const existingAddress = await prisma.address.findFirst({
            where: { id, userId: session.id },
        });

        if (!existingAddress) {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 });
        }

        if (body.isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.id, isDefault: true },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error('Error updating address:', error);
        return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Check ownership
        const existingAddress = await prisma.address.findFirst({
            where: { id, userId: session.id },
        });

        if (!existingAddress) {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 });
        }

        await prisma.address.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting address:', error);
        return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
    }
}
