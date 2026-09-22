
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Ensuring Store and Admin ---');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@dalab.com' },
        update: {},
        create: {
            email: 'admin@dalab.com',
            name: 'Admin User',
            password: hashedPassword,
            role: Role.ADMIN,
        },
    });
    console.log('Admin user ensured');

    const store = await prisma.store.upsert({
        where: { slug: 'dalab' },
        update: {},
        create: {
            name: 'Dalab',
            slug: 'dalab',
            ownerId: admin.id,
            status: 'ACTIVE'
        }
    });
    console.log('Store ensured:', store.id);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
