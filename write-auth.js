const fs = require('fs')
let content = fs.readFileSync('auth.ts', 'utf8')
content = content.replace(
  'session.user.role = token.role as string',
  '(session.user as any).role = token.role as string'
)
fs.writeFileSync('auth.ts', content)
console.log('Gata!')