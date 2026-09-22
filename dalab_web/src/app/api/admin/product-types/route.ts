import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const productTypes = await prisma.productType.findMany({
            include: {
                attributes: true
            }
        });

        return NextResponse.json({
            data: productTypes
        });
    } catch (error: any) {
        console.error('Error fetching product types:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch product types' },
            { status: 500 }
        );
    }
}
