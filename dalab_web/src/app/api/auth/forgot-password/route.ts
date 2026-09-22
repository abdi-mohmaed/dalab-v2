import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 */
export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const supabase = await createClient();

        // Use Supabase to handle the password reset flow
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
        });

        if (error) {
            console.error('Supabase forgot-password error:', error.message);
            // Return success anyway for security (don't reveal if user exists)
        }

        return NextResponse.json({
            message: 'If an account exists with that email, a reset link has been sent.'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
