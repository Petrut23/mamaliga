const fs = require('fs')
let content = fs.readFileSync('app/api/clasament/route.ts', 'utf8')

content = content.replace(
  `    // Forma recenta - din rankHistory fara query extra
    const lastRound = rounds[0]  // cea mai recenta
    const prevRound = rounds[1]  // penultima
    const formaRecenta: any = {}
    
    if (lastRound && prevRound) {
      for (const [userId, stats] of Object.entries(userStats) as any) {
        const lastRank = stats.rankHistory[lastRound.id] ?? 99
        const prevRank = stats.rankHistory[prevRound.id] ?? 99
        // rank mai mic numeric = pozitie mai buna (1 e mai bun ca 4)
        // daca lastRank < prevRank = ai urcat (ex: de la 4 la 2)
        if (lastRank < prevRank) formaRecenta[userId] = "up"
        else if (lastRank > prevRank) formaRecenta[userId] = "down"
        else formaRecenta[userId] = "same"
      }
    }`,
  `    // Forma recenta - comparam clasamentul general dupa N etape vs N-1 etape
    const formaRecenta: any = {}
    
    if (rounds.length >= 2) {
      const lastRound = rounds[0] // cea mai recenta
      
      // Clasament general FARA ultima etapa
      const prevRoundIds = roundIds.filter(id => id !== lastRound.id)
      const prevUserTotals: any = {}
      for (const rr of roundRankings) {
        if (!prevRoundIds.includes(rr.roundId)) continue
        if (!prevUserTotals[rr.userId]) prevUserTotals[rr.userId] = { wins: 0, total: 0 }
        prevUserTotals[rr.userId].total += rr.finalPoints || 0
        if (rr.rank === 1) prevUserTotals[rr.userId].wins++
      }
      
      const prevSorted = Object.entries(prevUserTotals)
        .sort(([, a]: any, [, b]: any) => b.wins - a.wins || b.total - a.total)
        .map(([uid], i) => ({ uid, rank: i + 1 }))
      
      // Clasament general CU toate etapele
      const currentSorted = Object.entries(userStats)
        .sort(([, a]: any, [, b]: any) => (b as any).wins - (a as any).wins || (b as any).total - (a as any).total)
        .map(([uid], i) => ({ uid, rank: i + 1 }))
      
      for (const curr of currentSorted) {
        const prev = prevSorted.find(p => p.uid === curr.uid)
        if (!prev) { formaRecenta[curr.uid] = "same"; continue }
        if (curr.rank < prev.rank) formaRecenta[curr.uid] = "up"
        else if (curr.rank > prev.rank) formaRecenta[curr.uid] = "down"
        else formaRecenta[curr.uid] = "same"
      }
    }`
)

fs.writeFileSync('app/api/clasament/route.ts', content)
console.log('Gata!')
