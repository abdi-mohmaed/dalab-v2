const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function activate() {
    console.log('Activating BANNERS section...');
    try {
        const section = await prisma.homepageSection.findFirst({
            where: { type: 'BANNERS' }
        });

        if (!section) {
            console.log('No BANNERS section found.');
            return;
        }

        const updated = await prisma.homepageSection.update({
            where: { id: section.id },
            data: { active: true }
        });

        console.log('Updated Section:', JSON.stringify(updated, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

activate();
