import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().optional(),
});

export const orderSchema = z.object({
    items: z.array(z.object({
        variantId: z.string(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
    })),
    totalAmount: z.number().positive(),
    addressId: z.string(),
    paymentMethod: z.enum(['ZAAD', 'EDAHAB', 'EVC_PLUS', 'CARD']),
    paymentIntentId: z.string().optional(),
});

export const cartItemSchema = z.object({
    variantId: z.string(),
    quantity: z.number().int().optional(),
});
