const fs = require('fs')

const content = `import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
  const myId = (session.user as any).id

  const { searchParams } = new URL(req.url)
  const opponentId = searchParams.get("opponentId")

  // Toti userii pentru dropdown
  const users = await prisma.user.findMany({
    where: { id: { not: myId }, isApproved: true },
    select: { id: true, name: true }
  })

  if (!opponentId) return NextResponse.json({ users, seasons: [] })

  // Toate sezoanele
  const seasons = await prisma.season.findMany({
    orderBy: { createdAt: "asc" }
  })

  // Toate etapele completate din toate sezoanele
  const rounds = await prisma.round.findMany({
    where: { status: "COMPLETED" },
    orderBy: { createdAt: "asc" },
    include: { season: true }
  })

  // Toate predictiile ambilor jucatori
  const allPredictions = await prisma.prediction.findMany({
    where: {
      userId: { in: [myId, opponentId] },
      match: { round: { status: "COMPLETED" } }
    },
    include: {
      match: { include: { round: { include: { season: true } } } },
      matchPoints: true
    }
  })

  // Grupam pe sezoane -> etape -> meciuri
  const seasonsData: any[] = []

  for (const season of seasons) {
    const seasonRounds = rounds.filter(r => r.seasonId === season.id)
    if (seasonRounds.length === 0) continue

    let seasonWins = 0
    let seasonDraws = 0
    let seasonLosses = 0
    const etapeData: any[] = []

    for (const round of seasonRounds) {
      const myPreds = allPredictions.filter(p => p.userId === myId && p.match.roundId === round.id)
      const oppPreds = allPredictions.filter(p => p.userId === opponentId && p.match.roundId === round.id)

      if (myPreds.length === 0 || oppPreds.length === 0) continue

      const myTotal = myPreds.reduce((sum, p) => sum + (p.matchPoints[0]?.totalPoints || 0), 0)
      const oppTotal = oppPreds.reduce((sum, p) => sum + (p.matchPoints[0]?.totalPoints || 0), 0)

      if (myTotal > oppTotal) seasonWins++
      else if (myTotal === oppTotal) seasonDraws++
      else seasonLosses++

      // Meciurile comune
      const matches = await prisma.match.findMany({
        where: { roundId: round.id },
        orderBy: { kickoffAt: "asc" }
      })

      const meciuriData = matches.map(match => {
        const myP = myPreds.find(p => p.matchId === match.id)
        const oppP = oppPreds.find(p => p.matchId === match.id)
        return {
          id: match.id,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          finalHomeScore: match.finalHomeScore,
          finalAwayScore: match.finalAwayScore,
          competitionName: match.competitionName,
          my: myP ? {
            home: myP.predictedHome,
            away: myP.predictedAway,
            isCaptain: myP.isCaptain,
            points: myP.matchPoints[0]?.totalPoints || 0,
            basePoints: myP.matchPoints[0]?.basePoints || 0,
          } : null,
          opp: oppP ? {
            home: oppP.predictedHome,
            away: oppP.predictedAway,
            isCaptain: oppP.isCaptain,
            points: oppP.matchPoints[0]?.totalPoints || 0,
            basePoints: oppP.matchPoints[0]?.basePoints || 0,
          } : null,
        }
      })

      etapeData.push({
        id: round.id,
        title: round.title,
        myTotal,
        oppTotal,
        winner: myTotal > oppTotal ? "me" : myTotal === oppTotal ? "draw" : "opp",
        meciuri: meciuriData
      })
    }

    if (etapeData.length === 0) continue

    seasonsData.push({
      id: season.id,
      name: season.name,
      wins: seasonWins,
      draws: seasonDraws,
      losses: seasonLosses,
      etape: etapeData
    })
  }

  const opponent = await prisma.user.findUnique({
    where: { id: opponentId },
    select: { id: true, name: true }
  })

  return NextResponse.json({ users, seasons: seasonsData, opponent })
}`

fs.mkdirSync('app/api/head-to-head', { recursive: true })
fs.writeFileSync('app/api/head-to-head/route.ts', content)
console.log('Gata API!')