
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting cleanup of imported products...');

    // Delete products where source is 'Excel Import'
    // Note: Due to cascade delete, this should also remove related variants and images
    const { count } = await prisma.product.deleteMany({
        where: {
            source: 'Excel Import'
        }
    });

    console.log(`Successfully deleted ${count} imported products.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
