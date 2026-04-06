const fs = require('fs')

fs.mkdirSync('app/api/badges', { recursive: true })

const badgesApi = `import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
export const dynamic = "force-dynamic"

export const BADGES: any = {
  sniper: { icon: "🎯", name: "Sniper", desc: "3+ scoruri exacte intr-o etapa" },
  dominator: { icon: "👑", name: "Dominator", desc: "Locul 1 intr-o etapa" },
  capitan_aur: { icon: "⭐", name: "Capitan de Aur", desc: "Capitanul corect intr-o etapa" },
  all_in: { icon: "🎲", name: "All In", desc: "Toate meciurile prezise corect intr-o etapa" },
  on_fire: { icon: "🔥", name: "On Fire", desc: "Locul 1 in 3 etape consecutive" },
  constant: { icon: "🏃", name: "Constant", desc: "A jucat toate etapele sezonului" },
  perfect: { icon: "💎", name: "Perfect", desc: "Capitan corect 3 etape la rand" },
  campion: { icon: "🏆", name: "Campion", desc: "Locul 1 in clasamentul general" },
  lingura: { icon: "🥄", name: "Lingura de Lemn", desc: "Ultimul loc intr-o etapa" },
  ghinionist: { icon: "😅", name: "Ghinionist", desc: "0 puncte intr-o etapa" },
  etern_secund: { icon: "😤", name: "Etern Secund", desc: "Locul 2 in 3 etape consecutive" },
  aproape: { icon: "🥈", name: "Aproape", desc: "Locul 2 in clasamentul general" },
  podium: { icon: "🥉", name: "Podium", desc: "Locul 3 in clasamentul general" },
  veteranul: { icon: "🦕", name: "Veteranul", desc: "10+ etape jucate" },
  fidel: { icon: "📅", name: "Fidel", desc: "5 etape consecutive jucate" },
}

async function calculeazaBadges(userId: string) {
  const earned: string[] = []

  const rounds = await prisma.round.findMany({
    where: { status: "COMPLETED" },
    orderBy: { createdAt: "asc" }
  })

  const season = await prisma.season.findFirst({ where: { isActive: true } })

  // Badge-uri per etapa
  for (const round of rounds) {
    const ranking = await prisma.roundRanking.findUnique({
      where: { roundId_userId: { roundId: round.id, userId } }
    })
    if (!ranking) continue

    const allRankings = await prisma.roundRanking.findMany({
      where: { roundId: round.id },
      orderBy: { finalPoints: "desc" }
    })

    const totalPlayers = allRankings.length
    const myRank = ranking.rank || 0

    if (ranking.exactHits >= 3) earned.push("sniper")
    if (myRank === 1) earned.push("dominator")
    if (myRank === totalPlayers) earned.push("lingura")
    if ((ranking.finalPoints ?? 0) === 0) earned.push("ghinionist")
    if (ranking.captainPoints > 0) earned.push("capitan_aur")

    // All In - toate meciurile corecte
    const predictions = await prisma.prediction.findMany({
      where: { userId, match: { roundId: round.id } },
      include: { matchPoints: true }
    })
    const allCorrect = predictions.length > 0 && predictions.every(p => 
      p.matchPoints.some(mp => mp.basePoints > 0)
    )
    if (allCorrect) earned.push("all_in")
  }

  // On Fire - locul 1 in 3 consecutive
  let consecutiveFirst = 0
  let consecutiveSecond = 0
  let consecutivePlayed = 0
  let captainStreak = 0
  let totalPlayed = 0

  for (const round of rounds) {
    const ranking = await prisma.roundRanking.findUnique({
      where: { roundId_userId: { roundId: round.id, userId } }
    })
    if (ranking) {
      totalPlayed++
      consecutivePlayed++
      if (ranking.rank === 1) { consecutiveFirst++; consecutiveSecond = 0 }
      else if (ranking.rank === 2) { consecutiveSecond++; consecutiveFirst = 0 }
      else { consecutiveFirst = 0; consecutiveSecond = 0 }
      if (ranking.captainPoints > 0) captainStreak++
      else captainStreak = 0
    } else {
      consecutivePlayed = 0
      consecutiveFirst = 0
      consecutiveSecond = 0
      captainStreak = 0
    }

    if (consecutiveFirst >= 3) earned.push("on_fire")
    if (consecutiveSecond >= 3) earned.push("etern_secund")
    if (captainStreak >= 3) earned.push("perfect")
    if (consecutivePlayed >= 5) earned.push("fidel")
  }

  if (totalPlayed >= 10) earned.push("veteranul")
  if (totalPlayed === rounds.length && rounds.length > 0) earned.push("constant")

  // Clasament general
  if (season) {
    const overallRankings = await prisma.roundRanking.groupBy({
      by: ["userId"],
      where: { round: { seasonId: season.id, status: "COMPLETED" } },
      _sum: { finalPoints: true },
      orderBy: { _sum: { finalPoints: "desc" } }
    })

    const myPosition = overallRankings.findIndex(r => r.userId === userId) + 1
    if (myPosition === 1) earned.push("campion")
    if (myPosition === 2) earned.push("aproape")
    if (myPosition === 3) earned.push("podium")
  }

  return [...new Set(earned)]
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
  const userId = (session.user as any).id

  const earned = await calculeazaBadges(userId)
  return NextResponse.json({ earned, badges: BADGES })
}

export async function GET_ALL() {
  const users = await prisma.user.findMany({ select: { id: true, name: true } })
  const result: any = {}
  for (const user of users) {
    result[user.id] = await calculeazaBadges(user.id)
  }
  return NextResponse.json({ userBadges: result, badges: BADGES })
}`

