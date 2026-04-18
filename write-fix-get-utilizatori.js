const fs = require('fs')
let content = fs.readFileSync('app/api/admin/utilizatori/route.ts', 'utf8')

content = content.replace(
  `select: { id: true, name: true, email: true, role: true, createdAt: true }`,
  `select: { id: true, name: true, email: true, role: true, createdAt: true, isApproved: true, receiveEmails: true }`
)

fs.writeFileSync('app/api/admin/utilizatori/route.ts', content)
console.log('Gata!')