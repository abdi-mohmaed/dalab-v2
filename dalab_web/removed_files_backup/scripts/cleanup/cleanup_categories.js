const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
    console.log('Starting category cleanup...');

    const targetNames = [
        'accessories',
        'beauty',
        'clothing',
        'electronics',
        'home & kitchen',
        'home appliances',
        'mobiles',
        'personal care'
    ];

    try {
        // 1. Get all categories
        const allCategories = await prisma.category.findMany();

        const targetCategories = allCategories.filter(c => targetNames.includes(c.name));
        const extraCategories = allCategories.filter(c => !targetNames.includes(c.name));

        const targetMap = {};
        targetCategories.forEach(c => {
            targetMap[c.name] = c.id;
        });

        console.log(`Target categories found: ${targetCategories.length}`);
        console.log(`Extra categories found: ${extraCategories.length}`);

        // 2. Mapping for moving products from extra to target
        const migrationMap = {
            'phones': 'mobiles',
            'home kitchen': 'home & kitchen',
            'home applicable': 'home & kitchen',
            'supermarkets': 'home & kitchen' // Fallback
        };

        // 3. Move products from extra categories if a mapping exists or title matches
        for (const extra of extraCategories) {
            console.log(`Processing extra category: "${extra.name}" (${extra.id})`);

            const targetName = migrationMap[extra.name.toLowerCase()];
            const targetId = targetName ? targetMap[targetName] : null;

            if (targetId) {
                const moved = await prisma.product.updateMany({
                    where: { categoryId: extra.id },
                    data: { categoryId: targetId }
                });
                console.log(`  Moved ${moved.count} products to "${targetName}"`);
            } else {
                // If no mapping, move to 'best-match' based on title or just keep and delete category (orphaning)
                // Actually, let's just delete the empty ones and see if any products are left
                const productCount = await prisma.product.count({ where: { categoryId: extra.id } });
                if (productCount > 0) {
                    console.log(`  WARNING: Category "${extra.name}" still has ${productCount} products but no clear target mapping.`);
                }
            }
        }

        // 4. Delete the extra categories
        // We need to be careful with cascading or foreign keys
        for (const extra of extraCategories) {
            try {
                // Remove from HomepageSection config first if present
                const sections = await prisma.homepageSection.findMany();
                for (const section of sections) {
                    if (section.config && section.config.categoryIds && Array.isArray(section.config.categoryIds)) {
                        const newCategoryIds = section.config.categoryIds.filter(id => id !== extra.id);
                        if (newCategoryIds.length !== section.config.categoryIds.length) {
                            await prisma.homepageSection.update({
                                where: { id: section.id },
                                data: { config: { ...section.config, categoryIds: newCategoryIds } }
                            });
                        }
                    }
                }

                await prisma.category.delete({ where: { id: extra.id } });
                console.log(`  Deleted extra category: "${extra.name}"`);
            } catch (err) {
                console.log(`  Failed to delete category "${extra.name}": ${err.message}`);
                // If it fails, it probably still has products or is referenced elsewhere
            }
        }

        // 5. Final update of HomepageSection to include only the 8 target IDs in correct order
        const categorySection = await prisma.homepageSection.findFirst({
            where: { type: 'CATEGORIES' }
        });

        if (categorySection) {
            const finalCategoryIds = targetNames.map(name => targetMap[name]).filter(Boolean);
            await prisma.homepageSection.update({
                where: { id: categorySection.id },
                data: {
                    config: { categoryIds: finalCategoryIds }
                }
            });
            console.log('Finalized homepage categories list.');
        }

        console.log('Cleanup complete!');

    } catch (e) {
        console.error('Error during cleanup:', e);
    } finally {
        await prisma.$disconnect();
    }
}

cleanup();
