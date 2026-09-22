
import { prisma } from './src/lib/prisma';

async function test() {
    console.log('DATABASE_URL from env:', process.env.DATABASE_URL);
    try {
        const count = await prisma.product.count();
        console.log('Successfully connected to DB. Product count:', count);
    } catch (e) {
        console.error('Failed to connect to DB:', (e as Error).message);
    }
}

test();
