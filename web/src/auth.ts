import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import { prisma } from '@/lib/prisma';

// NextAuth v5 Configuration
const config: NextAuthConfig = {
  // Prisma Adapter
  adapter: PrismaAdapter(prisma),

  // OAuth Providers
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  // Session Strategy
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom Pages
  pages: {
    signIn: '/login',
    error: '/login',
  },

  // Callbacks
  callbacks: {
    // Add user ID to JWT
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Add user ID to session
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },

    // Authorize callback for protected routes
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                               request.nextUrl.pathname.startsWith('/design');

      if (isProtectedRoute && !isLoggedIn) {
        return Response.redirect(new URL('/login', request.nextUrl));
      }

      return true;
    },
  },

  // Debug in development
  debug: process.env.NODE_ENV === 'development',
};

// Export NextAuth v5 handlers and helpers
export const { handlers, auth, signIn, signOut } = NextAuth(config);