import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: session.id },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return NextResponse.json({ notifications });
    } catch (error) {
        console.error('Fetch Notifications Error:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.notification.updateMany({
            where: {
                userId: session.id,
                read: false
            },
            data: { read: true }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update Notifications Error:', error);
        return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
    }
}
