const fs = require('fs')

let content = fs.readFileSync('app/api/admin/etape/route.ts', 'utf8')

content = content.replace(
  `  await prisma.match.deleteMany({ where: { roundId: id } })
  await prisma.round.delete({ where: { id } })`,
  `  const matches = await prisma.match.findMany({ where: { roundId: id } })
  const matchIds = matches.map(m => m.id)
  await prisma.matchPoint.deleteMany({ where: { matchId: { in: matchIds } } })
  await prisma.prediction.deleteMany({ where: { matchId: { in: matchIds } } })
  await prisma.roundRanking.deleteMany({ where: { roundId: id } })
  await prisma.match.deleteMany({ where: { roundId: id } })
  await prisma.round.delete({ where: { id } })`
)

fs.writeFileSync('app/api/admin/etape/route.ts', content)
console.log('Gata!')