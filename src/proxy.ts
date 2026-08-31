import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Nếu truy cập vào /admin nhưng không phải /admin/login
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session');
    
    // Kiểm tra cookie hợp lệ
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Nếu truy cập /admin/login mà đã có session thì đẩy vào /admin
  if (path === '/admin/login') {
    const sessionCookie = request.cookies.get('admin_session');
    if (sessionCookie && sessionCookie.value === 'authenticated') {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
