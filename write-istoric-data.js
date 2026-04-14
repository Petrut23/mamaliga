require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const istoricDate = [
  { name: "Petrut", totalPoints: 497, roundsPlayed: 28, roundsWon: 3, average: 17.8, bestRound: 34 },
  { name: "Geo",    totalPoints: 461, roundsPlayed: 28, roundsWon: 3, average: 16.5, bestRound: 26 },
  { name: "Rivi",   totalPoints: 454, roundsPlayed: 29, roundsWon: 1, average: 15.7, bestRound: 31 },
  { name: "Octa",   totalPoints: 509, roundsPlayed: 28, roundsWon: 3, average: 18.2, bestRound: 31 },
  { name: "Voje",   totalPoints: 494, roundsPlayed: 26, roundsWon: 6, average: 19.0, bestRound: 36 },
  { name: "Djbau",  totalPoints: 452, roundsPlayed: 27, roundsWon: 4, average: 16.7, bestRound: 33 },
]

async function main() {
  for (const d of istoricDate) {
    const user = await prisma.user.findFirst({ where: { name: d.name } })
    if (!user) {
      console.log('User negasit:', d.name)
      continue
    }

    await prisma.$executeRaw`
      INSERT INTO "HistoricRanking" ("id", "userId", "totalPoints", "roundsPlayed", "roundsWon", "average", "bestRound")
      VALUES (gen_random_uuid(), ${user.id}, ${d.totalPoints}, ${d.roundsPlayed}, ${d.roundsWon}, ${d.average}, ${d.bestRound})
      ON CONFLICT ("userId") DO UPDATE SET
        "totalPoints" = ${d.totalPoints},
        "roundsPlayed" = ${d.roundsPlayed},
        "roundsWon" = ${d.roundsWon},
        "average" = ${d.average},
        "bestRound" = ${d.bestRound}
    `
    console.log('Inserat:', d.name)
  }
  console.log('Gata!')
}

main().catch(console.error).finally(() => prisma.$disconnect())