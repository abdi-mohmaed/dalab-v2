const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Check if user exists first
        const user = await prisma.user.findUnique({
            where: { email: 'admin@dalab.com' }
        });

        if (user) {
            console.log('Resetting password for admin@dalab.com...');
            await prisma.user.update({
                where: { email: 'admin@dalab.com' },
                data: { password: hashedPassword }
            });
            console.log('Password reset successfully.');
        } else {
            console.log('Admin user not found, creating one...');
            await prisma.user.create({
                data: {
                    email: 'admin@dalab.com',
                    name: 'Admin User',
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            });
            console.log('Admin user created.');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

resetPassword();
