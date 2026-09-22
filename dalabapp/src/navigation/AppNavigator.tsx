import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStack } from './AuthStack';
import { MainStack } from './MainStack';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';

export const AppNavigator = () => {
    const { session, setSession, setUser } = useAuthStore();

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <NavigationContainer>
            {/* Temporarily bypassed login as per user request */}
            {true ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
    );
};
