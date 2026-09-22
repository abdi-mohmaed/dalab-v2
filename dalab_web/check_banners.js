const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBanners() {
    try {
        const bannersSection = await prisma.homepageSection.findFirst({
            where: { type: 'BANNERS' }
        });

        if (bannersSection) {
            console.log('BANNERS Section Config:');
            console.log(JSON.stringify(bannersSection.config, null, 2));
        } else {
            console.log('No BANNERS section found!');
        }

        const categories = await prisma.category.findMany({ take: 3 });
        console.log('Sample Categories:', JSON.stringify(categories, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkBanners();
