const fs = require('fs')
let content = fs.readFileSync('app/api/live/route.ts', 'utf8')

content = content.replace(
  `.sort((a, b) => b.total - a.total || b.confirmed - a.confirmed)`,
  `.sort((a, b) => b.total - a.total || b.exact - a.exact || b.confirmed - a.confirmed)`
)

fs.writeFileSync('app/api/live/route.ts', content)
console.log('Gata!')