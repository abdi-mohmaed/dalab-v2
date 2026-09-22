import { supabase } from './supabase';
import { Category } from '../screens/main/types';

export const categoryService = {
    async getCategories() {
        const { data, error } = await supabase
            .from('Category')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }

        return (data || []).map(cat => ({
            ...cat,
            created_at: cat.createdAt
        })) as Category[];
    },
};
