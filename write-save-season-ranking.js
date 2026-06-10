const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const season = await prisma.season.findFirst({ where: { isActive: true } })
  if (!season) { console.log('Niciun sezon activ!'); return }
  console.log('Sezon:', season.name)

  // Preia date istorice
  const historicRankings = await prisma.$queryRaw`
    SELECT hr.*, u.name, u.id as "userId"
    FROM "HistoricRanking" hr
    JOIN "User" u ON hr."userId" = u.id
  `

  // Preia etapele completate
  const rounds = await prisma.round.findMany({
    where: { seasonId: season.id, status: 'COMPLETED' }
  })
  const roundIds = rounds.map(r => r.id)

  const allRoundRankings = await prisma.roundRanking.findMany({
    where: { roundId: { in: roundIds } },
    include: { user: { select: { id: true, name: true } } }
  })

  // Combina datele
  const userStats = {}

  for (const h of historicRankings) {
    userStats[h.userId] = {
      name: h.name,
      total: Number(h.totalPoints),
      rounds: Number(h.roundsPlayed),
      wins: Number(h.roundsWon),
      bestRound: Number(h.bestRound),
    }
  }

  for (const rr of allRoundRankings) {
    if (!userStats[rr.userId]) {
      userStats[rr.userId] = { name: rr.user.name, total: 0, rounds: 0, wins: 0, bestRound: 0 }
    }
    const pts = rr.finalPoints ?? 0
    userStats[rr.userId].total += pts
    userStats[rr.userId].rounds += 1
    if (rr.rank === 1) userStats[rr.userId].wins += 1
    if (pts > userStats[rr.userId].bestRound) userStats[rr.userId].bestRound = pts
  }

  // Sorteaza
  const sorted = Object.entries(userStats)
    .map(([userId, s]) => ({
      userId, ...s,
      average: s.rounds > 0 ? Math.round((s.total / s.rounds) * 10) / 10 : 0
    }))
    .sort((a, b) => b.wins - a.wins || b.total - a.total || b.bestRound - a.bestRound)

  // Salveaza in SeasonRanking
  for (let i = 0; i < sorted.length; i++) {
    const r = sorted[i]
    await prisma.$executeRaw`
      INSERT INTO "SeasonRanking" ("id", "seasonId", "userId", "totalPoints", "roundsPlayed", "roundsWon", "average", "bestRound", "finalRank")
      VALUES (gen_random_uuid(), ${season.id}, ${r.userId}, ${r.total}, ${r.rounds}, ${r.wins}, ${r.average}, ${r.bestRound}, ${i + 1})
      ON CONFLICT ("seasonId", "userId") DO UPDATE SET
        "totalPoints" = ${r.total},
        "roundsPlayed" = ${r.rounds},
        "roundsWon" = ${r.wins},
        "average" = ${r.average},
        "bestRound" = ${r.bestRound},
        "finalRank" = ${i + 1}
    `
    console.log(`${i + 1}. ${r.name} — ${r.total} pct, ${r.wins} castigate`)
  }

  console.log('Gata! Clasament salvat!')
}

main().catch(console.error).finally(() => prisma.$disconnect())