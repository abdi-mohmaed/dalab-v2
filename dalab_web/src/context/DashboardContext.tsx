'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { Banner, Cashier, HomepageSection, Store, Category } from '@/types/admin';
import { Order } from '@/types/order';
import { mockProducts as initialMockProducts } from '@/data/mockProducts';

interface DashboardContextType {
    products: Product[];
    categories: Category[];
    stores: Store[];
    orders: Order[];
    users: any[];
    ads: Banner[];
    cashiers: Cashier[];
    homepageSections: HomepageSection[];
    productTypes: any[];
    isLoading: boolean;

    // Handlers
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    setStores: React.Dispatch<React.SetStateAction<Store[]>>;
    setAds: React.Dispatch<React.SetStateAction<Banner[]>>;
    setCashiers: React.Dispatch<React.SetStateAction<Cashier[]>>;
    setHomepageSections: React.Dispatch<React.SetStateAction<HomepageSection[]>>;
    setProductTypes: React.Dispatch<React.SetStateAction<any[]>>;
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
    saveHomepageSection: (section: Partial<HomepageSection>) => Promise<void>;
    deleteHomepageSection: (id: string) => Promise<void>;
    saveCategory: (category: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    saveProduct: (product: Partial<Product>) => Promise<Response>;
    deleteProduct: (id: string) => Promise<void>;
    bulkImportProducts: (products: any[]) => Promise<void>;
    refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [ads, setAds] = useState<Banner[]>([]);
    const [cashiers, setCashiers] = useState<Cashier[]>([]);
    const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([]);
    const [productTypes, setProductTypes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
        {
            id: 'hero-banners',
            title: 'Hero Banners',
            type: 'BANNERS',
            productIds: [],
            order: 0,
            active: true,
            config: {
                banners: [
                    { src: '/big-banner.png', title: 'Eid Sale Big Offer' },
                    { src: '/middle-banner 2.png', title: 'New Collection' }
                ]
            }
        },
        {
            id: 'categories',
            title: 'Top Categories',
            type: 'CATEGORIES',
            productIds: [],
            order: 1,
            active: true
        },
        {
            id: 'middle-banner-1',
            title: 'Special Offer',
            type: 'SMALL_BANNERS',
            productIds: [],
            order: 2,
            active: true,
            config: {
                banners: [{ src: '/small-banner.png', title: 'Limited Time Deal' }]
            }
        },
        {
            id: 'products-1',
            title: 'Recommended for You',
            type: 'PRODUCTS',
            productIds: ['1', '2', '3', '4'],
            order: 3,
            active: true
        },
        {
            id: 'middle-banners-2',
            title: 'Trending',
            type: 'MIDDLE_BANNERS',
            productIds: [],
            order: 4,
            active: true,
            config: {
                banners: [
                    { src: '/middle_banner.png', title: 'Fashion Week' }
                ]
            }
        }
    ];

    // ... inside DashboardProvider

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const [sectionsRes, adsRes, storesRes, catsRes, typesRes] = await Promise.all([
                fetch('/api/homepage-sections'),
                fetch('/api/ads'),
                fetch('/api/stores'),
                fetch('/api/categories'),
                fetch('/api/admin/product-types')
            ]);

            const sectionsData = await sectionsRes.json().catch(() => ({}));
            const adsData = await adsRes.json().catch(() => ({}));
            const storesData = await storesRes.json().catch(() => ({}));
            const catsData = await catsRes.json().catch(() => ({}));
            const typesData = await typesRes.json().catch(() => ({}));

            if (sectionsData.sections && sectionsData.sections.length > 0) {
                setHomepageSections(sectionsData.sections);
            } else {
                // Fallback to default if API returns empty
                console.log('Using default homepage sections');
                setHomepageSections(DEFAULT_HOMEPAGE_SECTIONS);
            }

            if (adsData.ads) setAds(adsData.ads);
            if (storesData.data) setStores(storesData.data);
            if (catsData.data) setCategories(catsData.data);
            if (typesData.data) setProductTypes(typesData.data);

            // Fetch products (initial batch)
            // Increased limit to show all products in admin for now
            const productsRes = await fetch('/api/products?limit=1000');
            const productsData = await productsRes.json().catch(() => ({}));

            // If API fails, fall back to mock products
            // If API returns data (even empty array), use it. Only fallback on error.
            if (Array.isArray(productsData.data)) {
                setProducts(productsData.data);
            } else {
                // Only mock if API request failed completely
                setProducts(initialMockProducts);
            }

        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
            // Fallback on error
            setHomepageSections(DEFAULT_HOMEPAGE_SECTIONS);
            setProducts(initialMockProducts);
        } finally {
            setIsLoading(false);
        }
    };

    const saveHomepageSection = async (section: Partial<HomepageSection>) => {
        try {
            const res = await fetch('/api/homepage-sections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(section)
            });
            if (res.ok) {
                await fetchDashboardData(); // Refresh list
            }
        } catch (error) {
            console.error('Failed to save section', error);
        }
    };

    const deleteHomepageSection = async (id: string) => {
        try {
            const res = await fetch(`/api/homepage-sections?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setHomepageSections(prev => prev.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete section', error);
        }
    };

    const saveCategory = async (category: Partial<Category>) => {
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });
            if (res.ok) {
                const refreshed = await fetch('/api/categories');
                const data = await refreshed.json();
                if (data.data) setCategories(data.data);
            }
        } catch (error) {
            console.error('Failed to save category', error);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCategories(prev => prev.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete category', error);
        }
    };

    const saveProduct = async (product: Partial<Product>) => {
        try {
            console.log('Saving product to API:', JSON.stringify(product, null, 2));
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (res.ok) {
                await fetchDashboardData();
            }
            return res;
        } catch (error) {
            console.error('Failed to save product', error);
            throw error;
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    const bulkImportProducts = async (productsToImport: any[]) => {
        try {
            const res = await fetch('/api/admin/products/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productsToImport)
            });
            if (res.ok) {
                await fetchDashboardData();
            }
        } catch (error) {
            console.error('Failed to bulk import products', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <DashboardContext.Provider
            value={{
                products,
                categories,
                stores,
                orders,
                users,
                ads,
                cashiers,
                homepageSections,
                productTypes,
                isLoading,
                setProducts,
                setCategories,
                setStores,
                setAds,
                setCashiers,
                setHomepageSections,
                setProductTypes,
                setOrders,
                saveHomepageSection,
                deleteHomepageSection,
                saveCategory,
                deleteCategory,
                saveProduct,
                deleteProduct,
                bulkImportProducts,
                refreshData: fetchDashboardData
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
}
