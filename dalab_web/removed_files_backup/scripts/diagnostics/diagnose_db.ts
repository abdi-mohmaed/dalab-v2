
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Homepage Sections ---');
    const sections = await prisma.homepageSection.findMany();
    console.log(JSON.stringify(sections, null, 2));

    console.log('--- Products (first 5) ---');
    const products = await prisma.product.findMany({ take: 5 });
    console.log(JSON.stringify(products, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
