const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'adminpassword123';

    const existingUser = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (existingUser) {
        console.log('Admin user already exists:', adminEmail);
        // Ensure it's admin
        if (existingUser.role !== 'ADMIN') {
            await prisma.user.update({
                where: { id: existingUser.id },
                data: { role: 'ADMIN' }
            });
            console.log('Updated existing user to ADMIN role');
        }
    } else {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN'
            }
        });
        console.log('Created admin user:');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