fs.writeFileSync('app/api/badges/route.ts', badgesApi)

// API badges pentru toti userii
const badgesAllApi = `import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = "force-dynamic"

export const BADGES: any = {
  sniper: { icon: "🎯", name: "Sniper", desc: "3+ scoruri exacte intr-o etapa" },
  dominator: { icon: "👑", name: "Dominator", desc: "Locul 1 intr-o etapa" },
  capitan_aur: { icon: "⭐", name: "Capitan de Aur", desc: "Capitanul corect intr-o etapa" },
  all_in: { icon: "🎲", name: "All In", desc: "Toate meciurile prezise corect intr-o etapa" },
  on_fire: { icon: "🔥", name: "On Fire", desc: "Locul 1 in 3 etape consecutive" },
  constant: { icon: "🏃", name: "Constant", desc: "A jucat toate etapele sezonului" },
  perfect: { icon: "💎", name: "Perfect", desc: "Capitan corect 3 etape la rand" },
  campion: { icon: "🏆", name: "Campion", desc: "Locul 1 in clasamentul general" },
  lingura: { icon: "🥄", name: "Lingura de Lemn", desc: "Ultimul loc intr-o etapa" },
  ghinionist: { icon: "😅", name: "Ghinionist", desc: "0 puncte intr-o etapa" },
  etern_secund: { icon: "😤", name: "Etern Secund", desc: "Locul 2 in 3 etape consecutive" },
  aproape: { icon: "🥈", name: "Aproape", desc: "Locul 2 in clasamentul general" },
  podium: { icon: "🥉", name: "Podium", desc: "Locul 3 in clasamentul general" },
  veteranul: { icon: "🦕", name: "Veteranul", desc: "10+ etape jucate" },
  fidel: { icon: "📅", name: "Fidel", desc: "5 etape consecutive jucate" },
}

async function calculeazaBadgesUser(userId: string) {
  const earned: string[] = []
  const rounds = await prisma.round.findMany({
    where: { status: "COMPLETED" },
    orderBy: { createdAt: "asc" }
  })
  const season = await prisma.season.findFirst({ where: { isActive: true } })

  for (const round of rounds) {
    const ranking = await prisma.roundRanking.findUnique({
      where: { roundId_userId: { roundId: round.id, userId } }
    })
    if (!ranking) continue
    const allRankings = await prisma.roundRanking.findMany({
      where: { roundId: round.id },
      orderBy: { finalPoints: "desc" }
    })
    const totalPlayers = allRankings.length
    const myRank = ranking.rank || 0
    if (ranking.exactHits >= 3) earned.push("sniper")
    if (myRank === 1) earned.push("dominator")
    if (myRank === totalPlayers) earned.push("lingura")
    if ((ranking.finalPoints ?? 0) === 0) earned.push("ghinionist")
    if (ranking.captainPoints > 0) earned.push("capitan_aur")
    const predictions = await prisma.prediction.findMany({
      where: { userId, match: { roundId: round.id } },
      include: { matchPoints: true }
    })
    const allCorrect = predictions.length > 0 && predictions.every(p => p.matchPoints.some(mp => mp.basePoints > 0))
    if (allCorrect) earned.push("all_in")
  }

  let cf = 0, cs = 0, cp = 0, cc = 0, total = 0
  for (const round of rounds) {
    const ranking = await prisma.roundRanking.findUnique({ where: { roundId_userId: { roundId: round.id, userId } } })
    if (ranking) {
      total++; cc++
      if (ranking.rank === 1) { cf++; cs = 0 } else if (ranking.rank === 2) { cs++; cf = 0 } else { cf = 0; cs = 0 }
      if (ranking.captainPoints > 0) cp++; else cp = 0
    } else { cf = 0; cs = 0; cp = 0; cc = 0 }
    if (cf >= 3) earned.push("on_fire")
    if (cs >= 3) earned.push("etern_secund")
    if (cp >= 3) earned.push("perfect")
    if (cc >= 5) earned.push("fidel")
  }
  if (total >= 10) earned.push("veteranul")
  if (total === rounds.length && rounds.length > 0) earned.push("constant")

  if (season) {
    const overallRankings = await prisma.roundRanking.groupBy({
      by: ["userId"],
      where: { round: { seasonId: season.id, status: "COMPLETED" } },
      _sum: { finalPoints: true },
      orderBy: { _sum: { finalPoints: "desc" } }
    })
    const myPosition = overallRankings.findIndex(r => r.userId === userId) + 1
    if (myPosition === 1) earned.push("campion")
    if (myPosition === 2) earned.push("aproape")
    if (myPosition === 3) earned.push("podium")
  }
  return [...new Set(earned)]
}

export async function GET() {
  const users = await prisma.user.findMany({ select: { id: true, name: true } })
  const userBadges: any = {}
  for (const user of users) {
    userBadges[user.id] = await calculeazaBadgesUser(user.id)
  }
  return NextResponse.json({ userBadges, badges: BADGES })
}`

fs.mkdirSync('app/api/badges/all', { recursive: true })
fs.writeFileSync('app/api/badges/all/route.ts', badgesAllApi)
console.log('Gata!')