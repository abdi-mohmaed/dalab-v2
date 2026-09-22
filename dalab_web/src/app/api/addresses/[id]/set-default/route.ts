import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

/**
 * POST /api/addresses/[id]/set-default
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

        // Unset other defaults
        await prisma.address.updateMany({
            where: { userId: session.id, isDefault: true },
            data: { isDefault: false },
        });

        // Set this one as default
        const address = await prisma.address.update({
            where: { id },
            data: { isDefault: true },
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error('Error setting default address:', error);
        return NextResponse.json({ error: 'Failed to set default address' }, { status: 500 });
    }
}
