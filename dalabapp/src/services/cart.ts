import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../screens/main/types';

export interface CartItem extends Product {
    quantity: number;
}

const CART_STORAGE_KEY = '@dalab_cart';

export const cartService = {
    async getCart(): Promise<CartItem[]> {
        const jsonValue = await AsyncStorage.getItem(CART_STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    },

    async saveCart(cart: CartItem[]) {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    },

    async addToCart(product: Product) {
        const cart = await this.getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        await this.saveCart(cart);
        return cart;
    },

    async clearCart() {
        await AsyncStorage.removeItem(CART_STORAGE_KEY);
    },
};
