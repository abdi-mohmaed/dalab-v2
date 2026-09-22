const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = [
        { name: 'Home & Kitchen', id: 'cat_home_kitchen' },
        { name: 'Accessories', id: 'cat_accessories' },
        { name: 'Clothing', id: 'cat_clothing' }
    ];

    for (const cat of categories) {
        // First check by ID
        let existing = await prisma.category.findUnique({
            where: { id: cat.id }
        });

        // Then check by name if not found by ID
        if (!existing) {
            existing = await prisma.category.findFirst({
                where: { name: cat.name }
            });
        }

        if (!existing) {
            const created = await prisma.category.create({
                data: {
                    id: cat.id,
                    name: cat.name
                }
            });
            console.log(`Created category: ${created.name} (${created.id})`);
        } else {
            console.log(`Category exists: ${existing.name} (${existing.id})`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
