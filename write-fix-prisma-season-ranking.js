const fs = require('fs')
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8')

const seasonRankingModel = `
model SeasonRanking {
  id           String   @id @default(cuid())
  seasonId     String
  userId       String
  totalPoints  Int      @default(0)
  roundsPlayed Int      @default(0)
  roundsWon    Int      @default(0)
  average      Decimal  @default(0)
  bestRound    Int      @default(0)
  finalRank    Int      @default(0)
  season       Season   @relation(fields: [seasonId], references: [id])
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([seasonId, userId])
}
`

schema = schema + seasonRankingModel
fs.writeFileSync('prisma/schema.prisma', schema)
console.log('Gata!')