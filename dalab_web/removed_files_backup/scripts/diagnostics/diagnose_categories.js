const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        console.log('--- CATEGORIES & PRODUCT COUNTS ---');
        categories.forEach(c => {
            console.log(`Category: ${c.name} (${c.id}) | Products: ${c._count.products}`);
        });

        const orphanProducts = await prisma.product.count({
            where: { categoryId: null }
        });
        console.log('\nOrphan Products (no category):', orphanProducts);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
