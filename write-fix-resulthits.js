const fs = require('fs')
let content = fs.readFileSync('app/api/admin/sync-scoruri/route.ts', 'utf8')

content = content.replace(
  `orderBy: [{ finalPoints: "desc" }, { exactHits: "desc" }, { goalDiffHits: "desc" }]`,
  `orderBy: [{ finalPoints: "desc" }, { exactHits: "desc" }, { goalDiffHits: "desc" }, { resultHits: "desc" }]`
)

fs.writeFileSync('app/api/admin/sync-scoruri/route.ts', content)
console.log('Gata!')