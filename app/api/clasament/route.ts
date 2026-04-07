import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const season = await prisma.season.findFirst({ where: { isActive: true } })
    if (!season) return NextResponse.json({ rankings: [], season: null })

    const rounds = await prisma.round.findMany({
      where: { seasonId: season.id, status: "COMPLETED" }
    })

    const roundIds = rounds.map(r => r.id)
    if (roundIds.length === 0) return NextResponse.json({ rankings: [], season })

    const roundRankings = await prisma.roundRanking.findMany({
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
    }

    const userStats: any = {}
    for (const rr of roundRankings) {
      if (!userStats[rr.userId]) {
        userStats[rr.userId] = { name: rr.user.name, total: 0, rounds: 0, exact: 0, diff: 0, result: 0, captain: 0, wins: 0 }
      }
      userStats[rr.userId].total += rr.finalPoints || rr.confirmedPoints
      userStats[rr.userId].rounds += 1
      userStats[rr.userId].exact += rr.exactHits
      userStats[rr.userId].diff += rr.goalDiffHits
      userStats[rr.userId].result += rr.resultHits
      userStats[rr.userId].captain += rr.captainPoints
      if (rr.rank === 1) userStats[rr.userId].wins += 1
    }

    // Calculeaza captain10 per user
    const captain10PerUser: any = {}
    for (const rr of roundRankings) {
      if (!captain10PerUser[rr.userId]) captain10PerUser[rr.userId] = 0
      if (rr.captainPoints >= 10) captain10PerUser[rr.userId]++
    }

    const rankings = Object.entries(userStats)
      .map(([userId, s]: any) => ({
        userId, name: s.name, total: s.total, rounds: s.rounds, wins: s.wins,
        average: s.rounds > 0 ? Math.round((s.total / s.rounds) * 10) / 10 : 0,
        exact: s.exact, diff: s.diff, result: s.result, captain: s.captain,
        captain10: captain10PerUser[userId] || 0,
        forma: formaRecenta[userId] || "same"
      }))
      .sort((a, b) => 
        b.wins - a.wins || 
        b.total - a.total || 
        b.rounds - a.rounds || 
        b.captain10 - a.captain10
      )
      .map((r, i) => ({ ...r, rank: i + 1 }))

    return NextResponse.json({ rankings, season })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}