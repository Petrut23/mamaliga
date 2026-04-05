import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const season = await prisma.season.findFirst({ where: { isActive: true } })
    if (!season) return NextResponse.json({ rankings: [], season: null })

    const rounds = await prisma.round.findMany({
      where: { seasonId: season.id, status: { in: ["COMPLETED", "LIVE", "LOCKED"] } }
    })

    const roundIds = rounds.map(r => r.id)
    if (roundIds.length === 0) return NextResponse.json({ rankings: [], season })

    const roundRankings = await prisma.roundRanking.findMany({
      where: { roundId: { in: roundIds } },
      include: { user: { select: { id: true, name: true } } }
    })

    const userStats: any = {}
    for (const rr of roundRankings) {
      if (!userStats[rr.userId]) {
        userStats[rr.userId] = { name: rr.user.name, total: 0, rounds: 0, exact: 0, diff: 0, result: 0, captain: 0 }
      }
      userStats[rr.userId].total += rr.finalPoints || rr.confirmedPoints
      userStats[rr.userId].rounds += 1
      userStats[rr.userId].exact += rr.exactHits
      userStats[rr.userId].diff += rr.goalDiffHits
      userStats[rr.userId].result += rr.resultHits
      userStats[rr.userId].captain += rr.captainPoints
    }

    const rankings = Object.entries(userStats)
      .map(([userId, s]: any) => ({
        userId, name: s.name, total: s.total, rounds: s.rounds,
        average: s.rounds > 0 ? Math.round((s.total / s.rounds) * 10) / 10 : 0,
        exact: s.exact, diff: s.diff, result: s.result, captain: s.captain
      }))
      .sort((a, b) => b.total - a.total || b.exact - a.exact || b.diff - a.diff)
      .map((r, i) => ({ ...r, rank: i + 1 }))

    return NextResponse.json({ rankings, season })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}