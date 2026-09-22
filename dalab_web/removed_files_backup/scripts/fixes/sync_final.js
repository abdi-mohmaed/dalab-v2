const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function sync() {
    console.log('Starting definitive category alignment...');

    const userFolders = [
        { name: 'accessories', prefix: 'acc_' },
        { name: 'beauty', prefix: 'beauty_' },
        { name: 'clothing', prefix: 'clo_' },
        { name: 'electronics', prefix: 'elec_' },
        { name: 'home & kitchen', prefix: 'hk_' },
        { name: 'home appliances', prefix: 'home_' },
        { name: 'mobiles', prefix: 'mob_' },
        { name: 'personal care', prefix: 'care_' }
    ];

    try {
        // 1. Ensure categories exist with exact names from folders
        const categoryMap = {};
        for (const folder of userFolders) {
            const cat = await prisma.category.upsert({
                where: { name: folder.name },
                update: {},
                create: { name: folder.name }
            });
            categoryMap[folder.prefix] = cat.id;
            console.log(`Synchronized category: ${cat.name} (${cat.id})`);
        }

        // 2. Link products based on prefix
        console.log('\nLinking products to categories...');
        let totalLinked = 0;

        for (const [prefix, categoryId] of Object.entries(categoryMap)) {
            const result = await prisma.product.updateMany({
                where: {
                    id: { startsWith: prefix }
                },
                data: {
                    categoryId: categoryId
                }
            });
            console.log(`Linked ${result.count} products with prefix "${prefix}" to category ID ${categoryId}`);
            totalLinked += result.count;
        }

        // 3. Update Homepage Sections to include these categories
        console.log('\nUpdating Homepage Sections...');
        const categories = await prisma.category.findMany({
            where: {
                name: { in: userFolders.map(f => f.name) }
            }
        });

        const categoryIds = categories.map(c => c.id);

        const categorySection = await prisma.homepageSection.findFirst({
            where: { type: 'CATEGORIES' }
        });

        if (categorySection) {
            await prisma.homepageSection.update({
                where: { id: categorySection.id },
                data: {
                    config: { categoryIds: categoryIds }
                }
            });
            console.log('Updated "Shop by Category" section on homepage.');
        }

        // 4. Set Recommended products (choose a few from each)
        const recommendedSection = await prisma.homepageSection.findFirst({
            where: { type: 'PRODUCTS' }
        });

        if (recommendedSection) {
            const sampleProducts = await prisma.product.findMany({
                take: 8,
                select: { id: true }
            });

            await prisma.homepageSection.update({
                where: { id: recommendedSection.id },
                data: {
                    config: { productIds: sampleProducts.map(p => p.id) }
                }
            });
            console.log('Updated "Recommended for You" section on homepage.');
        }

        console.log(`\nFinal Sync Complete! Total products correctly linked: ${totalLinked}`);

    } catch (e) {
        console.error('Error during sync:', e);
    } finally {
        await prisma.$disconnect();
    }
}

sync();
