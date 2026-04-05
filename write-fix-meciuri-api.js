const fs = require('fs')

let content = fs.readFileSync('app/api/admin/meciuri/route.ts', 'utf8')

content = content.replace(
  `  const { roundId, homeTeam, awayTeam, competitionName, kickoffAt } = await req.json()
  const meci = await prisma.match.create({
    data: { roundId, homeTeam, awayTeam, competitionName, kickoffAt: new Date(kickoffAt) }        
  })`,
  `  const { roundId, homeTeam, awayTeam, competitionName, kickoffAt, externalApiId, provider } = await req.json()
  const meci = await prisma.match.create({
    data: { roundId, homeTeam, awayTeam, competitionName, kickoffAt: new Date(kickoffAt), externalApiId: externalApiId || null, provider: provider || null }        
  })`
)

fs.writeFileSync('app/api/admin/meciuri/route.ts', content)
console.log('Gata!')