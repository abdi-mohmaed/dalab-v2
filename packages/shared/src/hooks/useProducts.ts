import { useState, useEffect } from 'react';

export interface MobileProduct {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    category?: string;
    store?: string;
    rating?: number;
}

export interface UseProductsOptions {
    store?: string;
    category?: string;
    searchQuery?: string;
    pageSize?: number;
    source?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
    const [products, setProducts] = useState<MobileProduct[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        const mockList: MobileProduct[] = [
            {
                id: '1',
                title: 'Summer Casual T-Shirt',
                price: 19.99,
                originalPrice: 29.99,
                image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
                category: 'fashion',
                store: 'shein',
                rating: 4.5,
            },
            {
                id: '2',
                title: 'Wireless Noise Canceling Headphones',
                price: 89.99,
                originalPrice: 129.99,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                category: 'electronics',
                store: 'amazon',
                rating: 4.8,
            },
            {
                id: '3',
                title: 'Minimalist Wrist Watch',
                price: 49.99,
                originalPrice: 79.99,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
                category: 'accessories',
                store: 'dalab',
                rating: 4.7,
            },
        ];

        let filtered = mockList;
        if (options.store) {
            filtered = filtered.filter(p => p.store === options.store);
        }
        if (options.category) {
            filtered = filtered.filter(p => p.category === options.category);
        }
        if (options.searchQuery) {
            const q = options.searchQuery.toLowerCase();
            filtered = filtered.filter(p => p.title.toLowerCase().includes(q));
        }

        setProducts(filtered.length > 0 ? filtered : mockList);
        setIsLoading(false);
    }, [options.store, options.category, options.searchQuery]);

    return {
        products,
        isLoading,
    };
}
