const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting robust restoration...');

    try {
        // 1. Create Admin User
        const admin = await prisma.user.upsert({
            where: { email: 'admin@dalab.com' },
            update: {},
            create: {
                email: 'admin@dalab.com',
                name: 'Admin User',
                password: 'password123',
                role: 'ADMIN',
            },
        });
        console.log('Admin user ready');

        // 2. Create Store
        const dalabStore = await prisma.store.upsert({
            where: { slug: 'dalab' },
            update: { status: 'ACTIVE' },
            create: {
                name: 'Dalab',
                slug: 'dalab',
                description: 'Dalab Marketplace',
                status: 'ACTIVE',
                ownerId: admin.id
            }
        });
        console.log('Dalab store ready');

        // 3. Create Categories
        const categories = [
            { id: 'cat_home_kitchen', name: 'Home & Kitchen' },
            { id: 'cat_accessories', name: 'Accessories' },
            { id: 'cat_clothing', name: 'Clothing' },
            { name: 'home applicable' },
            { name: 'supermarkets' },
            { name: 'electronic equipment' },
            { name: 'home kitchen' },
            { name: 'health and nutrition' },
            { name: 'beauty' },
            { name: 'phones' },
            { name: 'personal care' },
            { name: 'best deals today' }
        ];

        for (const cat of categories) {
            try {
                // Try finding by name first
                const existingByName = await prisma.category.findUnique({ where: { name: cat.name } });

                if (existingByName) {
                    // Update existing
                    await prisma.category.update({
                        where: { id: existingByName.id },
                        data: { name: cat.name }
                    });
                } else if (cat.id) {
                    // Try upsert by ID if provided
                    await prisma.category.upsert({
                        where: { id: cat.id },
                        update: { name: cat.name },
                        create: { id: cat.id, name: cat.name }
                    });
                } else {
                    // Create new
                    await prisma.category.create({ data: cat });
                }
            } catch (err) {
                console.log(`Skipping category ${cat.name}: ${err.message}`);
            }
        }
        console.log('Categories processed');

        // 4. Create Homepage Sections (Check if exist first)
        const sections = await prisma.homepageSection.findMany();
        if (sections.length === 0) {
            const sectionsData = [
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
                    config: {}
                }
            ];

            for (const section of sectionsData) {
                await prisma.homepageSection.create({ data: section });
            }
            console.log('Homepage sections created');
        } else {
            console.log('Homepage sections already exist');
        }

    } catch (e) {
        console.error('Error during restoration:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
