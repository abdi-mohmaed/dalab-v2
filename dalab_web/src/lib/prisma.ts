import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Logging the connection (redacted) to verify params are active
if (typeof window === 'undefined') {
    const dbUrl = process.env.DATABASE_URL || '';
    console.log(`[Prisma] Initializing with URL containing pgbouncer: ${dbUrl.includes('pgbouncer=true')}`);
}

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
        log: ['query', 'error', 'warn'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
