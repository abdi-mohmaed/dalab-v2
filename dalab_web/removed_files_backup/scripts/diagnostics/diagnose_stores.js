const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const stores = await prisma.store.findMany();
        console.log('--- STORES ---');
        console.log(JSON.stringify(stores, null, 2));

        const products = await prisma.product.findMany({
            take: 10,
            include: { store: true }
        });
        console.log('\n--- PRODUCTS (First 10) ---');
        products.forEach(p => {
            console.log(`Product: ${p.title} | StoreId: ${p.storeId} | Store: ${p.store ? p.store.slug : 'MISSING'}`);
        });

        const orphanProducts = await prisma.product.count({
            where: { store: { is: null } }
        });
        console.log('\nOrphan Products count:', orphanProducts);

    } catch (e) {
        console.error('Error during diagnostic:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
