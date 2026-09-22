import { create } from 'zustand'
import { createClient, User, Session } from '../supabase'

interface AuthState {
    user: User | null
    session: Session | null
    loading: boolean
    initialized: boolean
    isInitialized: boolean
    setUser: (user: User | null) => void
    setSession: (session: Session | null) => void
    setLoading: (loading: boolean) => void
    initialize: () => Promise<void>
    signOut: () => Promise<void>
}

/**
 * Platform-agnostic Auth Store using Zustand
 * Works seamlessly in both Next.js and React Native
 */
export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    loading: true,
    initialized: false,
    isInitialized: false,

    setUser: (user) => set({ user }),
    setSession: (session) => set({ session, user: session?.user ?? null }),
    setLoading: (loading) => set({ loading }),

    initialize: async () => {
        if (get().initialized) return

        try {
            set({ loading: true })
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            set({
                session,
                user: session?.user ?? null,
                initialized: true,
                isInitialized: true,
                loading: false,
            })

            // Listen for auth state changes
            supabase.auth.onAuthStateChange((_event, session) => {
                set({
                    session,
                    user: session?.user ?? null,
                    loading: false,
                })
            })
        } catch (error) {
            console.error('Error initializing auth:', error)
            set({ initialized: true, isInitialized: true, loading: false })
        }
    },

    signOut: async () => {
        try {
            const supabase = createClient()
            await supabase.auth.signOut()
            set({ user: null, session: null })
        } catch (error) {
            console.error('Error signing out:', error)
        }
    },
}))

/**
 * Convenience hook for accessing auth state
 */
export function useAuth() {
    const state = useAuthStore()

    // Auto-initialize if not already done
    if (!state.initialized && typeof globalThis !== 'undefined') {
        state.initialize()
    }

    return state
}
