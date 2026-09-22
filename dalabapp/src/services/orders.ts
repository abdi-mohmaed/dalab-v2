import { supabase } from './supabase';
import { CartItem } from './cart';
import { Order } from '../screens/main/types';

export const orderService = {
    async createOrder(userId: string, items: CartItem[], totalAmount: number) {
        const { data, error } = await supabase
            .from('Order')
            .insert({
                userId: userId,
                totalAmount: totalAmount,
                status: 'PENDING',
            })
            .select()
            .single();

        if (error) throw error;

        // Create order items
        const orderItems = items.map(item => ({
            orderId: data.id,
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
        }));

        const { error: itemsError } = await supabase
            .from('OrderItem')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return {
            ...data,
            user_id: data.userId,
            total_amount: data.totalAmount,
            created_at: data.createdAt
        } as Order;
    },

    async getOrders(userId: string) {
        const { data, error } = await supabase
            .from('Order')
            .select('*')
            .eq('userId', userId)
            .order('createdAt', { ascending: false });

        if (error) throw error;
        return (data || []).map(order => ({
            ...order,
            user_id: order.userId,
            total_amount: order.totalAmount,
            created_at: order.createdAt
        })) as Order[];
    },
};
