'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Store = {
    id: string;
    name: string;
    slug: string;
};

type StoreContextType = {
    currentStore: Store | null;
    setCurrentStore: (store: Store | null) => void;
    isLoading: boolean;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentStore, setCurrentStoreState] = useState<Store | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedStore = localStorage.getItem('selectedStore');
        if (savedStore) {
            try {
                setCurrentStoreState(JSON.parse(savedStore));
            } catch (e) {
                console.error('Failed to parse saved store', e);
            }
        }
        setIsLoading(false);
    }, []);

    const setCurrentStore = (store: Store | null) => {
        setCurrentStoreState(store);
        if (store) {
            localStorage.setItem('selectedStore', JSON.stringify(store));
        } else {
            localStorage.removeItem('selectedStore');
        }
    };

    return (
        <StoreContext.Provider value={{ currentStore, setCurrentStore, isLoading }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
