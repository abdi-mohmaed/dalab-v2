const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listSections() {
    console.log('Listing all Homepage Sections...');
    const sections = await prisma.homepageSection.findMany({
        orderBy: { order: 'asc' }
    });

    sections.forEach(s => {
        console.log(`[${s.id}] ${s.title} (${s.type}) - Active: ${s.active}`);
    });

    await prisma.$disconnect();
}

listSections();
