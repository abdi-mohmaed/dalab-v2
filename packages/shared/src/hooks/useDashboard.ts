import { useState, useEffect } from 'react';

export function useDashboard() {
    const [homepageSections, setHomepageSections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        setHomepageSections([
            { id: 'banner', title: 'Featured' },
            { id: 'categories', title: 'Shop by Category' },
            { id: 'trending', title: 'Trending Now' },
        ]);
        setIsLoading(false);
    }, []);

    return {
        homepageSections,
        categories: [
            { id: '1', name: 'Fashion', icon: '👕' },
            { id: '2', name: 'Electronics', icon: '🎧' },
            { id: '3', name: 'Home', icon: '🏡' },
        ],
        isLoading,
    };
}
