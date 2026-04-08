const fs = require('fs')

const content = `import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const season = await prisma.season.findFirst({ where: { isActive: true } })
    if (!season) return NextResponse.json({ rankings: [], season: null })

    const rounds = await prisma.round.findMany({
      where: { seasonId: season.id, status: "COMPLETED" },
      orderBy: { createdAt: "desc" }
    })

    if (rounds.length === 0) return NextResponse.json({ rankings: [], season })

    const roundIds = rounds.map(r => r.id)

    // Un singur query pentru toate ranking-urile
    const roundRankings = await prisma.roundRanking.findMany({
      where: { roundId: { in: roundIds } },
      include: { user: { select: { id: true, name: true } } }
    })

    const userStats: any = {}
    
    for (const rr of roundRankings) {
      if (!userStats[rr.userId]) {
        userStats[rr.userId] = { 
          name: rr.user.name, total: 0, rounds: 0, 
          exact: 0, diff: 0, result: 0, captain: 0, 
          wins: 0, bestWeek: 0, captain10: 0,
          rankHistory: {}
        }
      }
      const pts = rr.finalPoints || rr.confirmedPoints || 0
      userStats[rr.userId].total += pts
      userStats[rr.userId].rounds += 1
      userStats[rr.userId].exact += rr.exactHits
      userStats[rr.userId].diff += rr.goalDiffHits
      userStats[rr.userId].result += rr.resultHits
      userStats[rr.userId].captain += rr.captainPoints
      if (rr.rank === 1) userStats[rr.userId].wins += 1
      if (pts > userStats[rr.userId].bestWeek) userStats[rr.userId].bestWeek = pts
      if (rr.captainPoints >= 10) userStats[rr.userId].captain10 += 1
      userStats[rr.userId].rankHistory[rr.roundId] = rr.rank
    }

    // Forma recenta - din rankHistory fara query extra
    const lastRound = rounds[0]
    const prevRound = rounds[1]
    const formaRecenta: any = {}
    
    if (lastRound && prevRound) {
      for (const [userId, stats] of Object.entries(userStats) as any) {
        const lastRank = stats.rankHistory[lastRound.id] ?? 99
        const prevRank = stats.rankHistory[prevRound.id] ?? 99
        if (lastRank < prevRank) formaRecenta[userId] = "up"
        else if (lastRank > prevRank) formaRecenta[userId] = "down"
        else formaRecenta[userId] = "same"
      }
    }

    const rankings = Object.entries(userStats)
      .map(([userId, s]: any) => ({
        userId, name: s.name, total: s.total, rounds: s.rounds, wins: s.wins,
        average: s.rounds > 0 ? Math.round((s.total / s.rounds) * 10) / 10 : 0,
        exact: s.exact, diff: s.diff, result: s.result, captain: s.captain,
        captain10: s.captain10, bestWeek: s.bestWeek,
        forma: formaRecenta[userId] || "same"
      }))
      .sort((a, b) => 
        b.wins - a.wins || 
        b.total - a.total || 
        b.bestWeek - a.bestWeek ||
        b.rounds - a.rounds ||
        Math.random() - 0.5
      )
      .map((r, i) => ({ ...r, rank: i + 1 }))

    return NextResponse.json({ rankings, season })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}`

fs.writeFileSync('app/api/clasament/route.ts', content)
console.log('Gata!')