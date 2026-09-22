const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('--- STARTING TOTAL CLEANUP ---');

    try {
        // 1. Clear transactional data first (dependent on variants/products)
        console.log('Clearing Cart Items...');
        await prisma.cartItem.deleteMany({});

        console.log('Clearing Order Items...');
        await prisma.orderItem.deleteMany({});

        console.log('Clearing Audit Logs...');
        await prisma.auditLog.deleteMany({});

        console.log('Clearing Notifications...');
        await prisma.notification.deleteMany({});

        console.log('Clearing Refunds...');
        await prisma.refund.deleteMany({});

        console.log('Clearing Delivery Assignments...');
        await prisma.deliveryAssignment.deleteMany({});

        console.log('Clearing Payments...');
        await prisma.payment.deleteMany({});

        console.log('Clearing Orders...');
        await prisma.order.deleteMany({});

        // 2. Clear social/user interaction data
        console.log('Clearing Reviews...');
        await prisma.review.deleteMany({});

        console.log('Clearing Wishlists...');
        await prisma.wishlist.deleteMany({});

        // 3. Clear product data (cascades to variants, attributes, images)
        console.log('Clearing Products (and Variants/Images via cascades)...');
        const { count } = await prisma.product.deleteMany({});

        console.log(`\n✅ CLEANUP COMPLETE! Deleted ${count} products and all related data.`);
    } catch (err) {
        console.error('❌ ERROR DURING CLEANUP:', err);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
