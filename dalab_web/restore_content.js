const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULTS = [
    {
        type: 'BANNERS',
        title: 'Hero Banners',
        config: {
            banners: [
                { src: '/big-banner.png', title: 'Eid Sale Big Offer' },
                { src: '/middle-banner 2.png', title: 'New Collection' }
            ]
        }
    },
    {
        type: 'CATEGORIES',
        title: 'Top Categories',
        config: {}
    },
    {
        type: 'SMALL_BANNERS',
        title: 'Special Offer',
        config: {
            banners: [{ src: '/small-banner.png', title: 'Limited Time Deal' }]
        }
    },
    {
        type: 'PRODUCTS',
        title: 'Recommended for You',
        config: {
            productIds: ['d1', 'd2', 'd3', 'a1', 'a2', 's1', 't1'] // Using IDs I saw in mockProducts
        }
    },
    {
        type: 'MIDDLE_BANNERS',
        title: 'Trending',
        config: {
            banners: [
                { src: '/middle_banner.png', title: 'Fashion Week' }
            ]
        }
    }
];

async function restoreContent() {
    try {
        for (const def of DEFAULTS) {
            console.log(`Processing ${def.type}...`);

            // Find existing section of this type
            const existing = await prisma.homepageSection.findFirst({
                where: { type: def.type }
            });

            if (existing) {
                console.log(`Updating existing section: ${existing.id}`);
                // Merge config: Don't overwrite if it looks valid already? 
                // Actually, user claims it's empty/missing, so force overwrite with defaults is safer to restore state.
                // But let's check if config is empty first to be gentle.

                const currentConfig = existing.config;
                const isEmpty = !currentConfig || Object.keys(currentConfig).length === 0 ||
                    (Array.isArray(currentConfig.banners) && currentConfig.banners.length === 0);

                if (isEmpty || def.type === 'PRODUCTS') { // Always update products to ensure IDs exist
                    await prisma.homepageSection.update({
                        where: { id: existing.id },
                        data: {
                            config: def.config,
                            title: def.title // Restore title too
                        }
                    });
                    console.log('Updated.');
                } else {
                    console.log('Skipping update, config appears populated.');
                    // Optional: Force path fix here just in case?
                    // Access fields to be sure
                    if (currentConfig.banners) {
                        console.log('Current banners:', JSON.stringify(currentConfig.banners));
                    }
                }
            } else {
                console.log(`Creating new section for ${def.type}`);
                await prisma.homepageSection.create({
                    data: {
                        title: def.title,
                        type: def.type,
                        config: def.config,
                        order: DEFAULTS.indexOf(def),
                        active: true
                    }
                });
            }
        }
        console.log('Content restoration complete.');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

restoreContent();
