
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('--- Homepage Sections in DB ---');
    const dbSections = await prisma.homepageSection.findMany();
    console.log(dbSections.map(s => ({
        id: s.id,
        title: s.title,
        type: s.type,
        productIds: s.config?.productIds || []
    })));

    console.log('--- First 10 Products in DB ---');
    const products = await prisma.product.findMany({
        take: 10,
        select: { id: true, title: true }
    });
    console.log(products);

    // Check if any productIds from DB sections exist in the Product table
    for (const section of dbSections) {
        if (section.type === 'PRODUCTS' && section.config?.productIds) {
            const found = await prisma.product.findMany({
                where: { id: { in: section.config.productIds } }
            });
            console.log(`Section "${section.title}" (${section.id}) has ${section.config.productIds.length} IDs, found ${found.length} in DB`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
