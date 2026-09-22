import { supabase } from './supabase';
import { Product } from '../screens/main/types';

export const productService = {
    async getProducts() {
        const { data, error } = await supabase
            .from('Product')
            .select('*')
            .eq('status', 'ACTIVE')
            .order('createdAt', { ascending: false });

        if (error) {
            throw error;
        }

        return (data || []).map(p => ({
            ...p,
            price: p.originalPrice ?? 0,
            category_id: p.categoryId,
            store_id: p.storeId
        })) as Product[];
    },

    async getProductById(id: string) {
        const { data, error } = await supabase
            .from('Product')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        return {
            ...data,
            price: data.originalPrice ?? 0,
            category_id: data.categoryId,
            store_id: data.storeId
        } as Product;
    },

    async searchProducts(query: string) {
        const { data, error } = await supabase
            .from('Product')
            .select('*')
            .eq('status', 'ACTIVE')
            .ilike('title', `%${query}%`);

        if (error) {
            throw error;
        }
        return (data || []).map(p => ({
            ...p,
            price: p.originalPrice ?? 0,
            category_id: p.categoryId,
            store_id: p.storeId
        })) as Product[];
    },

    async getProductsByCategory(categoryId: string) {
        const { data, error } = await supabase
            .from('Product')
            .select('*')
            .eq('categoryId', categoryId)
            .eq('status', 'ACTIVE')
            .order('createdAt', { ascending: false });

        if (error) {
            throw error;
        }

        return (data || []).map(p => ({
            ...p,
            price: p.originalPrice ?? 0,
            category_id: p.categoryId,
            store_id: p.storeId
        })) as Product[];
    },
};
