
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    const store = await prisma.store.findFirst({ where: { slug: 'dalab' } });

    // Check/create categories
    const categoryNames = ['Mobiles', 'Home Appliances', 'Personal Care'];
    const categoryIds = {};

    for (const name of categoryNames) {
        let cat = await prisma.category.findFirst({ where: { name } });
        if (!cat) {
            cat = await prisma.category.create({ data: { name } });
            console.log(`Created category: ${name}`);
        }
        categoryIds[name] = cat.id;
    }

    const result = {
        STORE_ID: store?.id,
        MOBILES_CATEGORY_ID: categoryIds['Mobiles'],
        HOME_APPLIANCES_CATEGORY_ID: categoryIds['Home Appliances'],
        PERSONAL_CARE_CATEGORY_ID: categoryIds['Personal Care']
    };

    fs.writeFileSync('category_ids.json', JSON.stringify(result, null, 2));
    console.log('Category IDs saved to category_ids.json');
}

main().catch(console.error).finally(() => prisma.$disconnect());
