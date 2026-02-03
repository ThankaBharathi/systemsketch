import { PrismaClient } from '@prisma/client';

// Declare global type for prisma
declare global {
   
  var prisma: PrismaClient | undefined;
}

// Create prisma client
// In development, use global to prevent multiple instances
export const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;