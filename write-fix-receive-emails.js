const fs = require('fs')

// Fix etape API - scoatem where receiveEmails temporar
let content = fs.readFileSync('app/api/admin/etape/route.ts', 'utf8')
content = content.replace(
  `    const users = await prisma.user.findMany({
      where: { receiveEmails: true },
      select: { email: true, name: true }
    })`,
  `    const users = await prisma.user.findMany({
      select: { email: true, name: true, receiveEmails: true }
    })`
)

// Filtram in cod nu in query
content = content.replace(
  `    for (const user of users) {`,
  `    const filteredUsers = users.filter((u: any) => u.receiveEmails !== false)
    for (const user of filteredUsers) {`
)

fs.writeFileSync('app/api/admin/etape/route.ts', content)
console.log('Gata!')