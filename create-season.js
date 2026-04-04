const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const sezon = await prisma.season.create({
    data: { name: '2026/2027', isActive: true }
  })
  console.log('Sezon creat:', sezon.name)
}

main().catch(console.error).finally(() => prisma.$disconnect())