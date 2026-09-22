
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const storeCount = await prisma.store.count();
    const variantsCount = await prisma.productVariant.count();

    console.log('--- Database Status ---');
    console.log('Products:', productCount);
    console.log('Categories:', categoryCount);
    console.log('Stores:', storeCount);
    console.log('Variants:', variantsCount);

    if (storeCount > 0) {
        const store = await prisma.store.findFirst();
        console.log('First Store ID:', store?.id);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
