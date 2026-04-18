const fs = require('fs')
let content = fs.readFileSync('app/api/admin/etape/route.ts', 'utf8')

content = content.replace(
  `const users = await prisma.user.findMany({
      select: { email: true, name: true }
    })`,
  `const users = await prisma.user.findMany({
      select: { email: true, name: true, receiveEmails: true }
    })
    const filteredUsers = users.filter((u: any) => u.receiveEmails !== false)`
)

content = content.replace(
  `    for (const user of users) {`,
  `    for (const user of filteredUsers) {`
)

fs.writeFileSync('app/api/admin/etape/route.ts', content)
console.log('Gata!')