const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkConfigs() {
    try {
        const productCount = await prisma.product.count();
        const categoryCount = await prisma.category.count();
        const storeCount = await prisma.store.count();
        const sectionCount = await prisma.homepageSection.count();

        console.log('--- Database Stats ---');
        console.log('Product Count:', productCount);
        console.log('Category Count:', categoryCount);
        console.log('Store Count:', storeCount);
        console.log('Homepage Section Count:', sectionCount);
        console.log('----------------------');

        if (sectionCount > 0) {
            const sections = await prisma.homepageSection.findMany();
            sections.forEach(s => {
                console.log(`Section: ${s.title} (${s.type})`);
                console.log('Config:', JSON.stringify(s.config, null, 2));
                console.log('---');
            });
        }
    } catch (e) {
        console.error('Error checking database:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkConfigs();
