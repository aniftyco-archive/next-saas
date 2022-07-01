/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client';

// add prisma to the global type
declare global {
  var prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}
