
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000';

async function verifyDatabase() {
    console.log('--- Verifying Database Connectivity ---');
    try {
        await prisma.$connect();
        console.log('✅ Database connection successful');

        try {
            const userCount = await prisma.user.count();
            console.log(`ℹ️ Users count: ${userCount}`);
        } catch (e) { console.log('⚠️ Could not count users:', (e as Error).message); }

        try {
            const productCount = await prisma.product.count();
            console.log(`ℹ️ Products count: ${productCount}`);
        } catch (e) { console.log('⚠️ Could not count products:', (e as Error).message); }

        try {
            const categoryCount = await prisma.category.count();
            console.log(`ℹ️ Categories count: ${categoryCount}`);
        } catch (e) {
            // If category model doesn't exist or verify fails
            console.log('⚠️ Could not count categories (Model might differ):', (e as Error).message);
        }

        // Check for Admin User
        try {
            // @ts-ignore - Role enum might be specific
            const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
            if (adminUser) {
                console.log('✅ Admin user found');
            } else {
                console.log('⚠️ No Admin user found');
            }
        } catch (e) { console.log('⚠️ Could not find admin:', (e as Error).message); }

        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

async function verifyEndpoint(endpoint: string) {
    try {
        const start = Date.now();
        const res = await fetch(`${BASE_URL}${endpoint}`);
        const duration = Date.now() - start;

        if (res.ok) {
            let info = '';
            try {
                const data = await res.json();
                info = Array.isArray(data) ? `Items: ${data.length}` : (data.data && Array.isArray(data.data) ? `Items: ${data.data.length}` : 'Object response');
            } catch (e) {
                info = 'Non-JSON response';
            }
            console.log(`✅ ${endpoint} - Status: ${res.status} - Time: ${duration}ms - ${info}`);
            return true;
        } else {
            console.log(`❌ ${endpoint} - Status: ${res.status} - Time: ${duration}ms`);
            return false;
        }
    } catch (error) {
        console.log(`❌ ${endpoint} - Failed to fetch: ${(error as Error).message}`);
        return false;
    }
}

async function verifyAPI() {
    console.log('\n--- Verifying API Endpoints ---');
    await verifyEndpoint('/api/products');
    await verifyEndpoint('/api/categories');
    // await verifyEndpoint('/api/auth/session'); 
}

async function main() {
    console.log('Starting System Verification...');
    await verifyDatabase();
    // Wait a moment for server to be definitely ready if we just started it
    console.log('Waiting 5s for server warmup...');
    await new Promise(r => setTimeout(r, 5000));
    await verifyAPI();
    console.log('\nVerification Complete.');
}

main();
