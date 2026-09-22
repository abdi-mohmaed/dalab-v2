// @ts-nocheck
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Type guard to check if we're in React Native environment
const isReactNative = (): boolean => {
    return typeof navigator !== 'undefined' && navigator.product === 'ReactNative'
}

// Get environment variables safely across environments
const supabaseUrl =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env.SUPABASE_URL) ||
    globalThis['NEXT_PUBLIC_SUPABASE_URL'] ||
    globalThis['SUPABASE_URL'] ||
    '';

const supabaseAnonKey =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' && process.env.SUPABASE_ANON_KEY) ||
    globalThis['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ||
    globalThis['SUPABASE_ANON_KEY'] ||
    '';

const supabaseServiceRoleKey =
    (typeof process !== 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY) ||
    globalThis['SUPABASE_SERVICE_ROLE_KEY'] ||
    '';

let customStorage: any = null;

/**
 * Set a custom storage provider for Supabase Auth (e.g. AsyncStorage for React Native)
 * Should be called once during app initialization.
 */
export function setSupabaseStorage(storage: any) {
    customStorage = storage;
}

/**
 * Creates a Supabase client for browser/client-side use
 * Automatically detects environment (Web vs React Native)
 */
export function createClient() {
    if (isReactNative()) {
        // If no custom storage is provided, try to auto-discover AsyncStorage
        const storage = customStorage || (function () {
            try {
                return require('@react-native-async-storage/async-storage').default;
            } catch (error) {
                console.warn(
                    'AsyncStorage not found and no custom storage set. ' +
                    'Please call setSupabaseStorage(AsyncStorage) in your mobile initialization.'
                );
                return null;
            }
        })();

        return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                storage: storage,
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: false,
            },
        });
    } else {
        // Web (Next.js): Use SSR-compatible browser client with localStorage
        return createBrowserClient(supabaseUrl, supabaseAnonKey);
    }
}

/**
 * Standard Supabase client for web environments
 * Uses localStorage for session persistence
 */
export const supabase = createClient()

/**
 * Admin/Service client for server-side operations
 * Bypasses Row Level Security (RLS)
 * Should ONLY be used in server-side code (API routes, server actions)
 */
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
    ? createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
    : null;

// Export types for convenience
export type { User, Session, AuthError } from '@supabase/supabase-js'
