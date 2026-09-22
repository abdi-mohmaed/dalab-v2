import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const stores = await prisma.store.findMany({
            where: {
                status: 'ACTIVE'
            },
            select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                description: true
            }
        });

        return NextResponse.json({
            data: stores
        });
    } catch (error) {
        console.error('Error fetching stores:', error);
        return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 });
    }
}
