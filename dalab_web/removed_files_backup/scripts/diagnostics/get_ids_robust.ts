
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const store = await prisma.store.findFirst({
        where: { slug: 'dalab' }
    });

    const category = await prisma.category.findFirst({
        where: { name: 'Electronics' }
    });

    const output = {
        storeId: store?.id,
        electronicsCategoryId: category?.id,
        allCategories: await prisma.category.findMany()
    };

    fs.writeFileSync('db_check_result.json', JSON.stringify(output, null, 2));
}

main()
    .catch((e) => {
        fs.writeFileSync('db_check_error.txt', e.toString());
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
