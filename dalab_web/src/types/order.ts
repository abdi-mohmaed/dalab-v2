export type OrderStatus =
    | 'PENDING_PAYMENT'
    | 'PAID'
    | 'PROCESSING'
    | 'READY_FOR_DELIVERY'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED';

export interface OrderItem {
    id: string;
    variantId: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    deliveryFee?: number;
    estimatedDeliveryTime?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderRequest {
    items: {
        productId: string;
        quantity: number;
    }[];
}
