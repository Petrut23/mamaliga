require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst({ where: { name: { contains: "Razvan", mode: "insensitive" } } })
  if (!user) {
    console.log('User negasit!')
    return
  }
  console.log('Gasit:', user.name, user.id)

  await prisma.$executeRaw`
    INSERT INTO "HistoricRanking" ("id", "userId", "totalPoints", "roundsPlayed", "roundsWon", "average", "bestRound")
    VALUES (gen_random_uuid(), ${user.id}, ${518}, ${28}, ${4}, ${18.5}, ${37})
    ON CONFLICT ("userId") DO UPDATE SET
      "totalPoints" = ${518},
      "roundsPlayed" = ${28},
      "roundsWon" = ${4},
      "average" = ${18.5},
      "bestRound" = ${37}
  `
  console.log('Inserat cu succes!')
}

main().catch(console.error).finally(() => prisma.$disconnect())