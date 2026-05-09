import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

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
    "Champions League": "CL",
  }

  const matches = await prisma.match.findMany({
    where: {
      status: { in: ["SCHEDULED", "LIVE", "HALFTIME"] },
      competitionName: { in: Object.keys(COMPETITIONS) }
    }
  })

  if (matches.length === 0) return

  const ids = matches.map(m => m.externalApiId).filter(Boolean).join(",")

  try {
    const res = await fetch(
      `https://api.football-data.org/v4/matches?ids=${ids}`,
      { headers: { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY || "" } }
    )
    const data = await res.json()
    if (!data.matches) return

    for (const apiMatch of data.matches) {
      const match = matches.find(m => m.externalApiId === String(apiMatch.id))
      if (!match) continue

      let newStatus = match.status
      if (apiMatch.status === "FINISHED") newStatus = "FINISHED"
      else if (apiMatch.status === "IN_PLAY") newStatus = "LIVE"
      else if (apiMatch.status === "PAUSED") newStatus = "HALFTIME"
      else if (apiMatch.status === "TIMED" || apiMatch.status === "SCHEDULED") newStatus = "SCHEDULED"

      const isFinished = newStatus === "FINISHED"

      await prisma.match.update({
        where: { id: match.id },
        data: {
          status: newStatus,
          liveHomeScore: !isFinished ? (apiMatch.score.fullTime?.home ?? null) : null,
          liveAwayScore: !isFinished ? (apiMatch.score.fullTime?.away ?? null) : null,
          finalHomeScore: isFinished ? apiMatch.score.fullTime?.home : null,
          finalAwayScore: isFinished ? apiMatch.score.fullTime?.away : null,
          lastSyncedAt: new Date()
        }
      })
    }
  } catch (err) {
    console.error("Eroare sync football-data:", err)
  }
}

async function syncLiga1() {
  const matches = await prisma.match.findMany({
    where: {
      status: { in: ["SCHEDULED", "LIVE", "HALFTIME"] },
      competitionName: "Liga 1 Romania"
    }
  })

  if (matches.length === 0) return

  await Promise.all(matches.map(async (match) => {
    if (!match.externalApiId) return
    try {
      const res = await fetch(
        `https://sports.bzzoiro.com/api/events/${match.externalApiId}/`,
        { headers: { "Authorization": `Token ${process.env.BZZOIRO_API_KEY || ""}` } }
      )
      const data = await res.json()
      if (!data.id) return

      let newStatus = match.status
      let liveHome = match.liveHomeScore
      let liveAway = match.liveAwayScore
      let finalHome = null
      let finalAway = null

      if (data.status === "finished") {
        newStatus = "FINISHED"
        finalHome = data.home_score
        finalAway = data.away_score
        liveHome = null
        liveAway = null
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
  }))
}

export async function GET() {
  try {
    await autoLockEtape()
    await syncFootballData()
    await syncLiga1()
    return NextResponse.json({ ok: true, message: "Sync scoruri complet" })
  } catch (err: any) {
    console.error("Eroare sync:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

async function autoLockEtape() {
  const rounds = await prisma.round.findMany({ where: { status: "OPEN" } })
  for (const round of rounds) {
    if (new Date() > new Date(round.deadlineAt)) {
      await prisma.round.update({ where: { id: round.id }, data: { status: "LOCKED" } })
    }
  }
}
