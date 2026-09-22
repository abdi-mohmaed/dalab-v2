import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/auth/reset-password
 * Body: { password }
 * Note: Supabase handles the token verification automatically when the user
 * lands on the page via the email link (it creates a recovery session).
 */
export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json({ error: 'Password is required' }, { status: 400 });
        }

        const supabase = await createClient();

        // Update the user's password using the current recovery session
        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
