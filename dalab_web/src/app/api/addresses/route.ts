import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

async function getUserIdFromToken(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.userId as string;
    } catch {
        return null;
    }
}

/**
 * GET /api/addresses - List all addresses for the logged-in user
 * POST /api/addresses - Create a new address
 */
export async function GET(request: NextRequest) {
    const userId = await getUserIdFromToken(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(addresses);
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const userId = await getUserIdFromToken(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            fullName,
            phoneNumber,
            addressLine1,
            addressLine2,
            city,
            region,
            postalCode,
            isDefault
        } = body;

        // If this is set as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.create({
            data: {
                userId,
                fullName,
                phoneNumber,
                addressLine1,
                addressLine2,
                city,
                region,
                postalCode,
                isDefault: isDefault || false,
            },
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error('Error creating address:', error);
        return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
    }
}
