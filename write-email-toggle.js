const fs = require('fs')

// Update schema prisma
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8')
schema = schema.replace(
  `  passwordHash String
  role          String   @default("USER")`,
  `  passwordHash  String
  role          String   @default("USER")
  receiveEmails Boolean  @default(true)`
)
fs.writeFileSync('prisma/schema.prisma', schema)

// Update API utilizatori - adauga toggle
let utilizatoriApi = fs.readFileSync('app/api/admin/utilizatori/route.ts', 'utf8')
utilizatoriApi = utilizatoriApi.replace(
  `  select: { id: true, name: true, email: true, role: true, createdAt: true }`,
  `  select: { id: true, name: true, email: true, role: true, createdAt: true, receiveEmails: true }`
)
utilizatoriApi = utilizatoriApi.replace(
  `  const { id, role } = await req.json()
  const user = await prisma.user.update({ where: { id }, data: { role } })`,
  `  const { id, role, receiveEmails } = await req.json()
  const updateData: any = {}
  if (role !== undefined) updateData.role = role
  if (receiveEmails !== undefined) updateData.receiveEmails = receiveEmails
  const user = await prisma.user.update({ where: { id }, data: updateData })`
)
fs.writeFileSync('app/api/admin/utilizatori/route.ts', utilizatoriApi)

// Update trimitere emailuri sa verifice receiveEmails
let etapeApi = fs.readFileSync('app/api/admin/etape/route.ts', 'utf8')
etapeApi = etapeApi.replace(
  `    const users = await prisma.user.findMany({
      select: { email: true, name: true }
    })`,
  `    const users = await prisma.user.findMany({
      where: { receiveEmails: true },
      select: { email: true, name: true }
    })`
)
fs.writeFileSync('app/api/admin/etape/route.ts', etapeApi)

console.log('Gata!')