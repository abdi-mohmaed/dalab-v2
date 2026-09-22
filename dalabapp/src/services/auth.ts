import { supabase } from './supabase';

export const authService = {
    async signIn(email: string, password: string) {
        const { data: { session, user }, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw error;
        }
        return { session, user };
    },

    async signUp(email: string, password: string) {
        const { data: { user }, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            throw error;
        }
        return { user };
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
    },

    async getSession() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            throw error;
        }
        return session;
    },
};
