import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const refreshSecretKey = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const key = new TextEncoder().encode(secretKey);
const refreshKey = new TextEncoder().encode(refreshSecretKey);

export async function encrypt(payload: any, isRefresh = false) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(isRefresh ? '7d' : '1h')
        .sign(isRefresh ? refreshKey : key);
}

export async function decrypt(token: string, isRefresh = false): Promise<any> {
    const { payload } = await jwtVerify(token, isRefresh ? refreshKey : key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function login(user: { id: string, email: string, role: string }) {
    const accessToken = await encrypt(user);
    const refreshToken = await encrypt({ id: user.id }, true);

    const cookieStore = await cookies();
    cookieStore.set('session', accessToken, {
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    cookieStore.set('refresh_token', refreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.set('session', '', { expires: new Date(0) });
    cookieStore.set('refresh_token', '', { expires: new Date(0) });
}

export async function getSession() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}

export function updateSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = decrypt(session);
    const res = NextResponse.next();
    res.cookies.set({
        name: 'session',
        value: session,
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    return res;
}
