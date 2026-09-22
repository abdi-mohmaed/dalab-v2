const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function activateAll() {
    console.log('Activating ALL Homepage Sections...');

    const updated = await prisma.homepageSection.updateMany({
        where: { active: false },
        data: { active: true }
    });

    console.log(`Activated ${updated.count} sections.`);

    await prisma.$disconnect();
}

activateAll();
