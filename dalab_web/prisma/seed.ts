import { PrismaClient, Role, Status } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting resilient seeding...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Admin User
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

    // 2. Create Store
    const dalabStore = await prisma.store.upsert({
        where: { slug: 'dalab' },
        update: { status: Status.ACTIVE },
        create: {
            name: 'Dalab',
            slug: 'dalab',
            description: 'Dalab Marketplace',
            status: Status.ACTIVE,
            ownerId: admin.id
        }
    });

    // 3. Create 8 Target Categories
    const categories = [
        { name: 'accessories' },
        { name: 'beauty' },
        { name: 'clothing' },
        { name: 'electronics' },
        { name: 'home & kitchen' },
        { name: 'home appliances' },
        { name: 'mobiles' },
        { name: 'personal care' }
    ];

    const categoryIds: string[] = [];
    for (const cat of categories) {
        const createdCat = await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat
        });
        categoryIds.push(createdCat.id);
    }

    // 4. Homepage Sections
    const sectionCount = await prisma.homepageSection.count();
    if (sectionCount === 0) {
        await prisma.homepageSection.createMany({
            data: [
                {
                    title: 'Main Banners',
                    type: 'BANNERS',
                    order: 1,
                    active: true,
                    config: {
                        banners: [
                            { title: "NBD noon Ɖ1000 welcome bonus", src: "https://images.unsplash.com/photo-1472851294608-062f824d29cc", type: "small" },
                            { title: "USE ZAAD AND GET Extra 20% off", src: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da", type: "middle" },
                            { title: "ONLINE SHOPPING", src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8", type: "big" }
                        ]
                    }
                },
                {
                    title: 'Shop by Category',
                    type: 'CATEGORIES',
                    order: 2,
                    active: true,
                    config: { categoryIds }
                }
            ]
        });
    }

    console.log('Resilient seed complete - Real categories and layout secured.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
