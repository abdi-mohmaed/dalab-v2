
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        // Delete all products for a full reset
        const { count } = await prisma.product.deleteMany({});
        return NextResponse.json({ success: true, count, message: 'Deleted ALL products' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
