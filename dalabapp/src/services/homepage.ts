import { supabase } from './supabase';
import { HomepageSection } from '../screens/main/types';

export const homepageService = {
    async getHomepageSections() {
         const { data, error } = await supabase
            .from('HomepageSection')
            .select('*')
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching homepage sections:', JSON.stringify(error, null, 2));
            throw error;
        }

        return (data || []).map(section => ({
            ...section,
            order_index: section.order,
            is_active: section.active
        })) as HomepageSection[];
    }
};
