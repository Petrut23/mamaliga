const fs = require('fs')
let content = fs.readFileSync('app/api/clasament/route.ts', 'utf8')

content = content.replace(
  `      .sort((a, b) => 
        b.wins - a.wins || 
        b.total - a.total || 
        b.bestWeek - a.bestWeek ||
        b.rounds - a.rounds ||
        Math.random() - 0.5
      )`,
  `      .sort((a, b) => 
        b.wins - a.wins || 
        b.total - a.total || 
        b.bestWeek - a.bestWeek ||
        b.rounds - a.rounds ||
        a.name.localeCompare(b.name)
      )`
)

fs.writeFileSync('app/api/clasament/route.ts', content)
console.log('Gata!')