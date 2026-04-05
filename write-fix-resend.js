const fs = require('fs')
let content = fs.readFileSync('app/api/admin/etape/route.ts', 'utf8')

content = content.replace(
  `          from: fromEmail,`,
  `          from: "MamaLIGA <onboarding@resend.dev>",`
)

fs.writeFileSync('app/api/admin/etape/route.ts', content)
console.log('Gata!')