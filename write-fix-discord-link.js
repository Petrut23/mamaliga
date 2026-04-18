const fs = require('fs')
let content = fs.readFileSync('app/api/admin/etape/route.ts', 'utf8')

content = content.replace(
  `[Intră pe MamaLIGA](https://mamaliga.vercel.app)`,
  `[Intră pe MamaLIGA](https://mamaliga.vercel.app/predictii)`
)

fs.writeFileSync('app/api/admin/etape/route.ts', content)
console.log('Gata!')