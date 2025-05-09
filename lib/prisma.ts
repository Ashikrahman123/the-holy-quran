import { PrismaClient } from "@prisma/client"

// This is important to prevent multiple instances of Prisma Client in development
// https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Export a higher-order function to get the prisma client
// This helps with tree-shaking and prevents the client from being bundled in the browser
export async function getPrismaClient() {
  return { prisma }
}
