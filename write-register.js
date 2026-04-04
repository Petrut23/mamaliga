const fs = require('fs')
let content = fs.readFileSync('app/api/auth/register/route.ts', 'utf8')
content = 'export const dynamic = "force-dynamic"\n\n' + content
fs.writeFileSync('app/api/auth/register/route.ts', content)
console.log('Gata!')