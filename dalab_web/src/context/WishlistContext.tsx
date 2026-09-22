'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface WishlistItem {
    id: string;
    productId: string;
    product: any;
}

interface WishlistContextType {
    wishlist: WishlistItem[];
    toggleWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWishlist = useCallback(async () => {
        if (!user) {
            setWishlist([]);
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/wishlist');
            const data = await res.json();
            if (data.data) {
                setWishlist(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch wishlist', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const toggleWishlist = async (productId: string) => {
        if (!user) {
            alert('Please login to add to wishlist');
            return;
        }

        // Optimistic UI
        const isWishlisted = isInWishlist(productId);
        if (isWishlisted) {
            setWishlist(prev => prev.filter(item => item.productId !== productId));
        } else {
            // We don't have the full product object here easily, 
            // but we can add a placeholder and the next fetch will fix it
            setWishlist(prev => [...prev, { id: 'temp', productId, product: {} } as WishlistItem]);
        }

        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });

            if (!res.ok) throw new Error('Failed to update wishlist');

            // Re-fetch to get actual data and IDs
            await fetchWishlist();
        } catch (error) {
            console.error('Wishlist toggle error', error);
            // Revert on error
            await fetchWishlist();
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some(item => item.productId === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, isLoading }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
