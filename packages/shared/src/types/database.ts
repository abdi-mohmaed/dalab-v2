export interface Profile {
    id: string;
    updated_at?: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
    website?: string;
    email?: string;
}

export interface Product {
    id: string;
    created_at: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    category_id?: string;
    stock_quantity: number;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface Order {
    id: string;
    created_at: string;
    user_id: string;
    status: 'pending' | 'completed' | 'cancelled';
    total_amount: number;
}
