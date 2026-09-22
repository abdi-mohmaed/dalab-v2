import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { registerSchema } from '@/lib/validations';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name } = registerSchema.parse(body);

        const supabase = await createClient();

        // 1. Create user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name || null,
                },
            },
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (!data.user) {
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }

        // 2. Create user in Prisma for application logic
        const user = await prisma.user.create({
            data: {
                email,
                name: name || null,
                role: 'USER',
                supabaseId: data.user.id,
                password: '', // Managed by Supabase
            },
        });

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        }, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json({ error: (error as any).errors[0].message }, { status: 400 });
        }
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
