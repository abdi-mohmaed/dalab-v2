import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types/database';

interface WishlistState {
    items: Product[];
    toggleItem: (product: Product) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            toggleItem: (product) => {
                const currentItems = get().items;
                const isExist = currentItems.some((item) => item.id === product.id);

                if (isExist) {
                    set({
                        items: currentItems.filter((item) => item.id !== product.id),
                    });
                } else {
                    set({ items: [...currentItems, product] });
                }
            },
            isInWishlist: (productId) => {
                return get().items.some((item) => item.id === productId);
            },
            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
