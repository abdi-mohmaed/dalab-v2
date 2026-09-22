const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
    try {
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@dalab.com' }
        });
        console.log('Admin User:', admin ? 'Found' : 'Not Found');
        if (admin) {
            console.log('Role:', admin.role);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
