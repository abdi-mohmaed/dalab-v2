import { useState, useMemo, useEffect } from 'react';
import { Product } from '@/types/product';
import { mockProducts } from '@/data/mockProducts';

interface UseProductsProps {
    store?: string;
    category?: string;
    pageSize?: number;
    source?: string;
}

export function useProducts({ store, category, pageSize = 8, source }: UseProductsProps = {}) {
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const loadMore = async (isInitial = false) => {
        if (isLoading || (!hasMore && !isInitial)) return;

        setIsLoading(true);
        const currentPage = isInitial ? 1 : page;

        try {
            const params = new URLSearchParams({
                page: String(currentPage),
                pageSize: String(pageSize),
                ...(store && { store }),
                ...(category && { category }),
                ...(source && { source })
            });

            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();

            if (data.data) {
                setDisplayedProducts(prev => isInitial ? data.data : [...prev, ...data.data]);
                setHasMore(data.pagination.page < data.pagination.totalPages);
                if (!isInitial) setPage(prev => prev + 1);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset and initial load when filters change
    useEffect(() => {
        setPage(2); // Next page will be 2
        setHasMore(true);
        loadMore(true);
    }, [store, category, source]);

    return {
        products: displayedProducts,
        hasMore,
        isLoading,
        loadMore: () => loadMore(false),
        totalCount: displayedProducts.length
    };
}
