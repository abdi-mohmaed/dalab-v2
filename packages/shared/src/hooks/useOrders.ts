"use client";
import { useState, useEffect } from 'react';
import { createClient } from '../supabase';

export interface UserOrder {
    id: string;
    created_at: string;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    total: number;
    items_count: number;
}

export const useOrders = () => {
    const [orders, setOrders] = useState<UserOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchOrders();

        const subscription = supabase
            .channel('public:orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('Realtime order update:', payload);
                    fetchOrders(); // Refresh list on any change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform data if needed, for now assuming it matches Order interface
            // In a real app we might need to map fields or join with order_items
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { orders, isLoading, refetch: fetchOrders };
};
