const fs = require('fs')
let content = fs.readFileSync('app/api/clasament/route.ts', 'utf8')

// Adaugam best week in userStats
content = content.replace(
  `      userStats[rr.userId].total += rr.finalPoints || rr.confirmedPoints
      userStats[rr.userId].rounds += 1
      userStats[rr.userId].exact += rr.exactHits
      userStats[rr.userId].diff += rr.goalDiffHits
      userStats[rr.userId].result += rr.resultHits
      userStats[rr.userId].captain += rr.captainPoints
      if (rr.rank === 1) userStats[rr.userId].wins += 1`,
  `      const pts = rr.finalPoints || rr.confirmedPoints
      userStats[rr.userId].total += pts
      userStats[rr.userId].rounds += 1
      userStats[rr.userId].exact += rr.exactHits
      userStats[rr.userId].diff += rr.goalDiffHits
      userStats[rr.userId].result += rr.resultHits
      userStats[rr.userId].captain += rr.captainPoints
      if (rr.rank === 1) userStats[rr.userId].wins += 1
      if (pts > (userStats[rr.userId].bestWeek || 0)) userStats[rr.userId].bestWeek = pts`
)

// Initializam bestWeek in userStats
content = content.replace(
  `      userStats[rr.userId] = { name: rr.user.name, total: 0, rounds: 0, exact: 0, diff: 0, result: 0, captain: 0, wins: 0 }`,
  `      userStats[rr.userId] = { name: rr.user.name, total: 0, rounds: 0, exact: 0, diff: 0, result: 0, captain: 0, wins: 0, bestWeek: 0 }`
)

// Adaugam bestWeek in map
content = content.replace(
  `        captain10: captain10PerUser[userId] || 0,
        forma: formaRecenta[userId] || "same"`,
  `        captain10: captain10PerUser[userId] || 0,
        forma: formaRecenta[userId] || "same",
        bestWeek: s.bestWeek || 0`
)

// Schimbam logica de sortare
content = content.replace(
  `      .sort((a, b) => 
        b.wins - a.wins || 
        b.total - a.total || 
        b.rounds - a.rounds || 
        b.captain10 - a.captain10
      )`,
  `      .sort((a, b) => 
        b.wins - a.wins || 
        b.total - a.total || 
        b.bestWeek - a.bestWeek ||
        b.rounds - a.rounds ||
        Math.random() - 0.5
      )`
)

fs.writeFileSync('app/api/clasament/route.ts', content)
console.log('Gata!')