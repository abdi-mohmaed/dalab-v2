const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function list() {
    const cats = await prisma.category.findMany();
    console.log(JSON.stringify(cats, null, 2));
}
list().catch(console.error).finally(() => prisma.$disconnect());
