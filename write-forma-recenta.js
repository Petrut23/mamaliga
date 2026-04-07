const fs = require('fs')
let content = fs.readFileSync('app/api/clasament/route.ts', 'utf8')

content = content.replace(
  `    const roundRankings = await prisma.roundRanking.findMany({
      where: { roundId: { in: roundIds } },
      include: { user: { select: { id: true, name: true } } }
    })`,
  `    const roundRankings = await prisma.roundRanking.findMany({
      where: { roundId: { in: roundIds } },
      include: { user: { select: { id: true, name: true } } }
    })

    // Calculeaza forma recenta - ultimele 2 etape
    const sortedRounds = rounds.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const lastRound = sortedRounds[0]
    const prevRound = sortedRounds[1]

    const formaRecenta: any = {}
    if (lastRound && prevRound) {
      const lastRankings = await prisma.roundRanking.findMany({ where: { roundId: lastRound.id } })
      const prevRankings = await prisma.roundRanking.findMany({ where: { roundId: prevRound.id } })
      
      for (const lr of lastRankings) {
        const pr = prevRankings.find(r => r.userId === lr.userId)
        if (!pr) { formaRecenta[lr.userId] = "new"; continue }
        if ((lr.rank ?? 99) < (pr.rank ?? 99)) formaRecenta[lr.userId] = "up"
        else if ((lr.rank ?? 99) > (pr.rank ?? 99)) formaRecenta[lr.userId] = "down"
        else formaRecenta[lr.userId] = "same"
      }
    }`
)

content = content.replace(
  `        userId, name: s.name, total: s.total, rounds: s.rounds, wins: s.wins,
        average: s.rounds > 0 ? Math.round((s.total / s.rounds) * 10) / 10 : 0,
        exact: s.exact, diff: s.diff, result: s.result, captain: s.captain,
        captain10: captain10PerUser[userId] || 0`,
  `        userId, name: s.name, total: s.total, rounds: s.rounds, wins: s.wins,
        average: s.rounds > 0 ? Math.round((s.total / s.rounds) * 10) / 10 : 0,
        exact: s.exact, diff: s.diff, result: s.result, captain: s.captain,
        captain10: captain10PerUser[userId] || 0,
        forma: formaRecenta[userId] || "same"`
)

fs.writeFileSync('app/api/clasament/route.ts', content)
console.log('Gata API!')

// Update pagina clasament sa afiseze sagetile
let page = fs.readFileSync('app/clasament/page.tsx', 'utf8')

page = page.replace(
  `                      <span className={"font-bold text-base " + (isMe ? "text-[#e8ff47]" : "text-white")}>
                          {r.name} {isMe && <span className="text-xs font-normal text-gray-500">(tu)</span>}
                        </span>`,
  `                      <div className="flex items-center gap-2">
                          <span className={"font-bold text-base " + (isMe ? "text-[#e8ff47]" : "text-white")}>
                            {r.name} {isMe && <span className="text-xs font-normal text-gray-500">(tu)</span>}
                          </span>
                          {r.forma === "up" && <span className="text-green-400 text-sm font-black">↑</span>}
                          {r.forma === "down" && <span className="text-red-400 text-sm font-black">↓</span>}
                          {r.forma === "same" && <span className="text-gray-600 text-sm">→</span>}
                        </div>`
)

fs.writeFileSync('app/clasament/page.tsx', page)
console.log('Gata pagina!')