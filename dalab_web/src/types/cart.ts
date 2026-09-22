export interface CartItem {
    id: string; // variantId
    productId: string;
    variantId: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    store: string;
    attributes?: { name: string; value: string }[];
}

export interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}
