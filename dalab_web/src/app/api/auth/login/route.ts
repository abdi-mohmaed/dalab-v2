import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validations';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = loginSchema.parse(body);

        const supabase = await createClient();

        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }

        // Fetch user from Prisma by email (migration period) or supabaseId
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Check if user exists by supabaseId if email lookup failed
            const userById = await prisma.user.findUnique({
                where: { supabaseId: data.user.id } as any, // Using any to bypass lint error if types haven't refreshed
            });

            if (!userById) {
                return NextResponse.json({
                    user: {
                        id: data.user.id,
                        email: data.user.email,
                        name: (data.user.user_metadata as any)?.name || null,
                        role: 'USER',
                    },
                });
            }

            return NextResponse.json({
                user: {
                    id: userById.id,
                    email: userById.email,
                    name: userById.name,
                    role: userById.role,
                },
            });
        }

        // Link supabaseId if not already linked
        if (!user.supabaseId) {
            await prisma.user.update({
                where: { id: user.id },
                data: { supabaseId: data.user.id },
            });
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json({ error: (error as any).errors[0].message }, { status: 400 });
        }
        console.error('Login error details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
