const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        const products = await prisma.product.findMany({
            select: {
                id: true,
                title: true,
                image: true,
                images: {
                    select: {
                        url: true
                    }
                }
            },
            take: 5,
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log('--- PRODUCT DATA ---');
        console.log(JSON.stringify(products, null, 2));
    } catch (err) {
        console.error('Prisma Error:', err);
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
