import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const seasonId = searchParams.get("seasonId")
    const season = seasonId
      ? await prisma.season.findUnique({ where: { id: seasonId } })
      : await prisma.season.findFirst({ where: { isActive: true } })

    if (!season) return NextResponse.json({ rankings: [], season: null })

    const istoricRankings = season.isActive ? await prisma.$queryRaw`
      SELECT hr.*, u.name, u.id as "userId"
      FROM "HistoricRanking" hr
      JOIN "User" u ON hr."userId" = u.id
    ` as any[] : []

    const rounds = await prisma.round.findMany({
      where: { seasonId: season.id, status: "COMPLETED" },
      orderBy: { createdAt: "desc" }
    })
    const roundIds = rounds.map(r => r.id)

    const roundRankings = roundIds.length > 0 ? await prisma.roundRanking.findMany({
      where: { roundId: { in: roundIds } },
      include: { user: { select: { id: true, name: true } } }
    }) : []

    const userStats: any = {}

    for (const h of istoricRankings) {
      userStats[h.userId] = {
        name: h.name,
        total: Number(h.totalPoints),
        rounds: Number(h.roundsPlayed),
        wins: Number(h.roundsWon),
        exact: 0, diff: 0, result: 0, captain: 0,
        captain10: 0,
        bestWeek: Number(h.bestRound),
        rankHistory: {},
        hasHistoric: true
      }
    }

    for (const rr of roundRankings) {
      if (!userStats[rr.userId]) {
        userStats[rr.userId] = {
          name: rr.user.name, total: 0, rounds: 0,
          exact: 0, diff: 0, result: 0, captain: 0,
          wins: 0, captain10: 0, bestWeek: 0,
          rankHistory: {}, hasHistoric: false
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
     .sort((a, b) => {
        const isWC = seasonId === "ca080bd2-7691-4396-a123-5264ffaeceef"
        if (isWC) {
          return b.total - a.total ||
            b.exact - a.exact ||
            b.diff - a.diff ||
            b.result - a.result ||
            a.name.localeCompare(b.name)
        }
        return b.wins - a.wins ||
          b.total - a.total ||
          b.bestWeek - a.bestWeek ||
          b.rounds - a.rounds ||
          a.name.localeCompare(b.name)
      })
      .map((r, i) => ({ ...r, rank: i + 1 }))

    return NextResponse.json({ rankings, season })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
