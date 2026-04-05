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

async function syncFootballData() {
  const COMPETITIONS: any = {
    "Premier League": "PL",
    "La Liga": "PD", 
    "Serie A": "SA",
    "Bundesliga": "BL1",
    "Ligue 1": "FL1",
  }

  const matches = await prisma.match.findMany({
    where: { 
      status: { in: ["SCHEDULED", "LIVE", "HALFTIME"] },
      competitionName: { in: Object.keys(COMPETITIONS) }
    }
  })

  for (const match of matches) {
    const compCode = COMPETITIONS[match.competitionName]
    if (!compCode || !match.externalApiId) continue

    try {
      const res = await fetch(
        `https://api.football-data.org/v4/matches/${match.externalApiId}`,
        { headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY || "" } }
      )
      const data = await res.json()
      if (!data.score) continue

      const homeScore = data.score.fullTime?.home
      const awayScore = data.score.fullTime?.away
      const liveHome = data.score.fullTime?.home ?? data.score.regularTime?.home
      const liveAway = data.score.fullTime?.away ?? data.score.regularTime?.away

      let newStatus = match.status
      if (data.status === "FINISHED") newStatus = "FINISHED"
      else if (data.status === "IN_PLAY") newStatus = "LIVE"
      else if (data.status === "PAUSED") newStatus = "HALFTIME"
      else if (data.status === "TIMED" || data.status === "SCHEDULED") newStatus = "SCHEDULED"

      await prisma.match.update({
        where: { id: match.id },
        data: {
          status: newStatus,
          liveHomeScore: liveHome,
          liveAwayScore: liveAway,
          finalHomeScore: newStatus === "FINISHED" ? homeScore : null,
          finalAwayScore: newStatus === "FINISHED" ? awayScore : null,
          lastSyncedAt: new Date()
        }
      })
    } catch (err) {
      console.error("Eroare sync match:", match.id, err)
    }
  }
}

async function syncLiga1() {
  const matches = await prisma.match.findMany({
    where: { 
      status: { in: ["SCHEDULED", "LIVE", "HALFTIME"] },
      competitionName: "Liga 1 Romania"
    }
  })

  for (const match of matches) {
    if (!match.externalApiId) continue
    try {
      const res = await fetch(
        `https://sports.bzzoiro.com/api/events/${match.externalApiId}/`,
        { headers: { "Authorization": `Token ${process.env.BZZOIRO_API_KEY || ""}` } }
      )
      const data = await res.json()
      if (!data.id) continue

      let newStatus = match.status
      let liveHome = match.liveHomeScore
      let liveAway = match.liveAwayScore
      let finalHome = null
      let finalAway = null

      if (data.status === "finished") {
        newStatus = "FINISHED"
        finalHome = data.home_score
        finalAway = data.away_score
        liveHome = data.home_score
        liveAway = data.away_score
      } else if (data.status === "inprogress") {
        newStatus = "LIVE"
        liveHome = data.home_score
        liveAway = data.away_score
      }

      await prisma.match.update({
        where: { id: match.id },
        data: { status: newStatus, liveHomeScore: liveHome, liveAwayScore: liveAway, finalHomeScore: finalHome, finalAwayScore: finalAway, lastSyncedAt: new Date() }
      })
    } catch (err) {
      console.error("Eroare sync Liga1:", match.id, err)
    }
  }
}

async function calculeazaPuncteAutomat() {
  const finishedMatches = await prisma.match.findMany({
    where: { status: "FINISHED", finalHomeScore: { not: null } },
    include: { predictions: true }
  })

  for (const match of finishedMatches) {
    if (match.finalHomeScore === null || match.finalAwayScore === null) continue
    for (const pred of match.predictions) {
      const basePoints = calculeazaPuncte(pred.predictedHome, pred.predictedAway, match.finalHomeScore, match.finalAwayScore)
      const multiplier = pred.isCaptain ? 2 : 1
      const totalPoints = basePoints * multiplier
      await prisma.matchPoint.upsert({
        where: { predictionId_matchId: { predictionId: pred.id, matchId: match.id } },
        update: { basePoints, multiplier, totalPoints, isFinal: true, isLive: false, evaluatedAgainstHome: match.finalHomeScore, evaluatedAgainstAway: match.finalAwayScore, evaluatedAt: new Date() },
        create: { predictionId: pred.id, matchId: match.id, basePoints, multiplier, totalPoints, isFinal: true, isLive: false, evaluatedAgainstHome: match.finalHomeScore, evaluatedAgainstAway: match.finalAwayScore, evaluatedAt: new Date() }
      })
    }
  }
}

export async function GET() {
  try {
    await syncFootballData()
    await syncLiga1()
    await calculeazaPuncteProcesate()
    return NextResponse.json({ ok: true, message: "Sync complet" })
  } catch (err) {
    console.error("Eroare sync:", err)
    return NextResponse.json({ error: "Eroare sync" }, { status: 500 })
  }
}

async function calculeazaPuncteProcesate() {
  await calculeazaPuncteleAutomat()
}

async function calculeazaPuncteleAutomat() {
  await calculeazaPuncteleAuto()
}

async function calculeazaPuncteleAuto() {
  await calculeazaPuncteleFinale()
}

async function calculeazaPuncteleFinale() {
  await calculeazaPuncteAutomat()
}