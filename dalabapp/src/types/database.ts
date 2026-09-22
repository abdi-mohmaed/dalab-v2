export type Profile = {
    id: string;
    email: string;
    full_name: string;
    avatar_url?: string;
    role: 'USER' | 'ADMIN' | 'CASHIER';
};

export type Product = {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    rating: number;
    category_id?: string;
    store_id: string;
    status: 'ACTIVE' | 'INACTIVE';
    created_at: string;
};

export type Order = {
    id: string;
    user_id: string;
    total_amount: number;
    status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    created_at: string;
};

export type CartItem = Product & {
    quantity: number;
};
