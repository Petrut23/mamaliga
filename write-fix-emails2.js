const fs = require('fs')
let content = fs.readFileSync('app/api/admin/etape/route.ts', 'utf8')

// Sterge orice where cu receiveEmails
content = content.replace(
  `      where: { receiveEmails: true },
      select: { email: true, name: true }`,
  `      select: { email: true, name: true }`
)

fs.writeFileSync('app/api/admin/etape/route.ts', content)
console.log('Gata!')