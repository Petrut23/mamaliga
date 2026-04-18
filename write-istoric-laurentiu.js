require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst({ where: { name: { contains: "Laurentiu", mode: "insensitive" } } })
  if (!user) {
    console.log('User negasit!')
    return
  }
  console.log('Gasit:', user.name, user.id)

  await prisma.$executeRaw`
    INSERT INTO "HistoricRanking" ("id", "userId", "totalPoints", "roundsPlayed", "roundsWon", "average", "bestRound")
    VALUES (gen_random_uuid(), ${user.id}, ${551}, ${29}, ${5}, ${19.0}, ${29})
    ON CONFLICT ("userId") DO UPDATE SET
      "totalPoints" = ${551},
      "roundsPlayed" = ${29},
      "roundsWon" = ${5},
      "average" = ${19.0},
      "bestRound" = ${29}
  `
  console.log('Inserat cu succes!')
}

main().catch(console.error).finally(() => prisma.$disconnect())