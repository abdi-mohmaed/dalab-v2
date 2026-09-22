import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/tags - List all tags
export async function GET() {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: { createdAt: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        return NextResponse.json(tags);
    } catch (error: any) {
        console.error('Error fetching tags:', error);
        return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }
}

// POST /api/admin/tags - Create new tag
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, displayName, color, icon } = body;

        // Validation
        if (!name || !displayName) {
            return NextResponse.json({ error: 'Name and displayName are required' }, { status: 400 });
        }

        const tag = await prisma.tag.create({
            data: {
                name: name.toLowerCase().replace(/\s+/g, '-'),
                displayName,
                color: color || '#FF6B6B',
                icon: icon || null
            }
        });

        return NextResponse.json(tag, { status: 201 });
    } catch (error: any) {
        console.error('Error creating tag:', error);

        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Tag name already exists' }, { status: 409 });
        }

        return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
    }
}
