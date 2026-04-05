import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
export const dynamic = "force-dynamic"
const prisma = new PrismaClient()

function calculeazaPuncte(predHome: number, predAway: number, realHome: number, realAway: number): number {
  if (predHome === realHome && predAway === realAway) return 5
  if ((predHome - predAway) === (realHome - realAway)) return 2
  const predResult = predHome > predAway ? 1 : predHome < predAway ? 2 : 0
  const realResult = realHome > realAway ? 1 : realHome < realAway ? 2 : 0
  if (predResult === realResult) return 1
  return 0
}

export async function GET() {
  const round = await prisma.round.findFirst({
    where: { status: { in: ["OPEN", "LOCKED", "LIVE", "COMPLETED"] } },
    orderBy: { createdAt: "desc" }
  })
  if (!round) return NextResponse.json({ round: null, matches: [], rankings: [] })

  const matches = await prisma.match.findMany({
    where: { roundId: round.id },
    orderBy: { kickoffAt: "asc" }
  })

  const predictions = await prisma.prediction.findMany({
    where: { match: { roundId: round.id } },
    include: { user: { select: { id: true, name: true } } }
  })

  const userPoints: any = {}
  for (const pred of predictions) {
    if (!userPoints[pred.userId]) {
      userPoints[pred.userId] = { name: pred.user.name, confirmed: 0, live: 0, total: 0 }
    }
    const match = matches.find(m => m.id === pred.matchId)
    if (!match) continue

    if (match.status === "FINISHED" && match.finalHomeScore !== null && match.finalAwayScore !== null) {
      const base = calculeazaPuncte(pred.predictedHome, pred.predictedAway, match.finalHomeScore, match.finalAwayScore)
      const pts = base * (pred.isCaptain ? 2 : 1)
      userPoints[pred.userId].confirmed += pts
    } else if ((match.status === "LIVE" || match.status === "HALFTIME") && match.liveHomeScore !== null && match.liveAwayScore !== null) {
      const base = calculeazaPuncte(pred.predictedHome, pred.predictedAway, match.liveHomeScore, match.liveAwayScore)
      const pts = base * (pred.isCaptain ? 2 : 1)
      userPoints[pred.userId].live += pts
    }
  }

  const rankings = Object.entries(userPoints)
    .map(([userId, pts]: any) => ({ userId, name: pts.name, confirmed: pts.confirmed, live: pts.live, total: pts.confirmed + pts.live }))
    .sort((a, b) => b.total - a.total || b.confirmed - a.confirmed)
    .map((r, i) => ({ ...r, rank: i + 1 }))

  return NextResponse.json({ round, matches, rankings })
}