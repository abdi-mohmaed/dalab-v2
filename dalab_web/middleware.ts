import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // Paths that require authentication
    const protectedPaths = ['/api/users', '/api/stores', '/api/orders', '/api/cart', '/api/payments', '/account', '/wishlist']
    // Paths that require ADMIN role
    const adminPaths = ['/admin', '/api/admin', '/api/homepage-sections', '/api/ads']

    const isProtectedRoute = protectedPaths.some(p => path.startsWith(p))
    const isAdminRoute = adminPaths.some(p => path.startsWith(p))

    if (isProtectedRoute || isAdminRoute) {
        if (!user) {
            if (path.startsWith('/api/')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
            return NextResponse.redirect(new URL('/login', request.url))
        }

        if (isAdminRoute) {
            // Check role from User table using supabase client
            const { data: userData } = await supabase
                .from('User')
                .select('role')
                .eq('supabaseId', user.id)
                .single()

            if (userData?.role !== 'ADMIN') {
                if (path.startsWith('/api/')) {
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
                }
                return NextResponse.redirect(new URL('/', request.url))
            }
        }

        // Add user info to headers for API routes (backward compatibility)
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-id', user.id)
        requestHeaders.set('x-user-email', user.email || '')

        response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    }

    // Security Headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    return response
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
