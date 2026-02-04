import { auth } from '@/auth';

export default auth;

export const config = {
  // Protect these routes
  matcher: [
    '/dashboard/:path*',
    '/design/:path*',
  ],
};