export type MediaType = 'IMAGE' | 'GIF' | 'VIDEO';

export interface Banner {
    id: string;
    title: string;
    mediaUrl: string;
    mediaType: MediaType;
    bannerType: string; // e.g., 'Hero', 'Grid', 'Strip'
    placement: string; // e.g., 'Home', 'Category Page', 'Store Page'
    storeId?: string;
    categoryId?: string;
    scheduledStart?: string;
    scheduledEnd?: string;
    isActive: boolean;
}

export interface Cashier {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    permissions: string[];
    lastActive?: string;
    status: 'online' | 'offline';
}

export interface HomepageSection {
    id: string;
    title: string;
    type: string;
    productIds: string[];
    config?: any;
    order: number;
    active: boolean;
}

export interface Store {
    id: string;
    name: string;
    slug: string;
    logo?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon?: string;
    image?: string;
}
