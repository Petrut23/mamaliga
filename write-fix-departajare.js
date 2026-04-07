const fs = require('fs')
let content = fs.readFileSync('app/api/clasament/route.ts', 'utf8')

content = content.replace(
  `    const rankings = Object.entries(userStats)
      .map(([userId, s]: any) => ({
        userId, name: s.name, total: s.total, rounds: s.rounds, wins: s.wins,
        average: s.rounds > 0 ? Math.round((s.total / s.rounds) * 10) / 10 : 0,
        exact: s.exact, diff: s.diff, result: s.result, captain: s.captain
      }))
      .sort((a, b) => b.wins - a.wins || b.total - a.total || b.exact - a.exact || b.diff - a.diff || b.result - a.result)
      .map((r, i) => ({ ...r, rank: i + 1 }))`,
  `    // Calculeaza captain10 per user
    const captain10PerUser: any = {}
    for (const rr of roundRankings) {
      if (!captain10PerUser[rr.userId]) captain10PerUser[rr.userId] = 0
      if (rr.captainPoints >= 10) captain10PerUser[rr.userId]++
    }

    const rankings = Object.entries(userStats)
      .map(([userId, s]: any) => ({
        userId, name: s.name, total: s.total, rounds: s.rounds, wins: s.wins,
        average: s.rounds > 0 ? Math.round((s.total / s.rounds) * 10) / 10 : 0,
        exact: s.exact, diff: s.diff, result: s.result, captain: s.captain,
        captain10: captain10PerUser[userId] || 0
      }))
      .sort((a, b) => 
        b.wins - a.wins || 
        b.total - a.total || 
        b.rounds - a.rounds || 
        b.captain10 - a.captain10
      )
      .map((r, i) => ({ ...r, rank: i + 1 }))`
)

fs.writeFileSync('app/api/clasament/route.ts', content)
console.log('Gata!')