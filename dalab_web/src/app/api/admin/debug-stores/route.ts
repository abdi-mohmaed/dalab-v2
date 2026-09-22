
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const stores = await prisma.store.findMany();
        return NextResponse.json({
            count: stores.length,
            stores: stores.map(s => ({ id: s.id, name: s.name }))
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
