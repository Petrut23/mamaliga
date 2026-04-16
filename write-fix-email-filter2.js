const fs = require('fs')
let content = fs.readFileSync('app/api/admin/etape/route.ts', 'utf8')

content = content.replace(
  `const users = await prisma.user.findMany({
      select: { email: true, name: true, receiveEmails: true }
    })
    const filteredUsers = users.filter((u: any) => u.receiveEmails !== false)`,
  `const allUsers = await prisma.user.findMany({
      select: { email: true, name: true }
    })
    const usersWithPref = await prisma.$queryRaw\`SELECT email, "receiveEmails" FROM "User"\` as any[]
    const filteredUsers = allUsers.filter((u: any) => {
      const pref = usersWithPref.find((p: any) => p.email === u.email)
      return pref ? pref.receiveEmails !== false : true
    })`
)

content = content.replace(
  `    for (const user of filteredUsers) {`,
  `    for (const user of filteredUsers) {`
)

fs.writeFileSync('app/api/admin/etape/route.ts', content)
console.log('Gata!')