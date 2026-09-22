import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/categories
 * Query Params:
 * - store: string (slug)
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const storeSlug = searchParams.get('store');

    try {
        const where: any = {};
        if (storeSlug) {
            where.products = {
                some: {
                    store: { slug: storeSlug.toLowerCase() }
                }
            };
        }

        const categories = await prisma.category.findMany({
            where,
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        return NextResponse.json({
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, image } = body;

        const category = await prisma.category.upsert({
            where: { id: id || 'new-category' },
            update: {
                name,
                image
            },
            create: {
                name,
                image
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('Error saving category:', error);
        return NextResponse.json({ error: 'Failed to save category' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    try {
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
