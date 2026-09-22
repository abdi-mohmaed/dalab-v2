
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();
async function main() {
    const categories = ['Electronics', 'Mobiles', 'Home Appliances', 'Personal Care'];
    let output = 'Category Counts:\n';

    for (const catName of categories) {
        const count = await prisma.product.count({
            where: { category: { name: catName } }
        });
        output += `${catName}: ${count}\n`;
    }

    const total = await prisma.product.count();
    output += `Total Products: ${total}\n`;

    fs.writeFileSync('count_result.txt', output);
}
main().catch(console.error).finally(() => prisma.$disconnect());
