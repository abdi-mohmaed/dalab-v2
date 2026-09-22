import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const ads = await prisma.ad.findMany({
            where: { active: true },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ ads });
    } catch (error) {
        console.error('Ads fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch ads' }, { status: 500 });
    }
}
