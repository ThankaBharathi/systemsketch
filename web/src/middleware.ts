export { auth as middleware } from '@/auth';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/designs/:path*',
    '/interview/:path*',
    '/settings/:path*',
    '/templates/:path*',
  ],
};