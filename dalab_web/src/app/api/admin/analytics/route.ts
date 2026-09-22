import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Basic Stats
        const [totalOrders, totalUsers, totalProducts, paidOrders] = await Promise.all([
            prisma.order.count(),
            prisma.user.count({ where: { role: 'USER' } }),
            prisma.product.count({ where: { status: 'ACTIVE' } }),
            prisma.order.findMany({
                where: { status: { in: ['PAID', 'DELIVERED', 'PROCESSING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY'] } },
                select: { totalAmount: true }
            })
        ]);

        const totalRevenue = paidOrders.reduce((sum: number, order: { totalAmount: number }) => sum + order.totalAmount, 0);

        // 2. Daily Sales Data (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentOrders = await prisma.order.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo },
                status: { in: ['PAID', 'DELIVERED', 'PROCESSING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY'] }
            },
            select: {
                createdAt: true,
                totalAmount: true
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by day
        const salesByDay = recentOrders.reduce((acc: Record<string, number>, order: { createdAt: Date, totalAmount: number }) => {
            const date = order.createdAt.toISOString().split('T')[0];
            if (!acc[date]) acc[date] = 0;
            acc[date] += order.totalAmount;
            return acc;
        }, {});

        const chartData = Object.keys(salesByDay).map(date => ({
            name: date,
            sales: salesByDay[date]
        }));

        // 3. Top Products (Mocked logic for now as we'd need OrderItem joins)
        // In a real app, you'd join OrderItem and Product to find top sellers
        const topProducts = await prisma.product.findMany({
            take: 5,
            include: { category: true },
            where: { status: 'ACTIVE' }
        });

        return NextResponse.json({
            stats: {
                revenue: totalRevenue,
                orders: totalOrders,
                customers: totalUsers,
                products: totalProducts
            },
            chartData,
            topProducts: topProducts.map((p: any) => ({
                id: p.id,
                title: p.title,
                sales: Math.floor(Math.random() * 100) + 10, // Mock sales count
                revenue: p.price ? p.price * 20 : 0 // Mock revenue
            }))
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
