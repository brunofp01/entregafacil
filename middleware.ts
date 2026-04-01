import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return response;

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    const pathname = request.nextUrl.pathname;

    // 1. Protection for Login page
    const isLogoutTransition = request.nextUrl.searchParams.get('logout') === 'true';
    if (pathname === '/login' && user && !isLogoutTransition) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 2. Protection for standard user routes
    const protectedRoutes = ['/dashboard', '/contracts', '/inspections', '/agency', '/admin'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 3. RBAC - Role Based Access Control
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      const role = profile?.role || 'tenant';

      // Fast-redirect for /dashboard to specific role dashboards
      if (pathname === '/dashboard') {
        if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        if (role === 'agency') return NextResponse.redirect(new URL('/agency/dashboard', request.url));
      }

      // Security: Block unauthorized access to agency/admin routes
      if (pathname.startsWith('/agency') && role !== 'agency' && role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      if (pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }

  } catch (err) {
    console.error('Middleware Error:', err);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
