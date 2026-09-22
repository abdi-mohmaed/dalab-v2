const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function inspect() {
    console.log('Searching for BANNERS section in DB...');
    const section = await prisma.homepageSection.findFirst({
        where: { type: 'BANNERS' }
    });

    if (section) {
        console.log('Found Section:', JSON.stringify(section, null, 2));
    } else {
        console.log('No BANNERS section found in DB via Prisma.');
    }

    await prisma.$disconnect();
}

inspect();
