import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
export const dynamic = "force-dynamic"

export const BADGES: any = {
  sniper: { icon: "🎯", name: "Sniper", desc: "3+ scoruri exacte intr-o etapa", permanent: true },
  dominator: { icon: "👑", name: "Dominator", desc: "Locul 1 intr-o etapa", permanent: true },
  capitan_aur: { icon: "⭐", name: "Capitan de Aur", desc: "Scor exact la meciul capitan (10 pct)", permanent: true },
  all_in: { icon: "🎲", name: "All In", desc: "Toate meciurile prezise corect intr-o etapa", permanent: true },
  ghinionist: { icon: "😅", name: "Ghinionist", desc: "0 puncte intr-o etapa", permanent: true },
  lingura: { icon: "🥄", name: "Lingura de Lemn", desc: "Ultimul loc intr-o etapa", permanent: true },
  on_fire: { icon: "🔥", name: "On Fire", desc: "Locul 1 in 3 etape consecutive", permanent: false },
  campion: { icon: "🏆", name: "Campion", desc: "Locul 1 in clasamentul general", permanent: false },
  aproape: { icon: "🥈", name: "Aproape", desc: "Locul 2 in clasamentul general", permanent: false },
  podium: { icon: "🥉", name: "Podium", desc: "Locul 3 in clasamentul general", permanent: false },
  constant: { icon: "🏃", name: "Constant", desc: "A jucat toate etapele sezonului", permanent: false },
  fidel: { icon: "📅", name: "Fidel", desc: "5 etape consecutive jucate", permanent: false },
  veteranul: { icon: "🦕", name: "Veteranul", desc: "10+ etape jucate", permanent: false },
  perfect: { icon: "💎", name: "Perfect", desc: "Capitan corect 3 etape la rand", permanent: false },
  etern_secund: { icon: "😤", name: "Etern Secund", desc: "Locul 2 in 3 etape consecutive", permanent: false },
}

export async function calculeazaSiSalveazaBadges(userId: string) {
  const permanent: string[] = []
  const dynamic: string[] = []

  const rounds = await prisma.round.findMany({
    where: { status: "COMPLETED" },
    orderBy: { createdAt: "asc" }
  })
  const season = await prisma.season.findFirst({ where: { isActive: true } })

  // Badge-uri permanente per etapa
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

    if (ranking.exactHits >= 3) permanent.push("sniper")
    if (myRank === 1) permanent.push("dominator")
    if (myRank === totalPlayers) permanent.push("lingura")
    if ((ranking.finalPoints ?? 0) === 0) permanent.push("ghinionist")

    // Capitan de aur - scor exact la capitan = 10 pct
    if (ranking.captainPoints >= 10) permanent.push("capitan_aur")

    // All In
    const predictions = await prisma.prediction.findMany({
      where: { userId, match: { roundId: round.id } },
      include: { matchPoints: true }
    })
    const allCorrect = predictions.length > 0 && predictions.every(p => p.matchPoints.some(mp => mp.basePoints > 0))
    if (allCorrect) permanent.push("all_in")
  }

  // Salveaza badge-uri permanente in DB
  for (const badge of [...new Set(permanent)]) {
    await prisma.userBadge.upsert({
      where: { userId_badge: { userId, badge } },
      update: {},
      create: { id: `${userId}_${badge}`, userId, badge }
    })
  }

  // Citeste badge-urile permanente salvate
  const savedPermanent = await prisma.userBadge.findMany({ where: { userId } })
  const permanentBadges = savedPermanent.map(b => b.badge)

  // Badge-uri dinamice - recalculate mereu
  let cf = 0, cs = 0, cp = 0, cc = 0, total = 0
  for (const round of rounds) {
    const ranking = await prisma.roundRanking.findUnique({ where: { roundId_userId: { roundId: round.id, userId } } })
    if (ranking) {
      total++; cc++
      if (ranking.rank === 1) { cf++; cs = 0 } else if (ranking.rank === 2) { cs++; cf = 0 } else { cf = 0; cs = 0 }
      if (ranking.captainPoints >= 10) cp++; else cp = 0
    } else { cf = 0; cs = 0; cp = 0; cc = 0 }
    if (cf >= 3) dynamic.push("on_fire")
    if (cs >= 3) dynamic.push("etern_secund")
    if (cp >= 3) dynamic.push("perfect")
    if (cc >= 5) dynamic.push("fidel")
  }
  if (total >= 10) dynamic.push("veteranul")
  if (total === rounds.length && rounds.length > 0) dynamic.push("constant")

  if (season) {
    const completedRounds = await prisma.round.findMany({
      where: { seasonId: season.id, status: "COMPLETED" }
    })
    const roundIds = completedRounds.map(r => r.id)
    
    const allRankings = await prisma.roundRanking.findMany({
      where: { roundId: { in: roundIds } },
      include: { user: { select: { id: true } } }
    })

    const userStats: any = {}
    for (const rr of allRankings) {
      if (!userStats[rr.userId]) userStats[rr.userId] = { wins: 0, total: 0, exact: 0, diff: 0, result: 0, captain10: 0 }
      userStats[rr.userId].total += rr.finalPoints ?? 0
      userStats[rr.userId].exact += rr.exactHits
      userStats[rr.userId].diff += rr.goalDiffHits
      userStats[rr.userId].result += rr.resultHits
      if (rr.rank === 1) userStats[rr.userId].wins++
      if (rr.captainPoints >= 10) userStats[rr.userId].captain10++
    }

    const sorted = Object.entries(userStats)
      .sort(([, a]: any, [, b]: any) => 
        b.wins - a.wins || b.total - a.total || b.exact - a.exact || b.diff - a.diff || b.result - a.result
      )
      .map(([uid]) => uid)

    const myPosition = sorted.indexOf(userId) + 1
    if (myPosition === 1) dynamic.push("campion")
    if (myPosition === 2) dynamic.push("aproape")
    if (myPosition === 3) dynamic.push("podium")
  }

  const allEarned = [...new Set([...permanentBadges, ...dynamic])]
  return allEarned
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Neautentificat" }, { status: 401 })
  const userId = (session.user as any).id

  const earned = await calculeazaSiSalveazaBadges(userId)
  return NextResponse.json({ earned, badges: BADGES })
}