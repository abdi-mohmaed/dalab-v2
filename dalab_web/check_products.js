
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const productsCount = await prisma.product.count();
        console.log(`Products count: ${productsCount}`);

        if (productsCount > 0) {
            const firstProduct = await prisma.product.findFirst();
            console.log('First product found:', JSON.stringify(firstProduct, null, 2));
        } else {
            console.log('No products found in the database.');
        }
    } catch (error) {
        console.error('Error connecting to the database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
