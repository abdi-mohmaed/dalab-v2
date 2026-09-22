import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Dynamic route params are Promises in Next.js 15
) {
    const { id } = await params;
    try {
        const sections = await prisma.homepageSection.findMany({
            where: {
                active: true,
                categoryId: id
            },
            orderBy: { order: 'asc' }
        });

        const sectionsWithData = await Promise.all(sections.map(async (section) => {
            if (section.type === 'PRODUCTS' && (section.config as any)?.productIds) {
                const products = await prisma.product.findMany({
                    where: {
                        id: { in: (section.config as any).productIds },
                        status: 'ACTIVE'
                    },
                    include: { store: true }
                });
                return { ...section, products };
            }
            return section;
        }));

        return NextResponse.json({ sections: sectionsWithData });
    } catch (error) {
        console.error('Category sections fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch category sections' }, { status: 500 });
    }
}
