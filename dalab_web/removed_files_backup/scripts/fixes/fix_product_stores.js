const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
    try {
        // 1. Find the current Dalab store
        const dalabStore = await prisma.store.findUnique({
            where: { slug: 'dalab' }
        });

        if (!dalabStore) {
            console.error('Dalab store not found!');
            return;
        }

        console.log(`Found Dalab Store: ${dalabStore.name} (${dalabStore.id})`);

        // 2. Update all products to use this storeId
        const result = await prisma.product.updateMany({
            data: {
                storeId: dalabStore.id
            }
        });

        console.log(`Updated ${result.count} products to use the correct storeId.`);

    } catch (e) {
        console.error('Error during fix:', e);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
