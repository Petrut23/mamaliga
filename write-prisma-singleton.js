const fs = require('fs')

const singleton = `import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma`

fs.writeFileSync('lib/prisma.ts', singleton)
console.log('Gata!')