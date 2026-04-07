const fs = require('fs')

const content = `import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
export const dynamic = "force-dynamic"

function calculeazaPuncte(predHome: number, predAway: number, realHome: number, realAway: number): number {
  if (predHome === realHome && predAway === realAway) return 5
  if ((predHome - predAway) === (realHome - realAway)) return 2
  const predResult = predHome > predAway ? 1 : predHome < predAway ? 2 : 0
  const realResult = realHome > realAway ? 1 : realHome < realAway ? 2 : 0
  if (predResult === realResult) return 1
  return 0
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const myId = (session?.user as any)?.id

    const round = await prisma.round.findFirst({
      where: { status: { in: ["LOCKED", "LIVE", "COMPLETED"] } },
      orderBy: { createdAt: "desc" }
    })
    if (!round) return NextResponse.json({ round: null, matches: [], rankings: [], matchPredictions: {}, matchStats: {} })

    const matches = await prisma.match.findMany({
      where: { roundId: round.id },
      orderBy: { kickoffAt: "asc" }
    })

    const predictions = await prisma.prediction.findMany({
      where: { match: { roundId: round.id } },
      include: { user: { select: { id: true, name: true } } }
    })

    const userPoints: any = {}
    const matchPredictions: any = {}
    const matchStats: any = {}

    for (const pred of predictions) {
      if (!userPoints[pred.userId]) {
        userPoints[pred.userId] = { name: pred.user.name, confirmed: 0, live: 0 }
      }
      if (!matchPredictions[pred.matchId]) matchPredictions[pred.matchId] = []
      matchPredictions[pred.matchId].push({
        userName: pred.user.name,
        home: pred.predictedHome,
        away: pred.predictedAway,
        isCaptain: pred.isCaptain,
        isMe: pred.userId === myId
      })

      const match = matches.find(m => m.id === pred.matchId)
      if (!match) continue

      if (match.status === "FINISHED" && match.finalHomeScore !== null && match.finalAwayScore !== null) {
        const base = calculeazaPuncte(pred.predictedHome, pred.predictedAway, match.finalHomeScore, match.finalAwayScore)
        userPoints[pred.userId].confirmed += base * (pred.isCaptain ? 2 : 1)
      } else if ((match.status === "LIVE" || match.status === "HALFTIME") && match.liveHomeScore !== null && match.liveAwayScore !== null) {
        const base = calculeazaPuncte(pred.predictedHome, pred.predictedAway, match.liveHomeScore, match.liveAwayScore)
        userPoints[pred.userId].live += base * (pred.isCaptain ? 2 : 1)
      }
    }

    for (const match of matches) {
      const preds = predictions.filter(p => p.matchId === match.id)
      if (preds.length === 0) continue
      let homeWin = 0, draw = 0, awayWin = 0
      for (const pred of preds) {
        if (pred.predictedHome > pred.predictedAway) homeWin++
        else if (pred.predictedHome === pred.predictedAway) draw++
        else awayWin++
      }
      const total = preds.length
      matchStats[match.id] = {
        total, homeWin, draw, awayWin,
        homeWinPct: Math.round(homeWin / total * 100),
        drawPct: Math.round(draw / total * 100),
        awayWinPct: Math.round(awayWin / total * 100),
      }
    }

    const rankings = Object.entries(userPoints)
      .map(([userId, pts]: any) => ({ userId, name: pts.name, confirmed: pts.confirmed, live: pts.live, total: pts.confirmed + pts.live }))
      .sort((a, b) => b.total - a.total || b.confirmed - a.confirmed)
      .map((r, i) => ({ ...r, rank: i + 1 }))

    return NextResponse.json({ round, matches, rankings, matchPredictions, matchStats })
  } catch (err: any) {
    console.error("Eroare live API:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}`

fs.writeFileSync('app/api/live/route.ts', content)
console.log('Gata!')