import { createClient } from './supabase/server';
import { prisma } from './prisma';

/**
 * Enhanced getSession for Supabase
 * Bridges the gap between old custom JWT sessions and Supabase Auth
 */
export async function getSession() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    // Fetch from internal User table
    const userData = await prisma.user.findFirst({
        where: {
            OR: [
                { supabaseId: user.id },
                { email: user.email }
            ]
        } as any,
        select: { id: true, email: true, role: true }
    });

    if (!userData) {
        return {
            id: user.id,
            email: user.email,
            role: 'USER',
        };
    }

    return userData;
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
}
