const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixPaths() {
    try {
        // 1. Fix Homepage Sections
        const sections = await prisma.homepageSection.findMany();
        for (const section of sections) {
            let needsUpdate = false;
            let newConfig = JSON.parse(JSON.stringify(section.config)); // Deep copy

            if (newConfig && newConfig.banners && Array.isArray(newConfig.banners)) {
                newConfig.banners = newConfig.banners.map(b => {
                    if (b.src) {
                        let newSrc = b.src;
                        // Remove 'public' prefix if present
                        if (newSrc.startsWith('public\\') || newSrc.startsWith('public/')) {
                            newSrc = newSrc.substring(6);
                        }
                        // Ensure leading slash
                        if (!newSrc.startsWith('/') && !newSrc.startsWith('http')) {
                            newSrc = '/' + newSrc;
                        }
                        // Fix backslashes
                        newSrc = newSrc.replace(/\\/g, '/');

                        if (newSrc !== b.src) {
                            console.log(`Fixing Banner: ${b.src} -> ${newSrc}`);
                            b.src = newSrc;
                            needsUpdate = true;
                        }
                    }
                    return b;
                });
            }

            if (needsUpdate) {
                await prisma.homepageSection.update({
                    where: { id: section.id },
                    data: { config: newConfig }
                });
            }
        }

        // 2. Fix Categories
        const categories = await prisma.category.findMany();
        for (const cat of categories) {
            if (cat.image) {
                let newImage = cat.image;
                // Remove 'public' prefix if present
                if (newImage.startsWith('public\\') || newImage.startsWith('public/')) {
                    newImage = newImage.substring(6);
                }
                // Ensure leading slash
                if (!newImage.startsWith('/') && !newImage.startsWith('http')) {
                    newImage = '/' + newImage;
                }
                // Fix backslashes
                newImage = newImage.replace(/\\/g, '/');

                if (newImage !== cat.image) {
                    console.log(`Fixing Category: ${cat.image} -> ${newImage}`);
                    await prisma.category.update({
                        where: { id: cat.id },
                        data: { image: newImage }
                    });
                }
            }
        }

        // 3. Fix Products (images array and main image)
        const products = await prisma.product.findMany({ include: { images: true } });
        for (const p of products) {
            let pUpdate = {};

            let newImage = p.image;
            if (newImage && !newImage.startsWith('http')) {
                if (newImage.startsWith('public\\') || newImage.startsWith('public/')) {
                    newImage = newImage.substring(6);
                }
                if (!newImage.startsWith('/') && !newImage.startsWith('http')) {
                    newImage = '/' + newImage;
                }
                newImage = newImage.replace(/\\/g, '/');

                if (newImage !== p.image) {
                    pUpdate.image = newImage;
                }
            }

            if (Object.keys(pUpdate).length > 0) {
                console.log(`Fixing Product ${p.id} image`);
                await prisma.product.update({
                    where: { id: p.id },
                    data: pUpdate
                });
            }

            // Fix ProductImages
            for (const img of p.images) {
                let newUrl = img.url;
                if (newUrl && !newUrl.startsWith('http')) {
                    if (newUrl.startsWith('public\\') || newUrl.startsWith('public/')) {
                        newUrl = newUrl.substring(6);
                    }
                    if (!newUrl.startsWith('/') && !newUrl.startsWith('http')) {
                        newUrl = '/' + newUrl;
                    }
                    newUrl = newUrl.replace(/\\/g, '/');

                    if (newUrl !== img.url) {
                        console.log(`Fixing ProductImage ${img.id}`);
                        await prisma.productImage.update({
                            where: { id: img.id },
                            data: { url: newUrl }
                        });
                    }
                }
            }
        }

        console.log('Finished fixing paths.');

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

fixPaths();
