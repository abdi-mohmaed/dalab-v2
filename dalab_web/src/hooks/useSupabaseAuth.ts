'use client'

import { useAuth, createClient } from '@dalab/shared'
import { useMemo } from 'react'

/**
 * Re-export useAuth from shared logic
 * This allows the web app to use the platform-agnostic auth store
 */
export function useSupabaseAuth() {
    const { user, loading } = useAuth()
    const supabase = useMemo(() => createClient(), [])

    return { user, loading, supabase }
}

