'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product } from '@/types/product';
import { CartItem, CartState } from '@/types/cart';
import { useAuth } from './AuthContext';

interface CartContextType extends CartState {
    addToCart: (item: CartItem) => void;
    removeFromCart: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const { user } = useAuth();

    // Load cart
    useEffect(() => {
        const fetchCart = async () => {
            if (user) {
                try {
                    const res = await fetch('/api/cart');
                    const data = await res.json();
                    if (data.items) {
                        setItems(data.items);
                    }
                } catch (error) {
                    console.error('Failed to fetch cart from backend', error);
                }
            } else {
                const savedCart = localStorage.getItem('cart');
                if (savedCart) {
                    try {
                        setItems(JSON.parse(savedCart));
                    } catch (e) {
                        console.error('Failed to parse cart', e);
                    }
                }
            }
        };

        fetchCart();
    }, [user]);

    // Sync to localStorage for guests
    useEffect(() => {
        if (!user) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items, user]);

    const totalItems = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);
    const totalPrice = useMemo(() => items.reduce((acc, item) => acc + item.price * item.quantity, 0), [items]);

    const addToCart = async (item: CartItem) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === item.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                );
            }
            return [...prev, item];
        });

        if (user) {
            await fetch('/api/cart', {
                method: 'POST',
                body: JSON.stringify({ variantId: item.variantId, quantity: item.quantity }),
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

    const removeFromCart = async (variantId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== variantId));

        if (user) {
            await fetch(`/api/cart?variantId=${variantId}`, {
                method: 'DELETE'
            });
        }
    };

    const updateQuantity = async (variantId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(variantId);
            return;
        }

        setItems((prev) =>
            prev.map((item) => (item.id === variantId ? { ...item, quantity } : item))
        );

        if (user) {
            await fetch('/api/cart', {
                method: 'POST',
                body: JSON.stringify({ variantId, setQuantity: quantity }),
                headers: { 'Content-Type': 'application/json' }
            });
        }
    };

    const clearCart = () => {
        setItems([]);
        // Local storage is synced via useEffect
    };

    return (
        <CartContext.Provider
            value={{
                items,
                totalItems,
                totalPrice,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
