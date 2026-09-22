import { useState } from 'react';
import { MobileProduct } from './useProducts';

export function useWishlist() {
    const [wishlist, setWishlist] = useState<MobileProduct[]>([]);

    const addToWishlist = (product: MobileProduct) => {
        setWishlist(prev => [...prev, product]);
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist(prev => prev.filter(p => p.id !== productId));
    };

    return {
        wishlist,
        addToWishlist,
        removeFromWishlist,
    };
}
