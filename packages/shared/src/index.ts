// Supabase client exports
export { supabase, supabaseAdmin, createClient } from './supabase';
export type { User, Session, AuthError } from './supabase';

// Auth hooks and stores
export * from './hooks/useAuth';
export * from './hooks/useOrders';
export * from './hooks/useNotifications';
export * from './hooks/useProducts';
export * from './hooks/useDashboard';
export * from './hooks/useStore';
export * from './hooks/useWishlist';

// Types and Interfaces
export * from './types/database';

// Validation Schemas
export * from './validation/auth';

// Future exports: Add shared business logic, utilities here
// export * from './api'
// export * from './types'
// export * from './utils'
