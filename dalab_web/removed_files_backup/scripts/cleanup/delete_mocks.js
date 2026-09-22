const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteMocks() {
    console.log('Starting deletion of mock data...');

    const mockProductIds = ['1', '2', '3', '4', '5', 'p1', 'p2', 'p3'];
    const mockCategoryIds = ['cat1', 'cat2', 'cat3'];

    try {
        // 1. Delete mock products
        const productResult = await prisma.product.deleteMany({
            where: {
                id: { in: mockProductIds }
            }
        });
        console.log(`Deleted ${productResult.count} mock products.`);

        // 2. Delete mock categories
        const categoryResult = await prisma.category.deleteMany({
            where: {
                id: { in: mockCategoryIds }
            }
        });
        console.log(`Deleted ${categoryResult.count} mock categories.`);

        // 3. Optional: Delete any product that doesn't have a prefix we recognize or is just "iPhone 15 Pro" from the old seed
        const oldSeedTitles = ['iPhone 15 Pro', 'AirPods Pro (2nd Gen)'];
        const seedResult = await prisma.product.deleteMany({
            where: {
                title: { in: oldSeedTitles }
            }
        });
        console.log(`Deleted ${seedResult.count} leftover products from old seed.`);

    } catch (e) {
        console.error('Error deleting mocks:', e);
    } finally {
        await prisma.$disconnect();
    }
}

deleteMocks();
