import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 공개 경로
    const publicPaths = ['/login'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    // 세션 확인
    const sessionCookie = request.cookies.get('session');
    const session = sessionCookie ? await verifyToken(sessionCookie.value) : null;

    // 로그인하지 않은 사용자가 보호된 페이지에 접근하려는 경우
    if (!session && !isPublicPath && !pathname.startsWith('/api')) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 로그인한 사용자가 로그인 페이지에 접근하려는 경우
    if (session && pathname === '/login') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
