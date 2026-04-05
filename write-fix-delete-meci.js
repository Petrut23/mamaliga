const fs = require('fs')
let content = fs.readFileSync('app/api/admin/meciuri/route.ts', 'utf8')

content = content.replace(
  `  await prisma.match.delete({ where: { id } })`,
  `  await prisma.matchPoint.deleteMany({ where: { matchId: id } })
  await prisma.prediction.deleteMany({ where: { matchId: id } })
  await prisma.match.delete({ where: { id } })`
)

fs.writeFileSync('app/api/admin/meciuri/route.ts', content)
console.log('Gata!')