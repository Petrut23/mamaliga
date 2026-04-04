const fs = require('fs')
let content = fs.readFileSync('app/api/admin/import-meciuri/route.ts', 'utf8')
content = content.replace(
  'process.env.RAPIDAPI_KEY || ""',
  'process.env.API_FOOTBALL_KEY || ""'
)
fs.writeFileSync('app/api/admin/import-meciuri/route.ts', content)
console.log('Gata!')