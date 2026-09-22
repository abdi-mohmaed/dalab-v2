
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const result = await prisma.product.deleteMany({
        where: {
            source: 'Excel Import'
        }
    });

    console.log(`Deleted ${result.count} products with source 'Excel Import'`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
