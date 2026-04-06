const fs = require('fs')
let content = fs.readFileSync('app/api/head-to-head/route.ts', 'utf8')

content = content.replace(
  `    const myPts = myRanking.finalPoints
    const oppPts = opponentRanking.finalPoints`,
  `    const myPts = myRanking.finalPoints ?? 0
    const oppPts = opponentRanking.finalPoints ?? 0`
)

fs.writeFileSync('app/api/head-to-head/route.ts', content)
console.log('Gata!')