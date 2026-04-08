const fs = require('fs')
let content = fs.readFileSync('app/api/admin/sync-scoruri/route.ts', 'utf8')

content = content.replace(
  `    const rankings = await prisma.roundRanking.findMany({ where: { roundId: round.id }, orderBy: [{ finalPoints: "desc" }, { exactHits: "desc" }, { goalDiffHits: "desc" }, { resultHits: "desc" }] })
    for (let i = 0; i < rankings.length; i++) {
      await prisma.roundRanking.update({ where: { id: rankings[i].id }, data: { rank: i + 1 } })
    }`,
  `    const rankings = await prisma.roundRanking.findMany({ where: { roundId: round.id } })
    
    // Sortare cu random la egalitate totala
    const sorted = rankings.sort((a, b) => {
      if ((b.finalPoints ?? 0) !== (a.finalPoints ?? 0)) return (b.finalPoints ?? 0) - (a.finalPoints ?? 0)
      if (b.exactHits !== a.exactHits) return b.exactHits - a.exactHits
      if (b.goalDiffHits !== a.goalDiffHits) return b.goalDiffHits - a.goalDiffHits
      return Math.random() - 0.5
    })
    
    for (let i = 0; i < sorted.length; i++) {
      await prisma.roundRanking.update({ where: { id: sorted[i].id }, data: { rank: i + 1 } })
    }`
)

fs.writeFileSync('app/api/admin/sync-scoruri/route.ts', content)
console.log('Gata!')