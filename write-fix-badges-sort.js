const fs = require('fs')
let content = fs.readFileSync('app/api/badges/route.ts', 'utf8')

content = content.replace(
  `  if (season) {
    const overallRankings = await prisma.roundRanking.groupBy({
      by: ["userId"],
      where: { round: { seasonId: season.id, status: "COMPLETED" } },
      _sum: { finalPoints: true },
      orderBy: { _sum: { finalPoints: "desc" } }
    })
    const myPosition = overallRankings.findIndex(r => r.userId === userId) + 1
    if (myPosition === 1) dynamic.push("campion")
    if (myPosition === 2) dynamic.push("aproape")
    if (myPosition === 3) dynamic.push("podium")
  }`,
  `  if (season) {
    const completedRounds = await prisma.round.findMany({
      where: { seasonId: season.id, status: "COMPLETED" }
    })
    const roundIds = completedRounds.map(r => r.id)
    
    const allRankings = await prisma.roundRanking.findMany({
      where: { roundId: { in: roundIds } },
      include: { user: { select: { id: true } } }
    })

    const userStats: any = {}
    for (const rr of allRankings) {
      if (!userStats[rr.userId]) userStats[rr.userId] = { wins: 0, total: 0, exact: 0, diff: 0, result: 0, captain10: 0 }
      userStats[rr.userId].total += rr.finalPoints ?? 0
      userStats[rr.userId].exact += rr.exactHits
      userStats[rr.userId].diff += rr.goalDiffHits
      userStats[rr.userId].result += rr.resultHits
      if (rr.rank === 1) userStats[rr.userId].wins++
      if (rr.captainPoints >= 10) userStats[rr.userId].captain10++
    }

    const sorted = Object.entries(userStats)
      .sort(([, a]: any, [, b]: any) => 
        b.wins - a.wins || b.total - a.total || b.exact - a.exact || b.diff - a.diff || b.result - a.result
      )
      .map(([uid]) => uid)

    const myPosition = sorted.indexOf(userId) + 1
    if (myPosition === 1) dynamic.push("campion")
    if (myPosition === 2) dynamic.push("aproape")
    if (myPosition === 3) dynamic.push("podium")
  }`
)

fs.writeFileSync('app/api/badges/route.ts', content)
console.log('Gata!')