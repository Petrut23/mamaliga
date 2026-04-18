const fs = require('fs')
let content = fs.readFileSync('app/api/admin/etape/route.ts', 'utf8')

content = content.replace(
  `href="https://mamaliga.vercel.app"`,
  `href="https://mamaliga.vercel.app/predictii"`
)

fs.writeFileSync('app/api/admin/etape/route.ts', content)
console.log('Gata!')