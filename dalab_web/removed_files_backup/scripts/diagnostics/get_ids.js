
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    const store = await prisma.store.findFirst({ where: { slug: 'dalab' } });
    const electronics = await prisma.category.findFirst({ where: { name: 'Electronics' } });

    let catId = electronics?.id;
    if (!catId) {
        const newCat = await prisma.category.create({ data: { name: 'Electronics' } });
        catId = newCat.id;
    }

    const result = {
        STORE_ID: store?.id,
        CATEGORY_ID: catId
    };

    fs.writeFileSync('ids_debug.json', JSON.stringify(result, null, 2));
    console.log('Success');
}

main().catch(console.error).finally(() => prisma.$disconnect());
