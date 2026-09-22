'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
    id: string;
    email: string;
    name?: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
        try {
            // Check session API which now returns info from our User table
            const res = await fetch('/api/auth/session');
            const data = await res.json();
            if (data.user) {
                setUser(data.user);
            } else {
                // Fallback if record doesn't exist yet
                setUser({
                    id: supabaseUser.id,
                    email: supabaseUser.email!,
                    name: (supabaseUser.user_metadata as any)?.name || '',
                    role: 'USER',
                });
            }
        } catch (error) {
            console.error("Failed to fetch user profile", error);
        }
    };

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then((result: any) => {
            const session = result.data?.session;
            if (session?.user) {
                fetchUserProfile(session.user);
            } else {
                setIsLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
            if (session?.user) {
                await fetchUserProfile(session.user);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    const login = async (credentials: any) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (res.ok) {
            setUser(data.user);
            router.push('/');
        } else {
            throw new Error(data.error || 'Login failed');
        }
    };

    const register = async (userData: any) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (res.ok) {
            setUser(data.user);
            router.push('/');
        } else {
            throw new Error(data.error || 'Registration failed');
        }
    };

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
