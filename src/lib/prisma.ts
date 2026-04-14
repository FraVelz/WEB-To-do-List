import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
  pool?: Pool
}

const connectionString =
  process.env.DATABASE_URL?.trim() ||
  'postgresql://postgres:postgres@127.0.0.1:5432/todo_placeholder?schema=public'

function createClient() {
  const pool =
    globalForPrisma.pool ?? new Pool({ connectionString, max: 10 })
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool
  }

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
