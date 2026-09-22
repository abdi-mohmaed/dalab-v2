
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            select: {
                id: true,
                title: true,
                source: true,
                variants: {
                    select: { sku: true }
                }
            }
        });
        return NextResponse.json({
            count: products.length,
            products: products.map(p => ({
                title: p.title,
                source: p.source,
                skus: p.variants.map(v => v.sku)
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
