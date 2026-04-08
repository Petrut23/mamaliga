import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const season = await prisma.season.findFirst({ where: { isActive: true } })
    if (!season) return NextResponse.json({ etape: [] })

    const rounds = await prisma.round.findMany({
      where: { seasonId: season.id, status: "COMPLETED" },
      orderBy: { createdAt: "desc" }
    })

    const roundIds = rounds.map(r => r.id)
    const allRankings = await prisma.roundRanking.findMany({
      where: { roundId: { in: roundIds } },
      include: { user: { select: { id: true, name: true } } }
    })

    const etape = rounds.map(round => {
      const roundRankings = allRankings
        .filter(r => r.roundId === round.id)
        .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
        .map(r => ({
          userId: r.userId,
          name: r.user.name,
          rank: r.rank ?? 99,
          points: r.finalPoints || r.confirmedPoints || 0,
          exact: r.exactHits,
          diff: r.goalDiffHits,
          result: r.resultHits
        }))

      return { id: round.id, title: round.title, rankings: roundRankings }
    })

    return NextResponse.json({ etape })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}