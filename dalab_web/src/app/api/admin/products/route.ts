import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/products
 * Create/Update a product with variants and images
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let {
            id, title, description, image, storeId, categoryId, productTypeId, variants, images, status,
            // Advanced labeling fields
            productTags, showTags, distributionTags, showDistributionTags,
            manualRating, useAutoRating, showRating,
            urgencyConfig
        } = body;

        // Validation
        if (!title || !image || !storeId) {
            console.log('Validation failed:', { title, image, storeId });
            return NextResponse.json({
                error: 'Missing required fields',
                details: { title, image, storeId }
            }, { status: 400 });
        }

        // Sanitize optional relations (Prisma fails on empty strings for @relation fields)
        if (categoryId === '') categoryId = undefined;
        if (productTypeId === '') productTypeId = undefined;

        // Sanitize numeric fields
        const parsedManualRating = manualRating !== undefined && manualRating !== null ? parseFloat(manualRating.toString()) : null;

        console.log('Processing product:', { id, title, categoryId, productTypeId });

        // If ID starts with 'prod-' or exists in DB, it's an update
        const isUpdate = id && !id.startsWith('new-');

        if (isUpdate) {
            // Update existing product
            const updatedProduct = await prisma.product.update({
                where: { id },
                data: {
                    title,
                    description,
                    image,
                    status: status || 'ACTIVE',
                    storeId,
                    categoryId,
                    productTypeId,
                    // Advanced labeling fields
                    showTags: showTags !== undefined ? showTags : true,
                    distributionTags: distributionTags || null,
                    showDistributionTags: showDistributionTags !== undefined ? showDistributionTags : true,
                    manualRating: parsedManualRating,
                    useAutoRating: useAutoRating || false,
                    showRating: showRating !== undefined ? showRating : true,
                    images: {
                        deleteMany: {},
                        create: images?.map((img: any) => ({
                            url: typeof img === 'string' ? img : img.url,
                            order: img.order || 0
                        })) || []
                    },
                    variants: {
                        deleteMany: {},
                        create: variants?.map((v: any) => ({
                            sku: v.sku,
                            price: parseFloat(v.price.toString()) || 0,
                            stock: parseInt(v.stock.toString()) || 0,
                            status: v.status || 'ACTIVE',
                            attributes: {
                                create: v.attributes?.map((attr: any) => ({
                                    attributeId: attr.attributeId,
                                    value: attr.value
                                })) || []
                            }
                        })) || []
                    },
                    productTags: {
                        deleteMany: {},
                        create: productTags?.map((tagId: string) => ({
                            tagId,
                            enabled: true
                        })) || []
                    },
                    urgencyConfig: urgencyConfig ? {
                        upsert: {
                            create: {
                                enabled: !!urgencyConfig.enabled,
                                type: urgencyConfig.type || 'COUNTDOWN',
                                countdownHours: urgencyConfig.countdownHours ? parseInt(urgencyConfig.countdownHours.toString()) : null,
                                countdownMinutes: urgencyConfig.countdownMinutes ? parseInt(urgencyConfig.countdownMinutes.toString()) : null,
                                staticMessage: urgencyConfig.staticMessage,
                                messageTemplate: urgencyConfig.messageTemplate || "This offer is only available for {{time}}"
                            },
                            update: {
                                enabled: !!urgencyConfig.enabled,
                                type: urgencyConfig.type || 'COUNTDOWN',
                                countdownHours: urgencyConfig.countdownHours ? parseInt(urgencyConfig.countdownHours.toString()) : null,
                                countdownMinutes: urgencyConfig.countdownMinutes ? parseInt(urgencyConfig.countdownMinutes.toString()) : null,
                                staticMessage: urgencyConfig.staticMessage,
                                messageTemplate: urgencyConfig.messageTemplate || "This offer is only available for {{time}}"
                            }
                        }
                    } : undefined
                },
                include: {
                    store: true,
                    category: true,
                    images: true,
                    variants: {
                        include: {
                            attributes: {
                                include: {
                                    attribute: true
                                }
                            }
                        }
                    }
                }
            });
            return NextResponse.json({ data: updatedProduct });
        } else {
            // Create new product
            const newProduct = await prisma.product.create({
                data: {
                    title,
                    description,
                    image,
                    status: status || 'ACTIVE',
                    storeId,
                    categoryId,
                    productTypeId,
                    // Advanced labeling fields
                    showTags: showTags !== undefined ? showTags : true,
                    distributionTags: distributionTags || null,
                    showDistributionTags: showDistributionTags !== undefined ? showDistributionTags : true,
                    manualRating: parsedManualRating,
                    useAutoRating: useAutoRating || false,
                    showRating: showRating !== undefined ? showRating : true,
                    images: {
                        create: images?.map((img: any) => ({
                            url: typeof img === 'string' ? img : img.url,
                            order: img.order || 0
                        })) || []
                    },
                    variants: {
                        create: variants?.map((v: any) => ({
                            sku: v.sku,
                            price: parseFloat(v.price.toString()) || 0,
                            stock: parseInt(v.stock.toString()) || 0,
                            status: v.status || 'ACTIVE',
                            attributes: {
                                create: v.attributes?.map((attr: any) => ({
                                    attributeId: attr.attributeId,
                                    value: attr.value
                                })) || []
                            }
                        })) || []
                    },
                    productTags: {
                        create: productTags?.map((tagId: string) => ({
                            tagId,
                            enabled: true
                        })) || []
                    },
                    urgencyConfig: urgencyConfig ? {
                        create: {
                            enabled: !!urgencyConfig.enabled,
                            type: urgencyConfig.type || 'COUNTDOWN',
                            countdownHours: urgencyConfig.countdownHours ? parseInt(urgencyConfig.countdownHours.toString()) : null,
                            countdownMinutes: urgencyConfig.countdownMinutes ? parseInt(urgencyConfig.countdownMinutes.toString()) : null,
                            staticMessage: urgencyConfig.staticMessage,
                            messageTemplate: urgencyConfig.messageTemplate || "This offer is only available for {{time}}"
                        }
                    } : undefined
                },
                include: {
                    store: true,
                    category: true,
                    images: true,
                    variants: {
                        include: {
                            attributes: {
                                include: {
                                    attribute: true
                                }
                            }
                        }
                    }
                }
            });
            return NextResponse.json({ data: newProduct });
        }
    } catch (error: any) {
        console.error('Error creating/updating product:', error);
        return NextResponse.json({ error: error.message || 'Failed to process product' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/products?id=xxx
 */
export async function DELETE(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    try {
        await prisma.product.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
