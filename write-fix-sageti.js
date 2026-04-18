const fs = require('fs')
let content = fs.readFileSync('app/api/clasament/route.ts', 'utf8')

content = content.replace(
  `      if (rr.captainPoints >= 10) userStats[rr.userId].captain10 += 1`,
  `      if (rr.captainPoints >= 10) userStats[rr.userId].captain10 += 1
      userStats[rr.userId].rankHistory[rr.roundId] = rr.rank ?? 99`
)

fs.writeFileSync('app/api/clasament/route.ts', content)
console.log('Gata!')