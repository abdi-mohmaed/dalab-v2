import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
            include: { order: { select: { id: true, userId: true } } }
        });
        return NextResponse.json({ logs });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
    }
}
