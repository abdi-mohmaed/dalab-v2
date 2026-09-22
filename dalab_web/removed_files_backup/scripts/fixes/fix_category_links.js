const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
    try {
        // 1. Get all categories
        const categories = await prisma.category.findMany();
        const categoryMap = {};
        categories.forEach(c => {
            categoryMap[c.name.toLowerCase()] = c.id;
        });

        console.log('Category Map (slug/name -> ID):');
        console.log(JSON.stringify(categoryMap, null, 2));

        // 2. Get all products
        const products = await prisma.product.findMany();
        console.log(`Checking ${products.length} products...`);

        let updatedCount = 0;
        for (const p of products) {
            // Find category by title/description hint if categoryId is invalid
            // Or just use the source property if we set it

            let targetCategoryId = null;
            const title = p.title.toLowerCase();
            const desc = (p.description || '').toLowerCase();

            if (title.includes('home') || desc.includes('kitchen')) targetCategoryId = categoryMap['home & kitchen'] || categoryMap['home applicable'] || categoryMap['home kitchen'];
            else if (desc.includes('accessories')) targetCategoryId = categoryMap['accessories'];
            else if (desc.includes('clothing')) targetCategoryId = categoryMap['clothing'];
            else if (desc.includes('mobile') || title.includes('iphone')) targetCategoryId = categoryMap['phones'] || categoryMap['mobiles'];
            else if (desc.includes('personal care')) targetCategoryId = categoryMap['personal care'];
            else if (desc.includes('appliance')) targetCategoryId = categoryMap['home appliances'];
            else if (desc.includes('electronic')) targetCategoryId = categoryMap['electronic equipment'];
            else if (desc.includes('beauty')) targetCategoryId = categoryMap['beauty'];

            if (targetCategoryId) {
                await prisma.product.update({
                    where: { id: p.id },
                    data: { categoryId: targetCategoryId }
                });
                updatedCount++;
            }
        }

        console.log(`Successfully updated ${updatedCount} products with correct category links.`);

    } catch (e) {
        console.error('Error during fix:', e);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
