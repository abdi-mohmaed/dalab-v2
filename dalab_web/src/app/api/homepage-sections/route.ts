import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const sections = await prisma.homepageSection.findMany({
            where: {
                active: true,
                categoryId: null // Only fetch homepage sections
            },
            orderBy: { order: 'asc' }
        });

        // Fetch products for each section that requires them
        const finalSections = await Promise.all(sections.map(async (section: any) => {
            if (section.type === 'PRODUCTS') {
                let products: any[] = [];

                // Only fetch products if specific IDs are provided in the admin panel
                if (section.config?.productIds && section.config.productIds.length > 0) {
                    products = await prisma.product.findMany({
                        where: {
                            id: { in: section.config.productIds },
                            status: 'ACTIVE'
                        },
                        include: { store: true },
                        take: 20 // Allow more products if configured
                    });
                }

                return { ...section, products };
            }
            return section;
        }));

        return NextResponse.json({ sections: finalSections });
    } catch (error) {
        console.error('Homepage sections fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch homepage sections' }, { status: 500 });
    }
}
export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Save Section Request Body:', JSON.stringify(body, null, 2)); // DEBUG
        const { id, title, type, config, order, active, categoryId } = body;

        // Use 'upsert' if ID exists, otherwise 'create'
        let section;
        if (id && id !== 'new-id' && !id.startsWith('temp-')) {
            section = await prisma.homepageSection.upsert({
                where: { id },
                update: { title, type, config, order, active, categoryId },
                create: { id, title, type, config, order, active, categoryId }
            });
        } else {
            // New section
            section = await prisma.homepageSection.create({
                data: { title, type, config, order, active, categoryId }
            });
        }

        return NextResponse.json(section);
    } catch (error) {
        console.error('Homepage section save error:', error);
        return NextResponse.json({ error: 'Failed to save section' }, { status: 500 });
    }
}
