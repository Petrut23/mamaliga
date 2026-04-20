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

async function calculeazaToatePunctele() {
  const finishedMatches = await prisma.match.findMany({
    where: { status: "FINISHED", finalHomeScore: { not: null }, finalAwayScore: { not: null } },
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

  const rounds = await prisma.round.findMany({
    where: { status: { in: ["LIVE", "LOCKED", "COMPLETED"] } }
  })

  for (const round of rounds) {
    const predictions = await prisma.prediction.findMany({
      where: { match: { roundId: round.id } },
      include: { matchPoints: true }
    })

    const userPoints: any = {}
    for (const pred of predictions) {
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
        where: { roundId_userId: { roundId: round.id, userId } },
        update: { confirmedPoints: pts.confirmed, finalPoints: pts.confirmed, exactHits: pts.exact, goalDiffHits: pts.diff, resultHits: pts.result, captainPoints: pts.captain },
        create: { roundId: round.id, userId, confirmedPoints: pts.confirmed, finalPoints: pts.confirmed, exactHits: pts.exact, goalDiffHits: pts.diff, resultHits: pts.result, captainPoints: pts.captain }
      })
    }

    const rankings = await prisma.roundRanking.findMany({
      where: { roundId: round.id },
      orderBy: [{ finalPoints: "desc" }, { exactHits: "desc" }, { goalDiffHits: "desc" }]
    })
    for (let i = 0; i < rankings.length; i++) {
      await prisma.roundRanking.update({ where: { id: rankings[i].id }, data: { rank: i + 1 } })
    }
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

async function autoCompleteEtape() {
  const rounds = await prisma.round.findMany({
    where: { status: { in: ["LOCKED", "LIVE"] } }
  })

  for (const round of rounds) {
    const matches = await prisma.match.findMany({ where: { roundId: round.id } })
    if (matches.length === 0) continue
    const allFinished = matches.every(m => m.status === "FINISHED")
    if (allFinished) {
      await prisma.round.update({ where: { id: round.id }, data: { status: "COMPLETED" } })
      await sendDiscordPodium(round.id, round.title)
    }
  }
}

async function sendDiscordPodium(roundId: string, roundTitle: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL
  if (!webhookUrl) return

  const rankings = await prisma.roundRanking.findMany({
    where: { roundId },
    orderBy: [{ finalPoints: "desc" }, { exactHits: "desc" }],
    include: { user: { select: { name: true, id: true } } }
  })
  if (rankings.length === 0) return

  const BADGE_MAP: any = {
    sniper: "🎯 Sniper", dominator: "👑 Dominator", capitan_aur: "⭐ Căpitan de Aur",
    all_in: "🎲 All In", on_fire: "🔥 On Fire", constant: "🏃 Constant",
    perfect: "💎 Perfect", campion: "🏆 Campion", lingura: "🥄 Lingura de Lemn",
    ghinionist: "😅 Ghinionist", etern_secund: "😤 Etern Secund",
    aproape: "🥈 Aproape", podium: "🥉 Podium", veteranul: "🦕 Veteranul", fidel: "📅 Fidel",
  }

  const userIds = rankings.map(r => r.user.id)
  const roundStart = await prisma.roundRanking.findFirst({ 
    where: { roundId }, 
    orderBy: { createdAt: "asc" },
    select: { createdAt: true } 
  })

  const allBadges = await prisma.$queryRawUnsafe(
    `SELECT "userId", "badge" FROM "UserBadge" WHERE "userId" = ANY($1) AND "earnedAt" >= $2`,
    userIds,
    roundStart?.createdAt || new Date()
  ) as any[]

  const userBadges: any = {}
  for (const b of allBadges) {
    if (!userBadges[b.userId]) userBadges[b.userId] = []
    userBadges[b.userId].push(BADGE_MAP[b.badge] || b.badge)
  }

  const medals = ["🥇", "🥈", "🥉"]
  
  const clasamentText = rankings.map((r, i) => {
    const medal = medals[i] || `${i + 1}.`
    return `${medal} **${r.user.name}** — ${r.finalPoints ?? 0} pct (⚽ ${r.exactHits} exacte)`
  }).join("\n")

  const badgeSection = rankings
    .filter(r => userBadges[r.user.id]?.length > 0)
    .map(r => `**${r.user.name}**: ${userBadges[r.user.id].join(" ")}`)
    .join("\n")

  const fields: any[] = []
  
  if (badgeSection) {
    fields.push({
      name: "🏅 Badge-uri câștigate",
      value: badgeSection,
      inline: false
    })
  }

  fields.push({
    name: "📊 Vezi clasamentul complet",
    value: "[Intră pe MamaLIGA](https://mamaliga.vercel.app/clasament)",
    inline: false
  })

  const message = {
    embeds: [{
      title: `🏆 ${roundTitle} s-a încheiat!`,
      description: `**Clasament etapă:**\n\n${clasamentText}`,
      color: 0xe8ff47,
      fields,
      footer: { text: "MamaLIGA — Jocul de predicții al grupului" }
    }]
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    })
    console.log("Discord podium trimis")
  } catch (err) {
    console.error("Eroare Discord podium:", err)
  }

  // Trimite clasamentul general
  try {
    const season = await prisma.season.findFirst({ where: { isActive: true } })
    if (!season) return

    const allRounds = await prisma.round.findMany({
      where: { seasonId: season.id, status: "COMPLETED" }
    })
    const allRoundIds = allRounds.map(r => r.id)

    const historicRankings = await prisma.$queryRaw`
      SELECT hr.*, u.name, u.id as "userId"
      FROM "HistoricRanking" hr
      JOIN "User" u ON hr."userId" = u.id
    ` as any[]

    const allRoundRankings = await prisma.roundRanking.findMany({
      where: { roundId: { in: allRoundIds } },
      include: { user: { select: { id: true, name: true } } }
    })

    const userStats: any = {}

    for (const h of historicRankings) {
      userStats[h.userId] = {
        name: h.name,
        total: Number(h.totalPoints),
        rounds: Number(h.roundsPlayed),
        wins: Number(h.roundsWon),
        bestWeek: Number(h.bestRound),
      }
    }

    for (const rr of allRoundRankings) {
      if (!userStats[rr.userId]) {
        userStats[rr.userId] = { name: rr.user.name, total: 0, rounds: 0, wins: 0, bestWeek: 0 }
      }
      const pts = rr.finalPoints ?? 0
      userStats[rr.userId].total += pts
      userStats[rr.userId].rounds += 1
      if (rr.rank === 1) userStats[rr.userId].wins += 1
      if (pts > userStats[rr.userId].bestWeek) userStats[rr.userId].bestWeek = pts
    }

    const sorted = Object.entries(userStats)
      .map(([userId, s]: any) => ({
        userId, name: s.name, total: s.total, rounds: s.rounds, wins: s.wins,
        average: s.rounds > 0 ? Math.round((s.total / s.rounds) * 10) / 10 : 0,
        bestWeek: s.bestWeek
      }))
      .sort((a, b) => b.wins - a.wins || b.total - a.total || b.bestWeek - a.bestWeek)

    const medals2 = ["🥇", "🥈", "🥉"]
    const generalText = sorted.map((r, i) => {
      const medal = medals2[i] || `${i + 1}.`
      return `${medal} **${r.name}** — ${r.wins} câștigate | ${r.total} pct | avg ${r.average}`
    }).join("\n")

    const generalMessage = {
      embeds: [{
        title: `📊 Clasament General după ${roundTitle}`,
        description: generalText,
        color: 0x3b82f6,
        footer: { text: "MamaLIGA — Jocul de predicții al grupului" }
      }]
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(generalMessage)
    })
    console.log("Discord clasament general trimis")
  } catch (err) {
    console.error("Eroare Discord clasament general:", err)
  }
}


export async function GET() {
  try {
    await autoLockEtape()
    await syncFootballData()
    await syncLiga1()
    await calculeazaToatePunctele()
    await autoCompleteEtape()
    return NextResponse.json({ ok: true, message: "Sync complet" })
  } catch (err: any) {
    console.error("Eroare sync:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}