const fs = require('fs')

fs.mkdirSync('app/api/admin/calcul-puncte', { recursive: true })

const content = `import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
export const dynamic = "force-dynamic"
const prisma = new PrismaClient()

function calculeazaPuncte(predHome: number, predAway: number, realHome: number, realAway: number): number {
  // Scor exact
  if (predHome === realHome && predAway === realAway) return 5

  // Diferenta corecta
  if ((predHome - predAway) === (realHome - realAway)) return 2

  // Rezultat corect (1/X/2)
  const predResult = predHome > predAway ? 1 : predHome < predAway ? 2 : 0
  const realResult = realHome > realAway ? 1 : realHome < realAway ? 2 : 0
  if (predResult === realResult) return 1

  return 0
}

export async function POST(req: NextRequest) {
  const { roundId } = await req.json()

  const round = await prisma.round.findUnique({ where: { id: roundId } })
  if (!round) return NextResponse.json({ error: "Etapa negasita" }, { status: 404 })

  const matches = await prisma.match.findMany({
    where: { roundId, status: "FINISHED" },
    include: { predictions: true }
  })

  let totalCalculated = 0

  for (const match of matches) {
    if (match.finalHomeScore === null || match.finalAwayScore === null) continue

    for (const pred of match.predictions) {
      const basePoints = calculeazaPuncte(
        pred.predictedHome,
        pred.predictedAway,
        match.finalHomeScore,
        match.finalAwayScore
      )
      const multiplier = pred.isCaptain ? 2 : 1
      const totalPoints = basePoints * multiplier

      await prisma.matchPoint.upsert({
        where: { predictionId_matchId: { predictionId: pred.id, matchId: match.id } },
        update: { basePoints, multiplier, totalPoints, isFinal: true, isLive: false, evaluatedAgainstHome: match.finalHomeScore, evaluatedAgainstAway: match.finalAwayScore, evaluatedAt: new Date() },
        create: { predictionId: pred.id, matchId: match.id, basePoints, multiplier, totalPoints, isFinal: true, isLive: false, evaluatedAgainstHome: match.finalHomeScore, evaluatedAgainstAway: match.finalAwayScore, evaluatedAt: new Date() }
      })
      totalCalculated++
    }
  }

  // Recalculeaza clasament etapa
  const allPredictions = await prisma.prediction.findMany({
    where: { match: { roundId } },
    include: { matchPoints: true }
  })

  const userPoints: any = {}
  for (const pred of allPredictions) {
    if (!userPoints[pred.userId]) {
      userPoints[pred.userId] = { confirmed: 0, exact: 0, diff: 0, result: 0, captain: 0 }
    }
    for (const mp of pred.matchPoints) {
      if (mp.isFinal) {
        userPoints[pred.userId].confirmed += mp.totalPoints
        if (mp.basePoints === 5) userPoints[pred.userId].exact++
        else if (mp.basePoints === 2) userPoints[pred.userId].diff++
        else if (mp.basePoints === 1) userPoints[pred.userId].result++
        if (pred.isCaptain) userPoints[pred.userId].captain += mp.totalPoints
      }
    }
  }

  for (const [userId, pts] of Object.entries(userPoints) as any) {
    await prisma.roundRanking.upsert({
      where: { roundId_userId: { roundId, userId } },
      update: { confirmedPoints: pts.confirmed, finalPoints: pts.confirmed, exactHits: pts.exact, goalDiffHits: pts.diff, resultHits: pts.result, captainPoints: pts.captain },
      create: { roundId, userId, confirmedPoints: pts.confirmed, finalPoints: pts.confirmed, exactHits: pts.exact, goalDiffHits: pts.diff, resultHits: pts.result, captainPoints: pts.captain }
    })
  }

  // Sorteaza si seteaza rank
  const rankings = await prisma.roundRanking.findMany({ where: { roundId }, orderBy: [{ finalPoints: "desc" }, { exactHits: "desc" }, { goalDiffHits: "desc" }] })
  for (let i = 0; i < rankings.length; i++) {
    await prisma.roundRanking.update({ where: { id: rankings[i].id }, data: { rank: i + 1 } })
  }

  return NextResponse.json({ ok: true, totalCalculated })
}`

fs.writeFileSync('app/api/admin/calcul-puncte/route.ts', content)
console.log('Gata!')